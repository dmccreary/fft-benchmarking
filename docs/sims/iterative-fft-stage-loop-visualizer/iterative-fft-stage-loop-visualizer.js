// Iterative FFT Stage Loop Visualizer MicroSim
// CANVAS_HEIGHT: 445
// The iterative FFT's outer loop, one stage at a time. The span doubles each
// stage; the butterfly count never changes.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const N = 8;
const TOTAL_STAGES = 3;
// Same example signal as the by-hand DFT sim, so the final answer is checkable:
// X[0] = 8, X[1] = 8, X[7] = 8, everything else 0.
const SOURCE = [];
for (let n = 0; n < N; n++) {
  SOURCE.push({ re: 1.0 + 2.0 * Math.cos((2 * Math.PI * n) / N), im: 0 });
}

const ARC_COLORS = ['crimson', 'darkorange', 'seagreen', 'mediumblue'];

let data = [];
let originIndex = [];     // which original index sits in each slot
let permuted = false;
let stagesDone = 0;
let permButton, stageButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  permButton = createButton('Apply permutation');
  permButton.position(10, drawHeight + 8);
  permButton.mousePressed(applyPermutation);
  permButton.parent(document.querySelector('main'));

  stageButton = createButton('Run next stage');
  stageButton.position(148, drawHeight + 8);
  stageButton.mousePressed(runNextStage);
  stageButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(270, drawHeight + 8);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  resetAll();

  describe('An eight-element array shown as boxes with arcs marking the current ' +
    'stage\'s butterfly pairings, plus a readout of stage number, span, and ' +
    'butterfly count.', LABEL);
}

function resetAll() {
  data = SOURCE.map(c => ({ re: c.re, im: c.im }));
  originIndex = [0, 1, 2, 3, 4, 5, 6, 7];
  permuted = false;
  stagesDone = 0;
}

function bitReverse(i, bits) {
  let r = 0;
  for (let b = 0; b < bits; b++) {
    r = (r << 1) | ((i >> b) & 1);
  }
  return r;
}

function applyPermutation() {
  if (permuted) return;
  const bits = Math.log2(N);
  const newData = new Array(N);
  const newOrigin = new Array(N);
  for (let i = 0; i < N; i++) {
    const j = bitReverse(i, bits);
    newData[i] = data[j];
    newOrigin[i] = originIndex[j];
  }
  data = newData;
  originIndex = newOrigin;
  permuted = true;
}

// One pass of the outer stage loop, in place.
function runNextStage() {
  if (!permuted || stagesDone >= TOTAL_STAGES) return;
  const s = stagesDone + 1;
  const m = Math.pow(2, s);
  const half = m / 2;
  for (let base = 0; base < N; base += m) {
    for (let j = 0; j < half; j++) {
      const angle = (-2 * Math.PI * j) / m;
      const w = { re: Math.cos(angle), im: Math.sin(angle) };
      const a = data[base + j];
      const b = data[base + j + half];
      const wb = {
        re: w.re * b.re - w.im * b.im,
        im: w.re * b.im + w.im * b.re
      };
      data[base + j] = { re: a.re + wb.re, im: a.im + wb.im };
      data[base + j + half] = { re: a.re - wb.re, im: a.im - wb.im };
    }
  }
  stagesDone = s;
}

function currentPairs() {
  // Pairings for the stage that will run next (or the last one that ran).
  const s = Math.min(stagesDone + (stagesDone < TOTAL_STAGES ? 1 : 0),
                     TOTAL_STAGES);
  if (!permuted || s < 1) return { span: 0, pairs: [], stage: 0 };
  const m = Math.pow(2, s);
  const half = m / 2;
  const pairs = [];
  for (let base = 0; base < N; base += m) {
    for (let j = 0; j < half; j++) {
      pairs.push({ a: base + j, b: base + j + half, group: base / m });
    }
  }
  return { span: half, pairs: pairs, stage: s };
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
  drawArcs();
  drawArray();
  drawReadout();
  drawControlLabels();
}

