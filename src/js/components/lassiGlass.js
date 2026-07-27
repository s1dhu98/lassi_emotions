/* Lassi Emotions - SVG Glass & Liquid Component */

export class LassiGlassComponent {
  constructor(svgElement, dataset) {
    this.svg = svgElement;
    this.dataset = dataset;

    this.stop1 = this.svg.querySelector('#lassiStop1');
    this.stop2 = this.svg.querySelector('#lassiStop2');
    this.surfacePath = this.svg.querySelector('#surface');
    this.eyesGroup   = this.svg.querySelector('#eyes');
    this.mouthPath   = this.svg.querySelector('#mouth');
    this.faceGroup   = this.svg.querySelector('#face');
    this.toppingsGroup = this.svg.querySelector('#toppingsGroup');
    this.lassiRect   = this.svg.querySelector('#lassi');

    this.eyebrowLeft  = this.svg.querySelector('#eyebrowLeft');
    this.eyebrowRight = this.svg.querySelector('#eyebrowRight');
    this.blushGroup   = this.svg.querySelector('#blushGroup');
    this.tearsLayer   = this.svg.querySelector('#tearsLayer');
    this.tonguePath   = this.svg.querySelector('#tongue');

    this.glassCracks = this.svg.querySelector('#glassCracks');
    this.spillGroup  = this.svg.querySelector('#spillGroup');

    // Create the frothy foam crown overlay (rendered as SVG bubbles on top of the foam wave)
    this._initFoamCrown();
  }

  /* ──────────────────────────────────────────────────────────
   * FOAM CROWN — bubble aeration texture at the top surface
   * ────────────────────────────────────────────────────────── */
  _initFoamCrown() {
    // Build a static <g id="foamCrown"> with randomised bubble circles
    const existing = this.svg.querySelector('#foamCrown');
    if (existing) return;

    const ns = 'http://www.w3.org/2000/svg';
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('id', 'foamCrown');
    g.setAttribute('clip-path', 'url(#glassClip)');
    g.setAttribute('pointer-events', 'none');

    // Seed: scattered foam bubbles across the top surface band (y 54–90)
    const bubbles = [
      // Large creamy bubbles
      { cx: 108, cy: 68, r: 10, op: 0.82 },
      { cx: 136, cy: 60, r: 13, op: 0.78 },
      { cx: 162, cy: 64, r: 11, op: 0.80 },
      { cx: 188, cy: 60, r: 12, op: 0.76 },
      // Medium bubbles
      { cx: 94,  cy: 74, r: 7,  op: 0.70 },
      { cx: 120, cy: 78, r: 8,  op: 0.72 },
      { cx: 150, cy: 72, r: 9,  op: 0.75 },
      { cx: 174, cy: 76, r: 7,  op: 0.68 },
      { cx: 200, cy: 70, r: 8,  op: 0.72 },
      // Small bubbles in gaps
      { cx: 86,  cy: 66, r: 5,  op: 0.60 },
      { cx: 126, cy: 68, r: 4,  op: 0.58 },
      { cx: 148, cy: 82, r: 5,  op: 0.62 },
      { cx: 168, cy: 80, r: 4,  op: 0.60 },
      { cx: 196, cy: 80, r: 5,  op: 0.58 },
      { cx: 112, cy: 84, r: 4,  op: 0.55 },
    ];

    bubbles.forEach(b => {
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', b.cx);
      circle.setAttribute('cy', b.cy);
      circle.setAttribute('r', b.r);
      circle.setAttribute('fill', '#fffde7');
      circle.setAttribute('opacity', b.op);
      g.appendChild(circle);

      // Small bright shine on each bubble (top-left catchlight)
      const shine = document.createElementNS(ns, 'circle');
      shine.setAttribute('cx', b.cx - b.r * 0.35);
      shine.setAttribute('cy', b.cy - b.r * 0.35);
      shine.setAttribute('r', Math.max(1, b.r * 0.28));
      shine.setAttribute('fill', '#ffffff');
      shine.setAttribute('opacity', '0.85');
      g.appendChild(shine);
    });

    // Insert after the toppings group so it sits on top of liquid but under face
    const toppings = this.svg.querySelector('#toppingsGroup');
    if (toppings && toppings.parentNode) {
      toppings.parentNode.insertBefore(g, toppings.nextSibling);
    } else {
      this.svg.appendChild(g);
    }
  }

