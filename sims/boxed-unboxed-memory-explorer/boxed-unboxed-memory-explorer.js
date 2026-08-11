// Boxed vs Unboxed Memory Explorer MicroSim
// CANVAS_HEIGHT: 500
// The same a + b, two value representations. One is a pointer chase with an
// allocation at the end; the other is a single add.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const BOXED_COLOR = 'crimson';
const UNBOXED_COLOR = 'darkgreen';

// Stage 0 is the starting state; the boxed path accumulates operations while
// the unboxed path finishes in one.
const STAGES = [
  { label: 'Starting state', boxedOps: 0, unboxedOps: 0,
    boxed: 'Two variable slots, each holding a pointer to a heap object.',
    unboxed: 'Two variable slots, each holding the value bytes directly.' },
  { label: 'Follow the pointers', boxedOps: 2, unboxedOps: 0,
    boxed: 'Load a\'s pointer, then load b\'s pointer, then read each heap ' +
           'object. Two memory operations that the unboxed path never makes.',
    unboxed: 'Nothing to follow. The bytes are already here.' },
  { label: 'Check the types', boxedOps: 4, unboxedOps: 0,
    boxed: 'Read each object\'s type tag and confirm both are floats. Two more ' +
           'reads, plus a branch that could go either way.',
    unboxed: 'The type was fixed when you annotated it. No runtime check.' },
  { label: 'Extract the values', boxedOps: 6, unboxedOps: 0,
    boxed: 'Read the value field out of each object. Two more reads before any ' +
           'arithmetic has happened at all.',
    unboxed: 'Already extracted — the slot is the value.' },
  { label: 'Add, and store the result', boxedOps: 7, unboxedOps: 1,
    boxed: 'Add, then allocate a NEW heap object for the result and write into ' +
           'it. The allocation may also trigger garbage collection.',
    unboxed: 'One ADD instruction writes straight into the result slot. Done.' }
];

let stepBackButton, stepForwardButton, runButton, tallyCheckbox;
let stage = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepBackButton = createButton('◀ Step back');
  stepBackButton.position(10, drawHeight + 5);
  stepBackButton.mousePressed(() => { stage = Math.max(0, stage - 1); });
  stepBackButton.parent(document.querySelector('main'));

  stepForwardButton = createButton('Step forward ▶');
  stepForwardButton.position(106, drawHeight + 5);
  stepForwardButton.mousePressed(() => {
    stage = Math.min(STAGES.length - 1, stage + 1);
  });
  stepForwardButton.parent(document.querySelector('main'));

  runButton = createButton('Run both to completion');
  runButton.position(224, drawHeight + 5);
  runButton.mousePressed(() => { stage = STAGES.length - 1; });
  runButton.parent(document.querySelector('main'));

  tallyCheckbox = createCheckbox(' Show operation tally', true);
  tallyCheckbox.position(10, drawHeight + 44);
  tallyCheckbox.parent(document.querySelector('main'));

  describe('Side-by-side memory diagrams for boxed and unboxed floats, stepped ' +
    'through the same addition, with a running count of memory operations for ' +
    'each.', LABEL);
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
  drawBoxedPanel();
  drawUnboxedPanel();
  drawControlLabels();
}

