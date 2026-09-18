// The Butterfly Shares Computation MicroSim
// CANVAS_HEIGHT: 780
// Set a, b and the twiddle angle W with sliders, then toggle "Share b x W" to
// compare a butterfly that reuses one product against one that (like a direct
// DFT) recomputes W*b separately for each output.

let canvasWidth = 700;
let drawHeight = 540;
let controlHeight = 240;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

const A_COLOR = 'mediumblue';
const B_COLOR = 'darkorange';
const SHARED_COLOR = 'seagreen';
const WASTE_COLOR = 'crimson';
const OUT1_COLOR = 'darkgreen';
const OUT2_COLOR = 'firebrick';

// Instruction counts for one butterfly (matches Lab 19's worked totals).
const NO_SHARE_MUL = 8, NO_SHARE_ADD = 8;
const SHARE_MUL = 4, SHARE_ADD = 6;
const BUTTERFLIES_512 = 2304; // butterflies in a 512-point FFT (Lab 19, Step 4)

let aReSlider, aImSlider, bReSlider, bImSlider, wAngleSlider, shareCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  aReSlider = createSlider(-4, 4, 3, 0.1);
  aImSlider = createSlider(-4, 4, 1, 0.1);
  bReSlider = createSlider(-4, 4, 2, 0.1);
  bImSlider = createSlider(-4, 4, -1, 0.1);
  wAngleSlider = createSlider(0, 360, 45, 1);

  positionSliders();

  shareCheckbox = createCheckbox('Share b × W between both outputs', true);
  shareCheckbox.position(margin, drawHeight + 208);
  shareCheckbox.parent(document.querySelector('main'));

  describe('A butterfly diagram with sliders for a, b and the twiddle angle W, ' +
    'a checkbox to share the b times W product between both outputs, and a ' +
    'panel comparing the multiply and add instruction counts with and without ' +
    'sharing.', LABEL);
}

function positionSliders() {
  const w = Math.max(120, canvasWidth - sliderLeftMargin - margin);
  aReSlider.position(sliderLeftMargin, drawHeight + 14);
  aReSlider.size(w);
  aImSlider.position(sliderLeftMargin, drawHeight + 50);
  aImSlider.size(w);
  bReSlider.position(sliderLeftMargin, drawHeight + 86);
  bReSlider.size(w);
  bImSlider.position(sliderLeftMargin, drawHeight + 122);
  bImSlider.size(w);
  wAngleSlider.position(sliderLeftMargin, drawHeight + 158);
  wAngleSlider.size(w);
}

function complexMultiply(p, q) {
  return {
    re: p.re * q.re - p.im * q.im,
    im: p.re * q.im + p.im * q.re
  };
}

function state() {
  const a = { re: aReSlider.value(), im: aImSlider.value() };
  const b = { re: bReSlider.value(), im: bImSlider.value() };
  const angle = wAngleSlider.value() * Math.PI / 180;
  const w = { re: Math.cos(angle), im: -Math.sin(angle) };
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
  const share = shareCheckbox.checked();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawDiagram(s, share);
  drawCounts(share);
  drawControlLabels();
}

