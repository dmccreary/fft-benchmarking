# MicroSim Build Log: FFT Stage Architecture

- **MicroSim ID:** `fft-stage-architecture`
- **Chapter:** 23 — The Butterfly in Assembly: A Complete FFT and Production Libraries
- **Library:** p5.js 1.11.10
- **Bloom level:** Analyze (differentiate, examine)
- **Canvas height:** 515 (iframe 517px)
- **Date:** 2026-08-11

## Learning Objective

Differentiate which parts of a full FFT run in Python and which part is
hand-written assembly, and justify the split.

## Design Decisions

**The ratio is the content.** The spec's numbers — three Python pieces running
1, 1, and 9 times against one assembly routine running 2,304 times — are the
whole argument, so every element of the diagram carries a run count. Each box
shows "runs N×" under its title, both band headers state their frequency, and
the control strip carries the summary "2,304 butterflies vs 11 Python steps".
A student who only glances at the diagram still leaves with the ratio.

**Added an N selector.** The spec is written for a 512-point transform. Making N
selectable (256 / 512 / 1024) turns a static claim into something students can
test: doubling N adds one Python step and more than doubles the butterfly count.
Every number in the diagram, both band headers, and all five detail panels
recompute from `stages = log2(N)` and `butterflies = N/2`. This is the Analyze
verb the spec asks for — the frequencies stop being trivia and become a trend.

**Sizing.** The spec asks for boxes "loosely proportional to execution
frequency". Strict proportionality is impossible (2,304 : 1), so the hot-loop
box is full width and taller than the whole Python row combined, while the
per-stage parameter box is wider and taller than the two run-once boxes. The
literal counts carry the precision; the geometry carries the impression.

**The boundary is a first-class object.** It is drawn as a full-width dashed
rule with one arrow crossing it, is independently clickable, and its detail text
answers a question the spec did not ask but students always do: how expensive is
the call? Nine crossings per transform, not 2,304 — which is why the parameter
block is a block rather than a per-butterfly argument list.

**Why each piece sits where it does.** Each detail panel has three parts: what it
does, how often it runs, and why that frequency determines its language. The
bit-reversal explanation makes the O(N) versus O(N log N) point explicitly,
because "it runs once per transform" alone sounds like it might be expensive.

## Verification

- Counts checked by hand for all three sizes: N=512 → 9 stages × 256 = 2,304
  butterflies and 18,432 hot-loop instructions; N=256 → 8 × 128 = 1,024;
  N=1024 → 10 × 512 = 5,120. These match the spec's stated 9 stages and 2,304.
- Both spec-mandated strings appear verbatim in the detail panels: the hot-loop
  text ("...the only code worth hand-optimizing, because it is the only code
  that runs enough times for the optimization to matter") and the boundary text
  ("This is the stage parameter block — five addresses, one block, crossing once
  per stage").
- First capture truncated the hot-loop "why" paragraph mid-word ("Saving") — the
  info panel was 66px with single-line text boxes. Raised the panel to 88px with
  two-line body and why boxes and lifted `drawHeight` from 450 to 470; both the
  longest state (hot loop) and the boundary state now render complete.
- The boundary arrow's upper stem was largely hidden between the two labels;
  extended it from y=178 to y=162 so it reads as one continuous arrow crossing
  the dashed rule.
- Playwright capture at exactly 800×517 with a pageerror listener attached;
  no errors. Screenshots reviewed for the default, hot-loop, and boundary states.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
