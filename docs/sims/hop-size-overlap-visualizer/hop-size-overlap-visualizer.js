// Hop Size Overlap Visualizer MicroSim
// CANVAS_HEIGHT: 420
// Shrinking the hop makes the display update more often, and makes the FFT run
// more often by exactly the same factor.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 260;
let defaultTextSize = 16;

const FRAME = 512;         // fixed, so hop size is the only variable
const FS = 16000;
const STREAM_SAMPLES = 2560;   // width of the stream strip in samples
const FRAME_COLORS = ['rgba(21,101,192,0.35)', 'rgba(230,81,0,0.35)',
                      'rgba(46,125,50,0.35)', 'rgba(123,31,162,0.35)'];

let hopSlider;
let hop = 512;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  hopSlider = createSlider(64, 512, 512, 64);
  hopSlider.position(sliderLeftMargin, drawHeight + 45);
  hopSlider.parent(document.querySelector('main'));

  resizeSliders();

  describe('A stream of samples with successive frame windows drawn as ' +
    'overlapping bars beneath it, and a readout of overlap percentage, update ' +
    'rate, and FFT cost.', LABEL);
}

function draw() {
  updateCanvasSize();
  hop = hopSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawStream();
  drawFrames();
  drawReadout();
  drawControlLabels();
}

function overlapPct() {
  return ((FRAME - hop) / FRAME) * 100;
}

function updatesPerSecond() {
  return FS / hop;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Hop Size and Frame Overlap', canvasWidth / 2, 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function streamGeometry() {
  return {
    left: 40,
    right: canvasWidth - 25,
    top: 48,
    h: 26,
    xOf: s => map(s, 0, STREAM_SAMPLES, 40, canvasWidth - 25)
  };
}

function drawStream() {
  const g = streamGeometry();
  if (g.right <= g.left) return;

  noStroke();
  fill('gainsboro');
  rect(g.left, g.top, g.right - g.left, g.h, 3);

  // A suggestion of samples flowing past
  stroke('gray');
  strokeWeight(1);
  for (let s = 0; s <= STREAM_SAMPLES; s += 128) {
    line(g.xOf(s), g.top, g.xOf(s), g.top + g.h);
  }

  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('continuous sample stream →', g.left, g.top - 4);
  textAlign(RIGHT, BOTTOM);
  text(STREAM_SAMPLES + ' samples shown', g.right, g.top - 4);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawFrames() {
  const g = streamGeometry();
  if (g.right <= g.left) return;
  const top = 92;
  const barH = 22;
  const gap = 5;

  let i = 0;
  let start = 0;
  while (start + FRAME <= STREAM_SAMPLES && i < 12) {
    const y = top + i * (barH + gap);
    if (y + barH > 246) break;
    const x1 = g.xOf(start);
    const x2 = g.xOf(start + FRAME);

    noStroke();
    fill(FRAME_COLORS[i % FRAME_COLORS.length]);
    rect(x1, y, x2 - x1, barH, 3);
    stroke(FRAME_COLORS[i % FRAME_COLORS.length].replace('0.35', '0.9'));
    strokeWeight(1.5);
    noFill();
    rect(x1, y, x2 - x1, barH, 3);

    noStroke();
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text('frame ' + i, x1 + 6, y + barH / 2);

    start += hop;
    i++;
  }

  // Say so when the stack is truncated, rather than capping silently.
  const totalFrames = Math.floor((STREAM_SAMPLES - FRAME) / hop) + 1;
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('each bar is one ' + FRAME + '-sample frame, offset by the hop size' +
       (i < totalFrames ? '  —  showing the first ' + i + ' of ' + totalFrames +
        ' frames in this window' : ''),
       g.left, 250);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawReadout() {
  const y = 272;
  const h = 56;
  const noOverlap = hop === FRAME;
  const costFactor = FRAME / hop;

  stroke(noOverlap ? 'silver' : 'darkorange');
  strokeWeight(noOverlap ? 1 : 2);
  fill(noOverlap ? 'rgba(255,255,255,0.94)' : 'rgba(255,243,224,0.94)');
  rect(margin, y, canvasWidth - 2 * margin, h, 6);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  fill('black');
  text('Frame size: ' + FRAME + '   |   Hop size: ' + hop +
       '   |   Overlap: ' + overlapPct().toFixed(0) + '%' +
       '   |   Updates per second: ' + updatesPerSecond().toFixed(1),
       margin + 12, y + 8);
  textStyle(NORMAL);

  fill(noOverlap ? 'dimgray' : 'chocolate');
  textSize(13);
  text(noOverlap
        ? 'No overlap: each sample is processed exactly once. One FFT per frame, ' +
          '31.3 FFTs per second.'
        : 'Every sample is now processed ' + costFactor + ' times, so the FFT runs ' +
          costFactor + '× as often: ' + updatesPerSecond().toFixed(1) +
          ' FFTs per second instead of 31.3.',
       margin + 12, y + 30, canvasWidth - 2 * margin - 24, 22);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  fill('dimgray');
  text('Frame size: ' + FRAME + ' samples (fixed)', 10, drawHeight + 18);
  fill('black');
  text('Hop size: ' + hop + ' samples', 10, drawHeight + 58);
}

function resizeSliders() {
  hopSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
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
