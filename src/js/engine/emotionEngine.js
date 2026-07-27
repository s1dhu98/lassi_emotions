import { loadUserData, saveUserData, StorageManager } from '../utils/storage.js';

export class EmotionEngine {
  constructor(dataset, particleEmitter) {
    this.dataset = dataset;
    this.particleEmitter = particleEmitter;
    
    // Application State with Defensive Storage Fallback
    let loadedUser = null;
    try {
      loadedUser = loadUserData();
    } catch (e) {
      console.warn('Fallback loading user data:', e);
      loadedUser = {
        language: 'en', theme: 'midnight', favorites: ['happy'], streak: 1,
        lastVisit: new Date().toISOString(), exploredEmotions: ['happy'],
        toppingsTried: ['saffron'], unlockedBadges: ['first_sip'], sentimentAnalysesCount: 0
      };
    }

    this.state = {
      currentEmotion: 'happy',
      intensity: 1.0,
      waveSpeed: 3.0,
      topping: 'saffron',
      theme: 'midnight',
      searchFilter: '',
      categoryFilter: 'all',
      userData: loadedUser
    };

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  setEmotion(emotionId) {
    const found = this.dataset.emotions.find(e => e.id === emotionId);
    if (!found) return;

    this.state.currentEmotion = emotionId;
    this.state.topping = found.defaultTopping || 'none';

    // Track user exploration & streak
    if (!this.state.userData.exploredEmotions.includes(emotionId)) {
      this.state.userData.exploredEmotions.push(emotionId);
    }

    this._checkBadges();
    this._saveUser();

    // Trigger particles
    if (this.particleEmitter && found.particle) {
      this.particleEmitter.emit(found.particle, this.state.intensity);
    }

    this.notify();
  }

  _saveUser() {
    if (typeof saveUserData === 'function') {
      saveUserData(this.state.userData);
    } else if (StorageManager && typeof StorageManager.save === 'function') {
      StorageManager.save(this.state.userData);
    }
  }

  setIntensity(val) {
    this.state.intensity = parseFloat(val);
    this.notify();
  }

  setWaveSpeed(val) {
    this.state.waveSpeed = parseFloat(val);
    this.notify();
  }

  setTopping(toppingId) {
    this.state.topping = toppingId;
    if (!this.state.userData.toppingsTried.includes(toppingId)) {
      this.state.userData.toppingsTried.push(toppingId);
    }
    this._checkBadges();
    this._saveUser();
    this.notify();
  }

  setTheme(themeId) {
    this.state.theme = themeId;
    this.state.userData.theme = themeId;
    document.body.className = `theme-${themeId}`;
    this._saveUser();
    this.notify();
  }

  toggleFavorite(emotionId = this.state.currentEmotion) {
    const favs = this.state.userData.favorites;
    const index = favs.indexOf(emotionId);
    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(emotionId);
    }
    this._saveUser();
    this.notify();
  }

  randomEmotion() {
    const list = this.getFilteredEmotions();
    if (list.length === 0) return;
    const randomItem = list[Math.floor(Math.random() * list.length)];
    this.setEmotion(randomItem.id);
  }

  reset() {
    this.setEmotion('happy');
    this.state.intensity = 1.0;
    this.state.waveSpeed = 3.0;
    this.notify();
  }

  setSearchFilter(query) {
    this.state.searchFilter = query;
    this.notify();
  }

  setCategoryFilter(category) {
    this.state.categoryFilter = category;
    this.notify();
  }

  getFilteredEmotions() {
    const q = this.state.searchFilter.toLowerCase().trim();
    const cat = this.state.categoryFilter;

    return this.dataset.emotions.filter(emo => {
      const matchCat = cat === 'all' || emo.category === cat;
      const matchSearch = q === '' || emo.nameEn.toLowerCase().includes(q) || emo.nameHi.includes(q);
      return matchCat && matchSearch;
    });
  }

  _checkBadges() {
    const u = this.state.userData;
    const unlock = (badgeId) => {
      if (!u.unlockedBadges.includes(badgeId)) {
        u.unlockedBadges.push(badgeId);
      }
    };

    unlock('first_sip');
    if (u.exploredEmotions.length >= 5) unlock('mood_explorer');
    if (u.exploredEmotions.length >= 12) unlock('lassi_master');
    if (u.toppingsTried.length >= 4) unlock('topping_alchemist');
    if (u.sentimentAnalysesCount >= 3) unlock('sentiment_wizard');
  }
}
