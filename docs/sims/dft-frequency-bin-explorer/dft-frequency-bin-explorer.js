// DFT Frequency Bin Explorer MicroSim
// CANVAS_HEIGHT: 420
// Bin width is fs/N. Raising N buys finer frequency resolution and costs more
// bins to compute — this makes both sides of that trade visible at once.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const DC_COLOR = 'darkorange';
const NYQ_COLOR = 'mediumvioletred';
const BIN_COLOR = 'cornflowerblue';

let nSlider, rateSlider;
let N = 512;
let sampleRate = 16000;
let selectedBin = 0;
let binBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Slider positions are powers of two: 3 -> 8 samples, 9 -> 512 samples.
  nSlider = createSlider(3, 9, 9, 1);
  nSlider.position(sliderLeftMargin, drawHeight + 5);
  nSlider.parent(document.querySelector('main'));

  rateSlider = createSlider(4000, 16000, 16000, 500);
  rateSlider.position(sliderLeftMargin, drawHeight + 40);
  rateSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A row of DFT frequency bins with the DC and Nyquist bins ' +
    'highlighted, plus readouts for bin width, frequency resolution, and bin ' +
    'count that recompute as N and the sampling rate change.', LABEL);
}

function draw() {
  updateCanvasSize();
  const newN = Math.pow(2, nSlider.value());
  if (newN !== N) {
    N = newN;
    selectedBin = Math.min(selectedBin, N - 1);
  }
  sampleRate = rateSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeBins();
  drawTitle();
  drawBinRow();
  drawReadout();
  drawControlLabels();
}

function binWidth() {
  return sampleRate / N;
}

function centerFrequency(k) {
  return k * binWidth();
}

function computeBins() {
  const left = 30;
  const right = canvasWidth - 30;
  const w = (right - left) / N;
  binBoxes = { left: left, right: right, w: w, top: 92, h: 62 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('DFT Frequency Bin Explorer', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text('Each box is one DFT output bin, centered at k × f_s / N',
       canvasWidth / 2, 34);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBinRow() {
  const b = binBoxes;
  if (b.right <= b.left) return;
  const nyq = N / 2;
  // Below this width, individual boxes stop being readable and the row is
  // drawn as a comb of ticks instead — which is itself the point at large N.
  const drawAsBoxes = b.w >= 22;

  for (let k = 0; k < N; k++) {
    const x = b.left + k * b.w;
    const isDC = k === 0;
    const isNyq = k === nyq;
    const isSel = k === selectedBin;

    if (drawAsBoxes) {
      stroke(isSel ? 'black' : 'white');
      strokeWeight(isSel ? 3 : 1);
      fill(isDC ? DC_COLOR : isNyq ? NYQ_COLOR : BIN_COLOR);
      rect(x, b.top, b.w, b.h);

      noStroke();
      fill('white');
      textSize(Math.min(13, b.w * 0.38));
      textAlign(CENTER, TOP);
      text(k, x + b.w / 2, b.top + 6);
      textSize(Math.min(11, b.w * 0.3));
      text(Math.round(centerFrequency(k)), x + b.w / 2, b.top + b.h - 18);
    } else {
      stroke(isDC ? DC_COLOR : isNyq ? NYQ_COLOR : BIN_COLOR);
      strokeWeight(isSel ? 3 : Math.max(1, b.w * 0.7));
      line(x + b.w / 2, b.top, x + b.w / 2, b.top + b.h);
    }
  }

  // Frame and end labels
  noFill();
  stroke('gray');
  strokeWeight(1);
  rect(b.left, b.top, b.right - b.left, b.h);

  noStroke();
  fill(DC_COLOR);
  textSize(13);
  textAlign(LEFT, TOP);
  text('bin 0 — DC (0 Hz)', b.left, b.top + b.h + 8);
  fill(NYQ_COLOR);
  textAlign(CENTER, TOP);
  text('bin ' + nyq + ' — Nyquist (' + Math.round(centerFrequency(nyq)) + ' Hz)',
       b.left + (b.right - b.left) / 2, b.top + b.h + 8);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('bin ' + (N - 1), b.right, b.top + b.h + 8);

  if (!drawAsBoxes) {
    fill('dimgray');
    textSize(13);
    textAlign(CENTER, TOP);
    text('At N = ' + N + ' the bins are too narrow to label individually — ' +
         'that density is the resolution you bought.',
         b.left, b.top + b.h + 28, b.right - b.left, 20);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 218;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, 106, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);

  fill('black');
  text('Bin width  =  f_s / N  =  ' + sampleRate.toLocaleString('en-US') +
       ' / ' + N + '  =  ' + binWidth().toFixed(2) + ' Hz',
       margin + 14, y + 10);
  text('Frequency resolution  =  ' + binWidth().toFixed(2) + ' Hz',
       margin + 14, y + 34);
  text('Number of bins  =  N  =  ' + N +
       '   (' + (N / 2 + 1) + ' unique for a real input)',
       margin + 14, y + 58);

  fill('darkblue');
  textStyle(BOLD);
  const lo = centerFrequency(selectedBin) - binWidth() / 2;
  const hi = centerFrequency(selectedBin) + binWidth() / 2;
  text('Selected: bin ' + selectedBin + ' — center ' +
       centerFrequency(selectedBin).toFixed(2) + ' Hz, covering ' +
       Math.max(0, lo).toFixed(1) + ' to ' + hi.toFixed(1) + ' Hz',
       margin + 14, y + 82);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('N (samples): ' + N, 10, drawHeight + 15);
  text('Sampling rate: ' + sampleRate.toLocaleString('en-US') + ' Hz',
       10, drawHeight + 50);
}

function mousePressed() {
  const b = binBoxes;
  if (!b || mouseY < b.top || mouseY > b.top + b.h) return;
  if (mouseX < b.left || mouseX > b.right) return;
  const k = Math.floor((mouseX - b.left) / b.w);
  if (k >= 0 && k < N) selectedBin = k;
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  nSlider.size(w);
  rateSlider.size(w);
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
