// Blink Timing Explorer MicroSim
// CANVAS_HEIGHT: 480
// Simulates `while True: led.toggle(); sleep(delay)` on a Raspberry Pi Pico 2
// and plots the LED pin voltage as a scrolling square wave so students can
// connect the sleep() argument to an observable blink rate.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Controls
let delaySlider;
let runButton;
let toggleOnceButton;
let showCodeCheckbox;

// Simulation state
let isRunning = false;      // MicroSim standard: start paused
let pinState = false;       // false = logic low (0V), true = logic high (3.3V)
// Simulated time starts one full window in so the opening flat trace spans the
// whole chart instead of collapsing to a point at the right edge.
let simTime = 4000;
let lastToggleTime = 4000;  // simTime of the most recent toggle
let events = [];            // {time, state} transitions, oldest first
let delaySeconds = 0.5;

// The strip chart shows this many milliseconds of history at once.
const WINDOW_MS = 4000;
// A manual "Toggle Once" press advances the chart by this much so the new
// edge is visible instead of being pinned to the right border.
const MANUAL_STEP_MS = 250;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  runButton = createButton('Run');
  runButton.position(10, drawHeight + 5);
  runButton.mousePressed(toggleRunning);
  runButton.parent(document.querySelector('main'));

  toggleOnceButton = createButton('Toggle Once');
  toggleOnceButton.position(70, drawHeight + 5);
  toggleOnceButton.mousePressed(manualToggle);
  toggleOnceButton.parent(document.querySelector('main'));

  showCodeCheckbox = createCheckbox(' Show code', false);
  showCodeCheckbox.position(190, drawHeight + 7);
  showCodeCheckbox.parent(document.querySelector('main'));

  delaySlider = createSlider(0.05, 2.0, 0.5, 0.05);
  delaySlider.position(sliderLeftMargin, drawHeight + 45);
  delaySlider.size(canvasWidth - sliderLeftMargin - margin);
  delaySlider.parent(document.querySelector('main'));

  events.push({ time: 0, state: pinState });

  describe('A scrolling voltage-versus-time strip chart of a blinking LED pin, ' +
    'with a sleep-delay slider, run/pause and single-step buttons, and a live ' +
    'readout of blinks per second.', LABEL);
}

function draw() {
  updateCanvasSize();
  delaySeconds = delaySlider.value();

  // Background regions
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  advanceSimulation();

  drawTitle();
  drawLedIndicator();
  drawStripChart();
  drawReadouts();
  if (showCodeCheckbox.checked()) {
    drawCodePanel();
  }
  drawControlLabels();
}

// Advance simulated time and flip the pin whenever the sleep interval elapses.
// Uses deltaTime (real milliseconds) so the wave speed matches wall-clock
// seconds rather than the frame counter.
function advanceSimulation() {
  if (!isRunning) return;
  simTime += deltaTime;
  const periodMs = delaySeconds * 1000;
  while (simTime - lastToggleTime >= periodMs) {
    lastToggleTime += periodMs;
    flipPin(lastToggleTime);
  }
  purgeOldEvents();
}

function flipPin(atTime) {
  pinState = !pinState;
  events.push({ time: atTime, state: pinState });
}

function purgeOldEvents() {
  const cutoff = simTime - WINDOW_MS;
  // Keep one event before the window so the leading segment can be drawn.
  while (events.length > 1 && events[1].time < cutoff) {
    events.shift();
  }
}

function drawTitle() {
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Blink Timing Explorer', canvasWidth / 2, 10);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawLedIndicator() {
  const cx = canvasWidth - 55;
  const cy = 62;
  stroke('gray');
  strokeWeight(2);
  fill(pinState ? 'gold' : 'dimgray');
  circle(cx, cy, 34);
  noStroke();
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(14);
  text('Onboard LED', cx - 25, cy);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawStripChart() {
  const chartLeft = 130;
  const chartRight = canvasWidth - 30;
  const highY = 100;
  const lowY = 285;

  if (chartRight <= chartLeft) return;

  // Voltage gridlines
  stroke('lightgray');
  strokeWeight(1);
  line(chartLeft, highY, chartRight, highY);
  line(chartLeft, lowY, chartRight, lowY);

  noStroke();
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(defaultTextSize);
  text('3.3V (HIGH)', chartLeft - 8, highY);
  text('0V (LOW)', chartLeft - 8, lowY);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // Square wave: map each transition time onto the visible window.
  const windowStart = simTime - WINDOW_MS;
  const timeToX = (t) => map(constrain(t, windowStart, simTime),
                             windowStart, simTime, chartLeft, chartRight);

  stroke('darkblue');
  strokeWeight(3);
  noFill();
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const segStart = timeToX(ev.time);
    const segEnd = i + 1 < events.length ? timeToX(events[i + 1].time) : chartRight;
    const y = ev.state ? highY : lowY;
    line(segStart, y, segEnd, y);
    // Vertical edge into the next segment
    if (i + 1 < events.length) {
      const nextY = events[i + 1].state ? highY : lowY;
      line(segEnd, y, segEnd, nextY);
    }
  }

  // Time axis label
  noStroke();
  fill('dimgray');
  textSize(15);
  textAlign(CENTER, TOP);
  text('4 seconds of history  →  now', (chartLeft + chartRight) / 2, lowY + 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadouts() {
  // Each full blink cycle is two toggles (one high, one low).
  const blinksPerSecond = 1 / (2 * delaySeconds);
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Blinks per second: ' + blinksPerSecond.toFixed(2), 30, 313);
  text('Delay per toggle: ' + (delaySeconds * 1000).toFixed(0) + ' ms', 30, 336);
}

function drawCodePanel() {
  const panelX = 30;
  const panelY = 355;
  const panelW = canvasWidth - 60;
  const panelH = 40;
  if (panelW < 100) return;

  stroke('silver');
  fill(255, 255, 255, 235);
  rect(panelX, panelY, panelW, panelH, 8);

  noStroke();
  fill('darkslategray');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('while True:', panelX + 12, panelY + 12);
  text('    led.toggle();  sleep(' + delaySeconds.toFixed(2) + ')',
       panelX + 12, panelY + 29);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Sleep delay: ' + delaySeconds.toFixed(2) + ' s', 10, drawHeight + 55);
}

function toggleRunning() {
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run');
  // Resync so the first automatic toggle waits a full delay after resuming.
  if (isRunning) lastToggleTime = simTime;
}

// Single-step: pause automatic running, advance the chart a little so the new
// edge is visible, then flip the pin exactly once.
function manualToggle() {
  if (isRunning) toggleRunning();
  simTime += MANUAL_STEP_MS;
  lastToggleTime = simTime;
  flipPin(simTime);
  purgeOldEvents();
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
