# Test Plan 02: Competing FFT Variants & Architecture Tradeoffs

**Status:** Draft — design document, no variant code written yet.
**Depends on:** [Plan 01](01-fft-test-plan.md) (complete — baseline FFT at 132,808 cycles).
**Goal:** Build a family of competing FFT implementations so students can measure, rather
than be told, how architecture and algorithm choices trade against each other.

> **Note on scope.** This plan began as "VFMA optimization." A hardware probe (§2) found that
> VFMA is *not reachable* from MicroPython's inline assembler, and profiling (§3) found it
> would have been a minor win regardless. The plan therefore covers the full space of variants
> worth building, of which raw-encoded VFMA is one (V7).

## 1. Why This Plan Exists

Plan 01 produced one working assembly FFT. A single implementation teaches that assembly is
fast; it does not teach *why*, or what to give up to get there. A family of variants measured
against each other under one harness turns the course's benchmarking vocabulary
(`Fair Comparison`, `Reproducibility`, `Statistical Sampling`, `Mean Execution Time`,
`Standard Deviation` — all already concept nodes in the learning graph) into something
students exercise rather than memorize.

The intended student deliverable is a comparison matrix they generate themselves, plus the
ability to explain *why* each row lands where it does.

## 2. Instruction Availability (Probe Result)

[`src/kits/oled-2-buttons/05-asm-instruction-probe.py`](../../src/kits/oled-2-buttons/05-asm-instruction-probe.py)
asks the runtime directly which optimization instructions assemble:

| Instruction group | Result | Consequence |
|---|---|---|
| `vfma` / `vfms` (fused MAC) | **missing** | V7 must hand-encode the instruction word |
| `vmla` / `vmls` (chained MAC) | **missing** | no assembler-level MAC at all |
| `smulbb`, `smlabb`, `smuad`, `qadd16`, `ssat`, `pkhbt` | **missing** | fixed-point Q15 SIMD is unreachable (V9) |
| `mla` (32-bit MAC) | **missing** | — |
| `vneg`, `vdiv`, `vsqrt`, `asr` | available | usable in variants |
| `@micropython.native`, `@micropython.viper` | available | enables the abstraction ladder (V3) |

**The distinction that matters pedagogically:** the Cortex-M33 r1p0 *silicon* implements all
of these — they are documented in the ARM guide saved in this repo (§3.8 saturating, §3.9
packing, §3.12 floating-point). What is missing is MicroPython's *assembler* support. The
instruction set and the assembler are not the same thing, and V7 exists to make that concrete.

## 3. Where the Baseline's Cycles Actually Go

Profiling the current implementation on hardware (per-stage timing, 512-point transform):

| Component | Cycles | Share |
|---|---|---|
| Bit-reversal permutation | ~22,000 | ~17 % |
| 9 butterfly stages | ~105,000 | ~83 % |
| **Total (best of 15 runs)** | **127,086** | |

Per-butterfly cost by stage, in cycles:

```
stage 1 (half=1)   92.7   <- most expensive, yet its twiddle is always (1, 0)
stage 2 (half=2)   79.1
stage 3 (half=4)   83.3
stage 4 (half=8)   73.5   <- cheapest
stage 5 (half=16)  75.6
stage 6 (half=32)  75.5
stage 7 (half=64)  78.3
stage 8 (half=128) 79.0
stage 9 (half=256) 84.5
```

Three conclusions drive the variant selection:

1. **Overhead dominates arithmetic.** The butterfly body is ~28 instructions but costs 73–93
   cycles. Loop control, address computation, register spills to `s29`/`s30`, and memory
   access — not the multiplies — are the bulk of the time. A fused MAC removes 2 instructions
   of 28; that ceiling is ~7 %, and only if those instructions were the bottleneck, which they
   are not. **This is why VFMA was never the big win**, and it is worth showing students the
   measurement that establishes it.
2. **Cost is U-shaped across stages.** Stage 1 runs one twiddle over 256 blocks; stage 9 runs
   256 twiddles over one block each. Both extremes pay one loop's per-iteration overhead 256
   times, while middle stages balance the two. Stage 1 being the *most* expensive despite a
   trivial `(1, 0)` twiddle is the clearest single argument for specialization (V1).
3. **Bit-reversal is a sixth of the runtime** for what is only a permutation — 512 loop
   iterations, a table load, a compare and a branch, to perform roughly 240 actual swaps.

### Two measurement findings worth teaching directly

- **Instrumentation overhead is not free.** Timing the 9 stages individually sums to ~206,000
  cycles, while the whole transform measures ~127,000. The ~8,850 cycles/stage difference is
  the measurement apparatus itself (Python attribute lookups, parameter writes, two DWT reads
  per stage). A textbook observer effect, measured on the students' own hardware.
- **Run-to-run variance is not garbage collection.** Disabling the GC changed the best time by
  0.14 % (127,086 → 126,906). The ~1.4 % spread comes from elsewhere (USB interrupt servicing
  and flash XIP cache behaviour are the likely candidates). This motivates reporting
  **best-of-N** alongside mean and standard deviation: for a deterministic algorithm the
  minimum is the least-contaminated sample.

