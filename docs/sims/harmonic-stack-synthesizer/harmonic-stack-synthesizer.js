// Harmonic Stack Synthesizer MicroSim
// CANVAS_HEIGHT: 585
// Mixing overtones above a fixed 440 Hz fundamental changes the waveform's
// shape (timbre) while leaving its repetition rate (pitch) untouched.

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 285;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

const FUNDAMENTAL_HZ = 440;
const CYCLES_SHOWN = 3;
const WINDOW_S = CYCLES_SHOWN / FUNDAMENTAL_HZ;   // seconds displayed

const HARMONIC_NAMES = ['1st', '2nd', '3rd', '4th', '5th'];
const HARMONIC_COLORS = ['mediumblue', 'seagreen', 'darkorange',
                         'mediumvioletred', 'saddlebrown'];

const PRESETS = {
  'Flute':     [100, 20, 5, 0, 0],
  'Violin':    [100, 75, 55, 30, 20],
  'Clarinet':  [100, 5, 70, 5, 45],
  'Pure tone': [100, 0, 0, 0, 0]
};

let sliders = [];
let overlayCheckbox;
let presetButtons = [];
let playButton;
let amplitudes = [100, 0, 0, 0, 0];

// One sine oscillator per harmonic, built on demand when the sound is switched
// on and disposed when it is switched off.
let oscillators = [];
let soundOn = false;
const MASTER_AMP = 0.25;   // peak amplitude of the whole mix, not of one partial
const FADE = 0.08;         // seconds; avoids a click on attack and release
const GLIDE = 0.03;        // seconds; ramp when a slider or preset moves a level
const PEAK_SAMPLES = 1200; // resolution of the peak search used to normalize

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let i = 0; i < 5; i++) {
    const s = createSlider(0, 100, amplitudes[i], 1);
    s.position(sliderLeftMargin, drawHeight + 5 + i * 35);
    s.parent(document.querySelector('main'));
    // Drive the audio from the slider's own event rather than from draw(), so
    // levels track even when the frame loop is being throttled.
    s.input(function () { readSliders(); updateSoundLevels(); });
    sliders.push(s);
  }

  let x = 10;
  for (const name of Object.keys(PRESETS)) {
    const b = createButton(name);
    b.position(x, drawHeight + 182);
    b.mousePressed(() => applyPreset(name));
    b.parent(document.querySelector('main'));
    presetButtons.push(b);
    x += name.length * 8 + 30;
  }

  overlayCheckbox = createCheckbox(' Show individual harmonics overlay', false);
  overlayCheckbox.position(10, drawHeight + 220);
  overlayCheckbox.parent(document.querySelector('main'));

  playButton = createButton('Play Sound');
  playButton.position(10, drawHeight + 250);
  playButton.mousePressed(toggleSound);
  playButton.parent(document.querySelector('main'));

  // A hidden tab throttles draw() to a standstill but leaves the audio thread
  // running, so silence the mix rather than strand it playing out of sight.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) switchSoundOff();
  });

  resizeSliders();

  describe('A combined waveform built from a fixed 440 Hz fundamental plus four ' +
    'overtones, with a slider per harmonic, instrument presets, and a play ' +
    'button that sounds the mix, showing that timbre changes while the ' +
    'repetition rate stays fixed.', LABEL);
}

// ---------------------------------------------------------------- sound ----

function harmonicHz(n) {
  return (n + 1) * FUNDAMENTAL_HZ;
}

// Largest excursion of the current mix, sampled over the displayed window.
// Dividing by it keeps the loudness roughly constant: without it, stacking
// five harmonics at full amplitude would be five times louder than the
// fundamental alone and would clip.
function peakOfMix() {
  let peak = 0.001;
  for (let i = 0; i <= PEAK_SAMPLES; i++) {
    peak = Math.max(peak, Math.abs(combinedAt((i / PEAK_SAMPLES) * WINDOW_S)));
  }
  return peak;
}

function gainFor(n, peak) {
  return MASTER_AMP * (amplitudes[n] / 100) / peak;
}

// p5's amp() schedules a ramp without clearing the automation already queued on
// the gain, so a level change made during the attack fade would be overwritten
// by that fade's own later endpoint. Clear the queue and ramp from wherever the
// gain actually is right now.
function rampGain(osc, target, seconds) {
  const g = osc.output.gain;
  const now = getAudioContext().currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(target, now + seconds);
}

function toggleSound() {
  soundOn = !soundOn;
  if (soundOn) startSound(); else stopSound();
  playButton.html(soundOn ? 'Stop Sound' : 'Play Sound');
}

// Silence the mix and leave the button showing the truth.
function switchSoundOff() {
  if (!soundOn) return;
  toggleSound();
}

function startSound() {
  // Browsers only start audio from a user gesture; this button press is one.
  userStartAudio();
  const peak = peakOfMix();
  const now = getAudioContext().currentTime;
  for (let n = 0; n < 5; n++) {
    const o = new p5.Oscillator(harmonicHz(n), 'sine');
    o.output.gain.setValueAtTime(0, now);   // p5 builds the node at 0.5
    o.start();
    rampGain(o, gainFor(n, peak), FADE);    // ramp up so the attack does not click
    oscillators.push(o);
  }
}

