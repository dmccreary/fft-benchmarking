// Abstraction Ladder Diagram MicroSim
// CANVAS_HEIGHT: 470
// Five ways to write the same FFT, ranked. Each rung down is faster, and each
// one takes something away.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Bar widths are illustrative relative execution times, not measurements.
const RUNGS = [
  {
    name: 'MicroPython (bytecode)', relative: 1.00, color: '#1565c0',
    runs: 'A bytecode interpreter loop, one opcode at a time',
    values: 'Every value boxed on the heap',
    tip: 'The default. Easiest to write, slowest to run.',
    gives: 'Nothing yet — this is the baseline. Everything below trades ' +
           'convenience for speed.'
  },
  {
    name: 'MicroPython @native', relative: 0.62, color: '#00838f',
    runs: 'Compiled to machine code, but still calling the runtime',
    values: 'Still boxed',
    tip: 'Machine code instead of bytecode dispatch — same object model.',
    gives: 'You give up the ability to inspect bytecode, and code size grows. ' +
           'The value model is unchanged, so the win is bounded.'
  },
  {
    name: 'MicroPython @viper', relative: 0.28, color: '#2e7d32',
    runs: 'Compiled to machine code with your type annotations',
    values: 'Unboxed machine types you declare yourself',
    tip: 'Native speed for annotated values — and native consequences.',
    gives: 'You give up automatic memory safety for the values you have ' +
           'annotated. A wrong annotation is a wrong answer or a crash, not a ' +
           'TypeError.'
  },
  {
    name: 'C', relative: 0.11, color: '#ef6c00',
    runs: 'An optimizing compiler, ahead of time',
    values: 'Unboxed, with the compiler choosing registers',
    tip: 'Full optimizer, full manual memory management.',
    gives: 'You give up the Python runtime entirely — garbage collection, ' +
           'dynamic typing, and the REPL. Build and flash replaces edit and run.'
  },
  {
    name: 'Assembly', relative: 0.07, color: '#c62828',
    runs: 'You. Every instruction is one you chose.',
    values: 'Registers you allocate by hand',
    tip: 'Maximum control, maximum responsibility.',
    gives: 'You give up the compiler entirely — every optimization decision, ' +
           'register allocation, and instruction scheduling choice is now yours.'
  }
];

let selected = 2;
let resetButton;
let rungBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Clear selection');
  resetButton.position(10, drawHeight + 6);
  resetButton.mousePressed(() => { selected = -1; });
  resetButton.parent(document.querySelector('main'));

  describe('Five stacked rungs from MicroPython bytecode down to assembly, each ' +
    'drawn as a bar whose length shows illustrative relative execution time, ' +
    'with a details panel for the selected rung.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeLayout();
  drawTitle();
  drawRungs();
  drawPanel();
  drawControlLabels();
}

function computeLayout() {
  const panelW = constrain(canvasWidth * 0.32, 190, 280);
  const left = 168;
  const right = canvasWidth - panelW - 40;
  rungBoxes = RUNGS.map((r, i) => ({
    rung: r, index: i,
    x: left, y: 68 + i * 56, w: Math.max(24, (right - left) * r.relative), h: 40,
    fullW: right - left
  }));
  rungBoxes.panel = { x: canvasWidth - panelW - 20, y: 68, w: panelW, h: 288 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('The Abstraction Ladder', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('Each rung down runs faster and takes something away', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawRungs() {
  for (const b of rungBoxes) {
    const isSel = selected === b.index;
    const hovered = hitTest(mouseX, mouseY) === b;

    // Full-width track showing what the bar is a fraction of
    noStroke();
    fill('gainsboro');
    rect(b.x, b.y, b.fullW, b.h, 4);

    stroke(isSel ? 'black' : hovered ? 'dimgray' : 'white');
    strokeWeight(isSel ? 3 : hovered ? 2 : 1);
    fill(b.rung.color);
    rect(b.x, b.y, b.w, b.h, 4);

    noStroke();
    fill('black');
    textSize(13);
    textStyle(isSel ? BOLD : NORMAL);
    textAlign(RIGHT, CENTER);
    text(b.rung.name, b.x - 10, b.y + b.h / 2);
    textStyle(NORMAL);

    fill(b.w > 70 ? 'white' : 'black');
    textSize(12);
    textAlign(b.w > 70 ? RIGHT : LEFT, CENTER);
    text('×' + b.rung.relative.toFixed(2),
         b.w > 70 ? b.x + b.w - 8 : b.x + b.w + 8, b.y + b.h / 2);
  }

  const last = rungBoxes[rungBoxes.length - 1];
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('bar length = illustrative relative execution time, not measured',
       last.x, last.y + last.h + 10);

  // Direction arrow down the left
  const first = rungBoxes[0];
  stroke('gray');
  strokeWeight(1.5);
  line(28, first.y + 6, 28, last.y + last.h - 6);
  noStroke();
  fill('gray');
  triangle(28, last.y + last.h - 2, 24, last.y + last.h - 12,
           32, last.y + last.h - 12);
  push();
  translate(16, (first.y + last.y) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('faster, less abstraction', 0, 0);
  pop();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPanel() {
  const p = rungBoxes.panel;
  if (p.w < 170) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(p.x, p.y, p.w, p.h, 8);

  noStroke();
  textAlign(LEFT, TOP);

  if (selected < 0) {
    fill('dimgray');
    textSize(13);
    text('Click any rung to see what runs the code, how values are ' +
         'represented, and what that rung costs you compared with the one ' +
         'above it.', p.x + 12, p.y + 12, p.w - 24, p.h - 24);
    return;
  }

  const r = RUNGS[selected];
  fill(r.color);
  textStyle(BOLD);
  textSize(15);
  text(r.name, p.x + 12, p.y + 10, p.w - 24, 42);
  textStyle(NORMAL);

  fill('black');
  textSize(12);
  textStyle(BOLD);
  text('What runs the code', p.x + 12, p.y + 56);
  textStyle(NORMAL);
  fill('dimgray');
  text(r.runs, p.x + 12, p.y + 72, p.w - 24, 40);

  fill('black');
  textStyle(BOLD);
  text('Value representation', p.x + 12, p.y + 116);
  textStyle(NORMAL);
  fill('dimgray');
  text(r.values, p.x + 12, p.y + 132, p.w - 24, 30);

  fill('crimson');
  textStyle(BOLD);
  text('What you give up', p.x + 12, p.y + 168);
  textStyle(NORMAL);
  fill('black');
  text(r.gives, p.x + 12, p.y + 184, p.w - 24, 96);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(selected >= 0 ? 'Showing: ' + RUNGS[selected].name
                     : 'Hover or click any rung',
       130, drawHeight + 20);
  textSize(defaultTextSize);
}

function hitTest(mx, my) {
  return rungBoxes.find(b => mx >= b.x && mx <= b.x + b.fullW &&
                             my >= b.y && my <= b.y + b.h);
}

function mousePressed() {
  const hit = hitTest(mouseX, mouseY);
  if (hit) selected = hit.index;
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
