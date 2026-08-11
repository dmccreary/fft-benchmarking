// Sine Wave Parameter Explorer MicroSim
// CANVAS_HEIGHT: 500
// Amplitude, frequency, and phase are manipulated independently so each
// parameter's specific visual effect on y(t) = A sin(2*pi*f*t + phi) is
// isolated and observable.

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

const AMP_COLOR = 'mediumblue';
const FREQ_COLOR = 'darkgreen';
const PHASE_COLOR = 'darkviolet';
const COSINE_COLOR = 'darkorange';

const TIME_WINDOW = 3.0;   // seconds shown on the x-axis
const MAX_AMPLITUDE = 2.0;

let ampSlider;
let freqSlider;
let phaseSlider;
let cosineCheckbox;

let amplitude = 1.0;
let frequency = 1.0;
let phaseDeg = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  ampSlider = createSlider(0.2, 2.0, 1.0, 0.05);
  ampSlider.position(sliderLeftMargin, drawHeight + 5);
  ampSlider.parent(document.querySelector('main'));

  freqSlider = createSlider(0.5, 5.0, 1.0, 0.1);
  freqSlider.position(sliderLeftMargin, drawHeight + 40);
  freqSlider.parent(document.querySelector('main'));

  phaseSlider = createSlider(0, 360, 0, 5);
  phaseSlider.position(sliderLeftMargin, drawHeight + 75);
  phaseSlider.parent(document.querySelector('main'));

  cosineCheckbox = createCheckbox(' Overlay cosine wave', false);
  cosineCheckbox.position(10, drawHeight + 112);
  cosineCheckbox.parent(document.querySelector('main'));

  resizeSliders();

  describe('A sine wave plot with sliders for amplitude, frequency, and phase, ' +
    'a live equation readout, and an optional cosine overlay showing the ' +
    'quarter-cycle relationship.', LABEL);
}

function draw() {
  updateCanvasSize();
  amplitude = ampSlider.value();
  frequency = freqSlider.value();
  phaseDeg = phaseSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawEquation();
  drawPlot();
  drawControlLabels();
}

function plotGeometry() {
  return {
    left: 78,
    right: canvasWidth - 25,
    top: 88,
    bottom: 306,
    midY: (88 + 306) / 2
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Sine Wave Parameter Explorer', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Each parameter is printed in the color of the slider that controls it, so a
// glance connects the numeral to the control that moved.
function drawEquation() {
  const parts = [
    { s: 'y(t) = ', c: 'black' },
    { s: amplitude.toFixed(2), c: AMP_COLOR },
    { s: ' sin(2π × ', c: 'black' },
    { s: frequency.toFixed(1), c: FREQ_COLOR },
    { s: ' × t + ', c: 'black' },
    { s: phaseDeg + '°', c: PHASE_COLOR },
    { s: ')', c: 'black' }
  ];

  let size = 20;
  noStroke();
  while (size > 11) {
    textSize(size);
    let w = 0;
    for (const p of parts) w += textWidth(p.s);
    if (w <= canvasWidth - 2 * margin) break;
    size -= 1;
  }
  textSize(size);

  let total = 0;
  for (const p of parts) total += textWidth(p.s);
  let x = (canvasWidth - total) / 2;
  textAlign(LEFT, CENTER);
  for (const p of parts) {
    fill(p.c);
    text(p.s, x, 56);
    x += textWidth(p.s);
  }
  textSize(defaultTextSize);
}

function drawPlot() {
  const g = plotGeometry();
  if (g.right <= g.left) return;
  const yScale = (g.bottom - g.midY) / (MAX_AMPLITUDE * 1.1);

  // Axes and gridlines
  stroke('lightgray');
  strokeWeight(1);
  for (let t = 0; t <= TIME_WINDOW; t += 0.5) {
    const x = map(t, 0, TIME_WINDOW, g.left, g.right);
    line(x, g.top, x, g.bottom);
  }
  for (let a = -2; a <= 2; a += 1) {
    const y = g.midY - a * yScale;
    line(g.left, y, g.right, y);
  }

  // Dashed zero reference
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([6, 5]);
  line(g.left, g.midY, g.right, g.midY);
  drawingContext.setLineDash([]);

  // Axis labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, CENTER);
  for (let a = -2; a <= 2; a += 1) {
    text(a.toFixed(0), g.left - 8, g.midY - a * yScale);
  }
  textAlign(CENTER, TOP);
  for (let t = 0; t <= TIME_WINDOW; t += 0.5) {
    text(t.toFixed(1), map(t, 0, TIME_WINDOW, g.left, g.right), g.bottom + 6);
  }
  text('Time (seconds)', (g.left + g.right) / 2, g.bottom + 26);

  push();
  translate(20, g.midY);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Amplitude', 0, 0);
  pop();

  // Cosine overlay: same A and f, phase pinned a quarter cycle ahead.
  if (cosineCheckbox.checked()) {
    stroke(COSINE_COLOR);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let px = g.left; px <= g.right; px++) {
      const t = map(px, g.left, g.right, 0, TIME_WINDOW);
      const y = amplitude * Math.sin(TWO_PI * frequency * t + HALF_PI);
      vertex(px, g.midY - y * yScale);
    }
    endShape();
  }

  // The wave itself
  stroke('darkblue');
  strokeWeight(3);
  noFill();
  beginShape();
  for (let px = g.left; px <= g.right; px++) {
    const t = map(px, g.left, g.right, 0, TIME_WINDOW);
    vertex(px, g.midY - waveAt(t) * yScale);
  }
  endShape();

  // t=0 marker plus a dot on the curve, which is where phase shows itself.
  stroke('crimson');
  strokeWeight(2);
  line(g.left, g.top, g.left, g.bottom);
  const y0 = g.midY - waveAt(0) * yScale;
  noStroke();
  fill('crimson');
  circle(g.left, y0, 11);

  fill('crimson');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('y(0) = ' + waveAt(0).toFixed(2), g.left + 8, g.top + 10);

  if (cosineCheckbox.checked()) {
    fill(COSINE_COLOR);
    textAlign(RIGHT, CENTER);
    text('cosine = sine shifted a quarter cycle', g.right - 6, g.top + 10);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function waveAt(t) {
  return amplitude * Math.sin(TWO_PI * frequency * t + radians(phaseDeg));
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(AMP_COLOR);
  text('Amplitude (A): ' + amplitude.toFixed(2), 10, drawHeight + 15);
  fill(FREQ_COLOR);
  text('Frequency (f): ' + frequency.toFixed(1) + ' Hz', 10, drawHeight + 50);
  fill(PHASE_COLOR);
  text('Phase (φ): ' + phaseDeg + '°', 10, drawHeight + 85);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  ampSlider.size(w);
  freqSlider.size(w);
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
