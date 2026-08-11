# Session Log: Hands-On Lab Generation

**Date:** 2026-08-10
**Scope:** Assembly FFT implementation, competing variants, and the complete 35-lab hands-on series
**Outcome:** 35 labs written and verified on hardware; learning graph expanded 200 → 574 concepts

---

## 1. What This Session Produced

| Deliverable | Location | State |
|---|---|---|
| Assembly FFT (Plan 01) | `src/fft-benchmark/` | Complete, 10/10 signals verified |
| Competing variants (Plan 02) | `src/fft-benchmark/variants/` | 8 variants built and measured |
| Hands-on lab series (Plan 03) | `docs/labs/` | **35/35 labs written**, all code run on hardware |
| Lab kit | `src/kits/fft-lab-kit/` | `config.py`, `lib/`, `upload-code.sh` |
| Learning graph expansion | `docs/learning-graph/` | 200 → 574 concepts, 17 taxonomies |
| Course description rewrite | `docs/course-description.md` | Updated to match built labs |
| Three plan documents | `docs/plans/01–03` | All executed |

**Not done:** MicroSims (correlation explorer is highest priority), chapter content,
Instructor's Guide.

---

## 2. Hardware Environment — Important for Future Sessions

**Two different boards were used.** This matters, because measurements differ between them.

| | Board A | Board B |
|---|---|---|
| Model | Raspberry Pi Pico 2 | Raspberry Pi Pico **2 W** |
| Firmware | MicroPython v1.28.0 (2026-04-06) | v1.25.0-preview.393 (2025-03-17) |
| Peripherals | OLED only | **OLED + INMP441 microphone** |
| Used for | Plans 01–02, Labs 1–6 | Labs 7–35 (everything audio) |

Both appear at `/dev/cu.usbmodem14401` (only one connected at a time).

**Board B is the one with the microphone** and is the board most labs were verified on. It
carries the old `fft-kit-1` files plus Peter Hinch's libraries in `/lib`.

### Pico 2 W gotcha — onboard LED

On a "W" board the onboard LED is **not GPIO 25** — it is driven by the wireless chip and
reachable only as `Pin("LED")`. `Pin(25)` is *accepted* and lights nothing: no error, no blink.
`config.init_led()` and Lab 2 both try `"LED"` first and fall back to 25.

### Firmware version does NOT matter for Module 7

Verified explicitly: v1.25.0-preview has full VFP support in `@micropython.asm_thumb`
(`vldr`, `vstr`, `vadd`, `vsub`, `vmul`, `vmov`, `vcvt`, `vneg`, `s16+`), plus `data()` and both
code emitters. **No firmware update is needed.** Left deliberately un-updated as evidence the
labs don't require bleeding-edge MicroPython.

---

## 3. Empirical Findings About MicroPython

These were discovered by probing, not documentation, and shaped the labs.

| Finding | Consequence |
|---|---|
| **Full VFP support** in `asm_thumb` | The entire course runs on stock firmware — no C toolchain, no custom build. This overturned Plan 01's original design. |
| **`vfma`/`vmla` NOT supported**; no DSP mnemonics (`smulbb`, `smlad`, `qadd16`, `ssat`, `pkhbt`, `mla`) | Fused multiply-add requires hand-encoding (Lab 33). **Q15 fixed-point is genuinely blocked** without a C toolchain. |
| **`data()` emits into the executable code stream** | Hand-encoded instructions work. Verified: `data(2, 0xEEA0, 0x0A81)` computed 1 + 2×3 = 7.0 correctly. |
| **Single-precision floats** (`repr(1/3)` = `0.3333333`) | Bins that should be zero measure ~1e-4, because `2πkt/N` reaches ~390 radians and float32 can't hold that better than ~4e-5 rad. Forced relative tolerances throughout. |
| **No slice steps** — `b[::-1]`, `x[0::2]` raise `NotImplementedError` | Lab 18 uses explicit `range()` loops. |
| **`array.itemsize` not exposed** | `02-get-info.py` derives it from `len(bytes(a))`. |
| **~1,097 cycles per float multiply** vs 1 cycle in hardware | The core motivation for Modules 6–7. Cross-validates: 23,000 float ops × 1,097 ≈ 21M cycles ≈ the 145 ms measured for a Python 512-point FFT. |

