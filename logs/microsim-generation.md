# MicroSim Generation: Session Log

**Date:** 2026-08-11
**Scope:** Generate every MicroSim specified by a `#### Diagram:` block in
`docs/chapters/`, from spec extraction through to a published gallery.
**Result:** 58 MicroSims built, one git commit each, one build log each.

Per-sim build logs live alongside this file as
`logs/microsim-<sim-id>.md`. This document covers the run as a whole: the
pipeline, what it produced, the recurring defects it caught, and the open items
it left behind.

---

## 1. What Was Built

| | |
|---|---|
| MicroSims generated | **58** |
| Chapters covered | **27 of 27** (every chapter has at least one) |
| Files per sim | 5 — `main.html`, `<id>.js`, `index.md`, `metadata.json`, `<id>.png` |
| Per-sim build logs | 58 |
| Commits | 58 sim commits + 4 gallery/nav regenerations |
| Validation | 58 of 58 score **100/100, grade A** |
| Iframe height suite | 59 PASS · 0 FAIL · 0 ERROR · 1 SKIP (60 sims) |

**By library**

| Library | Count |
|---|---|
| p5.js 1.11.10 | 49 |
| Chart.js 4.4.0 | 7 |
| vis-network | 2 |

**By Bloom's level**

| Level | Count |
|---|---|
| Apply | 19 |
| Understand | 18 |
| Analyze | 16 |
| Evaluate | 5 |

**By chapter** — 1:2, 2:2, 3:3, 4:2, 5:2, 6:2, 7:3, 8:3, 9:4, 10:1, 11:3, 12:2,
13:1, 14:3, 15:4, 16:4, 17:3, 18:2, 19:2, 20:1, 21:1, 22:1, 23:1, 24:2, 25:1,
26:1, 27:2.

Canvas heights range from 385 to 595 px, median 480.

The two remaining entries in the 60-card gallery — `graph-viewer` and
`timeline` — are pre-existing scaffold sims from the book template, not chapter
MicroSims. They were left untouched.

---

## 2. Phase 1 — Spec Extraction and Scaffolding

Three scripts from the `microsim-utils` skill did the setup:

1. `create-microsim-todo-json-files.py` scanned every
   `docs/chapters/*/index.md` for `#### Diagram:` headers and wrote **58 JSON
   specs** into `docs/sims/TODO/`. Each carries the sim id, library, Bloom
   level, learning objective, chapter metadata, and the full specification text
   from the chapter's `<details>` block.
2. `scaffold-microsims-from-todo.py` created 58 stub directories.
3. Everything after that was authored per sim.

The TODO JSONs were kept, not deleted — they are the authored specification of
record, and each build log cites the spec it was built against.

---

## 3. The Per-Sim Pipeline

Every sim went through the same ten steps. The pipeline is the reason 58 of 58
landed at grade A rather than most of them.

1. **Read the spec** from `docs/sims/TODO/<id>.json` — layout, controls,
   required behaviors, and the exact strings the chapter expects.
2. **Design against the Bloom verb, not the topic.** Understand → step-through
   with visible state, never a continuous animation. Apply → a calculator or
   parameter explorer that produces a specific answer. Analyze → side-by-side
   comparison. Evaluate → a judgment with the criteria on screen.
3. **Write `main.html` and the `.js`**, with `// CANVAS_HEIGHT: <int>` in the
   first ten lines as the single source of truth for the iframe height.
4. **Capture a screenshot** at exactly `CANVAS_HEIGHT + 2` px with headless
   Chromium, with `pageerror` and console-error listeners attached. A sim that
   logged anything was not considered done.
5. **Read the PNG.** Every screenshot was visually reviewed, not merely
   generated. This is where most defects were found — see §5.
6. **Patch and re-capture** until the layout was clean in every state the sim
   can reach, including the longest text and the error states.
7. **Write `index.md`** — front matter, iframe, embed snippet, "About This
   MicroSim", "How to Use", a full lesson plan, related resources, references.
8. **Write `metadata.json`** — Dublin-Core-style descriptors plus educational,
   technical, simulation-model, and pedagogical blocks.
9. **Run the three checks:** `sync-iframe-heights.py`, `validate-sims.py`,
   `test-iframe-heights.py` (Playwright, confirms every control is inside the
   iframe).
10. **Write `logs/microsim-<id>.md` and commit.** One sim, one commit.

### Screenshot capture

