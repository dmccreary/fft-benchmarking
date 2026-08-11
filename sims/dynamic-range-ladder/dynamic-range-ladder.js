// Dynamic Range Ladder MicroSim
// CANVAS_HEIGHT: 500
// One vertical amplitude scale showing clipping, headroom, the working range,
// and the noise floor as positions on a single continuous ladder — plus what
// one extra bit of depth buys you.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const BASE_BITS = 16;

// Base heights in pixels. The extra-bit toggle moves height out of the noise
// floor and into the usable range, which is what a bit of depth actually buys.
const ZONES = [
  { id: 'clip', label: 'Clipping zone', color: 'crimson', h: 58,
    definition: 'Any sample that would land above the full scale value cannot be ' +
      'represented, so it gets forced down to full scale.',
    consequence: 'Consequence: the waveform peaks are flattened. This is clipping ' +
      'distortion, and it is not recoverable — the original values are gone.' },
  { id: 'headroom', label: 'Headroom', color: 'gold', h: 62,
    definition: 'Deliberately unused space between your typical signal level and ' +
      'full scale.',
    consequence: 'Consequence: an unexpected loud transient has somewhere to go ' +
      'instead of clipping. Headroom is insurance you pay for in signal-to-noise ' +
      'ratio.' },
  { id: 'typical', label: 'Typical signal level', color: 'mediumseagreen', h: 118,
    definition: 'The working range where you want your signal to sit most of the ' +
      'time — well above the noise, comfortably below full scale.',
    consequence: 'Consequence: this is where the numbers in your sample buffer ' +
      'carry the most real information per bit.' },
  { id: 'noise', label: 'Noise floor', color: 'silver', h: 66,
    definition: 'The level of the electrical and quantization noise that is ' +
      'always present, even with no signal at all.',
    consequence: 'Consequence: a signal down here is buried. No amount of gain ' +
      'later recovers it, because the noise gets amplified along with it.' },
  { id: 'silence', label: 'Silence / below noise floor', color: 'dimgray', h: 46,
    definition: 'Amplitudes smaller than the noise floor.',
    consequence: 'Consequence: indistinguishable from nothing. This region is ' +
      'why dynamic range, not bit count alone, sets what you can actually hear.' }
];

let selectedId = 'typical';
let extraBitCheckbox;
let bar = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  extraBitCheckbox = createCheckbox(' Add 1 bit of depth', false);
  extraBitCheckbox.position(10, drawHeight + 14);
  extraBitCheckbox.parent(document.querySelector('main'));

  describe('A vertical amplitude ladder with clipping, headroom, typical signal, ' +
    'noise floor, and silence zones, each clickable to explain what happens to a ' +
    'signal there.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeLayout();
  drawTitle();
  drawLadder();
  drawInfoPanel();
  drawControlLabels();
}

function bits() {
  return extraBitCheckbox.checked() ? BASE_BITS + 1 : BASE_BITS;
}

function dynamicRangeDb() {
  return Math.round(6.02 * bits());
}

// One extra bit lowers the noise floor by about 6 dB. On this ladder that is
// 28px taken off the noise band and given to the usable range.
function zoneHeights() {
  const shift = extraBitCheckbox.checked() ? 28 : 0;
  return ZONES.map(z => {
    if (z.id === 'noise') return { ...z, h: z.h - shift };
    if (z.id === 'typical') return { ...z, h: z.h + shift };
    return { ...z };
  });
}

function computeLayout() {
  const barW = constrain(canvasWidth * 0.22, 100, 150);
  const barX = 110;
  let y = 68;
  bar.zones = zoneHeights().map(z => {
    const r = { ...z, x: barX, y: y, w: barW, h: z.h };
    y += z.h;
    return r;
  });
  bar.x = barX;
  bar.w = barW;
  bar.top = 68;
  bar.bottom = y;
  bar.panel = {
    x: barX + barW + 90,
    y: 68,
    w: Math.max(0, canvasWidth - (barX + barW + 90) - 20),
    h: y - 68
  };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Dynamic Range Ladder', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text(bits() + '-bit depth  •  about ' + dynamicRangeDb() + ' dB of dynamic range',
       canvasWidth / 2, 34);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawLadder() {
  for (const z of bar.zones) {
    const selected = selectedId === z.id;
    const hovered = hitTest(mouseX, mouseY) === z;

    stroke(selected ? 'black' : 'white');
    strokeWeight(selected ? 3 : 1);
    fill(z.color);
    rect(z.x, z.y, z.w, z.h);

    noStroke();
    fill(z.id === 'silence' || z.id === 'clip' ? 'white' : 'black');
    textSize(13);
    textAlign(CENTER, CENTER);
    if (z.h >= 30) {
      text(z.label, z.x + 4, z.y, z.w - 8, z.h);
    }

    if (hovered && !selected) {
      noFill();
      stroke('black');
      strokeWeight(2);
      rect(z.x, z.y, z.w, z.h);
    }
  }

  // Boundary annotations on the left, in dBFS.
  const clip = bar.zones[0];
  const noise = bar.zones[3];
  const fullScaleY = clip.y + clip.h;

  stroke('black');
  strokeWeight(2);
  line(bar.x - 42, fullScaleY, bar.x + bar.w, fullScaleY);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(RIGHT, CENTER);
  text('Full scale\n0 dBFS', bar.x - 48, fullScaleY);

  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(bar.x - 42, noise.y, bar.x + bar.w, noise.y);
  drawingContext.setLineDash([]);
  noStroke();
  fill('dimgray');
  textAlign(RIGHT, CENTER);
  text('Noise floor\n-' + dynamicRangeDb() + ' dBFS', bar.x - 48, noise.y);

  // Range arrow between the two boundaries
  stroke('darkgreen');
  strokeWeight(2);
  const ax = bar.x + bar.w + 22;
  line(ax, fullScaleY, ax, noise.y);
  line(ax - 5, fullScaleY + 6, ax, fullScaleY);
  line(ax + 5, fullScaleY + 6, ax, fullScaleY);
  line(ax - 5, noise.y - 6, ax, noise.y);
  line(ax + 5, noise.y - 6, ax, noise.y);

  push();
  noStroke();
  fill('darkgreen');
  textSize(13);
  translate(ax + 16, (fullScaleY + noise.y) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('usable range', 0, 0);
  pop();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawInfoPanel() {
  const p = bar.panel;
  if (p.w < 130) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(p.x, p.y, p.w, p.h, 10);

  const z = bar.zones.find(x => x.id === selectedId);
  if (!z) return;

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(16);
  text(z.label, p.x + 12, p.y + 12, p.w - 24, 44);
  textStyle(NORMAL);

  textSize(14);
  text(z.definition, p.x + 12, p.y + 58, p.w - 24, 110);

  fill('darkslategray');
  text(z.consequence, p.x + 12, p.y + 172, p.w - 24, p.h - 190);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(extraBitCheckbox.checked()
        ? 'One more bit dropped the noise floor about 6 dB and gave that space to the usable range.'
        : 'Click any band. Then add a bit of depth and watch which band grows.',
       190, drawHeight + 24);
  textSize(defaultTextSize);
}

function hitTest(mx, my) {
  return bar.zones.find(z => mx >= z.x && mx <= z.x + z.w &&
                             my >= z.y && my <= z.y + z.h);
}

function mousePressed() {
  const hit = hitTest(mouseX, mouseY);
  if (hit) selectedId = hit.id;
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