---

## 4. Measured Performance (all on Board B unless noted)

### The course-defining progression

| Implementation | Time / 512-pt FFT | vs 40 ms budget |
|---|---|---|
| Brute-force DFT (Lab 16, extrapolated) | ~21,000 ms | 530× over |
| Pure-Python FFT (Lab 20) | 140 ms | 3.5× over |
| Assembly FFT (Lab 31) | 0.85 ms | 2.1% of budget |
| Best variant, v9 (Lab 34) | 0.59 ms | 1.5% of budget |

### Variant comparison (Lab 34, Board B)

| Variant | Best cycles | Speedup |
|---|---|---|
| v9 combined | 89,027 | **1.412×** |
| v2 real-input | 99,863 | 1.259× |
| v1 specialized | 112,323 | 1.119× |
| v4 branchless bitrev | 121,442 | 1.035× |
| v7 hand-encoded VFMA | 124,985 | **1.006×** |
| v0 baseline | 125,684 | 1.000× |

These match Plan 02's independent measurements on Board A (v9 = 1.41×, v1 = 1.11×).

### Other verified numbers used in labs

- DWT cycle counter: **149.9 MHz** measured vs 150 nominal, free-running without a debugger
- Abstraction ladder: Python 1.0× → `@native` 1.6× → `@viper` 2.6× → assembly **46×**
- Stage profile (Lab 24): capture **1%**, window 11%, **FFT 66%**, magnitudes 10%, draw 12%
- Quantization noise: **~6 dB per bit**, 24-bit → −140 dB, 4-bit → −21 dB
- Parabolic interpolation: 10 Hz error → **1.3 Hz**, but only with a Hanning window (8×)
- Whistle test: 191 tone frames tracked, 300–4400 Hz, smooth monotonic pitch sweeps
- Assembly vs Python FFT: **difference exactly 0.000e+00** (bit-for-bit identical)

---

## 5. Bugs Found and Fixed

### Pre-existing repo bugs

**`analyze-graph.py` DAG check was inverted** (`docs/learning-graph/analyze-graph.py:70`).
It incremented `indeg[prereq]` while the decrement loop used `indeg[concept_id]` — the two
halves disagreed, so every valid DAG reported as invalid. This is why `quality-metrics.md` said
`Valid DAG: ❌ No` alongside `Cycles: 0`. **Fixed**; now reports ✅ Yes.

**`mkdocs.yml` nav pointed at a nonexistent file** — "Hands-On Labs" → `tutorials/tutorial-1.md`.
Fixed to `labs/index.md`, then expanded to all 35 labs grouped by module.

**`docs/labs/01-setup/index.md` was empty**; removed and replaced by the new structure.

### Bugs I introduced and caught during the session

Worth recording because several became teaching material:

| Bug | Symptom | Fix |
|---|---|---|
| VFMA encoding: used `0xEEA0` for `Sd=7` | Assembled fine, computed wrong result silently | `Sd` odd sets the D bit at bit 22, which lives in the **first** halfword → `0xEEE0`. Now Lab 33's headline trap. |
| Lab 13 Part 2 showed 12 *consecutive* products to demonstrate cancellation | All were positive; text contradicted data | Sample across the whole window; now shows 0/13 vs 6/13 negative |
| Lab 22 "main lobe" metric counted everything above 10% of peak | Swept in sidelobes; rectangular looked *widest* when it's narrowest | Relabeled honestly as "spread" (bins contaminated above 1% of peak) after two failed attempts at a main-lobe metric |
| Lab 23 claimed ~1 Hz accuracy without a window | Measured 5.7 Hz, only 2× better than bin-only | Added Hanning window → 1.3 Hz, 8×. Became the lab's central point about *why* windowing matters |
| Lab 32 built each variant immediately before benchmarking it | Heap fragmentation made a **faster** variant measure 3% **slower** | Allocate all variants first, then measure. Now documented inside the lab as a live Lab 26 lesson |
| Lab 34 computed peak from real part only | All six variants reported FAIL at ~1e-2 | A sine's energy is in the *imaginary* part; peak must span both. Now ~1e-7, all PASS |
| Lab 6 used `os.stat()[6]` for every entry | Directories reported as 688 MB on a 3 MB filesystem | Check mode bit `info[0] & 0x4000` first |
| Lab 25 claimed float multiply "a few dozen cycles" | Measured 10,982 — function-call overhead swamped it | Amortize over 2,000 reps minus empty-loop baseline → honest 1,097 |
| Lab 26 cold-start and observer-effect demos | Showed only 0.1% and 0.3% — text overclaimed | Moved to workloads where effects are real: 6.6% and 2.1× |

