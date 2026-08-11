// Magnitude and Phase From a Complex Bin MicroSim
// CANVAS_HEIGHT: 460
// One FFT bin is a complex number. Magnitude is how much of that frequency is
// present; phase is where in its cycle it started. Both come from the same
// point on the complex plane.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

const RE_COLOR = 'mediumblue';
const IM_COLOR = 'crimson';
const MAG_COLOR = 'darkgreen';
const PHASE_COLOR = 'darkviolet';
const AXIS_MAX = 10;

let reSlider, imSlider;
let re = 6, im = 8;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  reSlider = createSlider(-10, 10, 6, 0.1);
  reSlider.position(sliderLeftMargin, drawHeight + 5);
  reSlider.parent(document.querySelector('main'));

  imSlider = createSlider(-10, 10, 8, 0.1);
  imSlider.position(sliderLeftMargin, drawHeight + 40);
  imSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A complex plane with a vector from the origin to the point given by ' +
    'the real and imaginary sliders, with live magnitude and phase readouts.',
    LABEL);
}

function draw() {
  updateCanvasSize();
  re = reSlider.value();
  im = imSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPlane();
  drawPanel();
  drawControlLabels();
}

function magnitude() {
  return Math.sqrt(re * re + im * im);
}

function phase() {
  return Math.atan2(im, re);
}

function planeGeometry() {
  const panelW = constrain(canvasWidth * 0.36, 200, 310);
  const availW = canvasWidth - panelW - 60;
  const r = constrain(availW / 2 - 8, 60, 128);
  return { cx: 34 + r + 16, cy: 208, r: r, panelW: panelW };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Magnitude and Phase From One Bin', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPlane() {
  const g = planeGeometry();
  const scale = g.r / AXIS_MAX;
  const px = g.cx + re * scale;
  const py = g.cy - im * scale;

  // Grid
  stroke('lightgray');
  strokeWeight(1);
  for (let v = -10; v <= 10; v += 5) {
    if (v === 0) continue;
    line(g.cx + v * scale, g.cy - g.r, g.cx + v * scale, g.cy + g.r);
    line(g.cx - g.r, g.cy - v * scale, g.cx + g.r, g.cy - v * scale);
  }

  stroke('gray');
  strokeWeight(1.5);
  line(g.cx - g.r - 14, g.cy, g.cx + g.r + 14, g.cy);
  line(g.cx, g.cy - g.r - 14, g.cx, g.cy + g.r + 14);

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Real', g.cx + g.r + 2, g.cy - 12);
  textAlign(CENTER, BOTTOM);
  text('Imag', g.cx + 26, g.cy - g.r - 16);

  // Component legs
  strokeWeight(4);
  stroke(RE_COLOR);
  line(g.cx, g.cy, px, g.cy);
  stroke(IM_COLOR);
  line(px, g.cy, px, py);

  // Phase arc
  noFill();
  stroke(PHASE_COLOR);
  strokeWeight(2);
  arc(g.cx, g.cy, g.r * 0.5, g.r * 0.5, -phase() > 0 ? 0 : -phase(),
      -phase() > 0 ? -phase() : 0);

  // The vector
  stroke(MAG_COLOR);
  strokeWeight(3);
  line(g.cx, g.cy, px, py);
  push();
  translate(px, py);
  rotate(Math.atan2(py - g.cy, px - g.cx));
  noStroke();
  fill(MAG_COLOR);
  triangle(0, 0, -11, -5, -11, 5);
  pop();

  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('(' + re.toFixed(1) + ', ' + im.toFixed(1) + ')', px + 12, py - 12);

  fill(PHASE_COLOR);
  textSize(12);
  text('θ', g.cx + g.r * 0.30 * Math.cos(phase() / 2) + 4,
       g.cy - g.r * 0.30 * Math.sin(phase() / 2));

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPanel() {
  const g = planeGeometry();
  const x = canvasWidth - g.panelW - 20;
  const y = 62;
  const w = g.panelW;
  const h = 302;
  if (w < 170) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 8);

  const mag = magnitude();
  const ph = phase();

  noStroke();
  textAlign(LEFT, TOP);

  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('This bin', x + 12, y + 10);
  textStyle(NORMAL);

  textSize(14);
  fill(RE_COLOR);
  text('Real part = ' + re.toFixed(1), x + 12, y + 36);
  fill(IM_COLOR);
  text('Imaginary part = ' + im.toFixed(1), x + 12, y + 58);

  // Magnitude
  fill(MAG_COLOR);
  textSize(13);
  text('Magnitude = √(re² + im²)', x + 12, y + 94);
  text('  = √(' + (re * re).toFixed(1) + ' + ' + (im * im).toFixed(1) + ')',
       x + 12, y + 112);
  textStyle(BOLD);
  textSize(16);
  text('  = ' + mag.toFixed(3), x + 12, y + 132);
  textStyle(NORMAL);

  // Phase
  fill(PHASE_COLOR);
  textSize(13);
  text('Phase = atan2(im, re)', x + 12, y + 168);
  text('  = atan2(' + im.toFixed(1) + ', ' + re.toFixed(1) + ')', x + 12, y + 186);
  textStyle(BOLD);
  textSize(16);
  text('  = ' + ph.toFixed(3) + ' rad', x + 12, y + 206);
  textSize(13);
  text('  = ' + degrees(ph).toFixed(1) + '°', x + 12, y + 228);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(12);
  text('Magnitude says how much of this frequency is present. Phase says where ' +
       'in its cycle it started. A spectrum plot shows only the first.',
       x + 12, y + 252, w - 24, 46);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(RE_COLOR);
  text('Real part (re): ' + re.toFixed(1), 10, drawHeight + 15);
  fill(IM_COLOR);
  text('Imaginary part (im): ' + im.toFixed(1), 10, drawHeight + 50);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  reSlider.size(w);
  imSlider.size(w);
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
