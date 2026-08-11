// Frequency To Musical Note Calculator MicroSim
// CANVAS_HEIGHT: 385
// Hertz to note name, anchored at A4 = 440 Hz, with the cents error that tells
// you whether a detected peak is actually in tune.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 210;
let defaultTextSize = 16;

// Piano key numbering: key 1 = A0, key 49 = A4 = 440 Hz.
const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const BLACK_OFFSETS = [1, 4, 6, 9, 11];   // positions within the A-based cycle
const FIRST_KEY = 28;                     // C3
const LAST_KEY = 63;                      // B5

let freqSlider;
let frequency = 440;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  freqSlider = createSlider(80, 2000, 440, 1);
  freqSlider.position(sliderLeftMargin, drawHeight + 12);
  freqSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A three-octave piano keyboard strip with the key nearest the ' +
    'selected frequency highlighted, plus a readout of the note name, octave, ' +
    'and cents error.', LABEL);
}

function keyNumber(f) {
  return Math.round(12 * Math.log2(f / 440) + 49);
}

function exactFrequency(k) {
  return 440 * Math.pow(2, (k - 49) / 12);
}

function noteName(k) {
  return NOTE_NAMES[(k - 1) % 12];
}

function octaveOf(k) {
  return Math.floor((k + 8) / 12);
}

function isBlack(k) {
  return BLACK_OFFSETS.includes((k - 1) % 12);
}

function centsOff(f, k) {
  return 1200 * Math.log2(f / exactFrequency(k));
}

function draw() {
  updateCanvasSize();
  frequency = freqSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawKeyboard();
  drawReadout();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Frequency to Musical Note', canvasWidth / 2, 8);
  textSize(13);
  fill('dimgray');
  text('Anchored at A4 = 440 Hz   •   key = round(12·log₂(f/440) + 49)',
       canvasWidth / 2, 34);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawKeyboard() {
  const left = 30;
  const right = canvasWidth - 30;
  const top = 62;
  const h = 118;
  if (right <= left) return;

  const matched = keyNumber(frequency);
  let whiteCount = 0;
  for (let k = FIRST_KEY; k <= LAST_KEY; k++) if (!isBlack(k)) whiteCount++;
  const ww = (right - left) / whiteCount;

  // White keys first, then black keys on top.
  let wi = 0;
  const whiteX = {};
  for (let k = FIRST_KEY; k <= LAST_KEY; k++) {
    if (isBlack(k)) continue;
    const x = left + wi * ww;
    whiteX[k] = x;
    stroke('gray');
    strokeWeight(1);
    fill(k === matched ? 'gold' : 'white');
    rect(x, top, ww, h);

    if (noteName(k) === 'C' || k === matched) {
      noStroke();
      fill(k === matched ? 'black' : 'dimgray');
      textSize(Math.min(11, ww * 0.45));
      textAlign(CENTER, BOTTOM);
      text(noteName(k) + octaveOf(k), x + ww / 2, top + h - 5);
    }
    wi++;
  }

  wi = 0;
  for (let k = FIRST_KEY; k <= LAST_KEY; k++) {
    if (!isBlack(k)) { wi++; continue; }
    // A black key sits over the boundary just left of the next white key.
    const x = left + wi * ww - ww * 0.3;
    stroke('black');
    strokeWeight(1);
    fill(k === matched ? 'gold' : 'black');
    rect(x, top, ww * 0.6, h * 0.62);
    if (k === matched) {
      noStroke();
      fill('black');
      textSize(10);
      textAlign(CENTER, TOP);
      text(noteName(k) + octaveOf(k), x + ww * 0.3, top + h * 0.62 + 3);
    }
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('C3', left, top + h + 5);
  textAlign(RIGHT, TOP);
  text('B5', right, top + h + 5);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 208;
  const h = 112;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const k = keyNumber(frequency);
  const exact = exactFrequency(k);
  const cents = centsOff(frequency, k);
  const inRange = k >= FIRST_KEY && k <= LAST_KEY;
  const inTune = Math.abs(cents) < 5;

  noStroke();
  textAlign(LEFT, TOP);

  fill('black');
  textSize(18);
  textStyle(BOLD);
  text(frequency + ' Hz  →  ' + noteName(k) + octaveOf(k), margin + 14, y + 10);
  textStyle(NORMAL);

  textSize(14);
  fill('dimgray');
  text('Exact frequency of ' + noteName(k) + octaveOf(k) + ': ' +
       exact.toFixed(2) + ' Hz', margin + 14, y + 40);

  textSize(15);
  textStyle(BOLD);
  fill(inTune ? 'darkgreen' : Math.abs(cents) < 25 ? 'darkorange' : 'crimson');
  text((cents >= 0 ? '+' : '') + cents.toFixed(1) + ' cents  ' +
       (inTune ? '(in tune)' : cents > 0 ? '(sharp)' : '(flat)'),
       margin + 14, y + 62);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(12);
  text(inRange
        ? '100 cents is one semitone. A trained ear notices about 5 cents; a tuner ' +
          'needs to resolve better than that.'
        : 'This note is outside the three octaves drawn above, but the ' +
          'calculation is unchanged.',
       margin + 14, y + 88, canvasWidth - 2 * margin - 28, 20);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Frequency: ' + frequency + ' Hz', 10, drawHeight + 22);
}

function resizeSliders() {
  freqSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
