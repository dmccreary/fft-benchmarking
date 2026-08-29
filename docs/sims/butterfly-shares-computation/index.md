---
title: The Butterfly Shares Computation
description: Set a, b, and the twiddle angle W with sliders, then toggle whether b*W is shared between both outputs to compare instruction counts.
image: /sims/butterfly-shares-computation/butterfly-shares-computation.png
og:image: /sims/butterfly-shares-computation/butterfly-shares-computation.png
twitter:image: /sims/butterfly-shares-computation/butterfly-shares-computation.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# The Butterfly Shares Computation

<iframe src="main.html" height="782px" width="100%" scrolling="no"></iframe>

[Run The Butterfly Shares Computation MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/butterfly-shares-computation/main.html"
        height="782px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A butterfly takes two complex inputs and produces two complex outputs:

$$\text{output}_1 = a + Wb \qquad \text{output}_2 = a - Wb$$

Both expressions share the term $Wb$. Compute it once, reuse it twice — that
reuse is the entire reason the FFT beats the direct DFT.

Drag the **a**, **b**, and **W angle** sliders to pick any butterfly, then
toggle **Share b × W between both outputs**:

- **Checked** — the diagram shows one multiply node feeding both outputs, the
  way a real FFT does it.
- **Unchecked** — the diagram splits into two separate multiply nodes, one per
  output, the way a direct DFT would recompute the same product twice.

The two cards below the diagram total up real multiplies and real adds for
whichever mode is active, so you can see the instruction cost directly rather
than just the values.

## Where the Numbers Come From

| Mode | Real multiplies | Real adds | Total |
|---|---|---|---|
| Without sharing | 8 | 8 | 16 |
| With sharing | 4 | 6 | 10 |

A complex multiply expands to 4 real multiplies and 2 real adds. Without
sharing, $Wb$ is computed twice — 8 multiplies, 4 internal adds — plus 4 more
adds to combine each product with $a$: 8 and 8. With sharing, $Wb$ is computed
once — 4 multiplies, 2 internal adds — and reused for both combines: 4 and 6.

Sharing saves 4 multiplies and 2 adds **per butterfly**. A 512-point FFT runs
2,304 butterflies, so that one sharing decision saves roughly 9,216 real
multiplies across the whole transform.

## How to Use

1. Leave the defaults ($a = 3 + 1i$, $b = 2 - 1i$, $W$ at $45°$) — the same
   values worked by hand in [Lab 19: The Butterfly](../../labs/19-butterfly/index.md).
   Confirm $Wb \approx 0.71 - 2.12i$.
2. With **Share** checked, note the single multiply node and the "4 / 6" card
   highlighted in green.
3. Uncheck **Share**. The diagram splits into two multiply nodes and the
   "8 / 8" card lights up in red — the outputs don't change, only the work
   needed to produce them.
4. Move the **W angle** slider to $0°$. Now $W = 1$ and $Wb = b$: the butterfly
   reduces to a plain sum and difference either way.
5. Predict the saved-multiplies count for a 1,024-point FFT (twice the
   butterflies of 512), then check your reasoning against the scaling line
   under the cards.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- Complex arithmetic in rectangular form
- Twiddle factors as points on the unit circle
- [Lab 19: The Butterfly](../../labs/19-butterfly/index.md)

### Learning Objective

Students will be able to **compare** the instruction counts of a shared-product
butterfly against an unshared one, and **explain** why sharing is the source of
the FFT's arithmetic saving.

### Activities

1. **Hand-verify** (3 min): Students compute $Wb$ for the default values and
   check it against the diagram.
2. **Count the operations** (4 min): Students toggle the checkbox and record
   the multiply/add totals in both modes.
3. **Scale it up** (3 min): Students multiply the per-butterfly saving by the
   butterfly count for 512- and 1,024-point FFTs.

### Assessment

Ask: "Sharing saves 4 multiplies per butterfly. A 256-point FFT runs 1,024
butterflies. How many real multiplies does sharing save across that transform?"

## Related Resources

- [Lab 19: The Butterfly](../../labs/19-butterfly/index.md)
- [Butterfly Operation Visualizer](../butterfly-operation-visualizer/index.md)
- [Chapter 11: From DFT to FFT](../../chapters/11-from-dft-to-fft/index.md)

## References

1. [Butterfly diagram](https://en.wikipedia.org/wiki/Butterfly_diagram) — the standard notation shown here.
2. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) — where these butterflies are assembled into a full transform.
3. [Twiddle factor](https://en.wikipedia.org/wiki/Twiddle_factor) — the W values selectable here.
