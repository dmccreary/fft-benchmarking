// FPU Capability Probe MicroSim
// CANVAS_HEIGHT: 500
// One probe function, three chips, three correct answers. The code does not
// know which board it is on — it reads the hardware and finds out.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const FPU_MASK = 0xF;   // low nibble of MVFR0 encodes single-precision support

const CHIPS = [
  { name: 'Cortex-M0+', isa: 'ARMv6-M', mvfr0: 0x00000000,
    note: 'No floating-point unit at all. Every float operation is emulated in ' +
          'software, typically 10-50× slower.' },
  { name: 'Cortex-M4', isa: 'ARMv7E-M', mvfr0: 0x10110021,
    note: 'Single-precision FPU plus the DSP instruction set. The classic ' +
          'choice for audio work before the M33.' },
  { name: 'Cortex-M33', isa: 'ARMv8-M', mvfr0: 0x10110021,
    note: 'Single-precision FPU. This is what is inside your Pico 2 — the ' +
          'RP2350 pairs an M33 with a Hazard3 RISC-V core.' }
];

let chipButtons = [];
let probeButton, resetButton;
let selected = 2;                  // Cortex-M33 by default
let probed = [false, false, false];
let animPhase = -1;
let cardBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  probeButton = createButton('Run has_single_precision_fpu()');
  probeButton.position(10, drawHeight + 5);
  probeButton.mousePressed(runProbe);
  probeButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset all');
  resetButton.position(238, drawHeight + 5);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  describe('Three chip cards beside a register panel showing the simulated ' +
    'MVFR0 value, the AND mask isolating its low nibble, and the resulting ' +
    'FPU verdict.', LABEL);
}

function hasFpu(chip) {
  return (chip.mvfr0 & FPU_MASK) !== 0;
}

function maskedValue(chip) {
  return chip.mvfr0 & FPU_MASK;
}

function draw() {
  updateCanvasSize();
  if (animPhase >= 0) {
    animPhase += deltaTime;
    if (animPhase > 900) {
      animPhase = -1;
      probed[selected] = true;
    }
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeLayout();
  drawTitle();
  drawCards();
  drawRegisterPanel();
  drawControlLabels();
}

function computeLayout() {
  const w = constrain(canvasWidth * 0.30, 180, 250);
  cardBoxes = CHIPS.map((c, i) => ({
    chip: c, index: i,
    x: margin, y: 58 + i * 116, w: w, h: 104
  }));
  cardBoxes.panelX = margin + w + 26;
  cardBoxes.panelW = canvasWidth - (margin + w + 26) - margin;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('FPU Capability Probe', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('The same function, run against three different chips', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCards() {
  for (const b of cardBoxes) {
    const isSel = selected === b.index;
    const done = probed[b.index];
    const yes = hasFpu(b.chip);

    stroke(isSel ? 'black' : 'silver');
    strokeWeight(isSel ? 3 : 1);
    fill(isSel ? 'white' : 'whitesmoke');
    rect(b.x, b.y, b.w, b.h, 8);

    noStroke();
    fill('black');
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(b.chip.name, b.x + 12, b.y + 10);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(12);
    text(b.chip.isa, b.x + 12, b.y + 32);
    text('MVFR0 = 0x' + hex8(b.chip.mvfr0), b.x + 12, b.y + 50);

    // Verdict badge, or "?" until this chip has been probed
    const bx = b.x + b.w - 34;
    const by = b.y + b.h - 34;
    noStroke();
    fill(done ? (yes ? 'darkgreen' : 'crimson') : 'gainsboro');
    circle(bx, by, 28);
    fill('white');
    textSize(17);
    textAlign(CENTER, CENTER);
    text(done ? (yes ? '✓' : '✕') : '?', bx, by);

    if (done) {
      // Its own row, left-aligned, so it cannot run into the MVFR0 line above.
      fill(yes ? 'darkgreen' : 'crimson');
      textSize(12);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text(yes ? 'FPU detected' : 'No FPU', b.x + 12, by);
      textStyle(NORMAL);
    }
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function hex8(v) {
  return (v >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

function bin4(v) {
  return (v & 0xF).toString(2).padStart(4, '0');
}

function drawRegisterPanel() {
  const x = cardBoxes.panelX;
  const w = cardBoxes.panelW;
  const y = 58;
  const h = 304;
  if (w < 200) return;

  const chip = CHIPS[selected];
  const done = probed[selected];
  const running = animPhase >= 0;
  const yes = hasFpu(chip);

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('Reading MVFR0 on ' + chip.name, x + 14, y + 10);
  textStyle(NORMAL);

  // The probe source
  fill('dimgray');
  textSize(12);
  text('uint32_t v = read_MVFR0();', x + 14, y + 36);
  text('return (v & 0xF) != 0;', x + 14, y + 52);

  // Register value, low nibble singled out
  const nx = x + 14;
  const ny = y + 88;
  fill('black');
  textSize(12);
  text('MVFR0', nx, ny - 18);
  textSize(17);
  textStyle(BOLD);
  text('0x' + hex8(chip.mvfr0).slice(0, 7), nx, ny);
  const headW = textWidth('0x' + hex8(chip.mvfr0).slice(0, 7));
  fill(running || done ? 'darkorange' : 'black');
  text(hex8(chip.mvfr0).slice(7), nx + headW, ny);
  textStyle(NORMAL);

  // The mask
  fill('dimgray');
  textSize(12);
  text('& 0x0000000F', nx, ny + 30);
  stroke('gray');
  strokeWeight(1);
  line(nx, ny + 50, x + w - 20, ny + 50);

  // Result of the AND, revealed by the animation
  noStroke();
  if (running || done) {
    fill('darkorange');
    textSize(12);
    text('low nibble', nx, ny + 60);
    textStyle(BOLD);
    textSize(19);
    text('0x' + maskedValue(chip).toString(16).toUpperCase() +
         '   ( 0b' + bin4(chip.mvfr0) + ' )', nx, ny + 78);
    textStyle(NORMAL);
  } else {
    fill('gray');
    textSize(13);
    text('Press the probe button to run the mask.', nx, ny + 66);
  }

  // Verdict
  const vy = y + 216;
  if (done) {
    stroke(yes ? 'darkgreen' : 'crimson');
    strokeWeight(2);
    fill(yes ? 'honeydew' : 'mistyrose');
    rect(x + 12, vy, w - 24, 70, 6);
    noStroke();
    fill(yes ? 'darkgreen' : 'crimson');
    textSize(17);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text((yes ? '✓  FPU detected' : '✕  No FPU'), x + 24, vy + 8);
    textStyle(NORMAL);
    fill('black');
    textSize(12);
    text(chip.note, x + 24, vy + 32, w - 48, 34);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  const n = probed.filter(Boolean).length;
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Selected: ' + CHIPS[selected].name + '   •   probed ' + n + ' of 3',
       10, drawHeight + 56);
  textSize(defaultTextSize);
}

function runProbe() {
  if (probed[selected]) return;
  animPhase = 0;
}

function resetAll() {
  probed = [false, false, false];
  animPhase = -1;
}

function mousePressed() {
  const hit = cardBoxes.find(b => mouseX >= b.x && mouseX <= b.x + b.w &&
                                  mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit) {
    selected = hit.index;
    animPhase = -1;
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
