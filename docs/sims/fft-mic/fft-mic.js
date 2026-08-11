// FFT Microphone Spectrum Analyzer MicroSim
// CANVAS_HEIGHT: 490
// Whistle, talk, or hum into the computer's microphone and watch the FFT of
// your own voice. This is the browser version of the whistle test from
// Chapter 14 -- the peak should follow your pitch immediately.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Audio
let mic;
let fft;
let spectrum = null;
let micStarted = false;
let isListening = false;
let micError = '';
let demoMode = false;

// Must be a power of two. 512 bins from a 1024-point FFT.
const BIN_COUNT = 512;
let sr = 44100; // replaced with the real audio context rate once audio starts

// Controls
let startStopButton;
let demoButton;
let dbCheckbox;
let maxFreqSlider;
let maxDisplayFreq = 4000;

// Peak history, drawn as a fading comet tail so a pitch sweep is visible
const TRAIL_LIFE = 75;
let peakTrail = [];

// Below this bar height the "peak" is just room noise, so the readout blanks out
const PEAK_THRESHOLD = 60;

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, BIN_COUNT);
  fft.setInput(mic);

  startStopButton = createButton('Start microphone');
  startStopButton.position(10, drawHeight + 12);
  startStopButton.mousePressed(toggleMic);
  startStopButton.parent(document.querySelector('main'));

  demoButton = createButton('Demo sweep');
  demoButton.position(150, drawHeight + 12);
  demoButton.mousePressed(toggleDemo);
  demoButton.parent(document.querySelector('main'));

  dbCheckbox = createCheckbox(' decibel scale', false);
  dbCheckbox.position(250, drawHeight + 14);
  dbCheckbox.parent(document.querySelector('main'));

  maxFreqSlider = createSlider(1000, 12000, 4000, 500);
  maxFreqSlider.position(sliderLeftMargin, drawHeight + 52);
  maxFreqSlider.parent(document.querySelector('main'));

  resizeControls();

  describe('A live spectrum of the computer microphone. Frequency runs left to ' +
    'right, magnitude is bar height, and the strongest peak is labeled with its ' +
    'frequency and nearest musical note.', LABEL);
}

function draw() {
  updateCanvasSize();
  maxDisplayFreq = maxFreqSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (demoMode) {
    spectrum = demoSpectrum();
  } else if (micStarted && isListening) {
    spectrum = fft.analyze();
  }

  drawTitle();

  if (spectrum) {
    const peak = findPeak();
    updateTrail(peak);
    drawPeakTrail();
    drawSpectrum();
    drawPeakMarker(peak);
    drawAxes();
    drawReadout(peak);
  } else {
    drawStartPrompt();
  }

  drawControlLabels();
}

// ---------- geometry ----------

function plotLeft() { return 58; }
function plotRight() { return canvasWidth - 22; }
function plotTop() { return 70; }
function plotBase() { return 296; }

function binHz() { return (sr / 2) / BIN_COUNT; }

// Number of bins that fall inside the displayed frequency range
function visibleBins() {
  return constrain(Math.floor(maxDisplayFreq / binHz()), 4, BIN_COUNT);
}

