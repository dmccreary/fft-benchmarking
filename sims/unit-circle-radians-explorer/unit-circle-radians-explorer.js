// Unit Circle Radians Explorer MicroSim
// CANVAS_HEIGHT: 460
// One rotating angle shown two ways at once: as a point on the unit circle,
// and as the sine and cosine curves its projections trace out.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 285;
let defaultTextSize = 16;

const SIN_COLOR = 'crimson';
const COS_COLOR = 'mediumblue';

// The four quarter-turn landmarks, anchored in both views.
const LANDMARKS = [
  { a: 0, label: '0' },
  { a: Math.PI / 2, label: 'π/2' },
  { a: Math.PI, label: 'π' },
  { a: 3 * Math.PI / 2, label: '3π/2' }
];

let angleSlider;
let speedSlider;
let playButton;

let angle = 0;
let isPlaying = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.position(10, drawHeight + 5);
  playButton.mousePressed(togglePlay);
  playButton.parent(document.querySelector('main'));

  angleSlider = createSlider(0, TWO_PI, 0, 0.01);
  angleSlider.position(sliderLeftMargin, drawHeight + 5);
  angleSlider.parent(document.querySelector('main'));

  speedSlider = createSlider(0.2, 3.0, 1.0, 0.1);
  speedSlider.position(sliderLeftMargin, drawHeight + 40);
  speedSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A unit circle with a rotating point beside a synchronized plot of ' +
    'the sine and cosine curves its projections trace, with the angle shown in ' +
    'both radians and degrees.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (isPlaying) {
    angle += 0.012 * speedSlider.value();
    if (angle > TWO_PI) angle -= TWO_PI;
    angleSlider.value(angle);
  } else {
    angle = angleSlider.value();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCircle();
  drawWavePlot();
  drawControlLabels();
}

function circleGeometry() {
  const cx = Math.min(canvasWidth * 0.24, 190);
  const cy = 210;
  const r = Math.min(cx - 40, 118);
  return { cx: cx, cy: cy, r: Math.max(40, r) };
}