**Pattern worth noting for future sessions:** the recurring failure mode was *text asserting
something the data didn't show*. Every lab's output should be read against its own prose.

---

## 6. Key Design Decisions

### Architecture: inline assembly, not Pico SDK

Plan 01 originally specified a standalone C firmware project. A hardware probe
(`04-asm-thumb-probe.py`) found full VFP support in MicroPython's inline assembler, which
eliminated the need for `arm-none-eabi-gcc`, CMake, and the Pico SDK — **none of which are
installed on this machine.** Students copy one `.py` file to stock firmware.

### The Module 3 cliff-fix

Analysis of the previous kit (`spectrum-analyzer/src/fft-kit-1/`) found its fatal flaw: file 10
prints one RMS number, file 19 is 297 lines containing bit-reversal, twiddles, butterflies,
windowing and peak detection *simultaneously*. Nothing teaches what a frequency bin is.

Module 3 (Labs 11–16) fixes this by building the DFT from correlation across six labs. This is
the centerpiece of the whole design.

### Ten anti-patterns from the old kit, each mapped to a fix

Pin drift → single `config.py`; version-suffixed duplicates → contiguous numbering; broken
shipped code → every file run before shipping; no validation-on-known-signal → Lab 15; missing
windowing lesson → Lab 22; unused buttons → Lab 5; no deployment lesson → Lab 6; two variables
changed at once → one per lab; dead-end assembly track → Lab 28 gate.

### Naming conventions (user-corrected twice)

- **Dashes** for scripts that are **run**: `02-get-info.py`, `21-whistle-test.py`
- **Underscores** for modules that are **imported**: `fft_asm.py`, `v0_baseline.py`
- Documented in `src/fft-benchmark/variants/README.md`; Python can't `import` a dashed name
- Kit config is `config.py` (not `kit_config.py`) to match the `oled-2-buttons` kit

### Code lives in `docs/labs/*/code/`, not duplicated

`pymdownx.snippets` was enabled in `mkdocs.yml` so lab markdown embeds the real `.py` file. One
canonical copy; the file students run *is* the file the docs show. `upload-code.sh` pulls
directly from there.

---

## 7. Learning Graph State

**200 → 574 concepts** (ceiling 600), valid DAG, max dependency chain 30.

Five new taxonomy categories (12 → 17):

| Code | Name | Count |
|---|---|---|
| `TOOL` | Development Environment | 22 |
| `MCIO` | Microcontroller I/O | 28 |
| `AUDI` | Audio and Acoustics | 34 |
| `ASMP` | Assembly Programming | 52 |
| `LABM` | Laboratory Method | 40 |

**IDs 201–574 are assigned in lab order**, so concept ID sequence matches teaching sequence.
`add-lab-concepts.py` validates this and **refuses to write** a graph where any concept depends
on something taught later.

### Files regenerated

`learning-graph.csv`, `learning-graph.json`, `concept-list.md`, `concept-taxonomy.md` (stale —
see below), `taxonomy-distribution.md`, `quality-metrics.md`, `lab-concepts.csv` (new: lab →
concept index), `taxonomy-names.json`, `color-config.json`.

### ⚠️ Known gaps for the next session

