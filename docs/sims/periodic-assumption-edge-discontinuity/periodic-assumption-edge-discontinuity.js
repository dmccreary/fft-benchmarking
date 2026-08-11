// Periodic Assumption Edge Discontinuity MicroSim
// CANVAS_HEIGHT: 475
// The DFT assumes the captured frame repeats forever. When the frame does not
// hold a whole number of cycles, the joins do not match — and that jump is
// what leaks across the spectrum.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 352;
let defaultTextSize = 16;

const N = 64;              // samples per frame
const COPIES = 3;
const BINS = N / 2 + 1;
// A non-zero starting phase. With phase 0 a half-integer cycle count still
// lands on zero at both ends, so the boundary mismatch would be a slope break
// with no visible jump. Starting off a zero crossing makes the discontinuity a
// genuine amplitude step, which is what the spectrum is actually reacting to.
const PHASE = Math.PI / 4;

let cyclesSlider, snapButton;
let cycles = 6.5;
let cachedCycles = -1;
let spectrum = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  cyclesSlider = createSlider(2, 10, 6.5, 0.05);
  cyclesSlider.position(sliderLeftMargin, drawHeight + 12);
  cyclesSlider.parent(document.querySelector('main'));

  snapButton = createButton('Snap to whole cycles');
  snapButton.position(10, drawHeight + 8);
  snapButton.mousePressed(() => cyclesSlider.value(Math.round(cyclesSlider.value())));
  snapButton.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three repeated copies of a captured frame showing whether the signal ' +
    'joins smoothly at the frame boundaries, above the resulting spectrum which ' +
    'is either one clean peak or a smeared set of bins.', LABEL);
}

function sampleAt(n) {
  return Math.sin((2 * Math.PI * cycles * n) / N + PHASE);
}

function computeSpectrum() {
  const mags = [];
  for (let k = 0; k < BINS; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const x = sampleAt(n);
      const a = (2 * Math.PI * k * n) / N;
      re += x * Math.cos(a);
      im -= x * Math.sin(a);
    }
    mags.push(Math.sqrt(re * re + im * im) / (N / 2));
  }
  return mags;
}

function isWhole() {
  return Math.abs(cycles - Math.round(cycles)) < 0.001;
}

// The size of the jump between the end of one copy and the start of the next.
function edgeJump() {
  return Math.abs(Math.sin(2 * Math.PI * cycles + PHASE) - Math.sin(PHASE));
}

function draw() {
  updateCanvasSize();
  cycles = cyclesSlider.value();
  if (cycles !== cachedCycles) {
    cachedCycles = cycles;
    spectrum = computeSpectrum();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawRepeats();
  drawSpectrum();
  drawReadout();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('What the DFT Assumes Happens Outside the Frame', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawRepeats() {
  const left = 40;
  const right = canvasWidth - 25;
  const top = 44;
  const h = 124;
  const midY = top + h / 2;
  const amp = (h / 2) * 0.82;
  if (right <= left) return;
  const frameW = (right - left) / COPIES;
  const clean = isWhole();

  // Frame backgrounds
  noStroke();
  for (let c = 0; c < COPIES; c++) {
    fill(c % 2 === 0 ? 'rgba(21,101,192,0.06)' : 'rgba(21,101,192,0.02)');
    rect(left + frameW * c, top, frameW, h);
  }

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  // The signal, drawn continuously across all three copies
  stroke('darkblue');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = left; px <= right; px += 0.5) {
    const nGlobal = map(px, left, right, 0, N * COPIES);
    const nInFrame = nGlobal % N;
    vertex(px, midY - Math.sin((2 * Math.PI * cycles * nInFrame) / N) * amp);
  }
  endShape();

  // Boundaries between copies, with a marker showing match or jump
  for (let c = 1; c < COPIES; c++) {
    const x = left + frameW * c;
    stroke('gray');
    strokeWeight(1);
    drawingContext.setLineDash([5, 4]);
    line(x, top, x, top + h);
    drawingContext.setLineDash([]);

    const yEnd = midY - Math.sin(2 * Math.PI * cycles + PHASE) * amp;
    const yStart = midY - Math.sin(PHASE) * amp;
    noStroke();
    if (clean) {
      fill('darkgreen');
      circle(x, yStart, 12);
    } else {
      stroke('crimson');
      strokeWeight(3);
      line(x, yEnd, x, yStart);
      noStroke();
      fill('crimson');
      circle(x, yEnd, 9);
      circle(x, yStart, 9);
    }
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (let c = 0; c < COPIES; c++) {
    text('copy ' + (c + 1), left + frameW * c + frameW / 2, top + h + 4);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSpectrum() {
  const left = 40;
  const right = canvasWidth - 25;
  const top = 206;
  const h = 118;
  const base = top + h;
  if (right <= left) return;
  const slot = (right - left) / BINS;
  const clean = isWhole();

  stroke('lightgray');
  strokeWeight(1);
  line(left, base, right, base);

  noStroke();
  for (let k = 0; k < BINS; k++) {
    const bh = spectrum[k] * (h - 8);
    fill(clean ? 'darkgreen' : 'crimson');
    rect(left + slot * k + 0.8, base - bh, Math.max(1, slot - 1.6), bh);
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (let k = 0; k <= BINS - 1; k += 8) {
    text(k, left + slot * k + slot / 2, base + 4);
  }
  text('bin index', left, base + 20, right - left, 16);
  textAlign(RIGHT, CENTER);
  text('1.0', left - 5, top + 8);
  text('0', left - 5, base);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 356;
  const h = 62;
  const clean = isWhole();
  const jump = edgeJump();

  stroke(clean ? 'darkgreen' : 'crimson');
  strokeWeight(2);
  fill(clean ? 'honeydew' : 'mistyrose');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  fill(clean ? 'darkgreen' : 'crimson');
  text(clean
        ? cycles.toFixed(0) + ' whole cycles per frame — the copies join seamlessly'
        : cycles.toFixed(2) + ' cycles per frame — jump of ' + jump.toFixed(3) +
          ' at every boundary',
       margin + 12, y + 8);
  textStyle(NORMAL);

  fill('black');
  textSize(13);
  text(clean
        ? 'The signal is exactly periodic over the frame, so one bin holds all the ' +
          'energy. This is the only case where the DFT sees no discontinuity.'
        : 'The DFT cannot represent that jump with a single sinusoid, so it spends ' +
          'energy across many neighbouring bins to reproduce it. That smearing is ' +
          'spectral leakage — it is caused by the boundary, not by the signal.',
       margin + 12, y + 30, canvasWidth - 2 * margin - 24, 30);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Cycles per frame: ' + cycles.toFixed(2), 164, drawHeight + 22);
}

function resizeSliders() {
  cyclesSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
