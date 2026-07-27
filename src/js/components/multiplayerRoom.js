/* Lassi Emotions - Live Multiplayer Mood Room Component */

export class MultiplayerRoomComponent {
  constructor(engine, dataset, i18n) {
    this.engine = engine;
    this.dataset = dataset;
    this.i18n = i18n;

    this.modalEl = document.getElementById('live-room-modal');
    this.toggleBtn = document.getElementById('btn-live-room');
    this.closeBtn = document.getElementById('room-close-btn');
    this.gridEl = document.getElementById('room-participants');

    this.channel = null;
    this.userId = 'Lassi_' + Math.floor(1000 + Math.random() * 9000);
    this.peers = new Map();

    this._initChannel();
    this._bindEvents();
  }

  _initChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel('lassi_mood_room_v3');
      this.channel.onmessage = (e) => this._handleMessage(e.data);
    }
  }

  _bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Broadcast state on engine update
    this.engine.subscribe((state) => {
      this.broadcastState(state);
    });
  }

  open() {
    if (this.modalEl) this.modalEl.classList.add('visible');
    this.broadcastState(this.engine.state);
    this.render();
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('visible');
  }

  broadcastState(state) {
    if (!this.channel) return;
    const emotion = this.dataset.emotions.find(e => e.id === state.currentEmotion);
    const msg = {
      type: 'SYNC',
      userId: this.userId,
      emotionId: state.currentEmotion,
      nameEn: emotion ? emotion.nameEn : 'Happy',
      nameHi: emotion ? emotion.nameHi : 'प्रसन्न',
      topping: state.topping,
      timestamp: Date.now()
    };
    this.channel.postMessage(msg);
  }

  _handleMessage(data) {
    if (!data || data.userId === this.userId) return;

    if (data.type === 'SYNC') {
      this.peers.set(data.userId, data);
      this.render();
    }
  }

  render() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    // Add Self
    const currentEmotion = this.dataset.emotions.find(e => e.id === this.engine.state.currentEmotion);
    const selfCard = this._createPeerCard(this.userId + ' (You)', currentEmotion ? currentEmotion.nameEn : 'Happy', true);
    this.gridEl.appendChild(selfCard);

    // Add Simulated/Real Peers
    if (this.peers.size === 0) {
      // Add simulated active peers for showcase
      const mockPeers = [
        { name: 'Aarav 🥛', mood: 'Ecstatic 🎉' },
        { name: 'Ananya 🌹', mood: 'In Love ❤️' },
        { name: 'Rohan ⚡', mood: 'Energetic ⚡' }
      ];
      mockPeers.forEach(p => {
        const card = this._createPeerCard(p.name, p.mood, false);
        this.gridEl.appendChild(card);
      });
    } else {
      this.peers.forEach((peer, id) => {
        const card = this._createPeerCard(id, peer.nameEn, false);
        this.gridEl.appendChild(card);
      });
    }
  }

  _createPeerCard(name, mood, isSelf) {
    const card = document.createElement('div');
    card.className = `room-peer-card ${isSelf ? 'self' : ''}`;
    card.innerHTML = `
      <div class="peer-avatar">🥛</div>
      <div class="peer-name">${name}</div>
      <div class="peer-mood">${mood}</div>
    `;
    return card;
  }
}
