/* Lassi Emotions - Sentiment NLP UI Component */

export class SentimentUIComponent {
  constructor(containerEl, engine, mockMlService, i18nManager) {
    this.container = containerEl;
    this.engine = engine;
    this.mlService = mockMlService;
    this.i18n = i18nManager;

    this.textarea = document.getElementById('sentiment-input');
    this.analyzeBtn = document.getElementById('btn-analyze-sentiment');
    this.resultBadge = document.getElementById('sentiment-result');

    this.bindEvents();
  }

  bindEvents() {
    if (this.analyzeBtn && this.textarea) {
      this.analyzeBtn.addEventListener('click', () => this.processSentiment());
    }

    if (this.textarea) {
      this.textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.processSentiment();
        }
      });
    }
  }

  async processSentiment() {
    const text = this.textarea.value.trim();
    if (!text) return;

    if (this.resultBadge) {
      this.resultBadge.innerHTML = `⏳ <em>Analyzing sentiment with ML Engine...</em>`;
    }

    // Call Mock ML Service with async prediction
    const res = await this.mlService.predictEmotionAsync(text);
    
    // Set emotion on Engine
    this.engine.setEmotion(res.primaryEmotion);
    this.engine.setIntensity(res.intensity);

    // Track count for achievement badge
    this.engine.state.userData.sentimentAnalysesCount = (this.engine.state.userData.sentimentAnalysesCount || 0) + 1;
    this.engine._checkBadges();
    this.engine.notify();

    // Render result badge
    if (this.resultBadge) {
      const emotionObj = this.engine.dataset.emotions.find(e => e.id === res.primaryEmotion);
      const name = this.i18n.lang === 'hi' ? emotionObj.nameHi : emotionObj.nameEn;
      this.resultBadge.innerHTML = `
        <span>${this.i18n.t('sentimentResult')} <strong>${name}</strong></span>
        <span>${this.i18n.t('confidenceText')} <strong>${res.confidence}%</strong></span>
      `;
    }
  }
}
