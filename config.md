# Lassi Emotions Configuration Guide 🛠️

This document explains how to configure and extend the Lassi Emotions system.

---

## 🎨 1. Design System & CSS Tokens

Themes and design tokens are defined in `src/css/main.css`.

### Available Themes
- **Midnight Velvet** (`theme-midnight`): Default dark cyan/navy palette
- **Mango Gold** (`theme-mango`): Warm amber & mango gradient
- **Rose Royale** (`theme-rose`): Deep crimson & rose pink palette
- **Matcha Zen** (`theme-matcha`): Calm emerald green aesthetic
- **Cosmic Twilight** (`theme-cosmic`): Deep purple & violet glow

To add a new theme, add a body class block to `src/css/main.css`:
```css
body.theme-yourtheme {
  --theme-bg-gradient: linear-gradient(180deg, #12042b 0%, #1b073d 100%);
  --theme-accent: #b388ff;
  --theme-card-glow: rgba(179, 136, 255, 0.2);
}
```

---

## 🧠 2. NLP Sentiment Analysis Engine

Configured in `src/js/engine/sentimentNlp.js` & `assets/data/emotions_dataset.json`.

### Keyword Scoring Weights
- **Exact Keyword Match**: +3 points
- **Partial Keyword Match**: +1 point
- **Exclamation Marks / All Caps**: Boosts intensity by 1.35x

---

## 🏆 3. Gamification & Badges

Defined in `src/js/components/gamificationUI.js`:
- `first_sip`: Unlocked on initial visit
- `mood_explorer`: Explored 5 unique emotions
- `lassi_master`: Explored 12+ emotions
- `topping_alchemist`: Tried 4 distinct toppings
- `sentiment_wizard`: Analyzed 3 text sentences
- `polyglot`: Switched between English and Hindi

---

## 🌐 4. i18n (Internationalization)

Translations are managed in `src/js/utils/i18n.js`.
To add a new language (e.g. Spanish):
```javascript
export const DICTIONARY = {
  en: { ... },
  hi: { ... },
  es: {
    appTitle: "Lassi Emociones",
    pickEmotion: "Elige una emoción",
    ...
  }
};
```
