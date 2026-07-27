/* Lassi Emotions - LocalStorage Manager */

const STORAGE_KEY = 'lassi_emotions_user_data_v2';

const defaultState = {
  language: 'en',
  theme: 'midnight',
  favorites: ['happy', 'love'],
  streak: 1,
  lastVisit: new Date().toISOString(),
  exploredEmotions: ['happy'],
  toppingsTried: ['saffron'],
  unlockedBadges: ['first_sip'],
  sentimentAnalysesCount: 0
};

export function loadUserData() {
  try {
    if (typeof localStorage === 'undefined') return defaultState;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultState;
    const parsed = JSON.parse(data);
    
    const last = new Date(parsed.lastVisit || Date.now());
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);

    if (diffHours >= 24 && diffHours < 48) {
      parsed.streak = (parsed.streak || 1) + 1;
    } else if (diffHours >= 48) {
      parsed.streak = 1;
    }
    parsed.lastVisit = now.toISOString();

    return { ...defaultState, ...parsed };
  } catch (e) {
    console.warn('LocalStorage error, using defaults:', e);
    return defaultState;
  }
}

export function saveUserData(state) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const StorageManager = {
  load: loadUserData,
  save: saveUserData
};

export default StorageManager;
