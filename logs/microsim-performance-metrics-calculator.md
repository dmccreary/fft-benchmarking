# MicroSim Generation Log: Performance Metrics Calculator

**Sim ID:** `performance-metrics-calculator`
**Chapter:** 17 — Measuring Time
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/performance-metrics-calculator.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, use
- **Learning Objective:** Apply the conversion formulas to compute execution
  time, throughput, and speedup factor from a raw cycle count the learner
  controls.
- **Recommended Pattern:** Live calculator, per the spec's own rationale that
  Apply-level objectives call for parameter exploration rather than animation.
- **Specification Alignment:** Aligned.
- **Rationale:** Each metric row shows the formula, the substituted operands, and
  the result on one line, so the learner can follow the arithmetic rather than
  trust the output.

## Routing Decision

Keywords "sliders", "live-computed output panel", "calculator" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + three metric rows (62 each) + reality-check panel | 340 |
| controlHeight | 4 rows x 35 + 10 | 150 |
| canvasHeight | 340 + 150 | 490 |
| iframe height | canvasHeight + 2 | 492 |
| sliderLeftMargin | "Comparison time: 20,500,000 µs" label + padding | 290 |

### Spec inconsistency resolved

The spec gives the comparison-time slider two conflicting defaults — 20,500 µs in
the control list and 21,000,000 µs in the defaults block — while also stating
that the speedup should converge on "~146". Only 20,500,000 µs produces that:
20,500,000 / 140,000 = 146.4. That value is used, and the slider range was set to
1,000-25,000,000 µs to contain it.

## Implementation Notes

- The execution-time conversion is `cycles / freqMHz` with **no scaling
  constants**, because MHz is definitionally cycles per microsecond. The
  formula line says so, since this is the step where students otherwise
  introduce a stray factor of 1000.
- The "Load Chapter 12 example" button reproduces the book's already-quoted
  140 ms versus 20.5 s comparison, so the 146.4× figure the course asserts
  earlier is re-derived here from its inputs.
- The reality-check panel is not decoration: it names the four numbers a
  reproducible benchmark report must carry, which is the "use" half of the
  objective's verb pair.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 17 embed corrected to 492 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `performance-metrics-calculator.png` captured at 492px |

Arithmetic verified against the capture: 21,000,000 / 150 = 140,000 µs =
140.00 ms; 1,000,000 / 140,000 = 7.14 per second; 20,500,000 / 140,000 = 146.4×.

## Layout Review (Claude Vision)

Cycle 1: no failures. All three metric rows render with formula, substitution,
and right-aligned result; the reality-check panel is complete and untruncated;
all four controls are visible. All checklist items PASS on the first capture.

A dead `y0()` pass-through helper left over from layout iteration was removed
during documentation — no visual change, so no re-capture was needed.

## Files Written

- `docs/sims/performance-metrics-calculator/main.html`
- `docs/sims/performance-metrics-calculator/performance-metrics-calculator.js`
- `docs/sims/performance-metrics-calculator/index.md`
- `docs/sims/performance-metrics-calculator/metadata.json`
- `docs/sims/performance-metrics-calculator/performance-metrics-calculator.png`