`bk-capture-screenshot` renders at target + 200 px and crops, which shifts any
`100vh` layout — vis-network and Chart.js sims centered against the wrong
viewport. Replaced with a small exact-viewport Playwright helper, which also
made it possible to drive the sim into a specific state before capturing
(a mispredicted branch, a corrupted instruction word, a scrambled prediction).

---

## 4. Verification Beyond the Checklist

Where a sim computes something checkable, it was checked against an independent
source rather than against itself.

- **`instruction-encoding-bit-builder`** — the VFMA encoder was verified against
  a real toolchain. Four instructions assembled with
  `clang -target thumbv8m.main-none-eabi -mcpu=cortex-m33` and disassembled with
  `llvm-objdump` matched `encode()` exactly: `eea0 1a20`, `eea0 0a81`,
  `eee3 3aa3`, `eea0 0a00`.
- **`iterative-fft-stage-loop-visualizer` vs `eight-point-dft-by-hand-calculator`**
  — two independently written sims. The former runs a real in-place FFT; its
  output (8, 8, 0, 0, 0, 0, 0, 8) matches the latter's hand-computed DFT of the
  same input exactly. Neither knows about the other, which makes this the
  strongest correctness evidence either one has.
- **`window-function-comparison`** — the *computed* metrics land on textbook
  values: rectangular 2.0 bins / −13.3 dB, Blackman 6.1 bins / −58.1 dB. That
  confirms both the window coefficients and the zero-padded transform.
- **`fft-stage-architecture`** — butterfly counts recomputed by hand for all
  three sizes: 8×128 = 1,024 · 9×256 = 2,304 · 10×512 = 5,120.
- **`experimental-design-anatomy`** — the drag mechanic was exercised with real
  Playwright mouse events (down, stepped move, up), not by mutating state, for
  both a correct run and a deliberate mis-drop.

---

## 5. Recurring Defect Classes

Six patterns accounted for nearly every fix. They are listed here because they
will recur in the next batch of sims.

### 5.1 `textWidth()` measured under the wrong font — 3 sims

p5 measures under whatever `textSize`/`textStyle` is *currently* active, not the
one the text was drawn with. The common pattern — bold heading, then a smaller
caption positioned after it — silently under-measures and the caption collides
with the heading. Each occurrence was hidden behind a hand-tuned fudge factor
(`textWidth(title) * 1.16`). A magic multiplier next to `textWidth()` is the
tell. Fix: capture the width immediately after drawing, before changing the
face.

### 5.2 Reserved p5 global names — 1 sim

`instruction-encoding-bit-builder` defined `function hex(v)`. p5 already has
`hex()`, kept its own, and logged a friendly console warning. Every address
rendered without its `0x` prefix and nothing failed. Renamed to `addrHex()`.
This is the hazard `CLAUDE.md` warns about, and it fails in the *rendering*,
not at load.

### 5.3 Text clipped by an undersized bounded `text()` box — many sims

`text(str, x, y, w, h)` silently drops anything past `h`. Two sub-cases:

- **Too small entirely:** p5 renders *nothing* when the box cannot fit one line
  (`pico2-memory-map-explorer` drew an empty header band).
- **Off by one line:** the box fits the typical string and clips the longest one
  (`fft-stage-architecture` cut a paragraph mid-word at "Saving";
  `fft-applications-map` clipped the longest capstone idea).

Fix: always size the box against the *longest* content the sim can produce, and
capture a screenshot in that state specifically.

### 5.4 Box-form `text()` takes the box's left edge, not its center

Passing `canvasWidth / 2` with `textAlign(CENTER)` starts the box at the
midpoint and overflows the right edge. Pass `margin` with a full-width box.

### 5.5 Chart.js geometry assumptions — 4 sims

- **Bars anchor at zero.** In `linear-sqrt-decibel-scaling-chart` the negative
  dB bars hung downward and the 0 dB peak rendered as no bar at all — the chart
  was exactly inverted. Fixed with dataset `base: DB_FLOOR`. Caught only because
  the dB state was rendered and read rather than inferred from the linear state.
- **Titles move with `layout.padding`.** Raising padding to clear a
  canvas-drawn callout moved the title too. Fixed by moving headings into an
  HTML `<h2>` (`stage-profiling-breakdown-chart`, `benchmark-results-chart`,
  and both chapter-24/26 charts by design).
- **Horizontal-bar `el.x` is the segment's *right* edge**, so a callout arrow
  pointed at the wrong boundary. Use `(el.base + el.x) / 2`.

### 5.6 Layout height must not change with state

