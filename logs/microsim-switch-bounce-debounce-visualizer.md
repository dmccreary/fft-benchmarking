# MicroSim Generation Log: Switch Bounce Debounce Visualizer

**Sim ID:** `switch-bounce-debounce-visualizer`
**Chapter:** 3 — Peripherals
**Library:** p5.js 1.11.10
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/switch-bounce-debounce-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Demonstrate, apply
- **Learning Objective:** Let students apply a debounce delay to a simulated
  noisy switch signal and observe how too short a delay still lets bounce
  through, while a reasonable delay produces exactly one clean logical press.
- **Recommended Pattern:** Parameter exploration where the learner is allowed —
  encouraged — to choose a failing value and see it fail.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's instructional rationale is exactly right for L3: the
  learner picks a number and a correctness outcome follows. The design leans into
  it by coloring the press counter green only when it reads 1, so a wrong delay
  is immediately legible as wrong without any prose telling the student so.

## Routing Decision

Keywords "strip chart", "square wave", "time-aligned charts", "simulation" →
`references/p5-guide.md`. Chart.js was rejected: the traces are step functions
derived from an event list and a running state machine, not a dataset, and the
two charts must share a hand-controlled millisecond axis.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + raw chart + debounced chart + axis + readout | 400 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 400 + 80 | 480 |
| iframe height | canvasHeight + 2 | 482 |
| sliderLeftMargin | "Debounce delay: 30 ms" label + padding | 210 |

Both charts use one `chartGeometry()` helper with the same left and right edges,
which is what guarantees the vertical time alignment the spec asks for.

Control inventory (3 total): button and checkbox on row 1, delay slider on row 2.

## Implementation Notes

- The debounce is a real state machine, not a lookup: the signal is sampled every
  0.1 ms across an 80 ms window, and a candidate level is only promoted to stable
  after it has persisted for the full delay. That is why setting the delay to
  5 ms genuinely produces multiple press events instead of a scripted "wrong
  answer" — the failure emerges from the algorithm.
- The raw press always settles pressed. `generatePress()` picks an **even** flip
  count from {2, 4, 6} so the alternating edge sequence is guaranteed to end in
  the pressed state, which is what makes "exactly one logical press" the correct
  answer.
- Debounce is recomputed only when the slider value actually changes, not every
  frame, so dragging stays responsive.
- The 15 ms bounce window is shaded pink on the raw chart so the brevity of the
  chaos is visible against the 80 ms total span.

### Deviation from spec

The spec says "No press simulated until 'Simulate one press' is clicked". This
sim instead generates one press during `setup()`. The p5 guide requires that the
default state demonstrate the concept without interaction, and an empty pair of
charts does not. The button's role is unchanged — it still generates a *new*
random pattern on every click.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 100/100, grade A |
| `sync-iframe-heights.py` | Chapter 3 embed corrected 500 → 482 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `switch-bounce-debounce-visualizer.png` captured at 482px |

## Layout Review (Claude Vision)

Cycle 1: no failures. The raw trace shows the bounce burst inside the shaded
window, the debounced trace shows a single clean rising edge at bounce-end plus
the delay, the press marker is labeled, the counter reads 1 in green, and both
charts are time-aligned on a shared axis. All checklist items PASS on the first
capture — no patch cycle was needed.

## Files Written

- `docs/sims/switch-bounce-debounce-visualizer/main.html`
- `docs/sims/switch-bounce-debounce-visualizer/switch-bounce-debounce-visualizer.js`
- `docs/sims/switch-bounce-debounce-visualizer/index.md`
- `docs/sims/switch-bounce-debounce-visualizer/metadata.json`
- `docs/sims/switch-bounce-debounce-visualizer/switch-bounce-debounce-visualizer.png`