  /* ──────────────────────────────────────────────────────────
   * MAIN RENDER — called by EmotionEngine on every state change
   * ────────────────────────────────────────────────────────── */
  render(state) {
    const emotion = this.dataset.emotions.find(e => e.id === state.currentEmotion);
    if (!emotion) return;

    // Elastic pop bounce animation on the glass
    if (this.svg) {
      this.svg.classList.remove('pop-bounce');
      void this.svg.offsetWidth;
      this.svg.classList.add('pop-bounce');
    }

    // ── 1. Glass Break & Spill Logic (sadness spectrum) ────────
    const isBrokenSad = (
      ['heartbroken', 'devastated', 'depressed', 'sad', 'melancholic', 'tearful'].includes(emotion.id) ||
      emotion.category === 'sadness'
    );

    if (this.glassCracks) this.glassCracks.style.opacity = isBrokenSad ? '1' : '0';
    if (this.spillGroup)  this.spillGroup.style.opacity  = isBrokenSad ? '1' : '0';

    // Drain liquid level for broken/sad state
    if (this.lassiRect) {
      if (isBrokenSad) {
        this.lassiRect.setAttribute('y', '140');
        this.lassiRect.setAttribute('height', '320');
      } else {
        this.lassiRect.setAttribute('y', '45');
        this.lassiRect.setAttribute('height', '420');
      }
    }

    // ── 2. Liquid Colour (SVG gradient stops) ─────────────────
    if (this.stop1 && this.stop2 && emotion.colors) {
      const [c1, c2] = emotion.colors;
      this.stop1.setAttribute('stop-color', c1);
      this.stop2.setAttribute('stop-color', c2);
    }

    // ── 3. Wave Surface Speed ──────────────────────────────────
    if (this.surfacePath) {
      const duration = Math.max(0.5, 4.0 - state.waveSpeed * 0.5);
      this.surfacePath.style.animationDuration = `${duration}s`;
    }

    // ── 4. Face Geometry & Emotion Morphs ─────────────────────
    const f = emotion.face || {};
    const intensity = state.intensity || 1.0;

    // Eyebrows
    if (this.eyebrowLeft && this.eyebrowRight) {
      this.eyebrowLeft.setAttribute( 'd', f.eyebrows?.leftD  || '');
      this.eyebrowRight.setAttribute('d', f.eyebrows?.rightD || '');
    }

    // Blush cheeks
    if (this.blushGroup) {
      this.blushGroup.style.opacity = f.blush !== false ? '1' : '0';
    }

    // Tears
    if (this.tearsLayer) {
      this.tearsLayer.style.opacity = (emotion.category === 'sadness' || f.tears) ? '1' : '0';
    }

    // Eyes
    this.renderEyeTypes(f, intensity);

    if (this.eyesGroup) {
      const clampedY = Math.max(-12, Math.min(12, f.eyeY || 0));
      this.eyesGroup.style.transform = `translateY(${clampedY}px) rotate(${f.eyeRot || 0}deg)`;
    }

    // Mouth — default is the cute 'V' shape from the reference photo
    if (this.mouthPath) {
      // Default = cute V-shape from reference image (two lines meeting at centre bottom)
      const defaultMouth = 'M 140 262 Q 150 274 160 262';
      let mouthD = f.mouthD || defaultMouth;
      this.mouthPath.setAttribute('d', mouthD);
      this.mouthPath.setAttribute('stroke', f.mouthStroke || '#1a1016');
      this.mouthPath.setAttribute('stroke-width', (f.mouthWidth || 4.5) * intensity);
      this.mouthPath.setAttribute('fill', f.fillMouth || 'none');
    }

    // Tongue
    if (this.tonguePath) {
      this.tonguePath.style.opacity = f.tongue ? '1' : '0';
    }

    // Face animation (bounce / shake / pulse / wobble)
    if (this.faceGroup) {
      this.faceGroup.style.animation = '';
      if (['happy', 'ecstatic', 'playful', 'joyful', 'cheerful', 'bouncy', 'delighted', 'blissful'].includes(emotion.id)) {
        this.faceGroup.style.animation = 'faceBounce 0.8s ease-in-out infinite';
      } else if (['angry', 'furious', 'enraged', 'annoyed', 'irritated', 'outraged', 'livid'].includes(emotion.id)) {
        this.faceGroup.style.animation = 'faceShake 0.35s linear infinite';
      } else if (['love', 'passionate', 'adoring', 'romantic', 'smitten', 'infatuated'].includes(emotion.id)) {
        this.faceGroup.style.animation = 'facePulse 1.2s ease-in-out infinite';
      } else if (['scared', 'terrified', 'anxious', 'panicked', 'nervous', 'startled'].includes(emotion.id)) {
        this.faceGroup.style.animation = 'faceWobble 0.5s ease-in-out infinite';
      }
    }

    // ── 5. Toppings (float on top of foam crown) ───────────────
    this.renderToppings(state.topping);
  }

