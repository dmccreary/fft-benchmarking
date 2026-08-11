// Multiply and Sum Correlator MicroSim
// CANVAS_HEIGHT: 540
// Correlation computed one sample at a time. A matching test frequency makes
// the running total march steadily upward; a non-matching one makes it wander
// around zero.

let canvasWidth = 400;
let drawHeight = 425;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const N = 32;            // samples in the correlation window
const FS = 8000;         // sampling rate, Hz
const SIG_COLOR = 'mediumblue';
const TEST_COLOR = 'darkorange';

// Offsets are whole multiples of the bin spacing fs/N = 250 Hz, which is where
// orthogonality is exact.
const OFFSETS = {
  'Matches test frequency': 0,
  'Offset by +250 Hz': 250,
  'Offset by +500 Hz': 500
};

let stepButton, runButton, resetButton;
let offsetSelect, testFreqSlider;

let testFreq = 440;
let sigFreq = 440;
let signal = [];
let test = [];
let index = -1;          // -1 means nothing accumulated yet
let runningSum = 0;
let isRunning = false;
let lastStepMs = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step one sample');
  stepButton.position(10, drawHeight + 5);
  stepButton.mousePressed(stepOnce);
  stepButton.parent(document.querySelector('main'));

  runButton = createButton('Run to completion');
  runButton.position(140, drawHeight + 5);
  runButton.mousePressed(toggleRun);
  runButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(272, drawHeight + 5);
  resetButton.mousePressed(resetRun);
  resetButton.parent(document.querySelector('main'));

  offsetSelect = createSelect();
  for (const name of Object.keys(OFFSETS)) offsetSelect.option(name);
  offsetSelect.selected('Matches test frequency');
  offsetSelect.position(215, drawHeight + 42);
  offsetSelect.changed(rebuild);
  offsetSelect.parent(document.querySelector('main'));

  testFreqSlider = createSlider(200, 800, 440, 10);
  testFreqSlider.position(sliderLeftMargin, drawHeight + 78);
  testFreqSlider.input(rebuild);
  testFreqSlider.parent(document.querySelector('main'));

  resizeSliders();
  rebuild();

  describe('A captured signal and a test frequency plotted on a shared sample ' +
    'axis, with a running correlation total that accumulates one sample at a ' +
    'time as the student steps forward.', LABEL);
}

function rebuild() {
  testFreq = testFreqSlider.value();
  sigFreq = testFreq + OFFSETS[offsetSelect.value()];
  signal = [];
  test = [];
  for (let n = 0; n < N; n++) {
    const t = n / FS;
    signal.push(Math.sin(TWO_PI * sigFreq * t));
    test.push(Math.sin(TWO_PI * testFreq * t));
  }
  resetRun();
}

