# MicroSim Build Log: Experimental Design Anatomy

- **MicroSim ID:** `experimental-design-anatomy`
- **Chapter:** 27 — Capstone: Applications, Design, and Reporting
- **Library:** p5.js 1.11.10
- **Bloom level:** Apply (classify, construct)
- **Canvas height:** 435 (iframe 437px)
- **Date:** 2026-08-11

## Learning Objective

Classify the components of a stated research question into research question,
independent variable, dependent variable, and controlled variables, and
construct a benchmark suite around them.

## Design Decisions

**Chips live inline in the sentence, not in a separate tray.** The spec says
"dragging highlighted phrases *from the sentence*", so the sentence is laid out
as a real inline flow: plain words and chip slots share one wrapping algorithm,
and a chip's home position is its actual place in the prose. Dragging a phrase
out leaves a dashed placeholder in the gap it came from. A tray of chips below a
static sentence would have been far easier to build and would have lost the
thing that makes the exercise land — that these phrases *are* the sentence.

**Rewrote the example sentence so every target phrase is contiguous.** The
spec's sentence has the independent variable split across the clause ("Hann
windowing ... versus no window"), which cannot be one draggable object. The
sentence was recast into the form "Does *A* change *B*, holding *C*, *D* and *E*
the same in every run?" — which keeps the spec's answer key exactly (window type
→ independent, peak-frequency error → dependent, 150 MHz / Pico 2 / 512-point
FFT → controlled) and additionally makes the *structure* of a well-formed
benchmark question audible. That structure is now the transferable lesson, and
all three examples share it.

**Deliberate departure: chips are not pre-colored by category.** The spec asks
for "key phrases pre-highlighted in distinct colors matching the four target
boxes". Taken literally that colors each phrase with its own answer, which turns
an Apply-level classification into a color-matching exercise with nothing to
apply. Instead: the four *boxes* are distinctly colored as specified, unplaced
chips are a neutral gold, a chip adopts its box's color once dropped, and only
after "Check my answers" does it turn green or red. The scaffolding the spec
wanted is present; the answer key is not.

**Three examples, three domains.** Audio tone detection, bearing vibration, and
radio signal separation. The spec asked for 2-3 from different domains; three
lets the second one be practice and the third be a genuine transfer test.

**Hints name the category, never the phrase's answer.** `HINTS` is keyed by the
*correct* category and phrased as a nudge. The independent/dependent mix-up is
the one that actually happens, and its hint reproduces the spec's example wording
verbatim: "This phrase describes what you are measuring as an outcome, not what
you are deliberately changing — try Dependent Variable instead."

**Feedback is graded, not binary.** Unplaced-but-nothing-wrong gets a different
message from wrong-placement, and both report the running correct count, so a
learner who has four right and two unplaced is not told they have failed.

## Bug Found and Fixed

**`textWidth()` measured under the wrong font, again.** The zone hint captions
were positioned at `r.x + 10 + textWidth(z.title) * 1.22 + 8` with the
measurement taken *after* `textSize(10.5)` while the title had been drawn at
12.5px bold — the 1.22 was a fudge factor covering the mismatch. It nearly ran
the Research Question caption off the edge of its box. Fixed by capturing
`textWidth()` while the bold face is still selected and dropping the fudge
factor, and the four hint strings were shortened so they fit at narrower canvas
widths too.

## Verification

- Drag mechanic exercised for real with Playwright mouse events (down, stepped
  move, up), not by mutating state: all six chips dragged into their correct
  boxes yields `['rq','iv','dv','cv','cv','cv']` and the "All 6 correct" panel.
- Wrong-placement path exercised the same way: dropping "peak-frequency error in
  Hz" into Independent Variable reports 0 of 6 and produces the
  independent/dependent hint.
- Multi-chip packing verified — the three controlled-variable chips wrap onto
  two rows inside their box without overflowing it.
- Example cycling verified; example 2 lays out cleanly with different phrase
  lengths.
- Playwright capture at exactly 800×437 with a pageerror listener; no errors.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
