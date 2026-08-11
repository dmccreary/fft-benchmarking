// Cycle Budget Calculator MicroSim
// CANVAS_HEIGHT: 480
// Students calculate the CPU-cycle budget available for a real-time task from
// clock speed and a deadline, then watch that budget get consumed by a sample
// workload. Defaults are deliberately over budget.

let canvasWidth = 400;
let drawHeight = 330;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

// Each quantity is drawn in the color of the slider that controls it.
const CLOCK_COLOR = 'mediumblue';
const DEADLINE_COLOR = 'darkgreen';
const WORKLOAD_COLOR = 'darkorange';
const OVER_COLOR = 'crimson';

let clockSlider;
let deadlineSlider;
let workloadSlider;
let showFormulaCheckbox;

let clockMHz = 150;
let deadlineMs = 40;
let workloadCycles = 8000000;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  clockSlider = createSlider(1, 200, 150, 1);
  clockSlider.position(sliderLeftMargin, drawHeight + 5);
  clockSlider.parent(document.querySelector('main'));

  deadlineSlider = createSlider(5, 100, 40, 1);
  deadlineSlider.position(sliderLeftMargin, drawHeight + 40);
  deadlineSlider.parent(document.querySelector('main'));

  workloadSlider = createSlider(100000, 20000000, 8000000, 100000);
  workloadSlider.position(sliderLeftMargin, drawHeight + 75);
  workloadSlider.parent(document.querySelector('main'));

  showFormulaCheckbox = createCheckbox(' Show formula', false);
  showFormulaCheckbox.position(10, drawHeight + 112);
  showFormulaCheckbox.parent(document.querySelector('main'));

  resizeSliders();

  describe('A cycle budget calculator showing clock speed times a real-time ' +
    'deadline equals available CPU cycles, with a capacity bar comparing a ' +
    'sample workload against that budget.', LABEL);
}

function draw() {
  updateCanvasSize();
  clockMHz = clockSlider.value();
  deadlineMs = deadlineSlider.value();
  workloadCycles = workloadSlider.value();

  const budget = clockMHz * 1000000 * (deadlineMs / 1000);
  const headroom = budget - workloadCycles;
  const overBudget = headroom < 0;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawEquation(budget);
  if (showFormulaCheckbox.checked()) drawFormula();
  drawCapacityBar(budget, overBudget);
  drawHeadroomReadout(budget, headroom, overBudget);
  drawControlLabels(budget);
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Cycle Budget Calculator', canvasWidth / 2, 10);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Draws "150,000,000 cycles/sec x 0.040 sec = 6,000,000 cycles" as colored
// segments, auto-shrinking the type so it always fits the container width.
function drawEquation(budget) {
  const parts = [
    { s: fmt(clockMHz * 1000000), c: CLOCK_COLOR },
    { s: ' cycles/sec  x  ', c: 'black' },
    { s: (deadlineMs / 1000).toFixed(3), c: DEADLINE_COLOR },
    { s: ' sec  =  ', c: 'black' },
    { s: fmt(budget), c: 'black' },
    { s: ' cycles', c: 'black' }
  ];

  let size = 22;
  noStroke();
  while (size > 11) {
    textSize(size);
    let w = 0;
    for (const p of parts) w += textWidth(p.s);
    if (w <= canvasWidth - 2 * margin) break;
    size -= 1;
  }

  textSize(size);
  let total = 0;
  for (const p of parts) total += textWidth(p.s);
  let x = (canvasWidth - total) / 2;
  textAlign(LEFT, CENTER);
  for (const p of parts) {
    fill(p.c);
    text(p.s, x, 62);
    x += textWidth(p.s);
  }
  textSize(defaultTextSize);
}

function drawFormula() {
  noStroke();
  fill('dimgray');
  textSize(15);
  textAlign(CENTER, CENTER);
  text('cycle budget = clock speed (Hz)  x  deadline (seconds)',
       canvasWidth / 2, 95);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCapacityBar(budget, overBudget) {
  const barX = margin;
  const barY = 135;
  const barW = canvasWidth - 2 * margin;
  const barH = 46;
  if (barW < 60) return;

  // Empty capacity (headroom) shown as the gray remainder.
  noStroke();
  fill('gainsboro');
  rect(barX, barY, barW, barH, 6);

  const fraction = budget > 0 ? Math.min(workloadCycles / budget, 1) : 1;
  fill(overBudget ? OVER_COLOR : WORKLOAD_COLOR);
  rect(barX, barY, barW * fraction, barH, 6);

  noFill();
  stroke('gray');
  strokeWeight(1);
  rect(barX, barY, barW, barH, 6);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('0', barX, barY + barH + 5);
  textAlign(RIGHT, TOP);
  text(fmt(budget) + ' cycle budget', barX + barW, barY + barH + 5);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawHeadroomReadout(budget, headroom, overBudget) {
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  if (overBudget) {
    fill(OVER_COLOR);
    text('OVER BUDGET by ' + fmt(-headroom) + ' cycles', canvasWidth / 2, 225);
  } else {
    fill('darkgreen');
    const pct = budget > 0 ? (headroom / budget) * 100 : 0;
    text('Headroom: ' + fmt(headroom) + ' cycles (' + pct.toFixed(1) + '% of budget)',
         canvasWidth / 2, 225);
  }

  // Bar key. The gray entry is suppressed when the bar is fully consumed,
  // since there is no gray on screen to explain.
  textSize(15);
  fill(overBudget ? OVER_COLOR : WORKLOAD_COLOR);
  if (overBudget) {
    textAlign(CENTER, CENTER);
    text('workload: ' + fmt(workloadCycles) + ' cycles', canvasWidth / 2, 258);
  } else {
    textAlign(RIGHT, CENTER);
    text('workload: ' + fmt(workloadCycles) + ' cycles', canvasWidth / 2 - 12, 258);
    fill('gray');
    textAlign(LEFT, CENTER);
    text('gray = unused headroom', canvasWidth / 2 + 12, 258);
  }

  fill('dimgray');
  textAlign(CENTER, CENTER);
  textSize(15);
  text('A tighter deadline or a slower clock shrinks the budget; the workload does not change.',
       canvasWidth / 2, 292);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill(CLOCK_COLOR);
  text('Clock speed: ' + clockMHz + ' MHz', 10, drawHeight + 15);
  fill(DEADLINE_COLOR);
  text('Deadline: ' + deadlineMs + ' ms', 10, drawHeight + 50);
  fill(WORKLOAD_COLOR);
  text('Workload: ' + fmt(workloadCycles) + ' cycles', 10, drawHeight + 85);
}

function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

function resizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  const safe = Math.max(60, w);
  clockSlider.size(safe);
  deadlineSlider.size(safe);
  workloadSlider.size(safe);
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
