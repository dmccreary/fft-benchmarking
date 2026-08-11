// Aliasing Demonstrator MicroSim
// CANVAS_HEIGHT: 465
// Raising a signal past the Nyquist frequency makes the samples trace out a
// slower "ghost" wave. The reconstructed curve turns red the instant the
// Nyquist limit is crossed.

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 235;
let defaultTextSize = 16;

const SAMPLES_SHOWN = 32;

let freqSlider;
let rateSlider;
let reconCheckbox;

let trueFreq = 1000;
let sampleRate = 16000;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  freqSlider = createSlider(100, 15000, 1000, 100);
  freqSlider.position(sliderLeftMargin, drawHeight + 5);
  freqSlider.parent(document.querySelector('main'));

  rateSlider = createSlider(4000, 16000, 16000, 500);
  rateSlider.position(sliderLeftMargin, drawHeight + 40);
  rateSlider.parent(document.querySelector('main'));

  reconCheckbox = createCheckbox(' Show reconstructed (aliased) curve', true);
  reconCheckbox.position(10, drawHeight + 78);
  reconCheckbox.parent(document.querySelector('main'));

  resizeSliders();

  describe('A continuous sine wave with sample dots and a dashed reconstructed ' +
    'curve. Once the signal frequency passes half the sampling rate the ' +
    'reconstruction diverges into a slower wave and turns red.', LABEL);
}

function draw() {
  updateCanvasSize();
  trueFreq = freqSlider.value();
  sampleRate = rateSlider.value();

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

// The signal that actually passes through every sample point. Folding the true
// frequency by whole multiples of the sample rate gives a signed frequency
// whose sine matches the samples exactly.
function signedAliasFreq() {
  return trueFreq - Math.round(trueFreq / sampleRate) * sampleRate;
}

function apparentFreq() {
  return Math.abs(signedAliasFreq());
}

function nyquist() {
  return sampleRate / 2;
}

function isAliased() {
  return trueFreq > nyquist();
}

function plotGeometry() {
  return {
    left: 70,
    right: canvasWidth - 25,
    top: 76,
    bottom: 268,
    midY: (76 + 268) / 2
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Aliasing Demonstrator', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPlot() {
  const g = plotGeometry();
  if (g.right <= g.left) return;
  const windowS = SAMPLES_SHOWN / sampleRate;
  const amp = (g.bottom - g.midY) * 0.86;

  const tToX = t => map(t, 0, windowS, g.left, g.right);

  // Frame and zero line
  stroke('lightgray');
  strokeWeight(1);
  line(g.left, g.midY, g.right, g.midY);
  line(g.left, g.top, g.left, g.bottom);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('+1', g.left - 8, g.midY - amp);
  text('0', g.left - 8, g.midY);
  text('-1', g.left - 8, g.midY + amp);

  // True continuous signal, sampled finely enough to stay smooth
  stroke('darkblue');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = g.left; px <= g.right; px += 0.5) {
    const t = map(px, g.left, g.right, 0, windowS);
    vertex(px, g.midY - Math.sin(TWO_PI * trueFreq * t) * amp);
  }
  endShape();

  // What the system actually sees
  if (reconCheckbox.checked()) {
    const fa = signedAliasFreq();
    stroke(isAliased() ? 'crimson' : 'green');
    strokeWeight(3);
    drawingContext.setLineDash([8, 6]);
    noFill();
    beginShape();
    for (let px = g.left; px <= g.right; px += 0.5) {
      const t = map(px, g.left, g.right, 0, windowS);
      vertex(px, g.midY - Math.sin(TWO_PI * fa * t) * amp);
    }
    endShape();
    drawingContext.setLineDash([]);
  }

  // Sample instants
  for (let n = 0; n <= SAMPLES_SHOWN; n++) {
    const t = n / sampleRate;
    const x = tToX(t);
    if (x > g.right) break;
    const y = g.midY - Math.sin(TWO_PI * trueFreq * t) * amp;
    stroke('gray');
    strokeWeight(1);
    line(x, g.midY, x, y);
    noStroke();
    fill('black');
    circle(x, y, 8);
  }

  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(CENTER, TOP);
  text('Time — ' + SAMPLES_SHOWN + ' sample instants shown',
       g.left, g.bottom + 8, g.right - g.left, 18);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const aliased = isAliased();
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(15);

  fill('black');
  text('True frequency: ' + trueFreq.toLocaleString('en-US') + ' Hz', 30, 300);
  text('Sampling rate: ' + sampleRate.toLocaleString('en-US') + ' Hz', 30, 322);

  textAlign(RIGHT, CENTER);
  fill('black');
  text('Nyquist frequency: ' + nyquist().toLocaleString('en-US') + ' Hz',
       canvasWidth - 30, 300);

  textStyle(BOLD);
  fill(aliased ? 'crimson' : 'green');
  text('Apparent frequency: ' + Math.round(apparentFreq()).toLocaleString('en-US') +
       ' Hz' + (aliased ? '  — ALIASED' : '  — correct'),
       canvasWidth - 30, 322);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill('black');
  text('True frequency: ' + trueFreq.toLocaleString('en-US') + ' Hz',
       10, drawHeight + 15);
  text('Sampling rate: ' + sampleRate.toLocaleString('en-US') + ' Hz',
       10, drawHeight + 50);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  freqSlider.size(w);
  rateSlider.size(w);
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
