// DFT Validation Dashboard MicroSim
// CANVAS_HEIGHT: 595
// Judge a DFT implementation against a tolerance. Some test frequencies pass
// cleanly and some do not — and deciding what that means is the exercise.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const N = 64;
const FS = 16000;
const BIN_HZ = FS / N;            // 250 Hz

// A deliberate mix: most land exactly on a bin center, three fall between bins.
const TEST_FREQS = [250, 375, 500, 625, 750, 1000, 1125, 1500, 2000, 2500, 3000];

let freqSlider, tolSlider, sweepButton;
let currentIndex = 0;
let tolerancePct = 0.1;
let spectrum = [];
let sweepRun = false;
let cachedFreq = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sweepButton = createButton('Run full frequency sweep');
  sweepButton.position(10, drawHeight + 5);
  sweepButton.mousePressed(() => { sweepRun = true; });
  sweepButton.parent(document.querySelector('main'));

  freqSlider = createSlider(0, TEST_FREQS.length - 1, 0, 1);
  freqSlider.position(sliderLeftMargin, drawHeight + 42);
  freqSlider.parent(document.querySelector('main'));

  tolSlider = createSlider(0.01, 5, 0.1, 0.01);
  tolSlider.position(sliderLeftMargin, drawHeight + 78);
  tolSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A DFT magnitude spectrum for a known test frequency with the ' +
    'expected peak bin marked, a pass or fail verdict at the chosen tolerance, ' +
    'and a summary table across a swept range of test frequencies.', LABEL);
}

// Straight O(N^2) DFT of a synthesized test tone. Slow by design — this is the
// implementation under test, not an optimized one.
function computeSpectrum(freq) {
  const mags = [];
  for (let k = 0; k <= N / 2; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const x = Math.sin(TWO_PI * freq * (n / FS));
      const angle = (TWO_PI * k * n) / N;
      re += x * Math.cos(angle);
      im -= x * Math.sin(angle);
    }
    mags.push(Math.sqrt(re * re + im * im) / (N / 2));
  }
  return mags;
}

function evaluateCase(freq) {
  const mags = computeSpectrum(freq);
  let peakBin = 0;
  for (let k = 1; k < mags.length; k++) {
    if (mags[k] > mags[peakBin]) peakBin = k;
  }
  const expectedBin = Math.round(freq / BIN_HZ);
  const detectedHz = peakBin * BIN_HZ;
  const relError = Math.abs(detectedHz - freq) / freq * 100;
  return {
    freq: freq,
    expectedBin: expectedBin,
    peakBin: peakBin,
    detectedHz: detectedHz,
    relError: relError,
    mags: mags
  };
}

