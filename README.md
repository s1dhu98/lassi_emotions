# Lassi Emotions 🥛✨

> **An interactive, AI-powered sentiment & emotion visualization engine.**  
> Transform text inputs, moods, and feelings into dynamic, animated vector glass reactions with customizable toppings, physics wave simulations, and dual Hindi/English i18n support.

![Lassi Emotions Showcase](assets/images/lassi_showcase.svg)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6_Modules-F7DF1E?logo=javascript)](https://developer.mozilla.org)
[![CSS3 Glassmorphic](https://img.shields.io/badge/Styling-Vanilla_CSS_Glassmorphic-1572B6?logo=css3)](src/css/main.css)
[![i18n Ready](https://img.shields.io/badge/i18n-English_%2B_Hindi-FF9900)](src/js/utils/i18n.js)
[![NLP AI Engine](https://img.shields.io/badge/NLP_AI-Sentiment_Lexicon-4FACFE)](src/js/engine/sentimentNlp.js)

---

## ✨ Features at a Glance

| Feature | Description |
| :--- | :--- |
| 🎭 **50+ Emotions** | Curated across 10 spectrums (Joy, Sadness, Anger, Fear, Love, Surprise, Energy, Calm, Playful, Confidence). |
| 🧠 **NLP Sentiment AI** | Real-time sentence parser & sentiment classification engine with confidence breakdown. |
| 🌾 **Custom Toppings** | Garnish your lassi with Kesar (Saffron), Pista (Pistachio), Gulab (Rose Petals), Mango Drizzle, or Sprinkles. |
| 🎨 **Theme Aesthetics** | Toggle between Midnight Velvet, Mango Gold, Rose Royale, Matcha Zen, and Cosmic Twilight themes. |
| 🌐 **Bilingual (EN / HI)** | Instant one-click language toggle between English and Hindi for UI & emotion vocabulary. |
| 🏆 **Gamified System** | Daily visit streaks, 6 unlockable achievement badges, and persistent progress scoreboard. |
| 📱 **Responsive & Mobile** | Fully responsive layout with touch support, dynamic particle limits, and device optimization. |

---

## 🏗️ Project Architecture

Built with pure Vanilla JavaScript (Native ES Modules), modular CSS, and scalable SVG graphics — **zero external npm build tools required to run!**

```
lassi_emotions/
├── index.html                    # Redesigned semantic glassmorphism interface
├── README.md                     # Open-source showcase documentation
├── ROADMAP.md                    # Product development roadmap
├── config.md                     # Customization & configuration guide
├── assets/
│   ├── data/
│   │   └── emotions_dataset.json # Emotion mapping, facial geometry & lexicon data
│   └── images/
│       └── lassi_showcase.svg    # Vector showcase banner
└── src/
    ├── css/
    │   ├── main.css              # Design tokens, variables & glassmorphism layout
    │   ├── components.css        # Buttons, cards, search, sliders, modals & tabs
    │   └── animations.css        # Wave physics, particle emitters & face keyframes
    └── js/
        ├── main.js               # Application bootstrapper
        ├── engine/
        │   ├── emotionEngine.js  # State manager & event dispatcher
        │   ├── sentimentNlp.js   # Lexicon NLP text analyzer
        │   └── mockMlApi.js      # Async ML inference simulation
        ├── components/
        │   ├── lassiGlass.js     # SVG face morphing & liquid glass rendering
        │   ├── controls.js       # Sliders, category tabs & search listeners
        │   ├── sentimentUI.js    # Sentiment text input widget
        │   └── gamificationUI.js # Streaks & achievement modal
        └── utils/
            ├── particles.js      # Confetti, tears, bubbles, hearts & stars emitter
            ├── i18n.js           # Bilingual English/Hindi dictionary
            └── storage.js        # LocalStorage persistence manager
```

---

## 🚀 Quick Start & Local Setup

Because Lassi Emotions uses native ES Modules (`type="module"`), it is best served using any lightweight local HTTP server.

### Option 1: Using `npx serve` (Recommended)
```bash
# Clone the repository
git clone https://github.com/s1dhu98/lassi_emotions.git
cd lassi_emotions

# Start local dev server
npx -y serve .
```
Open `http://localhost:3000` in your browser.

### Option 2: Using Python HTTP Server
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### Option 3: VS Code Live Server
Right click `index.html` in VS Code and click **Open with Live Server**.

---


## 🎮 How to Customize

- **Add New Emotions**: Simply add an emotion entry to `assets/data/emotions_dataset.json` with keywords, SVG mouth path, and particle type.
- **Add New Themes**: Define new CSS variable tokens under `body.theme-<name>` in `src/css/main.css`.
- **Add Badges**: Add achievement definitions to `BADGES_LIST` in `src/js/components/gamificationUI.js`.

---

## 🗺️ Product Roadmap

Check out our full roadmap in [ROADMAP.md](ROADMAP.md) for upcoming features including WebAudio sound synthesis, webcam face tracking, and 3D liquid WebGL physics!

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

Created with 💖 and lots of lassi by [s1dhu98](https://github.com/s1dhu98). Contributions and stars are welcome! 🥛✨
