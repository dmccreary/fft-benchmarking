# FFT Variants — Architecture Tradeoffs, Measured

Ten competing implementations of the same 512-point FFT, each isolating one variable so a
performance difference can be attributed to a cause. Measured on a Raspberry Pi Pico 2
(RP2350, Cortex-M33 r1p0 @ 150 MHz) running stock MicroPython v1.28.0.

This directory is designed to be read in order. Each variant answers a question the previous
one raises.

## Results at a glance

| Variant | Best cycles | Speedup | One-line verdict |
|---|---:|---:|---|
| [v9_combined](v9_combined.py) | 91,923 | **1.41×** | wins stack, sub-linearly |
| [v2_real_input](v2_real_input.py) | 103,076 | 1.26× | algorithm beats micro-optimization |
| [v1_specialized](v1_specialized.py) | 116,648 | 1.11× | stop multiplying by 1 |
| [v4_fast_bitrev](v4_fast_bitrev.py) | 126,060 | 1.03× | branch removal, modest payoff |
| [v7_vfma_raw](v7_vfma_raw.py) | 128,785 | 1.01× | the assembler is not the ISA |
| [v0_baseline](v0_baseline.py) | 130,024 | 1.00× | reference point |
| [v6_interleaved](v6_interleaved.py) | 2,133,832 | 0.06× | fastest kernel, worst result |
| [v3_viper](v3_viper.py) | 22,693,209 | 0.006× | typed ints don't help float math |
| [v3_native](v3_native.py) | 23,119,348 | 0.006× | compiling ≠ unboxing |
| [v3_python](v3_python.py) | 26,501,319 | 0.005× | the interpreter's true cost |

Full analysis: [`../outputs/variant-comparison.md`](../outputs/variant-comparison.md).

## The five lessons

### 1. Algorithm beats instruction tuning

V7 hand-encodes a fused multiply-add the assembler refuses to emit — genuinely advanced work —
and gains **1%**. V2 changes the algorithm to exploit real-valued input and gains **26%**.

The reason is visible in the baseline profile: a butterfly is ~28 instructions but costs 73–93
cycles. Loop control, address computation and memory access dominate. Removing two arithmetic
instructions from a body that is not arithmetic-bound changes almost nothing.

**Teaching sequence:** have students predict V7's speedup *before* measuring. Most predict
20–30%. The measured 1% is the lesson.

### 2. An optimization can be correct and still lose

V6's interleaved-layout kernel is the **fastest transform in this entire directory** — 1.28×
the baseline kernel. Its total runtime is **15× slower** than baseline, because converting
between split and interleaved layout costs ~95% of the run.

Nothing is wrong with the optimization. The integration cost destroys it. If the ADC or DMA
delivered interleaved samples natively, V6 would win outright.

**Teaching sequence:** show the kernel number first (students conclude V6 wins), then the total
(students learn to ask what a benchmark excludes). `v6.kernel_cycles()` exists specifically to
make both numbers available.

### 3. Compiled Python is not fast Python

`@micropython.native` yields 1.15× over plain Python; `@micropython.viper` yields 1.17×.
Assembly yields **204×**.

The reason is specific and worth stating precisely: viper's native types are *integer* types.
It provides `ptr8`/`ptr16`/`ptr32` but no float pointer, so an FFT's float arithmetic stays
boxed no matter how carefully the loop counters are annotated. Viper is genuinely excellent for
integer and bit-manipulation work — this is simply not that workload.

**Teaching sequence:** this is the antidote to "just add `@micropython.viper`" as folk wisdom.

### 4. Measurement discipline changes conclusions

During development an ad-hoc measurement of V2 — no warm-up, one trial — reported **1.93×**.
The disciplined harness reports **1.26×**. The entire difference was a cold-start baseline:
V0's first run costs ~186,000 cycles against ~130,000 warm, inflating V2's apparent advantage
by more than 50%.

This course is *about* benchmarking. Here is the subject matter caught in the act, in the
course's own repository.

**Teaching sequence:** have students reproduce both measurements deliberately.

### 5. Optimizations compose — sub-linearly

Multiplying the individual speedups of V2, V1, V4 and V7 predicts 1.46×. V9, which stacks all
four, delivers **1.41×**.

They stack well because they attack different costs. They do not stack perfectly because V1 and
V7 overlap: V1 *deletes* the multiplications that V7 would have fused, so V7 has less left to
improve.

## Variant reference

### v0_baseline.py — the reference point
Radix-2 decimation-in-time, split complex buffers, generic stage routine throughout. This is
the Plan 01 implementation. Every speedup in this directory is quoted against it.

