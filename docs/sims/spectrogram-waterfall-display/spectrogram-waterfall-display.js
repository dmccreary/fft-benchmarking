// Spectrogram Waterfall Display MicroSim
// CANVAS_HEIGHT: 425
// Frequency up the side, time across the bottom, loudness as colour. A rising
// whistle becomes a rising line; a clap becomes a vertical stripe.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const BINS = 48;
const FRAMES = 180;          // total precomputed frames per example
const VISIBLE = 90;          // columns shown at once
const FS = 16000;
const BIN_HZ = FS / 2 / BINS;

const EXAMPLES = {
  'Rising whistle': f => tone(f, 6 + 30 * (f / FRAMES)),
  'Falling whistle': f => tone(f, 36 - 30 * (f / FRAMES)),
  'Two-tone chord': f => addSpectra(tone(f, 10), tone(f, 24)),
  'Silence then a clap': f => clap(f)
};

// A narrow peak at the given bin, over a low noise floor.
function tone(frame, centre) {
  const col = new Array(BINS);
  for (let k = 0; k < BINS; k++) {
    col[k] = 0.06 + 0.92 / (1 + Math.pow((k - centre) / 1.1, 2));
  }
  return col;
}

function addSpectra(a, b) {
  return a.map((v, i) => Math.min(1, v + b[i] - 0.06));
}

// Nothing, then one broadband burst that decays over a few frames.
function clap(frame) {
  const col = new Array(BINS).fill(0.04);
  const onset = Math.floor(FRAMES * 0.45);
  if (frame >= onset) {
    const age = frame - onset;
    const env = Math.exp(-age / 6);
    for (let k = 0; k < BINS; k++) {
      // Deterministic broadband texture so the figure is reproducible.
      const j = Math.abs(Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1;
      col[k] = Math.min(1, 0.04 + env * (0.55 + 0.45 * j));
    }
  }
  return col;
}

let exampleSelect, playButton;
let exampleName = 'Rising whistle';
let data = [];
let head = VISIBLE;          // index of the newest visible frame
let isPlaying = false;
let lastStep = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  exampleSelect = createSelect();
  for (const name of Object.keys(EXAMPLES)) exampleSelect.option(name);
  exampleSelect.selected(exampleName);
  exampleSelect.position(78, drawHeight + 10);
  exampleSelect.changed(rebuild);
  exampleSelect.parent(document.querySelector('main'));

  playButton = createButton('Play');
  playButton.position(258, drawHeight + 8);
  playButton.mousePressed(togglePlay);
  playButton.parent(document.querySelector('main'));

  rebuild();

  describe('A scrolling waterfall spectrogram with frequency on the vertical ' +
    'axis, time scrolling horizontally, and magnitude shown as colour ' +
    'intensity.', LABEL);
}

function rebuild() {
  exampleName = exampleSelect.value();
  const fn = EXAMPLES[exampleName];
  data = [];
  for (let f = 0; f < FRAMES; f++) data.push(fn(f));
  head = VISIBLE;
}

// Dark navy through blue, cyan, yellow, to white.
function magnitudeColor(v) {
  const t = constrain(v, 0, 1);
  if (t < 0.25) return lerpColor(color(8, 12, 48), color(20, 60, 170), t / 0.25);
  if (t < 0.5) return lerpColor(color(20, 60, 170), color(0, 190, 200), (t - 0.25) / 0.25);
  if (t < 0.75) return lerpColor(color(0, 190, 200), color(230, 220, 40), (t - 0.5) / 0.25);
  return lerpColor(color(230, 220, 40), color(255, 255, 255), (t - 0.75) / 0.25);
}

function draw() {
  updateCanvasSize();
  if (isPlaying && millis() - lastStep > 55) {
    lastStep = millis();
    head++;
    if (head >= FRAMES) head = VISIBLE;
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawWaterfall();
  drawLegend();
  drawControlLabels();
}

function waterfallGeometry() {
  return { left: 78, right: canvasWidth - 120, top: 52, bottom: 316 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Spectrogram Waterfall', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawWaterfall() {
  const g = waterfallGeometry();
  if (g.right <= g.left) return;
  const cw = (g.right - g.left) / VISIBLE;
  const ch = (g.bottom - g.top) / BINS;
  const first = head - VISIBLE + 1;

  noStroke();
  for (let i = 0; i < VISIBLE; i++) {
    const f = first + i;
    if (f < 0 || f >= FRAMES) continue;
    const col = data[f];
    for (let k = 0; k < BINS; k++) {
      fill(magnitudeColor(col[k]));
      // Bin 0 at the bottom, so frequency increases upward.
      rect(g.left + i * cw, g.bottom - (k + 1) * ch, cw + 0.6, ch + 0.6);
    }
  }

  noFill();
  stroke('gray');
  strokeWeight(1);
  rect(g.left, g.top, g.right - g.left, g.bottom - g.top);

  noStroke();
  fill('black');
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let k = 0; k <= BINS; k += 12) {
    const y = g.bottom - (k / BINS) * (g.bottom - g.top);
    text(Math.round(k * BIN_HZ), g.left - 6, y);
  }

  push();
  translate(16, (g.top + g.bottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Frequency (Hz)', 0, 0);
  pop();

  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('older', g.left, g.bottom + 6);
  textAlign(RIGHT, TOP);
  text('newest →', g.right, g.bottom + 6);
  textAlign(CENTER, TOP);
  text('Time', g.left, g.bottom + 24, g.right - g.left, 16);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawLegend() {
  const g = waterfallGeometry();
  const x = g.right + 30;
  const w = 22;
  const top = g.top;
  const h = g.bottom - g.top;
  if (x + w + 60 > canvasWidth) return;

  noStroke();
  for (let i = 0; i < h; i++) {
    fill(magnitudeColor(1 - i / h));
    rect(x, top + i, w, 1.4);
  }
  noFill();
  stroke('gray');
  rect(x, top, w, h);

  noStroke();
  fill('black');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('loud', x + w + 6, top + 6);
  text('quiet', x + w + 6, top + h - 6);
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text('Magnitude', x - 4, top - 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Sound:', 10, drawHeight + 22);
  fill('dimgray');
  textSize(13);
  text(isPlaying ? 'scrolling…' : 'paused — press Play to scroll',
       330, drawHeight + 22);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
  lastStep = millis();
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
