/* Lassi Emotions - HD PNG Mood Card Generator */

export class CardExporter {
  static exportCard(state, dataset, i18n) {
    const emotion = dataset.emotions.find(e => e.id === state.currentEmotion);
    if (!emotion) return;

    const width = 800;
    const height = 1000;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Aesthetic Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#071029');
    bgGrad.addColorStop(0.5, '#0f1724');
    bgGrad.addColorStop(1, '#18233c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Glassmorphic Card Outer Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // 3. Header Text
    ctx.fillStyle = '#ffd57e';
    ctx.font = '800 32px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥛 LASSI EMOTIONS', width / 2, 90);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.fillText('DAILY MOOD CARD', width / 2, 120);

    // 4. Emotion Title Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(100, 160, 600, 120, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 213, 126, 0.4)';
    ctx.stroke();

    const emotionTitle = `${emotion.nameEn} (${emotion.nameHi})`;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 42px Outfit, sans-serif';
    ctx.fillText(emotionTitle, width / 2, 225);

    ctx.fillStyle = '#ffd57e';
    ctx.font = '700 18px Outfit, sans-serif';
    ctx.fillText(`INTENSITY: ${Math.round((state.intensity || 1.0) * 100)}%  •  CATEGORY: ${emotion.category.toUpperCase()}`, width / 2, 260);

    // 5. Draw SVG Lassi Glass Illustration onto Canvas
    const svgEl = document.getElementById('glass');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, width / 2 - 195, 320, 390, 510);

        // 6. Footer Badge & Topping Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(150, 870, 500, 50, 25);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 16px Outfit, sans-serif';
        ctx.fillText(`TOPPING: ${state.topping.toUpperCase()}  |  THEME: ${state.theme.toUpperCase()}`, width / 2, 902);

        // 7. Trigger PNG Download
        const a = document.createElement('a');
        a.download = `lassi-mood-${state.currentEmotion}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();

        URL.revokeObjectURL(blobURL);
      };
      img.src = blobURL;
    }
  }
}
