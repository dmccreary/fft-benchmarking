// Wave Superposition and Beats Simulator MicroSim
// CANVAS_HEIGHT: 570
// Two sine waves plotted alone and summed, on one shared time axis. Equal
// frequencies give steady interference set by phase; unequal frequencies give
// a pulsing beat envelope.

let canvasWidth = 400;
let drawHeight = 455;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 270;
let defaultTextSize = 16;

const W1_COLOR = 'mediumblue';
const W2_COLOR = 'darkorange';
const SUM_COLOR = 'black';
const WINDOW_MS = 100;

let f1Slider, f2Slider, phaseSlider;
let f1 = 300, f2 = 300, phase = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  f1Slider = createSlider(200, 500, 300, 1);
  f1Slider.position(sliderLeftMargin, drawHeight + 5);
  f1Slider.parent(document.querySelector('main'));

  f2Slider = createSlider(200, 500, 300, 1);
  f2Slider.position(sliderLeftMargin, drawHeight + 40);
  f2Slider.parent(document.querySelector('main'));

  phaseSlider = createSlider(0, TWO_PI, 0, 0.01);
  phaseSlider.position(sliderLeftMargin, drawHeight + 75);
  phaseSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three stacked waveform plots on a shared time axis: two input sine ' +
    'waves and their sum, with constructive and destructive regions shaded and ' +
    'a beat envelope drawn when the frequencies differ.', LABEL);
}

function draw() {
  updateCanvasSize();
  f1 = f1Slider.value();
  f2 = f2Slider.value();
  phase = phaseSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawWavePanel(45, 95, 'Wave 1', W1_COLOR, t => wave1(t), 1.15);
  drawWavePanel(150, 95, 'Wave 2', W2_COLOR, t => wave2(t), 1.15);
  drawSumPanel(258, 150);
  drawReadout();
  drawControlLabels();
}

function wave1(t) {
  return Math.sin(TWO_PI * f1 * t);
}

function wave2(t) {
  return Math.sin(TWO_PI * f2 * t + phase);
}

// From sin A + sin B = 2 sin((A+B)/2) cos((A-B)/2): the slowly varying factor
// is the envelope, and its zero crossings are the beat nulls.
function envelope(t) {
  return 2 * Math.cos(Math.PI * (f1 - f2) * t - phase / 2);
}

function plotX() {
  return { left: 112, right: canvasWidth - 25 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Wave Superposition and Beats', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawWavePanel(top, h, label, colorName, fn, maxAmp) {
  const p = plotX();
  if (p.right <= p.left) return;
  const midY = top + h / 2;
  const amp = (h / 2) * 0.82 / maxAmp;

  stroke('lightgray');
  strokeWeight(1);
  line(p.left, midY, p.right, midY);

  noStroke();
  fill(colorName);
  textSize(14);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text(label, p.left - 10, midY);
  textStyle(NORMAL);

  stroke(colorName);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = p.left; px <= p.right; px += 0.5) {
    const t = map(px, p.left, p.right, 0, WINDOW_MS / 1000);
    vertex(px, midY - fn(t) * amp);
  }
  endShape();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSumPanel(top, h) {
  const p = plotX();
  if (p.right <= p.left) return;
  const midY = top + h / 2;
  const amp = (h / 2) * 0.86 / 2.2;
  const differ = f1 !== f2;

  // Interference shading, computed from the envelope magnitude.
  noStroke();
  const step = 3;
  for (let px = p.left; px < p.right; px += step) {
    const t = map(px, p.left, p.right, 0, WINDOW_MS / 1000);
    const e = Math.abs(envelope(t));
    if (e > 1.4) fill(200, 240, 200, 150);
    else if (e < 0.6) fill(250, 205, 205, 150);
    else continue;
    rect(px, top + 4, step + 1, h - 8);
  }

  stroke('lightgray');
  strokeWeight(1);
  line(p.left, midY, p.right, midY);

  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Wave 1 + 2', p.left - 10, midY);
  textStyle(NORMAL);

  // Beat envelope, only meaningful when the frequencies differ
  if (differ) {
    stroke('darkviolet');
    strokeWeight(2);
    drawingContext.setLineDash([7, 5]);
    noFill();
    for (const sign of [1, -1]) {
      beginShape();
      for (let px = p.left; px <= p.right; px += 1) {
        const t = map(px, p.left, p.right, 0, WINDOW_MS / 1000);
        vertex(px, midY - sign * Math.abs(envelope(t)) * amp);
      }
      endShape();
    }
    drawingContext.setLineDash([]);
  }

  stroke(SUM_COLOR);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = p.left; px <= p.right; px += 0.5) {
    const t = map(px, p.left, p.right, 0, WINDOW_MS / 1000);
    vertex(px, midY - (wave1(t) + wave2(t)) * amp);
  }
  endShape();

  // Time axis
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(CENTER, TOP);
  for (let ms = 0; ms <= WINDOW_MS; ms += 25) {
    text(ms + ' ms', map(ms, 0, WINDOW_MS, p.left, p.right), top + h + 6);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const differ = f1 !== f2;
  noStroke();
  textSize(15);
  textAlign(LEFT, CENTER);

  if (differ) {
    fill('darkviolet');
    textStyle(BOLD);
    text('Beat frequency: |' + f1 + ' - ' + f2 + '| = ' + Math.abs(f1 - f2) + ' Hz',
         30, 438);
    textStyle(NORMAL);
  } else {
    fill('black');
    const cons = Math.abs(Math.cos(phase / 2));
    let state;
    if (cons > 0.95) state = 'fully constructive — amplitude doubles';
    else if (cons < 0.05) state = 'fully destructive — the waves cancel';
    else state = 'partial interference';
    text('Equal frequencies: ' + state, 30, 438);
  }

  fill('dimgray');
  textSize(13);
  textAlign(RIGHT, CENTER);
  text(differ ? 'green = constructive   red = destructive   dashed = beat envelope'
              : 'green = constructive   red = destructive',
       canvasWidth - 30, 438);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(W1_COLOR);
  text('Wave 1 frequency: ' + f1 + ' Hz', 10, drawHeight + 15);
  fill(W2_COLOR);
  text('Wave 2 frequency: ' + f2 + ' Hz', 10, drawHeight + 50);
  fill('black');
  text('Wave 2 phase offset: ' + phase.toFixed(2) + ' rad', 10, drawHeight + 85);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  f1Slider.size(w);
  f2Slider.size(w);
  phaseSlider.size(w);
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
