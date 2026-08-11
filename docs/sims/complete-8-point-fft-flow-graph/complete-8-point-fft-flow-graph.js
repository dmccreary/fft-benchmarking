// Complete 8-Point FFT Flow Graph MicroSim
// CANVAS_HEIGHT: 475
// All three stages and all twelve butterflies of a radix-2 decimation-in-time
// FFT. Every stage does four butterflies; only the pairing distance changes.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const N = 8;
const ROWS = 8;
// Bit-reversed input order for N = 8.
const INPUT_ORDER = [0, 4, 2, 6, 1, 5, 3, 7];

// Stage s pairs rows (i, i+span) with span = 2^s, and the twiddle exponent on
// the lower leg is j * N / (2*span), j counting within each group.
const STAGES = buildStages();

function buildStages() {
  const stages = [];
  for (let s = 0; s < 3; s++) {
    const m = Math.pow(2, s + 1);       // group size: 2, 4, 8
    const half = m / 2;                 // span: 1, 2, 4
    const butterflies = [];
    for (let base = 0; base < N; base += m) {
      for (let j = 0; j < half; j++) {
        butterflies.push({
          top: base + j,
          bot: base + j + half,
          k: (j * N) / m,
          span: half
        });
      }
    }
    stages.push(butterflies);
  }
  return stages;
}

let selectedButterfly = null;   // {stage, index}
let selectedStage = -1;
let tracedOutput = -1;
let resetButton;
let geom = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Clear highlight');
  resetButton.position(10, drawHeight + 8);
  resetButton.mousePressed(clearAll);
  resetButton.parent(document.querySelector('main'));

  describe('The complete three-stage flow graph of an eight-point radix-2 FFT, ' +
    'with bit-reversed inputs on the left, twelve butterflies across three ' +
    'stages, and natural-order outputs on the right.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeGeom();
  drawTitle();
  drawStageHeaders();
  drawEdges();
  drawNodes();
  drawInfoPanel();
  drawControlLabels();
}