// ---------- drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Live Microphone Spectrum', canvasWidth / 2, 6);
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawStartPrompt() {
  noStroke();
  textAlign(CENTER, CENTER);
  if (micError) {
    fill('firebrick');
    textSize(15);
    text(micError, canvasWidth / 2, drawHeight / 2 - 14);
    fill('dimgray');
    textSize(14);
    text('Try "Demo sweep" instead — it needs no microphone.',
         canvasWidth / 2, drawHeight / 2 + 14);
  } else {
    fill('dimgray');
    textSize(17);
    text('Click "Start microphone", then whistle or hum a rising note.',
         canvasWidth / 2, drawHeight / 2 - 12);
    textSize(14);
    text('No microphone handy? Click "Demo sweep".',
         canvasWidth / 2, drawHeight / 2 + 16);
  }
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

// Converts a raw 0-255 bin value to a 0-1 bar height, on whichever scale is selected
function barFraction(v) {
  if (dbCheckbox.checked()) {
    // 20*log10(v/255) lands in roughly -48..0 dB for audible content
    const db = 20 * Math.log(Math.max(v, 1) / 255) / Math.LN10;
    return constrain(map(db, -48, 0, 0, 1), 0, 1);
  }
  return v / 255;
}

function drawSpectrum() {
  const left = plotLeft();
  const right = plotRight();
  const base = plotBase();
  const h = base - plotTop();
  const n = visibleBins();
  const barWidth = (right - left) / n;

  noStroke();
  colorMode(HSB);
  for (let i = 0; i < n; i++) {
    const barHeight = barFraction(spectrum[i]) * h;
    // Blue for the low end of the displayed range, red for the high end
    fill(map(i, 0, n, 240, 0), 80, 90);
    rect(left + i * barWidth, base - barHeight,
         Math.max(1, barWidth - (barWidth > 3 ? 1 : 0.2)), barHeight);
  }
  colorMode(RGB);
}

function drawPeakMarker(peak) {
  if (!peak) return;
  const x = constrain(map(peak.freq, 0, maxDisplayFreq, plotLeft(), plotRight()),
                      plotLeft(), plotRight());

  stroke('black');
  strokeWeight(1);
  for (let y = plotTop(); y < plotBase(); y += 8) {
    line(x, y, x, Math.min(y + 4, plotBase()));
  }

  noStroke();
  fill('black');
  textSize(12);
  textAlign(x > canvasWidth - 90 ? RIGHT : LEFT, TOP);
  text('peak', x + (x > canvasWidth - 90 ? -4 : 4), plotTop() + 2);
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function updateTrail(peak) {
  for (const p of peakTrail) p.age++;
  peakTrail = peakTrail.filter(p => p.age < TRAIL_LIFE);
  if (peak) peakTrail.push({ freq: peak.freq, age: 0 });
}

function drawPeakTrail() {
  const top = 46;
  const h = 16;
  const left = plotLeft();
  const right = plotRight();

  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('Peak trail — where the peak has been over the last ~1 second',
       left, top - 2);

  fill(245);
  rect(left, top, right - left, h);

  for (const p of peakTrail) {
    const x = map(p.freq, 0, maxDisplayFreq, left, right);
    if (x < left || x > right) continue;
    stroke(30, 90, 200, map(p.age, 0, TRAIL_LIFE, 220, 0));
    strokeWeight(2);
    line(x, top + 2, x, top + h - 2);
  }

  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawAxes() {
  const left = plotLeft();
  const right = plotRight();
  const base = plotBase();

  stroke('black');
  strokeWeight(1);
  line(left, base, right, base);

  noStroke();
  fill('black');
  textSize(12);

  // Frequency ticks
  textAlign(CENTER, TOP);
  const ticks = 6;
  for (let i = 0; i <= ticks; i++) {
    const f = map(i, 0, ticks, 0, maxDisplayFreq);
    const x = map(i, 0, ticks, left, right);
    stroke('black');
    line(x, base, x, base + 5);
    noStroke();
    text(f >= 1000 ? (f / 1000).toFixed(1) + 'k' : f.toFixed(0), x, base + 8);
  }
  textSize(14);
  text('Frequency (Hz)', (left + right) / 2, base + 26);

  // Magnitude axis
  textSize(12);
  textAlign(RIGHT, CENTER);
  fill('dimgray');
  if (dbCheckbox.checked()) {
    text('0 dB', left - 6, plotTop());
    text('-48 dB', left - 6, base);
  } else {
    text('max', left - 6, plotTop());
    text('0', left - 6, base);
  }
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawReadout(peak) {
  const y = 342;
  const h = 50;
  const w = canvasWidth - 2 * margin;

  stroke(peak ? 'darkgreen' : 'silver');
  strokeWeight(peak ? 2 : 1);
  fill(peak ? 'honeydew' : 'rgba(255,255,255,0.94)');
  rect(margin, y, w, h, 6);

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);

  if (!peak) {
    fill('dimgray');
    text('Too quiet to call a peak — whistle, hum, or sing a steady note.',
         margin + 12, y + h / 2);
  } else {
    const note = noteFromFreq(peak.freq);
    const cents = note.cents >= 0 ? '+' + note.cents : '' + note.cents;

    // Second line first, so the bold style below cannot leak into it
    fill('black');
    text('nearest note ' + note.name + ' (' + cents + ' cents)',
         margin + 12, y + 34);

    // The bin index and bin width share line one with the peak frequency,
    // and drop out entirely when the canvas is too narrow to hold both.
    fill('dimgray');
    const detail = 'bin ' + peak.index + '  ·  bin width ' +
                   binHz().toFixed(1) + ' Hz';
    const detailWidth = textWidth(detail);

    fill('darkgreen');
    textStyle(BOLD);
    const headline = 'Peak: ' + peak.freq.toFixed(0) + ' Hz';
    const headlineWidth = textWidth(headline);
    text(headline, margin + 12, y + 15);
    textStyle(NORMAL);

    if (headlineWidth + detailWidth + 40 < w) {
      fill('dimgray');
      textAlign(RIGHT, CENTER);
      text(detail, canvasWidth - margin - 12, y + 15);
      textAlign(LEFT, CENTER);
    }
  }
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Max frequency: ' + (maxDisplayFreq / 1000).toFixed(1) + ' kHz',
       10, drawHeight + 62);
}

// ---------- analysis ----------

// Strongest bin inside the displayed range, ignoring the DC/rumble bins
function findPeak() {
  const n = visibleBins();
  let bestIndex = -1;
  let bestValue = 0;
  for (let i = 2; i < n; i++) {
    if (spectrum[i] > bestValue) {
      bestValue = spectrum[i];
      bestIndex = i;
    }
  }
  if (bestIndex < 0 || bestValue < PEAK_THRESHOLD) return null;
  return { index: bestIndex, value: bestValue, freq: bestIndex * binHz() };
}

function noteFromFreq(f) {
  const semis = 12 * Math.log(f / 440) / Math.log(2);
  const midi = Math.round(semis) + 69;
  const exact = 440 * Math.pow(2, (midi - 69) / 12);
  const cents = Math.round(1200 * Math.log(f / exact) / Math.log(2));
  const name = NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
  return { name: name, cents: cents };
}

// A synthetic whistle sweeping up and down, for machines with no microphone
function demoSpectrum() {
  const out = new Array(BIN_COUNT);
  // The quarter-turn offset starts the sweep mid-range and already rising,
  // rather than parked at the bottom of the glide.
  const t = (frameCount % 420) / 420 + 0.25;
  const f0 = 450 + 1250 * (0.5 - 0.5 * Math.cos(TWO_PI * t));
  const bw = binHz();
  for (let i = 0; i < BIN_COUNT; i++) {
    const f = i * bw;
    // Gentle room-noise floor, then a near-pure tone with two weak harmonics
    let v = 16 * Math.exp(-f / 2500) + 4;
    v += 238 * Math.exp(-Math.pow((f - f0) / 24, 2));
    v += 62 * Math.exp(-Math.pow((f - 2 * f0) / 30, 2));
    v += 20 * Math.exp(-Math.pow((f - 3 * f0) / 36, 2));
    out[i] = Math.min(255, v);
  }
  return out;
}

// ---------- controls ----------

function toggleMic() {
  demoMode = false;
  demoButton.html('Demo sweep');

  if (!micStarted) {
    userStartAudio();
    micError = '';
    mic.start(
      () => {
        micStarted = true;
        isListening = true;
        // The FFT reads the input node directly, so nothing is routed to the
        // speakers. Muting output as well rules out any chance of feedback.
        outputVolume(0);
        if (typeof sampleRate === 'function') sr = sampleRate();
        maxFreqSlider.elt.max = Math.floor(sr / 2);
        startStopButton.html('Stop microphone');
      },
      () => {
        micError = 'The browser would not grant microphone access.';
        spectrum = null;
      }
    );
  } else if (isListening) {
    isListening = false;
    startStopButton.html('Resume microphone');
  } else {
    isListening = true;
    startStopButton.html('Stop microphone');
  }
}

function toggleDemo() {
  demoMode = !demoMode;
  if (demoMode) {
    isListening = false;
    micError = '';
    peakTrail = [];
    demoButton.html('Stop demo');
    if (micStarted) startStopButton.html('Resume microphone');
  } else {
    demoButton.html('Demo sweep');
    spectrum = null;
  }
}

function resizeControls() {
  maxFreqSlider.size(Math.max(80, canvasWidth - sliderLeftMargin - margin));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  resizeControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
