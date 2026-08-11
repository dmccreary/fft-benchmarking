// Branch Misprediction Visualizer MicroSim
// CANVAS_HEIGHT: 489
// Two pipelines running the same ten branches. The only difference is whether
// the outcomes follow a pattern the predictor can learn.

let canvasWidth = 400;
let drawHeight = 444;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const COUNT = 10;
const FLUSH_COST = 2;          // Fetch and Decode are both discarded
const STEP_MS = 620;

// The loop's branch is taken every iteration but the last — the shape of every
// counted loop ever written.
const PREDICTABLE = ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'N'];
// A data-dependent branch: "skip the multiply when this twiddle is trivial".
// Trivial twiddles are scattered through the table, so the outcome carries no
// pattern for a one-bit predictor to latch onto.
const UNPREDICTABLE = ['T', 'T', 'N', 'N', 'T', 'N', 'T', 'T', 'N', 'N'];

// A one-bit predictor: guess that this branch does what it did last time.
function buildTrace(outcomes) {
  const trace = [];
  let guess = 'T';
  for (const actual of outcomes) {
    trace.push({ predicted: guess, actual: actual, correct: guess === actual });
    guess = actual;
  }
  return trace;
}

const LANES = [
  { name: 'Predictable branch', sub: 'BNE at the bottom of a counted loop',
    trace: buildTrace(PREDICTABLE) },
  { name: 'Unpredictable branch', sub: 'data-dependent skip over a trivial twiddle',
    trace: buildTrace(UNPREDICTABLE) }
];

// What the pipeline had speculatively fetched, per guessed direction.
const PATH = {
  T: { decode: 'VLDR  s0, [r1]', fetch: 'VMUL.F32 s2, s0, s4' },
  N: { decode: 'VSTR  s2, [r3]', fetch: 'ADD   r1, #4' }
};

let stepIndex = 0;
let running = false;
let lastStepMs = 0;
let flashUntil = [0, 0];
let stepButton, runButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 10);
  stepButton.mousePressed(() => { running = false; doStep(); });
  stepButton.parent(document.querySelector('main'));

  runButton = createButton('Run all 10');
  runButton.position(70, drawHeight + 10);
  runButton.mousePressed(() => {
    if (stepIndex >= COUNT) resetAll();
    running = true;
    lastStepMs = millis();
  });
  runButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(165, drawHeight + 10);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  describe('Two pipeline lanes stepping through the same ten branch outcomes. ' +
    'The predictable lane flows without interruption; the unpredictable lane ' +
    'flushes its pipeline on each wrong guess while a wasted-cycle counter ' +
    'climbs.', LABEL);
}

function resetAll() {
  stepIndex = 0;
  running = false;
  flashUntil = [0, 0];
}

function doStep() {
  if (stepIndex >= COUNT) return;
  for (let l = 0; l < 2; l++) {
    if (!LANES[l].trace[stepIndex].correct) flashUntil[l] = millis() + 380;
  }
  stepIndex++;
  if (stepIndex >= COUNT) running = false;
}

function wastedCycles(lane, upTo) {
  let w = 0;
  for (let i = 0; i < upTo; i++) if (!lane.trace[i].correct) w += FLUSH_COST;
  return w;
}

function mispredicts(lane, upTo) {
  let m = 0;
  for (let i = 0; i < upTo; i++) if (!lane.trace[i].correct) m++;
  return m;
}

