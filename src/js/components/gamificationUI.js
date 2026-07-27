/* Lassi Emotions - Gamification UI Component */

export const BADGES_LIST = [
  { id: 'first_sip', titleEn: 'First Sip 🥛', titleHi: 'पहला घूंट 🥛', descEn: 'Welcomed into Lassi Emotions', descHi: 'लस्सी इमोशन्स में आपका स्वागत है' },
  { id: 'mood_explorer', titleEn: 'Mood Explorer 🔍', titleHi: 'मूड़ अन्वेषक 🔍', descEn: 'Explored 5 unique emotions', descHi: '5 अलग-अलग भावनाओं को देखा' },
  { id: 'lassi_master', titleEn: 'Lassi Master 👑', titleHi: 'लस्सी मास्टर 👑', descEn: 'Explored 12+ emotions', descHi: '12 से अधिक भावनाओं का अनुभव किया' },
  { id: 'topping_alchemist', titleEn: 'Topping Alchemist 🌾', titleHi: 'टॉपिंग के उस्ताद 🌾', descEn: 'Tried 4 delicious toppings', descHi: '4 विभिन्न टॉपिंग्स आज़माईं' },
  { id: 'sentiment_wizard', titleEn: 'Sentiment Wizard 🧠', titleHi: 'भावनाओं के जादूगर 🧠', descEn: 'Analyzed 3 sentences with NLP AI', descHi: 'NLP AI से 3 वाक्यों का विश्लेषण किया' },
  { id: 'polyglot', titleEn: 'Polyglot 🌐', titleHi: 'द्विभाषी प्रेमी 🌐', descEn: 'Switched between Hindi & English', descHi: 'हिंदी और अंग्रेजी भाषा बदली' }
];

export class GamificationUIComponent {
  constructor(engine, i18nManager) {
    this.engine = engine;
    this.i18n = i18nManager;

    this.streakEl = document.getElementById('streak-count');
    this.badgeCountEl = document.getElementById('badge-count');
    this.badgePillBtn = document.getElementById('badge-pill-btn');

    this.modalOverlay = document.getElementById('achievements-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');
    this.badgesGrid = document.getElementById('badges-grid');

    this.bindEvents();
  }

  bindEvents() {
    if (this.badgePillBtn) {
      this.badgePillBtn.addEventListener('click', () => this.openModal());
    }
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }
  }

  openModal() {
    if (this.modalOverlay) this.modalOverlay.classList.add('open');
    this.renderModalContent();
  }

  closeModal() {
    if (this.modalOverlay) this.modalOverlay.classList.remove('open');
  }

  renderModalContent() {
    if (!this.badgesGrid) return;
    this.badgesGrid.innerHTML = '';

    const unlocked = this.engine.state.userData.unlockedBadges || [];

    BADGES_LIST.forEach(b => {
      const isUnlocked = unlocked.includes(b.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;

      const title = this.i18n.lang === 'hi' ? b.titleHi : b.titleEn;
      const desc = this.i18n.lang === 'hi' ? b.descHi : b.descEn;

      card.innerHTML = `
        <div class="badge-icon">${isUnlocked ? '🌟' : '🔒'}</div>
        <div>
          <div class="badge-title">${title}</div>
          <div class="badge-desc">${desc}</div>
        </div>
      `;

      this.badgesGrid.appendChild(card);
    });
  }

  render(state) {
    const userData = state.userData || {};
    if (this.streakEl) {
      this.streakEl.textContent = `${userData.streak || 1} 🔥`;
    }
    if (this.badgeCountEl) {
      const unlockedCount = (userData.unlockedBadges || []).length;
      this.badgeCountEl.textContent = `${unlockedCount} / ${BADGES_LIST.length} 🏆`;
    }
  }
}
