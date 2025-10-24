# Lassi Emotions — Interactive Demo

Open `index.html` in a browser to run the demo. It shows a stylized glass of lassi that reacts to selected emotions with many animations, colors, and particle effects.

Files:
- `index.html` — main single-page app
- `styles.css` — animation and visual styles for 40+ emotions
- `script.js` — UI wiring and particle effects

How to run:
1. Open the folder in a browser or a simple static server. On Windows you can right-click `index.html` -> Open with -> Browser.
2. Click an emotion in the left panel or use Random / Reset.

Notes:
- This is a lightweight single-page demo using SVG + CSS + JS. No build step required.
- If you want to add more emotions: add a CSS class `.emotion-yourname` with animations and append the name to the `EMOTIONS` array in `script.js`.

Enjoy!