function plotGeometry() {
  const g = circleGeometry();
  const left = g.cx + g.r + 70;
  return {
    left: left,
    right: canvasWidth - 30,
    midY: 210,
    amp: Math.min(g.r, 118)
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Unit Circle and Radians Explorer', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCircle() {
  const g = circleGeometry();
  const px = g.cx + Math.cos(angle) * g.r;
  const py = g.cy - Math.sin(angle) * g.r;

  // Axes
  stroke('lightgray');
  strokeWeight(1);
  line(g.cx - g.r - 18, g.cy, g.cx + g.r + 18, g.cy);
  line(g.cx, g.cy - g.r - 18, g.cx, g.cy + g.r + 18);

  // The circle
  noFill();
  stroke('gray');
  strokeWeight(2);
  circle(g.cx, g.cy, g.r * 2);

  // Quarter-turn landmarks
  for (const lm of LANDMARKS) {
    const lx = g.cx + Math.cos(lm.a) * g.r;
    const ly = g.cy - Math.sin(lm.a) * g.r;
    const near = angularDistance(angle, lm.a) < 0.08;
    noStroke();
    fill(near ? 'darkorange' : 'silver');
    circle(lx, ly, near ? 13 : 7);
    fill(near ? 'darkorange' : 'gray');
    textSize(13);
    textAlign(CENTER, CENTER);
    text(lm.label, g.cx + Math.cos(lm.a) * (g.r + 24),
                   g.cy - Math.sin(lm.a) * (g.r + 24));
  }

  // Angle arc
  noFill();
  stroke('darkgreen');
  strokeWeight(3);
  arc(g.cx, g.cy, g.r * 0.55, g.r * 0.55, -angle, 0);

  // Projections
  stroke(COS_COLOR);
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  line(px, py, px, g.cy);
  stroke(SIN_COLOR);
  line(px, py, g.cx, py);
  drawingContext.setLineDash([]);

  // Radius and point
  stroke('black');
  strokeWeight(2);
  line(g.cx, g.cy, px, py);
  noStroke();
  fill('black');
  circle(px, py, 12);

  // Radius label, pushed off the radius along its perpendicular so the line
  // never runs through the glyph.
  const nx = -(py - g.cy) / g.r;
  const ny = (px - g.cx) / g.r;
  fill('black');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('1', (g.cx + px) / 2 + nx * 15, (g.cy + py) / 2 + ny * 15);

  fill(COS_COLOR);
  textAlign(CENTER, TOP);
  text('cos = ' + Math.cos(angle).toFixed(2), px, g.cy + 6);
  // Sits above its own dashed projection line rather than on it.
  fill(SIN_COLOR);
  textAlign(RIGHT, BOTTOM);
  text('sin = ' + Math.sin(angle).toFixed(2), g.cx - 10, py - 5);

  // Angle readout
  noStroke();
  fill('darkgreen');
  textSize(16);
  textAlign(CENTER, TOP);
  text(angle.toFixed(2) + ' rad  =  ' + Math.round(degrees(angle)) + '°',
       g.cx, g.cy + g.r + 34);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function angularDistance(a, b) {
  const d = Math.abs(a - b) % TWO_PI;
  return Math.min(d, TWO_PI - d);
}

function drawWavePlot() {
  const p = plotGeometry();
  if (p.right - p.left < 90) return;

  const aToX = a => map(a, 0, TWO_PI, p.left, p.right);

  // Axes and landmark gridlines
  stroke('lightgray');
  strokeWeight(1);
  line(p.left, p.midY, p.right, p.midY);
  line(p.left, p.midY - p.amp, p.left, p.midY + p.amp);
  for (const lm of LANDMARKS) {
    const x = aToX(lm.a);
    line(x, p.midY - p.amp, x, p.midY + p.amp);
  }

  noStroke();
  fill('gray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (const lm of LANDMARKS) {
    text(lm.label, aToX(lm.a), p.midY + p.amp + 6);
  }
  text('2π', p.right, p.midY + p.amp + 6);
  textAlign(RIGHT, CENTER);
  fill('black');
  textSize(12);
  text('+1', p.left - 6, p.midY - p.amp);
  text('-1', p.left - 6, p.midY + p.amp);

  // Curves grow only as far as the current angle.
  noFill();
  strokeWeight(2);
  stroke(COS_COLOR);
  drawingContext.setLineDash([6, 4]);
  beginShape();
  for (let a = 0; a <= angle; a += 0.01) {
    vertex(aToX(a), p.midY - Math.cos(a) * p.amp);
  }
  endShape();
  drawingContext.setLineDash([]);

  stroke(SIN_COLOR);
  strokeWeight(3);
  beginShape();
  for (let a = 0; a <= angle; a += 0.01) {
    vertex(aToX(a), p.midY - Math.sin(a) * p.amp);
  }
  endShape();

  // Leading edge markers, tying the plot back to the circle
  const xNow = aToX(angle);
  stroke('darkgreen');
  strokeWeight(1);
  line(xNow, p.midY - p.amp, xNow, p.midY + p.amp);
  noStroke();
  fill(SIN_COLOR);
  circle(xNow, p.midY - Math.sin(angle) * p.amp, 10);
  fill(COS_COLOR);
  circle(xNow, p.midY - Math.cos(angle) * p.amp, 10);

  fill(SIN_COLOR);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('sine (from the vertical projection)', p.left, p.midY - p.amp - 30);
  fill(COS_COLOR);
  text('cosine (from the horizontal projection)', p.left, p.midY - p.amp - 12);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill('black');
  text('Angle: ' + angle.toFixed(2) + ' rad (' + Math.round(degrees(angle)) + '°)',
       80, drawHeight + 15);
  text('Rotation speed: ' + speedSlider.value().toFixed(1) + 'x',
       10, drawHeight + 50);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  angleSlider.size(w);
  speedSlider.size(w);
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
