---
title: Double Buffering Pipeline
description: Two buffers trade roles every cycle so the microphone never has to stop while the FFT runs.
image: /sims/double-buffering-pipeline/double-buffering-pipeline.png
og:image: /sims/double-buffering-pipeline/double-buffering-pipeline.png
twitter:image: /sims/double-buffering-pipeline/double-buffering-pipeline.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Double Buffering Pipeline

<iframe src="main.html" height="427px" width="100%" scrolling="no"></iframe>

[Run the Double Buffering Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/double-buffering-pipeline/main.html"
        height="427px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

With a single buffer, a real-time spectrum analyzer has an obvious problem:

1. Fill the buffer from the microphone.
2. Run the FFT.
3. Draw the result.
4. Go back to step 1.

During steps 2 and 3, **nobody is reading the microphone.** Every sample that
arrives in that window is gone. The display would be built from a signal with
periodic holes in it.

**Double buffering** removes the problem by removing the sequencing. Use two
buffers and give them opposite jobs. While A is being filled, B is being
processed. Next cycle, they swap.

## Check the Timeline

Press **Advance one cycle** a few times and then look down any column of the
timeline strip. Exactly one buffer is blue in every column, at every instant.

That is the whole guarantee. There is no moment when capture is not happening,
because capture is always assigned to whichever buffer is not busy.

## What It Costs

Twice the RAM for the sample buffer. On a Pico 2 with 520 KB that is a
comfortable trade for a 512-sample buffer, but it is a genuine cost and it is why
the technique is not free.

There is also a constraint hidden in the diagram: **processing must finish before
the other buffer fills.** If your FFT takes longer than one buffer's worth of
capture time, the swap arrives before you are ready and you overrun anyway.
Double buffering buys you concurrency, not unlimited time — that constraint is
exactly the cycle budget from Chapter 2.

## How to Use

1. Press **Advance one cycle** and watch the two boxes swap colors.
2. Press it again. Note that Buffer A alternates between the two roles rather
   than being permanently the "capture" buffer.
3. Press **Auto-play** and watch several cycles run.
4. Scan down each timeline column and confirm the one-blue-per-column rule.
5. Ask yourself: what happens if processing takes 1.5 cycles instead of 1?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- A buffer is a block of RAM holding samples
- An FFT takes measurable time to run

### Learning Objective

Students will be able to **interpret** how two buffers alternate roles between
capture and processing, and **explain** why this prevents the pipeline from
pausing capture.

### Activities

1. **Trace the invariant** (3 min): Students verify the one-buffer-capturing rule
   across every timeline column.
2. **Single-buffer thought experiment** (4 min): Students describe what the
   timeline would look like with only one buffer and where samples would be lost.
3. **Find the constraint** (3 min): Students state what must be true about FFT
   time relative to capture time for double buffering to work.

### Assessment

Ask: "Your capture buffer holds 512 samples at 16 kHz, and your FFT plus draw
takes 40 ms. Does double buffering save you?" (Capture takes 32 ms, so no —
processing overruns and you need a faster FFT or a bigger buffer.)

## Related Resources

- [Chapter 16: Building a Real-Time Spectrum Analyzer](../../chapters/16-building-a-real-time-spectrum-analyzer/index.md)
- [Cycle Budget Calculator](../cycle-budget-calculator/index.md)

## References

1. [Multiple buffering](https://en.wikipedia.org/wiki/Multiple_buffering) — the general technique, including triple buffering.
2. [Direct memory access](https://en.wikipedia.org/wiki/Direct_memory_access) — how the capture side runs without CPU involvement on real hardware.
