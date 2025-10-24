const EMOTIONS = [
  'happy','sad','angry','surprised','disgusted','fearful','calm','excited','sleepy','bored',
  'shy','proud','embarrassed','anxious','confident','love','jealous','playful','determined','relaxed',
  'confused','curious','suspicious','hopeful','disappointed','content','nostalgic','frustrated','astonished','mischievous',
  'grateful','overwhelmed','peaceful','energetic','dreamy','silly','scared','relieved','chilly','hot',
  'hyper','lazy','melancholic','tense','serene','ecstatic','jealous2','wistful'
];

// normalize list to unique non-duplicate names (remove 'jealous2' rename)
EMOTIONS[46] = 'jealous2'; // we'll treat as 'jealous-intense'

const emotionContainer = document.getElementById('emotions');
const particles = document.getElementById('particles');
const glass = document.getElementById('glass');
const lassiGroup = document.getElementById('lassiGroup');

function makeButton(name){
  const btn = document.createElement('button');
  btn.textContent = name.replace(/^[a-z]/, c=>c.toUpperCase());
  btn.addEventListener('click', ()=>applyEmotion(name));
  return btn;
}

EMOTIONS.forEach(e=>emotionContainer.appendChild(makeButton(e)));

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

function applyEmotion(name){
  resetEmotion();
  const cls = 'emotion-' + name.replace(/[^a-z0-9]/g,'-');
  // apply on stage wrapper (body/app) or svg
  document.querySelector('.app').classList.add(cls);

  // trigger some programmatic particle effects for select emotions
  if(name==='happy' || name==='ecstatic' || name==='energetic'){
    emitConfetti({count:28});
  }
  if(name==='sad' || name==='scared'){
    emitTears({count:8});
  }
  if(name==='playful' || name==='silly'){
    emitBubbles({count:18});
  }
  if(name==='angry' || name==='frustrated'){
    emitSparks({count:12});
  }

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

// A small helper to clear particles periodically
setInterval(()=>{
  const now = Date.now();
  // remove if too many
  if(particles.children.length>200) particles.innerHTML = '';
},2000);

// initialize with a default emotion
applyEmotion('happy');
