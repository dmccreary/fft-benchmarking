// Instruction Encoding Bit Builder MicroSim
// CANVAS_HEIGHT: 470
// Build the 32-bit Thumb-2 word for VFMA.F32 from three register choices, then
// disassemble it back. The encoding here is the real ARMv8-M one, verified
// against an assembler.

let canvasWidth = 400;
let drawHeight = 388;
let controlHeight = 82;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// VFMA{<c>}.F32 <Sd>, <Sn>, <Sm>   encoding T1:
//   1110 1110 1 D 1 0 Vn | Vd 101 sz N 0 M 0 Vm
// A single-precision register Sx is split: Vx holds x>>1, the extra bit holds
// x&1. That is why the register fields are not contiguous.
const FIELD = {};
(function buildFieldMap() {
  for (let b = 0; b <= 31; b++) FIELD[b] = 'fixed';
  FIELD[22] = 'sd';                                   // D
  for (let b = 19; b >= 16; b--) FIELD[b] = 'sn';     // Vn
  for (let b = 15; b >= 12; b--) FIELD[b] = 'sd';     // Vd
  FIELD[7] = 'sn';                                    // N
  FIELD[5] = 'sm';                                    // M
  for (let b = 3; b >= 0; b--) FIELD[b] = 'sm';       // Vm
})();

const COLORS = {
  fixed: '#cfd8dc',
  sd: '#ef9a9a',
  sn: '#a5d6a7',
  sm: '#ce93d8'
};

// The floating-point three-register space, indexed by bit 23, bits 21-20 and
// bit 6. Flipping any one of those four bits lands on a different instruction.
const MNEMONICS = {
  '0:0:0': 'VMLA',  '0:0:1': 'VMLS',
  '0:1:0': 'VNMLS', '0:1:1': 'VNMLA',
  '0:2:0': 'VMUL',  '0:2:1': 'VNMUL',
  '0:3:0': 'VADD',  '0:3:1': 'VSUB',
  '1:0:0': 'VDIV',  '1:0:1': null,
  '1:1:0': 'VFNMS', '1:1:1': 'VFNMA',
  '1:2:0': 'VFMA',  '1:2:1': 'VFMS',
  '1:3:0': null,    '1:3:1': null
};

let sdSelect, snSelect, smSelect, assembleButton, disButton, flipCheckbox;
let word = 0;
let edited = false;
let flipped = -1;             // bit index changed by the random-flip checkbox
let flashBits = [];
let flashUntil = 0;
let disassembly = null;
let cellRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sdSelect = makeRegSelect(82, 2);      // the chapter's worked example:
  snSelect = makeRegSelect(224, 0);     // VFMA s2, s0, s1
  smSelect = makeRegSelect(366, 1);

  assembleButton = createButton('Assemble word');
  assembleButton.position(10, drawHeight + 46);
  assembleButton.mousePressed(assembleFromSelectors);
  assembleButton.parent(document.querySelector('main'));

  disButton = createButton('Disassemble');
  disButton.position(126, drawHeight + 46);
  disButton.mousePressed(() => { disassembly = decode(word); });
  disButton.parent(document.querySelector('main'));

  flipCheckbox = createCheckbox(' Flip one random bit', false);
  flipCheckbox.position(226, drawHeight + 48);
  flipCheckbox.style('font-size', '14px');
  flipCheckbox.changed(onFlipToggle);
  flipCheckbox.parent(document.querySelector('main'));

  assembleFromSelectors();

  describe('A 32-bit grid in two halfword rows, colored by encoding bit field, ' +
    'built live from three register selectors, with the assembled hex word and ' +
    'a disassembly check below it.', LABEL);
}

function makeRegSelect(x, def) {
  const s = createSelect();
  for (let i = 0; i < 8; i++) s.option('s' + i);
  s.selected('s' + def);
  s.position(x, drawHeight + 8);
  s.changed(assembleFromSelectors);
  s.parent(document.querySelector('main'));
  return s;
}

function regNum(sel) { return Number(sel.value().slice(1)); }

function encode(sd, sn, sm) {
  const Vd = (sd >> 1) & 0xF, D = sd & 1;
  const Vn = (sn >> 1) & 0xF, Nb = sn & 1;
  const Vm = (sm >> 1) & 0xF, M = sm & 1;
  let w = 0;
  w |= 0xE << 28;      // 1110 — every 32-bit Thumb FP instruction starts here
  w |= 0xE << 24;      // 1110
  w |= 1 << 23;        // opc1<3>
  w |= D << 22;        // Sd low bit
  w |= 1 << 21;        // opc1<1>
  w |= 0 << 20;        // opc1<0>
  w |= Vn << 16;
  w |= Vd << 12;
  w |= 5 << 9;         // 101 — floating-point data processing
  w |= 0 << 8;         // sz = 0 -> single precision
  w |= Nb << 7;        // Sn low bit
  w |= 0 << 6;         // op = 0 -> VFMA (1 would be VFMS)
  w |= M << 5;         // Sm low bit
  w |= 0 << 4;
  w |= Vm;
  return w >>> 0;
}

