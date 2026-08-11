// Performance Metrics Calculator MicroSim
// CANVAS_HEIGHT: 490
// A raw cycle count is not a result. These three conversions turn it into
// execution time, throughput, and a speedup factor you can defend.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 290;
let defaultTextSize = 16;

const CYCLES_COLOR = 'mediumblue';
const FREQ_COLOR = 'darkgreen';
const COMPARE_COLOR = 'darkorange';

let cyclesSlider, freqSlider, compareSlider, exampleButton;
let cycles = 21000000;
let freqMHz = 150;
let compareUs = 20500000;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  cyclesSlider = createSlider(1000, 30000000, 21000000, 1000);
  cyclesSlider.position(sliderLeftMargin, drawHeight + 5);
  cyclesSlider.parent(document.querySelector('main'));

  freqSlider = createSlider(50, 250, 150, 1);
  freqSlider.position(sliderLeftMargin, drawHeight + 40);
  freqSlider.parent(document.querySelector('main'));

  compareSlider = createSlider(1000, 25000000, 20500000, 1000);
  compareSlider.position(sliderLeftMargin, drawHeight + 75);
  compareSlider.parent(document.querySelector('main'));

  exampleButton = createButton('Load Chapter 12 example');
  exampleButton.position(10, drawHeight + 112);
  exampleButton.mousePressed(loadExample);
  exampleButton.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three sliders for elapsed cycles, clock frequency, and a comparison ' +
    'time, with live readouts of execution time, throughput, and speedup ' +
    'factor.', LABEL);
}

function loadExample() {
  cyclesSlider.value(21000000);
  freqSlider.value(150);
  compareSlider.value(20500000);
}

// Frequency in MHz is cycles per microsecond, so this division needs no
// unit juggling: 21,000,000 cycles / 150 cycles-per-us = 140,000 us.
function execUs() {
  return cycles / freqMHz;
}

function draw() {
  updateCanvasSize();
  cycles = cyclesSlider.value();
  freqMHz = freqSlider.value();
  compareUs = compareSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawMetrics();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('From Cycle Count to Real Numbers', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function metricRow(x, y, w, label, formula, substitution, value, valueColor) {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, 62, 6);

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(13);
  textStyle(BOLD);
  text(label, x + 12, y + 8);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text(formula, x + 12, y + 26);
  text(substitution, x + 12, y + 42);

  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  textSize(20);
  fill(valueColor);
  text(value, x + w - 14, y + 32);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMetrics() {
  const x = margin;
  const w = canvasWidth - 2 * margin;
  const us = execUs();
  const perSec = 1000000 / us;
  const speedup = compareUs / us;

  metricRow(x, 42, w,
    'Execution time',
    'elapsed cycles ÷ clock frequency in MHz  =  microseconds',
    fmt(cycles) + ' ÷ ' + freqMHz + '  =  ' + fmt(Math.round(us)) + ' µs',
    (us / 1000).toFixed(2) + ' ms', CYCLES_COLOR);

  metricRow(x, 112, w,
    'Throughput',
    '1,000,000 ÷ execution time in µs  =  operations per second',
    '1,000,000 ÷ ' + fmt(Math.round(us)),
    perSec.toFixed(2) + ' /s', FREQ_COLOR);

  metricRow(x, 182, w,
    'Speedup factor',
    'comparison time ÷ execution time  (dimensionless)',
    fmt(compareUs) + ' µs ÷ ' + fmt(Math.round(us)) + ' µs',
    speedup.toFixed(1) + '×', COMPARE_COLOR);

  // Sanity note
  stroke('darkgreen');
  strokeWeight(1.5);
  fill('honeydew');
  rect(x, 254, w, 66, 6);
  noStroke();
  fill('darkgreen');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Reality check', x + 12, 262);
  textStyle(NORMAL);
  fill('black');
  textSize(12);
  text('A speedup factor is only meaningful if both numbers measured the same ' +
       'work on the same input. Report the cycle count and the clock frequency ' +
       'alongside it — a bare "146× faster" is not reproducible, and reviewers ' +
       'cannot check it.',
       x + 12, 282, w - 24, 44);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(CYCLES_COLOR);
  text('Elapsed cycles: ' + fmt(cycles), 10, drawHeight + 15);
  fill(FREQ_COLOR);
  text('Clock frequency: ' + freqMHz + ' MHz', 10, drawHeight + 50);
  fill(COMPARE_COLOR);
  text('Comparison time: ' + fmt(compareUs) + ' µs', 10, drawHeight + 85);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  cyclesSlider.size(w);
  freqSlider.size(w);
  compareSlider.size(w);
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
