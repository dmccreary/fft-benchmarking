---
title: Parabolic Interpolation Peak Finder
description: Adjust three neighboring bin magnitudes and calculate where the true peak actually sits between bins.
image: /sims/parabolic-interpolation-peak-finder/parabolic-interpolation-peak-finder.png
og:image: /sims/parabolic-interpolation-peak-finder/parabolic-interpolation-peak-finder.png
twitter:image: /sims/parabolic-interpolation-peak-finder/parabolic-interpolation-peak-finder.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Parabolic Interpolation Peak Finder

<iframe src="main.html" height="437px" width="100%" scrolling="no"></iframe>

[Run the Parabolic Interpolation Peak Finder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/parabolic-interpolation-peak-finder/main.html"
        height="437px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The tallest bin tells you the peak is *somewhere near* that frequency. With
31 Hz bins that is not good enough for a tuner, which needs about 1.3 Hz.

But the neighbors carry information. If the bin above the peak is taller than the
bin below it, the true peak must lie toward the higher side. **Parabolic
interpolation** turns that intuition into a number: fit a parabola through the
three magnitudes and take its vertex.

$$\delta = \frac{1}{2} \cdot \frac{\alpha - \gamma}{\alpha - 2\beta + \gamma}$$

where $\alpha$, $\beta$, $\gamma$ are the bins below, at, and above the peak. The
result is an offset in **fractions of a bin**, and the refined frequency is
$(k + \delta) \times f_s / N$.

At the defaults, $\gamma = 70$ exceeds $\alpha = 60$, so $\delta = +0.071$ — the
peak is a little above bin $k$, exactly as the shape suggests.

## The Symmetric Case

Set $\alpha$ and $\gamma$ to the same value. The offset snaps to exactly zero and
the marker lands on the bin center.

This is the sanity check for any implementation of this formula: symmetric
neighbors must give zero. If yours does not, the sign convention is wrong
somewhere.

## Three Multiplies, Not Another FFT

The whole calculation is a subtraction, an addition, and a division. Compared
with doubling N to buy the same resolution — which quadruples the FFT cost —
this is nearly free.

That is why it is worth knowing: it converts "resolution" from something you buy
with compute into something you get from arithmetic you were already doing.

## How to Use

1. At the defaults, verify by hand:
   $0.5(60-70)/(60-200+70) = -5/-70 = 0.0714$.
2. Set $\alpha = \gamma = 70$. Confirm $\delta$ becomes exactly 0.
3. Set $\alpha = 90$, $\gamma = 30$. The peak now leans toward the lower bin and
   $\delta$ goes negative.
4. Watch the fitted parabola as you drag. Its vertex is always where the marker
   sits — the marker is not an approximation of the curve, it *is* the curve's
   maximum.
5. Try making $\beta$ smaller than both neighbors. The parabola flips upward and
   the formula stops being meaningful — real code must check that the middle bin
   is genuinely the largest first.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A spectrum is a magnitude per bin
- Quadratic functions and their vertex

### Learning Objective

Students will be able to **calculate** the parabolic interpolation offset from
three neighboring magnitudes and **demonstrate** how the estimated peak shifts
between bins.

### Activities

1. **Hand-verify** (4 min): Students compute $\delta$ on paper for the defaults
   and for one other triple.
2. **Symmetry check** (3 min): Students confirm the symmetric case gives zero and
   explain why the formula guarantees it.
3. **Estimate a frequency** (5 min): Given bin 14 at 31.25 Hz spacing and
   $\delta = 0.071$, students compute the refined frequency and convert it to a
   note.

### Assessment

Ask: "Bin 20 is the peak with neighbors 40 and 80 on either side. Compute δ and
state which direction the true peak lies. What would go wrong if you skipped the
check that bin 20 is actually the largest?"

## Related Resources

- [Chapter 15: Windowing, Spectral Leakage, and Peak Detection](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
- [Frequency To Musical Note Calculator](../frequency-to-musical-note-calculator/index.md)

## References

1. [Quadratic interpolation of spectral peaks](https://ccrma.stanford.edu/~jos/sasp/Quadratic_Interpolation_Spectral_Peaks.html) — the standard reference derivation.
2. [Parabola](https://en.wikipedia.org/wiki/Parabola#Vertex) — the vertex formula underlying the result.
