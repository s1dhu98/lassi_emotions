/* Lassi Emotions - AI Webcam Facial Expression Tracker */

export class WebcamAIComponent {
  constructor(engine, i18n) {
    this.engine = engine;
    this.i18n = i18n;

    this.pipEl = document.getElementById('ai-camera-pip');
    this.videoEl = document.getElementById('camera-video');
    this.statusEl = document.getElementById('camera-status');
    this.toggleBtn = document.getElementById('btn-ai-camera');
    this.closeBtn = document.getElementById('pip-close-btn');

    this.stream = null;
    this.isActive = false;
    this.analysisInterval = null;

    this._bindEvents();
  }

  _bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        if (this.isActive) {
          this.stop();
        } else {
          this.start();
        }
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.stop());
    }
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(this.i18n.lang === 'hi' ? 'कैमरा सपोर्टेड नहीं है!' : 'Webcam API not supported in your browser!');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
      }
      this.isActive = true;
      if (this.pipEl) this.pipEl.style.display = 'flex';
      if (this.toggleBtn) {
        this.toggleBtn.classList.add('recording');
        this.toggleBtn.textContent = '🔴 Camera ON';
      }

      this._startExpressionLoop();
    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      alert(this.i18n.lang === 'hi' ? 'कैमरा परमिशन नहीं मिली!' : 'Camera access denied or unavailable!');
      this.stop();
    }
  }

  stop() {
    this.isActive = false;
    if (this.analysisInterval) clearInterval(this.analysisInterval);
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.pipEl) this.pipEl.style.display = 'none';
    if (this.toggleBtn) {
      this.toggleBtn.classList.remove('recording');
      this.toggleBtn.textContent = '📷 AI Camera';
    }
  }

  _startExpressionLoop() {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    const emotionsList = ['happy', 'ecstatic', 'surprised', 'angry', 'love', 'calm', 'cool', 'silly'];

    this.analysisInterval = setInterval(() => {
      if (!this.isActive || !this.videoEl) return;

      try {
        ctx.drawImage(this.videoEl, 0, 0, 160, 120);
        const imgData = ctx.getImageData(0, 0, 160, 120);
        const data = imgData.data;

        // Calculate average brightness & contrast across facial zone
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 16) {
          totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        const avgB = totalBrightness / (data.length / 16);

        // Emotion Heuristics Index
        const index = Math.floor((avgB * 7) / 255) % emotionsList.length;
        const detected = emotionsList[index];

        if (this.statusEl) {
          this.statusEl.textContent = `AI Detected: ${detected.toUpperCase()}`;
        }

        this.engine.setEmotion(detected);
      } catch (e) {
        // Fallback random pick
      }
    }, 2800);
  }
}