## 4. The Tradeoff Matrix

Each variant isolates one dimension, so a student can attribute a result to a cause.

| Dimension | Variants | Lesson |
|---|---|---|
| Abstraction level | V3: Python → native → viper → asm | what interpretation costs |
| Algorithm | V2 real-input, V5 radix-4 | operation count vs. complexity |
| Specialization | V1 trivial-twiddle stages, V4 bit-reversal | generality has a price |
| Memory layout | V6 interleaved vs. split | addressing overhead |
| Instruction encoding | V7 raw-encoded VFMA | the assembler is not the ISA |
| Parallelism | V8 dual-core | Amdahl's law, synchronization cost |
| Numeric representation | V9 fixed-point Q15 | precision vs. speed (needs firmware) |

## 5. Variant Specifications

Expected gains are **hypotheses to be tested**, stated so students can compare a prediction
against a measurement — not promises.

### Tier 1 — high value, low risk

**V1 — Specialized early stages.** Stage 1's twiddle is always `(1, 0)`, making the butterfly
a pure add/subtract with zero multiplies. Stage 2's twiddles are `(1, 0)` and `(0, -1)`, so
multiplication by `-i` is a register swap and a sign flip. Additionally, the `j = 0` butterfly
of *every* stage has twiddle `(1, 0)`. Write dedicated routines for these cases.
*Hypothesis: 10–15 %.* Teaching point: profiling tells you where to look; stage 1 was the most
expensive despite doing the least arithmetic.

**V2 — Real-input FFT.** Every test signal is real-valued audio, but the baseline transforms a
complex input with a zeroed imaginary array — half the arithmetic is multiplying by zero. A
512-point real FFT can be computed as a 256-point complex FFT plus an O(n) split step.
*Hypothesis: 40–45 %, the single largest win available.* Teaching point: algorithmic choice
outranks every instruction-level optimization in this plan combined. Note the output format
changes (256 unique bins + Nyquist), so the verifier needs a real-FFT comparison path.

**V3 — Abstraction ladder.** The same radix-2 DIT algorithm at four levels: pure Python
(measured: 28.7 M cycles), `@micropython.native`, `@micropython.viper`, and the assembly
baseline (127 K cycles). Almost no implementation risk, and it spans a ~225× range.
*Teaching point:* where the cost of abstraction actually lands, and that viper often gets
surprisingly close to assembly for a fraction of the effort.

**V4 — Faster bit-reversal.** Replace the 512-iteration compare-and-branch loop with a
precomputed list of only the ~240 index pairs that actually swap, eliminating the branch
entirely. Alternatively fold the permutation into the first butterfly stage.
*Hypothesis: recovers 8–12 % of total runtime.* Teaching point: 17 % of the time was going to
something that is not arithmetic at all.

### Tier 2 — moderate effort

**V5 — Radix-4.** 512 = 4⁴ × 2, so four radix-4 stages plus one radix-2 stage. Radix-4 reduces
multiplication count roughly 25 % by handling four points per butterfly, at the cost of much
higher register pressure — and registers are already tight enough that the baseline spills to
`s29`/`s30`. *Hypothesis: 15–20 %, or a regression if spill traffic outweighs the savings.*
Teaching point: fewer operations does not automatically mean faster.

**V6 — Interleaved complex layout.** Store `[re₀, im₀, re₁, im₁, …]` in one array instead of
two parallel arrays, halving pointer arithmetic (one base register instead of two) and
improving access locality. *Hypothesis: 5–10 %.* Teaching point: data layout is a performance
decision, and RP2350's SRAM has no data cache, so the gain here comes from addressing, not
locality — a nuance worth measuring rather than assuming.

### Tier 3 — advanced

**V7 — Raw-encoded VFMA.** MicroPython's assembler rejects `vfma`, but `@micropython.asm_thumb`
provides a `data()` directive that emits raw words into the instruction stream. Hand-encode
`VFMA.F32 Sd, Sn, Sm` from the ARM guide's encoding tables and place it inline.
*Hypothesis: 5–7 %, i.e. small — which is the point.* Teaching point: this is the plan's
headline architecture lesson. Students derive an instruction encoding from the manual, discover
the toolchain was the only thing standing in the way, and then measure that the payoff is
modest — because §3 already showed arithmetic is not the bottleneck. **Gate:** verify `data()`
emits into the executable code stream before committing to this variant; if it only emits into
a literal pool, V7 is blocked and becomes a paper exercise in encoding instead.

**V8 — Dual-core.** `_thread` is available and the RP2350 has two M33 cores. Split the butterfly
stages across both. *Hypothesis: well under 2×, plausibly a regression* — the transform is only
~850 µs, so synchronization and cache-coherency costs are significant relative to the work.
Teaching point: Amdahl's law and the real cost of coordination.