function draw() {
  updateCanvasSize();
  if (running && millis() - lastStepMs > STEP_MS) {
    lastStepMs = millis();
    doStep();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawLane(0, 56);
  drawLane(1, 206);
  drawSummary();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Branch Misprediction: Two Pipelines, Ten Branches', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('Three-stage pipeline: a wrong guess discards Fetch and Decode, ' +
       FLUSH_COST + ' cycles.    ✓ = predictor guessed right',
       canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawLane(l, y) {
  const lane = LANES[l];
  const h = 142;
  const left = margin;
  const w = canvasWidth - 2 * margin;
  const flashing = millis() < flashUntil[l];

  noStroke();
  fill(flashing ? color(255, 205, 205) : color(255, 255, 255, 235));
  stroke(flashing ? 'crimson' : 'silver');
  strokeWeight(flashing ? 2.5 : 1);
  rect(left - 8, y, w + 16, h, 8);

  // Header
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(lane.name, left, y + 6);
  // Measure while the bold 14px face is still active, or the gap collapses.
  const nameW = textWidth(lane.name);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text('— ' + lane.sub, left + nameW + 10, y + 8);

  const wasted = wastedCycles(lane, stepIndex);
  fill(wasted === 0 ? 'darkgreen' : 'crimson');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, TOP);
  text('wasted cycles: ' + wasted + '   (' + mispredicts(lane, stepIndex) +
       ' of ' + stepIndex + ' mispredicted)', left + w, y + 6);
  textStyle(NORMAL);

  drawOutcomeStrip(lane, left, y + 26, w);
  drawPipeline(lane, left, y + 56, w);
  drawLaneStatus(lane, left, y + 118, w);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawOutcomeStrip(lane, x, y, w) {
  const cw = w / COUNT;
  for (let i = 0; i < COUNT; i++) {
    const t = lane.trace[i];
    const done = i < stepIndex;
    const next = i === stepIndex;

    stroke(next ? 'darkorange' : 'lightgray');
    strokeWeight(next ? 2.5 : 1);
    fill(done ? (t.correct ? color(226, 245, 230) : color(253, 224, 224))
              : 'white');
    rect(x + i * cw + 2, y, cw - 4, 24, 4);

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    fill(done ? (t.correct ? 'darkgreen' : 'crimson') : 'darkgray');
    textStyle(done ? BOLD : NORMAL);
    text((done || next ? (t.actual === 'T' ? 'taken' : 'not tkn') : '?') +
         (done ? (t.correct ? '  ✓' : '  ✗') : ''),
         x + i * cw + cw / 2, y + 13);
    textStyle(NORMAL);
  }
  textAlign(LEFT, CENTER);
}

function drawPipeline(lane, x, y, w) {
  const names = ['Fetch', 'Decode', 'Execute'];
  const gap = 10;
  const bw = (w - 2 * gap) / 3;
  const t = stepIndex > 0 ? lane.trace[stepIndex - 1] : null;
  const flushed = t && !t.correct;
  const path = t ? PATH[t.predicted] : null;

  for (let s = 0; s < 3; s++) {
    const bx = x + s * (bw + gap);
    // Fetch and Decode hold speculative work; Execute holds the branch itself.
    const speculative = s < 2;
    const bad = flushed && speculative;

    stroke(bad ? 'crimson' : t ? 'steelblue' : 'lightgray');
    strokeWeight(bad ? 2.5 : 1.5);
    fill(bad ? color(253, 224, 224) : t ? 'white' : color(248, 248, 248));
    rect(bx, y, bw, 56, 6);

    noStroke();
    fill(bad ? 'crimson' : 'dimgray');
    textSize(11);
    textAlign(LEFT, TOP);
    text(names[s], bx + 8, y + 5);

    textAlign(CENTER, CENTER);
    if (!t) {
      fill('darkgray');
      textSize(13);
      text('—', bx + bw / 2, y + 34);
    } else if (bad) {
      fill('crimson');
      textSize(14);
      textStyle(BOLD);
      text('FLUSHED', bx + bw / 2, y + 28);
      textStyle(NORMAL);
      textSize(11);
      text('discarded: ' + (s === 0 ? path.fetch : path.decode),
           bx + bw / 2, y + 45);
    } else {
      fill('black');
      textSize(13);
      text(s === 0 ? path.fetch : s === 1 ? path.decode : 'BNE   loop',
           bx + bw / 2, y + 28);
      fill('darkgreen');
      textSize(11);
      text(s === 2 ? 'resolves the branch' : 'kept — guess was right',
           bx + bw / 2, y + 45);
    }
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function label(o) { return o === 'T' ? 'taken' : 'not taken'; }

function drawLaneStatus(lane, x, y, w) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12.5);
  if (stepIndex === 0) {
    fill('dimgray');
    text('Not started. Press Step to resolve the first branch.', x, y);
    return;
  }
  const t = lane.trace[stepIndex - 1];
  fill(t.correct ? 'darkgreen' : 'crimson');
  textStyle(BOLD);
  const head = 'Branch ' + stepIndex + ': guessed ' + label(t.predicted) +
               ', actually ' + label(t.actual) + ' — ';
  text(head, x, y);
  const hw = textWidth(head);
  text(t.correct ? 'correct, 0 cycles lost'
                 : 'wrong, pipeline flushed, ' + FLUSH_COST + ' cycles lost',
       x + hw, y);
  textStyle(NORMAL);
}

function drawSummary() {
  const y = 358;
  const h = 74;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const a = wastedCycles(LANES[0], COUNT);
  const b = wastedCycles(LANES[1], COUNT);
  const done = stepIndex >= COUNT;

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(14);
  textStyle(BOLD);
  text(done
        ? 'After all 10 branches: ' + a + ' wasted cycles predictable, ' +
          b + ' wasted cycles unpredictable'
        : 'Same ten branches, same instructions, same processor',
       margin + 12, y + 8);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(12.5);
  text(done
        ? 'The predictable lane pays once, on the loop\'s final exit — a cost ' +
          'that does not grow with iteration count. The unpredictable lane ' +
          'pays on roughly half of every ten branches forever. Across the ' +
          '2,304 butterflies of a 512-point FFT that is about 2,300 cycles ' +
          'thrown away, which is why the branch gets removed rather than tuned.'
        : 'The only difference between these lanes is whether the outcomes ' +
          'follow a pattern. The predictor learns the counted loop after one ' +
          'branch and is never wrong again until the loop exits. It cannot ' +
          'learn a data-dependent test, so it guesses, and half its guesses ' +
          'cost two cycles each.',
       margin + 12, y + 30, canvasWidth - 2 * margin - 24, 44);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Branch ' + stepIndex + ' of ' + COUNT, 240, drawHeight + 22);
  fill('dimgray');
  textSize(13);
  text('running total — predictable: ' + wastedCycles(LANES[0], stepIndex) +
       ' cycles   |   unpredictable: ' + wastedCycles(LANES[1], stepIndex) +
       ' cycles', 380, drawHeight + 22);
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
