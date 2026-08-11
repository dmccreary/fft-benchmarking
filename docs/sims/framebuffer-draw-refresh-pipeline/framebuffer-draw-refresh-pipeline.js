// Framebuffer Draw / Refresh Pipeline MicroSim
// CANVAS_HEIGHT: 500
// Traces a drawing call from your code, into the RAM framebuffer, and only
// then — when show() is called — out over SPI to the physical OLED glass.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 22;
let defaultTextSize = 16;

const SOFT_FILL = 'lightsteelblue';
const SOFT_EDGE = 'steelblue';
const LINK_FILL = 'gainsboro';
const LINK_EDGE = 'gray';
const HARD_FILL = 'navajowhite';
const HARD_EDGE = 'chocolate';
const ACTIVE_EDGE = 'crimson';
const DIM_FILL = 'whitesmoke';
const DIM_EDGE = 'lightgray';

// "Hi" drawn as a pixel pattern, matching what oled.text() would produce.
const HI_GLYPH = [
  '#...#.#.',
  '#...#...',
  '#####.#.',
  '#...#.#.',
  '#...#.#.'
];

const GRID_COLS = 16;
const GRID_ROWS = 8;

const stages = [
  { id: 'code', title: 'Your Code', sub: 'oled.text("Hi", 0, 0)', kind: 'soft',
    def: 'Your Code: the drawing calls you write. They run on the Pico and change ' +
         'memory. Nothing reaches the glass yet.' },
  { id: 'fb', title: 'Framebuffer (RAM)', sub: '128 x 64 bits', kind: 'soft', grid: 'buffer',
    def: 'Framebuffer: a block of RAM holding one bit per pixel — 128 x 64 bits, ' +
         '1024 bytes. Drawing calls flip these bits and stop there.' },
  { id: 'show', title: 'oled.show()', sub: 'the trigger', kind: 'link',
    def: 'Display Refresh: show() is the trigger that reads the whole framebuffer ' +
         'and pushes it out. Without this call your drawing stays in RAM forever.' },
  { id: 'spi', title: 'SPI', sub: 'clock + data + chip select', kind: 'link',
    def: 'Serial Peripheral Interface: a synchronous serial bus. Clock, data, and ' +
         'chip-select lines carry the entire buffer across in one burst.' },
  { id: 'ctrl', title: 'SSD1306 Controller', sub: 'on the display module', kind: 'hard',
    def: 'SSD1306 Controller: the chip on the display module. It receives the ' +
         'buffer over SPI and drives the OLED matrix from its own memory.' },
  { id: 'oled', title: 'Physical OLED Pixels', sub: 'lit glass', kind: 'hard', grid: 'screen',
    def: 'Physical OLED Pixels: the lit glass. It only ever shows what the most ' +
         'recent show() sent — never what is merely sitting in the framebuffer.' }
];

// Opens at stage 2: "Hi" is already in the framebuffer but the glass is still
// blank. That is the misconception this sim exists to correct, so it is the
// default state rather than something the student has to click toward.
let currentStep = 1;
let selectedId = null;     // node the student clicked
let screenHasHi = false;   // committed to the glass
let screenHasLine = false;
let extraLineCheckbox;
let stepButton;
let resetButton;
let nodeBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 5);
  stepButton.mousePressed(advanceStep);
  stepButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(66, drawHeight + 5);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  extraLineCheckbox = createCheckbox(' Draw another line WITHOUT calling show()', false);
  extraLineCheckbox.position(10, drawHeight + 44);
  extraLineCheckbox.parent(document.querySelector('main'));

  describe('A six-stage pipeline showing a drawing call moving from your code ' +
    'into the RAM framebuffer, and only reaching the physical OLED pixels after ' +
    'show() is called.', LABEL);
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
  drawConnectors();
  drawNodes();
  drawInfoStrip();
  drawControlLabels();
}

