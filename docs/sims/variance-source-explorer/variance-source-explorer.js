// Variance Source Explorer MicroSim
// CANVAS_HEIGHT: 490
// Timing noise from interrupts is not symmetric. Interference can only make a
// run slower, so the distribution grows a right tail — and the mean chases it
// while the minimum does not.

let canvasWidth = 400;
let drawHeight = 410;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 290;
let defaultTextSize = 16;

const BASELINE = 400;        // microseconds
const JITTER = 5;            // +/- Gaussian jitter on a clean run
const BIN_US = 5;
const MIN_US = 380;
const MAX_US = 580;
const NBINS = (MAX_US - MIN_US) / BIN_US;

let oneButton, twentyButton, resetButton, rateSlider;
let samples = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  oneButton = createButton('Run 1 more sample');
  oneButton.position(10, drawHeight + 5);
  oneButton.mousePressed(() => addSamples(1));
  oneButton.parent(document.querySelector('main'));

  twentyButton = createButton('Run 20 more samples');
  twentyButton.position(146, drawHeight + 5);
  twentyButton.mousePressed(() => addSamples(20));
  twentyButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(296, drawHeight + 5);
  resetButton.mousePressed(() => { samples = []; });
  resetButton.parent(document.querySelector('main'));

  rateSlider = createSlider(0, 30, 8, 1);
  rateSlider.position(sliderLeftMargin, drawHeight + 42);
  rateSlider.parent(document.querySelector('main'));

  resizeSliders();
  addSamples(60);

  describe('A live histogram of simulated FFT execution times with a tight ' +
    'baseline cluster and a right-hand tail of interrupt-affected runs, beside ' +
    'running mean, standard deviation, and minimum.', LABEL);
}

// Box-Muller, so the clean runs are genuinely Gaussian rather than uniform.
function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function addSamples(n) {
  const rate = rateSlider ? rateSlider.value() / 100 : 0.08;
  for (let i = 0; i < n; i++) {
    let t = BASELINE + gaussian() * JITTER;
    // Interference is one-sided: an interrupt can only add time, never
    // subtract it. That asymmetry is the whole reason the tail is on the right.
    if (Math.random() < rate) t += 50 + Math.random() * 100;
    samples.push(t);
  }
}

function stats() {
  if (!samples.length) return { n: 0, mean: 0, sd: 0, min: 0 };
  const n = samples.length;
  const mean = samples.reduce((a, b) => a + b, 0) / n;
  const varSum = samples.reduce((a, b) => a + (b - mean) * (b - mean), 0);
  return {
    n: n,
    mean: mean,
    sd: Math.sqrt(varSum / n),
    min: Math.min(...samples)
  };
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const s = stats();
  drawTitle();
  drawHistogram(s);
  drawPanel(s);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Where Timing Variance Comes From', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function histGeometry() {
  const panelW = constrain(canvasWidth * 0.28, 180, 250);
  return {
    left: 58, right: canvasWidth - panelW - 42,
    top: 52, base: 322
  };
}

function drawHistogram(s) {
  const g = histGeometry();
  if (g.right <= g.left) return;
  const bw = (g.right - g.left) / NBINS;

  const counts = new Array(NBINS).fill(0);
  for (const t of samples) {
    const k = Math.floor((t - MIN_US) / BIN_US);
    if (k >= 0 && k < NBINS) counts[k]++;
  }
  const peak = Math.max(1, ...counts);

  stroke('lightgray');
  strokeWeight(1);
  line(g.left, g.base, g.right, g.base);

  noStroke();
  for (let k = 0; k < NBINS; k++) {
    if (!counts[k]) continue;
    const h = (counts[k] / peak) * (g.base - g.top - 10);
    const centre = MIN_US + k * BIN_US;
    // Anything meaningfully above the clean-run band is interference.
    fill(centre > BASELINE + 4 * JITTER ? 'crimson' : 'cornflowerblue');
    rect(g.left + k * bw, g.base - h, Math.max(1, bw - 1), h);
  }

  // Mean and minimum markers
  drawMarker(g, s.mean, 'darkorange', 'mean');
  drawMarker(g, s.min, 'darkgreen', 'min');

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (let t = MIN_US; t <= MAX_US; t += 40) {
    text(t, g.left + ((t - MIN_US) / BIN_US) * bw, g.base + 5);
  }
  text('execution time (µs)', g.left, g.base + 22, g.right - g.left, 16);

  push();
  translate(20, (g.top + g.base) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('count of runs', 0, 0);
  pop();

  textSize(12);
  textAlign(LEFT, TOP);
  fill('cornflowerblue');
  text('■ clean runs', g.left, g.base + 40);
  fill('crimson');
  text('■ interrupt-affected runs', g.left + (g.right - g.left) * 0.42, g.base + 40);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMarker(g, value, colorName, label) {
  if (value < MIN_US || value > MAX_US) return;
  const bw = (g.right - g.left) / NBINS;
  const x = g.left + ((value - MIN_US) / BIN_US) * bw;
  stroke(colorName);
  strokeWeight(2);
  line(x, g.top + 16, x, g.base + 4);
  noStroke();
  fill(colorName);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text(label, x, g.top + 15);
}

function drawPanel(s) {
  const g = histGeometry();
  const x = g.right + 20;
  const w = canvasWidth - x - 20;
  const y = 52;
  const h = 320;
  if (w < 160) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('Running statistics', x + 12, y + 10);
  textStyle(NORMAL);

  textSize(13);
  fill('dimgray');
  text('samples: ' + s.n, x + 12, y + 36);

  textSize(13);
  fill('darkorange');
  text('mean', x + 12, y + 64);
  textStyle(BOLD);
  textSize(19);
  text(s.mean.toFixed(1) + ' µs', x + 12, y + 80);
  textStyle(NORMAL);

  textSize(13);
  fill('crimson');
  text('std dev', x + 12, y + 112);
  textStyle(BOLD);
  textSize(19);
  text(s.sd.toFixed(1) + ' µs', x + 12, y + 128);
  textStyle(NORMAL);

  textSize(13);
  fill('darkgreen');
  text('minimum', x + 12, y + 160);
  textStyle(BOLD);
  textSize(19);
  text(s.min.toFixed(1) + ' µs', x + 12, y + 176);
  textStyle(NORMAL);

  fill('black');
  textSize(12);
  text('The minimum stays near ' + BASELINE + ' µs however many outliers ' +
       'arrive. The mean and std dev climb with them. That is why best-of-N ' +
       'resists interference.',
       x + 12, y + 210, w - 24, 100);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Interrupt interference rate: ' + rateSlider.value() + '%',
       10, drawHeight + 52);
}

function resizeSliders() {
  rateSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
