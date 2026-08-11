// I2S Protocol Timing Explorer MicroSim
// CANVAS_HEIGHT: 430
// A logic-analyzer view of BCLK, WS, and SD. Stepping one bit at a time makes
// the channel boundary — and which bits belong to which channel — inspectable.

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

const LEFT_SHADE = [225, 238, 250];
const RIGHT_SHADE = [253, 235, 214];

// Fixed sample words so the pattern is stable while stepping.
const LEFT_WORD_BITS = '011010011001011010100101';
const RIGHT_WORD_BITS = '100101100110100101011010';

let wordLength = 16;
let bitIndex = 0;
let isPlaying = false;
let lastAdvance = 0;

let stepBackButton;
let stepForwardButton;
let nextWordButton;
let playButton;
let wordLengthSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  stepBackButton = createButton('◀ Bit');
  stepBackButton.position(10, drawHeight + 5);
  stepBackButton.mousePressed(() => stepBy(-1));
  stepBackButton.parent(document.querySelector('main'));

  stepForwardButton = createButton('Bit ▶');
  stepForwardButton.position(72, drawHeight + 5);
  stepForwardButton.mousePressed(() => stepBy(1));
  stepForwardButton.parent(document.querySelector('main'));

  nextWordButton = createButton('Next word boundary');
  nextWordButton.position(138, drawHeight + 5);
  nextWordButton.mousePressed(jumpToNextWord);
  nextWordButton.parent(document.querySelector('main'));

  playButton = createButton('Play');
  playButton.position(285, drawHeight + 5);
  playButton.mousePressed(togglePlay);
  playButton.parent(document.querySelector('main'));

  // Two positions only: 16-bit and 24-bit words.
  wordLengthSlider = createSlider(16, 24, 16, 8);
  wordLengthSlider.position(sliderLeftMargin, drawHeight + 45);
  wordLengthSlider.size(canvasWidth - sliderLeftMargin - margin);
  wordLengthSlider.parent(document.querySelector('main'));

  describe('Three stacked digital timing traces labeled BCLK, WS, and SD on a ' +
    'shared time axis, with a movable playhead marking the current bit and a ' +
    'readout naming the bit number and its channel.', LABEL);
}

