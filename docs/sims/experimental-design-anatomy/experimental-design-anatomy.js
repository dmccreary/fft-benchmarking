// Experimental Design Anatomy MicroSim
// CANVAS_HEIGHT: 435
// A benchmark question, taken apart. Drag each highlighted phrase into the
// role it plays: the question itself, the thing you vary, the thing you
// measure, or the things you hold still.

let canvasWidth = 400;
let drawHeight = 390;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const ZONES = [
  { id: 'rq', title: 'Research Question',
    hint: 'what the experiment answers',
    color: '#8e24aa', fill: '#f3e5f5' },
  { id: 'iv', title: 'Independent Variable',
    hint: 'the one thing you change',
    color: '#1565c0', fill: '#e3f2fd' },
  { id: 'dv', title: 'Dependent Variable',
    hint: 'the number you read off',
    color: '#2e7d32', fill: '#e8f5e9' },
  { id: 'cv', title: 'Controlled Variables',
    hint: 'held identical in every run',
    color: '#ef6c00', fill: '#fff3e0' }
];

// Each example is a flow of plain text and draggable phrases.
const EXAMPLES = [
  {
    domain: 'Audio — tone detection',
    parts: [
      { chip: 'Does the window function affect peak accuracy?', ans: 'rq' },
      { text: 'Specifically: does' },
      { chip: 'Hann windowing versus no window', ans: 'iv' },
      { text: 'change' },
      { chip: 'peak-frequency error in Hz', ans: 'dv' },
      { text: 'when detecting a 3.2 kHz tone in noisy audio, holding' },
      { chip: 'the 150 MHz clock', ans: 'cv' },
      { text: ',' },
      { chip: 'the Pico 2 board', ans: 'cv' },
      { text: 'and' },
      { chip: 'a fixed 512-point FFT', ans: 'cv' },
      { text: 'the same in every run?' }
    ]
  },
  {
    domain: 'Vibration — bearing faults',
    parts: [
      { chip: 'Does sample rate affect bearing-fault detection?', ans: 'rq' },
      { text: 'Specifically: does' },
      { chip: 'sampling at 8 kHz versus 2 kHz', ans: 'iv' },
      { text: 'change' },
      { chip: 'the fault-frequency error in Hz', ans: 'dv' },
      { text: 'for an accelerometer on a running motor, holding' },
      { chip: 'the Hann window', ans: 'cv' },
      { text: ',' },
      { chip: 'the 1024-point FFT', ans: 'cv' },
      { text: 'and' },
      { chip: 'the same bearing and load', ans: 'cv' },
      { text: 'the same in every run?' }
    ]
  },
  {
    domain: 'Radio — separating two signals',
    parts: [
      { chip: 'Does FFT size affect how well two nearby signals separate?',
        ans: 'rq' },
      { text: 'Specifically: does' },
      { chip: 'a 512-point versus a 2048-point FFT', ans: 'iv' },
      { text: 'change' },
      { chip: 'the smallest resolvable spacing in Hz', ans: 'dv' },
      { text: 'for two tones in a receiver, holding' },
      { chip: 'the 44.1 kHz sample rate', ans: 'cv' },
      { text: ',' },
      { chip: 'the rectangular window', ans: 'cv' },
      { text: 'and' },
      { chip: 'the same input power', ans: 'cv' },
      { text: 'the same in every run?' }
    ]
  }
];

let exampleIndex = 0;
let chips = [];
let flowWords = [];
let zoneRects = {};
let dragging = null;
let dragDX = 0, dragDY = 0;
let checked = false;
let feedback = null;
let checkButton, nextButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  checkButton = createButton('Check my answers');
  checkButton.position(10, drawHeight + 10);
  checkButton.mousePressed(checkAnswers);
  checkButton.parent(document.querySelector('main'));

  nextButton = createButton('Try a new example');
  nextButton.position(140, drawHeight + 10);
  nextButton.mousePressed(nextExample);
  nextButton.parent(document.querySelector('main'));

  resetButton = createButton('Clear this one');
  resetButton.position(272, drawHeight + 10);
  resetButton.mousePressed(() => loadExample(exampleIndex));
  resetButton.parent(document.querySelector('main'));

  loadExample(0);

  describe('A benchmark research question with its key phrases shown as ' +
    'draggable chips, above four labeled boxes for research question, ' +
    'independent variable, dependent variable, and controlled variables.',
    LABEL);
}

function loadExample(i) {
  exampleIndex = i;
  chips = [];
  EXAMPLES[i].parts.forEach((p, k) => {
    if (p.chip) chips.push({ key: k, label: p.chip, ans: p.ans, zone: null });
  });
  dragging = null;
  checked = false;
  feedback = null;
}

