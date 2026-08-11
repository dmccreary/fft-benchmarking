---
title: Cycle Budget Calculator
description: Calculate the CPU-cycle budget available for a real-time task from clock speed and deadline, and watch the budget shrink or grow as those parameters change.
image: /sims/cycle-budget-calculator/cycle-budget-calculator.png
og:image: /sims/cycle-budget-calculator/cycle-budget-calculator.png
twitter:image: /sims/cycle-budget-calculator/cycle-budget-calculator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Cycle Budget Calculator

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Cycle Budget Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/cycle-budget-calculator/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Every real-time DSP task comes with a hard question: *how many CPU cycles do I
actually get?* The answer is a simple product:

```
cycle budget = clock speed (Hz) x deadline (seconds)
```

At the Pico 2's stock 150 MHz with a 40 ms deadline, that is 6,000,000 cycles.
That number is your entire allowance. If an FFT costs more than that, it does not
matter how elegant the code is — the deadline is missed.

The sim opens **deliberately over budget**: the sample workload is set to
8,000,000 cycles against a 6,000,000-cycle budget, so the capacity bar is fully
red and the readout says OVER BUDGET by 2,000,000 cycles. Your job is to find the
combinations of clock speed and deadline that bring it back into range.

Each number in the equation is drawn in the color of the slider that controls it,
so you can see at a glance which input you are changing.

## How to Use

1. Read the opening state. Why is the bar entirely red?
2. Predict, before you move anything: if you double the deadline from 40 ms to
   80 ms, does the workload fit? Now drag **Deadline** and check.
3. Return the deadline to 40 ms. Now find the minimum **Clock speed** that fits
   the 8,000,000-cycle workload. (The answer is 200 MHz.)
4. Set the workload to 3,000,000 cycles and read the headroom percentage. What
   does headroom buy you in a real system?
5. Check **Show formula** whenever you want the general relationship with units
   displayed alongside the worked numbers.

## Controls

| Control | Range | Default | Purpose |
|---------|-------|---------|---------|
| Clock speed | 1-200 MHz | 150 MHz | The Pico 2's stock speed is 150 MHz |
| Deadline | 5-100 ms | 40 ms | How long the task has to finish |
| Workload | 100,000-20,000,000 cycles | 8,000,000 | Cost of the sample task |
| Show formula | — | off | Reveals the general equation with units |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-15 minutes

### Prerequisites

- A CPU executes a fixed number of clock cycles per second
- Basic unit conversion between milliseconds and seconds

### Learning Objective

Students will be able to **calculate** the CPU-cycle budget available for a
real-time task given a clock speed and a deadline, and **apply** that budget to
judge whether a given workload fits.

### Activities

1. **Predict-then-check** (5 min): For three parameter pairs supplied by the
   instructor, students compute the budget by hand before setting the sliders.
2. **Find the boundary** (5 min): Students find the exact clock speed at which
   the default workload just fits, then explain why headroom of zero is a risky
   place to ship.
3. **Trade-off discussion** (5 min): Raising the clock costs power and heat;
   loosening the deadline costs responsiveness. Which would you spend first?

### Assessment

Ask students to compute the budget for 133 MHz with a 25 ms deadline
(answer: 3,325,000 cycles) and state whether a 4,000,000-cycle workload fits.

## Related Resources

- [Chapter 2: Know Your Board](../../chapters/02-know-your-board/index.md)

## References

1. [RP2350 Datasheet](https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf) — clock architecture and maximum rated frequencies for the Pico 2.
2. [Rate-monotonic scheduling](https://en.wikipedia.org/wiki/Rate-monotonic_scheduling) — the formal treatment of deadlines and CPU utilization budgets.
