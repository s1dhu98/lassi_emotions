# Lassi Emotions Configuration Guide 🛠️

This guide covers all configurable aspects of the Lassi Emotions animation system.

## 🎨 Visual Configurations

### Colors and Gradients

```css
:root {
  --bg: #0f1724;              /* Background color */
  --panel: #0b1220;           /* Sidebar background */
  --accent: #ffd57e;          /* Primary accent color */
  --glass: #eaf6ff;          /* Glass reflection color */
  --gradient-1: linear-gradient(45deg, #ff6b6b, #ffd93d);
  --gradient-2: linear-gradient(45deg, #4facfe, #00f2fe);
  --gradient-3: linear-gradient(45deg, #fa709a, #fee140);
}
```

### Emotion-Specific Colors

Each emotion can have its own color palette in `styles.css`:

```css
.emotion-happy {
  --happy-color: #ffeb3b;
}

.emotion-sad {
  --sad-color: #e6f3ff;
}
```

## 🎭 Animation Settings

### Timing Functions

```css
:root {
  --animation-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --animation-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Particle System Configuration

In `script.js`:

```javascript
const PARTICLE_CONFIG = {
  confetti: {
    baseCount: 28,
    speedRange: [1200, 1800],
    sizeRange: [6, 18],
    colors: ['#FFD700', '#FFA500', '#FF69B4']
  },
  bubbles: {
    baseCount: 18,
    speedRange: [1000, 2500],
    sizeRange: [6, 26],
    opacity: [0.3, 0.9]
  },
  tears: {
    baseCount: 8,
    speedRange: [700, 1400],
    width: [3, 6],
    height: [6, 12]
  }
};
```

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1201px) {
  /* Full experience */
}

/* Tablet */
@media (max-width: 1200px) {
  /* Optimized layout */
}

/* Mobile */
@media (max-width: 900px) {
  /* Touch-friendly */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Minimal layout */
}
```

## ⚡ Performance Settings

### Device-Based Optimizations

```javascript
const PERFORMANCE_CONFIG = {
  mobile: {
    particleMultiplier: 0.6,
    maxParticles: 100,
    cleanupInterval: 1000
  },
  lowPower: {
    particleMultiplier: 0.3,
    maxParticles: 50,
    cleanupInterval: 500
  },
  desktop: {
    particleMultiplier: 1.0,
    maxParticles: 200,
    cleanupInterval: 2000
  }
};
```

## 🎯 Animation Timings

### Base Animations

```css
/* Face animations */
.face-transition {
  transition-duration: 300ms;
  transition-timing-function: var(--animation-bounce);
}

/* Liquid animations */
.liquid-wave {
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
}

/* Particle effects */
.particle {
  animation-duration: 1000ms;
  animation-timing-function: ease-out;
}
```

## 🔧 SVG Configuration

### Glass Dimensions

```svg
<svg viewBox="0 0 300 500">
  <!-- Adjustable glass parameters -->
  <defs>
    <clipPath id="glassClip">
      <path d="M60 30 L240 30 L210 420 L90 420 Z" />
    </clipPath>
  </defs>
</svg>
```

## 🎮 UI Configuration

### Button Styles

```css
.controls button {
  padding: 14px;
  border-radius: 12px;
  transition: all 0.3s var(--animation-bounce);
}
```

### Grid Layout

```css
.emotions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  max-height: 60vh;
}
```

## 🔍 Search Configuration

```javascript
const SEARCH_CONFIG = {
  debounceTime: 150,      // ms to wait before searching
  minLength: 2,           // minimum characters to start search
  fuzzyMatch: true,       // enable fuzzy matching
  highlightResults: true  // highlight matching text
};
```

## 📊 Performance Thresholds

```javascript
const THRESHOLD_CONFIG = {
  particleLimit: 200,     // maximum particles at once
  fpsMin: 30,            // minimum acceptable FPS
  cleanupDelay: 2000,    // ms between cleanup cycles
  animationTimeout: 5000  // ms until force-stopping long animations
};
```

## 🌈 Gradient Presets

```javascript
const GRADIENT_PRESETS = {
  joy: ['#fff1b8', '#ffe6b3'],
  love: ['#ffe6eb', '#fff0f3'],
  anger: ['#ffcdd2', '#ffebee'],
  calm: ['#e8f5e9', '#c8e6c9'],
  energy: ['#fff3e0', '#ffe0b2']
};
```

## 🔄 Event Configuration

```javascript
const EVENT_CONFIG = {
  touchDelay: 100,        // ms delay for touch events
  resizeDebounce: 250,    // ms to debounce resize events
  scrollThrottle: 16,     // ms to throttle scroll events
  animationEnd: 'animationend transitionend'
};
```

---

### How to Apply Changes

1. Edit the relevant configuration section
2. Save the file
3. Refresh the browser to see changes
4. Test on different devices when modifying responsive settings

### Tips

- Test performance settings on actual devices
- Use CSS variables for easy theme changes
- Adjust particle counts based on device capabilities
- Monitor frame rates when changing animation settings

### Debug Mode

Add `?debug=true` to the URL to enable:
- FPS counter
- Particle count display
- Animation timing logs
- Performance metrics
