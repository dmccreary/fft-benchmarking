---
title: Butterfly Operation Visualizer
description: Set a, b, and a twiddle factor and watch the single shared product W×b feed both butterfly outputs.
image: /sims/butterfly-operation-visualizer/butterfly-operation-visualizer.png
og:image: /sims/butterfly-operation-visualizer/butterfly-operation-visualizer.png
twitter:image: /sims/butterfly-operation-visualizer/butterfly-operation-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Butterfly Operation Visualizer

<iframe src="main.html" height="462px" width="100%" scrolling="no"></iframe>

[Run the Butterfly Operation Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/butterfly-operation-visualizer/main.html"
        height="462px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The butterfly is the FFT's basic unit of work. It takes two complex inputs and
produces two complex outputs:

$$\text{output}_1 = a + W b \qquad \text{output}_2 = a - W b$$

Look at those two expressions. They share a term. The product $Wb$ appears in
both, and it is computed **once**.

That is the entire economy of the FFT. A direct DFT would compute a
twiddle-weighted product separately for each output. The butterfly computes one
product and spends it twice — once added, once subtracted. Two outputs for the
price of one multiply and two additions.

Scale that saving across $\log_2 N$ stages and $N/2$ butterflies per stage, and
$N^2$ becomes $N \log N$.

## The Complex Multiply

$Wb$ is a complex multiplication, which expands to four real multiplies:

$$(w_{re} + w_{im}i)(b_{re} + b_{im}i) = (w_{re}b_{re} - w_{im}b_{im}) + (w_{re}b_{im} + w_{im}b_{re})i$$

The panel shows this form and then the numeric result, so you can check the four
products by hand. This matters later: when we start counting cycles, "one complex
multiply" will mean four real multiplies and two real adds, and that expansion is
where the cycles actually go.

## How to Use

1. With the defaults ($a = 1 + 0.5i$, $b = 2 - 1i$, $W = W_8^1$), verify $W \times b$
   by hand using the four-multiply form. The panel says 0.71 − 2.12i.
2. Confirm output1 and output2 differ only in the sign applied to that product.
3. Press **Compute**. Two markers leave the multiply node at once, travelling to
   both outputs — the same value going two places.
4. Change $W$ to $W_8^0 = 1$. Now $Wb = b$, and the butterfly reduces to plain
   sum and difference. This is what the first FFT stage always looks like.
5. Set $W = W_8^2 = -i$. Multiplying by $-i$ is a quarter-turn rotation, which
   needs no multiplier at all — just a swap and a sign flip. Optimized FFTs
   special-case this.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12 minutes

### Prerequisites

- Complex arithmetic in rectangular form
- Twiddle factors as points on the unit circle

### Learning Objective

Students will be able to **calculate** both butterfly outputs from chosen values
of $a$, $b$, and $W$, and **demonstrate** that both derive from a single shared
product.

### Activities

1. **Hand-verify** (5 min): Students compute $Wb$, output1, and output2 on paper
   for the defaults and compare against the panel.
2. **Count the operations** (4 min): Students count real multiplies and real adds
   for one butterfly, then for the same two outputs computed independently.
3. **Special cases** (3 min): Students identify which twiddle values need no
   general multiply and explain why.

### Assessment

Ask: "A butterfly costs one complex multiply and two complex adds. Computing the
same two outputs without sharing would cost two complex multiplies and two adds.
Across 512 butterflies, how many complex multiplies does the sharing save?"

## Related Resources

- [Chapter 11: From DFT to FFT](../../chapters/11-from-dft-to-fft/index.md)

## References

1. [Butterfly diagram](https://en.wikipedia.org/wiki/Butterfly_diagram) — the standard notation shown here.
2. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) — where these butterflies are assembled into a full transform.
3. [Twiddle factor](https://en.wikipedia.org/wiki/Twiddle_factor) — the W values selectable here.
