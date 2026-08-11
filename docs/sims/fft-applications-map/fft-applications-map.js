// FFT Applications Map MicroSim
// CANVAS_HEIGHT: 485
// Six places the FFT earns its keep, each traced back to the chapter that
// taught the technique it leans on.

let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const APPS = [
  {
    id: 'voice',
    label: ['Voice', 'Recognition'],
    title: 'Voice Recognition',
    icon: 'mic',
    color: '#1565c0',
    tip: 'Speech becomes a sequence of spectra, one every few milliseconds.',
    desc: 'Speech is identified from the shape of its spectrum, recomputed for ' +
          'a new short frame every few milliseconds. The vowels you say are ' +
          'distinguished almost entirely by where their spectral peaks sit.',
    chapter: 16,
    chapterTitle: 'Building a Real-Time Spectrum Analyzer',
    why: 'the frame-by-frame pipeline that turns a continuous microphone ' +
         'stream into spectra fast enough to keep up with the input',
    project: 'Build a five-word command recognizer: capture 30 ms frames, take ' +
             'the spectrum of each, and classify on the positions of the two ' +
             'strongest peaks.'
  },
  {
    id: 'noise',
    label: ['Noise', 'Cancellation'],
    title: 'Noise Cancellation',
    icon: 'headphone',
    color: '#6a1b9a',
    tip: 'Add an inverted copy of the noise and the two waves sum to nothing.',
    desc: 'A microphone samples the unwanted sound, the system computes an ' +
          'inverted copy, and the two waves cancel by superposition — which ' +
          'works only if the copy has the right phase, not just the right size.',
    chapter: 7,
    chapterTitle: 'Complex Numbers and Wave Superposition',
    why: 'phase is what the complex part of a bin carries, and getting it ' +
         'wrong turns cancellation into reinforcement',
    project: 'Cancel a single steady tone: find its frequency and phase with an ' +
             'FFT, synthesize the inverse, and measure how much of the tone ' +
             'survives.'
  },
  {
    id: 'vibration',
    label: ['Machine Monitoring', 'Vibration Analysis'],
    title: 'Machine Monitoring / Vibration Analysis',
    icon: 'gear',
    color: '#ef6c00',
    tip: 'A failing bearing announces itself at one specific frequency.',
    desc: 'Rotating machinery vibration, sampled by an accelerometer, analyzed ' +
          'for fault-specific frequency peaks. Each fault type has its own ' +
          'characteristic frequency, so the spectrum names the failure.',
    chapter: 15,
    chapterTitle: 'Windowing, Spectral Leakage, and Peak Detection',
    why: 'builds directly on that chapter\'s peak detection — a fault peak is ' +
         'small, and the wrong window buries it in leakage from the running speed',
    project: 'Build a bearing-fault classifier using peak frequency and window ' +
             'choice.'
  },
  {
    id: 'radar',
    label: ['Radar', 'Processing'],
    title: 'Radar Processing',
    icon: 'radar',
    color: '#2e7d32',
    tip: 'Finding a faint echo is correlation, and correlation is an FFT.',
    desc: 'A radar transmits a known pulse and hunts for its echo buried in ' +
          'noise. That search is a correlation, and correlation is done in the ' +
          'frequency domain because doing it directly is far slower.',
    chapter: 8,
    chapterTitle: 'Correlation: Does My Signal Contain This Note?',
    why: 'exactly the same "does this signal contain that pattern" question, ' +
         'asked at a different scale',
    project: 'Build an ultrasonic range-finder that correlates the received ' +
             'waveform against the transmitted chirp instead of timing a ' +
             'single edge.'
  },
  {
    id: 'sdr',
    label: ['Software', 'Defined Radio'],
    title: 'Software Defined Radio',
    icon: 'antenna',
    color: '#00838f',
    tip: 'The radio is just a fast converter; everything after it is arithmetic.',
    desc: 'An SDR replaces tuned analog circuits with a fast converter and ' +
          'software, and often uses aliasing deliberately to fold a ' +
          'high-frequency band down to something the processor can sample.',
    chapter: 6,
    chapterTitle: 'Sampling, Quantization, and Aliasing',
    why: 'undersampling is aliasing used on purpose, which is safe only if you ' +
         'know exactly where the aliases will land',
    project: 'Receive a broadcast-band signal and plot the sampled spectrum ' +
             'next to where you predicted its aliases would appear.'
  },
  {
    id: 'comms',
    label: ['Communication', 'Systems'],
    title: 'Communication Systems',
    icon: 'bars',
    color: '#c62828',
    tip: 'In OFDM the inverse FFT is not a tool for the transmitter — it is the transmitter.',
    desc: 'Wi-Fi, 4G, and digital television all use OFDM, where data is placed ' +
          'directly into frequency bins and an inverse FFT turns those bins ' +
          'into the waveform that goes on the air.',
    chapter: 13,
    chapterTitle: 'FFT Variants, Complexity, and Correctness',
    why: 'the inverse transform, and the round-trip correctness checks that ' +
         'prove what comes back out is what went in',
    project: 'Build a tiny OFDM link between two Picos: encode bytes into bins, ' +
             'inverse-FFT to a waveform, send it over an audio cable, and FFT ' +
             'to recover them.'
  }
];