// Measures the widest node/output label so the diagram margins can grow to
// fit whatever values the sliders currently produce, instead of clipping.
function labelWidths(s) {
  textSize(13);
  const leftW = Math.max(textWidth(fmtComplex(s.a)), textWidth(fmtComplex(s.b)));
  textSize(12);
  const rightW = Math.max(
    textWidth('a + Wb  =  ' + fmtComplex(s.out1)),
    textWidth('a − Wb  =  ' + fmtComplex(s.out2))
  );
  textSize(defaultTextSize);
  return { leftW, rightW };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('The Butterfly Shares Computation', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function geom(leftW, rightW) {
  // Circle radius (11) + text-to-circle gap (matches the 16/18 used below) +
  // a little edge padding, so the value text never runs off the canvas.
  const leftX = leftW + 11 + 16 + 8;
  const rightMargin = rightW + 11 + 18 + 8;
  const rightX = canvasWidth - rightMargin;
  const topY = 108;
  const botY = 212;
  return {
    leftX: leftX,
    rightX: Math.max(leftX + 160, rightX),
    topY: topY,
    botY: botY,
    mulX: (leftX + Math.max(leftX + 160, rightX)) / 2
  };
}

function drawDiagram(s, share) {
  const lw = labelWidths(s);
  const g = geom(lw.leftW, lw.rightW);

  // a passes straight through to both outputs, whether or not b*W is shared.
  stroke(A_COLOR);
  strokeWeight(2);
  line(g.leftX, g.topY, g.rightX, g.topY);
  line(g.leftX, g.topY, g.rightX, g.botY);

  if (share) {
    stroke(B_COLOR);
    strokeWeight(2);
    line(g.leftX, g.botY, g.mulX, g.botY);
    stroke(SHARED_COLOR);
    strokeWeight(3);
    line(g.mulX, g.botY, g.rightX, g.topY);
    line(g.mulX, g.botY, g.rightX, g.botY);
    drawMultiplyNode(g.mulX, g.botY, SHARED_COLOR);
  } else {
    const upY = g.botY - 46;
    const downY = g.botY + 46;
    stroke(B_COLOR);
    strokeWeight(2);
    line(g.leftX, g.botY, g.mulX, upY);
    line(g.leftX, g.botY, g.mulX, downY);
    stroke(WASTE_COLOR);
    strokeWeight(3);
    line(g.mulX, upY, g.rightX, g.topY);
    line(g.mulX, downY, g.rightX, g.botY);
    drawMultiplyNode(g.mulX, upY, WASTE_COLOR);
    drawMultiplyNode(g.mulX, downY, WASTE_COLOR);
  }

  drawNode(g.leftX, g.topY, 'a', A_COLOR, s.a);
  drawNode(g.leftX, g.botY, 'b', B_COLOR, s.b);
  drawCombine(g.rightX, g.topY, '+', OUT1_COLOR, 'a + Wb', s.out1);
  drawCombine(g.rightX, g.botY, '−', OUT2_COLOR, 'a − Wb', s.out2);

  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  fill(share ? SHARED_COLOR : WASTE_COLOR);
  const caption = share
    ? 'W × b computed once, reused by both outputs'
    : 'W × b computed twice — once per output';
  text(caption, canvasWidth / 2, g.botY + 60);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMultiplyNode(x, y, colorName) {
  noStroke();
  fill(colorName);
  circle(x, y, 26);
  fill('white');
  textSize(15);
  textAlign(CENTER, CENTER);
  text('×', x, y);
  fill(colorName);
  textSize(12);
  textAlign(CENTER, TOP);
  text('W', x, y + 16);
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
  text(fmtComplex(value), x - 16, y);
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
  textSize(12);
  textAlign(LEFT, CENTER);
  text(label + '  =  ' + fmtComplex(value), x + 18, y);
}

function fmtComplex(c) {
  const re = c.re.toFixed(2);
  const im = Math.abs(c.im).toFixed(2);
  return re + (c.im < 0 ? ' − ' : ' + ') + im + 'i';
}

function drawCounts(share) {
  const y = 300;
  const h = 150;
  const pad = 20;
  const cardW = (canvasWidth - 3 * pad) / 2;
  const noShareX = pad;
  const shareX = pad * 2 + cardW;

  drawCard(noShareX, y, cardW, h, 'Without sharing', NO_SHARE_MUL, NO_SHARE_ADD,
    !share, WASTE_COLOR);
  drawCard(shareX, y, cardW, h, 'With sharing', SHARE_MUL, SHARE_ADD,
    share, SHARED_COLOR);

  const savedMul = NO_SHARE_MUL - SHARE_MUL;
  const savedAdd = NO_SHARE_ADD - SHARE_ADD;
  const savedOps = savedMul + savedAdd;
  const pct = Math.round((savedOps / (NO_SHARE_MUL + NO_SHARE_ADD)) * 100);
  const savedAt512 = savedMul * BUTTERFLIES_512;

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Sharing saves ' + savedMul + ' multiplies and ' + savedAdd +
    ' adds per butterfly — ' + pct + '% fewer instructions.',
    canvasWidth / 2, y + h + 14);
  fill('dimgray');
  textSize(12);
  text('A 512-point FFT runs ' + BUTTERFLIES_512.toLocaleString() +
    ' butterflies, so sharing saves about ' + savedAt512.toLocaleString() +
    ' real multiplies overall.',
    canvasWidth / 2, y + h + 34, canvasWidth - 2 * pad, 40);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCard(x, y, w, h, title, mulCount, addCount, active, colorName) {
  stroke(active ? colorName : 'silver');
  strokeWeight(active ? 2 : 1);
  if (active) {
    const c = color(colorName);
    fill(red(c), green(c), blue(c), 24);
  } else {
    fill('white');
  }
  rect(x, y, w, h, 8);

  noStroke();
  textAlign(CENTER, TOP);
  fill(active ? colorName : 'gray');
  textStyle(BOLD);
  textSize(15);
  text(title, x + w / 2, y + 12);
  textStyle(NORMAL);

  textSize(28);
  fill(active ? 'black' : 'gray');
  text(mulCount, x + w * 0.3, y + 44);
  text(addCount, x + w * 0.7, y + 44);

  textSize(12);
  fill(active ? 'dimgray' : 'darkgray');
  text('multiplies', x + w * 0.3, y + 86);
  text('adds', x + w * 0.7, y + 86);

  textSize(12);
  fill(active ? colorName : 'gray');
  text((mulCount + addCount) + ' total instructions', x + w / 2, y + 116);

  textAlign(LEFT, CENTER);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(RIGHT, CENTER);
  text('a (real) = ' + aReSlider.value().toFixed(1), sliderLeftMargin - 10, drawHeight + 22);
  text('a (imag) = ' + aImSlider.value().toFixed(1), sliderLeftMargin - 10, drawHeight + 58);
  text('b (real) = ' + bReSlider.value().toFixed(1), sliderLeftMargin - 10, drawHeight + 94);
  text('b (imag) = ' + bImSlider.value().toFixed(1), sliderLeftMargin - 10, drawHeight + 130);
  text('W angle = ' + wAngleSlider.value() + '°', sliderLeftMargin - 10, drawHeight + 166);
  textAlign(LEFT, CENTER);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  if (typeof aReSlider !== 'undefined') positionSliders();
}
