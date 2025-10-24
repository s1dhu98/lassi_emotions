// Enhanced emotions with intensity levels and categories
const EMOTIONS = [
  // Joy spectrum
  'happy', 'ecstatic', 'joyful', 'delighted', 'cheerful', 'blissful',
  // Sadness spectrum
  'sad', 'melancholic', 'gloomy', 'depressed', 'heartbroken', 'devastated',
  // Anger spectrum
  'angry', 'furious', 'enraged', 'irritated', 'annoyed', 'grumpy',
  // Fear spectrum
  'scared', 'terrified', 'anxious', 'nervous', 'worried', 'panicked',
  // Love spectrum
  'love', 'adoring', 'affectionate', 'romantic', 'passionate', 'smitten',
  // Surprise spectrum
  'surprised', 'shocked', 'astonished', 'amazed', 'startled', 'dumbfounded',
  // Energy spectrum
  'energetic', 'hyper', 'excited', 'bouncy', 'vibrant', 'lively',
  // Calm spectrum
  'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen',
  // Playful spectrum
  'playful', 'silly', 'mischievous', 'goofy', 'giggly', 'whimsical',
  // Confidence spectrum
  'confident', 'proud', 'bold', 'determined', 'brave', 'heroic'
];

// normalize list to unique non-duplicate names (remove 'jealous2' rename)
EMOTIONS[46] = 'jealous2'; // we'll treat as 'jealous-intense'

const emotionContainer = document.getElementById('emotions');
const particles = document.getElementById('particles');
const glass = document.getElementById('glass');
const lassiGroup = document.getElementById('lassiGroup');

// Search functionality
const searchInput = document.getElementById('emotion-search');
let filteredEmotions = [...EMOTIONS];

function makeButton(name) {
  const btn = document.createElement('button');
  const span = document.createElement('span');
  span.textContent = name.replace(/^[a-z]/, c => c.toUpperCase());
  btn.appendChild(span);
  btn.addEventListener('click', () => applyEmotion(name));
  return btn;
}

