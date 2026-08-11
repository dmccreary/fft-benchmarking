# MicroSim Generation Log: FPU Capability Probe

**Sim ID:** `fpu-capability-probe`
**Chapter:** 20 — Does Your CPU Have an FPU?
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/fpu-capability-probe.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Execute, demonstrate
- **Learning Objective:** Apply the MVFR0 bit-field check to determine FPU
  presence for several simulated chips, demonstrating that the same code
  correctly reports different verdicts on different hardware.
- **Recommended Pattern:** Direct execution against several inputs.
- **Specification Alignment:** Aligned, with one correction noted below.
- **Rationale:** The claim under test is "this function reads hardware rather
  than assuming". That is only demonstrated by running the *same* function
  against several targets, which is exactly what the chip cards afford — and each
  card retains its verdict badge so all three results are comparable at once.

## Routing Decision

Keywords "chip cards", "register panel", "AND-mask animation", "verdict" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + three chip cards (104, pitch 116) + register panel | 420 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 420 + 80 | 500 |
| iframe height | canvasHeight + 2 | 502 |

### Spec correction

The spec states the FPU-present bit field is `0x2` while also giving
`0x10110021` as the example MVFR0 value — whose low nibble is `0x1`, not `0x2`.
The register value is the correct one: MVFR0 bits [3:0] are the A_SIMD field, and
`0b0001` is what a Cortex-M4/M33 actually reports. The example value is kept and
the `0x2` figure discarded. This does not affect the probe, which tests `!= 0`
rather than equality — and the documentation calls that out, since testing for a
specific encoding is a real portability bug.

## Implementation Notes

- Each card keeps its verdict badge after probing, so a learner who probes all
  three sees three simultaneous results rather than a single changing one. The
  spec asks for exactly this.
- The low nibble is rendered in a separate colour *within* the hex string, so the
  masked digit is visually identified before the mask is applied — the AND then
  reads as isolating something already visible rather than producing a new
  number.
- The masked result is shown in both hex and binary, since the binary form is
  what makes "zero versus nonzero" obvious.
- Selecting a different chip cancels any in-flight animation, so rapid clicking
  cannot leave a stale reveal running against the wrong chip.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 20 embed corrected to 502 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x502 after probing the Cortex-M33 |

Arithmetic verified: `0x10110021 & 0xF = 0x1 = 0b0001`, nonzero, so FPU detected;
`0x00000000 & 0xF = 0`, so No FPU.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — card verdict label overlapped the MVFR0 line.** The "FPU detected"
   caption was right-aligned beside the badge and ran back across the
   `MVFR0 = 0x10110021` text on the same card. *Fix:* cards grown from 92 to
   104px with a 116px pitch, and the verdict moved to its own left-aligned row
   beneath the register line.

Cycle 2: re-captured — all three cards legible with badges, register panel with
masked nibble and binary form, and the verdict panel all clear. All checklist
items PASS.

## Files Written

- `docs/sims/fpu-capability-probe/main.html`
- `docs/sims/fpu-capability-probe/fpu-capability-probe.js`
- `docs/sims/fpu-capability-probe/index.md`
- `docs/sims/fpu-capability-probe/metadata.json`
- `docs/sims/fpu-capability-probe/fpu-capability-probe.png`
