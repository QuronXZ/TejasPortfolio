// trail.js (updated)
const svg = document.querySelector('svg.trail');
const path = svg.querySelector('path');

// gradient stop elements (must match IDs in your SVG)
const stop1 = document.getElementById('trail-stop-1');
const stop2 = document.getElementById('trail-stop-2');
const stop3 = document.getElementById('trail-stop-3');

let points = [];
let segments = 100;
let mouse = { x: 0, y: 0 };

const move = (event) => {
  const x = event.clientX;
  const y = event.clientY;

  mouse.x = x;
  mouse.y = y;

  if (points.length === 0) {
    for (let i = 0; i < segments; i++) {
      points.push({ x, y });
    }
  }
};

const anim = () => {
  let px = mouse.x;
  let py = mouse.y;

  points.forEach((p, index) => {
    p.x = px;
    p.y = py;

    let n = points[index + 1];
    if (n) {
      px = px - (p.x - n.x) * 0.6;
      py = py - (p.y - n.y) * 0.6;
    }
  });

  path.setAttribute('d', `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`);

  requestAnimationFrame(anim);
};

const resize = () => {
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  svg.style.width = ww + 'px';
  svg.style.height = wh + 'px';
  svg.setAttribute('viewBox', `0 0 ${ww} ${wh}`);
};

document.addEventListener('mousemove', move);
window.addEventListener('resize', resize);

anim();
resize();

/* ----------------------------
   Gradient color shifting logic
   ---------------------------- */

// Define a palette of gradient triplets (each entry = [stop1, stop2, stop3])
const palettes = [
  ['#ff99cc', '#99ccff', '#ccff99'],
  ['#ffaaff', '#aaffcc', '#aaccff'],
  ['#ffcc99', '#cc99ff', '#99ffcc'],
  ['#ffc0cb', '#87cefa', '#e0ffff'],
  ['#ffd1e6', '#d1ffe0', '#cce0ff']
];

let paletteIndex = 0;
const changeInterval = 3000; // milliseconds between palette shifts

function applyPalette(index) {
  const [c1, c2, c3] = palettes[index];
  if (stop1) stop1.setAttribute('stop-color', c1);
  if (stop2) stop2.setAttribute('stop-color', c2);
  if (stop3) stop3.setAttribute('stop-color', c3);
}

function shiftGradient() {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  applyPalette(paletteIndex);
}

// initialize with first palette
applyPalette(paletteIndex);

// change palette on an interval
setInterval(shiftGradient, changeInterval);
