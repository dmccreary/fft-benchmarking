# Lab 15: Validating Your DFT on a Known Signal

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 14](../14-building-a-dft/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Looking right isn't being right"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your DFT produced convincing-looking spectra last lab. So would a DFT with a sign error
    in it, or one that's off by a factor of two. Today we find out which one you have — by
    testing it on signals whose answers we already know. Let's tune in.

## What You'll Build

A test suite for your own DFT: seven signals with spectra you can work out on paper, checked
automatically with an honest tolerance.

## Learning Objectives

- **Predict** a spectrum analytically before computing it
- **Choose** a tolerance appropriate to the arithmetic available
- **Distinguish** absolute from relative error
- **Apply** validation-before-trust as a working habit
- **Debug** by bisection when a test fails
- **Explain** why single-precision floats limit what "zero" means here

## Concepts Introduced

| ID | Concept |
|---|---|
| 344 | Ground Truth |
| 345 | Known Signal Test |
| 346 | Validation Before Trust |
| 347 | Numerical Tolerance |
| 348 | Absolute Error |
| 349 | Relative Error |
| 350 | Bin Exact Frequency |
| 351 | Expected Peak |
| 352 | Debugging By Bisection |
| 353 | Test Signal Design |

## Background

### Why bother, when it looked fine?

Because in Lab 21 you'll point this DFT at a microphone. If the spectrum looks wrong then, the
suspects are: the mic wiring, the sample format, the DC offset, the DFT, the magnitude
calculation, or the display. Six candidates and no way to choose.

Unless you've *already proven* the DFT correct. Then it's five.

Every subsystem in this course gets tested against a known answer before it's trusted with an
unknown one. The previous version of this kit skipped this step, and students who got garbage
had no way to find out why.

### Signals with spectra you can predict

| Signal | Expected spectrum |
|---|---|
| all zeros | every bin 0 |
| constant `D` | bin 0 = `D·N`, rest 0 |
| sine, amplitude `A`, at bin `k` | bin `k` = `A·N/2` (mirrored at `N−k`) |
| impulse at sample 0 | **every** bin = 1.0, perfectly flat |
| alternating +1/−1 | bin `N/2` = `N` |

The impulse is the loveliest of these: one sample of 1.0 and the rest zeros produces a
completely flat spectrum. An instantaneous click contains every frequency equally — which is why
a clap is a decent way to test a room's acoustics.

### Where `A·N/2` comes from

A real sine splits its energy between its bin and the mirror bin. Each half gets `A·N/2`, so
they sum to `A·N`. The program demonstrates this explicitly.

!!! mascot-thinking "How close to zero is zero?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Bins that should be exactly 0 come out around **1×10⁻⁴** on this board. Not a bug —
    MicroPython here uses **single-precision** floats (check: `repr(1/3)` gives
    `0.3333333`, only 7 digits). Our angle `2πkt/N` climbs to about 390 radians for the top
    bins, and a float32 can't pin a number that large down better than ~4×10⁻⁵ radians. So
    `cos()` is inaccurate before it even runs.

## Procedure

### Step 1 — Predict before you run

Fill this in first, using the table above. N = 64.

| Signal | Which bin peaks? | What value? |
|---|---|---|
| constant 0.5 | | |
| sine amplitude 1.0 at bin 3 | | |
| sine amplitude 0.25 at bin 7 | | |
| impulse at sample 0 | | |

### Step 2 — Run the suite

Open `15-validating.py` and run it:

```python
--8<-- "docs/labs/15-validating/code/15-validating.py"
```

```
test signal                expected                           result
--------------------------------------------------------------------------
silence                    every bin zero                     PASS
constant 0.5               bin 0 = 32.0, rest zero            PASS
sine amp 1.0 at bin 3      bin 3 = 32.0                       PASS
sine amp 0.25 at bin 7     bin 7 = 8.0                        PASS
phase-shifted sine         bin 3 still = 32.0                 PASS
impulse at sample 0        every bin = 1.0 (flat spectrum)    PASS
alternating +1/-1          bin 32 = 64 (Nyquist)              PASS
--------------------------------------------------------------------------
7 passed, 0 failed
```

### Step 3 — Understand the tolerance

The suite uses a **relative** tolerance — 0.1% of the expected value — not an absolute one.

That's a deliberate choice. An absolute tolerance of `1e-6` fails every time on this hardware,
not because the DFT is wrong but because the tolerance is a fantasy about precision we don't
have. **A tolerance must match the arithmetic you actually own.**

!!! mascot-warning "A test that fails for the wrong reason is worse than no test"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If your suite cries wolf on every run, you'll start ignoring it — and then it won't
    catch the real bug when it appears. Getting the tolerance right is part of writing the
    test, not an afterthought.

### Step 4 — Break it deliberately

Introduce a bug and confirm the suite catches it. Change the DFT's sign:

```python
im += signal[t] * math.sin(angle)     # was -=
```

Which tests fail? Which still pass? Now try a scale error — divide `re` and `im` by 2. Notice
that the *impulse* test still passes while the sine tests fail. Test suites have blind spots,
and knowing yours is part of the job.

### Step 5 — Debug by bisection

When something fails, don't stare at 64 bins. Shrink the problem:

1. Drop N to 8 — small enough to check by hand
2. Use the simplest failing signal
3. Print intermediate values inside the loop
4. Compare one bin against arithmetic you do yourself

## Expected Output

All 7 tests pass, then the precision discussion, then a demonstration that bins 3 and 61 each
hold 32.0 and sum to 64.0 = `A·N`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Everything fails | Tolerance too tight | Use relative, not absolute |
| Only sine tests fail | Scale or sign error in the DFT | Check the `A·N/2` derivation |
| Impulse test fails | Impulse not at index 0 | A shifted impulse changes phase, not magnitude |
| Nyquist test fails | Off-by-one on `N/2` | With N = 64 the Nyquist bin is 32 |
| Results differ run to run | Not possible here — it's deterministic | Something else changed; check your edits |

## Challenges

1. **Add a test.** Two sines at different bins and amplitudes. Predict both peaks, then check.
2. **Find the limit.** Lower `REL_TOL` until tests start failing. What's the tightest tolerance
   this hardware supports?
3. **Parseval's theorem.** The energy in the time domain equals the energy in the frequency
   domain (with a scale factor). Work out the factor and add it as a test — it's a strong
   whole-transform check.

## Check Your Understanding

1. Why validate against a known signal before using a microphone?
2. What spectrum does an impulse produce, and why?
3. A sine of amplitude 1.0 with N = 128 — what's the peak bin value?
4. Why is a relative tolerance better than an absolute one here?
5. Describe debugging by bisection in your own words.

!!! mascot-celebration "Now you can trust it"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Seven predictions, seven confirmations. Your DFT is correct — and you can *prove* it,
    which is a different and better thing than believing it. **Next lab: find out whether
    it's fast enough.** (It is not. Spectacularly.)

---

**Next:** [Lab 16: Your DFT Is Too Slow](../16-too-slow/index.md)  |  **Previous:** [Lab 14](../14-building-a-dft/index.md)