function canonicalWord() {
  return encode(regNum(sdSelect), regNum(snSelect), regNum(smSelect));
}

function assembleFromSelectors() {
  const next = canonicalWord();
  const changed = [];
  for (let b = 0; b <= 31; b++) {
    if (((word >>> b) & 1) !== ((next >>> b) & 1)) changed.push(b);
  }
  flashBits = changed;
  flashUntil = millis() + 1200;
  word = next;
  edited = false;
  flipped = -1;
  if (flipCheckbox && flipCheckbox.checked()) flipCheckbox.checked(false);
  disassembly = null;
}

function onFlipToggle() {
  if (flipCheckbox.checked()) {
    flipped = Math.floor(Math.random() * 32);
    word = (word ^ (1 << flipped)) >>> 0;
    edited = true;
    flashBits = [flipped];
    flashUntil = millis() + 1600;
  } else {
    assembleFromSelectors();
  }
  disassembly = null;
}

function decode(w) {
  const bit = b => (w >>> b) & 1;
  const fld = (hi, lo) => (w >>> lo) & ((1 << (hi - lo + 1)) - 1);

  if (fld(31, 24) !== 0xEE) {
    return { ok: false, why: 'Bits 31-24 are ' + hex8(fld(31, 24), 2) +
      ', not 0xEE — this is not a VFP data-processing instruction at all.' };
  }
  if (fld(11, 9) !== 5) {
    return { ok: false, why: 'Bits 11-9 are not 101, so this does not decode ' +
      'as a floating-point data-processing instruction.' };
  }
  if (bit(4) !== 0) {
    return { ok: false, why: 'Bit 4 must be 0 in this encoding; it is 1.' };
  }
  const key = bit(23) + ':' + fld(21, 20) + ':' + bit(6);
  const mnem = MNEMONICS[key];
  if (!mnem) {
    return { ok: false, why: 'Opcode bits 23, 21-20 and 6 select an undefined ' +
      'slot in the floating-point three-register table.' };
  }
  const dbl = bit(8) === 1;
  const sd = (fld(15, 12) << 1) | bit(22);
  const sn = (fld(19, 16) << 1) | bit(7);
  const sm = (fld(3, 0) << 1) | bit(5);
  return {
    ok: true, mnem: mnem, dbl: dbl, sd: sd, sn: sn, sm: sm,
    text: mnem + (dbl ? '.F64' : '.F32') + '  ' +
          (dbl ? 'd?, d?, d?' : 's' + sd + ', s' + sn + ', s' + sm)
  };
}

