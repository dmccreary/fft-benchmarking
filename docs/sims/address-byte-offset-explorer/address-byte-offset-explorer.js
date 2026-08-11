// Address Byte Offset Explorer MicroSim
// CANVAS_HEIGHT: 490
// Assembly indexes memory in bytes, not elements. For a float array that means
// every index has to be multiplied by 4 before it becomes an address.

let canvasWidth = 400;
let drawHeight = 410;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

const SLOTS = 8;
const BYTES_PER_FLOAT = 4;
const BASE = 0x20001000;

let indexSlider, manualInput;
let index = 3;
let slotBoxes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  indexSlider = createSlider(0, SLOTS - 1, 3, 1);
  indexSlider.position(sliderLeftMargin, drawHeight + 5);
  indexSlider.parent(document.querySelector('main'));

  manualInput = createInput('12');
  manualInput.position(232, drawHeight + 44);
  manualInput.size(60);
  manualInput.parent(document.querySelector('main'));

  describe('A memory strip of eight four-byte float slots with byte addresses, ' +
    'above a calculator showing the byte offset, the full address, and the ' +
    'resulting VLDR instruction.', LABEL);
}

function draw() {
  updateCanvasSize();
  index = indexSlider.value();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  computeLayout();
  drawTitle();
  drawMemoryStrip();
  drawCalculator();
  drawAlignmentCheck();
  drawControlLabels();
}

function computeLayout() {
  const left = 30;
  const right = canvasWidth - 30;
  const w = (right - left) / SLOTS;
  slotBoxes = [];
  for (let i = 0; i < SLOTS; i++) {
    slotBoxes.push({ i: i, x: left + w * i, y: 70, w: w, h: 62 });
  }
}

function addrHex(v) {
  return '0x' + (v >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

function offsetOf(i) {
  return i * BYTES_PER_FLOAT;
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Address and Byte Offset Explorer', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('An array of 32-bit floats at base ' + addrHex(BASE), canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawMemoryStrip() {
  for (const b of slotBoxes) {
    const sel = b.i === index;
    stroke(sel ? 'black' : 'gray');
    strokeWeight(sel ? 3 : 1);
    fill(sel ? 'gold' : 'white');
    rect(b.x, b.y, b.w, b.h, 3);

    noStroke();
    fill('black');
    textSize(13);
    textStyle(sel ? BOLD : NORMAL);
    textAlign(CENTER, TOP);
    text('[' + b.i + ']', b.x + b.w / 2, b.y + 8);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(11);
    text('4 bytes', b.x + b.w / 2, b.y + 28);

    // Byte address under each slot
    fill(sel ? 'crimson' : 'dimgray');
    textSize(Math.min(11, b.w * 0.16));
    text(addrHex(BASE + offsetOf(b.i)), b.x + b.w / 2, b.y + b.h + 5);
    fill(sel ? 'crimson' : 'gray');
    textSize(Math.min(11, b.w * 0.16));
    text('+' + offsetOf(b.i), b.x + b.w / 2, b.y + b.h + 20);
  }

  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('element index', slotBoxes[0].x, slotBoxes[0].y - 6);
  textAlign(RIGHT, BOTTOM);
  text('byte address / offset from base →',
       slotBoxes[SLOTS - 1].x + slotBoxes[SLOTS - 1].w, slotBoxes[0].y - 6);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCalculator() {
  const y = 176;
  const h = 116;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const off = offsetOf(index);

  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(14);
  text('Byte offset', margin + 14, y + 10);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text('offset = index × bytes per element', margin + 14, y + 32);
  textSize(17);
  fill('mediumblue');
  textStyle(BOLD);
  text('offset = ' + index + ' × 4 = ' + off + ' bytes', margin + 14, y + 52);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text('full address = ' + addrHex(BASE) + ' + ' + off + ' = ' +
       addrHex(BASE + off), margin + 14, y + 82);

  // The instruction it produces
  const ix = margin + (canvasWidth - 2 * margin) * 0.56;
  stroke('darkgreen');
  strokeWeight(2);
  fill('honeydew');
  rect(ix, y + 22, canvasWidth - margin - ix - 14, 66, 6);
  noStroke();
  fill('darkgreen');
  textSize(12);
  textAlign(LEFT, TOP);
  text('the instruction this produces', ix + 12, y + 30);
  textStyle(BOLD);
  textSize(19);
  text('VLDR s0, [r0, #' + off + ']', ix + 12, y + 50);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawAlignmentCheck() {
  const raw = parseInt(manualInput.value(), 10);
  const valid = !isNaN(raw);
  const aligned = valid && raw % BYTES_PER_FLOAT === 0 && raw >= 0;
  const inRange = aligned && raw / BYTES_PER_FLOAT < SLOTS;

  const y = 306;
  const h = 84;
  stroke(aligned ? (inRange ? 'darkgreen' : 'darkorange') : 'crimson');
  strokeWeight(2);
  fill(aligned ? (inRange ? 'honeydew' : 'oldlace') : 'mistyrose');
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  fill(aligned ? (inRange ? 'darkgreen' : 'darkorange') : 'crimson');
  text('Alignment check on a manually typed offset', margin + 14, y + 8);
  textStyle(NORMAL);

  textSize(13);
  fill('black');
  if (!valid) {
    text('Enter a number to check it.', margin + 14, y + 32);
  } else if (!aligned) {
    text('#' + raw + ' is not a multiple of 4, so it does not land on any ' +
         'element boundary. It points partway into element ' +
         Math.floor(raw / 4) + ' — the assembler will accept it and the ' +
         'loaded value will be garbage.',
         margin + 14, y + 32, canvasWidth - 2 * margin - 28, 46);
  } else if (!inRange) {
    text('#' + raw + ' is correctly aligned but past the end of this ' +
         SLOTS + '-element array. It reads whatever happens to follow in ' +
         'memory — no bounds check exists in assembly.',
         margin + 14, y + 32, canvasWidth - 2 * margin - 28, 46);
  } else {
    text('#' + raw + ' is a multiple of 4 and within the array — it addresses ' +
         'element [' + (raw / 4) + '] exactly.',
         margin + 14, y + 32, canvasWidth - 2 * margin - 28, 46);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Element index: ' + index, 10, drawHeight + 15);
  text('Check offset  #', 10, drawHeight + 55);
  fill('dimgray');
  textSize(13);
  text('type any byte offset to test whether it is element-aligned',
       306, drawHeight + 55);
}

function mousePressed() {
  const hit = slotBoxes.find(b => mouseX >= b.x && mouseX <= b.x + b.w &&
                                  mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit) indexSlider.value(hit.i);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  indexSlider.size(Math.max(60, canvasWidth - sliderLeftMargin - margin));
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
