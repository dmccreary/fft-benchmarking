# Lab 26: Benchmarking Methodology

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 25](../25-timing/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Four ways your stopwatch will lie"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A precise instrument used carelessly produces precise nonsense. Every mistake in this
    lab was made for real while building this course — including one that turned a reported
    "1.93× speedup" into an honest 1.26×. Let's tune in.

## What You'll Build

Four demonstrations of benchmark failure, measured on your own board, and a five-line reporting
format you can defend.

## Learning Objectives

- **Measure** the cold-start penalty and explain why it varies by workload
- **Justify** best-of-N over mean for a deterministic algorithm
- **Demonstrate** the observer effect from fine-grained timing
- **Identify** what a timed region silently excludes
- **Report** a benchmark honestly

## Concepts Introduced

| ID | Concept |
|---|---|
| 454 | Cold Start Effect |
| 455 | Warm Up Discard |
| 456 | Best Of N |
| 457 | Minimum Sample |
| 458 | Variance Sources |
| 459 | Interrupt Interference |
| 460 | Observer Effect |
| 461 | Timing Overhead |
| 462 | Measurement Discipline |
| 463 | Prediction Before Measurement |
| 464 | Honest Reporting |
| 465 | What A Benchmark Excludes |
| 466 | Negative Result |

## Background

Run the lab and work through each lie in turn.

```python
--8<-- "docs/labs/26-benchmarking/code/26-benchmarking.py"
```

### Lie 1 — the first run is not like the others

```
first run ever : 133851 cycles
best of next 15: 125608 cycles
penalty        : 6.6%
```

Cold code paths, empty branch predictors, an untouched flash cache.

The size of this effect **depends on the workload** — under 1% for the pure-Python FFT, over 6%
for the assembly one. You can't predict it, which is precisely why you always discard a warm-up.

### Lie 2 — the mean hides the truth

```
30 runs of the SAME code on the SAME data:
  best   : 125509 cycles
  worst  : 134194 cycles
  spread : 6.9%
```

Identical work, different answers — interrupts, USB servicing, memory refresh.

The distribution is **asymmetric**. Nothing makes code run faster than it truly is; plenty makes
it slower. So there's a hard floor and a long tail, and **the floor is the honest number**.

!!! mascot-thinking "Report both"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Best-of-N is the speed. The spread is the honesty. Quote the first alone and you're
    hiding how noisy your measurement was; quote the mean alone and you're reporting
    interrupt load as if it were your algorithm.

### Lie 3 — measuring changes what you measure

```
500 tiny multiplications
  timed as one block :   772077 cycles
  timed one by one   :  1613746 cycles
  inflation          : 2.1x
```

Same work, **twice the apparent cost** — because each probe costs more than the multiply it
measures.

This is not hypothetical. While building Lab 16, timing the FFT's nine stages separately summed
to 206,000 cycles when the whole transform took 127,000.

**Profile in pieces to find the bottleneck. Measure the whole thing to report it.**

### Lie 4 — what the timed region leaves out

```
the FFT itself      :   125509 cycles
loading the buffers :   656753 cycles  (523% of the FFT)
building the tables :  5660564 cycles  (45.1 FFTs' worth)
```

Filling the buffers costs **five times more than the transform**. Building the tables costs
forty-five transforms.

Excluding both is defensible — tables are built once, and the microphone fills buffers anyway —
but it must be **stated**.

!!! mascot-warning "A real example from this project"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    One FFT variant looked **15× slower** than the baseline until someone noticed its timed
    region included a data-format conversion the others didn't need. Its actual transform
    was the *fastest of the lot*. Same code, opposite conclusion, depending entirely on
    where the stopwatch started.

## Procedure

### Step 1 — Predict

> Before running: how much slower do you think the first run is? How much spread across 30
> identical runs?

Write both down.

### Step 2 — Run and compare

Work through the four lies. Which surprised you most?

### Step 3 — Reproduce the 1.93× mistake

During development of this course, an early ad-hoc measurement reported a variant at **1.93×**
faster. The disciplined harness later reported **1.26×**.

The entire difference was a cold-start baseline: the *reference* implementation's first run was
being compared against the *optimized* version's warm runs.

Try it deliberately. Time the assembly FFT's first run, compare it against the best of 15 warm
runs, and see how large a fake speedup you can manufacture without writing a single line of
faster code.

### Step 4 — Adopt the format

```
512-point assembly FFT, 20 trials after one discarded warm-up:
  best   :   126126 cycles =   840.8 us
  mean   :   127127 cycles =   847.5 us
  stddev :      872 cycles (0.7%)
  excludes table construction and buffer loading
```

Five lines. The last one is what separates a measurement from a marketing claim.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No cold-start effect | Function already called | Restart the board first |
| Spread near 0% | Very short measurement | Time something longer |
| Inflation ratio ~1 | Operation too large | Use something tiny |
| Negative "cost of instrumentation" | Noise exceeded the effect | Take the best of several |

## Challenges

1. **Manufacture a lie.** Produce a 1.5× "speedup" between two identical pieces of code using
   only bad methodology. Then write down which rule each trick broke.
2. **Find your interrupt load.** Run 100 trials and histogram them. Is the tail from one source
   or several?
3. **Full disclosure.** Rewrite Lab 24's stage report to state its exclusions explicitly.

## Check Your Understanding

1. Why discard the first run, and why can't you predict how much it matters?
2. Why is best-of-N more honest than the mean for deterministic code?
3. What is the observer effect, and when does it dominate?
4. Give an example where excluding something from a timed region flips the conclusion.
5. What five things belong in a defensible benchmark report?

!!! mascot-celebration "You can now measure honestly"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Precise *and* trustworthy. **Next lab uses it to price every layer of abstraction**
    between Python and the metal.

---

**Next:** [Lab 27: The Abstraction Ladder](../27-abstraction-ladder/index.md)  |  **Previous:** [Lab 25](../25-timing/index.md)
