/* Lassi Emotions - Virtual Pet & Talking Tom Voice Component */

import { soundEngine } from '../utils/soundEngine.js?v=20260726';

export class PetUIComponent {
  constructor(engine, nlpEngine, i18n) {
    this.engine = engine;
    this.nlpEngine = nlpEngine;
    this.i18n = i18n;

    this.isListening = false;
    this.recognition = null;
    this.bubbleEl = document.getElementById('speech-bubble');
    this.talkBtn = document.getElementById('btn-talk-lassi');

    this._initSpeechRecognition();
    this._bindEvents();
  }

  _initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleUserSpeech(transcript);
      };

      this.recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        this.stopListening();
        this.showSpeechBubble(this.i18n.lang === 'hi' ? 'माफ़ कीजिए, सुन नहीं पाया! 🙈' : "Couldn't hear you clearly! 🙈");
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    }
  }

  _bindEvents() {
    if (this.talkBtn) {
      this.talkBtn.addEventListener('click', () => {
        soundEngine.playPop();
        if (this.isListening) {
          this.stopListening();
        } else {
          this.startListening();
        }
      });
    }

    // Bind Pet Action Buttons
    const patBtn = document.getElementById('btn-pet-pat');
    const tickleBtn = document.getElementById('btn-pet-tickle');
    const pokeBtn = document.getElementById('btn-pet-poke');
    const hugBtn = document.getElementById('btn-pet-hug');

    if (patBtn) patBtn.addEventListener('click', () => this.pat());
    if (tickleBtn) tickleBtn.addEventListener('click', () => this.tickle());
    if (pokeBtn) pokeBtn.addEventListener('click', () => this.poke());
    if (hugBtn) hugBtn.addEventListener('click', () => this.hug());
  }

  startListening() {
    if (!this.recognition) {
      this.showSpeechBubble(this.i18n.lang === 'hi' ? 'वॉइस मोड सपोर्टेड नहीं है! 🎙️' : 'Voice mode not supported on browser! 🎙️');
      return;
    }

    try {
      this.recognition.lang = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-US';
      this.recognition.start();
      this.isListening = true;
      if (this.talkBtn) {
        this.talkBtn.classList.add('recording');
        this.talkBtn.innerHTML = '🔴 Listening... Speak!';
      }
      this.showSpeechBubble(this.i18n.lang === 'hi' ? 'मैं सुन रहा हूँ! बोलिए... 🎙️' : 'I am listening! Speak to me... 🎙️');
    } catch (e) {
      console.warn('Speech start error:', e);
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.talkBtn) {
      this.talkBtn.classList.remove('recording');
      this.talkBtn.innerHTML = '🎙️ Talk to Lassi';
    }
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }

  handleUserSpeech(transcript) {
    this.stopListening();
    const result = this.nlpEngine.analyze(transcript);

    // Set Lassi emotion based on user speech
    this.engine.setEmotion(result.emotionId);

    // Cute Kawaii Reply
    const repliesEn = {
      joy: [`You sound so happy! "${transcript}" 🥳`, `Yay! I love your cheerful energy! ✨`, `Hehehe! You made my foam bubble up! 🥛`],
      sadness: [`Aww, don't be sad! Have a warm hug! 🤗`, `I am here for you bestie! ❤️`, `Sending you sweet lassi love! 🌸`],
      anger: [`Whoa, deep breath! Let's chill out together! 🧘`, `Don't be angry! Cool down with a sip! 🧊`],
      love: [`Aww, I love you too so much! 🥰💖`, `You make my heart flutter! ❤️`],
      surprise: [`OMG really?! Wow! 😲✨`, `That is mind blowing! 🤯`],
      playful: [`Hehehe you are so silly! 😜`, `Let's play and bounce! 🎉`]
    };

    const categoryReplies = repliesEn[result.category] || repliesEn.joy;
    const responseText = categoryReplies[Math.floor(Math.random() * categoryReplies.length)];

    this.showSpeechBubble(responseText);
    this.speakKawaii(responseText);
  }

  pat() {
    soundEngine.playEmotionSound('love');
    this.engine.setEmotion('love');
    const msg = this.i18n.lang === 'hi' ? 'अरे वाह! कितना प्यारा स्पर्श! 💖' : 'Aww, sweet pats! I love you! 💖';
    this.showSpeechBubble(msg);
    this.speakKawaii(msg);
  }

  tickle() {
    soundEngine.playEmotionSound('playful');
    this.engine.setEmotion('silly');
    const msg = this.i18n.lang === 'hi' ? 'हीहीही! गुदगुदी हो रही है! 😜' : 'Hehehe! That tickles! 😜';
    this.showSpeechBubble(msg);
    this.speakKawaii(msg);
  }

  poke() {
    soundEngine.playEmotionSound('surprise');
    this.engine.setEmotion('surprised');
    const msg = this.i18n.lang === 'hi' ? 'आउच! मेरी आँखों को आराम से! 🙈' : 'Ouchie! Be gentle with my glass! 🙈';
    this.showSpeechBubble(msg);
    this.speakKawaii(msg);
  }

  hug() {
    soundEngine.playEmotionSound('joy');
    this.engine.setEmotion('ecstatic');
    const msg = this.i18n.lang === 'hi' ? 'बड़ा सा प्यार भरा आलिंगन! 🤗✨' : 'Big warm virtual pet hug! 🤗✨';
    this.showSpeechBubble(msg);
    this.speakKawaii(msg);
  }

  showSpeechBubble(text, duration = 4000) {
    if (!this.bubbleEl) return;
    this.bubbleEl.textContent = text;
    this.bubbleEl.classList.add('visible');

    if (this._bubbleTimer) clearTimeout(this._bubbleTimer);
    this._bubbleTimer = setTimeout(() => {
      this.bubbleEl.classList.remove('visible');
    }, duration);
  }

  speakKawaii(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.7; // Cute Talking Tom High Pitch
    utterance.rate = 1.15; // Slightly upbeat
    utterance.volume = 0.9;
    utterance.lang = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
  }
}
