// Harmonic Stack Synthesizer MicroSim
// CANVAS_HEIGHT: 555
// Mixing overtones above a fixed 440 Hz fundamental changes the waveform's
// shape (timbre) while leaving its repetition rate (pitch) untouched.

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 255;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

const FUNDAMENTAL_HZ = 440;
const CYCLES_SHOWN = 3;
const WINDOW_S = CYCLES_SHOWN / FUNDAMENTAL_HZ;   // seconds displayed

const HARMONIC_NAMES = ['1st', '2nd', '3rd', '4th', '5th'];
const HARMONIC_COLORS = ['mediumblue', 'seagreen', 'darkorange',
                         'mediumvioletred', 'saddlebrown'];

const PRESETS = {
  'Flute':     [100, 20, 5, 0, 0],
  'Violin':    [100, 75, 55, 30, 20],
  'Clarinet':  [100, 5, 70, 5, 45],
  'Pure tone': [100, 0, 0, 0, 0]
};

let sliders = [];
let overlayCheckbox;
let presetButtons = [];
let amplitudes = [100, 0, 0, 0, 0];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let i = 0; i < 5; i++) {
    const s = createSlider(0, 100, amplitudes[i], 1);
    s.position(sliderLeftMargin, drawHeight + 5 + i * 35);
    s.parent(document.querySelector('main'));
    sliders.push(s);
  }

  let x = 10;
  for (const name of Object.keys(PRESETS)) {
    const b = createButton(name);
    b.position(x, drawHeight + 182);
    b.mousePressed(() => applyPreset(name));
    b.parent(document.querySelector('main'));
    presetButtons.push(b);
    x += name.length * 8 + 30;
  }

  overlayCheckbox = createCheckbox(' Show individual harmonics overlay', false);
  overlayCheckbox.position(10, drawHeight + 220);
  overlayCheckbox.parent(document.querySelector('main'));

  resizeSliders();

  describe('A combined waveform built from a fixed 440 Hz fundamental plus four ' +
    'overtones, with a slider per harmonic and instrument presets, showing that ' +
    'timbre changes while the repetition rate stays fixed.', LABEL);
}

function draw() {
  updateCanvasSize();
  for (let i = 0; i < 5; i++) amplitudes[i] = sliders[i].value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPlot();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Harmonic Stack Synthesizer', canvasWidth / 2, 6);
  textSize(14);
  fill('dimgray');
  text('Fundamental frequency: 440 Hz (fixed — this is the pitch)',
       canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function harmonicAt(n, t) {
  return (amplitudes[n] / 100) * Math.sin(TWO_PI * (n + 1) * FUNDAMENTAL_HZ * t);
}

function combinedAt(t) {
  let sum = 0;
  for (let n = 0; n < 5; n++) sum += harmonicAt(n, t);
  return sum;
}

function drawPlot() {
  const left = 62;
  const right = canvasWidth - 25;
  const top = 62;
  const bottom = 236;
  const midY = (top + bottom) / 2;
  if (right <= left) return;

  // Normalize to the largest excursion so shape stays visible at any mix.
  // A uniform scale factor preserves the waveform's shape exactly.
  let peak = 0.001;
  for (let px = left; px <= right; px++) {
    const t = map(px, left, right, 0, WINDOW_S);
    peak = Math.max(peak, Math.abs(combinedAt(t)));
  }
  const yScale = (bottom - midY) / (peak * 1.1);

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  // One dashed marker per fundamental period. These never move, which is the
  // whole point: the pitch is fixed no matter what the overtones do.
  stroke('crimson');
  drawingContext.setLineDash([5, 5]);
  for (let c = 0; c <= CYCLES_SHOWN; c++) {
    const x = map(c / FUNDAMENTAL_HZ, 0, WINDOW_S, left, right);
    line(x, top, x, bottom);
  }
  drawingContext.setLineDash([]);

  // Faint individual harmonics
  if (overlayCheckbox.checked()) {
    strokeWeight(1.5);
    noFill();
    for (let n = 0; n < 5; n++) {
      if (amplitudes[n] === 0) continue;
      const c = color(HARMONIC_COLORS[n]);
      c.setAlpha(110);
      stroke(c);
      beginShape();
      for (let px = left; px <= right; px++) {
        const t = map(px, left, right, 0, WINDOW_S);
        vertex(px, midY - harmonicAt(n, t) * yScale);
      }
      endShape();
    }
  }

  // Combined waveform
  stroke('black');
  strokeWeight(3);
  noFill();
  beginShape();
  for (let px = left; px <= right; px++) {
    const t = map(px, left, right, 0, WINDOW_S);
    vertex(px, midY - combinedAt(t) * yScale);
  }
  endShape();

  noStroke();
  fill('crimson');
  textSize(13);
  textAlign(CENTER, TOP);
  for (let c = 1; c <= CYCLES_SHOWN; c++) {
    const x = map(c / FUNDAMENTAL_HZ, 0, WINDOW_S, left, right);
    text('cycle ' + c, x - (right - left) / (2 * CYCLES_SHOWN), bottom + 4);
  }

  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Time — one full pattern repeats every 1/440 s regardless of the mix',
       left, bottom + 24, right - left, 20);

  push();
  translate(18, midY);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Amplitude', 0, 0);
  pop();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < 5; i++) {
    fill(HARMONIC_COLORS[i]);
    text(HARMONIC_NAMES[i] + ' — ' + ((i + 1) * FUNDAMENTAL_HZ) + ' Hz: ' +
         amplitudes[i] + '%', 10, drawHeight + 15 + i * 35);
  }
}

function applyPreset(name) {
  const values = PRESETS[name];
  for (let i = 0; i < 5; i++) {
    sliders[i].value(values[i]);
    amplitudes[i] = values[i];
  }
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  for (const s of sliders) s.size(w);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  resizeSliders();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
