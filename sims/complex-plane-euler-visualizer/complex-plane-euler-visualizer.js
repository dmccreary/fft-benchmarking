// Complex Plane Euler Visualizer MicroSim
// CANVAS_HEIGHT: 450
// e^(i*theta) drawn as a vector on the complex plane, with its real and
// imaginary parts read off as cos(theta) and sin(theta) and its magnitude
// pinned at 1.00 no matter the angle.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const RE_COLOR = 'mediumblue';
const IM_COLOR = 'crimson';

let thetaSlider;
let playButton;
let theta = 0;
let isPlaying = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.position(10, drawHeight + 10);
  playButton.mousePressed(togglePlay);
  playButton.parent(document.querySelector('main'));

  thetaSlider = createSlider(0, TWO_PI, 0, 0.01);
  thetaSlider.position(sliderLeftMargin, drawHeight + 12);
  thetaSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A vector from the origin to e to the i theta on the complex plane, ' +
    'with dashed projections onto the real and imaginary axes and a readout ' +
    'showing cos theta, sin theta, and a magnitude fixed at 1.00.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (isPlaying) {
    theta += 0.014;
    if (theta > TWO_PI) theta -= TWO_PI;
    thetaSlider.value(theta);
  } else {
    theta = thetaSlider.value();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPlane();
  drawReadoutPanel();
  drawControlLabels();
}

function planeGeometry() {
  const panelW = constrain(canvasWidth * 0.34, 190, 300);
  const availW = canvasWidth - panelW - 60;
  const r = Math.max(60, Math.min(availW / 2, 135));
  return { cx: 40 + r + 20, cy: 218, r: r, panelW: panelW };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Complex Plane and Euler\'s Formula', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPlane() {
  const g = planeGeometry();
  const re = Math.cos(theta);
  const im = Math.sin(theta);
  const px = g.cx + re * g.r;
  const py = g.cy - im * g.r;

  // Axes
  stroke('gray');
  strokeWeight(1);
  line(g.cx - g.r - 26, g.cy, g.cx + g.r + 26, g.cy);
  line(g.cx, g.cy - g.r - 26, g.cx, g.cy + g.r + 26);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Re', g.cx + g.r + 8, g.cy - 14);
  textAlign(CENTER, BOTTOM);
  text('Im', g.cx + 16, g.cy - g.r - 28);

  // The unit circle is the path e^(i*theta) traces
  noFill();
  stroke('lightgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  circle(g.cx, g.cy, g.r * 2);
  drawingContext.setLineDash([]);

  // Projections
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  stroke(RE_COLOR);
  line(px, py, px, g.cy);
  stroke(IM_COLOR);
  line(px, py, g.cx, py);
  drawingContext.setLineDash([]);

  // Component segments along each axis
  strokeWeight(5);
  stroke(RE_COLOR);
  line(g.cx, g.cy, px, g.cy);
  stroke(IM_COLOR);
  line(g.cx, g.cy, g.cx, py);

  // The vector itself
  stroke('black');
  strokeWeight(3);
  line(g.cx, g.cy, px, py);
  push();
  translate(px, py);
  rotate(Math.atan2(py - g.cy, px - g.cx));
  noStroke();
  fill('black');
  triangle(0, 0, -12, -5, -12, 5);
  pop();

  // Angle arc
  noFill();
  stroke('darkgreen');
  strokeWeight(2);
  arc(g.cx, g.cy, g.r * 0.42, g.r * 0.42, -theta, 0);
  noStroke();
  fill('darkgreen');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('θ', g.cx + g.r * 0.25 * Math.cos(theta / 2) + 4,
       g.cy - g.r * 0.25 * Math.sin(theta / 2));

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadoutPanel() {
  const g = planeGeometry();
  const x = canvasWidth - g.panelW - 20;
  const y = 62;
  const w = g.panelW;
  const h = 300;
  if (w < 150) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);

  const re = Math.cos(theta);
  const im = Math.sin(theta);
  const mag = Math.sqrt(re * re + im * im);

  noStroke();
  textAlign(LEFT, TOP);

  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Euler\'s formula', x + 14, y + 12);
  textStyle(NORMAL);

  textSize(14);
  fill('dimgray');
  text('e^(iθ) = cos θ + i sin θ', x + 14, y + 36);

  // Live substitution, each part in its axis color
  textSize(15);
  fill('black');
  text('θ = ' + theta.toFixed(2) + ' rad  (' + Math.round(degrees(theta)) + '°)',
       x + 14, y + 70);

  fill(RE_COLOR);
  text('Real part      cos θ = ' + re.toFixed(3), x + 14, y + 104);
  fill(IM_COLOR);
  text('Imaginary part  sin θ = ' + im.toFixed(3), x + 14, y + 132);

  fill('black');
  textSize(15);
  text('e^(i' + theta.toFixed(2) + ') =', x + 14, y + 172);
  fill(RE_COLOR);
  text(re.toFixed(3), x + 14, y + 196);
  fill('black');
  text('  +  ', x + 14 + textWidth(re.toFixed(3)), y + 196);
  fill(IM_COLOR);
  text(im.toFixed(3) + ' i',
       x + 14 + textWidth(re.toFixed(3)) + textWidth('  +  '), y + 196);

  // The invariant worth staring at
  stroke('darkgreen');
  strokeWeight(1);
  fill(240, 255, 240);
  rect(x + 12, y + 230, w - 24, 56, 6);
  noStroke();
  fill('darkgreen');
  textStyle(BOLD);
  textSize(15);
  text('| e^(iθ) | = ' + mag.toFixed(2), x + 22, y + 240);
  textStyle(NORMAL);
  textSize(13);
  text('Always exactly 1, at every angle.', x + 22, y + 264);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('θ: ' + theta.toFixed(2) + ' rad (' + Math.round(degrees(theta)) + '°)',
       80, drawHeight + 24);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
}

function resizeSliders() {
  thetaSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