1. **`concept-dependencies.csv` was NOT updated** — it still holds the original 200 concepts and
   now diverges from `learning-graph.csv`. Decide whether it's still needed.
2. **`concept-taxonomy.md` is stale** — describes the old 12-category / 200-concept structure.
3. **Three forward references exist** in the original 200 (67→68, 93→94, 156→157) — dependencies
   pointing at higher IDs. Harmless for DAG validity, but they break the "ID order = teaching
   order" property the new concepts maintain.
4. **New concepts have not been reviewed for duplication** against the original 200. Some
   overlap is likely (e.g. `Bit Reversal` at ID 60 vs `Bit Reversal Permutation` at 373).

---

## 8. Plan 03 Questions — Dan's Answers (for reference)

1. **Lab count:** 32 labs @45 min is fine, do not compress; instructors may skip
2. **Module 8 numbering:** expand to **35 distinct labs**
3. **Microphone timing:** bring it in **early** — "We want to make this class FUN!!!" Whistle
   test explicitly requested
4. **C coverage:** mention it, basic comparison of Assembly/C/MicroPython tradeoffs. Since both C
   and assembly are callable from MicroPython, prefer whichever gives the best result. Very few
   modify production assembly — **reading** both, with a clear picture of how data moves through
   hardware, is the key skill
5. **Capstone:** provide **options**, instructor selects. **Instructor's Guide must be generated
   after chapters** — run `/book-installer`
6. **Assessment:** instructor's choice; simple check-your-understanding per lab, formal quizzes
   later via quiz-generator skill

---

## 9. Current State of the Repository

### New directories

```
docs/labs/                  35 lab dirs, each with index.md + code/
docs/plans/                 01-fft-test-plan, 02-competing-variants, 03-hands-on-labs, index
src/fft-benchmark/          Plan 01/02 work: device/, variants/, tools/, inputs/, outputs/
src/kits/fft-lab-kit/       config.py, lib/{ssd1306,fftlab}.py, upload-code.sh
arm-programming-guide/      Cortex-M33 r1p0 user guide PDF (matched to CPUID 0x411FD210)
logs/                       this file
```

### Deploying to a board

```bash
./src/kits/fft-lab-kit/upload-code.sh
```

Uploads `lib/*.py` → `:lib/`, then `config.py`, then all 36 lab programs. Handles port
detection, `PORT=` override, and warns about the Thonny serial conflict. **Quit Thonny first.**

### Verification status

- All 36 lab code files executed on hardware
- `mkdocs build` clean (only pre-existing plan→`src/` link warnings)
- Learning graph validates as a DAG
- 10/10 FFT test signals pass against numpy at ~1e-7

---

## 10. What Remains

| Task | Priority | Notes |
|---|---|---|
| Regenerate the learning graph | **next session** | See §7 gaps; consider a full regeneration rather than patching |
| MicroSims | high | Correlation explorer (Lab 13) is the single highest-value one; then sampling/aliasing, DFT bin explorer, windowing comparison |
| Chapter content | high | Labs are complete and can anchor chapters |
| **Instructor's Guide** | after chapters | Run `/book-installer` — Dan explicitly asked to be reminded |
| Wiring diagrams / photos | medium | Labs 4, 5, 7 reference wiring tables but have no images |
| Quiz generation | later | Use quiz-generator skill against chapter dirs |
| Radix-4 variant | open research | Genuinely unmeasured; offered as a capstone track |

---

## 11. Notes for Whoever Picks This Up

- **Read a lab's output against its own prose.** The most common defect this session was text
  claiming an effect the measurement didn't show. Six such bugs were caught.
- **Board B has the microphone.** Labs 7–24 need it. Confirm with a non-zero sample read before
  debugging anything else.
- **Quit Thonny before running `mpremote`.** Only one program can hold the serial port; the
  error message is `failed to access /dev/cu.usbmodem... (it may be in use by another program)`.
- **Allocate before you benchmark.** Heap state materially affects variant timing (§5).
- **The plan documents are accurate.** Plans 01–03 were updated as they were executed and
  reflect what was actually built, including where predictions proved wrong.