Known cost centres: bit-reversal is ~17% of runtime; per-butterfly cost varies 73–93 cycles by
stage; stage 1 is the *most* expensive despite having the simplest possible twiddle.

### v1_specialized.py — stop doing arithmetic that does nothing
Stage 1's only twiddle factor is `W⁰ = (1, 0)`, so its butterfly is a plain add/subtract — four
multiplies removed. Stage 2's twiddles are `(1, 0)` and `(0, −1)`; multiplying by `−i` is a
register swap and a sign flip, no multiplier involved.

Trades code size for speed, an explicit and realistic embedded tradeoff.

### v2_real_input.py — the algorithmic win
All ten test signals are real audio, but the baseline zero-fills an imaginary array and then
spends the whole transform multiplying by those zeros. This variant packs the real signal into a
half-length complex array (`z[k] = x[2k] + i·x[2k+1]`), runs a 256-point FFT, and untangles the
result with an O(n) split step.

Roughly half the butterflies. Part of the saving is returned by the split step — which is itself
a lesson: asymptotically-free fix-up steps are not free at n=512.

**Precondition:** real input only. Feeding it complex data silently produces nonsense. A faster
routine with a precondition is not strictly better than a slower general one.

### v3_python / v3_native / v3_viper — the abstraction ladder
The same algorithm at three levels of acceleration, spanning 26.5M down to 22.7M cycles — while
assembly reaches 130K. See lesson 3.

### v4_fast_bitrev.py — removing an unpredictable branch
The baseline tests `if table[i] > i` on all 512 indices; the test fails for over half of them,
so those iterations execute a load, compare and branch to accomplish nothing. This variant walks
a precomputed list of only the ~240 pairs that actually swap. No test, no branch, no wasted
iteration.

Precomputation happens once at construction, outside any timed region — the classic
precompute-versus-runtime tradeoff.

### v6_interleaved.py — the instructive failure
See lesson 2. Note the justification for interleaving here is *fewer address computations*, not
cache locality: RP2350 runs this data from SRAM with no data cache. An optimization's rationale
is platform-specific and does not transplant from desktop advice.

### v7_vfma_raw.py — the assembler is not the instruction set
The Cortex-M33 implements `VFMA.F32`. MicroPython's assembler rejects the mnemonic. So the
instruction is encoded by hand from the ARM manual's VFP data-processing format and emitted as
raw halfwords with `data()`.

The file documents the full derivation, including the trap that cost real debugging time here:
`Sd = 7` is odd, so the `D` bit (bit 22) is set, and bit 22 lives in the **first** halfword —
`0xEEE0`, not `0xEEA0`. Getting it wrong assembles cleanly and silently computes wrong answers.

`encode_vfma()` is exposed as a plain Python function so students can check their arithmetic
against the manual and reuse it for other unsupported instructions.

### v9_combined.py — do the wins stack?
V2 + V4 + V1 + V7, deliberately excluding V6. See lesson 5.

## Suggested lab structure

1. **Predict, then measure.** Give students V0 and the harness, and have them rank the variants
   before running anything. Collect predictions in writing.
2. **Run the harness.** `mpremote connect <port> run device/compare.py`.
3. **Explain the surprises.** Every student will mis-rank at least V7 and V6.
4. **Implement one variant from its description**, with the file's docstring removed.
5. **Propose a tenth variant** and predict its result.

## Two variants specified but not implemented

- **Radix-4** (Plan 02 §V5). 512 = 4⁴ × 2, so four radix-4 stages plus one radix-2 stage,
  reducing multiplications ~25%. Not attempted here: radix-4 needs four simultaneous complex
  values plus three twiddle pairs live, and the baseline already spills to `s29`/`s30` for lack
  of core registers. Whether it wins or loses to spill traffic is a genuinely open question and
  makes a good student project.
- **Dual-core** (Plan 02 §V8). `_thread` is available and the RP2350 has two M33 cores, but the
  transform is only ~620 µs at V9 speed, so synchronization overhead is significant relative to
  the work. Expected to underperform; instructive precisely for that reason.
- **Fixed-point Q15** (Plan 02 §V9) remains **blocked**: none of the DSP instructions it needs
  (`smulbb`, `smlad`, `qadd16`, `ssat`) are exposed by MicroPython's assembler. See
  [`../../kits/oled-2-buttons/05-asm-instruction-probe.py`](../../kits/oled-2-buttons/05-asm-instruction-probe.py).
  This is the one case that justifies returning to a C/Pico-SDK firmware build.
