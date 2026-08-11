// Live Spectrum Display Bin Averaging MicroSim
// CANVAS_HEIGHT: 500
// A 128-pixel OLED cannot show 256 FFT bins. Averaging bins into display bars
// is the usual fix, and it trades frequency detail for a display that fits.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

const BINS = 256;

// Three example spectra, each 256 bins, precomputed once.
const EXAMPLES = [
  { name: 'Single tone (440 Hz)', data: makeTone([14]) },
  { name: 'Chord (three tones)', data: makeTone([14, 22, 33]) },
  { name: 'White noise', data: makeNoise() }
];

function makeTone(peaks) {
  const a = new Array(BINS).fill(0);
  for (let i = 0; i < BINS; i++) {
    let v = 0.02;
    for (const p of peaks) {
      // A narrow peak with realistic skirts, plus a couple of harmonics.
      v += 0.95 / (1 + Math.pow((i - p) / 1.2, 2));
      v += 0.30 / (1 + Math.pow((i - p * 2) / 1.4, 2));
      v += 0.12 / (1 + Math.pow((i - p * 3) / 1.6, 2));
    }
    a[i] = Math.min(1, v);
  }
  return a;
}

function makeNoise() {
  const a = new Array(BINS);
  // Deterministic pseudo-noise so the figure is reproducible.
  let seed = 12345;
  for (let i = 0; i < BINS; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    a[i] = 0.18 + 0.5 * (seed / 2147483648);
  }
  return a;
}

let barsSlider, frameButton;
let displayBars = 32;
let exampleIndex = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  frameButton = createButton('Next simulated frame');
  frameButton.position(10, drawHeight + 5);
  frameButton.mousePressed(() => {
    exampleIndex = (exampleIndex + 1) % EXAMPLES.length;
  });
  frameButton.parent(document.querySelector('main'));

  // Powers of two from 8 to 256 so the grouping always divides evenly.
  barsSlider = createSlider(3, 8, 5, 1);
  barsSlider.position(sliderLeftMargin, drawHeight + 45);
  barsSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A simulated OLED spectrum display above the full 256-bin reference ' +
    'spectrum, with shaded bands showing which bins average into each ' +
    'displayed bar.', LABEL);
}

function draw() {
  updateCanvasSize();
  displayBars = Math.pow(2, barsSlider.value());

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const averaged = averageBins();
  drawTitle();
  drawOled(averaged);
  drawReference();
  drawReadout();
  drawControlLabels();
}

function binsPerBar() {
  return BINS / displayBars;
}

function averageBins() {
  const src = EXAMPLES[exampleIndex].data;
  const group = binsPerBar();
  const out = [];
  for (let b = 0; b < displayBars; b++) {
    let sum = 0;
    for (let i = 0; i < group; i++) sum += src[b * group + i];
    out.push(sum / group);
  }
  return out;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Bin Averaging for a Small Display', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function oledGeometry() {
  const w = constrain(canvasWidth * 0.44, 220, 360);
  return { x: (canvasWidth - w) / 2, y: 40, w: w, h: w / 2 };
}

function drawOled(averaged) {
  const g = oledGeometry();

  // Bezel and glass
  noStroke();
  fill('dimgray');
  rect(g.x - 6, g.y - 6, g.w + 12, g.h + 12, 6);
  fill('black');
  rect(g.x, g.y, g.w, g.h);

  const slot = g.w / displayBars;
  for (let b = 0; b < displayBars; b++) {
    const bh = averaged[b] * (g.h - 6);
    fill('deepskyblue');
    rect(g.x + slot * b + (slot > 4 ? 0.8 : 0.2), g.y + g.h - bh,
         Math.max(1, slot - (slot > 4 ? 1.6 : 0.4)), bh);
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  text('Simulated 128 x 64 OLED — ' + displayBars + ' bars',
       canvasWidth / 2, g.y + g.h + 12);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReference() {
  const left = 40;
  const right = canvasWidth - 25;
  const top = 246;
  const h = 104;
  const base = top + h;
  if (right <= left) return;
  const src = EXAMPLES[exampleIndex].data;

  // Alternating bands, one per displayed bar, showing the grouping.
  noStroke();
  const group = binsPerBar();
  for (let b = 0; b < displayBars; b++) {
    const x1 = map(b * group, 0, BINS, left, right);
    const x2 = map((b + 1) * group, 0, BINS, left, right);
    fill(b % 2 === 0 ? 'rgba(21,101,192,0.10)' : 'rgba(21,101,192,0.03)');
    rect(x1, top, x2 - x1, h);
  }

  stroke('lightgray');
  strokeWeight(1);
  line(left, base, right, base);

  stroke('mediumblue');
  strokeWeight(1.2);
  noFill();
  beginShape();
  for (let i = 0; i < BINS; i++) {
    vertex(map(i, 0, BINS, left, right), base - src[i] * (h - 6));
  }
  endShape();

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Full 256-bin spectrum — shaded bands group the bins averaged into each bar',
       left, base + 6);
  textAlign(RIGHT, CENTER);
  text('1.0', left - 6, top + 6);
  text('0', left - 6, base);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 374;
  const h = 36;
  const group = binsPerBar();
  const lossless = displayBars === BINS;

  stroke(lossless ? 'darkgreen' : 'silver');
  strokeWeight(lossless ? 2 : 1);
  fill(lossless ? 'honeydew' : 'rgba(255,255,255,0.94)');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  fill(lossless ? 'darkgreen' : 'black');
  text(lossless
        ? 'No averaging: 1 bin per bar. The OLED matches the reference exactly — ' +
          'and needs 256 pixels of width to do it.'
        : displayBars + ' bars from ' + BINS + ' bins  —  ' + group +
          ' bins averaged into each bar.  Signal: ' + EXAMPLES[exampleIndex].name,
       margin + 12, y + h / 2);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Displayed bars: ' + displayBars, 10, drawHeight + 55);
  fill('dimgray');
  textSize(13);
  text('Signal: ' + EXAMPLES[exampleIndex].name, 190, drawHeight + 17);
}

function resizeSliders() {
  barsSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