// Two rows of three, both reading left to right. The wrap-around connector
// carries the flow from the end of row 1 to the start of row 2.
function computeLayout() {
  const gap = 52;   // wide enough for a short arrow label to sit clear of both boxes
  const usable = canvasWidth - 2 * margin;
  const nodeW = Math.max(70, (usable - 2 * gap) / 3);
  const nodeH = 112;
  nodeBoxes = stages.map((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      id: s.id,
      stage: s,
      index: i,
      x: margin + col * (nodeW + gap),
      y: row === 0 ? 58 : 240,
      w: nodeW,
      h: nodeH
    };
  });
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Framebuffer Draw / Refresh Pipeline', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawConnectors() {
  stroke('gray');
  strokeWeight(2);
  for (let i = 0; i < nodeBoxes.length - 1; i++) {
    const a = nodeBoxes[i];
    const b = nodeBoxes[i + 1];
    const reached = currentStep > i;
    stroke(reached ? ACTIVE_EDGE : 'gray');
    strokeWeight(reached ? 3 : 2);

    if (a.y === b.y) {
      const y = a.y + a.h / 2;
      line(a.x + a.w, y, b.x - 4, y);
      arrowHead(b.x - 4, y, 0);
    } else {
      // Wrap-around: down from row 1, left across the gutter, into row 2.
      const midY = a.y + a.h + 34;
      const ax = a.x + a.w / 2;
      const bx = b.x + b.w / 2;
      line(ax, a.y + a.h, ax, midY);
      line(ax, midY, bx, midY);
      line(bx, midY, bx, b.y - 4);
      arrowHead(bx, b.y - 4, HALF_PI);
    }
  }

  // Short labels sit in the gutter between boxes; the full sentences live in
  // the caption below, where there is room to read them.
  const gapLabels = ['bits', 'trigger', '', 'burst', 'lights'];
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, BOTTOM);
  for (let i = 0; i < nodeBoxes.length - 1; i++) {
    const a = nodeBoxes[i], b = nodeBoxes[i + 1];
    if (a.y !== b.y || !gapLabels[i]) continue;
    text(gapLabels[i], (a.x + a.w + b.x) / 2, a.y + a.h / 2 - 7);
  }

  // Caption sits in the band between the title and row 1 — the only strip of
  // free space; row 2 runs to y=352 and the info panel starts at y=360.
  fill('black');
  textSize(12);
  textAlign(CENTER, TOP);
  text('Drawing writes bits with no visible change; the buffer is read only when show() triggers',
       margin, 36, canvasWidth - 2 * margin, 20);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function arrowHead(x, y, rot) {
  push();
  translate(x, y);
  rotate(rot);
  noStroke();
  fill(drawingContext.strokeStyle === '#dc143c' ? ACTIVE_EDGE : 'gray');
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

function drawNodes() {
  for (const box of nodeBoxes) {
    const s = box.stage;
    const reached = currentStep >= box.index;
    const isActive = currentStep === box.index;
    const isSelected = selectedId === s.id;

    let fillColor = DIM_FILL;
    let edgeColor = DIM_EDGE;
    if (reached) {
      if (s.kind === 'soft') { fillColor = SOFT_FILL; edgeColor = SOFT_EDGE; }
      else if (s.kind === 'link') { fillColor = LINK_FILL; edgeColor = LINK_EDGE; }
      else { fillColor = HARD_FILL; edgeColor = HARD_EDGE; }
    }

    stroke(isActive || isSelected ? ACTIVE_EDGE : edgeColor);
    strokeWeight(isActive || isSelected ? 4 : 2);
    fill(fillColor);
    rect(box.x, box.y, box.w, box.h, 10);

    noStroke();
    fill(reached ? 'black' : 'darkgray');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(13);
    text(s.title, box.x + 5, box.y + 7, box.w - 10, 34);
    textStyle(NORMAL);
    textSize(11);
    fill(reached ? 'dimgray' : 'darkgray');
    text(s.sub, box.x + 5, box.y + 40, box.w - 10, 26);

    if (s.grid) drawPixelGrid(box, s.grid);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Small monochrome pixel mockup. The buffer grid shows what has been drawn;
// the screen grid shows only what a show() has actually committed.
function drawPixelGrid(box, which) {
  const gw = Math.min(box.w - 22, 108);
  const gh = gw / 2;
  const gx = box.x + (box.w - gw) / 2;
  const gy = box.y + box.h - gh - 8;
  const cw = gw / GRID_COLS;
  const ch = gh / GRID_ROWS;

  noStroke();
  fill('black');
  rect(gx, gy, gw, gh, 2);

  const showHi = which === 'buffer' ? currentStep >= 1 : screenHasHi;
  const showLine = which === 'buffer'
    ? extraLineCheckbox.checked()
    : screenHasLine;

  fill('deepskyblue');
  if (showHi) {
    for (let r = 0; r < HI_GLYPH.length; r++) {
      for (let c = 0; c < HI_GLYPH[r].length; c++) {
        if (HI_GLYPH[r][c] === '#') {
          rect(gx + (c + 1) * cw, gy + (r + 1) * ch, cw - 0.5, ch - 0.5);
        }
      }
    }
  }
  if (showLine) {
    for (let c = 1; c < GRID_COLS - 1; c++) {
      rect(gx + c * cw, gy + 7 * ch, cw - 0.5, ch - 0.5);
    }
  }
}

function drawInfoStrip() {
  const y = 360;
  const h = 52;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const active = selectedId
    ? stages.find(s => s.id === selectedId)
    : (currentStep >= 0 ? stages[currentStep] : null);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  const msg = active
    ? active.def
    : 'Press Step to walk the pipeline one stage at a time, or click any box to ' +
      'read its definition. Notice how far a drawing call gets before show() is called.';
  text(msg, margin + 10, y + 8, canvasWidth - 2 * margin - 20, h - 14);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  const label = currentStep < 0
    ? 'Not started'
    : 'Stage ' + (currentStep + 1) + ' of ' + stages.length + ': ' + stages[currentStep].title;
  text(label, 124, drawHeight + 17);
  textSize(defaultTextSize);
}

function advanceStep() {
  selectedId = null;
  if (currentStep >= stages.length - 1) {
    // Wrap to a fresh pass so a newly toggled line can be pushed through.
    currentStep = 0;
    return;
  }
  currentStep++;
  // Reaching the glass is the only moment the physical display changes.
  if (stages[currentStep].id === 'oled') {
    screenHasHi = true;
    screenHasLine = extraLineCheckbox.checked();
  }
}

function resetAll() {
  currentStep = 1;
  selectedId = null;
  screenHasHi = false;
  screenHasLine = false;
  extraLineCheckbox.checked(false);
}

function mousePressed() {
  const hit = nodeBoxes.find(b => mouseX >= b.x && mouseX <= b.x + b.w &&
                                  mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit) selectedId = hit.id;
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
