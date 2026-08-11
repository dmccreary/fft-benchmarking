// In-Phase and Quadrature Explorer MicroSim
// CANVAS_HEIGHT: 490
// Changing a signal's phase moves the I and Q components a great deal and moves
// their combined magnitude not at all.

let canvasWidth = 400;
let drawHeight = 445;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 265;
let defaultTextSize = 16;

const FS = 8000;
const N = 128;
const SIGNAL_HZ = 500;   // exactly 8 bins at this window, so the math is exact

const I_COLOR = 'mediumblue';
const Q_COLOR = 'darkorange';
const MAG_COLOR = 'darkgreen';

let phaseSlider;
let phase = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  phaseSlider = createSlider(0, TWO_PI, 0, 0.01);
  phaseSlider.position(sliderLeftMargin, drawHeight + 12);
  phaseSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('Three bar meters showing the in-phase component, the quadrature ' +
    'component, and their combined magnitude, above a captured waveform and a ' +
    'plot of all three against phase.', LABEL);
}

// Correlate the phase-shifted signal against a sine and a cosine at the same
// frequency. Computed numerically rather than substituted analytically, so the
// invariance is demonstrated instead of asserted.
function components(ph) {
  let inPhase = 0;
  let quadrature = 0;
  for (let n = 0; n < N; n++) {
    const t = n / FS;
    const x = Math.sin(TWO_PI * SIGNAL_HZ * t + ph);
    inPhase += x * Math.sin(TWO_PI * SIGNAL_HZ * t);
    quadrature += x * Math.cos(TWO_PI * SIGNAL_HZ * t);
  }
  const scale = 2 / N;
  const i = inPhase * scale;
  const q = quadrature * scale;
  return { i: i, q: q, mag: Math.sqrt(i * i + q * q) };
}

function draw() {
  updateCanvasSize();
  phase = phaseSlider.value();
  const c = components(phase);

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawMeters(c);
  drawWaveform();
  drawPhaseResponse(c);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('In-Phase and Quadrature Components', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMeters(c) {
  const top = 44;
  const midY = 140;
  const unit = 78;              // pixels per unit of amplitude
  const slotW = Math.min(canvasWidth / 3, 240);
  const barW = Math.min(64, slotW * 0.4);

  const meters = [
    { label: 'I (in-phase)', value: c.i, color: I_COLOR, signed: true },
    { label: 'Q (quadrature)', value: c.q, color: Q_COLOR, signed: true },
    { label: 'Magnitude', value: c.mag, color: MAG_COLOR, signed: false }
  ];

  for (let k = 0; k < 3; k++) {
    const cx = (canvasWidth / 3) * k + canvasWidth / 6;
    const m = meters[k];

    // Track
    noStroke();
    fill('gainsboro');
    if (m.signed) {
      rect(cx - barW / 2, midY - unit, barW, unit * 2, 4);
    } else {
      rect(cx - barW / 2, midY - unit, barW, unit * 2, 4);
    }

    // Value
    fill(m.color);
    if (m.signed) {
      const h = m.value * unit;
      if (h >= 0) rect(cx - barW / 2, midY - h, barW, h, 3);
      else rect(cx - barW / 2, midY, barW, -h, 3);
    } else {
      const h = (m.value / 1.4) * (unit * 2);
      rect(cx - barW / 2, midY + unit - h, barW, h, 3);
    }

    // Zero / baseline
    stroke('gray');
    strokeWeight(1);
    if (m.signed) line(cx - barW / 2 - 6, midY, cx + barW / 2 + 6, midY);
    else line(cx - barW / 2 - 6, midY + unit, cx + barW / 2 + 6, midY + unit);

    noStroke();
    fill(m.color);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(m.label, cx, top);
    textStyle(NORMAL);
    textSize(17);
    text(m.value.toFixed(3), cx, midY + unit + 8);

    // Scale ends
    fill('dimgray');
    textSize(11);
    textAlign(RIGHT, CENTER);
    if (m.signed) {
      text('+1', cx - barW / 2 - 8, midY - unit);
      text('0', cx - barW / 2 - 8, midY);
      text('-1', cx - barW / 2 - 8, midY + unit);
    } else {
      text('1.4', cx - barW / 2 - 8, midY - unit);
      text('0', cx - barW / 2 - 8, midY + unit);
    }
  }

  noStroke();
  fill(MAG_COLOR);
  textSize(13);
  textAlign(CENTER, TOP);
  text('Magnitude = sqrt(I² + Q²)', (canvasWidth / 3) * 2 + canvasWidth / 6,
       midY + unit + 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawWaveform() {
  const left = 108;
  const right = canvasWidth - 25;
  const top = 268;
  const h = 66;
  const midY = top + h / 2;
  if (right <= left) return;

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('Captured signal', left - 10, midY - 9);
  textStyle(NORMAL);
  textSize(12);
  text(SIGNAL_HZ + ' Hz', left - 10, midY + 9);

  stroke('black');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = left; px <= right; px += 1) {
    const t = map(px, left, right, 0, 4 / SIGNAL_HZ);
    vertex(px, midY - Math.sin(TWO_PI * SIGNAL_HZ * t + phase) * (h / 2) * 0.8);
  }
  endShape();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// All three quantities across the whole phase range, with a marker at the
// current setting. This is where "magnitude is flat" becomes provable at a
// glance rather than something you infer by dragging.
function drawPhaseResponse(current) {
  const left = 108;
  const right = canvasWidth - 25;
  const top = 350;
  const h = 78;
  const midY = top + h / 2;
  const amp = (h / 2) * 0.86;
  if (right <= left) return;

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text('vs phase', left - 10, midY);
  textStyle(NORMAL);

  const pToX = p => map(p, 0, TWO_PI, left, right);

  const series = [
    { key: 'i', color: I_COLOR, weight: 2 },
    { key: 'q', color: Q_COLOR, weight: 2 },
    { key: 'mag', color: MAG_COLOR, weight: 3 }
  ];

  for (const s of series) {
    stroke(s.color);
    strokeWeight(s.weight);
    noFill();
    beginShape();
    for (let p = 0; p <= TWO_PI; p += 0.06) {
      vertex(pToX(p), midY - components(p)[s.key] * amp);
    }
    endShape();
  }

  // Current-phase marker
  const x = pToX(phase);
  stroke('gray');
  strokeWeight(1);
  line(x, top, x, top + h);
  noStroke();
  for (const s of series) {
    fill(s.color);
    circle(x, midY - current[s.key] * amp, 8);
  }

  fill('dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  for (const [p, lab] of [[0, '0'], [Math.PI / 2, 'π/2'], [Math.PI, 'π'],
                          [3 * Math.PI / 2, '3π/2'], [TWO_PI, '2π']]) {
    text(lab, pToX(p), top + h + 4);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Phase offset: ' + phase.toFixed(2) + ' rad (' +
       Math.round(degrees(phase)) + '°)', 10, drawHeight + 22);
}

function resizeSliders() {
  phaseSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
