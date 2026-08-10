# Lab 24: Real-Time Spectrum Analyzer

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 23](../23-tuner/index.md)  |  **Hardware:** Pico 2, INMP441, OLED

!!! mascot-welcome "Where is the time actually going?"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You have a working analyzer, and it's too slow. Before optimizing anything, find out
    *what* is slow — because almost everyone guesses wrong. Put a stopwatch on every stage
    and let the numbers decide. Let's tune in.

## What You'll Build

The complete pipeline running continuously, with a stopwatch on each stage: capture, window,
FFT, magnitudes, draw. Plus a live verdict on whether you're keeping up with the audio.

## Learning Objectives

- **Assemble** the complete real-time pipeline
- **Instrument** each stage separately with `ticks_us()`
- **Calculate** frame rate and compare against the audio deadline
- **Identify** the bottleneck from measurement rather than intuition
- **Justify** where optimization effort should go

## Concepts Introduced

| ID | Concept |
|---|---|
| 433 | Frame Rate |
| 434 | Stage Profiling |
| 435 | Capture Time |
| 436 | Compute Time |
| 437 | Draw Time |
| 438 | Overlap Processing |
| 439 | Hop Size |
| 440 | Buffer Swapping |
| 441 | Processing Latency |
| 442 | Bottleneck Identification |

## Background

### Two different questions

- *"How fast is my program?"* → total time per frame → **frame rate**
- *"What should I fix?"* → time per stage → **the bottleneck**

Only the second is actionable. A program that runs at 11 fps tells you there's a problem; a
breakdown tells you where.

### The deadline, again

At 12,800 Hz, 256 samples represent **20 ms** of sound. If the pipeline takes longer than that,
audio arrives faster than you can process it.

!!! mascot-thinking "Predict before you look"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Write down your guess for the five stages, in order, before running this. Most people
    put "capture" near the top — reading from hardware *sounds* slow. Hold on to your
    prediction; the measurement is about to disagree with you.

## Procedure

### Step 1 — Predict

Rank these fastest to slowest: **capture, window+DC, FFT, magnitudes, draw**.

### Step 2 — Measure

Open `24-realtime-analyzer.py` and run it:

```python
--8<-- "docs/labs/24-realtime-analyzer/code/24-realtime-analyzer.py"
```

```
stage          us/frame    share
capture            1297       1%
window+DC          9617      11%
FFT               59212      66%
magnitudes         8488      10%
draw              10471      12%
TOTAL             89085
frame rate  : 11.2 fps
audio frame : 20.0 ms   pipeline: 89.1 ms
VERDICT     : NOT real time -- over budget by 4.5x
```

### Step 3 — Read it properly

**Capture is 1%.** Reading from the microphone — the one stage that talks to physical
hardware — is essentially free. The I²S peripheral fills a buffer in the background using
dedicated silicon while the CPU does other things. `readinto()` just collects what's already
waiting.

**The FFT is 66%.** Two-thirds of every frame. That validates the entire plan for Modules 6
and 7: optimizing the FFT is worth more than everything else combined.

**Draw is 12%.** More than capture, less than you'd fear for a screen update.

!!! mascot-warning "Optimizing the wrong stage is worse than doing nothing"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Suppose you spent a week making capture twice as fast. Total gain: **0.5%**. You'd have
    burned a week, added complexity, and the analyzer would still run at 11 fps. Amdahl's
    law in one sentence: your speedup is capped by the fraction you're actually improving.

### Step 4 — Do the arithmetic

If the FFT became *instant* — infinitely fast, zero time — the frame would drop from 89 ms to
about 30 ms. Still over the 20 ms budget.

So the FFT is necessary but not sufficient. That's worth knowing before you start: even a
perfect FFT leaves work to do on the other stages.

### Step 5 — Try the knobs

| Change | Effect |
|---|---|
| N = 128 | ~4× less FFT work, coarser bins |
| fewer bars | less draw time, blockier display |
| `magnitudes` → `fast_magnitudes` | already using the fast one; try the sqrt version |
| draw every other frame | halves draw cost, choppier display |

Every one is a tradeoff. None of them is free.

## Expected Output

The stage table every 20 frames, then a final report naming the biggest cost when you press
Ctrl-C.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Frame rate wildly variable | Garbage collection | Call `gc.collect()` outside the timed region |
| Capture time large | Buffer larger than the FFT needs | Read exactly N samples |
| Times don't sum to total | Untimed work between stages | Every line must fall inside a bracket |
| Draw dominates | Too many bars, or drawing per pixel | Use `fill_rect`, fewer bars |

## Challenges

1. **Overlap.** Advance by N/2 samples instead of N so frames overlap 50% — the Cornell lab's
   approach. What does that do to the frame rate and the responsiveness?
2. **Amdahl in practice.** Suppose Module 7 makes the FFT 100× faster. Using these numbers,
   what frame rate would you get? Is that real time?
3. **Budget your own.** Pick a target of 30 fps. Which stages must change, and by how much?

## Check Your Understanding

1. Why is capture only 1% when it's the stage touching real hardware?
2. What fraction of the frame is the FFT, and why does that justify Modules 6–7?
3. If the FFT became instant, would the analyzer be real time? Show your working.
4. State Amdahl's law in your own words, using this table as the example.
5. Why measure per stage rather than just total time?

!!! mascot-celebration "Module 5 complete — and you know exactly what to fix"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Live spectrum, windowing, a working tuner, and a profiled pipeline. You have a real
    instrument and hard evidence about its bottleneck. **Module 6 is where we learn to
    measure honestly — and Module 7 is where we go get that 66% back.**

---

**Next:** [Lab 25: How Long Did That Take?](../25-timing/index.md)  |  **Previous:** [Lab 23](../23-tuner/index.md)