function stopSound() {
  // Fade out, then tear the nodes down. Ramping the gain alone would leave
  // five oscillators running, which is exactly how a tone gets stuck on.
  const dying = oscillators;
  oscillators = [];
  for (const o of dying) rampGain(o, 0, FADE);
  setTimeout(function () {
    for (const o of dying) o.dispose();
  }, (FADE + 0.05) * 1000);
}

function updateSoundLevels() {
  if (!soundOn || oscillators.length !== 5) return;
  const peak = peakOfMix();
  for (let n = 0; n < 5; n++) rampGain(oscillators[n], gainFor(n, peak), GLIDE);
}

function readSliders() {
  for (let i = 0; i < 5; i++) amplitudes[i] = sliders[i].value();
}

function draw() {
  updateCanvasSize();
  readSliders();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPlot();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Harmonic Stack Synthesizer', canvasWidth / 2, 6);
  textSize(14);
  fill('dimgray');
  text('Fundamental frequency: 440 Hz (fixed — this is the pitch)',
       canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function harmonicAt(n, t) {
  return (amplitudes[n] / 100) * Math.sin(TWO_PI * (n + 1) * FUNDAMENTAL_HZ * t);
}

function combinedAt(t) {
  let sum = 0;
  for (let n = 0; n < 5; n++) sum += harmonicAt(n, t);
  return sum;
}

function drawPlot() {
  const left = 62;
  const right = canvasWidth - 25;
  const top = 62;
  const bottom = 236;
  const midY = (top + bottom) / 2;
  if (right <= left) return;

  // Normalize to the largest excursion so shape stays visible at any mix.
  // A uniform scale factor preserves the waveform's shape exactly. The audio
  // normalizes against the same peak, so what you see and what you hear agree.
  const yScale = (bottom - midY) / (peakOfMix() * 1.1);

  stroke('lightgray');
  strokeWeight(1);
  line(left, midY, right, midY);

  // One dashed marker per fundamental period. These never move, which is the
  // whole point: the pitch is fixed no matter what the overtones do.
  stroke('crimson');
  drawingContext.setLineDash([5, 5]);
  for (let c = 0; c <= CYCLES_SHOWN; c++) {
    const x = map(c / FUNDAMENTAL_HZ, 0, WINDOW_S, left, right);
    line(x, top, x, bottom);
  }
  drawingContext.setLineDash([]);

  // Faint individual harmonics
  if (overlayCheckbox.checked()) {
    strokeWeight(1.5);
    noFill();
    for (let n = 0; n < 5; n++) {
      if (amplitudes[n] === 0) continue;
      const c = color(HARMONIC_COLORS[n]);
      c.setAlpha(110);
      stroke(c);
      beginShape();
      for (let px = left; px <= right; px++) {
        const t = map(px, left, right, 0, WINDOW_S);
        vertex(px, midY - harmonicAt(n, t) * yScale);
      }
      endShape();
    }
  }

  // Combined waveform
  stroke('black');
  strokeWeight(3);
  noFill();
  beginShape();
  for (let px = left; px <= right; px++) {
    const t = map(px, left, right, 0, WINDOW_S);
    vertex(px, midY - combinedAt(t) * yScale);
  }
  endShape();

  noStroke();
  fill('crimson');
  textSize(13);
  textAlign(CENTER, TOP);
  for (let c = 1; c <= CYCLES_SHOWN; c++) {
    const x = map(c / FUNDAMENTAL_HZ, 0, WINDOW_S, left, right);
    text('cycle ' + c, x - (right - left) / (2 * CYCLES_SHOWN), bottom + 4);
  }

  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Time — one full pattern repeats every 1/440 s regardless of the mix',
       left, bottom + 24, right - left, 20);

  push();
  translate(18, midY);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Amplitude', 0, 0);
  pop();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < 5; i++) {
    fill(HARMONIC_COLORS[i]);
    text(HARMONIC_NAMES[i] + ' — ' + harmonicHz(i) + ' Hz: ' +
         amplitudes[i] + '%', 10, drawHeight + 15 + i * 35);
  }

  textSize(14);
  fill(soundOn ? 'seagreen' : 'dimgray');
  text(soundOn ? 'Sounding the mix — still 440 Hz whatever the sliders do'
                : 'Hear the mix as well as see it',
       115, drawHeight + 262);
  textSize(defaultTextSize);
}

function applyPreset(name) {
  const values = PRESETS[name];
  for (let i = 0; i < 5; i++) {
    sliders[i].value(values[i]);
    amplitudes[i] = values[i];
  }
  // Setting a slider's value in code fires no input event, so drive the audio.
  updateSoundLevels();
}

function resizeSliders() {
  const w = Math.max(60, canvasWidth - sliderLeftMargin - margin);
  for (const s of sliders) s.size(w);
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