let selected = null;
let hovered = null;
let cards = [];
let clearButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  clearButton = createButton('Clear selection');
  clearButton.position(10, drawHeight + 10);
  clearButton.mousePressed(() => { selected = null; });
  clearButton.parent(document.querySelector('main'));

  describe('A two-by-three grid of six FFT application domains with icons. ' +
    'Clicking a card reveals what the application does, which earlier chapter ' +
    'taught the technique it relies on, and a capstone project idea.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  layoutCards();
  hovered = cards.find(c => hit(c)) || null;

  drawTitle();
  drawCards();
  drawDetails();
  drawControlLabels();
  if (hovered && hovered.app !== selected) drawTooltip(hovered);
}

function layoutCards() {
  const gap = 10;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const h = 96;
  cards = [];
  APPS.forEach((app, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    cards.push({
      app: app,
      x: margin + col * (w + gap),
      y: 52 + row * (h + 10),
      w: w, h: h
    });
  });
}

function hit(c) {
  return mouseX >= c.x && mouseX <= c.x + c.w &&
         mouseY >= c.y && mouseY <= c.y + c.h;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Where the FFT Shows Up', canvasWidth / 2, 6);
  textSize(12.5);
  fill('dimgray');
  text('Six real domains — and the chapter of this course each one leans on. ' +
       'Click a card.', canvasWidth / 2, 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCards() {
  for (const c of cards) {
    const app = c.app;
    const on = selected === app;
    const hov = hovered === c;

    stroke(app.color);
    strokeWeight(on ? 3 : hov ? 2.5 : 1.5);
    fill(on ? colorTint(app.color) : 'white');
    rect(c.x, c.y, c.w, c.h, 8);

    drawIcon(app.icon, c.x + c.w / 2, c.y + 30, app.color);

    noStroke();
    fill(on ? app.color : 'black');
    textSize(12.5);
    textStyle(on ? BOLD : NORMAL);
    textAlign(CENTER, TOP);
    text(app.label[0], c.x + 4, c.y + 54, c.w - 8, 16);
    text(app.label[1], c.x + 4, c.y + 70, c.w - 8, 16);
    textStyle(NORMAL);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function colorTint(hex) {
  const c = color(hex);
  return color(red(c), green(c), blue(c), 26);
}

function drawIcon(kind, cx, cy, col) {
  push();
  stroke(col);
  strokeWeight(2);
  noFill();
  if (kind === 'mic') {
    fill(col);
    noStroke();
    rect(cx - 5, cy - 16, 10, 18, 5);
    noFill();
    stroke(col);
    arc(cx, cy - 2, 20, 20, 0, PI);
    line(cx, cy + 8, cx, cy + 13);
    line(cx - 6, cy + 13, cx + 6, cy + 13);
  } else if (kind === 'headphone') {
    arc(cx, cy + 1, 28, 26, PI, TWO_PI);
    fill(col);
    noStroke();
    rect(cx - 16, cy - 1, 7, 14, 3);
    rect(cx + 9, cy - 1, 7, 14, 3);
  } else if (kind === 'gear') {
    fill(col);
    noStroke();
    for (let a = 0; a < 8; a++) {
      push();
      translate(cx, cy);
      rotate((a * TWO_PI) / 8);
      rect(-2.5, -16, 5, 7, 1);
      pop();
    }
    circle(cx, cy, 20);
    fill('white');
    circle(cx, cy, 8);
  } else if (kind === 'radar') {
    stroke(col);
    strokeWeight(3);
    arc(cx - 1, cy + 3, 30, 30, PI + 0.30, TWO_PI - 0.30);
    strokeWeight(2);
    line(cx - 1, cy + 3, cx + 12, cy - 10);   // feed arm
    line(cx - 1, cy + 3, cx - 1, cy + 14);    // mast
    line(cx - 8, cy + 14, cx + 6, cy + 14);   // base
    noStroke();
    fill(col);
    circle(cx + 12, cy - 10, 5);
  } else if (kind === 'antenna') {
    stroke(col);
    strokeWeight(2);
    line(cx, cy - 14, cx, cy + 13);
    line(cx - 7, cy + 13, cx + 7, cy + 13);
    noFill();
    for (let r = 10; r <= 22; r += 6) {
      arc(cx, cy - 12, r, r, -PI * 0.85, -PI * 0.15);
    }
  } else if (kind === 'bars') {
    noStroke();
    fill(col);
    for (let i = 0; i < 4; i++) {
      const h = 6 + i * 6;
      rect(cx - 15 + i * 9, cy + 12 - h, 6, h, 1);
    }
  }
  pop();
}

function drawTooltip(c) {
  const app = c.app;
  textSize(11.5);
  const pad = 8;
  // Give the wrap a few pixels of slack — sizing the box to exactly
  // textWidth() pushes the final word onto a second, clipped line.
  const maxW = Math.min(380, canvasWidth - 20);
  const tw = textWidth(app.tip);
  const w = Math.min(tw + pad * 2 + 10, maxW);
  const lines = Math.max(1, Math.ceil((tw + 6) / (w - pad * 2)));
  const h = 15 * lines + 12;
  let x = constrain(mouseX + 12, 10, canvasWidth - w - 10);
  let y = mouseY + 18;
  if (y + h > drawHeight - 4) y = mouseY - h - 10;

  noStroke();
  fill(38, 50, 56, 240);
  rect(x, y, w, h, 5);
  fill('white');
  textAlign(LEFT, TOP);
  text(app.tip, x + pad, y + pad / 2 + 1, w - pad * 2, h);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawDetails() {
  const y = 264;
  const h = 166;
  const app = selected;

  stroke(app ? app.color : 'silver');
  strokeWeight(app ? 2 : 1);
  fill(255, 255, 255, 245);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const iw = canvasWidth - 2 * margin - 24;
  noStroke();
  textAlign(LEFT, TOP);

  if (!app) {
    fill('dimgray');
    textSize(13);
    text('None of these six is new material. Each one is a technique you have ' +
         'already built, pointed at a different problem — which is why any of ' +
         'them is a reasonable capstone. Click a card to see which chapter it ' +
         'leans on and one project idea in that domain.',
         margin + 12, y + 12, iw, h - 24);
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);
    return;
  }

  fill(app.color);
  textSize(15);
  textStyle(BOLD);
  text(app.title, margin + 12, y + 8);
  textStyle(NORMAL);

  fill('black');
  textSize(12.5);
  text(app.desc, margin + 12, y + 30, iw, 44);

  fill(app.color);
  textSize(12.5);
  textStyle(BOLD);
  const head = 'Builds on Chapter ' + app.chapter + ' — ' + app.chapterTitle;
  text(head, margin + 12, y + 76);
  textStyle(NORMAL);
  fill('dimgray');
  text(app.why, margin + 12, y + 93, iw, 32);

  fill('#1a237e');
  textSize(12.5);
  textStyle(BOLD);
  text('Capstone idea:', margin + 12, y + 128);
  // Measure the label while the bold face is still selected.
  const cw = textWidth('Capstone idea:') + 8;
  textStyle(NORMAL);
  fill('black');
  text(app.project, margin + 12 + cw, y + 128, iw - cw, 34);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(selected
        ? 'Showing ' + selected.title +
          '  —  hover any other card for a one-line preview'
        : 'Hover a card for a one-line preview, click it for the full entry',
       140, drawHeight + 22);
  textSize(defaultTextSize);
}

function mousePressed() {
  const c = cards.find(x => hit(x));
  if (c) selected = c.app;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
