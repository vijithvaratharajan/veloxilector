import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default function App() {
  const [text, setText] = useState("");
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("Ready?");
  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adaptive, setAdaptive] = useState(false);
  const [theme, setTheme] = useState("osaka");
  const [focusMode, setFocusMode] = useState(false);

  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const wordRefs = useRef([]);
  const timerRef = useRef(null);

  const processText = (inputText) => {
    let cleaned = inputText.replace(/\n/g, " ").trim();
    const splitWords = cleaned.match(/\b[\w'-]+[.,!?;:]?|[.,!?;:]/g) || [];
    setWords(splitWords);
    setIndex(0);
    setCurrentWord(splitWords[0] || "No text");
    wordRefs.current = [];
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    processText(value);
  };

  const processSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    if (selected.trim()) processText(selected);
  };

  const getDelay = useCallback((word) => {
  let base = 60000 / wpm;

  if (adaptive) {
    const lengthFactor = Math.min(word.length / 5, 2);
    const punctuationFactor = /[.,!?]/.test(word) ? 2 : 1;
    base *= lengthFactor * punctuationFactor;
  }

  return base;
}, [wpm, adaptive]);

  useEffect(() => {
    if (!isPlaying) return;

    const run = () => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= words.length) {
          setIsPlaying(false);
          return prev;
        }
        setCurrentWord(words[next]);
        return next;
      });

      timerRef.current = setTimeout(run, getDelay(words[index] || ""));
    };

    timerRef.current = setTimeout(run, getDelay(words[index] || ""));
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, index, words, getDelay]);

  useEffect(() => {
    if (!previewRef.current || !wordRefs.current[index]) return;

    wordRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [index]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          fullText += strings.join(" ") + " ";
        }

        setText(fullText);
        processText(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setText(content);
        processText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleWordClick = (i) => {
    setIndex(i);
    setCurrentWord(words[i]);
  };

  const renderWord = (word) => {
    if (!word) return "";
    const pivot = Math.floor(word.length / 2);
    return (
      <span className="word-animate">
        <span>{word.slice(0, pivot)}</span>
        <span className="highlight">{word[pivot]}</span>
        <span>{word.slice(pivot + 1)}</span>
      </span>
    );
  };

  const progress = words.length
  ? Math.round(((index + 1) / words.length) * 100)
  : 0;

  return (
    <div className={`app ${theme} ${focusMode ? "focus" : ""}`}>
      <div className="card">
        <h1 className="title">VeloxiLector</h1>

        {!isPlaying && !focusMode && (
          <>
            <textarea
              ref={textareaRef}
              className="textarea"
              value={text}
              onChange={handleTextChange}
              placeholder="Paste text or upload file..."
            />

            <div className="top-controls">
              <label className="file-label">
                Upload
                <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} hidden />
              </label>

              <button className="btn" onClick={processSelection}>
                Read Selection
              </button>

              <select
                className="theme-dropdown"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="osaka">Osaka Jade</option>
                <option value="tokyo">Tokyo Night</option>
                <option value="kyoto">Kyoto Mist</option>
                <option value="neo">Neo Dark</option>
              </select>
            </div>
          </>
        )}

        {isPlaying && !focusMode && (
          <div className="text-preview" ref={previewRef}>
            {words.map((w, i) => (
              <span
                key={i}
                ref={(el) => (wordRefs.current[i] = el)}
                className={i === index ? "active-word" : ""}
                onClick={() => handleWordClick(i)}
              >
                {w + " "}
              </span>
            ))}
          </div>
        )}

        <div className="reader-box">{renderWord(currentWord)}</div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">
          {progress}% • Word {index + 1} of {words.length}
        </p>

        <div className="controls spaced">
          <button className="btn primary" onClick={() => setIsPlaying((p) => !p)}>
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button className="btn" onClick={() => setAdaptive((a) => !a)}>
            {adaptive
              ? "Turn OFF Adaptive Reading Engine"
              : "Turn ON Adaptive Reading Engine"}
          </button>

          <button className="btn" onClick={() => setFocusMode((f) => !f)}>
            {focusMode ? "Exit Focus" : "Focus Mode"}
          </button>
        </div>

        <div className="wpm-control">
          <label>Speed: {wpm} WPM</label>
          <input
            type="range"
            min="100"
            max="800"
            value={wpm}
            onChange={(e) => setWpm(+e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
