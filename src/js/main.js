/* Lassi Emotions - Main Application Entrypoint */

import { loadUserData, saveUserData, StorageManager } from './utils/storage.js?v=2.1.0';
import { I18nManager } from './utils/i18n.js?v=2.1.0';
import { ParticleEmitter } from './utils/particles.js?v=2.1.0';
import { SentimentNlpEngine } from './engine/sentimentNlp.js?v=2.1.0';
import { MockMlApiService } from './engine/mockMlApi.js?v=2.1.0';
import { EmotionEngine } from './engine/emotionEngine.js?v=2.1.0';
import { soundEngine } from './utils/soundEngine.js?v=2.1.0';

import { LassiGlassComponent } from './components/lassiGlass.js?v=2.1.0';
import { ControlsComponent } from './components/controls.js?v=2.1.0';
import { SentimentUIComponent } from './components/sentimentUI.js?v=2.1.0';
import { GamificationUIComponent } from './components/gamificationUI.js?v=2.1.0';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Load Dataset
    const response = await fetch('./assets/data/emotions_dataset.json?v=2.1.0');
    const dataset = await response.json();

    // 2. Initialize Utilities & Services
    const initialUserData = typeof loadUserData === 'function' ? loadUserData() : (StorageManager ? StorageManager.load() : {});
    const i18n = new I18nManager(initialUserData.language || 'en');
    i18n.updateDOM();

    const particleContainer = document.getElementById('particles');
    const particleEmitter = new ParticleEmitter(particleContainer);

    const nlpEngine = new SentimentNlpEngine(dataset);
    const mockMlService = new MockMlApiService(nlpEngine);

    // 3. Initialize Core Emotion Engine
    const engine = new EmotionEngine(dataset, particleEmitter);

    // 4. Initialize Core UI Components
    const svgEl = document.getElementById('glass');

    const glassComponent = new LassiGlassComponent(svgEl, dataset);
    const controlsComponent = new ControlsComponent(document.querySelector('.sidebar'), engine, i18n);
    const sentimentComponent = new SentimentUIComponent(document.querySelector('.sentiment-section'), engine, mockMlService, i18n);
    const gamificationComponent = new GamificationUIComponent(engine, i18n);

    // 5. Subscribe Components to State Updates & Sound SFX
    let lastEmotion = null;
    engine.subscribe((state) => {
      glassComponent.render(state);
      controlsComponent.render(state);
      gamificationComponent.render(state);

      if (lastEmotion !== state.currentEmotion) {
        lastEmotion = state.currentEmotion;
        const emotionObj = dataset.emotions.find(e => e.id === state.currentEmotion);
        if (emotionObj) {
          soundEngine.playEmotionSound(emotionObj.category);
        }
      }
    });

    // 6. Sound Toggle Button
    const soundToggleBtn = document.getElementById('btn-sound-toggle');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const muted = soundEngine.toggleMute();
        soundToggleBtn.textContent = muted ? '🔇 OFF' : '🔊 ON';
        if (!muted) soundEngine.playPop();
      });
    }

    // 7. Language Toggle Switch
    const langToggleBtn = document.getElementById('btn-lang-toggle');
    if (langToggleBtn) {
      langToggleBtn.textContent = i18n.lang === 'en' ? '🌐 HI' : '🌐 EN';
      langToggleBtn.addEventListener('click', () => {
        soundEngine.playPop();
        const nextLang = i18n.lang === 'en' ? 'hi' : 'en';
        i18n.setLanguage(nextLang);
        engine.state.userData.language = nextLang;
        
        if (!engine.state.userData.unlockedBadges.includes('polyglot')) {
          engine.state.userData.unlockedBadges.push('polyglot');
        }
        
        if (typeof saveUserData === 'function') {
          saveUserData(engine.state.userData);
        } else if (StorageManager) {
          StorageManager.save(engine.state.userData);
        }
        langToggleBtn.textContent = nextLang === 'en' ? '🌐 HI' : '🌐 EN';
        engine.notify();
      });
    }

    // Unlock WebAudio on initial click/touch
    const unlockAudio = () => {
      soundEngine.init();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // 8. Boot initial state
    engine.setTheme(initialUserData.theme || 'midnight');
    engine.setEmotion('happy');

  } catch (err) {
    console.error('Failed to initialize Lassi Emotions:', err);
  }
});
