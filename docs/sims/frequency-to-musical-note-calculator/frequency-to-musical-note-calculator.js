// Frequency To Musical Note Calculator MicroSim
// CANVAS_HEIGHT: 415
// Hertz to note name, anchored at A4 = 440 Hz, with the cents error that tells
// you whether a detected peak is actually in tune. A sine oscillator lets you
// hear the frequency you are naming.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 75;
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

// The slider spans exactly the keys that are drawn, so the highlight can never
// run off either end of the keyboard. (exactFrequency is hoisted.)
const MIN_FREQ = Math.round(exactFrequency(FIRST_KEY) * 10) / 10;   // C3, 130.8 Hz
const MAX_FREQ = Math.round(exactFrequency(LAST_KEY) * 10) / 10;    // B5, 987.8 Hz

// Keyboard geometry, shared by the drawing code and the click hit test.
const KEY_LEFT = 30;
const KEY_TOP = 62;
const KEY_H = 118;
const BLACK_H_FRAC = 0.62;
const BLACK_W_FRAC = 0.6;

let freqSlider;
let playToneCheckbox;
let frequency = 440;

// Sine oscillator, built on demand each time the tone is switched on.
let osc = null;
let toneOn = false;
const TONE_AMP = 0.25;
const FADE = 0.08;   // seconds; long enough to avoid a click, short enough to feel instant

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Tenth-of-a-Hz steps so a clicked key lands on its exact frequency, not on
  // the nearest whole Hertz a semitone grid rarely falls on.
  freqSlider = createSlider(MIN_FREQ, MAX_FREQ, 440, 0.1);
  freqSlider.position(sliderLeftMargin, drawHeight + 12);
  freqSlider.parent(document.querySelector('main'));
  freqSlider.input(updateToneFrequency);

  playToneCheckbox = createCheckbox(' Play tone', false);
  playToneCheckbox.position(8, drawHeight + 42);
  playToneCheckbox.parent(document.querySelector('main'));
  playToneCheckbox.changed(toggleTone);
  playToneCheckbox.style('font-family', 'Arial, Helvetica, sans-serif');
  playToneCheckbox.style('font-size', '15px');

  // A hidden tab throttles draw() to a standstill but leaves the audio thread
  // running, so silence the tone rather than strand it playing out of sight.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) switchToneOff();
  });

  resizeSliders();

  describe('A three-octave piano keyboard strip from C3 to B5 with the key ' +
    'nearest the selected frequency highlighted, plus a readout of the note ' +
    'name, octave, and cents error. Clicking a key jumps to that note and ' +
    'sounds it, clicking away from the keyboard stops the sound, and a ' +
    'checkbox plays a sine tone at the selected frequency.',
    LABEL);
}

function toggleTone() {
  toneOn = playToneCheckbox.checked();
  if (toneOn) startTone(); else stopTone();
}

// Silence the tone and leave the checkbox showing the truth.
function switchToneOff() {
  if (!toneOn) return;
  playToneCheckbox.checked(false);
  toggleTone();
}

function startTone() {
  // Browsers only start audio from a user gesture; this click is one.
  userStartAudio();
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();
  osc.freq(frequency);
  osc.amp(TONE_AMP, FADE);   // ramp up so the attack does not click
}

function stopTone() {
  if (!osc) return;
  // Fade out, then tear the node down. Ramping the gain alone would leave the
  // oscillator running, which is exactly how a tone gets stuck on.
  const dying = osc;
  osc = null;
  dying.amp(0, FADE);
  setTimeout(function () { dying.dispose(); }, (FADE + 0.05) * 1000);
}

function updateToneFrequency() {
  // Glide to the new pitch instead of jumping, which would click. Driven by the
  // slider's own event so it tracks even when draw() is being throttled.
  if (toneOn && osc) osc.freq(freqSlider.value(), 0.02);
}

// Where every drawn key sits, in draw order: white keys first, black keys after
// so they land on top. The hit test walks the same list backwards.
function keyLayout() {
  const right = canvasWidth - 30;
  if (right <= KEY_LEFT) return [];

  let whiteCount = 0;
  for (let k = FIRST_KEY; k <= LAST_KEY; k++) if (!isBlack(k)) whiteCount++;
  const ww = (right - KEY_LEFT) / whiteCount;

  const whites = [];
  const blacks = [];
  let wi = 0;
  for (let k = FIRST_KEY; k <= LAST_KEY; k++) {
    if (isBlack(k)) {
      // A black key straddles the boundary just left of the next white key.
      blacks.push({ k: k, black: true, x: KEY_LEFT + wi * ww - ww * 0.3,
                    y: KEY_TOP, w: ww * BLACK_W_FRAC, h: KEY_H * BLACK_H_FRAC });
    } else {
      whites.push({ k: k, black: false, x: KEY_LEFT + wi * ww,
                    y: KEY_TOP, w: ww, h: KEY_H });
      wi++;
    }
  }
  return whites.concat(blacks);
}