function updateEmotionsList(filter = '') {
  emotionContainer.innerHTML = '';
  const filtered = EMOTIONS.filter(e => 
    e.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(e => emotionContainer.appendChild(makeButton(e)));
  filteredEmotions = filtered;
}

searchInput.addEventListener('input', (e) => {
  updateEmotionsList(e.target.value);
});

// Initial render
updateEmotionsList();

document.getElementById('btn-random').addEventListener('click', ()=>{
  const r = EMOTIONS[Math.floor(Math.random()*EMOTIONS.length)];
  applyEmotion(r);
});
document.getElementById('btn-reset').addEventListener('click', resetEmotion);

function resetEmotion(){
  // Remove only classes that start with "emotion-" without wiping other classes like "app"
  const root = document.querySelector('.app');
  if(root){
    // collect to avoid modifying while iterating
    const toRemove = [];
    root.classList.forEach(c=>{ if(c.startsWith('emotion-')) toRemove.push(c); });
    toRemove.forEach(c=>root.classList.remove(c));
  }

  // Also defensively remove any emotion-* classes on other elements
  document.querySelectorAll('[class]').forEach(el=>{
    const remove = [];
    el.classList.forEach(c=>{ if(c.startsWith && c.startsWith('emotion-')) remove.push(c); });
    remove.forEach(c=>el.classList.remove(c));
  });

  // reset face transforms and attributes to defaults
  try{
    const mouth = document.getElementById('mouth');
    const eyes = document.getElementById('eyes');
    if(mouth) mouth.setAttribute('d','M130 285 Q150 300 170 285');
    if(eyes){
      eyes.style.transform = '';
      eyes.querySelectorAll('ellipse').forEach(el=>{ el.setAttribute('rx',8); el.setAttribute('ry',6); });
    }
  }catch(e){/* ignore if SVG not yet available */}

  // clear particles and any dynamic keyframes/styles
  particles.innerHTML = '';
  const dyn = document.getElementById('dynamic-animations');
  if(dyn) dyn.remove();
}

function applyEmotion(name) {
  resetEmotion();
  const cls = 'emotion-' + name.replace(/[^a-z0-9]/g, '-');
  document.querySelector('.app').classList.add(cls);

  // Enhanced emotion-based effects
  const emotionType = name.toLowerCase();
  
  // Joy spectrum
  if(['happy', 'ecstatic', 'joyful', 'delighted', 'cheerful', 'blissful'].includes(emotionType)) {
    emitConfetti({ count: 35, colors: ['#FFD700', '#FFA500', '#FF69B4'] });
    animateFace('happy', { intensity: emotionType === 'ecstatic' ? 1.5 : 1 });
  }
  
  // Sadness spectrum
  if(['sad', 'melancholic', 'gloomy', 'depressed', 'heartbroken', 'devastated'].includes(emotionType)) {
    emitTears({ count: emotionType === 'devastated' ? 12 : 8 });
    animateFace('sad', { intensity: emotionType === 'devastated' ? 1.5 : 1 });
  }
  
  // Playful spectrum
  if(['playful', 'silly', 'mischievous', 'goofy', 'giggly', 'whimsical'].includes(emotionType)) {
    emitBubbles({ count: 24, rainbow: true });
    animateFace('playful', { bouncy: true });
  }
  
  // Anger spectrum
  if(['angry', 'furious', 'enraged', 'irritated', 'annoyed', 'grumpy'].includes(emotionType)) {
    emitSparks({ count: emotionType === 'furious' ? 20 : 12 });
    animateFace('angry', { intensity: emotionType === 'furious' ? 1.5 : 1 });
  }
  
  // Love spectrum
  if(['love', 'adoring', 'affectionate', 'romantic', 'passionate', 'smitten'].includes(emotionType)) {
    emitHearts({ count: 15 });
    animateFace('love');
  }

  // Surprise spectrum
  if(['surprised', 'shocked', 'astonished', 'amazed', 'startled'].includes(emotionType)) {
    emitStars({ count: 20 });
    animateFace('surprised');
  }

  // Update liquid color based on emotion
  updateLiquidGradient(emotionType);

  // change face shapes for a few emotions
  const mouth = document.getElementById('mouth');
  const eyes = document.getElementById('eyes');

  switch(name){
    case 'happy':
    case 'ecstatic':
      mouth.setAttribute('d','M130 285 Q150 310 170 285');
      break;
    case 'sad':
      mouth.setAttribute('d','M130 295 Q150 280 170 295');
      break;
    case 'angry':
      mouth.setAttribute('d','M130 290 Q150 276 170 290');
      break;
    case 'surprised':
      eyes.querySelectorAll('ellipse').forEach(el=>{el.setAttribute('rx',12);el.setAttribute('ry',10)});
      mouth.setAttribute('d','M140 290 Q150 310 160 290');
      break;
    case 'sleepy':
      eyes.style.transform = 'scaleY(0.2)';
      break;
    case 'silly':
      mouth.setAttribute('d','M130 295 Q150 320 170 295');
      break;
    default:
      // reset face
      eyes.querySelectorAll('ellipse').forEach(el=>{el.setAttribute('rx',8);el.setAttribute('ry',6)});
      mouth.setAttribute('d','M130 285 Q150 300 170 285');
  }
}

// small utility to create particles
function random(min,max){return Math.random()*(max-min)+min}

function emitConfetti({count=20}={}){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    const size = Math.floor(random(6,18));
    p.style.width = p.style.height = size+'px';
    p.style.left = (50+random(-80,80))+'%';
    p.style.top = (50+random(-10,10))+'%';
    p.style.background = `hsl(${Math.floor(random(0,360))} 80% 60%)`;
    p.style.transform = `translate(-50%,-50%)`;
    p.style.animation = `confetti-${i} 1600ms ease-out forwards`;
    p.style.opacity = '0.95';
    particles.appendChild(p);
    const dx = random(-240,240), dy = random(-300,-80), rot = random(-720,720);
    const key = `@keyframes confetti-${i}{to{transform:translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0.6);opacity:0}}`;
    injectKeyframes(key);
  }
}

function emitBubbles({count=12}={}){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    const size = Math.floor(random(6,26));
    p.style.width = p.style.height = size+'px';
    p.style.left = (50+random(-40,40))+'%';
    p.style.top = (65+random(-20,60))+'%';
    p.style.background = `rgba(255,255,255,${random(0.3,0.9)})`;
    p.style.border = '1px solid rgba(255,255,255,0.6)';
    p.style.animation = `bubble-${i} ${random(1200,3000)}ms linear forwards`;
    particles.appendChild(p);
    const dy = random(-260,-80), dx = random(-40,40);
    const key = `@keyframes bubble-${i}{to{transform:translate(${dx}px,${dy}px) scale(0.4);opacity:0}}`;
    injectKeyframes(key);
  }
}

function emitTears({count=6}={}){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    const w = Math.floor(random(6,12));
    p.style.width = (w/2)+'px';
    p.style.height = w+'px';
    p.style.left = (47+(i%2?4:-4))+'%';
    p.style.top = (52+random(0,20))+'%';
    p.style.background = 'linear-gradient(180deg,rgba(200,220,255,0.95),rgba(150,200,255,0.6))';
    p.style.borderRadius = '4px';
    p.style.animation = `tear-${i} ${random(700,1400)}ms ease-out forwards`;
    particles.appendChild(p);
    const key = `@keyframes tear-${i}{to{transform:translate(0,140px);opacity:0}}`;
    injectKeyframes(key);
  }
}