function draw() {
  updateCanvasSize();

  const newLength = wordLengthSlider.value();
  if (newLength !== wordLength) {
    wordLength = newLength;
    bitIndex = Math.min(bitIndex, totalBits() - 1);
  }

  if (isPlaying && millis() - lastAdvance > 420) {
    lastAdvance = millis();
    stepBy(1);
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawChannelShading();
  drawBclkTrace();
  drawWsTrace();
  drawSdTrace();
  drawPlayhead();
  drawReadout();
  drawControlLabels();
}

function totalBits() {
  return wordLength * 2;
}

function isRightChannel(i) {
  return i >= wordLength;
}

function sdBitAt(i) {
  const src = isRightChannel(i) ? RIGHT_WORD_BITS : LEFT_WORD_BITS;
  const pos = isRightChannel(i) ? i - wordLength : i;
  return src[pos] === '1' ? 1 : 0;
}

function geom() {
  const left = 70;
  const right = canvasWidth - 25;
  return {
    left: left,
    right: right,
    cell: (right - left) / totalBits(),
    top: 62,
    bottom: 240
  };
}

function bitX(i) {
  const g = geom();
  return g.left + i * g.cell;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('I2S Protocol Timing Explorer', canvasWidth / 2, 8);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Light blue behind the left-channel bits, light orange behind the right —
// applied across all three traces so the boundary reads as a single event.
function drawChannelShading() {
  const g = geom();
  if (g.right <= g.left) return;
  noStroke();
  fill(LEFT_SHADE[0], LEFT_SHADE[1], LEFT_SHADE[2]);
  rect(g.left, g.top - 6, g.cell * wordLength, g.bottom - g.top + 12);
  fill(RIGHT_SHADE[0], RIGHT_SHADE[1], RIGHT_SHADE[2]);
  rect(g.left + g.cell * wordLength, g.top - 6,
       g.cell * wordLength, g.bottom - g.top + 12);

  fill('steelblue');
  textSize(14);
  textAlign(CENTER, TOP);
  text('LEFT channel', g.left + g.cell * wordLength / 2, g.top - 24);
  fill('chocolate');
  text('RIGHT channel', g.left + g.cell * wordLength * 1.5, g.top - 24);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function traceLabel(name, y, colorName) {
  noStroke();
  fill(colorName);
  textSize(15);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text(name, 62, y);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// One full clock cycle per bit: high for the first half, low for the second.
function drawBclkTrace() {
  const g = geom();
  if (g.right <= g.left) return;
  const hi = 68, lo = 100;
  traceLabel('BCLK', (hi + lo) / 2, 'darkgreen');

  stroke('darkgreen');
  strokeWeight(2);
  noFill();
  for (let i = 0; i < totalBits(); i++) {
    const x0 = bitX(i);
    const xm = x0 + g.cell / 2;
    const x1 = x0 + g.cell;
    line(x0, hi, xm, hi);
    line(xm, hi, xm, lo);
    line(xm, lo, x1, lo);
    if (i < totalBits() - 1) line(x1, lo, x1, hi);
  }
}

function drawWsTrace() {
  const g = geom();
  if (g.right <= g.left) return;
  const hi = 130, lo = 162;
  traceLabel('WS', (hi + lo) / 2, 'darkmagenta');

  stroke('darkmagenta');
  strokeWeight(2);
  noFill();
  const mid = bitX(wordLength);
  line(g.left, lo, mid, lo);      // low = left channel
  line(mid, lo, mid, hi);         // the word-select transition
  line(mid, hi, g.right, hi);     // high = right channel

  noStroke();
  fill('darkmagenta');
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('WS flips here', mid, hi - 4);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawSdTrace() {
  const g = geom();
  if (g.right <= g.left) return;
  const hi = 192, lo = 224;
  traceLabel('SD', (hi + lo) / 2, 'darkblue');

  stroke('darkblue');
  strokeWeight(2);
  noFill();
  let prevY = sdBitAt(0) === 1 ? hi : lo;
  for (let i = 0; i < totalBits(); i++) {
    const x0 = bitX(i);
    const x1 = x0 + g.cell;
    const y = sdBitAt(i) === 1 ? hi : lo;
    if (i > 0 && y !== prevY) line(x0, prevY, x0, y);
    line(x0, y, x1, y);
    prevY = y;
  }

  // Bit values, printed only when there is room for them.
  if (g.cell >= 13) {
    noStroke();
    fill('black');
    textSize(11);
    textAlign(CENTER, TOP);
    for (let i = 0; i < totalBits(); i++) {
      text(sdBitAt(i), bitX(i) + g.cell / 2, lo + 6);
    }
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);
  }
}

function drawPlayhead() {
  const g = geom();
  if (g.right <= g.left) return;
  const x = bitX(bitIndex) + g.cell / 2;
  stroke('crimson');
  strokeWeight(2);
  line(x, g.top - 30, x, g.bottom);
  noStroke();
  fill('crimson');
  triangle(x, g.top - 30, x - 6, g.top - 40, x + 6, g.top - 40);
}

function drawReadout() {
  const panelY = 258;
  const panelH = 78;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, panelY, canvasWidth - 2 * margin, panelH, 8);

  const right = isRightChannel(bitIndex);
  const posInWord = right ? bitIndex - wordLength : bitIndex;

  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  fill(right ? 'chocolate' : 'steelblue');
  text('Bit ' + (posInWord + 1) + ' of ' + wordLength +
       ',  Channel: ' + (right ? 'RIGHT' : 'LEFT'), margin + 12, panelY + 8);
  textStyle(NORMAL);

  // Bits assembled so far in the current word, MSB first.
  const src = right ? RIGHT_WORD_BITS : LEFT_WORD_BITS;
  const collected = src.slice(0, posInWord + 1);
  const full = src.slice(0, wordLength);

  fill('black');
  textSize(13);
  let note;
  if (posInWord === 0) {
    note = right
      ? 'New word starting — Channel: RIGHT. WS just went high.'
      : 'New word starting — Channel: LEFT. WS is low.';
  } else if (posInWord === wordLength - 1) {
    note = 'Word complete: ' + full + '  (' +
           parseInt(full, 2).toLocaleString('en-US') + ' unsigned)';
  } else {
    note = 'Assembled so far: ' + collected;
  }
  text(note, margin + 12, panelY + 34, canvasWidth - 2 * margin - 24, 20);

  fill('dimgray');
  textSize(12);
  text('Each bit is valid on one BCLK pulse. WS says which channel it belongs to.',
       margin + 12, panelY + 56, canvasWidth - 2 * margin - 24, 18);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Word length: ' + wordLength + '-bit', 10, drawHeight + 55);
}

function stepBy(delta) {
  bitIndex = (bitIndex + delta + totalBits()) % totalBits();
}

function jumpToNextWord() {
  bitIndex = isRightChannel(bitIndex) ? 0 : wordLength;
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
  lastAdvance = millis();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  wordLengthSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
