---
title: Switch Bounce Debounce Visualizer
description: Apply a debounce delay to a noisy switch signal and see how too short a delay lets bounce through as extra press events.
image: /sims/switch-bounce-debounce-visualizer/switch-bounce-debounce-visualizer.png
og:image: /sims/switch-bounce-debounce-visualizer/switch-bounce-debounce-visualizer.png
twitter:image: /sims/switch-bounce-debounce-visualizer/switch-bounce-debounce-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Switch Bounce Debounce Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Switch Bounce Debounce Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/switch-bounce-debounce-visualizer/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A mechanical switch does not close once. Its contacts physically bounce apart and
back together several times over the first few milliseconds, and the GPIO pin
faithfully reports every one of those transitions. Your code, reading that pin,
sees three to six presses where the human pressed once.

The top chart is the **raw signal**: the pin state as it actually arrives, with
the bounce window shaded pink. The bottom chart is the **debounced signal** on
the same millisecond timescale, and each red marker is a logical press event your
program would receive.

Both charts share one x-axis, so you can line up a bounce on top with what the
debounce logic decided underneath.

## How to Use

1. Look at the raw chart. Count the transitions inside the pink window. That is
   how many times your code would fire without debouncing.
2. With the delay at the default 30 ms, confirm the counter reads
   **Logical presses detected: 1**. Note *when* the press is registered — it is
   deliberately later than the physical press.
3. Now drag **Debounce delay** down to 5 ms. Watch the counter climb above one.
   You have just reproduced the bug.
4. Walk the delay back up and find the smallest value that still yields exactly
   one press for this bounce pattern.
5. Press **Simulate one press** to get a new random bounce pattern and check
   whether your chosen delay still holds. It may not — which is why real
   designs leave margin.
6. Check **Show bounce count** to see the raw transition count next to the
   filtered result.

## The Trade-off

A longer delay is safer but adds latency: the press is not reported until the
signal has been stable for the full delay. Too long and the interface feels
sluggish; too short and one press becomes several. Typical mechanical switches
settle within 5-20 ms, which is why 20-50 ms is the usual choice.

## Controls

| Control | Range | Default | Purpose |
|---------|-------|---------|---------|
| Simulate one press | — | — | Generates a new random bounce pattern (3-6 bounces within 15 ms) |
| Debounce delay | 0-60 ms | 30 ms | How long the level must hold steady before it is accepted |
| Show bounce count | — | off | Displays raw transitions versus filtered events |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-15 minutes

### Prerequisites

- A GPIO pin reads a digital high or low
- Basic idea of reading a pin in a loop

### Learning Objective

Students will be able to **apply** a debounce delay to a noisy switch signal and
**demonstrate** that too short a delay still admits bounce, while an adequate
delay produces exactly one clean logical press event.

### Activities

1. **Observe the failure** (4 min): Students set the delay to 5 ms and record how
   many logical presses a single physical press produces.
2. **Find the threshold** (5 min): Students binary-search for the smallest delay
   that reliably yields one event across five different simulated patterns.
3. **Argue the trade-off** (4 min): Students justify a delay for a keyboard
   versus for an emergency stop button, considering latency.

### Assessment

Ask: "Your bounce lasts up to 12 ms and you choose a 10 ms debounce delay. Explain
what your user will occasionally experience, and what delay you would choose
instead."

## Related Resources

- [Chapter 3: Peripherals](../../chapters/03-peripherals/index.md)

## References

1. [Switch bounce](https://en.wikipedia.org/wiki/Switch#Contact_bounce) — the physical mechanism behind the noisy edge.
2. [A Guide to Debouncing (Jack Ganssle)](http://www.ganssle.com/debouncing.htm) — measured bounce durations across many real switches.
