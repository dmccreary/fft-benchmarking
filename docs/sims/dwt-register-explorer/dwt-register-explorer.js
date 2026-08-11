// DWT Register Explorer MicroSim
// CANVAS_HEIGHT: 480
// Two enable bits stand between you and the cycle counter. Click them in order
// and watch CYCCNT come alive one bit at a time.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 260;
let defaultTextSize = 16;

const TRCENA_BIT = 24;      // DEMCR bit 24
const CYCCNTENA_BIT = 0;    // DWT.CTRL bit 0

let resetButton, speedSlider;
let trcena = false;
let cyccntena = false;
let cyccnt = 0;
let accumulator = 0;
let hoverInfo = null;
let bitBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset to power-on state');
  resetButton.position(10, drawHeight + 5);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  speedSlider = createSlider(1, 40, 8, 1);
  speedSlider.position(sliderLeftMargin, drawHeight + 42);
  speedSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three 32-bit registers drawn as grids of clickable bit squares — ' +
    'DEMCR, DWT.CTRL, and DWT.CYCCNT — where enabling TRCENA then CYCCNTENA ' +
    'starts the cycle counter running.', LABEL);
}

function counterRunning() {
  return trcena && cyccntena;
}

function draw() {
  updateCanvasSize();

  // The counter only advances when both gates are open. It holds its value
  // when disabled rather than resetting — that is the behaviour of the real
  // register and the point of stage 4.
  if (counterRunning()) {
    accumulator += (deltaTime / 1000) * speedSlider.value() * 12;
    cyccnt = Math.floor(accumulator) >>> 0;
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  bitBoxes = [];
  drawTitle();
  drawRegister('DEMCR', 62, demcrValue(), TRCENA_BIT, 'TRCENA (bit 24)');
  drawRegister('DWT.CTRL', 152, ctrlValue(), CYCCNTENA_BIT, 'CYCCNTENA (bit 0)');
  drawRegister('DWT.CYCCNT', 242, cyccnt, -1, null);
  drawStatus();
  drawHoverTip();
  drawControlLabels();
}

function demcrValue() {
  return trcena ? (1 << TRCENA_BIT) : 0;
}

function ctrlValue() {
  return cyccntena ? (1 << CYCCNTENA_BIT) : 0;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('DWT Register Explorer', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('Click TRCENA, then CYCCNTENA, to start the cycle counter',
       canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawRegister(name, top, value, activeBit, activeLabel) {
  const left = 106;
  const right = canvasWidth - 25;
  if (right <= left) return;
  const cw = (right - left) / 32;
  const ch = Math.min(cw * 1.15, 26);
  const isCounter = activeBit < 0;

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text(name, left - 10, top + ch / 2);
  textStyle(NORMAL);

  for (let b = 31; b >= 0; b--) {
    const x = left + (31 - b) * cw;
    const bit = (value >>> b) & 1;
    const interactive = b === activeBit;

    bitBoxes.push({
      x: x, y: top, w: cw, h: ch,
      register: name, bit: b, interactive: interactive
    });

    stroke(interactive ? 'black' : 'lightgray');
    strokeWeight(interactive ? 2 : 0.5);
    if (isCounter) fill(bit ? 'mediumseagreen' : 'white');
    else if (interactive) fill(bit ? 'mediumseagreen' : 'white');
    else fill('gainsboro');
    rect(x, top, cw - 1, ch);

    noStroke();
    fill(isCounter || interactive ? (bit ? 'white' : 'black') : 'darkgray');
    textSize(Math.min(11, cw * 0.6));
    textAlign(CENTER, CENTER);
    text(bit, x + (cw - 1) / 2, top + ch / 2);
  }

  // Bit-number ruler
  noStroke();
  fill('dimgray');
  textSize(9);
  textAlign(CENTER, TOP);
  for (const b of [31, 24, 16, 8, 0]) {
    text(b, left + (31 - b) * cw + (cw - 1) / 2, top + ch + 2);
  }

  if (activeLabel) {
    const x = left + (31 - activeBit) * cw;
    stroke('black');
    strokeWeight(1);
    line(x + cw / 2, top + ch + 12, x + cw / 2, top + ch + 20);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(activeBit > 16 ? LEFT : RIGHT, TOP);
    text(activeLabel + ' — click me',
         x + cw / 2 + (activeBit > 16 ? 4 : -4), top + ch + 16);
  } else {
    noStroke();
    fill('black');
    textSize(13);
    textAlign(LEFT, TOP);
    text('decimal: ' + cyccnt.toLocaleString('en-US') +
         (counterRunning() ? '  (counting)' : '  (frozen)'),
         left, top + ch + 14);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawStatus() {
  const y = 322;
  const h = 62;
  let stage, msg, tone;
  if (!trcena && !cyccntena) {
    stage = 'Power-on state';
    msg = 'Every bit is 0. The trace subsystem is unpowered and CYCCNT is frozen ' +
          'at 0. Reading it now returns nothing useful.';
    tone = 'dimgray';
  } else if (trcena && !cyccntena) {
    stage = 'TRCENA set';
    msg = 'Trace subsystem enabled, DWT unit powered — but the cycle counter is ' +
          'still off. This is the step people forget, and CYCCNT reads 0 forever ' +
          'without it.';
    tone = 'darkorange';
  } else if (!trcena && cyccntena) {
    stage = 'CYCCNTENA set without TRCENA';
    msg = 'You asked for the counter but the DWT unit is not powered. On real ' +
          'hardware this silently does nothing — the enable bit may not even ' +
          'stick.';
    tone = 'crimson';
  } else {
    stage = 'Counter running';
    msg = 'Both gates open. CYCCNT increments once per CPU clock. Turn CYCCNTENA ' +
          'off again and watch it hold its value rather than reset.';
    tone = 'darkgreen';
  }

  stroke(tone);
  strokeWeight(2);
  fill(tone === 'darkgreen' ? 'honeydew'
       : tone === 'crimson' ? 'mistyrose'
       : tone === 'darkorange' ? 'oldlace' : 'whitesmoke');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, TOP);
  fill(tone);
  textStyle(BOLD);
  textSize(14);
  text(stage, margin + 12, y + 8);
  textStyle(NORMAL);
  fill('black');
  textSize(12);
  text(msg, margin + 12, y + 28, canvasWidth - 2 * margin - 24, 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawHoverTip() {
  const hit = hitTest(mouseX, mouseY);
  if (!hit || hit.interactive) return;
  const label = hit.register === 'DWT.CYCCNT'
    ? 'CYCCNT bit ' + hit.bit + ' — live counter value, not clickable'
    : 'bit ' + hit.bit + ' — not used in this course';
  textSize(12);
  const w = textWidth(label) + 16;
  const x = Math.min(mouseX + 12, canvasWidth - w - 8);
  const y = Math.min(mouseY + 14, drawHeight - 30);
  stroke('gray');
  fill(255, 255, 220, 245);
  rect(x, y, w, 24, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, x + 8, y + 12);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Simulated speed: ' + speedSlider.value() + '×', 10, drawHeight + 52);
  fill('dimgray');
  textSize(13);
  text('slowed far below the real 150 MHz so the bits are readable',
       200, drawHeight + 17);
}

function hitTest(mx, my) {
  return bitBoxes.find(b => mx >= b.x && mx <= b.x + b.w &&
                            my >= b.y && my <= b.y + b.h);
}

function mousePressed() {
  const hit = hitTest(mouseX, mouseY);
  if (!hit || !hit.interactive) return;
  if (hit.register === 'DEMCR') trcena = !trcena;
  else if (hit.register === 'DWT.CTRL') cyccntena = !cyccntena;
}

function resetAll() {
  trcena = false;
  cyccntena = false;
  cyccnt = 0;
  accumulator = 0;
}

function resizeSliders() {
  speedSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  resizeSliders();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
