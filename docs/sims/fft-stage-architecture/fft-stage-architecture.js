// FFT Stage Architecture MicroSim
// CANVAS_HEIGHT: 515
// Which parts of a full FFT stay in Python and which part is hand-written
// assembly. The split follows execution frequency, not difficulty.

let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

let nSelect, clearButton;
let N = 512;
let selected = null;      // box id, or 'boundary'
let boxes = [];
let boundaryHit = null;

function stages() { return Math.round(Math.log2(N)); }
function butterfliesPerStage() { return N / 2; }
function totalButterflies() { return stages() * butterfliesPerStage(); }

function commas(v) {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nSelect = createSelect();
  for (const v of [256, 512, 1024]) nSelect.option(v);
  nSelect.selected('512');
  nSelect.position(140, drawHeight + 10);
  nSelect.changed(() => { selected = null; });
  nSelect.parent(document.querySelector('main'));

  clearButton = createButton('Clear selection');
  clearButton.position(230, drawHeight + 10);
  clearButton.mousePressed(() => { selected = null; });
  clearButton.parent(document.querySelector('main'));

  describe('Two bands showing which parts of an FFT run in Python and which ' +
    'single part runs as hand-written assembly, connected by one highlighted ' +
    'boundary arrow, with a panel explaining each piece and how often it runs.',
    LABEL);
}

function draw() {
  updateCanvasSize();
  N = Number(nSelect.value());

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeBoxes();
  drawTitle();
  drawPythonBand();
  drawBoundary();
  drawAssemblyBand();
  drawInfoPanel();
  drawControlLabels();
}

function computeBoxes() {
  const left = margin;
  const right = canvasWidth - margin;
  const w = right - left;
  const gap = 10;
  const inner = w - 2 * gap;
  // Widths and heights loosely track how often each piece runs.
  const fracs = [0.29, 0.29, 0.42];
  const heights = [48, 48, 60];

  boxes = [];
  let x = left;
  const pieces = [
    { id: 'twiddle', title: 'Compute twiddle table', when: 'once' },
    { id: 'bitrev',  title: 'Bit-reversal reorder',  when: 'once' },
    { id: 'params',  title: 'Build stage parameter block', when: 'per stage' }
  ];
  for (let i = 0; i < 3; i++) {
    const bw = inner * fracs[i];
    boxes.push({ id: pieces[i].id, title: pieces[i].title, when: pieces[i].when,
                 x: x, y: 86, w: bw, h: heights[i], side: 'python' });
    x += bw + gap;
  }

  boxes.push({ id: 'hotloop', title: 'run_stage_hotloop', when: 'per butterfly',
               x: left, y: 288, w: w, h: 68, side: 'asm' });

  boundaryHit = { x: canvasWidth / 2 - 150, y: 162, w: 300, h: 90 };
}

