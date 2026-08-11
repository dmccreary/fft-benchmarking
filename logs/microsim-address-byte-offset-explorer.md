# MicroSim Build Log: Address and Byte Offset Explorer

- **MicroSim ID:** `address-byte-offset-explorer`
- **Chapter:** 22 — Talking to the FPU: Floating-Point Assembly
- **Library:** p5.js 1.11.10
- **Bloom level:** Apply (calculate, demonstrate)
- **Canvas height:** 490 (iframe 492px)
- **Date:** 2026-08-11

## Learning Objective

Apply the byte-offset formula to compute the correct `VLDR` offset for a chosen
element index in a typed array of floats.

## Design Decisions

**Layout.** The spec called for a 200px memory strip over a 300px calculator.
The strip needed less than 200px once the per-slot address and offset labels
were placed below the boxes rather than inside them, so the final split is a
~150px strip band, a 116px calculator panel, and an 84px alignment-check panel,
totalling 410px of draw area plus 80px of controls.

**Two labels per slot, not one.** The spec asked for the byte address; the
offset from the base is what actually appears in the instruction, so both are
shown. Colouring the selected slot's pair crimson ties the strip to the
calculator without a connecting line.

**The instruction gets its own box.** `VLDR s0, [r0, #12]` is the deliverable of
the whole calculation, so it sits in a bordered green box at 19px rather than
being another line of the formula. A student who reads nothing else should read
that line.

**Misalignment is a live check, not a footnote.** The spec listed the
non-multiple-of-4 warning as optional. It was made a permanent panel with three
states — aligned and in range, aligned but past the end, and misaligned —
because "the assembler will accept it and the loaded value will be garbage" is
the point of the whole chapter, not an aside. The panel border and fill change
colour with the state (green / orange / red) so the verdict is readable before
the sentence is.

**Clickable slots.** The slider is the primary control, but clicking a slot
directly is the gesture most students try first, so `mousePressed()` hit-tests
the strip and writes back into the slider.

## Bug Found and Fixed

**`hex` is a reserved p5.js global.** The first build defined
`function hex(v) { return '0x' + ... }` and every address rendered without its
`0x` prefix. p5 logs a friendly warning to the console — "p5 had problems
creating the global function `hex`" — and keeps its own `hex()`, which formats a
number as hex digits with no prefix. The captured screenshot showed
`20001000` instead of `0x20001000`; a zoomed crop of the PNG confirmed the
prefix really was absent rather than just small. Renamed to `addrHex()`, after
which `page.evaluate("addrHex(0x20001000)")` returned `0x20001000` and the
console was clean.

This is exactly the reserved-name hazard the project's p5 guidance warns about,
and it failed silently in the rendering rather than loudly at load time.

## Verification

- Playwright capture at exactly 800×492, console and pageerror listeners both
  empty on the final build.
- Screenshot reviewed: all eight addresses fit inside their slots at 800px
  width, including the widest label `0x2000101C`.
- Offset arithmetic spot-checked against the strip: index 3 → offset 12 →
  `0x2000100C` → `VLDR s0, [r0, #12]`, matching the spec's worked example.
- Alignment panel exercised with 14 (misaligned, reported as partway into
  element 3), 12 (aligned, element 3), and 40 (aligned, past the end).
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
