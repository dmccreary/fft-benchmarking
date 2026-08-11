---
title: Unit Circle Radians Explorer
description: Watch one rotating angle as a point on the unit circle and as the sine and cosine curves its projections trace out, side by side.
image: /sims/unit-circle-radians-explorer/unit-circle-radians-explorer.png
og:image: /sims/unit-circle-radians-explorer/unit-circle-radians-explorer.png
twitter:image: /sims/unit-circle-radians-explorer/unit-circle-radians-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Unit Circle Radians Explorer

<iframe src="main.html" height="462px" width="100%" scrolling="no"></iframe>

[Run the Unit Circle Radians Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/unit-circle-radians-explorer/main.html"
        height="462px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Sine and cosine are usually introduced twice: once as ratios in a triangle, and
once as wavy curves on a graph. The connection between those two pictures is a
rotating point, and this sim shows both at the same time so the connection is
impossible to miss.

On the left, a point travels around a circle of radius 1. Two dashed lines drop
from it: one to the horizontal axis, one to the vertical.

- The **horizontal** projection is $\cos\theta$.
- The **vertical** projection is $\sin\theta$.

On the right, those two projections are plotted against the angle. The curves
grow only as far as the point has traveled, so the leading dots on the right are
always the same two numbers as the dashed lines on the left.

The angle is shown in **radians first**, degrees second. That ordering is
deliberate — every formula in the rest of this course takes radians.

## Landmarks

The four quarter-turn positions are marked on both views and light up in orange
as the point passes them:

| Angle | Degrees | cos | sin |
|-------|---------|-----|-----|
| 0 | 0° | 1 | 0 |
| π/2 | 90° | 0 | 1 |
| π | 180° | -1 | 0 |
| 3π/2 | 270° | 0 | -1 |

## How to Use

1. Drag the **Angle** slider slowly from 0 and watch both views move together.
2. Stop at π/2. Read the cos and sin values off the circle, then confirm the
   leading dots on the right agree.
3. Note where cosine peaks and where sine peaks. They are a quarter turn apart —
   that is the whole sine/cosine phase relationship, visible geometrically.
4. Press **Play** and adjust the **Rotation speed**. Watch the curves fill in.
5. Find the angles where sine is zero. What is the point doing on the circle at
   those moments?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior) or advanced high school

### Duration

10 minutes

### Prerequisites

- Coordinates on a plane
- A circle of radius 1 centered at the origin

### Learning Objective

Students will be able to **interpret** the relationship between a point rotating
around the unit circle, its angle in radians, and the resulting sine and cosine
waveforms, and **explain** where each curve comes from geometrically.

### Activities

1. **Read both views** (4 min): At five chosen angles, students record cos and
   sin from the circle and verify against the plot.
2. **Quarter turns** (3 min): Students fill in the landmark table from the sim
   rather than from memory.
3. **Explain the offset** (3 min): Students explain, using the circle, why cosine
   leads sine by a quarter turn.

### Assessment

Ask: "At what angle in radians is the point highest on the circle, and what are
cos and sin there?" (π/2; cos = 0, sin = 1.)

## Related Resources

- [Chapter 7: Complex Numbers and Wave Superposition](../../chapters/07-complex-numbers-and-wave-superposition/index.md)

## References

1. [Unit circle](https://en.wikipedia.org/wiki/Unit_circle) — the definition of sine and cosine by coordinates.
2. [Radian](https://en.wikipedia.org/wiki/Radian) — why angles are measured in arc lengths in signal processing.
