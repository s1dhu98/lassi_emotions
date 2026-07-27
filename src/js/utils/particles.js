/* Lassi Emotions - Modular Particle Emitter */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export class ParticleEmitter {
  constructor(containerEl) {
    this.container = containerEl;
  }

  clear() {
    if (this.container) this.container.innerHTML = '';
  }

  emit(type, countMultiplier = 1) {
    this.clear();
    switch (type) {
      case 'confetti':
        this.emitConfetti(Math.floor(36 * countMultiplier));
        break;
      case 'tears':
        this.emitTears(Math.floor(14 * countMultiplier));
        break;
      case 'bubbles':
        this.emitBubbles(Math.floor(24 * countMultiplier));
        break;
      case 'hearts':
        this.emitHearts(Math.floor(20 * countMultiplier));
        break;
      case 'stars':
        this.emitStars(Math.floor(22 * countMultiplier));
        break;
      case 'sparks':
        this.emitSparks(Math.floor(28 * countMultiplier));
        break;
    }
  }

  _appendParticle(p) {
    if (!this.container) return;
    p.addEventListener('animationend', () => p.remove());
    this.container.appendChild(p);
  }

  emitConfetti(count = 36) {
    const colors = ['#ffd57e', '#ff4081', '#4facfe', '#76ba1b', '#ffb703', '#b388ff', '#00e5ff'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.floor(random(8, 18));
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${50 + random(-25, 25)}%`;
      p.style.top = `${45 + random(-15, 15)}%`;
      p.style.backgroundColor = colors[Math.floor(random(0, colors.length))];
      p.style.borderRadius = random(0, 1) > 0.5 ? '50%' : '3px';
      
      const dx = `${random(-260, 260)}px`;
      const dy = `${random(-320, -80)}px`;
      const rot = `${random(-720, 720)}deg`;
      
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.setProperty('--rot', rot);
      p.style.animation = `confettiFall ${random(1.2, 2.4)}s ease-out forwards`;

      this._appendParticle(p);
    }
  }

  emitTears(count = 14) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const w = Math.floor(random(8, 12));
      p.style.width = `${w}px`;
      p.style.height = `${w * 2.2}px`;
      // Sprout directly from left or right eye stage coordinates
      const isLeftEye = i % 2 === 0;
      p.style.left = isLeftEye ? '43%' : '57%';
      p.style.top = `${48 + random(-2, 4)}%`;
      p.style.background = 'linear-gradient(180deg, rgba(186, 230, 253, 0.95), rgba(59, 130, 246, 0.85))';
      p.style.borderRadius = '50% 50% 40% 40%';
      p.style.boxShadow = '0 0 8px rgba(147, 197, 253, 0.6)';
      
      p.style.animation = `tearDrop ${random(0.9, 1.6)}s ease-in forwards`;
      p.style.animationDelay = `${i * 0.12}s`;

      this._appendParticle(p);
    }
  }

  emitBubbles(count = 24) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.floor(random(10, 28));
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${50 + random(-30, 30)}%`;
      p.style.top = `${55 + random(-15, 20)}%`;
      const hue = random(0, 360);
      p.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 90%, 85%, 0.85), hsla(${hue}, 80%, 65%, 0.35))`;
      p.style.border = '1px solid rgba(255, 255, 255, 0.6)';
      p.style.borderRadius = '50%';

      const dx = `${random(-70, 70)}px`;
      const dy = `${random(-280, -100)}px`;

      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.animation = `bubbleRise ${random(1.5, 3.0)}s ease-out forwards`;

      this._appendParticle(p);
    }
  }

  emitHearts(count = 20) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = '❤️';
      p.style.fontSize = `${random(18, 32)}px`;
      p.style.left = `${50 + random(-25, 25)}%`;
      p.style.top = `${45 + random(-15, 15)}%`;

      const dx = `${random(-220, 220)}px`;
      const dy = `${random(-240, -90)}px`;
      const rot = `${random(-360, 360)}deg`;

      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.setProperty('--rot', rot);
      p.style.animation = `heartFloat ${random(1.5, 2.5)}s ease-out forwards`;

      this._appendParticle(p);
    }
  }

  emitStars(count = 22) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = '⭐';
      p.style.fontSize = `${random(18, 30)}px`;
      p.style.left = `${50 + random(-30, 30)}%`;
      p.style.top = `${45 + random(-15, 15)}%`;

      const dx = `${random(-240, 240)}px`;
      const dy = `${random(-220, 220)}px`;
      const rot = `${random(-720, 720)}deg`;

      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.setProperty('--rot', rot);
      p.style.animation = `starBurst ${random(1.0, 2.0)}s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;

      this._appendParticle(p);
    }
  }

  emitSparks(count = 28) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.floor(random(5, 14));
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${50 + random(-20, 20)}%`;
      p.style.top = `${45 + random(-15, 15)}%`;
      p.style.background = 'radial-gradient(circle, #ffe57f, #ff3d00)';
      p.style.borderRadius = '50%';

      const dx = `${random(-230, 230)}px`;
      const dy = `${random(-260, -60)}px`;

      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.animation = `sparkFly ${random(0.5, 1.3)}s ease-out forwards`;

      this._appendParticle(p);
    }
  }
}
