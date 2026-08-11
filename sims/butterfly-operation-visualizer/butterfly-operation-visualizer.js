// Butterfly Operation Visualizer MicroSim
// CANVAS_HEIGHT: 460
// One butterfly: two inputs, one twiddle multiply, two outputs. The single
// shared product W×b feeds both outputs — which is the whole reason the FFT
// is cheaper than the DFT.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const A_COLOR = 'mediumblue';
const B_COLOR = 'darkorange';
const W_COLOR = 'darkviolet';
const OUT1_COLOR = 'darkgreen';
const OUT2_COLOR = 'crimson';

// Twiddle factors for an 8-point transform: W_8^k = e^(-i*2*pi*k/8)
const TWIDDLES = {
  'W_8^0  =  1': 0,
  'W_8^1  =  0.707 - 0.707i': 1,
  'W_8^2  =  -i': 2,
  'W_8^3  =  -0.707 - 0.707i': 3
};

let aReInput, aImInput, bReInput, bImInput;
let wSelect, computeButton;
let flowPhase = -1;   // -1 idle; 0..1 animating the product along the wire

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  aReInput = makeInput('1.0', 42);
  aImInput = makeInput('0.5', 118);
  bReInput = makeInput('2.0', 236);
  bImInput = makeInput('-1.0', 312);

  wSelect = createSelect();
  for (const label of Object.keys(TWIDDLES)) wSelect.option(label);
  wSelect.selected('W_8^1  =  0.707 - 0.707i');
  wSelect.position(52, drawHeight + 46);
  wSelect.parent(document.querySelector('main'));

  computeButton = createButton('Compute');
  computeButton.position(292, drawHeight + 45);
  computeButton.mousePressed(() => { flowPhase = 0; });
  computeButton.parent(document.querySelector('main'));

  describe('A butterfly diagram with inputs a and b on the left, a twiddle ' +
    'multiply on the b path, and outputs a plus Wb and a minus Wb on the ' +
    'right, with a live step-by-step calculation panel.', LABEL);
}

function makeInput(value, x) {
  const inp = createInput(value);
  inp.position(x, drawHeight + 10);
  inp.size(54);
  inp.parent(document.querySelector('main'));
  return inp;
}

function num(inp) {
  const v = parseFloat(inp.value());
  return isNaN(v) ? 0 : v;
}

function twiddle() {
  const k = TWIDDLES[wSelect.value()];
  const angle = (-2 * Math.PI * k) / 8;
  return { re: Math.cos(angle), im: Math.sin(angle) };
}

// The four-multiply form: (x+yi)(u+vi) = (xu - yv) + (xv + yu)i
function complexMultiply(p, q) {
  return {
    re: p.re * q.re - p.im * q.im,
    im: p.re * q.im + p.im * q.re
  };
}

function state() {
  const a = { re: num(aReInput), im: num(aImInput) };
  const b = { re: num(bReInput), im: num(bImInput) };
  const w = twiddle();
  const wb = complexMultiply(w, b);
  return {
    a: a, b: b, w: w, wb: wb,
    out1: { re: a.re + wb.re, im: a.im + wb.im },
    out2: { re: a.re - wb.re, im: a.im - wb.im }
  };
}