function draw() {
  updateCanvasSize();

  if (isRunning && millis() - lastStepMs > 90) {
    lastStepMs = millis();
    stepOnce();
    if (index >= N - 1) toggleRun();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawSamplePanel(46, 100, 'Captured signal', SIG_COLOR, signal,
                  sigFreq + ' Hz');
  drawSamplePanel(156, 100, 'Test frequency', TEST_COLOR, test,
                  testFreq + ' Hz');
  drawSumPanel();
  drawControlLabels();
}

function plotX() {
  return { left: 128, right: canvasWidth - 25 };
}

function sampleX(n) {
  const p = plotX();
  return map(n + 0.5, 0, N, p.left, p.right);
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Multiply and Sum Correlator', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSamplePanel(top, h, label, colorName, data, freqLabel) {
  const p = plotX();
  if (p.right <= p.left) return;
  const midY = top + h / 2;
  const amp = (h / 2) * 0.8;

  stroke('lightgray');
  strokeWeight(1);
  line(p.left, midY, p.right, midY);

  noStroke();
  fill(colorName);
  textSize(14);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text(label, p.left - 10, midY - 10);
  textStyle(NORMAL);
  textSize(13);
  text(freqLabel, p.left - 10, midY + 10);

  // Continuous curve for context, sample stems for the actual data
  stroke(colorName);
  strokeWeight(1.5);
  noFill();
  beginShape();
  for (let px = p.left; px <= p.right; px += 1) {
    const n = map(px, p.left, p.right, 0, N) - 0.5;
    const t = n / FS;
    const f = label === 'Captured signal' ? sigFreq : testFreq;
    vertex(px, midY - Math.sin(TWO_PI * f * t) * amp);
  }
  endShape();

  for (let n = 0; n < N; n++) {
    const x = sampleX(n);
    const y = midY - data[n] * amp;
    const done = n <= index;
    stroke(done ? colorName : 'lightgray');
    strokeWeight(1);
    line(x, midY, x, y);
    noStroke();
    fill(done ? colorName : 'lightgray');
    circle(x, y, n === index ? 10 : 6);
  }

  // Current sample marker
  if (index >= 0) {
    stroke('crimson');
    strokeWeight(2);
    line(sampleX(index), top + 2, sampleX(index), top + h - 2);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSumPanel() {
  const p = plotX();
  const top = 268;
  const barY = 312;
  const barH = 34;
  const maxSum = N / 2;             // the value a perfect match converges to
  if (p.right <= p.left) return;

  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Running sum', p.left - 10, barY + barH / 2);
  textStyle(NORMAL);

  // Zero-centered bar
  const zeroX = (p.left + p.right) / 2;
  const halfW = (p.right - p.left) / 2;
  fill('gainsboro');
  rect(p.left, barY, p.right - p.left, barH, 4);
  stroke('gray');
  strokeWeight(1);
  line(zeroX, barY - 4, zeroX, barY + barH + 4);

  const frac = constrain(runningSum / maxSum, -1, 1);
  noStroke();
  fill(runningSum >= 0 ? 'mediumseagreen' : 'crimson');
  if (frac >= 0) rect(zeroX, barY, halfW * frac, barH);
  else rect(zeroX + halfW * frac, barY, -halfW * frac, barH);

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('-' + maxSum, p.left, barY + barH + 6);
  textAlign(CENTER, TOP);
  text('0', zeroX, barY + barH + 6);
  textAlign(RIGHT, TOP);
  text('+' + maxSum, p.right, barY + barH + 6);

  // Per-step arithmetic
  textAlign(LEFT, CENTER);
  textSize(15);
  if (index < 0) {
    fill('dimgray');
    text('Sample 0 of ' + N + ' — press Step to begin. Running sum starts at 0.',
         p.left, top + 6);
  } else {
    const prod = signal[index] * test[index];
    fill('black');
    text('n = ' + index + ':   x[n] = ' + signal[index].toFixed(3) +
         '   ×   t[n] = ' + test[index].toFixed(3) +
         '   =   ' + (prod >= 0 ? '+' : '') + prod.toFixed(3),
         p.left, top + 6);
  }

  // Totals
  textSize(16);
  textStyle(BOLD);
  fill(runningSum >= 0 ? 'darkgreen' : 'crimson');
  textAlign(LEFT, CENTER);
  text('Running sum: ' + runningSum.toFixed(2), p.left, 386);
  textStyle(NORMAL);

  textSize(14);
  fill('black');
  textAlign(RIGHT, CENTER);
  if (index >= N - 1) {
    const norm = Math.abs(runningSum) / maxSum;
    text('Complete: normalized correlation = ' + norm.toFixed(3) +
         (norm > 0.7 ? '  — strong match' : '  — near zero, no match'),
         p.right, 386);
  } else {
    text('Samples accumulated: ' + (index + 1) + ' of ' + N, p.right, 386);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill('black');
  text('Captured signal:', 10, drawHeight + 52);
  text('Test frequency: ' + testFreq + ' Hz', 10, drawHeight + 88);
}

function stepOnce() {
  if (index >= N - 1) return;
  index++;
  runningSum += signal[index] * test[index];
}

function toggleRun() {
  if (index >= N - 1 && !isRunning) return;
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run to completion');
  lastStepMs = millis();
}

function resetRun() {
  index = -1;
  runningSum = 0;
  if (isRunning) {
    isRunning = false;
    runButton.html('Run to completion');
  }
}

function resizeSliders() {
  testFreqSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