function emitSparks({count=10}={}){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    const size = Math.floor(random(4,10));
    p.style.width = p.style.height = size+'px';
    p.style.left = (50+random(-20,20))+'%';
    p.style.top = (50+random(-10,10))+'%';
    p.style.background = `radial-gradient(circle,#ffdb8a,#ff4f4f)`;
    p.style.animation = `spark-${i} ${random(300,900)}ms ease-out forwards`;
    particles.appendChild(p);
    const dx = random(-160,160), dy = random(-220, -60), rot = random(0,360);
    const key = `@keyframes spark-${i}{to{transform:translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0.2);opacity:0}}`;
    injectKeyframes(key);
  }
}

// inject keyframes into a one-off style tag to support unique particle animations
function injectKeyframes(rule){
  let sheet = document.getElementById('dynamic-animations');
  if(!sheet){
    const s = document.createElement('style');
    s.id = 'dynamic-animations';
    document.head.appendChild(s);
    sheet = s;
  }
  sheet.sheet.insertRule(rule, sheet.sheet.cssRules.length);
}

function animateFace(type, options = {}) {
  const mouth = document.getElementById('mouth');
  const eyes = document.getElementById('eyes');
  const face = document.getElementById('face');
  
  const intensity = options.intensity || 1;
  
  switch(type) {
    case 'happy':
      mouth.setAttribute('d', `M130 ${285 + 25 * intensity} Q150 ${310 + 30 * intensity} 170 ${285 + 25 * intensity}`);
      eyes.style.transform = 'scaleY(1.2)';
      if(options.bouncy) face.style.animation = 'bounce 0.8s infinite';
      break;
    case 'sad':
      mouth.setAttribute('d', `M130 ${295 - 15 * intensity} Q150 ${280 - 20 * intensity} 170 ${295 - 15 * intensity}`);
      eyes.style.transform = 'translateY(6px) scaleY(0.7)';
      break;
    case 'angry':
      mouth.setAttribute('d', `M130 ${290 - 10 * intensity} Q150 ${276 - 15 * intensity} 170 ${290 - 10 * intensity}`);
      eyes.style.transform = 'rotate(-5deg) scaleY(0.8)';
      break;
    case 'surprised':
      eyes.querySelectorAll('ellipse').forEach(el => {
        el.setAttribute('rx', 14);
        el.setAttribute('ry', 12);
      });
      mouth.setAttribute('d', 'M140 290 Q150 320 160 290');
      break;
    case 'love':
      mouth.setAttribute('d', 'M130 285 Q150 310 170 285');
      eyes.style.transform = 'scaleY(0.6)';
      face.style.animation = 'pulse 1s infinite';
      break;
    case 'playful':
      mouth.setAttribute('d', 'M130 285 Q150 320 170 285');
      eyes.style.transform = 'rotate(5deg)';
      face.style.animation = 'bounce 0.6s infinite';
      break;
  }
}

function updateLiquidGradient(emotion) {
  const lassi = document.getElementById('lassi');
  const colors = {
    happy: ['#fff1b8', '#ffe6b3'],
    sad: ['#e6f3ff', '#d1e8ff'],
    angry: ['#ffcdd2', '#ffebee'],
    love: ['#ffe6eb', '#fff0f3'],
    surprised: ['#e8f5e9', '#c8e6c9'],
    playful: ['#f3e5f5', '#e1bee7'],
    energetic: ['#fff3e0', '#ffe0b2'],
    calm: ['#e8f5e9', '#c8e6c9']
  };
  
  // Find the closest emotion category
  let colorKey = Object.keys(colors).find(key => emotion.includes(key)) || 'happy';
  
  // Create and apply gradient
  const grad = `linear-gradient(${colors[colorKey][0]}, ${colors[colorKey][1]})`;
  lassi.style.fill = grad;
}

function emitHearts({ count = 15 } = {}) {
  for(let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle heart';
    p.style.left = (50 + random(-30, 30)) + '%';
    p.style.top = (50 + random(-20, 20)) + '%';
    p.style.fontSize = random(15, 25) + 'px';
    p.innerHTML = '❤️';
    p.style.animation = `heart-${i} ${random(1500, 2500)}ms ease-out forwards`;
    particles.appendChild(p);
    
    const dx = random(-150, 150), dy = random(-200, -100);
    const key = `@keyframes heart-${i}{
      to{transform:translate(${dx}px,${dy}px) rotate(${random(-360, 360)}deg) scale(0.2);opacity:0}
    }`;
    injectKeyframes(key);
  }
}

