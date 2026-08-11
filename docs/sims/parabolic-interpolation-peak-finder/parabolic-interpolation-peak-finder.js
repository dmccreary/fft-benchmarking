// Parabolic Interpolation Peak Finder MicroSim
// CANVAS_HEIGHT: 435
// Three bin magnitudes fix a parabola, and the parabola's vertex estimates
// where the true peak sits between bins.

let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const A_COLOR = 'cornflowerblue';
const B_COLOR = 'mediumblue';
const G_COLOR = 'cornflowerblue';
const FIT_COLOR = 'darkviolet';
const PEAK_COLOR = 'crimson';

let alphaSlider, betaSlider, gammaSlider;
let alpha = 60, beta = 100, gamma = 70;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  alphaSlider = createSlider(0, 100, 60, 1);
  alphaSlider.position(sliderLeftMargin, drawHeight + 5);
  alphaSlider.parent(document.querySelector('main'));

  betaSlider = createSlider(0, 100, 100, 1);
  betaSlider.position(sliderLeftMargin, drawHeight + 40);
  betaSlider.parent(document.querySelector('main'));

  gammaSlider = createSlider(0, 100, 70, 1);
  gammaSlider.position(sliderLeftMargin, drawHeight + 75);
  gammaSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three neighbouring bin magnitudes drawn as bars with a fitted ' +
    'parabola through their tops and a marker at the interpolated true peak ' +
    'position between bins.', LABEL);
}

// Standard three-point parabolic interpolation. The denominator vanishes when
// the three points are collinear, in which case there is no vertex to find.
function offset() {
  const denom = alpha - 2 * beta + gamma;
  if (Math.abs(denom) < 1e-9) return 0;
  return (0.5 * (alpha - gamma)) / denom;
}

function interpolatedMagnitude() {
  return beta - 0.25 * (alpha - gamma) * offset();
}

function draw() {
  updateCanvasSize();
  alpha = alphaSlider.value();
  beta = betaSlider.value();
  gamma = gammaSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPlot();
  drawReadout();
  drawControlLabels();
}

function plotGeometry() {
  const left = 70;
  const right = canvasWidth - 40;
  const top = 54;
  const base = 228;
  return {
    left: left, right: right, top: top, base: base,
    // Bin k-1, k, k+1 map to fractions 0.2, 0.5, 0.8 of the plot width.
    xOf: rel => map(rel, -1.6, 1.6, left, right),
    yOf: v => base - (v / 110) * (base - top)
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Parabolic Interpolation Between Bins', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPlot() {
  const g = plotGeometry();
  const barW = (g.xOf(1) - g.xOf(0)) * 0.5;

  stroke('lightgray');
  strokeWeight(1);
  line(g.left, g.base, g.right, g.base);

  // Bars
  const bars = [
    { rel: -1, v: alpha, c: A_COLOR, label: 'α', sub: 'bin k−1' },
    { rel: 0, v: beta, c: B_COLOR, label: 'β', sub: 'bin k' },
    { rel: 1, v: gamma, c: G_COLOR, label: 'γ', sub: 'bin k+1' }
  ];
  for (const b of bars) {
    const x = g.xOf(b.rel);
    const y = g.yOf(b.v);
    noStroke();
    fill(b.c);
    rect(x - barW / 2, y, barW, g.base - y);
    // Value labels sit inside the bar when there is room, keeping the strip
    // above the bars free for the interpolated-peak callout.
    const tall = g.base - y > 26;
    fill(tall ? 'white' : 'black');
    textSize(13);
    textAlign(CENTER, tall ? TOP : BOTTOM);
    text(b.label + ' = ' + b.v, x, tall ? y + 6 : y - 4);
    fill('dimgray');
    textSize(12);
    textAlign(CENTER, TOP);
    text(b.sub, x, g.base + 5);
  }

  // Fitted parabola through the three tops:
  //   y(t) = a t^2 + b t + c  with t measured in bins from the centre bin.
  const a = (alpha + gamma) / 2 - beta;
  const b = (gamma - alpha) / 2;
  const c = beta;
  stroke(FIT_COLOR);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let t = -1.55; t <= 1.55; t += 0.02) {
    vertex(g.xOf(t), g.yOf(a * t * t + b * t + c));
  }
  endShape();

  // Interpolated peak
  const d = offset();
  const peakY = g.yOf(interpolatedMagnitude());
  const peakX = g.xOf(d);
  stroke(PEAK_COLOR);
  strokeWeight(2);
  line(peakX, g.top, peakX, g.base + 8);
  noStroke();
  fill(PEAK_COLOR);
  circle(peakX, peakY, 12);
  textSize(13);
  textAlign(d >= 0 ? LEFT : RIGHT, CENTER);
  text('true peak ≈ bin k ' + (d >= 0 ? '+ ' : '− ') + Math.abs(d).toFixed(3),
       peakX + (d >= 0 ? 10 : -10), g.top + 12);

  // Centre-bin reference
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(g.xOf(0), g.top, g.xOf(0), g.base);
  drawingContext.setLineDash([]);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 252;
  const h = 58;
  const d = offset();
  const symmetric = alpha === gamma;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill('black');
  text('offset δ = 0.5(α − γ) / (α − 2β + γ) = 0.5(' + alpha + ' − ' + gamma +
       ') / (' + alpha + ' − ' + (2 * beta) + ' + ' + gamma + ')',
       margin + 12, y + 8);

  textStyle(BOLD);
  fill(PEAK_COLOR);
  text('δ = ' + d.toFixed(4) + ' bins' +
       (symmetric ? '   —   symmetric neighbours, so the peak is exactly at bin k'
                  : '   —   interpolated magnitude ' + interpolatedMagnitude().toFixed(2)),
       margin + 12, y + 32);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(A_COLOR);
  text('α  (bin below peak): ' + alpha, 10, drawHeight + 15);
  fill(B_COLOR);
  text('β  (peak bin): ' + beta, 10, drawHeight + 50);
  fill(G_COLOR);
  text('γ  (bin above peak): ' + gamma, 10, drawHeight + 85);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  alphaSlider.size(w);
  betaSlider.size(w);
  gammaSlider.size(w);
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
