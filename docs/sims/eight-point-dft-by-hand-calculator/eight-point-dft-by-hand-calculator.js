// Eight Point DFT By Hand Calculator MicroSim
// CANVAS_HEIGHT: 550
// Every multiplication and every sum of an 8-point DFT, bin by bin, with a
// worked example whose answers come out to whole numbers.

let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const N = 8;
// A DC offset of 1 plus one cosine at exactly one cycle across the 8 points.
// This choice makes the answers land on whole numbers: X[0] = 8, X[1] = 8,
// X[7] = 8, and every other bin exactly 0.
const SAMPLES = [];
for (let n = 0; n < N; n++) {
  SAMPLES.push(1.0 + 2.0 * Math.cos((2 * Math.PI * n) / N));
}

let currentBin = 0;
let prevButton, nextButton, detailCheckbox;
let results = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  prevButton = createButton('◀ Previous bin');
  prevButton.position(10, drawHeight + 5);
  prevButton.mousePressed(() => { currentBin = (currentBin + N - 1) % N; });
  prevButton.parent(document.querySelector('main'));

  nextButton = createButton('Next bin ▶');
  nextButton.position(126, drawHeight + 5);
  nextButton.mousePressed(() => { currentBin = (currentBin + 1) % N; });
  nextButton.parent(document.querySelector('main'));

  detailCheckbox = createCheckbox(' Show all 8 products for this bin', true);
  detailCheckbox.position(10, drawHeight + 44);
  detailCheckbox.parent(document.querySelector('main'));

  results = [];
  for (let k = 0; k < N; k++) results.push(binResult(k));

  describe('An 8-sample input signal shown as a labeled bar chart, the full ' +
    'per-sample arithmetic for the currently selected DFT bin, and a results ' +
    'table of every bin\'s real part, imaginary part, and magnitude.', LABEL);
}

// X[k] = sum over n of x[n] * (cos(2*pi*k*n/N) - i*sin(2*pi*k*n/N))
function binResult(k) {
  let re = 0;
  let im = 0;
  const terms = [];
  for (let n = 0; n < N; n++) {
    const angle = (2 * Math.PI * k * n) / N;
    const c = Math.cos(angle);
    const s = -Math.sin(angle);
    const reTerm = SAMPLES[n] * c;
    const imTerm = SAMPLES[n] * s;
    re += reTerm;
    im += imTerm;
    terms.push({ n: n, c: c, s: s, reTerm: reTerm, imTerm: imTerm });
  }
  return { k: k, re: re, im: im, mag: Math.sqrt(re * re + im * im), terms: terms };
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawInputBars();
  drawBinArithmetic();
  drawResultsTable();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('8-Point DFT, Worked By Hand', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawInputBars() {
  const left = 100;
  const right = canvasWidth - 25;
  const top = 40;
  const h = 104;
  const midY = top + h / 2 + 6;
  if (right <= left) return;
  const slot = (right - left) / N;
  const unit = 22;

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Input x[n]', left - 10, midY - 8);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  text('1 + 2cos(2πn/8)', left - 10, midY + 10);

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  for (let n = 0; n < N; n++) {
    const cx = left + slot * n + slot / 2;
    const v = SAMPLES[n];
    const bh = v * unit;
    noStroke();
    fill(v >= 0 ? 'cornflowerblue' : 'indianred');
    if (bh >= 0) rect(cx - slot * 0.3, midY - bh, slot * 0.6, bh);
    else rect(cx - slot * 0.3, midY, slot * 0.6, -bh);

    fill('black');
    textSize(12);
    textAlign(CENTER, v >= 0 ? BOTTOM : TOP);
    text(v.toFixed(3), cx, v >= 0 ? midY - bh - 3 : midY - bh + 3);
    fill('dimgray');
    textSize(11);
    textAlign(CENTER, TOP);
    text('n=' + n, cx, top + h - 2);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBinArithmetic() {
  const r = results[currentBin];
  const left = 30;
  const right = canvasWidth - 25;
  const top = 156;
  const h = detailCheckbox.checked() ? 128 : 62;
  if (right <= left) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(left, top, right - left, h, 8);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Bin k = ' + currentBin + (currentBin === 0 ? '  (DC)' :
       currentBin === 4 ? '  (Nyquist)' : ''), left + 12, top + 8);
  textStyle(NORMAL);
  textSize(12);
  fill('dimgray');
  text('X[k] = Σ x[n] · ( cos(2πkn/8) − i·sin(2πkn/8) )', left + 120, top + 10);

  if (detailCheckbox.checked()) {
    const colW = (right - left - 90) / N;
    const x0 = left + 78;
    textSize(11);
    for (let n = 0; n < N; n++) {
      const t = r.terms[n];
      const cx = x0 + colW * n + colW / 2;
      fill('dimgray');
      textAlign(CENTER, TOP);
      text('n=' + n, cx, top + 32);
      fill('mediumblue');
      text(fmt(t.reTerm), cx, top + 52);
      fill('crimson');
      text(fmt(t.imTerm), cx, top + 72);
    }
    fill('mediumblue');
    textAlign(RIGHT, TOP);
    textSize(11);
    text('real term', x0 - 6, top + 52);
    fill('crimson');
    text('imag term', x0 - 6, top + 72);
  }

  const sumY = top + h - 22;
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  fill('mediumblue');
  text('Real sum = ' + fmt(r.re), left + 12, sumY);
  fill('crimson');
  text('Imag sum = ' + fmt(r.im), left + 190, sumY);
  fill('darkgreen');
  text('Magnitude = ' + fmt(r.mag), left + 372, sumY);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawResultsTable() {
  const left = 30;
  const right = canvasWidth - 25;
  const top = detailCheckbox.checked() ? 310 : 244;
  const rowH = 16;
  if (right <= left) return;

  const cols = [
    { label: 'bin k', x: 0.06 },
    { label: 'Real', x: 0.28 },
    { label: 'Imag', x: 0.50 },
    { label: '|X[k]|', x: 0.72 },
    { label: '', x: 0.90 }
  ];
  const colX = c => left + (right - left) * c.x;

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('All eight bins', left, top - 20);
  for (const c of cols) {
    textAlign(CENTER, TOP);
    text(c.label, colX(c), top);
  }
  textStyle(NORMAL);

  stroke('silver');
  strokeWeight(1);
  line(left, top + 17, right, top + 17);

  for (let k = 0; k < N; k++) {
    const y = top + 22 + k * rowH;
    const r = results[k];
    const isCurrent = k === currentBin;

    if (isCurrent) {
      noStroke();
      fill(230, 240, 255);
      rect(left, y - 2, right - left, rowH);
    }

    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    fill(isCurrent ? 'black' : 'dimgray');
    if (isCurrent) textStyle(BOLD);
    text(k, colX(cols[0]), y);
    text(fmt(r.re), colX(cols[1]), y);
    text(fmt(r.im), colX(cols[2]), y);
    text(fmt(r.mag), colX(cols[3]), y);
    textStyle(NORMAL);

    fill(k === 0 ? 'darkorange' : k === 4 ? 'mediumvioletred' : 'gray');
    textSize(11);
    text(k === 0 ? 'DC' : k === 4 ? 'Nyquist' : '', colX(cols[4]), y);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Round away floating-point dust so exact zeros read as 0.000 rather than
// as something like -0.000 or 1e-16.
function fmt(v) {
  const r = Math.abs(v) < 1e-9 ? 0 : v;
  return r.toFixed(3);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Bin ' + currentBin + ' of 0-7', 240, drawHeight + 17);
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