function emitStars({ count = 20 } = {}) {
  for(let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle star';
    p.style.left = (50 + random(-40, 40)) + '%';
    p.style.top = (50 + random(-30, 30)) + '%';
    p.style.fontSize = random(15, 25) + 'px';
    p.innerHTML = '⭐';
    p.style.animation = `star-${i} ${random(1000, 2000)}ms ease-out forwards`;
    particles.appendChild(p);
    
    const dx = random(-200, 200), dy = random(-150, 150);
    const key = `@keyframes star-${i}{
      to{transform:translate(${dx}px,${dy}px) rotate(${random(-720, 720)}deg) scale(0.1);opacity:0}
    }`;
    injectKeyframes(key);
  }
}

// Enhanced bubble emission with rainbow option
function emitBubbles({count = 12, rainbow = false} = {}) {
  for(let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.floor(random(6, 26));
    p.style.width = p.style.height = size + 'px';
    p.style.left = (50 + random(-40, 40)) + '%';
    p.style.top = (65 + random(-20, 60)) + '%';
    
    if(rainbow) {
      const hue = random(0, 360);
      p.style.background = `hsla(${hue}, 80%, 80%, ${random(0.3, 0.9)})`;
      p.style.border = `1px solid hsla(${hue}, 80%, 70%, 0.6)`;
    } else {
      p.style.background = `rgba(255,255,255,${random(0.3, 0.9)})`;
      p.style.border = '1px solid rgba(255,255,255,0.6)';
    }
    
    p.style.animation = `bubble-${i} ${random(1200, 3000)}ms linear forwards`;
    particles.appendChild(p);
    
    const dy = random(-260, -80), dx = random(-40, 40);
    const key = `@keyframes bubble-${i}{to{transform:translate(${dx}px,${dy}px) scale(0.4);opacity:0}}`;
    injectKeyframes(key);
  }
}

// Automatically remove completed particles
function cleanupParticles() {
  const particles = document.querySelectorAll('.particle');
  particles.forEach(p => {
    if(p.getAnimations().every(a => a.playState === 'finished')) {
      p.remove();
    }
  });
}

// Performance optimizations for different devices
function optimizeForDevice() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const isLowPower = navigator.hardwareConcurrency <= 4;
  
  // Adjust particle counts for mobile/low-power devices
  const particleMultiplier = isMobile ? (isLowPower ? 0.3 : 0.6) : 1;
  
  return {
    confettiCount: Math.floor(28 * particleMultiplier),
    bubbleCount: Math.floor(18 * particleMultiplier),
    tearCount: Math.floor(8 * particleMultiplier),
    sparkCount: Math.floor(12 * particleMultiplier),
    heartCount: Math.floor(15 * particleMultiplier),
    starCount: Math.floor(20 * particleMultiplier),
    useSimpleAnimations: isMobile && isLowPower
  };
}

// Update particle emission functions to use optimized counts
function emitParticlesOptimized(type, baseCount) {
  const { useSimpleAnimations } = optimizeForDevice();
  const count = Math.floor(baseCount * (useSimpleAnimations ? 0.5 : 1));
  
  switch(type) {
    case 'confetti':
      emitConfetti({ count });
      break;
    case 'bubbles':
      emitBubbles({ count, rainbow: !useSimpleAnimations });
      break;
    case 'tears':
      emitTears({ count });
      break;
    case 'sparks':
      emitSparks({ count });
      break;
    case 'hearts':
      emitHearts({ count });
      break;
    case 'stars':
      emitStars({ count });
      break;
  }
}

// Cleanup particles periodically
setInterval(cleanupParticles, 1000);

// Mobile touch handling
function handleTouchStart(e) {
  // Prevent default only for buttons to allow scrolling
  if(e.target.tagName === 'BUTTON') {
    e.preventDefault();
  }
}

function setupMobileOptimizations() {
  // Add touch handlers
  document.addEventListener('touchstart', handleTouchStart, {passive: false});
  
  // Handle mobile height issues (Safari)
  function updateMobileHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  
  updateMobileHeight();
  window.addEventListener('resize', updateMobileHeight);
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(updateMobileHeight, 100);
  });
  
  // Improve scroll performance
  if(CSS.supports('overflow-anchor: auto')) {
    emotionContainer.style.overflowAnchor = 'none';
  }
}

// Setup mobile optimizations
setupMobileOptimizations();

// Initialize with a happy emotion
applyEmotion('happy');
