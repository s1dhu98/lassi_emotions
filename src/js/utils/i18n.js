/* Lassi Emotions - Internationalization (i18n) Utility */

export const DICTIONARY = {
  en: {
    appTitle: "Lassi Emotions",
    appSub: "Interactive Sentiment & Visualization",
    pickEmotion: "Pick an Emotion",
    searchPlaceholder: "Search emotions...",
    randomBtn: "✨ Random",
    resetBtn: "↺ Reset",
    favBtn: "❤️ Favorite",
    intensityLabel: "Emotion Intensity",
    waveLabel: "Wave Turbulence",
    toppingLabel: "Lassi Topping",
    themeLabel: "Theme Aesthetic",
    sentimentHeader: "🧠 Type how you feel (NLP Sentiment)",
    sentimentPlaceholder: "e.g., I am feeling super thrilled and joyful today!",
    analyzeBtn: "Analyze Text",
    streakLabel: "Day Streak",
    badgesLabel: "Badges",
    achievementsTitle: "🏆 Unlocked Achievements",
    closeModal: "Close",
    footerText: "Lassi Emotions • 50+ Reactions, NLP Sentiment Engine, Dynamic Toppings & i18n",
    sentimentResult: "Detected Emotion:",
    confidenceText: "Confidence Score:"
  },
  hi: {
    appTitle: "लस्सी इमोशन्स",
    appSub: "इंटरएक्टिव भावना और संवेदना विज़ुअलाइज़र",
    pickEmotion: "एक भावना चुनें",
    searchPlaceholder: "भावनाएं खोजें...",
    randomBtn: "✨ रैंडम",
    resetBtn: "↺ रीसेट",
    favBtn: "❤️ पसंदीदा",
    intensityLabel: "भावना की तीव्रता",
    waveLabel: "तरंग गति",
    toppingLabel: "लस्सी टॉपिंग",
    themeLabel: "थीम सौंदर्य",
    sentimentHeader: "🧠 बताएं आप कैसा महसूस कर रहे हैं",
    sentimentPlaceholder: "उदा., आज मैं बहुत खुश और उत्साहित महसूस कर रहा हूँ!",
    analyzeBtn: "विश्लेषण करें",
    streakLabel: "दिनों की स्ट्रीक",
    badgesLabel: "बैज",
    achievementsTitle: "🏆 प्राप्त उपलब्धियां",
    closeModal: "बंद करें",
    footerText: "लस्सी इमोशन्स • 50+ प्रतिक्रियाएं, NLP भावना विश्लेषण, टॉपिंग एवं द्विभाषी सहायता",
    sentimentResult: "पहचानी गई भावना:",
    confidenceText: "विश्वसनीयता अंक:"
  }
};

export class I18nManager {
  constructor(initialLang = 'en') {
    this.lang = initialLang;
  }

  setLanguage(lang) {
    if (DICTIONARY[lang]) {
      this.lang = lang;
      this.updateDOM();
    }
  }

  t(key) {
    return (DICTIONARY[this.lang] && DICTIONARY[this.lang][key]) || key;
  }

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });
  }
}