function nextExample() {
  loadExample((exampleIndex + 1) % EXAMPLES.length);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  layoutSentence();
  drawSentencePanel();
  drawZones();
  drawChips();
  drawFeedback();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Anatomy of a Benchmark Question', canvasWidth / 2, 6);
  textSize(12.5);
  fill('dimgray');
  text('Example ' + (exampleIndex + 1) + ' of ' + EXAMPLES.length + ' — ' +
       EXAMPLES[exampleIndex].domain +
       '.   Drag each highlighted phrase into the role it plays.',
       canvasWidth / 2, 30);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Inline flow: plain words and chip slots share one wrapped line layout, so a
// chip's home is its actual position in the sentence.
function layoutSentence() {
  const x = margin + 12;
  const w = canvasWidth - 2 * margin - 24;
  const lineH = 24;
  let cx = x, cy = 60;
  flowWords = [];

  for (const p of EXAMPLES[exampleIndex].parts) {
    if (p.text) {
      textSize(13);
      for (const word of p.text.split(' ')) {
        if (!word) continue;
        const ww = textWidth(word + ' ');
        if (cx + ww > x + w) { cx = x; cy += lineH; }
        flowWords.push({ s: word, x: cx, y: cy });
        cx += ww;
      }
    } else {
      textSize(12.5);
      const cw = textWidth(p.chip) + 16;
      if (cx + cw > x + w) { cx = x; cy += lineH; }
      const chip = chips.find(c => c.label === p.chip);
      chip.home = { x: cx, y: cy - 3, w: cw, h: 21 };
      cx += cw + 6;
    }
  }
  textSize(defaultTextSize);
}

function drawSentencePanel() {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, 48, canvasWidth - 2 * margin, 112, 8);

  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  for (const w of flowWords) text(w.s, w.x, w.y);

  // Dashed placeholder wherever a phrase has been moved out of the sentence.
  for (const c of chips) {
    if (c.zone === null || !c.home) continue;
    noFill();
    stroke('#bdbdbd');
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    rect(c.home.x, c.home.y, c.home.w, c.home.h, 4);
    drawingContext.setLineDash([]);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function zoneLayout() {
  const w = (canvasWidth - 2 * margin - 10) / 2;
  const L = margin, R = margin + w + 10;
  zoneRects = {
    rq: { x: L, y: 168, w: w, h: 60 },
    iv: { x: R, y: 168, w: w, h: 60 },
    dv: { x: L, y: 236, w: w, h: 78 },
    cv: { x: R, y: 236, w: w, h: 78 }
  };
}

function drawZones() {
  zoneLayout();
  for (const z of ZONES) {
    const r = zoneRects[z.id];
    const hot = dragging && mouseX >= r.x && mouseX <= r.x + r.w &&
                mouseY >= r.y && mouseY <= r.y + r.h;
    stroke(z.color);
    strokeWeight(hot ? 3 : 1.5);
    fill(hot ? '#fffde7' : z.fill);
    rect(r.x, r.y, r.w, r.h, 8);

    noStroke();
    fill(z.color);
    textSize(12.5);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(z.title, r.x + 10, r.y + 6);
    // Measure while the bold 12.5px face is still selected.
    const titleW = textWidth(z.title);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(10.5);
    text('— ' + z.hint, r.x + 18 + titleW, r.y + 8);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Chips sitting in a zone are packed left to right, wrapping inside the box.
function zoneChipRects(zoneId) {
  const r = zoneRects[zoneId];
  const inner = r.w - 16;
  let cx = r.x + 8, cy = r.y + 24;
  const out = [];
  for (const c of chips) {
    if (c.zone !== zoneId) continue;
    textSize(12.5);
    const cw = Math.min(textWidth(c.label) + 16, inner);
    if (cx + cw > r.x + 8 + inner) { cx = r.x + 8; cy += 24; }
    out.push({ chip: c, x: cx, y: cy, w: cw, h: 21 });
    cx += cw + 6;
  }
  return out;
}

function chipRect(c) {
  if (dragging === c) {
    textSize(12.5);
    return { x: mouseX - dragDX, y: mouseY - dragDY,
             w: textWidth(c.label) + 16, h: 21 };
  }
  if (c.zone) {
    const found = zoneChipRects(c.zone).find(r => r.chip === c);
    if (found) return found;
  }
  return c.home;
}

function drawChips() {
  for (const c of chips) {
    const r = chipRect(c);
    if (!r) continue;
    const z = c.zone ? ZONES.find(x => x.id === c.zone) : null;
    const right = checked && c.zone === c.ans;
    const wrong = checked && c.zone && c.zone !== c.ans;

    stroke(right ? '#2e7d32' : wrong ? '#c62828'
                 : z ? z.color : '#f9a825');
    strokeWeight(right || wrong ? 2.5 : 1.5);
    fill(right ? '#c8e6c9' : wrong ? '#ffcdd2' : z ? z.fill : '#fff8e1');
    rect(r.x, r.y, r.w, r.h, 4);

    noStroke();
    fill('black');
    textSize(12.5);
    textAlign(CENTER, CENTER);
    text(c.label, r.x + r.w / 2, r.y + r.h / 2 + 1);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

const HINTS = {
  rq: 'This is the question the whole experiment exists to answer. It is not ' +
      'a variable at all — try Research Question.',
  iv: 'This is the one thing you deliberately change between runs, not ' +
      'something you measure or hold fixed — try Independent Variable.',
  dv: 'This phrase describes what you are measuring as an outcome, not what ' +
      'you are deliberately changing — try Dependent Variable instead.',
  cv: 'This is held identical in every single run, so it can be neither what ' +
      'you vary nor what you measure — try Controlled Variables.'
};

function checkAnswers() {
  checked = true;
  const unplaced = chips.filter(c => c.zone === null);
  const wrong = chips.filter(c => c.zone && c.zone !== c.ans);
  const right = chips.filter(c => c.zone === c.ans);

  if (unplaced.length && !wrong.length) {
    feedback = {
      ok: false,
      head: right.length + ' of ' + chips.length + ' placed correctly',
      body: unplaced.length + ' phrase' + (unplaced.length > 1 ? 's are' : ' is') +
            ' still in the sentence. Every phrase belongs in exactly one box.'
    };
  } else if (wrong.length) {
    const w = wrong[0];
    feedback = {
      ok: false,
      head: right.length + ' of ' + chips.length + ' placed correctly',
      body: '"' + w.label + '" — ' + HINTS[w.ans]
    };
  } else {
    feedback = {
      ok: true,
      head: 'All ' + chips.length + ' correct.',
      body: 'One question, one thing varied, one thing measured, and ' +
            'everything else nailed down. A benchmark that changes two things ' +
            'at once cannot tell you which one mattered.'
    };
  }
}

function drawFeedback() {
  const y = 322;
  const h = 58;
  stroke(!feedback ? 'silver' : feedback.ok ? '#2e7d32' : '#c62828');
  strokeWeight(feedback ? 2 : 1);
  fill(!feedback ? color(255, 255, 255, 240)
                 : feedback.ok ? '#f1f8e9' : '#fff5f5');
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  if (!feedback) {
    fill('dimgray');
    textSize(12.5);
    text('Drag all six phrases out of the sentence and into the four boxes, ' +
         'then press "Check my answers". A wrong placement gets a hint, not ' +
         'the answer.', margin + 12, y + 10, canvasWidth - 2 * margin - 24, 40);
  } else {
    fill(feedback.ok ? '#2e7d32' : '#c62828');
    textSize(13.5);
    textStyle(BOLD);
    text(feedback.head, margin + 12, y + 8);
    textStyle(NORMAL);
    fill('black');
    textSize(12.5);
    text(feedback.body, margin + 12, y + 26,
         canvasWidth - 2 * margin - 24, 28);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  const placed = chips.filter(c => c.zone !== null).length;
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(placed + ' of ' + chips.length + ' phrases placed', 388,
       drawHeight + 22);
  textSize(defaultTextSize);
}

function mousePressed() {
  // Topmost first: chips already in a zone sit above chips still in the flow.
  for (let i = chips.length - 1; i >= 0; i--) {
    const c = chips[i];
    const r = chipRect(c);
    if (!r) continue;
    if (mouseX >= r.x && mouseX <= r.x + r.w &&
        mouseY >= r.y && mouseY <= r.y + r.h) {
      dragging = c;
      dragDX = mouseX - r.x;
      dragDY = mouseY - r.y;
      checked = false;
      return;
    }
  }
}

function mouseReleased() {
  if (!dragging) return;
  let dropped = null;
  for (const z of ZONES) {
    const r = zoneRects[z.id];
    if (mouseX >= r.x && mouseX <= r.x + r.w &&
        mouseY >= r.y && mouseY <= r.y + r.h) { dropped = z.id; break; }
  }
  dragging.zone = dropped;
  dragging = null;
  feedback = null;
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