// Walks the layout backwards, so the black keys drawn on top win the overlap.
function hitTest(keys, x, y) {
  for (let i = keys.length - 1; i >= 0; i--) {
    const r = keys[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r.k;
  }
  return null;
}

function keyAt(x, y) {
  return hitTest(keyLayout(), x, y);
}

function mousePressed(event) {
  // p5 listens on the whole window, so this also fires for the slider and the
  // checkbox that sit on top of the canvas. Those drive the tone themselves and
  // must not be treated as clicking "off the keyboard".
  if (event && isOnControl(event.target)) return;

  const k = keyAt(mouseX, mouseY);
  if (k !== null) {
    playKey(k);
  } else {
    switchToneOff();   // clicking anywhere else is the quick way to stop it
  }
}

function isOnControl(target) {
  return freqSlider.elt.contains(target) || playToneCheckbox.elt.contains(target);
}

// Clicking a key jumps to that note's exact frequency and sounds it. The click
// is a user gesture, so it is allowed to start audio if the tone was off.
function playKey(k) {
  frequency = Math.round(exactFrequency(k) * 10) / 10;
  freqSlider.value(frequency);
  if (toneOn) {
    updateToneFrequency();
  } else {
    playToneCheckbox.checked(true);
    toggleTone();
  }
}

function formatHz(f) {
  return Number.isInteger(f) ? f.toString() : f.toFixed(1);
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
  // Round away the float dust a fractional slider step leaves behind.
  frequency = Math.round(freqSlider.value() * 10) / 10;

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
  const keys = keyLayout();
  if (keys.length === 0) return;

  const right = canvasWidth - 30;
  const matched = keyNumber(frequency);
  const hovered = hitTest(keys, mouseX, mouseY);
  cursor(hovered === null ? ARROW : HAND);

  // keyLayout() returns whites first, so blacks naturally land on top.
  for (const r of keys) {
    if (r.black) {
      stroke('black');
      strokeWeight(1);
      fill(r.k === matched ? 'gold' : r.k === hovered ? 'dimgray' : 'black');
      rect(r.x, r.y, r.w, r.h);
      if (r.k === matched) {
        noStroke();
        fill('black');
        textSize(10);
        textAlign(CENTER, TOP);
        text(noteName(r.k) + octaveOf(r.k), r.x + r.w / 2, r.y + r.h + 3);
      }
    } else {
      stroke('gray');
      strokeWeight(1);
      fill(r.k === matched ? 'gold' : r.k === hovered ? 'lemonchiffon' : 'white');
      rect(r.x, r.y, r.w, r.h);
      if (noteName(r.k) === 'C' || r.k === matched) {
        noStroke();
        fill(r.k === matched ? 'black' : 'dimgray');
        textSize(Math.min(11, r.w * 0.45));
        textAlign(CENTER, BOTTOM);
        text(noteName(r.k) + octaveOf(r.k), r.x + r.w / 2, r.y + r.h - 5);
      }
    }
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('C3', KEY_LEFT, KEY_TOP + KEY_H + 5);
  textAlign(RIGHT, TOP);
  text('B5', right, KEY_TOP + KEY_H + 5);
  textAlign(CENTER, TOP);
  fill('steelblue');
  text('click a key to hear it, anywhere else to stop',
       canvasWidth / 2, KEY_TOP + KEY_H + 5);
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
  const inTune = Math.abs(cents) < 5;

  noStroke();
  textAlign(LEFT, TOP);

  fill('black');
  textSize(18);
  textStyle(BOLD);
  text(formatHz(frequency) + ' Hz  →  ' + noteName(k) + octaveOf(k),
       margin + 14, y + 10);
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
  text('100 cents is one semitone. A trained ear notices about 5 cents; a tuner ' +
       'needs to resolve better than that.',
       margin + 14, y + 88, canvasWidth - 2 * margin - 28, 20);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Frequency: ' + formatHz(frequency) + ' Hz', 10, drawHeight + 22);

  // Hint sits to the right of the "Play tone" checkbox DOM element.
  fill('dimgray');
  textSize(13);
  const k = keyNumber(frequency);
  text(toneOn
        ? '♪ pure sine at ' + formatHz(frequency) + ' Hz  (nearest note ' +
          noteName(k) + octaveOf(k) + ')'
        : 'pure sine wave — check your volume first',
       105, drawHeight + 53);
  textSize(defaultTextSize);
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
