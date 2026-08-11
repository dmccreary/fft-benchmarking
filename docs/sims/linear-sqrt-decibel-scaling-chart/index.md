---
title: Linear Sqrt Decibel Scaling Chart
description: The same spectrum under power, magnitude, and decibel scaling — and a judgment about which reveals quiet content next to a dominant peak.
image: /sims/linear-sqrt-decibel-scaling-chart/linear-sqrt-decibel-scaling-chart.png
og:image: /sims/linear-sqrt-decibel-scaling-chart/linear-sqrt-decibel-scaling-chart.png
twitter:image: /sims/linear-sqrt-decibel-scaling-chart/linear-sqrt-decibel-scaling-chart.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Evaluate
---

# Linear Sqrt Decibel Scaling Chart

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Linear Sqrt Decibel Scaling Chart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/linear-sqrt-decibel-scaling-chart/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

These are three views of **one dataset**. The numbers behind the bars never
change. Only the function applied before drawing them changes.

The example spectrum has one dominant component at bin 3 and several genuinely
present components at roughly 1-5% of its power — the situation you hit
constantly in real audio, where one loud tone sits beside quieter harmonics and
noise.

| Mode | Transform | What survives |
|------|-----------|---------------|
| Linear (power) | $p$ | The peak, and essentially nothing else |
| Square root (magnitude) | $\sqrt{p}$ | The peak plus the strongest few |
| Decibel | $10\log_{10}(p / p_{max})$ | Everything, including the noise floor |

## Make the Judgment

Switch to **Linear** and look at bin 13. It carries 4.5% of the peak's power —
that is a real, substantial component — and it is a barely visible stub. Bin 10,
at 1.2%, has vanished entirely.

Now switch to **Decibel**. Bin 13 is clearly the second-strongest thing in the
frame, and even the noise floor around -30 dB is legible.

So decibels win? Not unconditionally. On a dB plot the peak no longer *looks*
like it dominates, because a 30 dB difference is a factor of 1000 in power but
only about a third of the plot height. If the question is "how much louder is
the loudest thing", the linear plot answers it honestly and the dB plot
understates it dramatically.

The judgment depends on what the display is for:

- **Detecting quiet content** → decibels.
- **Judging relative energy** → linear.
- **A general-purpose spectrum display** → square root, which is the usual
  compromise and what most analyzers show.

## How to Use

1. Start in **Linear**. Read the caption's list of bins that have effectively
   disappeared.
2. Hover bin 13. The tooltip shows raw power 45.0 alongside its displayed value.
3. Switch to **Square root**. Which bins became visible?
4. Switch to **Decibel**. Count how many bins are now readable.
5. Decide: for a 128-pixel-wide OLED spectrum display on the Pico, which would
   you choose, and what would you be giving up?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A spectrum is a magnitude per frequency bin
- Logarithms and the decibel definition

### Learning Objective

Students will be able to **compare** the same spectrum under three scalings and
**judge** which best reveals quiet frequency content alongside a dominant peak.

### Activities

1. **Inventory the losses** (4 min): In linear mode, students list every bin they
   cannot see and check its true power via tooltip.
2. **Compare** (4 min): Students record how many bins are readable under each
   mode.
3. **Defend a choice** (4 min): Given a stated purpose — leak detection, loudness
   metering, general display — students choose a scaling and justify it.

### Assessment

Ask: "A component at 1% of peak power is invisible on your linear display. How
many dB below the peak is it, and would it be visible on a -60 dB plot?"
(-20 dB; yes, comfortably.)

## Technical Details

- **Library:** Chart.js 4.4.0
- **Data:** one fixed 16-bin power spectrum, rescaled per mode
- **dB floor:** -60 dB, with bars anchored to the floor rather than to zero

## Related Resources

- [Chapter 14: Computing and Displaying a Real Spectrum](../../chapters/14-computing-and-displaying-a-real-spectrum/index.md)
- [Dynamic Range Ladder](../dynamic-range-ladder/index.md)

## References

1. [Decibel](https://en.wikipedia.org/wiki/Decibel) — the logarithmic ratio used here.
2. [Spectral density](https://en.wikipedia.org/wiki/Spectral_density) — power versus magnitude conventions.
3. [Chart.js Documentation](https://www.chartjs.org/docs/latest/) — the charting library.