`variant-performance-dashboard` grew from 548 px to 592 px when the prediction
overlay was toggled, which would have clipped or gapped the iframe. Fixed with a
fixed-height panel and re-measured in both states. For Chart.js sims,
`CANVAS_HEIGHT` was taken from a measured `document.body.scrollHeight`, never
estimated from the CSS.

### 5.7 A sim that shows nothing is worse than one that shows the wrong thing

`periodic-assumption-edge-discontinuity` displayed a badly smeared spectrum with
a measured edge jump of 0.000 and no visible cause. `sampleAt(N)` and
`sampleAt(0)` are identically equal for `sin(2π·cycles·n/N)`, and at zero
starting phase a half-integer cycle count genuinely lands on zero at both ends —
the sim was correct and useless. Fixed by adding `PHASE = π/4`; the jump now
reads 1.414 at 6.5 cycles and the discontinuity is visible.

---

## 6. Spec Departures — Deliberate, and Why

Six specs were internally inconsistent or, taken literally, would have defeated
their own learning objective. Each departure is recorded in that sim's log; the
substantive ones:

- **`experimental-design-anatomy`** — the spec asks for phrases "pre-highlighted
  in distinct colors matching the four target boxes", which color-codes each
  phrase with its own answer and reduces an Apply-level classification to
  color-matching. Built instead with neutral chips that adopt their box's color
  once dropped and turn green/red only after checking. The four boxes are
  distinctly colored as specified; the answer key is not given away.
  The spec's example sentence also splits the independent variable across a
  clause ("Hann windowing … versus no window"), which cannot be one draggable
  object; the sentence was recast into "Does *A* change *B*, holding *C*, *D*
  and *E* fixed?" — preserving the spec's answer key exactly and making the
  structure of a well-formed question the transferable lesson.
- **`variant-performance-dashboard`** — the spec's title promises "Four
  Different Rankings"; the supplied data yields three, because kernel time and
  total time produce the same order. Rather than change the data or the title,
  the page treats it as the finding: the two agree on order but disagree on
  margin (29.6× vs 22.2×), and that gap is fixed overhead.
- **`optimization-attribution-waterfall`** — kept `beginAtZero: true` even
  though it makes the four steps look modest. Zooming the axis would have
  flattered the optimization and hidden the decision the chapter teaches.
- **`fft-stage-architecture`** — added an N selector (256/512/1024) not in the
  spec. It converts a static claim into a testable trend, which is what the
  Analyze verb asks for.
- Several specs left a value ambiguous (`performance-metrics-calculator`
  comparison-time default, `fpu-capability-probe`'s `0x2` vs `0x10110021`,
  `switch-bounce` default state, `harmonic-stack` slider orientation,
  `mems-microphone` stacking). Each was resolved and documented in its own log.

---

## 7. Open Item for the Author

**Chapter 25 contains a hex value that is not the real VFMA encoding.**

`docs/chapters/25-beyond-the-assembler/index.md` uses
`data(4, 0xEE621A00)` for `VFMA s2, s0, s1` (around line 168, and again in the
disassembly sentence around line 196). The surrounding prose labels it
"(illustrative bit pattern)", so the chapter is not making a false claim — but
the real encoding is **`0xEEA01A20`**, verified against `clang` and
`llvm-objdump`. Decoded, `0xEE621A00` lands in the `VMUL`/`VNMUL` row of the
same encoding table, which ironically makes it a very good example of the
chapter's own warning.

The MicroSim uses the real encoding (its spec asks for "the real ARM encoding
scheme") and carries an admonition explaining the difference rather than
silently contradicting the chapter. **If the chapter is meant to show the real
value, two strings need updating.** That is a text edit outside the sims' scope
and was flagged rather than made.

---

## 8. Final State

- `docs/sims/index.md` — regenerated, 60 cards, 58 with screenshots.
- `mkdocs.yml` — MicroSims nav section regenerated, 60 entries.
- Every chapter's embedded iframe height synced to its sim's `CANVAS_HEIGHT`.
- `mkdocs build` produces no warnings for anything under `docs/sims/`.
- `validate-sims.py`: 58 of 58 chapter MicroSims at 100/100 grade A.
  (The three low scores in the full report are `TODO/` — the spec directory,
  not a sim — plus the two pre-existing scaffold sims.)
- `test-iframe-heights.py`: 59 PASS, 0 FAIL, 0 ERROR, 1 SKIP.

Untouched: `site/`, and the working-tree changes that predated this session.