function slotGeom() {
  const left = 30;
  const right = canvasWidth - 30;
  const w = (right - left) / N;
  return { left: left, right: right, w: w, top: 230, h: 62,
           cx: i => left + w * i + w / 2 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Iterative FFT: The Stage Loop', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawArcs() {
  const g = slotGeom();
  const info = currentPairs();
  if (!info.pairs.length) return;

  const baseY = g.top - 6;
  for (const p of info.pairs) {
    const x1 = g.cx(p.a);
    const x2 = g.cx(p.b);
    const rise = 34 + info.span * 16;
    stroke(ARC_COLORS[p.group % ARC_COLORS.length]);
    strokeWeight(2.5);
    noFill();
    bezier(x1, baseY, x1, baseY - rise, x2, baseY - rise, x2, baseY);
  }

  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(CENTER, TOP);
  text(stagesDone < TOTAL_STAGES
        ? 'Pairings for stage ' + info.stage + ' (span ' + info.span + ') — press Run next stage'
        : 'Final stage complete — pairings shown for stage ' + info.stage,
       g.left, 60, g.right - g.left, 20);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawArray() {
  const g = slotGeom();

  for (let i = 0; i < N; i++) {
    const x = g.left + g.w * i;
    stroke('gray');
    strokeWeight(1);
    fill(stagesDone === TOTAL_STAGES ? 'honeydew' : 'white');
    rect(x + 2, g.top, g.w - 4, g.h, 4);

    noStroke();
    fill('dimgray');
    textSize(11);
    textAlign(CENTER, TOP);
    text('[' + i + ']', x + g.w / 2, g.top + 3);

    fill('black');
    textSize(12);
    text(fmt(data[i].re), x + g.w / 2, g.top + 19);
    fill('crimson');
    text(fmtImag(data[i].im), x + g.w / 2, g.top + 34);

    fill(permuted ? 'darkorange' : 'silver');
    textSize(10);
    text(permuted ? 'x[' + originIndex[i] + ']' : 'x[' + i + ']',
         x + g.w / 2, g.top + 49);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function fmt(v) {
  const r = Math.abs(v) < 1e-9 ? 0 : v;
  return r.toFixed(2);
}

function fmtImag(v) {
  const r = Math.abs(v) < 1e-9 ? 0 : v;
  return (r < 0 ? '−' : '+') + Math.abs(r).toFixed(2) + 'i';
}

function drawReadout() {
  const info = currentPairs();
  const y = 312;
  const h = 74;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);

  if (!permuted) {
    fill('black');
    textStyle(BOLD);
    text('Step 0: the array is still in natural order', margin + 12, y + 10);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(13);
    text('The iterative FFT needs its input bit-reversed before the stage loop ' +
         'starts. Press "Apply permutation" to shuffle x[0..7] into ' +
         '0, 4, 2, 6, 1, 5, 3, 7 order.',
         margin + 12, y + 34, canvasWidth - 2 * margin - 24, 40);
  } else {
    // The arcs show the stage that is about to run, so the readout must
    // describe that same stage rather than the one already finished.
    const done = stagesDone >= TOTAL_STAGES;
    fill('black');
    textStyle(BOLD);
    text(done
          ? 'All ' + TOTAL_STAGES + ' stages complete   |   final span = ' +
            info.span + '   |   ' + (N / 2) + ' butterflies every stage'
          : 'Next: stage ' + info.stage + '   |   Span = ' + info.span +
            '   |   Butterflies this stage = N/2 = ' + (N / 2),
         margin + 12, y + 10);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(13);
    text(done
          ? 'Done. Every stage did exactly 4 butterflies; only the span changed — ' +
            '1, then 2, then 4. Result: X[0] = 8, X[1] = 8, X[7] = 8, all others 0.'
          : 'The span doubles at every stage while the butterfly count stays at ' +
            'N/2. That is why the total is (N/2)·log2(N), not N².',
         margin + 12, y + 34, canvasWidth - 2 * margin - 24, 40);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(!permuted ? 'Start with the permutation'
                 : stagesDone + ' of ' + TOTAL_STAGES + ' stages complete',
       340, drawHeight + 22);
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