function draw() {
  updateCanvasSize();
  const s = state();

  if (flowPhase >= 0) {
    flowPhase += 0.012;
    if (flowPhase > 1.25) flowPhase = -1;
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawButterfly(s);
  drawPanel(s);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('The Butterfly Operation', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function geom() {
  // Wide enough that the right-aligned input value labels have room.
  const leftX = 112;
  const rightX = Math.min(330, canvasWidth * 0.42);
  return {
    leftX: leftX,
    rightX: Math.max(leftX + 120, rightX),
    topY: 110,
    botY: 270,
    mulX: (leftX + Math.max(leftX + 120, rightX)) / 2
  };
}

function drawButterfly(s) {
  const g = geom();

  // Wires: a goes straight to both outputs; b passes through the multiply.
  stroke(A_COLOR);
  strokeWeight(2);
  line(g.leftX, g.topY, g.rightX, g.topY);
  line(g.leftX, g.topY, g.rightX, g.botY);

  stroke(B_COLOR);
  line(g.leftX, g.botY, g.mulX, g.botY);
  stroke(W_COLOR);
  strokeWeight(3);
  line(g.mulX, g.botY, g.rightX, g.topY);
  line(g.mulX, g.botY, g.rightX, g.botY);

  // The twiddle multiply node — one node, two consumers.
  noStroke();
  fill(W_COLOR);
  circle(g.mulX, g.botY, 26);
  fill('white');
  textSize(15);
  textAlign(CENTER, CENTER);
  text('×', g.mulX, g.botY);
  fill(W_COLOR);
  textSize(13);
  textAlign(CENTER, TOP);
  text('W', g.mulX, g.botY + 18);

  // Animated packet showing the shared product travelling to both outputs
  if (flowPhase >= 0) {
    const t = Math.min(flowPhase, 1);
    noStroke();
    fill(W_COLOR);
    circle(lerp(g.mulX, g.rightX, t), lerp(g.botY, g.topY, t), 11);
    circle(lerp(g.mulX, g.rightX, t), g.botY, 11);
  }

  // Nodes
  drawNode(g.leftX, g.topY, 'a', A_COLOR, s.a);
  drawNode(g.leftX, g.botY, 'b', B_COLOR, s.b);
  drawCombine(g.rightX, g.topY, '+', OUT1_COLOR, 'output1', s.out1);
  drawCombine(g.rightX, g.botY, '−', OUT2_COLOR, 'output2', s.out2);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawNode(x, y, label, colorName, value) {
  noStroke();
  fill(colorName);
  circle(x, y, 22);
  fill('white');
  textSize(13);
  textAlign(CENTER, CENTER);
  text(label, x, y);

  fill(colorName);
  textSize(13);
  textAlign(RIGHT, CENTER);
  text(fmtComplex(value), x - 18, y);
}

function drawCombine(x, y, sign, colorName, label, value) {
  noStroke();
  fill(colorName);
  circle(x, y, 26);
  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  text(sign, x, y);

  fill(colorName);
  textSize(13);
  textAlign(LEFT, CENTER);
  text(label, x + 18, y - 9);
  text(fmtComplex(value), x + 18, y + 9);
}

function drawPanel(s) {
  const g = geom();
  const x = g.rightX + 130;
  const w = canvasWidth - x - 20;
  const y = 66;
  const h = 292;
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
  text('Step by step', x + 12, y + 10);
  textStyle(NORMAL);

  textSize(12);
  fill('dimgray');
  text('Complex multiply, four-multiply form:', x + 12, y + 34);
  fill(W_COLOR);
  text('(w_re·b_re − w_im·b_im)', x + 12, y + 52);
  text('  + (w_re·b_im + w_im·b_re) i', x + 12, y + 68);

  textSize(13);
  fill(W_COLOR);
  textStyle(BOLD);
  text('W × b = ' + fmtComplex(s.wb), x + 12, y + 96);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(12);
  text('Computed once. Both outputs below reuse this same value — it is not ' +
       'calculated twice.', x + 12, y + 118, w - 24, 46);

  fill(OUT1_COLOR);
  textSize(13);
  text('output1 = a + (W×b)', x + 12, y + 172);
  textStyle(BOLD);
  text('  = ' + fmtComplex(s.out1), x + 12, y + 190);
  textStyle(NORMAL);

  fill(OUT2_COLOR);
  text('output2 = a − (W×b)', x + 12, y + 220);
  textStyle(BOLD);
  text('  = ' + fmtComplex(s.out2), x + 12, y + 238);
  textStyle(NORMAL);

  fill('black');
  textSize(12);
  text('One multiply, two adds — for two outputs.', x + 12, y + 266, w - 24, 20);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function fmtComplex(c) {
  const re = c.re.toFixed(2);
  const im = Math.abs(c.im).toFixed(2);
  return re + (c.im < 0 ? ' − ' : ' + ') + im + 'i';
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('a =', 10, drawHeight + 22);
  text('+', 100, drawHeight + 22);
  text('i', 176, drawHeight + 22);
  text('b =', 204, drawHeight + 22);
  text('+', 294, drawHeight + 22);
  text('i', 370, drawHeight + 22);
  text('W =', 10, drawHeight + 58);
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
