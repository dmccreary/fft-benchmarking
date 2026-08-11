// Normalization Factor Explorer MicroSim
// CANVAS_HEIGHT: 480
// The same spectrum under three scaling conventions. The displayed numbers
// change enormously; the signal does not, and the round trip is exact either
// way.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const BINS_SHOWN = 16;
// One fixed underlying spectrum, unscaled. Everything displayed is this times
// the selected convention's forward factor — the source of truth never changes.
const UNSCALED = [0, 8.0, 0, 0, 3.0, 0, 0, 0, 1.5, 0, 0, 0, 0.6, 0, 0, 0];

const CONVENTIONS = {
  'No forward scaling, 1/N inverse': {
    forward: () => 1,
    forwardLabel: () => '1',
    inverseLabel: n => '1/' + n,
    note: 'The most common convention, and what most FFT libraries do by ' +
          'default. Forward output grows with N.'
  },
  '1/sqrt(N) both directions (unitary)': {
    forward: n => 1 / Math.sqrt(n),
    forwardLabel: n => '1/√' + n + ' = ' + (1 / Math.sqrt(n)).toExponential(2),
    inverseLabel: n => '1/√' + n,
    note: 'The unitary convention. Symmetric, and it preserves total energy ' +
          'between the two domains — favored in mathematics.'
  },
  '1/N forward, no inverse scaling': {
    forward: n => 1 / n,
    forwardLabel: n => '1/' + n + ' = ' + (1 / n).toExponential(2),
    inverseLabel: () => '1',
    note: 'Forward output is an average rather than a sum, so magnitudes stay ' +
          'near the input amplitude regardless of N.'
  }
};

let conventionRadio, nSelect;
let convName = 'No forward scaling, 1/N inverse';
let N = 512;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  conventionRadio = createRadio();
  for (const name of Object.keys(CONVENTIONS)) conventionRadio.option(name);
  conventionRadio.selected(convName);
  conventionRadio.position(10, drawHeight + 6);
  conventionRadio.style('font-size', '13px');
  conventionRadio.parent(document.querySelector('main'));

  nSelect = createSelect();
  for (const v of [8, 512, 1024]) nSelect.option(v);
  nSelect.selected('512');
  nSelect.position(64, drawHeight + 46);
  nSelect.parent(document.querySelector('main'));

  describe('A fixed example spectrum shown as a bar chart, rescaled live by the ' +
    'selected FFT normalization convention, with readouts of the forward, ' +
    'inverse, and round-trip scaling factors.', LABEL);
}

function draw() {
  updateCanvasSize();
  convName = conventionRadio.value() || convName;
  N = Number(nSelect.value());

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawChart();
  drawReadout();
  drawControlLabels();
}

function forwardFactor() {
  return CONVENTIONS[convName].forward(N);
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('FFT Normalization Conventions', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('One underlying spectrum, three ways of scaling it', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawChart() {
  const left = 66;
  const right = canvasWidth - 25;
  const top = 58;
  const h = 190;
  const base = top + h;
  if (right <= left) return;

  const slot = (right - left) / BINS_SHOWN;
  const factor = forwardFactor();
  // The y-axis is pinned to the unscaled peak, so choosing a small forward
  // factor visibly shrinks the bars instead of being hidden by auto-scaling.
  const fullScale = 8.0;

  stroke('lightgray');
  strokeWeight(1);
  line(left, base, right, base);
  for (let f = 2; f <= 8; f += 2) {
    const y = base - (f / fullScale) * (h - 10);
    line(left, y, right, y);
    noStroke();
    fill('dimgray');
    textSize(11);
    textAlign(RIGHT, CENTER);
    text(f.toFixed(0), left - 6, y);
    stroke('lightgray');
  }

  noStroke();
  for (let k = 0; k < BINS_SHOWN; k++) {
    const v = UNSCALED[k] * factor;
    const bh = (v / fullScale) * (h - 10);
    fill(UNSCALED[k] > 0 ? 'mediumblue' : 'gainsboro');
    rect(left + slot * k + slot * 0.2, base - Math.max(bh, UNSCALED[k] > 0 ? 2 : 1),
         slot * 0.6, Math.max(bh, UNSCALED[k] > 0 ? 2 : 1));

    if (UNSCALED[k] > 0) {
      fill('mediumblue');
      textSize(10);
      textAlign(CENTER, BOTTOM);
      text(formatValue(v), left + slot * k + slot / 2, base - Math.max(bh, 2) - 3);
    }
  }

  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  for (let k = 0; k < BINS_SHOWN; k += 2) {
    text(k, left + slot * k + slot / 2, base + 5);
  }
  text('bin index (first ' + BINS_SHOWN + ' of ' + N + ')',
       left, base + 22, right - left, 16);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function formatValue(v) {
  if (v === 0) return '0';
  if (v < 0.01) return v.toExponential(1);
  return v.toFixed(v < 1 ? 3 : 2);
}

function drawReadout() {
  const c = CONVENTIONS[convName];
  const y = 298;
  const h = 92;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);

  fill('black');
  textSize(14);
  textStyle(BOLD);
  text('Forward scaling: ' + c.forwardLabel(N) +
       '     |     Inverse scaling: ' + c.inverseLabel(N) +
       '     |     Round-trip: 1.000',
       margin + 12, y + 10);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text(c.note, margin + 12, y + 34, canvasWidth - 2 * margin - 24, 32);

  fill('darkgreen');
  textSize(13);
  text('A full forward-then-inverse round trip reconstructs the original signal ' +
       'exactly under every convention. Scaling is a display choice, not a ' +
       'correctness issue.',
       margin + 12, y + 60, canvasWidth - 2 * margin - 24, 30);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('N =', 10, drawHeight + 58);
  fill('dimgray');
  textSize(13);
  text('Peak bin unscaled value: 8.00   →   displayed as ' +
       formatValue(8.0 * forwardFactor()), 150, drawHeight + 58);
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