function boxRuns(id) {
  if (id === 'twiddle' || id === 'bitrev') return 1;
  if (id === 'params') return stages();
  return totalButterflies();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Where the FFT Is Split: Python vs Assembly', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('One ' + N + '-point transform  •  ' + stages() + ' stages  •  ' +
       commas(totalButterflies()) + ' butterflies', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBandLabel(y, label, col) {
  noStroke();
  fill(col);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(label, margin, y);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPythonBand() {
  noStroke();
  fill(232, 240, 254, 150);
  rect(margin - 8, 58, canvasWidth - 2 * margin + 16, 96, 8);

  drawBandLabel(62, 'Python  —  runs once, or once per stage', 'mediumblue');

  for (const b of boxes) {
    if (b.side !== 'python') continue;
    const on = selected === b.id;
    stroke(on ? 'crimson' : 'mediumblue');
    strokeWeight(on ? 3 : 1.5);
    fill(on ? 'lavenderblush' : 'white');
    rect(b.x, b.y, b.w, b.h, 6);

    noStroke();
    fill(on ? 'crimson' : 'black');
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(b.title, b.x + 6, b.y + 8, b.w - 12, 34);
    textStyle(NORMAL);

    fill('dimgray');
    textSize(11);
    text('runs ' + commas(boxRuns(b.id)) + '×',
         b.x + 6, b.y + b.h - 17, b.w - 12, 14);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBoundary() {
  const on = selected === 'boundary';
  const cx = canvasWidth / 2;

  // The dashed rule marks the language boundary across the whole diagram.
  stroke(on ? 'crimson' : 'darkorange');
  strokeWeight(on ? 3 : 2);
  drawingContext.setLineDash([8, 6]);
  line(margin - 8, 212, canvasWidth - margin + 8, 212);
  drawingContext.setLineDash([]);

  // A single arrow crosses it.
  stroke(on ? 'crimson' : 'darkorange');
  strokeWeight(on ? 4 : 3);
  line(cx, 162, cx, 246);
  noStroke();
  fill(on ? 'crimson' : 'darkorange');
  triangle(cx - 7, 240, cx + 7, 240, cx, 252);

  textSize(12);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  fill(on ? 'crimson' : 'darkorange');
  text('Python / assembly boundary', cx - 14, 194);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  fill('dimgray');
  text('crossed ' + stages() + '× per transform', cx + 14, 194);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawAssemblyBand() {
  noStroke();
  fill(232, 245, 233, 170);
  rect(margin - 8, 258, canvasWidth - 2 * margin + 16, 106, 8);

  drawBandLabel(262, 'Assembly  —  the hot loop, runs ' +
    commas(totalButterflies()) + ' times per transform', 'darkgreen');

  const b = boxes.find(x => x.id === 'hotloop');
  const on = selected === 'hotloop';
  stroke(on ? 'crimson' : 'darkgreen');
  strokeWeight(on ? 3 : 2);
  fill(on ? 'lavenderblush' : 'white');
  rect(b.x, b.y, b.w, b.h, 6);

  noStroke();
  fill(on ? 'crimson' : 'black');
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('run_stage_hotloop:  butterfly × ' + commas(butterfliesPerStage()) +
       ' per stage', b.x, b.y + 12, b.w, 24);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text(commas(totalButterflies()) + ' butterflies × 8 instructions = ' +
       commas(totalButterflies() * 8) + ' instructions of the hot loop',
       b.x, b.y + 40, b.w, 18);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

const DETAILS = {
  twiddle: () => ({
    head: 'Compute twiddle table — runs once',
    body: 'Fills a table of ' + commas(N / 2) + ' complex twiddle factors with ' +
          'cosine and sine calls. It runs one time, at startup, and every ' +
          'transform afterwards reads from it.',
    why: 'It stays in Python because its cost is paid once and then amortized ' +
         'over every transform that follows. Rewriting it in assembly would ' +
         'save microseconds that happen exactly once.'
  }),
  bitrev: () => ({
    head: 'Bit-reversal reorder — runs once per transform',
    body: 'Permutes the ' + N + ' input samples into bit-reversed order so the ' +
          'stage loop can work in place. That is ' + N + ' index computations, ' +
          'not ' + N + ' per stage.',
    why: 'It stays in Python because it is O(N) work sitting next to O(N log N) ' +
         'work. Even made infinitely fast it removes only a small slice of the ' +
         'total, and it runs once where the butterfly runs ' +
         commas(totalButterflies()) + ' times.'
  }),
  params: () => ({
    head: 'Build stage parameter block — runs ' + stages() + '× per transform',
    body: 'Once per stage, Python assembles the five addresses the assembly ' +
          'routine needs: data pointer, twiddle pointer, span, group count, and ' +
          'butterfly count.',
    why: 'It stays in Python because ' + stages() + ' iterations of a few ' +
         'assignments cost nothing measurable. This is the code that decides ' +
         'what the hot loop does, and it is easier to get right in Python.'
  }),
  hotloop: () => ({
    head: 'run_stage_hotloop — runs ' + commas(totalButterflies()) +
          '× per transform',
    body: 'Runs the eight-instruction butterfly pattern ' +
          commas(totalButterflies()) + ' times for a ' + N +
          '-point transform.',
    why: 'This is the only code worth hand-optimizing, because it is the only ' +
         'code that runs enough times for the optimization to matter. Saving ' +
         'one cycle here saves ' + commas(totalButterflies()) +
         ' cycles per transform.'
  }),
  boundary: () => ({
    head: 'The Python / assembly boundary',
    body: 'This is the stage parameter block — five addresses, one block, ' +
          'crossing once per stage.',
    why: 'The boundary is crossed ' + stages() + ' times per transform, not ' +
         commas(totalButterflies()) + '. Call overhead is therefore irrelevant: ' +
         'a boundary crossed per butterfly would have cost more than the ' +
         'butterflies themselves.'
  })
};

function drawInfoPanel() {
  const y = 372;
  const h = 88;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);

  if (!selected) {
    fill('dimgray');
    textSize(13);
    text('Click any box to see what it does, how many times it runs for one ' +
         N + '-point FFT, and why it sits on that side of the line. Click the ' +
         'orange arrow to see what actually crosses the boundary.',
         margin + 12, y + 10, canvasWidth - 2 * margin - 24, h - 18);
  } else {
    const d = DETAILS[selected]();
    fill('crimson');
    textSize(14);
    textStyle(BOLD);
    text(d.head, margin + 12, y + 8);
    textStyle(NORMAL);
    fill('black');
    textSize(12);
    text(d.body, margin + 12, y + 27, canvasWidth - 2 * margin - 24, 30);
    fill('dimgray');
    text(d.why, margin + 12, y + 58, canvasWidth - 2 * margin - 24, 28);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('FFT size N =', 10, drawHeight + 22);
  fill('dimgray');
  textSize(13);
  text(commas(totalButterflies()) + ' butterflies vs ' + (2 + stages()) +
       ' Python steps — the ratio is the whole argument.',
       350, drawHeight + 22);
}

function mousePressed() {
  const hit = boxes.find(b => mouseX >= b.x && mouseX <= b.x + b.w &&
                              mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit) { selected = hit.id; return; }
  const a = boundaryHit;
  if (mouseX >= a.x && mouseX <= a.x + a.w && mouseY >= a.y && mouseY <= a.y + a.h) {
    selected = 'boundary';
  }
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
