# VeloxiLector ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-blue)](https://reactjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-00c7b7)](https://vercel.com/)

**VeloxiLector** is a browser-based Rapid Serial Visual Presentation (RSVP) reader. It takes plain text or PDF input and presents it one word at a time at a controllable pace, with an adaptive timing model and pivot-letter highlighting designed to reduce the eye movement normally required during reading.

**[Live demo](https://veloxilector.vercel.app)**

---

## Background

Skilled readers average somewhere between 200 and 400 words per minute, a rate governed less by how fast the eyes can move than by the time needed to recognize words and integrate their meaning into a sentence. RSVP-based tools attempt to work around the usual mechanics of reading, specifically the saccades (jumps) and fixations (pauses) the eyes make across a line of text, by removing the need to move the eyes at all. Each word is instead delivered to a single fixed point on the screen in sequence.

VeloxiLector implements this technique with a pivot-letter highlight positioned near each word's optical center, an approach popularized by commercial RSVP readers such as Spritz. The project began as a hands-on exploration of how presentation format and pacing affect reading behavior, a question with some resonance to my broader research interest in how exposure conditions shape language processing and second language acquisition.

It is worth being direct about what the evidence actually says, rather than letting the framing above oversell it. Rayner, Schotter, Masson, Potter, and Treiman's (2016) review for *Psychological Science in the Public Interest* found that one-word RSVP displays eliminate parafoveal preview, the benefit readers normally get from picking up partial information about the next word before fixating on it directly, and that comprehension reliably declines once presentation speed is pushed beyond a reader's natural pace. VeloxiLector is best understood as a tool for experimenting with these presentation techniques and for personal reading practice, not as a validated pedagogical intervention or a method shown to increase reading speed without a comprehension cost.

## How It Works

- **RSVP core**: input text is tokenized and displayed one word at a time inside a fixed reading window.
- **Pivot highlighting**: each word is split around a calculated central letter, which is visually emphasized as a fixation anchor.
- **Adaptive Reading Engine**: per-word display duration is extended based on word length and the presence of terminal punctuation, loosely approximating the pauses skilled readers make at clause and sentence boundaries.
- **Focus Mode**: strips surrounding interface elements to reduce visual competition for attention during a session.
- **Click-to-jump**: clicking any word in the source text repositions the reader at that point.
- **File ingestion**: accepts `.txt` files directly and `.pdf` files via client-side parsing with `pdf.js`.
- **Adjustable pacing**: 100 to 800 WPM via slider, independent of the adaptive engine.

## Features

- Upload `.txt` or `.pdf` files for word-by-word reading
- Adaptive Reading Engine that adjusts speed based on word length and punctuation
- Focus Mode for distraction-free reading
- Click any word to start reading from that point
- Text selection for targeted reading of a chosen excerpt
- Customizable Words Per Minute (WPM) via slider or manual input
- Three visual themes (Osaka Jade, Tokyo Night, Neo Dark)
- Keyboard controls for Play / Pause / Reset
- Live progress bar and word highlighting

## Tech Stack

- **React.js** for the interface
- **pdfjs-dist** for client-side PDF text extraction
- **Vercel** for deployment

## Installation

```bash
git clone https://github.com/vijithvaratharajan/veloxilector.git
cd veloxilector
npm install
npm start
```

The app runs locally at `http://localhost:3000`.

## Usage

1. Paste text directly, or upload a `.txt` / `.pdf` file.
2. Set a target WPM, or toggle the Adaptive Reading Engine to let pacing respond to word length and punctuation automatically.
3. Press Play. Use Focus Mode to remove surrounding interface elements during a session.
4. Click any word in the source view to jump the reader to that position.
5. Select a portion of the source text and press "Read Selection" to read only that excerpt.

## Roadmap

Ideas under consideration, not commitments:

- An optional comprehension check after a reading session, so speed and comprehension trade-offs are visible to the user rather than assumed away
- Session history and basic reading analytics (WPM over time, session length)
- Export of reading session data for personal tracking

## Reference

Rayner, K., Schotter, E. R., Masson, M. E. J., Potter, M. C., & Treiman, R. (2016). So much to read, so little time: How do we read, and can speed reading help? *Psychological Science in the Public Interest, 17*(1), 4-34. https://doi.org/10.1177/1529100615623267

## License

MIT
