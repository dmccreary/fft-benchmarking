// MEMS Microphone Cross Section MicroSim
// CANVAS_HEIGHT: 480
// A clickable cut-away of the INMP441 package. Each internal part reveals one
// sentence on what it contributes to turning sound into an I2S bitstream.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const PART_INFO = {
  port: ['Sound Port',
    'The opening in the package lid where air pressure waves get in. Everything ' +
    'downstream is sealed away from the outside world except through this hole.'],
  diaphragm: ['Diaphragm',
    'Vibrates in response to sound pressure, changing its distance from the back ' +
    'plate. This is the only part that physically moves.'],
  backplate: ['Back Plate',
    'A fixed, perforated plate sitting just below the diaphragm. The two together ' +
    'form a capacitor whose value changes as the diaphragm moves. The holes let ' +
    'trapped air escape so the diaphragm can move freely.'],
  asic: ['ASIC',
    'Measures the changing capacitance, then digitizes and encodes it as an I2S ' +
    'bitstream — this is why no separate ADC chip is needed.'],
  sd: ['SD — Serial Data',
    'Carries the actual digitized audio bits, one bit per bit-clock pulse.'],
  ws: ['WS — Word Select',
    'Says which channel the current bits belong to: low for left, high for right. ' +
    'One full cycle of WS is one stereo sample.'],
  sck: ['SCK — Bit Clock',
    'Ticks once per bit. The Pico drives this line, so the Pico sets the pace of ' +
    'the whole transfer.'],
  lr: ['L/R — Channel Select',
    'Tied high or low on your board to tell this microphone which half of the WS ' +
    'cycle it should speak in, so two mics can share one bus.']
};

let parts = [];
let selectedId = null;
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Clear selection');
  resetButton.position(10, drawHeight + 10);
  resetButton.mousePressed(() => { selectedId = null; });
  resetButton.parent(document.querySelector('main'));

  describe('A labeled cut-away diagram of a MEMS microphone package showing the ' +
    'sound port, diaphragm, back plate, ASIC, and four output pins, each ' +
    'clickable to reveal what it does.', LABEL);
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
  drawPackage();
  drawFlowArrows();
  drawParts();
  drawInfoPanel();
  drawControlLabels();
}

