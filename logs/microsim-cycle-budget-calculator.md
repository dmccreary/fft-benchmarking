# MicroSim Generation Log: Cycle Budget Calculator

**Sim ID:** `cycle-budget-calculator`
**Chapter:** 2 — Know Your Board
**Library:** p5.js 1.11.10
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/cycle-budget-calculator.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, apply
- **Learning Objective:** Let students calculate the CPU-cycle budget available
  for a real-time task, given clock speed and a time deadline, and see how that
  budget shrinks as the deadline tightens or grows as clock speed increases.
- **Recommended Pattern:** Live calculator with parameter sliders and a capacity
  bar. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The objective is computational, so the design puts the equation
  itself on screen with live numeric substitution rather than only showing a
  result. Each numeral is tinted to match the slider that produces it, which is
  what turns "drag a slider" into "see which term of the product you changed."

## Routing Decision

Keywords "calculator", "live sliders", "capacity bar", "custom drawing" →
`references/p5-guide.md`. Chart.js was rejected: there is no dataset here, only a
single proportion, and the equation display needs per-token coloring that a chart
library does not provide.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | equation + formula + bar + readouts + note | 330 |
| controlHeight | 4 rows x 35 + 10 | 150 |
| canvasHeight | 330 + 150 | 480 |
| iframe height | canvasHeight + 2 | 482 |
| sliderLeftMargin | longest label "Workload: 8,000,000 cycles" + padding | 250 |

Control inventory (4 total, within the 1-5 guideline):

| # | Type | Label | Row |
|---|------|-------|-----|
| 1 | Slider | Clock speed (1-200 MHz, default 150) | 1 |
| 2 | Slider | Deadline (5-100 ms, default 40) | 2 |
| 3 | Slider | Workload (100k-20M cycles, default 8M) | 3 |
| 4 | Checkbox | Show formula | 4 |

## Implementation Notes

- Defaults are deliberately over budget per the spec: 150 MHz x 40 ms gives a
  6,000,000-cycle budget against an 8,000,000-cycle workload, so the OVER BUDGET
  state is visible the moment the sim loads rather than being something the
  student has to hunt for.
- `drawEquation()` measures each colored token with `textWidth()` and shrinks the
  type size from 22px down to a floor of 11px until the whole equation fits the
  container. This is what keeps the equation on one line at narrow widths instead
  of overflowing the canvas.
- Numbers are formatted with `toLocaleString('en-US')` so seven-digit cycle counts
  stay readable.
- All three sliders are resized in `windowResized()` through a shared
  `resizeSliders()` helper.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 95/100, grade A |
| `sync-iframe-heights.py` | Chapter 2 embed corrected 500 → 482 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `cycle-budget-calculator.png` captured at 482px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — misleading legend.** The key printed "gray = unused headroom" even
   in the over-budget state, where the bar is entirely red and no gray is on
   screen. *Fix:* the gray entry is now suppressed when over budget, and the
   workload figure centers itself instead.
2. **Adjustment — small type.** The bar key and the explanatory note were 14px;
   raised to 15px to stay near the readability floor.

Cycle 2: re-captured and re-reviewed — all checklist items PASS. No residual
defects.

## Files Written

- `docs/sims/cycle-budget-calculator/main.html`
- `docs/sims/cycle-budget-calculator/cycle-budget-calculator.js`
- `docs/sims/cycle-budget-calculator/index.md`
- `docs/sims/cycle-budget-calculator/metadata.json`
- `docs/sims/cycle-budget-calculator/cycle-budget-calculator.png`
