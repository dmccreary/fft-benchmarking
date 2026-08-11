// Roots of Unity Unit Circle MicroSim
// CANVAS_HEIGHT: 475
// The twiddle factors for an N-point FFT are the N roots of unity: N evenly
// spaced points on the same unit circle from Chapter 7.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 130;
let defaultTextSize = 16;

let nSlider;
let N = 8;
let selectedK = 1;
let pointPositions = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // 2 -> N=4, 5 -> N=32
  nSlider = createSlider(2, 5, 3, 1);
  nSlider.position(sliderLeftMargin, drawHeight + 12);
  nSlider.parent(document.querySelector('main'));
  nSlider.size(200);

  describe('A unit circle with N evenly spaced twiddle factors plotted as ' +
    'points, beside a table listing each root\'s index, angle, and complex ' +
    'value.', LABEL);
}

// W_N^k = e^(-i*2*pi*k/N) — the negative sign is the forward-transform
// convention, so the points advance clockwise from 1 + 0i.
function root(k) {
  const angle = (-2 * Math.PI * k) / N;
  return { angle: angle, re: Math.cos(angle), im: Math.sin(angle) };
}

function draw() {
  updateCanvasSize();
  const newN = Math.pow(2, nSlider.value());
  if (newN !== N) {
    N = newN;
    selectedK = Math.min(selectedK, N - 1);
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCircle();
  drawTable();
  drawSelectedReadout();
  drawControlLabels();
}

function circleGeometry() {
  const tableW = constrain(canvasWidth * 0.36, 200, 300);
  const availW = canvasWidth - tableW - 60;
  const r = constrain(availW / 2 - 10, 60, 112);
  return { cx: 30 + r + 24, cy: 182, r: r, tableW: tableW };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Roots of Unity: The Twiddle Factors', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCircle() {
  const g = circleGeometry();
  pointPositions = [];

  // Axes
  stroke('lightgray');
  strokeWeight(1);
  line(g.cx - g.r - 20, g.cy, g.cx + g.r + 20, g.cy);
  line(g.cx, g.cy - g.r - 20, g.cx, g.cy + g.r + 20);

  noFill();
  stroke('gray');
  strokeWeight(2);
  circle(g.cx, g.cy, g.r * 2);

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Re', g.cx + g.r + 6, g.cy - 12);
  textAlign(CENTER, BOTTOM);
  text('Im', g.cx + 38, g.cy - g.r - 18);

  for (let k = 0; k < N; k++) {
    const w = root(k);
    const px = g.cx + w.re * g.r;
    const py = g.cy - w.im * g.r;
    pointPositions.push({ k: k, x: px, y: py });

    const isZero = k === 0;
    const isSel = k === selectedK;

    stroke(isSel ? 'crimson' : isZero ? 'darkorange' : 'lightsteelblue');
    strokeWeight(isSel ? 2.5 : 1);
    line(g.cx, g.cy, px, py);

    noStroke();
    fill(isSel ? 'crimson' : isZero ? 'darkorange' : 'mediumblue');
    circle(px, py, isSel ? 14 : isZero ? 12 : 8);

    if (N <= 8 || isSel || isZero) {
      fill(isSel ? 'crimson' : isZero ? 'darkorange' : 'dimgray');
      textSize(12);
      textAlign(CENTER, CENTER);
      text('k=' + k, g.cx + w.re * (g.r + 18), g.cy - w.im * (g.r + 18));
    }
  }

  noStroke();
  fill('darkorange');
  textSize(12);
  textAlign(CENTER, TOP);
  text('k = 0 is always 1 + 0i', g.cx, g.cy + g.r + 30);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTable() {
  const g = circleGeometry();
  const x = canvasWidth - g.tableW - 20;
  const y = 52;
  const w = g.tableW;
  const h = 268;
  if (w < 170) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 8);

  const rowH = constrain((h - 26) / N, 9, 20);
  const fs = constrain(rowH - 3, 8, 12);

  noStroke();
  fill('black');
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('k', x + 10, y + 6);
  text('angle', x + 42, y + 6);
  text('W_N^k = a + bi', x + 112, y + 6);
  textStyle(NORMAL);

  stroke('silver');
  line(x + 6, y + 22, x + w - 6, y + 22);

  for (let k = 0; k < N; k++) {
    const ry = y + 26 + k * rowH;
    const w2 = root(k);
    const isSel = k === selectedK;

    if (isSel) {
      noStroke();
      fill(255, 235, 235);
      rect(x + 4, ry - 1, w - 8, rowH);
    }

    noStroke();
    textSize(fs);
    textAlign(LEFT, TOP);
    fill(isSel ? 'crimson' : k === 0 ? 'darkorange' : 'dimgray');
    if (isSel) textStyle(BOLD);
    text(k, x + 10, ry);
    text('-2π·' + k + '/' + N, x + 42, ry);
    text(fmt(w2.re) + (w2.im < 0 ? ' − ' : ' + ') + fmt(Math.abs(w2.im)) + 'i',
         x + 112, ry);
    textStyle(NORMAL);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSelectedReadout() {
  const g = circleGeometry();
  const y = 336;
  const h = 74;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const w = root(selectedK);
  const deg = (selectedK / N) * 360;

  noStroke();
  textAlign(LEFT, TOP);
  fill('crimson');
  textStyle(BOLD);
  textSize(15);
  text('W_' + N + '^' + selectedK + '  =  e^(-i·2π·' + selectedK + '/' + N + ')' +
       '  =  ' + fmt(w.re) + (w.im < 0 ? ' − ' : ' + ') +
       fmt(Math.abs(w.im)) + 'i', margin + 12, y + 10);
  textStyle(NORMAL);

  fill('black');
  textSize(13);
  text('Angle: -2π·' + selectedK + '/' + N + ' rad  =  -' + deg.toFixed(1) +
       '°   •   Magnitude: ' +
       Math.sqrt(w.re * w.re + w.im * w.im).toFixed(3) +
       '  (every root sits exactly on the unit circle)',
       margin + 12, y + 34);

  fill('dimgray');
  textSize(12);
  text('Spacing between neighbouring roots: 360/' + N + ' = ' +
       (360 / N).toFixed(1) + '° — always evenly divided.',
       margin + 12, y + 54);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function fmt(v) {
  const r = Math.abs(v) < 1e-9 ? 0 : v;
  return r.toFixed(3);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('N = ' + N, 10, drawHeight + 22);
  fill('dimgray');
  textSize(13);
  text('Click any point on the circle to select its root.', 350, drawHeight + 22);
}

function mousePressed() {
  let best = null;
  let bestD = 20;
  for (const p of pointPositions) {
    const d = dist(mouseX, mouseY, p.x, p.y);
    if (d < bestD) { bestD = d; best = p; }
  }
  if (best) selectedK = best.k;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
