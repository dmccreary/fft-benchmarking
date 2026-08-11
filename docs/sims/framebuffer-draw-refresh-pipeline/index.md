---
title: Framebuffer Draw Refresh Pipeline
description: Trace a drawing call from your code into the RAM framebuffer and out over SPI to the glass, showing why nothing is visible until show() is called.
image: /sims/framebuffer-draw-refresh-pipeline/framebuffer-draw-refresh-pipeline.png
og:image: /sims/framebuffer-draw-refresh-pipeline/framebuffer-draw-refresh-pipeline.png
twitter:image: /sims/framebuffer-draw-refresh-pipeline/framebuffer-draw-refresh-pipeline.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Framebuffer Draw Refresh Pipeline

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Framebuffer Draw Refresh Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/framebuffer-draw-refresh-pipeline/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The single most common OLED bug is calling `oled.text(...)` and seeing nothing
happen. The display is not broken — the drawing call did exactly what it was
supposed to do. It just did not do what you assumed.

Drawing calls write bits into a **framebuffer**: 1024 bytes of RAM holding one
bit for each of the 128 x 64 pixels. That is where they stop. The glass is not
involved and does not know anything changed. Only `oled.show()` reads that buffer
and pushes all 1024 bytes across SPI in one burst.

The sim opens in exactly the state that causes the confusion: **"Hi" is already
sitting in the framebuffer and the physical display is still black.** Press
**Step** to walk the rest of the way and watch the glass finally light up.

## How to Use

1. Look at the opening state. The framebuffer shows "Hi". The physical OLED shows
   nothing. Explain why before pressing anything.
2. Press **Step** repeatedly. Watch which stage lights up each time, and note the
   exact step at which the physical pixels change.
3. Now check **Draw another line WITHOUT calling show()**. A second shape appears
   in the framebuffer immediately — and the glass does not change.
4. Press **Step** until you pass `oled.show()` again. Now both shapes appear on
   the glass at once. This is why you can batch many drawing calls and pay for
   only one refresh.
5. Click any box to read its definition.

## Controls

| Control | Purpose |
|---------|---------|
| Step | Advance one stage; wraps to the start after the last stage |
| Reset | Return to the opening state and clear the glass |
| Draw another line WITHOUT calling show() | Adds a shape to the framebuffer only |
| Click any node | Shows that stage's definition |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior) or advanced high school

### Duration

10 minutes

### Prerequisites

- RAM holds data while a program runs
- A display is a separate device connected by wires

### Learning Objective

Students will be able to **explain** why changes to a framebuffer are invisible
until `.show()` is called, and **summarize** how a text-rendering call becomes
lit pixels on the physical screen.

### Activities

1. **Explain the opening state** (3 min): Before pressing anything, students
   write one sentence explaining why the two pixel grids differ.
2. **Find the commit point** (4 min): Students step through and identify the
   exact stage at which the glass changes, then explain why it is that stage and
   not an earlier one.
3. **Batching** (3 min): Using the checkbox, students demonstrate that two draws
   can share one refresh, and explain why that matters for frame rate.

### Assessment

Ask: "You call `oled.fill(0)`, then `oled.text('A', 0, 0)`, then
`oled.text('B', 0, 20)`, and then nothing else. What is on the screen?"
The correct answer is whatever was there before — no `show()` was called.

## Related Resources

- [Chapter 3: Peripherals](../../chapters/03-peripherals/index.md)

## References

1. [SSD1306 Datasheet](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf) — the display controller's command set and internal display RAM.
2. [MicroPython framebuf module](https://docs.micropython.org/en/latest/library/framebuf.html) — the buffer API behind `oled.text()` and friends.
3. [Serial Peripheral Interface](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) — the clock, data, and chip-select bus carrying the buffer.