**V9 — Fixed-point Q15.** **Blocked on the inline-assembly path** (§2): none of the DSP
instructions a Q15 FFT needs are exposed. This is the one variant that genuinely justifies
returning to the Pico SDK C firmware approach that Plan 01 designed and then set aside — the
packed 2-way SIMD (`SMUAD`, `QADD16`) could process two Q15 values per instruction.
*Teaching point:* precision traded for speed, and a concrete answer to "when is the heavier
toolchain worth it?" Document as a scoped follow-on plan (Plan 03) rather than attempting it
here.

## 6. Benchmark Methodology

The course is *about* benchmarking, so the harness is curriculum, not scaffolding.

- **Identical conditions.** Every variant runs the same 10 signals from
  [`src/fft-benchmark/inputs/`](../../src/fft-benchmark/inputs/), same trial count, same
  buffers, one warm-up discarded.
- **Report three statistics, not one.** Best-of-N (least contaminated, appropriate for a
  deterministic algorithm), mean, and standard deviation. §3 showed these differ by ~4 %.
- **Report accuracy beside speed.** Every variant is verified against the numpy reference.
  V2 (real FFT) and V9 (Q15) change the numerics, so "fastest" is not a complete answer —
  a variant that is 2× faster and 100× less accurate has made a trade, not an improvement.
- **Report code size.** Bytes of compiled assembly per variant. On a microcontroller this is a
  real constraint, and V1/V5 trade code size for speed explicitly.
- **Measure whole transforms, not fragments.** §3 quantified ~8,850 cycles of instrumentation
  overhead per measurement point; fine-grained timing distorts what it measures.
- **State the baseline in every claim.** "1.3× faster than V0 on signal 03" — not "faster."

Output: `outputs/variant-comparison.md`, a matrix of variant × (best cycles, mean, stddev,
speedup vs. V0, max relative error, code size), plus a short interpretation of each row.

## 7. Directory Layout

```
src/fft-benchmark/
  variants/
    v0_baseline.py        # current implementation, re-exported for comparison
    v1_specialized.py     # trivial-twiddle stages
    v2_real_input.py      # real-input FFT
    v3_python.py          # abstraction ladder: pure Python
    v3_native.py          #                     @micropython.native
    v3_viper.py           #                     @micropython.viper
    v4_fast_bitrev.py     # swap-pair-only permutation
    v5_radix4.py          # radix-4 + final radix-2 stage
    v6_interleaved.py     # interleaved complex layout
    v7_vfma_raw.py        # hand-encoded VFMA via data()
    v8_dualcore.py        # _thread across both M33 cores
    common.py             # shared interface + table construction
  device/
    compare.py            # runs every variant over all 10 signals
  tools/
    build_comparison.py   # assembles outputs/variant-comparison.md
  outputs/
    variant-comparison.md
```

Every variant exposes the Plan 01 interface (`make_buffers`, `run`, `run_timed`) so
`compare.py` drives them uniformly and no variant gets an accidental advantage from a
different calling pattern.

## 8. Milestones

1. **Harness first.** Build `variants/common.py` and `device/compare.py` against V0 alone,
   confirming the runner reproduces Plan 01's 132,808-cycle result before any variant exists.
   A harness that cannot reproduce a known number cannot be trusted to compare unknown ones.
2. **`data()` feasibility probe** — determine whether raw words reach the executable code
   stream. Gates V7.
3. **V3 abstraction ladder** — cheapest to build, immediately useful, and stresses the harness
   across a 225× dynamic range.
4. **V1 + V4** — the two specialization wins that §3's profile points at directly.
5. **V2 real-input FFT** — the largest expected win; requires extending the verifier.
6. **V6, V5** — layout, then radix-4.
7. **V7 raw-encoded VFMA** — if milestone 2 passed.
8. **V8 dual-core** — last, being the most likely to disappoint and the most instructive
   about why.
9. **Comparison matrix + write-up**, including a section on which hypotheses from §5 were
   wrong and what the measurement revealed instead.

## 9. Student Lab Shape

The intended exercise: give students V0 and the harness, have them **predict** the ranking of
the remaining variants before measuring, then implement two or three and check their
predictions. The gap between prediction and measurement is the actual lesson — particularly
for V5 (radix-4 may lose to register pressure) and V8 (more cores may be slower).

## 10. References

- [Plan 01: assembly FFT](01-fft-test-plan.md) — baseline, harness, and verification pipeline
- [ARM Cortex-M33 Devices Generic User Guide r1p0](../../arm-programming-guide/arm-cortex-m33-r1p0-generic-user-guide.pdf) — §3.12 floating-point encodings (V7), §3.8–3.9 DSP/saturating (V9)
- [`05-asm-instruction-probe.py`](../../src/kits/oled-2-buttons/05-asm-instruction-probe.py) — the availability data in §2
- [`outputs/verification-report.md`](../../src/fft-benchmark/outputs/verification-report.md) — V0 correctness and timing baseline
