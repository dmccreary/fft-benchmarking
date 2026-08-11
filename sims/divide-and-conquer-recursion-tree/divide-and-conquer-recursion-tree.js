// Divide and Conquer Recursion Tree MicroSim
// CANVAS_HEIGHT: 475
// An 8-sample DFT split by decimation in time: even indices left, odd indices
// right, all the way down to single samples.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const LEVEL_Y = [72, 146, 220, 292];
const LEVEL_COLORS = ['steelblue', 'mediumseagreen', 'goldenrod', 'mediumpurple'];

// Each node holds the original sample indices in its subsequence. Splitting
// takes the even-positioned and odd-positioned members of that subsequence,
// which is what "decimation in time" means.
function buildTree(indices, level, path) {
  const node = { indices: indices, level: level, path: path, children: [] };
  if (indices.length > 1) {
    const even = indices.filter((_, i) => i % 2 === 0);
    const odd = indices.filter((_, i) => i % 2 === 1);
    node.children.push(buildTree(even, level + 1, path.concat(['even'])));
    node.children.push(buildTree(odd, level + 1, path.concat(['odd'])));
  }
  return node;
}

const ROOT = buildTree([0, 1, 2, 3, 4, 5, 6, 7], 0, []);

let selected = null;
let boxes = [];
let revealLevel = 3;      // levels 0..revealLevel are shown
let playPhase = -1;
let playButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play split animation');
  playButton.position(10, drawHeight + 8);
  playButton.mousePressed(startPlay);
  playButton.parent(document.querySelector('main'));

  resetButton = createButton('Show whole tree');
  resetButton.position(158, drawHeight + 8);
  resetButton.mousePressed(() => { revealLevel = 3; playPhase = -1; selected = null; });
  resetButton.parent(document.querySelector('main'));

  describe('A four-level recursion tree splitting eight samples by even and odd ' +
    'index down to single samples, with clickable nodes that highlight the path ' +
    'back to the root.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (playPhase >= 0) {
    playPhase += deltaTime;
    revealLevel = Math.min(3, Math.floor(playPhase / 700));
    if (playPhase > 2800) playPhase = -1;
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  boxes = [];
  layout(ROOT, margin, canvasWidth - margin);
  drawTitle();
  drawEdges();
  drawNodes();
  drawInfoPanel();
  drawControlLabels();
}

// Each node owns a horizontal span; its two children split that span in half.
function layout(node, left, right) {
  const cx = (left + right) / 2;
  const w = Math.max(40, Math.min(right - left - 10, 360));
  boxes.push({
    node: node,
    x: cx - w / 2,
    y: LEVEL_Y[node.level],
    w: w,
    h: 40,
    cx: cx
  });
  if (node.children.length === 2) {
    const mid = (left + right) / 2;
    layout(node.children[0], left, mid);
    layout(node.children[1], mid, right);
  }
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Divide and Conquer: Splitting by Even and Odd Index', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function boxFor(node) {
  return boxes.find(b => b.node === node);
}

function onSelectedPath(node) {
  if (!selected) return false;
  // A node is on the highlighted path if it is an ancestor of the selection.
  let cur = selected;
  while (cur) {
    if (cur === node) return true;
    cur = parentOf(cur);
  }
  return false;
}

function parentOf(node) {
  let found = null;
  const walk = n => {
    for (const c of n.children) {
      if (c === node) found = n;
      walk(c);
    }
  };
  walk(ROOT);
  return found;
}

function drawEdges() {
  for (const b of boxes) {
    if (b.node.level >= revealLevel) continue;
    for (let i = 0; i < b.node.children.length; i++) {
      const child = b.node.children[i];
      const cb = boxFor(child);
      if (!cb) continue;
      const lit = onSelectedPath(child) && onSelectedPath(b.node);

      stroke(lit ? 'crimson' : 'gray');
      strokeWeight(lit ? 3 : 1.5);
      line(b.cx, b.y + b.h, cb.cx, cb.y);

      noStroke();
      fill(lit ? 'crimson' : 'dimgray');
      textSize(11);
      textAlign(CENTER, CENTER);
      text(i === 0 ? 'even' : 'odd',
           (b.cx + cb.cx) / 2 + (i === 0 ? -16 : 16),
           (b.y + b.h + cb.y) / 2);
    }
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawNodes() {
  for (const b of boxes) {
    if (b.node.level > revealLevel) continue;
    const lit = onSelectedPath(b.node);
    const isSel = selected === b.node;

    stroke(isSel ? 'crimson' : lit ? 'crimson' : 'white');
    strokeWeight(isSel ? 3 : lit ? 2 : 1);
    fill(LEVEL_COLORS[b.node.level]);
    rect(b.x, b.y, b.w, b.h, 6);

    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(b.node.indices.length === 1 ? 13 : 12);
    text(nodeLabel(b.node), b.x + 4, b.y, b.w - 8, b.h);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function nodeLabel(node) {
  if (node.level === 0) return '8 samples: x[0] … x[7]';
  const list = node.indices.map(i => 'x[' + i + ']').join(', ');
  if (node.level === 1) {
    return (node.path[0] === 'even' ? 'Even: ' : 'Odd: ') + list;
  }
  return list;
}

function drawInfoPanel() {
  const y = 348;
  const h = 66;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);

  if (!selected) {
    fill('dimgray');
    text('Click any node to highlight the path back to the root. Each level ' +
         'halves the problem, so eight samples reach single-sample size in ' +
         'three splits — log2(8) = 3.',
         margin + 12, y + 10, canvasWidth - 2 * margin - 24, h - 18);
    return;
  }

  const n = selected.indices.length;
  fill('black');
  textStyle(BOLD);
  text('This subsequence contains ' + n + ' sample' + (n === 1 ? '' : 's') +
       ': ' + selected.indices.map(i => 'x[' + i + ']').join(', '),
       margin + 12, y + 8, canvasWidth - 2 * margin - 24, 20);
  textStyle(NORMAL);
  fill('dimgray');
  text(n === 1
       ? 'A single sample is already its own transform — nothing left to split. ' +
         'This is where the recursion stops.'
       : 'Splitting it costs one comparison of index parity, an operation done ' +
         'once regardless of N. The work is in recombining the halves afterward, ' +
         'not in the split itself.',
       margin + 12, y + 32, canvasWidth - 2 * margin - 24, h - 40);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(revealLevel < 3 ? 'Splitting… level ' + revealLevel + ' of 3'
                       : 'log2(8) = 3 splits to reach single samples',
       296, drawHeight + 22);
  textSize(defaultTextSize);
}

function startPlay() {
  playPhase = 0;
  revealLevel = 0;
  selected = null;
}

function mousePressed() {
  const hit = boxes.find(b => b.node.level <= revealLevel &&
                              mouseX >= b.x && mouseX <= b.x + b.w &&
                              mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit) selected = hit.node;
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