function draw() {
  updateCanvasSize();
  currentIndex = freqSlider.value();
  tolerancePct = tolSlider.value();
  const freq = TEST_FREQS[currentIndex];

  if (freq !== cachedFreq) {
    cachedFreq = freq;
    spectrum = evaluateCase(freq);
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawSpectrum();
  drawVerdict();
  drawSummaryTable();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('DFT Validation Dashboard', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('N = 64 at 16 kHz — bin spacing ' + BIN_HZ + ' Hz', canvasWidth / 2, 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSpectrum() {
  const left = 60;
  const right = canvasWidth - 25;
  const top = 52;
  const h = 158;
  const base = top + h;
  if (right <= left) return;
  const bins = spectrum.mags.length;
  const slot = (right - left) / bins;

  stroke('lightgray');
  strokeWeight(1);
  line(left, base, right, base);

  noStroke();
  for (let k = 0; k < bins; k++) {
    const bh = spectrum.mags[k] * (h - 12);
    fill(k === spectrum.peakBin ? 'mediumblue' : 'cornflowerblue');
    rect(left + slot * k + 1, base - bh, Math.max(1, slot - 2), bh);
  }

  // Expected peak from ground truth
  const ex = left + slot * (spectrum.expectedBin + 0.5);
  stroke('crimson');
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(ex, top, ex, base);
  drawingContext.setLineDash([]);
  noStroke();
  fill('crimson');
  textSize(12);
  textAlign(LEFT, TOP);
  text('expected bin ' + spectrum.expectedBin, ex + 5, top + 2);

  fill('black');
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('1.0', left - 6, base - (h - 12));
  text('0', left - 6, base);
  textAlign(CENTER, TOP);
  for (let k = 0; k <= bins - 1; k += 8) {
    text(k, left + slot * (k + 0.5), base + 5);
  }
  fill('dimgray');
  text('bin index', (left + right) / 2, base + 20);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function passes(relError) {
  return relError <= tolerancePct;
}

function drawVerdict() {
  const y = 242;
  const h = 34;
  const ok = passes(spectrum.relError);

  stroke(ok ? 'darkgreen' : 'crimson');
  strokeWeight(2);
  fill(ok ? 'honeydew' : 'mistyrose');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  fill(ok ? 'darkgreen' : 'crimson');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text((ok ? 'PASS' : 'FAIL') + ' — ' + spectrum.freq + ' Hz: expected bin ' +
       spectrum.expectedBin + ', detected bin ' + spectrum.peakBin +
       ' (' + spectrum.detectedHz + ' Hz), relative error ' +
       spectrum.relError.toFixed(3) + '%',
       margin + 12, y + h / 2);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSummaryTable() {
  const left = margin;
  const right = canvasWidth - margin;
  const top = 292;
  const rowH = 13;

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Frequency sweep summary', left, top - 18);
  textStyle(NORMAL);

  if (!sweepRun) {
    fill('dimgray');
    textSize(13);
    text('Press "Run full frequency sweep" to evaluate all ' + TEST_FREQS.length +
         ' test cases at the current tolerance.', left, top + 6,
         right - left, 40);
    return;
  }

  const cols = [
    { label: 'Test Hz', x: 0.03 },
    { label: 'Expected bin', x: 0.22 },
    { label: 'Detected bin', x: 0.44 },
    { label: 'Rel. error', x: 0.66 },
    { label: 'Verdict', x: 0.86 }
  ];
  const colX = c => left + (right - left) * c.x;

  fill('black');
  textSize(12);
  textStyle(BOLD);
  for (const c of cols) {
    textAlign(LEFT, TOP);
    text(c.label, colX(c), top);
  }
  textStyle(NORMAL);
  stroke('silver');
  strokeWeight(1);
  line(left, top + 16, right, top + 16);

  let passCount = 0;
  for (let i = 0; i < TEST_FREQS.length; i++) {
    const r = evaluateCase(TEST_FREQS[i]);
    const ok = passes(r.relError);
    if (ok) passCount++;
    const y = top + 21 + i * rowH;

    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    fill(i === currentIndex ? 'black' : 'dimgray');
    text(r.freq, colX(cols[0]), y);
    text(r.expectedBin, colX(cols[1]), y);
    text(r.peakBin, colX(cols[2]), y);
    text(r.relError.toFixed(3) + '%', colX(cols[3]), y);
    fill(ok ? 'darkgreen' : 'crimson');
    textStyle(BOLD);
    text(ok ? 'PASS' : 'FAIL', colX(cols[4]), y);
    textStyle(NORMAL);
  }

  const summaryY = top + 21 + TEST_FREQS.length * rowH + 6;
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  fill(passCount === TEST_FREQS.length ? 'darkgreen' : 'crimson');
  textStyle(BOLD);
  text(passCount + ' of ' + TEST_FREQS.length + ' cases pass at ' +
       tolerancePct.toFixed(2) + '% tolerance', left, summaryY);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  text('Failures fall between bin centers — a resolution limit, not a bug.',
       left + 300, summaryY + 1);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Test frequency: ' + TEST_FREQS[currentIndex] + ' Hz', 10, drawHeight + 52);
  text('Tolerance: ' + tolerancePct.toFixed(2) + '%', 10, drawHeight + 88);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  freqSlider.size(w);
  tolSlider.size(w);
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
