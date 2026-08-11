// Register Tracer MicroSim
// CANVAS_HEIGHT: 440
// Five instructions, one register, one flag. Stepping through them is how you
// learn to read assembly.

let canvasWidth = 400;
let drawHeight = 360;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// pc indexes this listing. Labels are not executable, so BNE targets index 2.
const PROGRAM = [
  { text: 'MOV  r0, #5', label: null,
    note: 'Load the literal 5 into r0. Flags are not touched by MOV.' },
  { text: 'loop_start:', label: 'loop_start', isLabel: true,
    note: 'A label is a name for an address. It costs nothing at run time.' },
  { text: 'SUB  r0, r0, #1', label: null,
    note: 'Subtract 1 from r0 and store the result back in r0.' },
  { text: 'CMP  r0, #0', label: null,
    note: 'Compare r0 against 0. CMP performs a subtraction and throws the ' +
          'result away — it only keeps the flags.' },
  { text: 'BNE  loop_start', label: null,
    note: 'Branch if Not Equal: jump only when the Z flag is clear. This is ' +
          'where the flag CMP set gets used.' },
  { text: '(fall through — loop done)', label: null, isEnd: true,
    note: 'Z was set, so BNE did not branch. Execution continues past the loop.' }
];

let stepButton, runButton, resetButton;
let pc = 0;
let r0 = null;
let zFlag = false;
let started = false;
let isRunning = false;
let lastStep = 0;
let lastAction = 'Ready. Press Step to execute the first instruction.';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 5);
  stepButton.mousePressed(step);
  stepButton.parent(document.querySelector('main'));

  runButton = createButton('Run to completion');
  runButton.position(66, drawHeight + 5);
  runButton.mousePressed(toggleRun);
  runButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(202, drawHeight + 5);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  describe('A five-instruction assembly loop with the current instruction ' +
    'highlighted, beside a live readout of register r0 and the zero flag.',
    LABEL);
}

function finished() {
  return pc >= PROGRAM.length - 1 && started;
}

function step() {
  if (finished()) return;
  started = true;
  const ins = PROGRAM[pc];

  if (ins.isLabel) {
    lastAction = 'Label — nothing executes. Falling through to the next line.';
    pc++;
    return;
  }

  if (ins.text.startsWith('MOV')) {
    r0 = 5;
    lastAction = 'r0 ← 5. The Z flag is untouched — MOV does not set flags.';
    pc++;
  } else if (ins.text.startsWith('SUB')) {
    r0 = r0 - 1;
    lastAction = 'r0 ← r0 − 1, giving ' + r0 + '.';
    pc++;
  } else if (ins.text.startsWith('CMP')) {
    // CMP computes r0 - 0 and keeps only the flags.
    zFlag = (r0 === 0);
    lastAction = 'CMP computed r0 − 0 = ' + r0 + ' and discarded it, setting ' +
                 'Z = ' + (zFlag ? 1 : 0) + '.';
    pc++;
  } else if (ins.text.startsWith('BNE')) {
    if (!zFlag) {
      lastAction = 'Z is clear, so BNE branches back to loop_start.';
      pc = 1;
    } else {
      lastAction = 'Z is set, so BNE does NOT branch. The loop is finished.';
      pc = PROGRAM.length - 1;
    }
  }
}

function toggleRun() {
  if (finished()) return;
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run to completion');
  lastStep = millis();
}

function resetAll() {
  pc = 0;
  r0 = null;
  zFlag = false;
  started = false;
  isRunning = false;
  runButton.html('Run to completion');
  lastAction = 'Ready. Press Step to execute the first instruction.';
}

function draw() {
  updateCanvasSize();
  if (isRunning) {
    if (millis() - lastStep > 620) { lastStep = millis(); step(); }
    if (finished()) toggleRun();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawListing();
  drawState();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Tracing an Assembly Loop', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function listingGeometry() {
  const w = constrain(canvasWidth * 0.52, 300, 430);
  return { x: margin, y: 44, w: w, rowH: 34 };
}

function drawListing() {
  const g = listingGeometry();

  for (let i = 0; i < PROGRAM.length; i++) {
    const ins = PROGRAM[i];
    const y = g.y + 8 + i * g.rowH;
    const current = i === pc;

    if (current) {
      noStroke();
      fill(255, 243, 205);
      rect(g.x, y - 4, g.w, g.rowH - 2, 4);
      fill('darkorange');
      textSize(16);
      textAlign(LEFT, CENTER);
      text('▶', g.x + 6, y + 11);
    }

    noStroke();
    fill(ins.isLabel ? 'mediumvioletred' : ins.isEnd ? 'dimgray' : 'black');
    textSize(15);
    textStyle(current ? BOLD : NORMAL);
    textAlign(LEFT, CENTER);
    text(ins.text, g.x + (ins.isLabel ? 22 : 40), y + 11);
    textStyle(NORMAL);
  }

  // What the last executed instruction did
  const ny = g.y + 8 + PROGRAM.length * g.rowH + 8;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(g.x, ny, g.w, 76, 6);
  noStroke();
  fill('black');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Last action', g.x + 12, ny + 8);
  textStyle(NORMAL);
  fill('darkslategray');
  text(lastAction, g.x + 12, ny + 26, g.w - 24, 44);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawState() {
  const g = listingGeometry();
  const x = g.x + g.w + 26;
  const w = canvasWidth - x - margin;
  const y = 44;
  const h = 300;
  if (w < 170) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('Machine state', x + 14, y + 10);
  textStyle(NORMAL);

  // r0
  fill('dimgray');
  textSize(13);
  text('register r0', x + 14, y + 44);
  fill(r0 === null ? 'gray' : 'mediumblue');
  textStyle(BOLD);
  textSize(46);
  textAlign(CENTER, TOP);
  text(r0 === null ? '?' : r0, x + w / 2, y + 62);
  textStyle(NORMAL);

  // Z flag lamp
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(13);
  text('Zero flag (Z)', x + 14, y + 140);

  const lampX = x + w / 2;
  const lampY = y + 186;
  stroke(zFlag ? 'darkgreen' : 'gray');
  strokeWeight(2);
  fill(zFlag ? 'limegreen' : 'gainsboro');
  circle(lampX, lampY, 46);
  noStroke();
  fill(zFlag ? 'white' : 'dimgray');
  textSize(19);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(zFlag ? '1' : '0', lampX, lampY);
  textStyle(NORMAL);

  fill(zFlag ? 'darkgreen' : 'gray');
  textSize(12);
  textAlign(CENTER, TOP);
  text(zFlag ? 'set — last compare was equal'
             : 'clear — last compare was not equal',
       x + 10, lampY + 32, w - 20, 30);

  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('Only CMP writes Z here. BNE reads it. That hand-off is the whole ' +
       'mechanism of a conditional loop.',
       x + 14, y + 250, w - 28, 44);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(finished() ? 'Loop complete — r0 reached 0 after 5 iterations.'
                  : started ? 'Stepping…  pc = line ' + (pc + 1)
                            : 'Press Step to begin',
       270, drawHeight + 22);
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