  /* ──────────────────────────────────────────────────────────
   * EYE TYPE RENDERER — glossy kawaii eyes with catchlights
   * ────────────────────────────────────────────────────────── */
  renderEyeTypes(f, intensity) {
    const eyeType = f.eyeType || 'normal';
    const leftEyeGroup  = this.svg.querySelector('#eyeLeft');
    const rightEyeGroup = this.svg.querySelector('#eyeRight');
    if (!leftEyeGroup || !rightEyeGroup) return;

    const leftPupil   = leftEyeGroup.querySelector('.pupil');
    const rightPupil  = rightEyeGroup.querySelector('.pupil');
    const leftShine1  = leftEyeGroup.querySelector('.shine-big');
    const leftShine2  = leftEyeGroup.querySelector('.shine-small');
    const rightShine1 = rightEyeGroup.querySelector('.shine-big');
    const rightShine2 = rightEyeGroup.querySelector('.shine-small');
    const leftShape   = leftEyeGroup.querySelector('.eye-shape');
    const rightShape  = rightEyeGroup.querySelector('.eye-shape');

    // Reset everything
    [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
      if (el) el.style.display = 'block';
    });
    [leftShape, rightShape].forEach(s => {
      if (s) { s.setAttribute('d', ''); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'none'); }
    });

    if (eyeType === 'normal') {
      // Glossy round eyes — scaled by intensity, clamped to stay inside glass
      const rx = Math.max(8, Math.min(18, (f.eyeRx || 14) * intensity));
      const ry = Math.max(8, Math.min(18, (f.eyeRy || 14) * intensity));
      [leftPupil, rightPupil].forEach(p => {
        if (p) { p.setAttribute('rx', rx); p.setAttribute('ry', ry); }
      });
      // Ensure glossy catchlights are big & visible
      [leftShine1, rightShine1].forEach(s => {
        if (s) { s.setAttribute('r', '4.5'); s.setAttribute('cx', '-4'); s.setAttribute('cy', '-4'); }
      });
      [leftShine2, rightShine2].forEach(s => {
        if (s) { s.setAttribute('r', '2'); s.setAttribute('cx', '4'); s.setAttribute('cy', '4'); }
      });

    } else if (eyeType === 'happy_arc') {
      // ^__^ happy arc eyes (like reference image smile but for eyes)
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const arcD = 'M -14 4 Q 0 -13 14 4';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', arcD);
          s.setAttribute('stroke', '#1a1016');
          s.setAttribute('stroke-width', '4.5');
          s.setAttribute('stroke-linecap', 'round');
          s.setAttribute('fill', 'none');
        }
      });

    } else if (eyeType === 'sleepy_arc') {
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const arcD = 'M -14 -4 Q 0 9 14 -4';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', arcD);
          s.setAttribute('stroke', '#1a1016');
          s.setAttribute('stroke-width', '4.5');
          s.setAttribute('stroke-linecap', 'round');
          s.setAttribute('fill', 'none');
        }
      });

    } else if (eyeType === 'heart') {
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const heartD = 'M 0 -2 C -7 -12, -14 -4, 0 8 C 14 -4, 7 -12, 0 -2 Z';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', heartD);
          s.setAttribute('fill', '#ff4081');
          s.setAttribute('stroke', 'none');
        }
      });

    } else if (eyeType === 'x_dead') {
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const xD = 'M -9 -9 L 9 9 M -9 9 L 9 -9';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', xD);
          s.setAttribute('stroke', '#1a1016');
          s.setAttribute('stroke-width', '4');
          s.setAttribute('stroke-linecap', 'round');
          s.setAttribute('fill', 'none');
        }
      });

    } else if (eyeType === 'wink') {
      // Right eye winks (arc), left eye stays normal
      if (rightPupil)  rightPupil.style.display  = 'none';
      if (rightShine1) rightShine1.style.display = 'none';
      if (rightShine2) rightShine2.style.display = 'none';
      if (rightShape) {
        rightShape.setAttribute('d', 'M -14 4 Q 0 -13 14 4');
        rightShape.setAttribute('stroke', '#1a1016');
        rightShape.setAttribute('stroke-width', '4.5');
        rightShape.setAttribute('stroke-linecap', 'round');
        rightShape.setAttribute('fill', 'none');
      }

    } else if (eyeType === 'star_eyes') {
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const starD = 'M 0 -11 L 3 -3 L 11 0 L 3 3 L 0 11 L -3 3 L -11 0 L -3 -3 Z';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', starD);
          s.setAttribute('fill', '#ffd700');
          s.setAttribute('stroke', '#1a1016');
          s.setAttribute('stroke-width', '1.5');
        }
      });

    } else if (eyeType === 'cool_shades') {
      [leftPupil, rightPupil, leftShine1, leftShine2, rightShine1, rightShine2].forEach(el => {
        if (el) el.style.display = 'none';
      });
      const shadeD = 'M -18 -10 L 18 -10 Q 18 8 0 10 Q -18 8 -18 -10 Z';
      [leftShape, rightShape].forEach(s => {
        if (s) {
          s.setAttribute('d', shadeD);
          s.setAttribute('fill', '#1a1016');
          s.setAttribute('stroke', '#ffffff');
          s.setAttribute('stroke-width', '1');
        }
      });
    }
  }

  /* ──────────────────────────────────────────────────────────
   * TOPPINGS RENDERER — floats on top of the frothy foam crown
   * All y-coordinates calibrated for the new 300×420 viewBox:
   *   Foam top surface is at ~y=60–90 in the chubby glass
   * ────────────────────────────────────────────────────────── */
  renderToppings(toppingId) {
    if (!this.toppingsGroup) return;
    this.toppingsGroup.innerHTML = '';
    if (toppingId === 'none') return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'topping-item');

    if (toppingId === 'saffron') {
      g.innerHTML = `
        <ellipse cx="128" cy="100" rx="22" ry="7" fill="#ffb703" opacity="0.30"/>
        <ellipse cx="168" cy="96" rx="26" ry="8" fill="#ffb703" opacity="0.28"/>
        <path d="M 115 106 C 122 94, 128 100, 138 90" stroke="url(#saffronGrad)" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <circle cx="138" cy="90" r="1.8" fill="#d50000"/>
        <path d="M 152 108 C 160 96, 168 102, 178 88" stroke="url(#saffronGrad)" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="178" cy="88" r="1.6" fill="#d50000"/>
        <path d="M 135 112 C 142 102, 148 108, 158 98" stroke="url(#saffronGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M 170 110 C 178 102, 184 106, 192 96" stroke="url(#saffronGrad)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <circle cx="144" cy="104" r="3" fill="#ffab00" opacity="0.7"/>
      `;

    } else if (toppingId === 'pistachio') {
      // 3D chopped pistachio nut slivers on foam
      g.innerHTML = `
        <!-- Pista sliver 1 -->
        <polygon points="108,80 120,72 126,78 114,86" fill="url(#pistaGrad)" stroke="#2e7d32" stroke-width="1"/>
        <path d="M 110 78 L 120 74" stroke="#dce775" stroke-width="1.2" stroke-linecap="round"/>

        <!-- Pista sliver 2 -->
        <polygon points="148,74 162,68 168,76 154,82" fill="url(#pistaGrad)" stroke="#2e7d32" stroke-width="1"/>
        <path d="M 151 73 L 163 70" stroke="#ffffff" stroke-width="1" opacity="0.8"/>

        <!-- Pista sliver 3 -->
        <polygon points="130,84 140,78 146,85 136,90" fill="url(#pistaGrad)" stroke="#1b5e20" stroke-width="1"/>

        <!-- Pista sliver 4 (right side) -->
        <polygon points="175,76 186,70 191,78 180,84" fill="url(#pistaGrad)" stroke="#2e7d32" stroke-width="1"/>
        <path d="M 177 75 L 188 72" stroke="#dce775" stroke-width="1" opacity="0.9"/>

        <!-- Crushed pista dust particles -->
        <circle cx="100" cy="82" r="2.2" fill="#76ba1b"/>
        <circle cx="124" cy="70" r="2"   fill="#558b2f"/>
        <circle cx="172" cy="80" r="2.4" fill="#76ba1b"/>
        <circle cx="192" cy="72" r="1.8" fill="#aed581"/>
        <circle cx="142" cy="88" r="1.6" fill="#33691e"/>
      `;

    } else if (toppingId === 'rose') {
      // Velvet rose petals on foam with rose syrup dew drops
      g.innerHTML = `
        <!-- Petal 1 — left -->
        <path d="M 106 80 C 100 68, 120 64, 128 74 C 134 82, 114 88, 106 80 Z" fill="url(#roseGrad)" stroke="#880e4f" stroke-width="1"/>
        <path d="M 111 72 Q 118 76 122 74" stroke="#ff80ab" stroke-width="1.2" fill="none" opacity="0.75"/>

        <!-- Petal 2 — right -->
        <path d="M 154 76 C 148 62, 172 60, 178 72 C 183 80, 162 86, 154 76 Z" fill="url(#roseGrad)" stroke="#880e4f" stroke-width="1"/>
        <path d="M 158 68 Q 165 72 171 70" stroke="#ff80ab" stroke-width="1.2" fill="none" opacity="0.75"/>

        <!-- Petal 3 — centre -->
        <path d="M 132 86 C 126 74, 146 70, 152 82 C 156 90, 138 94, 132 86 Z" fill="url(#roseGrad)" opacity="0.95"/>
        <path d="M 136 78 Q 142 82 146 80" stroke="#ff80ab" stroke-width="1" fill="none" opacity="0.65"/>

        <!-- Petal 4 — far right small -->
        <path d="M 182 70 C 178 60, 194 58, 196 68 C 198 75, 184 76, 182 70 Z" fill="url(#roseGrad)" opacity="0.85"/>

        <!-- Rose syrup dew drops -->
        <circle cx="128" cy="74" r="2.2" fill="#ffffff" opacity="0.88"/>
        <circle cx="170" cy="70" r="2"   fill="#ffffff" opacity="0.88"/>
        <circle cx="148" cy="84" r="1.6" fill="#ff80ab" opacity="0.70"/>
      `;

    } else if (toppingId === 'mango') {
      // Thick mango pulp drizzle swirl + 3D diced mango cubes
      g.innerHTML = `
        <!-- Thick mango pulp swirl drizzle -->
        <path d="M 82 84 C 112 68, 154 96, 216 78" stroke="url(#mangoGrad)" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Glossy specular on swirl -->
        <path d="M 85 82 C 112 68, 154 96, 213 77" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>

        <!-- 3D Mango cube 1 -->
        <rect x="116" y="70" width="13" height="12" rx="3" fill="#ffb703" stroke="#e65100" stroke-width="1" transform="rotate(12 122 76)"/>
        <!-- Cube 1 specular catchlight -->
        <rect x="118" y="72" width="5" height="4" rx="1" fill="#ffffff" opacity="0.60" transform="rotate(12 122 76)"/>

        <!-- 3D Mango cube 2 -->
        <rect x="162" y="66" width="15" height="12" rx="3" fill="#ffb703" stroke="#e65100" stroke-width="1" transform="rotate(-15 169 72)"/>
        <!-- Cube 2 specular catchlight -->
        <rect x="164" y="68" width="5" height="4" rx="1" fill="#ffffff" opacity="0.60" transform="rotate(-15 169 72)"/>

        <!-- Small mango droplets -->
        <circle cx="138" cy="80" r="3.5" fill="#ffca28" opacity="0.85"/>
        <circle cx="196" cy="74" r="2.8" fill="#ffb703" opacity="0.80"/>
      `;

    } else if (toppingId === 'sprinkles') {
      // 3D candy sprinkles — cylindrical with specular highlights
      g.innerHTML = `
        <!-- Sprinkle 1 — hot pink -->
        <rect x="110" y="76" width="12" height="5" rx="2.5" fill="#ff007f" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" transform="rotate(25 116 78)"/>
        <rect x="111" y="77" width="9"  height="2" rx="1"   fill="#ffffff" opacity="0.70" transform="rotate(25 116 78)"/>

        <!-- Sprinkle 2 — cyan -->
        <rect x="144" y="70" width="12" height="5" rx="2.5" fill="#00e5ff" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" transform="rotate(-15 150 72)"/>
        <rect x="145" y="71" width="9"  height="2" rx="1"   fill="#ffffff" opacity="0.70" transform="rotate(-15 150 72)"/>

        <!-- Sprinkle 3 — yellow -->
        <rect x="174" y="76" width="12" height="5" rx="2.5" fill="#ffd93d" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" transform="rotate(40 180 78)"/>
        <rect x="175" y="77" width="9"  height="2" rx="1"   fill="#ffffff" opacity="0.70" transform="rotate(40 180 78)"/>

        <!-- Sprinkle 4 — lime green -->
        <rect x="128" y="82" width="12" height="5" rx="2.5" fill="#76ba1b" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" transform="rotate(-28 134 84)"/>
        <rect x="129" y="83" width="9"  height="2" rx="1"   fill="#ffffff" opacity="0.70" transform="rotate(-28 134 84)"/>

        <!-- Sprinkle 5 — coral -->
        <rect x="192" y="70" width="12" height="5" rx="2.5" fill="#ff6b6b" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" transform="rotate(15 198 72)"/>
        <rect x="193" y="71" width="9"  height="2" rx="1"   fill="#ffffff" opacity="0.70" transform="rotate(15 198 72)"/>

        <!-- Scatter dots for extra sparkle -->
        <circle cx="102" cy="80" r="2.5" fill="#ff007f" opacity="0.80"/>
        <circle cx="162" cy="80" r="2"   fill="#00e5ff" opacity="0.75"/>
        <circle cx="206" cy="76" r="2.2" fill="#ffd93d" opacity="0.80"/>
      `;
    }

    this.toppingsGroup.appendChild(g);
  }
}
