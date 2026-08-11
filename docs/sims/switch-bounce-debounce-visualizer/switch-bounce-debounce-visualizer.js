// Switch Bounce Debounce Visualizer MicroSim
// CANVAS_HEIGHT: 480
// A noisy switch press and the same press after debouncing, on a shared
// millisecond timescale. Too short a delay visibly lets bounce through as
// extra logical press events.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

const WINDOW_MS = 80;      // total time shown on both charts
const BOUNCE_WINDOW_MS = 15;  // all bounce activity happens inside this
const SAMPLE_STEP = 0.1;   // ms per simulation step

let simulateButton;
let delaySlider;
let showBounceCheckbox;

// Raw signal as an ordered list of edges: {t, s} where s is 1 (pressed) or 0.
let rawEdges = [];
let debouncedSamples = [];
let pressTimes = [];
let debounceMs = 30;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  simulateButton = createButton('Simulate one press');
  simulateButton.position(10, drawHeight + 5);
  simulateButton.mousePressed(generatePress);
  simulateButton.parent(document.querySelector('main'));

  showBounceCheckbox = createCheckbox(' Show bounce count', false);
  showBounceCheckbox.position(160, drawHeight + 8);
  showBounceCheckbox.parent(document.querySelector('main'));

  delaySlider = createSlider(0, 60, 30, 1);
  delaySlider.position(sliderLeftMargin, drawHeight + 45);
  delaySlider.size(canvasWidth - sliderLeftMargin - margin);
  delaySlider.parent(document.querySelector('main'));

  // Populate on load so the charts demonstrate the concept before any click.
  generatePress();

  describe('Two stacked strip charts on a shared millisecond timescale: a noisy ' +
    'raw switch signal with several bounces, and the debounced result, with a ' +
    'counter showing how many logical presses were detected.', LABEL);
}

function draw() {
  updateCanvasSize();
  const newDelay = delaySlider.value();
  if (newDelay !== debounceMs) {
    debounceMs = newDelay;
    applyDebounce();
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawRawChart();
  drawDebouncedChart();
  drawTimeAxis();
  drawReadouts();
  drawControlLabels();
}

// A press that bounces: rises at t=0, then flips an even number of times
// inside the bounce window so it always settles pressed.
function generatePress() {
  const flips = random([2, 4, 6]);
  const times = [];
  for (let i = 0; i < flips; i++) {
    times.push(random(0.5, BOUNCE_WINDOW_MS));
  }
  times.sort((a, b) => a - b);

  rawEdges = [{ t: 0, s: 1 }];
  let state = 1;
  for (const t of times) {
    state = state === 1 ? 0 : 1;
    rawEdges.push({ t: t, s: state });
  }
  applyDebounce();
}

function rawAt(t) {
  let s = 0;
  for (const e of rawEdges) {
    if (e.t <= t) s = e.s; else break;
  }
  return s;
}

// Classic "wait for the level to hold steady" debounce. A candidate level must
// persist for the full delay before it is accepted as the stable level.
function applyDebounce() {
  debouncedSamples = [];
  pressTimes = [];

  let stable = 0;
  let candidate = 0;
  let candidateSince = 0;

  for (let t = 0; t <= WINDOW_MS; t += SAMPLE_STEP) {
    const r = rawAt(t);
    if (r !== candidate) {
      candidate = r;
      candidateSince = t;
    } else if (candidate !== stable && (t - candidateSince) >= debounceMs) {
      stable = candidate;
      if (stable === 1) pressTimes.push(t);
    }
    debouncedSamples.push(stable);
  }
}

function chartGeometry(topY) {
  const left = 118;
  const right = canvasWidth - 30;
  return { left: left, right: right, highY: topY, lowY: topY + 86 };
}

function timeToX(t, g) {
  return map(t, 0, WINDOW_MS, g.left, g.right);
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Switch Bounce and Debounce', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawChartFrame(g, label) {
  if (g.right <= g.left) return;
  stroke('lightgray');
  strokeWeight(1);
  line(g.left, g.highY, g.right, g.highY);
  line(g.left, g.lowY, g.right, g.lowY);

  noStroke();
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(14);
  text('pressed', g.left - 8, g.highY);
  text('released', g.left - 8, g.lowY);

  textAlign(LEFT, BOTTOM);
  textSize(15);
  textStyle(BOLD);
  text(label, g.left, g.highY - 10);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawRawChart() {
  const g = chartGeometry(72);
  drawChartFrame(g, 'Raw signal');
  if (g.right <= g.left) return;

  // Shade the bounce window so students can see how brief the chaos is.
  noStroke();
  fill(255, 228, 225, 180);
  rect(timeToX(0, g), g.highY - 6, timeToX(BOUNCE_WINDOW_MS, g) - timeToX(0, g),
       g.lowY - g.highY + 12);

  stroke('darkblue');
  strokeWeight(3);
  noFill();
  let prevX = timeToX(0, g);
  let prevY = g.lowY;
  for (const e of rawEdges) {
    const x = timeToX(e.t, g);
    const y = e.s === 1 ? g.highY : g.lowY;
    line(prevX, prevY, x, prevY);
    line(x, prevY, x, y);
    prevX = x;
    prevY = y;
  }
  line(prevX, prevY, g.right, prevY);
}

function drawDebouncedChart() {
  const g = chartGeometry(218);
  drawChartFrame(g, 'Debounced signal');
  if (g.right <= g.left) return;

  stroke('darkgreen');
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < debouncedSamples.length; i++) {
    const t = i * SAMPLE_STEP;
    const x = timeToX(t, g);
    const y = debouncedSamples[i] === 1 ? g.highY : g.lowY;
    vertex(x, y);
  }
  endShape();

  // Vertical marker at each detected logical press.
  for (const t of pressTimes) {
    const x = timeToX(t, g);
    stroke('crimson');
    strokeWeight(2);
    line(x, g.highY - 14, x, g.lowY + 10);
    noStroke();
    fill('crimson');
    textSize(13);
    textAlign(CENTER, BOTTOM);
    text('press', x, g.highY - 16);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTimeAxis() {
  const g = chartGeometry(218);
  if (g.right <= g.left) return;
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, TOP);
  for (let t = 0; t <= WINDOW_MS; t += 20) {
    text(t + ' ms', timeToX(t, g), g.lowY + 8);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadouts() {
  const count = pressTimes.length;
  noStroke();
  textSize(18);
  textAlign(LEFT, CENTER);
  fill(count === 1 ? 'darkgreen' : 'crimson');
  text('Logical presses detected: ' + count, 30, 355);

  textSize(14);
  fill('dimgray');
  textAlign(RIGHT, CENTER);
  if (showBounceCheckbox.checked()) {
    const rawTransitions = rawEdges.length;
    text(rawTransitions + ' raw transitions filtered down to ' + count + ' event' +
         (count === 1 ? '' : 's'), canvasWidth - 30, 355);
  } else if (count !== 1) {
    text('One press should produce exactly one event.', canvasWidth - 30, 355);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Debounce delay: ' + debounceMs + ' ms', 10, drawHeight + 55);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  delaySlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
