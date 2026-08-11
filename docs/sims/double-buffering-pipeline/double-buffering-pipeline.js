// Double Buffering Pipeline MicroSim
// CANVAS_HEIGHT: 425
// Two buffers swap roles every cycle. Because one is always capturing, the
// pipeline never has to stop the microphone to do work.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const CAPTURE_COLOR = 'cornflowerblue';
const PROCESS_COLOR = 'darkorange';
const TIMELINE_CYCLES = 6;

let advanceButton, autoButton, resetButton;
let cycle = 0;              // A captures on even cycles
let isAuto = false;
let lastAdvance = 0;
let swapFlash = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  advanceButton = createButton('Advance one cycle');
  advanceButton.position(10, drawHeight + 8);
  advanceButton.mousePressed(advance);
  advanceButton.parent(document.querySelector('main'));

  autoButton = createButton('Auto-play');
  autoButton.position(150, drawHeight + 8);
  autoButton.mousePressed(toggleAuto);
  autoButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(238, drawHeight + 8);
  resetButton.mousePressed(() => { cycle = 0; swapFlash = 0; });
  resetButton.parent(document.querySelector('main'));

  describe('Two buffer boxes that swap between capturing and processing roles ' +
    'each cycle, with a timeline strip showing the alternating pattern.', LABEL);
}

function aIsCapturing() {
  return cycle % 2 === 0;
}

function draw() {
  updateCanvasSize();

  if (isAuto && millis() - lastAdvance > 1200) advance();
  if (swapFlash > 0) swapFlash -= deltaTime;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawBuffers();
  drawTimeline();
  drawCaption();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Double Buffering: Why Capture Never Stops', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBuffers() {
  const boxW = Math.min((canvasWidth - 120) / 2, 250);
  const gap = 70;
  const totalW = boxW * 2 + gap;
  const x0 = (canvasWidth - totalW) / 2;
  const y = 56;
  const h = 116;

  const roles = [
    { label: 'Buffer A', capturing: aIsCapturing(), x: x0 },
    { label: 'Buffer B', capturing: !aIsCapturing(), x: x0 + boxW + gap }
  ];

  for (const r of roles) {
    stroke(r.capturing ? 'steelblue' : 'chocolate');
    strokeWeight(3);
    fill(r.capturing ? CAPTURE_COLOR : PROCESS_COLOR);
    rect(r.x, y, boxW, h, 8);

    noStroke();
    fill('white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(18);
    text(r.label, r.x, y + 14, boxW, 26);
    textStyle(NORMAL);
    textSize(15);
    text(r.capturing ? 'Capturing…' : 'Processing / Displaying…',
         r.x + 6, y + 48, boxW - 12, 26);
    textSize(12);
    text(r.capturing ? 'microphone is writing here'
                     : 'FFT and screen update run here',
         r.x + 6, y + 78, boxW - 12, 26);
  }

  // Swap arrows between the boxes
  const cx = x0 + boxW + gap / 2;
  const flashing = swapFlash > 0;
  stroke(flashing ? 'crimson' : 'gray');
  strokeWeight(flashing ? 3 : 2);
  noFill();
  arc(cx, y + h / 2 - 14, gap - 14, 26, PI, TWO_PI);
  arc(cx, y + h / 2 + 14, gap - 14, 26, 0, PI);
  noStroke();
  fill(flashing ? 'crimson' : 'gray');
  triangle(cx + (gap - 14) / 2, y + h / 2 - 14, cx + (gap - 14) / 2 - 5,
           y + h / 2 - 20, cx + (gap - 14) / 2 - 5, y + h / 2 - 8);
  triangle(cx - (gap - 14) / 2, y + h / 2 + 14, cx - (gap - 14) / 2 + 5,
           y + h / 2 + 8, cx - (gap - 14) / 2 + 5, y + h / 2 + 20);

  fill(flashing ? 'crimson' : 'dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  text('swap', cx, y + h / 2 + 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTimeline() {
  const left = 90;
  const right = canvasWidth - 30;
  const top = 200;
  const rowH = 30;
  if (right <= left) return;
  const slot = (right - left) / TIMELINE_CYCLES;
  const firstCycle = Math.max(0, cycle - TIMELINE_CYCLES + 1);

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Buffer A', left - 10, top + rowH / 2);
  text('Buffer B', left - 10, top + rowH + 4 + rowH / 2);
  textStyle(NORMAL);

  for (let i = 0; i < TIMELINE_CYCLES; i++) {
    const c = firstCycle + i;
    if (c > cycle) break;
    const x = left + slot * i;
    const aCap = c % 2 === 0;
    const current = c === cycle;

    for (let row = 0; row < 2; row++) {
      const capturing = row === 0 ? aCap : !aCap;
      stroke(current ? 'black' : 'white');
      strokeWeight(current ? 2 : 1);
      fill(capturing ? CAPTURE_COLOR : PROCESS_COLOR);
      rect(x, top + row * (rowH + 4), slot, rowH);
    }

    noStroke();
    fill(current ? 'black' : 'dimgray');
    textSize(11);
    textAlign(CENTER, TOP);
    text('cycle ' + c, x + slot / 2, top + 2 * rowH + 10);
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('blue = capturing        orange = processing / displaying',
       left, top + 2 * rowH + 28);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCaption() {
  const y = 314;
  const h = 58;
  stroke('darkgreen');
  strokeWeight(2);
  fill('honeydew');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, TOP);
  fill('darkgreen');
  textSize(14);
  textStyle(BOLD);
  text('Capture never pauses — while one buffer processes, the other is already filling.',
       margin + 12, y + 8);
  textStyle(NORMAL);
  fill('black');
  textSize(12);
  text('Look down any column: exactly one buffer is blue at every instant. A ' +
       'single buffer would have to stop capturing while it processed, and those ' +
       'samples would be lost.',
       margin + 12, y + 27, canvasWidth - 2 * margin - 24, 30);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Cycle ' + cycle + '  —  Buffer ' + (aIsCapturing() ? 'A' : 'B') +
       ' is capturing', 300, drawHeight + 22);
  textSize(defaultTextSize);
}

function advance() {
  cycle++;
  swapFlash = 500;
  lastAdvance = millis();
}

function toggleAuto() {
  isAuto = !isAuto;
  autoButton.html(isAuto ? 'Pause' : 'Auto-play');
  lastAdvance = millis();
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
