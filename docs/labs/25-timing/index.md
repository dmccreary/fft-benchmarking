# Lab 25: How Long Did That Take?

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 24](../24-realtime-analyzer/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "A stopwatch that counts clock ticks"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    We're about to start shaving percentages off an FFT, and microseconds are too blunt for
    that. Hidden in your Cortex-M33 is a counter that ticks once per CPU clock — every
    6.667 nanoseconds. Let's switch it on. **Time to transform!**

## What You'll Build

Cycle-accurate timing read straight from a hardware register, verified against a known delay,
and used to measure operations far too small for `ticks_us()` to see.

## Learning Objectives

- **Recognise** when `ticks_us()` resolution is insufficient
- **Enable** the DWT cycle counter by setting two register bits
- **Verify** a counter is running before trusting it
- **Measure** operations smaller than the measurement overhead
- **Handle** 32-bit counter wraparound

## Concepts Introduced

| ID | Concept |
|---|---|
| 443 | Millisecond Timer |
| 444 | Microsecond Timer |
| 445 | Timer Resolution |
| 446 | Counter Wraparound |
| 447 | Cycle Counter |
| 448 | DWT Unit |
| 449 | CYCCNT Register |
| 450 | DEMCR Register |
| 451 | Register Bit Manipulation |
| 452 | Cycles To Microseconds |
| 453 | Counter Verification |

## Background

### Two registers, two bits

```
DEMCR      0xE000EDFC   bit 24 (TRCENA)     enable the trace unit
DWT_CTRL   0xE0001000   bit 0  (CYCCNTENA)  enable the cycle counter
DWT_CYCCNT 0xE0001004                       the counter itself
```

Fixed by ARM, identical on every Cortex-M33, reachable from MicroPython with `machine.mem32` —
the same technique you used in Lab 3 to read `CPUID`.

### Verify, don't assume

On some implementations this counter only runs while a debugger is attached. A stalled counter
reports **0 cycles for everything**, which looks like infinitely fast code.

Check it against a known delay: sleep 100 ms, count the cycles, divide. If it doesn't come out
near your clock speed, don't believe anything below it.

!!! mascot-warning "An instrument that reads zero looks like success"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    This is the nastiest failure mode in measurement: the broken result is
    *indistinguishable from a spectacular one*. Always sanity-check a stopwatch against
    something whose duration you already know.

## Procedure

### Step 1 — See the limit of `ticks_us`

Part 1 times a single addition ten times. You get 1 or 2 µs — and nearly all of that is the
cost of calling `ticks_us` twice. **The measurement is bigger than the thing measured.**

### Step 2 — Enable and verify

```python
--8<-- "docs/labs/25-timing/code/25-timing.py"
```

```
cycles counted over ~100 ms : 14934446
implied clock               : 149.94 MHz
machine.freq() says         : 150.00 MHz

Agrees with the real clock. The counter is trustworthy.
```

### Step 3 — Measure the unmeasurable

A single operation is still hopeless to time directly — a MicroPython function call costs
thousands of cycles. The standard trick: run it many times inside one timed region, subtract an
empty loop, divide.

```
operation             cycles each  nanoseconds
integer add                 123.1          820
float multiply             1097.3         7315
math.sqrt                  2156.2        14375
math.cos                   2016.6        13444
```

### Step 4 — Absorb what that means

The RP2350's FPU multiplies two floats in **one cycle**. MicroPython takes **1,097**.

Roughly a thousand cycles of fetching bytecode, checking types, allocating objects and
unboxing values — to wrap one instruction of real work.

!!! mascot-thinking "Cross-check it against Lab 20"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A 512-point FFT does about 23,000 float operations. At ~1,000 cycles each that's
    ~23 million cycles ≈ **150 ms** — which is almost exactly the 145 ms Lab 20 measured.
    Two independent measurements agreeing is how you know you understand a system.

### Step 5 — Mind the wrap

CYCCNT is 32 bits, so it overflows every `2³²/150 MHz` ≈ **28.6 seconds**. Mask the subtraction
and anything shorter than that is measured correctly:

```python
elapsed = (end - start) & 0xFFFFFFFF
```

## Expected Output

The four sections above. Your cycle counts will vary slightly; the ~150 MHz verification and the
~1,000-cycles-per-float-multiply result should hold.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Counter always 0 | TRCENA not set | Set DEMCR bit 24 *before* DWT_CTRL bit 0 |
| Implied clock ~0 | Counter stalled | Don't trust any timing; investigate first |
| Huge negative elapsed | Wrap without mask | `& 0xFFFFFFFF` |
| Per-op costs look enormous | Overhead not subtracted | Subtract the empty-loop baseline |

## Challenges

1. **Time your FFT.** Measure Lab 20's 512-point FFT in cycles. How does it compare to 145 ms?
2. **Cost of a call.** Measure an empty function call. How many float multiplies is it worth?
3. **Force a wrap.** Time something longer than 28.6 seconds and watch the mask save you.

## Check Your Understanding

1. Which two bits must be set, in which registers, to start the counter?
2. Why verify the counter instead of trusting it?
3. Why can't you time a single float multiply directly?
4. A float multiply takes ~1,097 cycles in MicroPython. What does the hardware need?
5. When does the wraparound mask matter?

!!! mascot-celebration "Now you can see the small stuff"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    A precise instrument, verified. **Next lab: four ways it will still lie to you** — and
    how to stop it.

---

**Next:** [Lab 26: Benchmarking Methodology](../26-benchmarking/index.md)  |  **Previous:** [Lab 24](../24-realtime-analyzer/index.md)
