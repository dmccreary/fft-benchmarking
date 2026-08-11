// Pico 2 Memory Map Explorer MicroSim
// CANVAS_HEIGHT: 510
// A clickable vertical model of the Pico 2 address space so students can
// classify an address as flash, RAM, or a memory-mapped register, and explain
// why reading a register is not like reading ordinary RAM.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const FLASH_COLOR = 'goldenrod';
const RAM_COLOR = 'cornflowerblue';
const MMR_COLOR = 'mediumseagreen';
const SUB_COLOR = 'seagreen';

// Regions are ordered top to bottom. Heights are in pixels and are not to
// scale — the point is classification, not proportion.
const regions = [
  {
    id: 'flash',
    label: 'Flash\n(program + saved files)',
    color: FLASH_COLOR,
    h: 88,
    tip: 'Non-volatile storage: your code and saved files.',
    definition: 'Flash is non-volatile storage holding the MicroPython firmware, ' +
      'your .py files, and any data files you save.',
    example: 'Example: main.py, and the recorded samples you write to a file.',
    volatile: 'Non-volatile — survives a power cycle.'
  },
  {
    id: 'ram',
    label: 'RAM\n(running variables)',
    color: RAM_COLOR,
    h: 88,
    tip: 'Volatile working memory: arrays and variables while running.',
    definition: 'RAM holds everything your program creates while it runs: ' +
      'variables, sample buffers, and the interpreter\'s own bookkeeping.',
    example: 'Example: an array of 1024 audio samples waiting for an FFT.',
    volatile: 'Volatile — erased the instant power is removed.'
  },
  {
    id: 'mmr',
    label: 'Memory-Mapped Registers\n(hardware)',
    color: MMR_COLOR,
    h: 42,
    header: true,
    tip: 'Addresses wired to hardware, not to storage cells.',
    definition: 'A memory-mapped register looks like an address, but there is no ' +
      'storage cell behind it. The address is wired directly to a piece of ' +
      'hardware, so reading it samples the hardware\'s current state.',
    example: 'Example: reading a timer register returns a different value each time.',
    volatile: 'Neither — the value reflects live hardware, not stored data.'
  },
  {
    id: 'cpuid',
    label: 'CPUID Register',
    color: SUB_COLOR,
    h: 31,
    sub: true,
    tip: 'Identifies the processor core type and revision.',
    definition: 'The CPUID register reports which ARM core you are running on ' +
      'and its revision, which is how code can tell a Cortex-M33 from a Cortex-M0+.',
    example: 'Example: used to check whether DSP instructions are available.',
    volatile: 'Neither — fixed in silicon, read straight from hardware.'
  },
  {
    id: 'uid',
    label: 'Unique Device ID',
    color: SUB_COLOR,
    h: 31,
    sub: true,
    tip: 'A factory-programmed serial number unique to this board.',
    definition: 'The unique device ID is a per-chip serial number burned in at ' +
      'the factory. Every Pico 2 returns a different value.',
    example: 'Example: machine.unique_id() reads this to identify one board among many.',
    volatile: 'Neither — permanent, read straight from hardware.'
  },
  {
    id: 'clock',
    label: 'Clock Control',
    color: SUB_COLOR,
    h: 31,
    sub: true,
    tip: 'Registers that set and report the system clock frequency.',
    definition: 'Clock control registers set the system clock and its dividers. ' +
      'Writing here changes how fast the whole chip runs.',
    example: 'Example: machine.freq(200_000_000) writes to these registers.',
    volatile: 'Neither — writes change hardware behavior immediately.'
  },
  {
    id: 'periph',
    label: 'Peripheral Registers (SPI, GPIO, etc.)',
    color: SUB_COLOR,
    h: 31,
    sub: true,
    tip: 'Control and data registers for every on-chip peripheral.',
    definition: 'Each peripheral — GPIO, SPI, I2S, ADC — exposes its control and ' +
      'data registers at fixed addresses in this block.',
    example: 'Example: setting a GPIO pin high writes one bit in this region.',
    volatile: 'Neither — reads sample live pin and peripheral state.'
  }
];

// Each code snippet points at the region it actually touches.
const snippets = [
  { code: 'gc.mem_free()', target: 'ram',
    note: 'gc.mem_free() reports free space in RAM — the volatile working memory.' },
  { code: 'machine.unique_id()', target: 'uid',
    note: 'machine.unique_id() reads a memory-mapped register, not storage. The ' +
          'value comes from hardware, which is why it is identical every boot but ' +
          'different on every board.' },
  { code: 'open("main.py")', target: 'flash',
    note: 'open("main.py") reads a file out of flash — non-volatile storage that ' +
          'survives power-off.' }
];