function hex8(v, digits) {
  return '0x' + (v >>> 0).toString(16).toUpperCase().padStart(digits || 8, '0');
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  cellRects = [];
  drawTitle();
  drawHalfword(31, 'First halfword — bits 31 to 16', 54, 70, 82);
  drawHalfword(15, 'Second halfword — bits 15 to 0', 120, 136, 148);
  drawLegend(188);
  drawHexPanel(212);
  drawDisassemblyPanel(278);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(21);
  text('Hand-Encoding VFMA.F32, Bit Field by Bit Field', canvasWidth / 2, 6);
  textSize(13);
  fill('dimgray');
  text('Click any bit to edit it by hand — the grid is the instruction, ' +
       'not a picture of one', canvasWidth / 2, 32);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawHalfword(startBit, label, labelY, numY, cellY) {
  const left = margin;
  const w = canvasWidth - 2 * margin;
  const cw = w / 16;
  const ch = 32;

  noStroke();
  fill('dimgray');
  textSize(11.5);
  textAlign(LEFT, TOP);
  text(label, left, labelY);

  for (let i = 0; i < 16; i++) {
    const b = startBit - i;
    const x = left + i * cw;
    const v = (word >>> b) & 1;
    const flashing = millis() < flashUntil && flashBits.includes(b);

    noStroke();
    fill('dimgray');
    textSize(9.5);
    textAlign(CENTER, TOP);
    text(b, x + cw / 2, numY);

    stroke(flashing ? 'darkorange' : b === flipped ? 'crimson' : 'gray');
    strokeWeight(flashing || b === flipped ? 3 : 1);
    fill(COLORS[FIELD[b]]);
    rect(x + 1, cellY, cw - 2, ch, 3);

    noStroke();
    fill('black');
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(v, x + cw / 2, cellY + ch / 2);
    textStyle(NORMAL);

    cellRects.push({ b: b, x: x + 1, y: cellY, w: cw - 2, h: ch });
  }
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawLegend(y) {
  const items = [
    ['fixed', 'opcode + fixed bits'],
    ['sd', 'Sd  (bits 15-12 and 22)'],
    ['sn', 'Sn  (bits 19-16 and 7)'],
    ['sm', 'Sm  (bits 3-0 and 5)']
  ];
  let x = margin;
  textSize(11.5);
  textAlign(LEFT, CENTER);
  for (const [k, lbl] of items) {
    stroke('gray');
    strokeWeight(1);
    fill(COLORS[k]);
    rect(x, y, 13, 13, 2);
    noStroke();
    fill('dimgray');
    text(lbl, x + 18, y + 7);
    x += 22 + textWidth(lbl) + 20;
  }
  textSize(defaultTextSize);
}

function drawHexPanel(y) {
  const h = 58;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  const canon = canonicalWord();
  const matchesSelectors = word === canon;

  noStroke();
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(12);
  text('Assembled 32-bit word', margin + 12, y + 8);

  fill(matchesSelectors ? 'mediumblue' : 'crimson');
  textSize(24);
  textStyle(BOLD);
  text(hex8(word), margin + 12, y + 24);
  textStyle(NORMAL);

  const px = margin + 190;
  fill('dimgray');
  textSize(12);
  text('what you would put in the source', px, y + 8);
  fill('black');
  textSize(15);
  text('data(4, ' + hex8(word) + ')', px, y + 26);

  const rx = margin + 430;
  if (rx < canvasWidth - margin - 130) {
    fill('dimgray');
    textSize(12);
    text('you selected', rx, y + 8);
    fill('black');
    textSize(15);
    text('VFMA.F32  s' + regNum(sdSelect) + ', s' + regNum(snSelect) +
         ', s' + regNum(smSelect), rx, y + 26);
    fill(matchesSelectors ? 'darkgreen' : 'crimson');
    textSize(11.5);
    text(matchesSelectors ? 'grid matches the selectors'
                          : 'grid has been edited by hand', rx, y + 44);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawDisassemblyPanel(y) {
  const h = 100;
  const d = disassembly;
  const good = d && d.ok && !d.dbl &&
               d.mnem === 'VFMA' && d.sd === regNum(sdSelect) &&
               d.sn === regNum(snSelect) && d.sm === regNum(smSelect);

  stroke(!d ? 'silver' : good ? 'darkgreen' : 'crimson');
  strokeWeight(d ? 2 : 1);
  fill(!d ? color(255, 255, 255, 240)
          : good ? color(240, 250, 240) : color(255, 240, 240));
  rect(margin, y, canvasWidth - 2 * margin, h, 8);

  noStroke();
  textAlign(LEFT, TOP);

  if (!d) {
    fill('dimgray');
    textSize(13);
    text('Encoding verification: press Disassemble to decode the word above ' +
         'back into a mnemonic and operands, independently of how it was ' +
         'built. This is the step you must never skip — a hand-encoded word ' +
         'that is wrong produces no error, just a different instruction.',
         margin + 12, y + 10, canvasWidth - 2 * margin - 24, h - 20);
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);
    return;
  }

  fill('dimgray');
  textSize(12);
  text('Disassembling ' + hex8(word) + ' gives', margin + 12, y + 8);

  if (!d.ok) {
    fill('crimson');
    textSize(20);
    textStyle(BOLD);
    text('undefined instruction', margin + 12, y + 24);
    textStyle(NORMAL);
    textSize(12.5);
    text(d.why, margin + 12, y + 52, canvasWidth - 2 * margin - 24, 40);
  } else {
    fill(good ? 'darkgreen' : 'crimson');
    textSize(22);
    textStyle(BOLD);
    text(d.text, margin + 12, y + 24);
    textStyle(NORMAL);
    textSize(12.5);
    if (good) {
      text('Matches your selections exactly. The word decodes back to the ' +
           'instruction you meant, which is independent confirmation that ' +
           'every bit field landed in the right place.',
           margin + 12, y + 54, canvasWidth - 2 * margin - 24, 40);
    } else {
      const want = 'VFMA.F32  s' + regNum(sdSelect) + ', s' +
                   regNum(snSelect) + ', s' + regNum(smSelect);
      text('You meant ' + want + '. This word is a different, perfectly ' +
           'legal instruction — the CPU will execute it without complaint and ' +
           'your results will simply be wrong. One bit is all it takes.',
           margin + 12, y + 54, canvasWidth - 2 * margin - 24, 40);
    }
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Sd (dest)', 12, drawHeight + 22);
  text('Sn (op 1)', 154, drawHeight + 22);
  text('Sm (op 2)', 296, drawHeight + 22);
  fill('dimgray');
  textSize(12.5);
  text('VFMA.F32 Sd, Sn, Sm  —  Sd += Sn × Sm, with one rounding',
       440, drawHeight + 22);
  text(edited ? 'hand-edited — press Assemble word to rebuild from the selectors'
              : 'the grid is the canonical encoding for these three registers',
       410, drawHeight + 60);
}

function mousePressed() {
  const hit = cellRects.find(c => mouseX >= c.x && mouseX <= c.x + c.w &&
                                  mouseY >= c.y && mouseY <= c.y + c.h);
  if (!hit) return;
  word = (word ^ (1 << hit.b)) >>> 0;
  edited = word !== canonicalWord();
  flashBits = [hit.b];
  flashUntil = millis() + 900;
  disassembly = null;
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
