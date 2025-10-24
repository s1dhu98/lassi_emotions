# Lassi Emotions — Interactive Animation Demo 🥛✨

An interactive web animation featuring a glass of lassi that responds to 60+ emotions with dynamic facial expressions, particle effects, and color transformations. Built with pure SVG, CSS, and JavaScript.

## ✨ Features

- **60+ Unique Emotions** across 10 emotional spectrums:
  - Joy (happy, ecstatic, delighted...)
  - Sadness (sad, melancholic, gloomy...)
  - Anger (angry, furious, grumpy...)
  - Fear (scared, anxious, nervous...)
  - Love (love, adoring, passionate...)
  - And many more!

- **Rich Visual Effects**:
  - Dynamic facial expressions
  - Liquid animations with color changes
  - Particle systems (confetti, tears, hearts, stars)
  - Rainbow bubbles and sparks

- **Interactive UI**:
  - Search emotions in real-time
  - Random emotion button
  - Reset animation state
  - Mobile-friendly interface

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in a modern browser
   - Windows: Right-click → Open with → Chrome/Firefox/Edge
   - Mac: Open with Safari/Chrome
   - Linux: `xdg-open index.html`

## 🎨 Customization

### Adding New Emotions

1. Add your emotion to the `EMOTIONS` array in `script.js`:
```javascript
const EMOTIONS = [
  'your-emotion',
  // ... existing emotions
];
```

2. Add CSS styles in `styles.css`:
```css
.emotion-your-emotion {
  /* Base styles */
}

.emotion-your-emotion #lassi {
  /* Lassi styles */
}

.emotion-your-emotion #face {
  /* Face animation */
}
```

### Modifying Animations

- Particle effects: Adjust counts and speeds in `script.js`
- Face expressions: Modify SVG paths in the `animateFace()` function
- Colors: Update gradients in `updateLiquidGradient()`

## 💻 Browser Support

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Device Support

- Desktop: Full experience with all animations
- Tablet: Optimized layout and particle counts
- Mobile: Touch-friendly UI with performance optimizations
- Low-power devices: Automatic animation simplification

## 🛠 Technical Details

### File Structure
```
├── index.html      # Main HTML and SVG structure
├── styles.css      # Animations and responsive styles
└── script.js       # Interaction and particle system
```

### Technologies
- SVG for scalable graphics
- CSS3 animations and transforms
- Vanilla JavaScript (no dependencies)
- Responsive design with CSS Grid/Flexbox

### Performance Features
- Dynamic particle count adjustment
- Automatic cleanup of completed animations
- Touch event optimization
- Responsive image scaling
- Font preloading

## 🤝 Contributing

Feel free to:
- Add new emotions
- Improve animations
- Enhance particle effects
- Optimize performance

## 📝 License

MIT License - Feel free to use and modify!

## 🐛 Troubleshooting

If animations aren't smooth:
1. Try reducing browser tabs
2. Check hardware acceleration settings
3. Use a more powerful device

For best experience:
- Use a modern browser
- Enable hardware acceleration
- View on a device with decent GPU

---

Created with 💖 and lots of lassi! Enjoy!