let selectedId = 'ram';
let snippetNote = '';
let snippetButtons = [];
let resetButton;
let layout = [];   // computed rectangles, rebuilt every frame

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  let x = 10;
  for (const s of snippets) {
    const b = createButton(s.code);
    b.position(x, drawHeight + 5);
    b.mousePressed(() => selectSnippet(s));
    b.parent(document.querySelector('main'));
    snippetButtons.push(b);
    x += s.code.length * 8 + 26;
  }

  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 42);
  resetButton.mousePressed(() => { selectedId = 'ram'; snippetNote = ''; });
  resetButton.parent(document.querySelector('main'));

  describe('A vertical diagram of the Pico 2 address space split into flash, ' +
    'RAM, and memory-mapped register bands, with clickable regions and an ' +
    'information panel explaining each one.', LABEL);
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
  drawBar();
  drawInfoPanel();
  drawHoverTip();
  drawControlLabels();
}

// Rebuild the region rectangles from the current width so a resize keeps the
// diagram proportional instead of clipping it.
function computeLayout() {
  const barX = 26;
  const barW = constrain(canvasWidth * 0.34, 140, 250);
  let y = 66;
  layout = regions.map(r => {
    const rect = { id: r.id, x: barX, y: y, w: barW, h: r.h, region: r };
    y += r.h;
    return rect;
  });
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Pico 2 Memory Map Explorer', canvasWidth / 2, 10);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBar() {
  for (const item of layout) {
    const r = item.region;
    const isSelected = selectedId === r.id;

    stroke(isSelected ? 'black' : 'white');
    strokeWeight(isSelected ? 3 : 1);
    fill(r.color);
    rect(item.x, item.y, item.w, item.h);

    noStroke();
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(r.sub ? 13 : r.header ? 14 : 15);
    textStyle(r.sub ? NORMAL : BOLD);
    text(r.label, item.x + 8, item.y + 3, item.w - 16, item.h - 6);
    textStyle(NORMAL);
  }

  // "You are here" marker beside the selected band.
  const sel = layout.find(i => i.id === selectedId);
  if (sel) {
    fill('crimson');
    noStroke();
    const cy = sel.y + sel.h / 2;
    triangle(sel.x - 4, cy, sel.x - 18, cy - 8, sel.x - 18, cy + 8);
  }

  textSize(defaultTextSize);
}

function drawInfoPanel() {
  const bar = layout[0];
  const last = layout[layout.length - 1];
  const panelX = bar.x + bar.w + 22;
  const panelY = 66;
  const panelW = canvasWidth - panelX - 20;
  const panelH = last.y + last.h - panelY;   // match the bar exactly
  if (panelW < 110) return;

  stroke('silver');
  fill(255, 255, 255, 235);
  rect(panelX, panelY, panelW, panelH, 10);

  const r = regions.find(x => x.id === selectedId);
  if (!r) return;

  const pad = 12;
  let y = panelY + pad;

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  const titleText = r.label.replace('\n', ' ');
  text(titleText, panelX + pad, y, panelW - 2 * pad, 46);
  textStyle(NORMAL);
  y += 50;

  textSize(14);
  fill('black');
  text(r.definition, panelX + pad, y, panelW - 2 * pad, 96);
  y += 100;

  fill('dimgray');
  text(r.example, panelX + pad, y, panelW - 2 * pad, 48);
  y += 52;

  fill(r.color === FLASH_COLOR ? 'darkgoldenrod' : 'black');
  textStyle(BOLD);
  text(r.volatile, panelX + pad, y, panelW - 2 * pad, 50);
  textStyle(NORMAL);
  y += 54;

  if (snippetNote) {
    fill('crimson');
    text(snippetNote, panelX + pad, y, panelW - 2 * pad, panelY + panelH - y - pad);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// One-line summary that follows the cursor, shown before a region is clicked.
function drawHoverTip() {
  const hit = hitTest(mouseX, mouseY);
  if (!hit || hit.id === selectedId) return;

  const label = hit.region.tip;
  textSize(13);
  const w = Math.min(textWidth(label) + 16, canvasWidth - 20);
  const x = Math.min(mouseX + 12, canvasWidth - w - 8);
  const y = Math.min(mouseY + 12, drawHeight - 34);

  stroke('gray');
  fill(255, 255, 220, 245);
  rect(x, y, w, 26, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, x + 8, y + 13);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Click a band, or press a code snippet to see which region it reads.',
       80, drawHeight + 54);
  textSize(defaultTextSize);
}

function hitTest(mx, my) {
  return layout.find(i => mx >= i.x && mx <= i.x + i.w &&
                          my >= i.y && my <= i.y + i.h);
}

function mousePressed() {
  const hit = hitTest(mouseX, mouseY);
  if (hit) {
    selectedId = hit.id;
    snippetNote = '';
  }
}

function selectSnippet(s) {
  selectedId = s.target;
  snippetNote = s.note;
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
