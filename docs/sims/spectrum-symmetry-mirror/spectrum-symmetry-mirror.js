// Spectrum Symmetry Mirror MicroSim
// CANVAS_HEIGHT: 425
// For a real-valued input, bin k and bin N-k are complex conjugates. Clicking
// either one draws the arc that pairs them.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const N = 16;            // a fixed illustrative size, independent of N elsewhere
const DC_COLOR = 'darkorange';
const NYQ_COLOR = 'mediumvioletred';
const POS_COLOR = 'cornflowerblue';
const MIRROR_COLOR = 'darkgray';

let selectedBin = 3;
let resetButton;
let row = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Clear selection');
  resetButton.position(10, drawHeight + 8);
  resetButton.mousePressed(() => { selectedBin = -1; });
  resetButton.parent(document.querySelector('main'));

  describe('A row of 16 DFT bins with the DC and Nyquist bins highlighted, ' +
    'positive-frequency bins in blue and their mirrored partners in gray, and ' +
    'a connector arc drawn between any clicked pair.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeRow();
  drawTitle();
  drawRegionLabels();
  drawMirrorArc();
  drawBins();
  drawInfoPanel();
  drawControlLabels();
}

function computeRow() {
  const left = 28;
  const right = canvasWidth - 28;
  row = { left: left, right: right, w: (right - left) / N, top: 138, h: 62 };
}

function partnerOf(k) {
  if (k === 0 || k === N / 2) return k;
  return (N - k) % N;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Spectrum Symmetry: Why Half the Bins Are Redundant', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text('A 16-point DFT of a real-valued input', canvasWidth / 2, 34);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawRegionLabels() {
  const r = row;
  const y = r.top + r.h + 26;

  noStroke();
  textSize(13);

  // Positive-frequency span, bins 1 .. N/2-1
  const posStart = r.left + r.w * 1;
  const posEnd = r.left + r.w * (N / 2);
  stroke(POS_COLOR);
  strokeWeight(2);
  line(posStart, y, posEnd, y);
  noStroke();
  fill(POS_COLOR);
  textAlign(CENTER, TOP);
  text('Positive frequencies\n(unique, useful)', (posStart + posEnd) / 2, y + 5);

  // Mirror span, bins N/2+1 .. N-1
  const mirStart = r.left + r.w * (N / 2 + 1);
  const mirEnd = r.left + r.w * N;
  stroke(MIRROR_COLOR);
  strokeWeight(2);
  line(mirStart, y, mirEnd, y);
  noStroke();
  fill(MIRROR_COLOR);
  text('Negative frequencies\n(mirror, redundant)', (mirStart + mirEnd) / 2, y + 5);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMirrorArc() {
  if (selectedBin < 0) return;
  const partner = partnerOf(selectedBin);
  if (partner === selectedBin) return;

  const r = row;
  const x1 = r.left + r.w * (selectedBin + 0.5);
  const x2 = r.left + r.w * (partner + 0.5);
  const apex = 76;

  stroke('crimson');
  strokeWeight(2);
  noFill();
  drawingContext.setLineDash([6, 4]);
  bezier(x1, r.top - 4, x1, apex, x2, apex, x2, r.top - 4);
  drawingContext.setLineDash([]);

  noStroke();
  fill('crimson');
  textSize(13);
  textAlign(CENTER, BOTTOM);
  // The bezier peaks near y = apex + 14; sit the label above that.
  text('conjugate pair', (x1 + x2) / 2, apex + 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBins() {
  const r = row;
  const partner = selectedBin >= 0 ? partnerOf(selectedBin) : -1;

  for (let k = 0; k < N; k++) {
    const x = r.left + r.w * k;
    const isDC = k === 0;
    const isNyq = k === N / 2;
    const inMirror = k > N / 2;
    const isLit = k === selectedBin || k === partner;

    stroke(isLit ? 'crimson' : 'white');
    strokeWeight(isLit ? 3 : 1);
    fill(isDC ? DC_COLOR : isNyq ? NYQ_COLOR : inMirror ? MIRROR_COLOR : POS_COLOR);
    rect(x, r.top, r.w, r.h);

    noStroke();
    fill('white');
    textSize(14);
    textAlign(CENTER, CENTER);
    text(k, x + r.w / 2, r.top + r.h / 2);
  }

  // Bracket labels for the two special bins
  noStroke();
  textSize(12);
  fill(DC_COLOR);
  textAlign(CENTER, BOTTOM);
  text('DC', r.left + r.w * 0.5, r.top - 6);
  fill(NYQ_COLOR);
  text('Nyquist', r.left + r.w * (N / 2 + 0.5), r.top - 6);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawInfoPanel() {
  const y = 292;
  const h = 76;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);

  if (selectedBin < 0) {
    fill('dimgray');
    text('Click any bin. Blue bins carry unique information; gray bins are their ' +
         'mirrors. The DC and Nyquist bins are special — each is its own mirror.',
         margin + 12, y + 12, canvasWidth - 2 * margin - 24, h - 20);
    return;
  }

  const partner = partnerOf(selectedBin);
  fill('black');
  if (partner === selectedBin) {
    textStyle(BOLD);
    text('Bin ' + selectedBin + ' — ' + (selectedBin === 0 ? 'the DC bin' :
         'the Nyquist bin'), margin + 12, y + 10);
    textStyle(NORMAL);
    text('This bin is its own mirror: there is no separate partner. Its value is ' +
         'purely real for a real-valued input, so there is no imaginary part to ' +
         'flip the sign of.',
         margin + 12, y + 32, canvasWidth - 2 * margin - 24, h - 40);
  } else {
    textStyle(BOLD);
    text('Bin ' + selectedBin + ' and bin ' + partner + ' are complex conjugates',
         margin + 12, y + 10);
    textStyle(NORMAL);
    text('Same magnitude, opposite-signed imaginary part — because the input ' +
         'signal is real-valued. Bin ' + Math.max(selectedBin, partner) +
         ' carries no information that bin ' + Math.min(selectedBin, partner) +
         ' does not already have, which is why real-input FFTs report only ' +
         (N / 2 + 1) + ' bins.',
         margin + 12, y + 32, canvasWidth - 2 * margin - 24, h - 40);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Unique bins for a real input: ' + (N / 2 + 1) + ' of ' + N,
       130, drawHeight + 22);
  textSize(defaultTextSize);
}

function mousePressed() {
  const r = row;
  if (mouseY < r.top || mouseY > r.top + r.h) return;
  if (mouseX < r.left || mouseX > r.right) return;
  const k = Math.floor((mouseX - r.left) / r.w);
  if (k >= 0 && k < N) selectedBin = k;
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
