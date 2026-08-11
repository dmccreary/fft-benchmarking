// Counter Wraparound Visualizer MicroSim
// CANVAS_HEIGHT: 555
// A cycle counter is a circle, not a line. Subtracting across the wrap point
// gives a negative number unless you mask — and masking works because the
// range is a power of two.

let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

// A 10-bit demo counter. Masking with 0x3FF here is the exact analogue of
// masking a 32-bit CYCCNT with 0xFFFFFFFF: it works because the range is a
// power of two, so the mask discards exactly the borrow.
const BITS = 10;
const RANGE = 1 << BITS;      // 1024
const MASK = RANGE - 1;       // 0x3FF

let startSlider, endSlider;
let startVal = 950;
let endVal = 50;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startSlider = createSlider(0, MASK, 950, 1);
  startSlider.position(sliderLeftMargin, drawHeight + 5);
  startSlider.parent(document.querySelector('main'));

  endSlider = createSlider(0, MASK, 50, 1);
  endSlider.position(sliderLeftMargin, drawHeight + 40);
  endSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A circular counter dial with draggable start and end markers, above ' +
    'two calculator panels comparing naive subtraction against masked ' +
    'subtraction.', LABEL);
}

function draw() {
  updateCanvasSize();
  startVal = startSlider.value();
  endVal = endSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawDial();
  drawPanels();
  drawControlLabels();
}

function wrapped() {
  return endVal < startVal;
}

function naive() {
  return endVal - startVal;
}

function masked() {
  return (endVal - startVal) & MASK;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Counter Wraparound', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('A ' + BITS + '-bit demo counter (0 to ' + MASK +
       ') standing in for the 32-bit CYCCNT', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function valueToAngle(v) {
  return -HALF_PI + (v / RANGE) * TWO_PI;
}

function drawDial() {
  const cx = canvasWidth / 2;
  const cy = 178;
  const r = 82;

  // The elapsed span, drawn clockwise from start to end
  noFill();
  stroke('mediumseagreen');
  strokeWeight(14);
  const a0 = valueToAngle(startVal);
  const a1 = a0 + (masked() / RANGE) * TWO_PI;
  arc(cx, cy, r * 2, r * 2, a0, a1);

  noFill();
  stroke('gray');
  strokeWeight(2);
  circle(cx, cy, r * 2);

  // Wrap point at the top
  stroke('crimson');
  strokeWeight(3);
  line(cx, cy - r - 12, cx, cy - r + 12);
  noStroke();
  fill('crimson');
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('0', cx - 10, cy - r - 18);

  // Quarter labels
  fill('dimgray');
  textSize(11);
  for (const v of [RANGE / 4, RANGE / 2, (3 * RANGE) / 4]) {
    const a = valueToAngle(v);
    textAlign(CENTER, CENTER);
    text(v, cx + Math.cos(a) * (r + 16), cy + Math.sin(a) * (r + 16));
  }

  drawMarker(cx, cy, r, startVal, 'mediumblue', 'start');
  drawMarker(cx, cy, r, endVal, 'darkorange', 'end');

  noStroke();
  fill(wrapped() ? 'crimson' : 'darkgreen');
  textSize(13);
  textAlign(CENTER, CENTER);
  text(wrapped() ? 'wrapped past 0' : 'no wrap', cx, cy - 8);
  fill('black');
  textSize(15);
  textStyle(BOLD);
  text(masked() + ' cycles elapsed', cx, cy + 14);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMarker(cx, cy, r, v, colorName, label) {
  const a = valueToAngle(v);
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r;
  noStroke();
  fill(colorName);
  circle(x, y, 15);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(label + ' ' + v, cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40));
}

function drawPanels() {
  const top = 290;
  const h = 146;
  const gap = 20;
  const w = (canvasWidth - 2 * margin - gap) / 2;
  if (w < 150) return;

  const panels = [
    {
      x: margin, title: 'Naive subtraction', expr: 'end − start',
      value: naive(), ok: naive() >= 0,
      note: naive() >= 0
        ? 'Correct here, because no wrap happened. It is right by luck, not by design.'
        : 'Negative — meaningless as an elapsed time. A real program would report a ' +
          'nonsense duration or, in unsigned arithmetic, an enormous one.'
    },
    {
      x: margin + w + gap, title: 'Masked subtraction',
      expr: '(end − start) & 0x' + MASK.toString(16).toUpperCase(),
      value: masked(), ok: true,
      note: 'Always correct. The mask discards the borrow, which is exactly the ' +
            'one wrap the counter performed.'
    }
  ];

  for (const p of panels) {
    stroke(p.ok ? 'darkgreen' : 'crimson');
    strokeWeight(2);
    fill(p.ok ? 'honeydew' : 'mistyrose');
    rect(p.x, top, w, h, 8);

    noStroke();
    textAlign(LEFT, TOP);
    fill('black');
    textStyle(BOLD);
    textSize(15);
    text(p.title, p.x + 12, top + 10);
    textStyle(NORMAL);
    textSize(13);
    fill('dimgray');
    text(p.expr, p.x + 12, top + 32);
    text('= ' + endVal + ' − ' + startVal, p.x + 12, top + 50);

    textSize(24);
    textStyle(BOLD);
    fill(p.ok ? 'darkgreen' : 'crimson');
    text('= ' + p.value, p.x + 12, top + 70);
    textStyle(NORMAL);

    textSize(12);
    fill('black');
    text(p.note, p.x + 12, top + 102, w - 24, 44);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill('mediumblue');
  text('Start value: ' + startVal, 10, drawHeight + 15);
  fill('darkorange');
  text('End value: ' + endVal, 10, drawHeight + 50);
  fill('dimgray');
  textSize(13);
  text('Masking works because the counter range is a power of two — the same ' +
       'reason & 0xFFFFFFFF works on a 32-bit CYCCNT.', 10, drawHeight + 88);
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  startSlider.size(w);
  endSlider.size(w);
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