function computeGeom() {
  const left = 74;
  const right = canvasWidth - 74;
  geom = {
    colX: k => left + ((right - left) / 3) * k,
    rowY: r => 88 + r * 27,
    left: left,
    right: right
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Complete 8-Point FFT Flow Graph', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function stageHeaderBox(s) {
  const x1 = geom.colX(s);
  const x2 = geom.colX(s + 1);
  return { x: x1, y: 44, w: x2 - x1, h: 20, cx: (x1 + x2) / 2 };
}

function drawStageHeaders() {
  for (let s = 0; s < 3; s++) {
    const b = stageHeaderBox(s);
    const lit = selectedStage === s;
    noStroke();
    fill(lit ? 'crimson' : 'dimgray');
    textSize(14);
    textStyle(lit ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text('Stage ' + (s + 1) + '  (span ' + STAGES[s][0].span + ')', b.cx, b.y + 10);
    textStyle(NORMAL);
  }
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, CENTER);
  text('bit-reversed\ninput', geom.colX(0) - 40, 52);
  text('output', geom.colX(3) + 38, 52);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Highlight bookkeeping ------------------------------------------------------

function highlightedButterflies() {
  const set = new Set();
  if (selectedStage >= 0) {
    STAGES[selectedStage].forEach((_, i) => set.add(selectedStage + ':' + i));
  }
  if (selectedButterfly) {
    set.add(selectedButterfly.stage + ':' + selectedButterfly.index);
  }
  if (tracedOutput >= 0) {
    // Walk backwards from the output row, collecting every contributing
    // butterfly at each earlier stage.
    let rows = new Set([tracedOutput]);
    for (let s = 2; s >= 0; s--) {
      const next = new Set();
      STAGES[s].forEach((bf, i) => {
        if (rows.has(bf.top) || rows.has(bf.bot)) {
          set.add(s + ':' + i);
          next.add(bf.top);
          next.add(bf.bot);
        }
      });
      rows = next;
    }
  }
  return set;
}

function drawEdges() {
  const lit = highlightedButterflies();
  const anyHighlight = lit.size > 0;

  for (let s = 0; s < 3; s++) {
    const x1 = geom.colX(s);
    const x2 = geom.colX(s + 1);
    STAGES[s].forEach((bf, i) => {
      const on = lit.has(s + ':' + i);
      const ty = geom.rowY(bf.top);
      const by = geom.rowY(bf.bot);

      stroke(on ? 'crimson' : anyHighlight ? '#d0d7de' : '#607d8b');
      strokeWeight(on ? 2.5 : 1.2);

      // Straight-through legs
      line(x1, ty, x2, ty);
      line(x1, by, x2, by);
      // Cross legs
      line(x1, ty, x2, by);
      line(x1, by, x2, ty);

      // Twiddle label on the lower incoming leg. Every butterfly is labeled,
      // including the W0 ones — "stage 1 is entirely W0" is itself the point
      // that a multiply-free first stage is possible.
      {
        noStroke();
        fill(on ? 'crimson' : anyHighlight ? '#c3cbd3' : 'darkviolet');
        textSize(11);
        textAlign(CENTER, BOTTOM);
        text('W' + bf.k, (x1 + x2) / 2 + 2, by - 3);
      }
    });
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawNodes() {
  for (let c = 0; c <= 3; c++) {
    for (let r = 0; r < ROWS; r++) {
      const x = geom.colX(c);
      const y = geom.rowY(r);
      const isOutput = c === 3;
      const traced = isOutput && tracedOutput === r;

      noStroke();
      fill(traced ? 'crimson' : c === 0 ? 'darkorange' : isOutput ? 'darkgreen' : 'steelblue');
      circle(x, y, traced ? 12 : c === 0 || isOutput ? 10 : 7);
    }
  }

  // Row labels
  noStroke();
  textSize(12);
  for (let r = 0; r < ROWS; r++) {
    fill('darkorange');
    textAlign(RIGHT, CENTER);
    text('x[' + INPUT_ORDER[r] + ']', geom.colX(0) - 10, geom.rowY(r));
    fill(tracedOutput === r ? 'crimson' : 'darkgreen');
    textAlign(LEFT, CENTER);
    text('X[' + r + ']', geom.colX(3) + 10, geom.rowY(r));
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawInfoPanel() {
  const y = 322;
  const h = 92;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);

  if (selectedButterfly) {
    const bf = STAGES[selectedButterfly.stage][selectedButterfly.index];
    fill('black');
    textStyle(BOLD);
    text('Butterfly in stage ' + (selectedButterfly.stage + 1),
         margin + 12, y + 10);
    textStyle(NORMAL);
    text('Inputs: row ' + bf.top + ' and row ' + bf.bot +
         '   •   twiddle = W_8^' + bf.k + '   •   span = ' + bf.span,
         margin + 12, y + 32);
    fill('dimgray');
    text('Outputs: row ' + bf.top + ' receives a + W·b, row ' + bf.bot +
         ' receives a − W·b. Both come from the one product W·b.',
         margin + 12, y + 52, canvasWidth - 2 * margin - 24, 34);
  } else if (selectedStage >= 0) {
    const span = STAGES[selectedStage][0].span;
    fill('black');
    textStyle(BOLD);
    text('Stage ' + (selectedStage + 1) + ': 4 butterflies, span = ' + span,
         margin + 12, y + 10);
    textStyle(NORMAL);
    fill('dimgray');
    text('Every stage performs exactly N/2 = 4 butterflies. What changes is the ' +
         'distance between paired rows: 1, then 2, then 4. Three stages, because ' +
         'log2(8) = 3 — and 3 × 4 = 12 butterflies in total.',
         margin + 12, y + 32, canvasWidth - 2 * margin - 24, 52);
  } else if (tracedOutput >= 0) {
    fill('black');
    textStyle(BOLD);
    text('Tracing X[' + tracedOutput + ']', margin + 12, y + 10);
    textStyle(NORMAL);
    fill('dimgray');
    text('Highlighted are every butterfly and every input that contributes to ' +
         'this one output. Notice that all eight inputs reach it — each output ' +
         'depends on the entire input record, exactly as the DFT definition says.',
         margin + 12, y + 32, canvasWidth - 2 * margin - 24, 52);
  } else {
    fill('dimgray');
    text('Click a butterfly to inspect its pairing and twiddle, a stage label to ' +
         'highlight that whole stage, or an output node on the right to trace ' +
         'everything feeding into it.',
         margin + 12, y + 12, canvasWidth - 2 * margin - 24, h - 20);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('3 stages × 4 butterflies = 12 butterflies   •   log2(8) = 3',
       150, drawHeight + 22);
  textSize(defaultTextSize);
}

function clearAll() {
  selectedButterfly = null;
  selectedStage = -1;
  tracedOutput = -1;
}

function mousePressed() {
  // Stage header?
  for (let s = 0; s < 3; s++) {
    const b = stageHeaderBox(s);
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      clearAll();
      selectedStage = s;
      return;
    }
  }

  // Output node?
  for (let r = 0; r < ROWS; r++) {
    if (dist(mouseX, mouseY, geom.colX(3), geom.rowY(r)) < 14) {
      clearAll();
      tracedOutput = r;
      return;
    }
  }

  // Butterfly? Hit-test the band between two columns at the butterfly's rows.
  for (let s = 0; s < 3; s++) {
    const x1 = geom.colX(s);
    const x2 = geom.colX(s + 1);
    if (mouseX < x1 || mouseX > x2) continue;
    for (let i = 0; i < STAGES[s].length; i++) {
      const bf = STAGES[s][i];
      const ty = geom.rowY(bf.top);
      const by = geom.rowY(bf.bot);
      if (mouseY >= ty - 12 && mouseY <= by + 12) {
        clearAll();
        selectedButterfly = { stage: s, index: i };
        return;
      }
    }
  }
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