// Everything is derived from the current width so the cut-away keeps its
// proportions when the container resizes.
function computeLayout() {
  const panelW = constrain(canvasWidth * 0.32, 150, 250);
  const diagramW = canvasWidth - panelW - 50;
  const px = 30;
  const py = 96;
  const pw = Math.max(160, diagramW);
  const ph = 210;

  const pinW = Math.min(52, pw / 5.2);
  const pinGap = (pw - 4 * pinW) / 5;
  const pinY = py + ph;

  parts = [
    { id: 'port', label: 'Sound Port', color: 'lightskyblue',
      x: px + pw * 0.14, y: py - 8, w: pw * 0.2, h: 18 },
    { id: 'diaphragm', label: 'Diaphragm', color: 'gold',
      x: px + pw * 0.07, y: py + 48, w: pw * 0.36, h: 9 },
    { id: 'backplate', label: 'Back Plate', color: 'silver',
      x: px + pw * 0.07, y: py + 78, w: pw * 0.36, h: 12 },
    { id: 'asic', label: 'ASIC', color: 'mediumseagreen',
      x: px + pw * 0.56, y: py + 44, w: pw * 0.32, h: 92 },
    { id: 'sd', label: 'SD', color: 'coral',
      x: px + pinGap, y: pinY, w: pinW, h: 26 },
    { id: 'ws', label: 'WS', color: 'coral',
      x: px + 2 * pinGap + pinW, y: pinY, w: pinW, h: 26 },
    { id: 'sck', label: 'SCK', color: 'coral',
      x: px + 3 * pinGap + 2 * pinW, y: pinY, w: pinW, h: 26 },
    { id: 'lr', label: 'L/R', color: 'coral',
      x: px + 4 * pinGap + 3 * pinW, y: pinY, w: pinW, h: 26 }
  ];

  parts.packageRect = { x: px, y: py, w: pw, h: ph };
  parts.panel = { x: canvasWidth - panelW - 20, y: 96, w: panelW, h: 250 };
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('MEMS Microphone Cross Section', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text('Click any part of the package to see what it does', canvasWidth / 2, 34);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawPackage() {
  const p = parts.packageRect;
  stroke('dimgray');
  strokeWeight(2);
  fill('gainsboro');
  rect(p.x, p.y, p.w, p.h, 4);

  // Interior cavity
  noStroke();
  fill('white');
  rect(p.x + 8, p.y + 8, p.w - 16, p.h - 16);

  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  text('INMP441 package (cut away)', p.x, p.y + p.h + 46);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawFlowArrows() {
  const dia = parts.find(p => p.id === 'diaphragm');
  const asic = parts.find(p => p.id === 'asic');
  const sd = parts.find(p => p.id === 'sd');
  const port = parts.find(p => p.id === 'port');

  stroke('steelblue');
  strokeWeight(2);

  // Sound pressure entering through the port, down onto the diaphragm
  arrow(port.x + port.w / 2, port.y - 26, port.x + port.w / 2, dia.y - 6);
  // Diaphragm motion read by the ASIC
  arrow(dia.x + dia.w + 4, dia.y + 14, asic.x - 6, asic.y + 30);
  // ASIC output down to the pins
  arrow(asic.x + asic.w / 2, asic.y + asic.h + 4, sd.x + sd.w / 2, sd.y - 8);

  noStroke();
  fill('steelblue');
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('sound', port.x + port.w / 2, port.y - 28);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function arrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  rotate(Math.atan2(y2 - y1, x2 - x1));
  noStroke();
  fill('steelblue');
  triangle(0, 0, -8, -4, -8, 4);
  pop();
}

function drawParts() {
  for (const part of parts) {
    const hovered = hitTest(mouseX, mouseY) === part;
    const selected = selectedId === part.id;

    stroke(selected ? 'crimson' : (hovered ? 'black' : 'dimgray'));
    strokeWeight(selected ? 3 : (hovered ? 2 : 1));
    fill(part.color);

    if (part.id === 'backplate') {
      // Perforated: draw as segments with gaps for the vent holes.
      const holes = 7;
      const segW = part.w / (holes * 2 - 1);
      for (let i = 0; i < holes; i++) {
        rect(part.x + i * segW * 2, part.y, segW, part.h);
      }
    } else if (part.id === 'port') {
      rect(part.x, part.y, part.w, part.h, 2);
    } else {
      rect(part.x, part.y, part.w, part.h, 3);
    }

    noStroke();
    fill('black');
    textSize(12);
    if (part.id === 'asic') {
      textAlign(CENTER, CENTER);
      text('ASIC', part.x + part.w / 2, part.y + part.h / 2);
    } else if (part.h <= 30 && part.y > 300) {
      textAlign(CENTER, CENTER);
      text(part.label, part.x + part.w / 2, part.y + part.h / 2);
    } else {
      textAlign(LEFT, CENTER);
      text(part.label, part.x, part.y - 12);
    }
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawInfoPanel() {
  const p = parts.panel;
  if (p.w < 120) return;

  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(p.x, p.y, p.w, p.h, 10);

  noStroke();
  textAlign(LEFT, TOP);
  if (!selectedId) {
    fill('dimgray');
    textSize(14);
    text('Nothing selected yet.\n\nClick the sound port, diaphragm, back plate, ' +
         'ASIC, or any of the four output pins to read what that part ' +
         'contributes.', p.x + 12, p.y + 12, p.w - 24, p.h - 24);
  } else {
    const info = PART_INFO[selectedId];
    fill('black');
    textStyle(BOLD);
    textSize(16);
    text(info[0], p.x + 12, p.y + 12, p.w - 24, 50);
    textStyle(NORMAL);
    textSize(14);
    text(info[1], p.x + 12, p.y + 62, p.w - 24, p.h - 74);
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('The ASIC is what makes this a digital microphone — no separate ADC needed.',
       130, drawHeight + 24);
  textSize(defaultTextSize);
}

function hitTest(mx, my) {
  return parts.find(p => mx >= p.x && mx <= p.x + p.w &&
                         my >= p.y && my <= p.y + p.h);
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