function drawTitle() {
  const s = STAGES[stage];
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Boxed vs Unboxed:  a + b', canvasWidth / 2, 4);
  textSize(14);
  fill('dimgray');
  text('Step ' + stage + ' of ' + (STAGES.length - 1) + ' — ' + s.label,
       canvasWidth / 2, 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function panelGeometry(top, h) {
  return { x: margin, y: top, w: canvasWidth - 2 * margin, h: h };
}

function drawBoxedPanel() {
  const g = panelGeometry(54, 228);
  const s = STAGES[stage];

  stroke(BOXED_COLOR);
  strokeWeight(2);
  fill('mistyrose');
  rect(g.x, g.y, g.w, g.h, 8);

  noStroke();
  fill(BOXED_COLOR);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Boxed  (MicroPython default)', g.x + 12, g.y + 8);
  textStyle(NORMAL);

  const slotX = g.x + 20;
  const heapX = g.x + 190;
  for (let i = 0; i < 2; i++) {
    const name = i === 0 ? 'a' : 'b';
    const y = g.y + 40 + i * 54;

    // Variable slot holding a pointer
    stroke('gray');
    strokeWeight(1);
    fill('white');
    rect(slotX, y, 86, 34, 3);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, CENTER);
    text(name + ':  ptr', slotX + 43, y + 17);

    // Pointer arrow, lit once we have followed it
    const lit = stage >= 1;
    stroke(lit ? BOXED_COLOR : 'gray');
    strokeWeight(lit ? 2.5 : 1.5);
    line(slotX + 86, y + 17, heapX - 6, y + 17);
    noStroke();
    fill(lit ? BOXED_COLOR : 'gray');
    triangle(heapX - 2, y + 17, heapX - 10, y + 12, heapX - 10, y + 22);

    // Heap object: three fields
    const fields = [
      { t: 'type tag', on: stage >= 2 },
      { t: 'refcount', on: false },
      { t: 'value', on: stage >= 3 }
    ];
    for (let f = 0; f < 3; f++) {
      const fx = heapX + f * 86;
      stroke(fields[f].on ? BOXED_COLOR : 'gray');
      strokeWeight(fields[f].on ? 2 : 1);
      fill(fields[f].on ? 'lightsalmon' : 'white');
      rect(fx, y, 84, 34, 3);
      noStroke();
      fill('black');
      textSize(11);
      textAlign(CENTER, CENTER);
      text(fields[f].t, fx + 42, y + 17);
    }
    if (i === 0) {
      noStroke();
      fill('dimgray');
      textSize(11);
      textAlign(LEFT, BOTTOM);
      text('heap object', heapX, y - 3);
    }
  }

  // The result allocation only appears at the final stage
  if (stage >= 4) {
    const y = g.y + 150;
    stroke(BOXED_COLOR);
    strokeWeight(2);
    fill('lightsalmon');
    rect(heapX, y, 254, 30, 3);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, CENTER);
    text('NEW heap object allocated for the result', heapX + 127, y + 15);
    fill(BOXED_COLOR);
    textSize(11);
    textAlign(RIGHT, CENTER);
    text('may trigger GC →', heapX - 8, y + 15);
  }

  drawNote(g, s.boxed, s.boxedOps, BOXED_COLOR);
}

function drawUnboxedPanel() {
  const g = panelGeometry(292, 120);
  const s = STAGES[stage];

  stroke(UNBOXED_COLOR);
  strokeWeight(2);
  fill('honeydew');
  rect(g.x, g.y, g.w, g.h, 8);

  noStroke();
  fill(UNBOXED_COLOR);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Unboxed  (@viper, C, assembly)', g.x + 12, g.y + 8);
  textStyle(NORMAL);

  const slotX = g.x + 20;
  const y = g.y + 38;
  for (let i = 0; i < 2; i++) {
    const name = i === 0 ? 'a' : 'b';
    stroke('gray');
    strokeWeight(1);
    fill('white');
    rect(slotX + i * 120, y, 108, 34, 3);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, CENTER);
    text(name + ':  3F800000', slotX + i * 120 + 54, y + 17);
  }

  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('raw value bytes — no pointer, no object', slotX, y - 3);

  // The single ADD
  const lit = stage >= 4;
  stroke(lit ? UNBOXED_COLOR : 'gray');
  strokeWeight(lit ? 3 : 1.5);
  line(slotX + 250, y + 17, slotX + 286, y + 17);
  noStroke();
  fill(lit ? UNBOXED_COLOR : 'gray');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('ADD', slotX + 268, y - 2);

  stroke(lit ? UNBOXED_COLOR : 'gray');
  strokeWeight(lit ? 2 : 1);
  fill(lit ? 'palegreen' : 'white');
  rect(slotX + 292, y, 118, 34, 3);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, CENTER);
  text('result slot', slotX + 351, y + 17);

  drawNote(g, s.unboxed, s.unboxedOps, UNBOXED_COLOR);
}

function drawNote(g, note, ops, colorName) {
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(12);
  text(note, g.x + 12, g.y + g.h - 42, g.w - 150, 38);

  if (tallyCheckbox.checked()) {
    textAlign(RIGHT, CENTER);
    fill(colorName);
    textStyle(BOLD);
    textSize(19);
    text(ops + (ops === 1 ? ' memory op' : ' memory ops'),
         g.x + g.w - 14, g.y + g.h - 24);
    textStyle(NORMAL);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(stage === STAGES.length - 1
        ? 'Complete: 7 memory operations versus 1, for the same addition.'
        : 'Step both paths forward together and watch the tallies diverge.',
       210, drawHeight + 56);
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
