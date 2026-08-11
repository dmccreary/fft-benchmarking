// Window Function Comparison MicroSim
// CANVAS_HEIGHT: 469
// Four windows, one layout. Every step from rectangular to Blackman widens the
// main lobe and pushes the side lobes down — that is the whole trade.

let canvasWidth = 400;
let drawHeight = 424;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const N = 64;          // window length
const M = 1024;        // zero-padded transform length
const OVERSAMPLE = M / N;   // transform samples per original bin
const SPAN_BINS = 6;   // bins either side of centre to plot
const DB_FLOOR = -90;

const WINDOWS = {
  Rectangular: () => 1,
  Hann: n => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1)),
  Hamming: n => 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1)),
  Blackman: n => 0.42 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) +
                 0.08 * Math.cos((4 * Math.PI * n) / (N - 1))
};

let radio;
let selected = 'Rectangular';
let cached = null;
let analysis = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  radio = createRadio();
  for (const name of Object.keys(WINDOWS)) radio.option(name);
  radio.selected(selected);
  radio.position(10, drawHeight + 10);
  radio.style('font-size', '14px');
  radio.parent(document.querySelector('main'));

  describe('The selected window function plotted in the time domain above its ' +
    'frequency response in decibels, with main lobe width and highest side lobe ' +
    'level computed from the response.', LABEL);
}

function coefficients(name) {
  const w = [];
  for (let n = 0; n < N; n++) w.push(WINDOWS[name](n));
  return w;
}

// Zero-padded DFT magnitude of the window, in dB relative to its own peak.
// Zero padding is what resolves the lobe structure between the coarse bins.
function response(name) {
  const w = coefficients(name);
  const mags = [];
  for (let k = 0; k <= M / 2; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const a = (2 * Math.PI * k * n) / M;
      re += w[n] * Math.cos(a);
      im -= w[n] * Math.sin(a);
    }
    mags.push(Math.sqrt(re * re + im * im));
  }
  const peak = mags[0];
  return mags.map(m => Math.max(DB_FLOOR, 20 * Math.log10(m / peak)));
}

// Main lobe half-width is the first null; the highest point beyond it is the
// worst side lobe. Both are measured from the response rather than quoted.
function analyze(db) {
  let firstNull = 1;
  while (firstNull < db.length - 1 &&
         !(db[firstNull] < db[firstNull - 1] && db[firstNull] <= db[firstNull + 1])) {
    firstNull++;
  }
  let sideLobe = DB_FLOOR;
  for (let k = firstNull + 1; k < db.length; k++) {
    if (db[k] > sideLobe) sideLobe = db[k];
  }
  return {
    halfWidthBins: firstNull / OVERSAMPLE,
    sideLobeDb: sideLobe
  };
}

function ensureAnalysis() {
  if (cached === selected) return;
  cached = selected;
  const db = response(selected);
  analysis = { db: db, ...analyze(db) };
}

function draw() {
  updateCanvasSize();
  selected = radio.value() || selected;
  ensureAnalysis();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawTimeDomain();
  drawFrequencyDomain();
  drawReadout();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Window Function Comparison', canvasWidth / 2, 2);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTimeDomain() {
  const left = 62;
  const right = canvasWidth - 25;
  const top = 44;
  const h = 104;
  const base = top + h;
  if (right <= left) return;
  const w = coefficients(selected);

  stroke('lightgray');
  strokeWeight(1);
  line(left, base, right, base);

  stroke('mediumblue');
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let n = 0; n < N; n++) {
    vertex(map(n, 0, N - 1, left, right), base - w[n] * (h - 8));
  }
  endShape();

  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Time domain: the window shape', left, top - 14);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('1.0', left - 5, base - (h - 8));
  text('0', left - 5, base);
  textAlign(CENTER, TOP);
  text('sample 0', left, base + 4);
  text('sample ' + (N - 1), right, base + 4);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawFrequencyDomain() {
  const left = 62;
  const right = canvasWidth - 25;
  const top = 188;
  const h = 150;
  const base = top + h;
  if (right <= left) return;

  const db = analysis.db;
  const maxK = SPAN_BINS * OVERSAMPLE;
  const binToX = b => map(b, -SPAN_BINS, SPAN_BINS, left, right);
  const dbToY = d => base - ((d - DB_FLOOR) / (0 - DB_FLOOR)) * (h - 6);

  // Gridlines every 20 dB
  stroke('lightgray');
  strokeWeight(1);
  for (let d = 0; d >= DB_FLOOR; d -= 20) {
    line(left, dbToY(d), right, dbToY(d));
    noStroke();
    fill('dimgray');
    textSize(11);
    textAlign(RIGHT, CENTER);
    text(d, left - 5, dbToY(d));
    stroke('lightgray');
  }

  // Side lobe reference line
  stroke('crimson');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  line(left, dbToY(analysis.sideLobeDb), right, dbToY(analysis.sideLobeDb));
  drawingContext.setLineDash([]);

  // Response, mirrored about the centre
  stroke('darkgreen');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let k = maxK; k >= 0; k--) vertex(binToX(-k / OVERSAMPLE), dbToY(db[k]));
  for (let k = 1; k <= maxK; k++) vertex(binToX(k / OVERSAMPLE), dbToY(db[k]));
  endShape();

  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Frequency response (dB below peak)', left, top - 16);
  textStyle(NORMAL);
  fill('crimson');
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  text('highest side lobe', right, dbToY(analysis.sideLobeDb) - 3);

  fill('dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  for (let b = -SPAN_BINS; b <= SPAN_BINS; b += 2) {
    text(b, binToX(b), base + 4);
  }
  text('bins from centre', left, base + 18, right - left, 14);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 372;
  const h = 40;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(15);
  textStyle(BOLD);
  fill('black');
  text(selected, margin + 12, y + h / 2);
  textStyle(NORMAL);
  fill('darkgreen');
  text('Main lobe width: ' + (2 * analysis.halfWidthBins).toFixed(1) + ' bins',
       margin + 110, y + h / 2);
  fill('crimson');
  text('Highest side lobe: ' + analysis.sideLobeDb.toFixed(1) + ' dB below peak',
       margin + 330, y + h / 2);
  textSize(defaultTextSize);
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
