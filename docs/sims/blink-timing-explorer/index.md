---
title: Blink Timing Explorer
description: Manipulate the sleep-delay parameter and watch the LED pin's logic-high/logic-low timeline change, connecting the sleep() argument to a predictable blink rate.
image: /sims/blink-timing-explorer/blink-timing-explorer.png
og:image: /sims/blink-timing-explorer/blink-timing-explorer.png
twitter:image: /sims/blink-timing-explorer/blink-timing-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Blink Timing Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Blink Timing Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/blink-timing-explorer/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

This MicroSim simulates the three-line blink loop that every Raspberry Pi Pico 2
project starts with:

```python
while True:
    led.toggle()
    sleep(delay)
```

The top strip chart plots the LED pin as a voltage-versus-time square wave with
only two levels — logic high at 3.3 V and logic low at 0 V. The onboard-LED icon
lights gold whenever the simulated pin is high. As you drag the **Sleep delay**
slider, the wave visibly alternates faster or slower and the **Blinks per second**
readout changes with it.

The key relationship on display is that one complete blink takes *two* toggles,
so:

```
blinks per second = 1 / (2 x delay)
```

A delay of 0.5 s therefore produces 1.0 blink per second, not 2.

## How to Use

1. Before touching anything, predict: at the default 0.5 s delay, how many times
   per second will the LED complete a full on-and-off cycle?
2. Press **Run** and count the transitions on the strip chart to check your
   prediction against the readout.
3. Drag **Sleep delay** to 0.05 s and then to 2.0 s. Notice that the square wave
   packs together or stretches out, but the two voltage levels never change.
4. Press **Pause**, then use **Toggle Once** to step through a single logic-low
   to logic-high transition in isolation.
5. Check **Show code** to see the exact loop being simulated with your current
   slider value substituted into `sleep()`.

## Controls

| Control | Purpose |
|---------|---------|
| Run / Pause | Starts and stops the automatic toggle-and-delay loop |
| Toggle Once | Pauses, then performs exactly one state flip so a single edge can be studied |
| Show code | Reveals the simulated loop with the live delay value |
| Sleep delay | Sets the `sleep()` argument from 0.05 s to 2.0 s |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior) or advanced high school

### Duration

10 minutes

### Prerequisites

- Familiarity with a `while` loop
- The idea that a digital output pin has only two voltage states

### Learning Objective

Students will be able to **calculate** the blink frequency produced by a given
`sleep()` argument and **demonstrate** the relationship by predicting the wave
shape before changing the slider.

### Activities

1. **Predict** (3 min): Given `sleep(0.25)`, students write down the expected
   blinks per second before running the sim.
2. **Test** (4 min): Students set the slider to 0.25 s, run, and compare the
   readout to their prediction. Repeat for 1.0 s and 0.05 s.
3. **Step through** (3 min): Using **Toggle Once**, students trace one full
   cycle and articulate why two toggles are needed per blink.

### Assessment

Ask students to name the delay that produces exactly 5 blinks per second
(answer: 0.1 s) and to justify the factor of two.

## Related Resources

- [Chapter 1: Hello World](../../chapters/01-hello-world/index.md)

## References

1. [Raspberry Pi Pico Python SDK](https://datasheets.raspberrypi.com/pico/raspberry-pi-pico-python-sdk.pdf) — official MicroPython documentation for the Pico family.
2. [MicroPython machine.Pin documentation](https://docs.micropython.org/en/latest/library/machine.Pin.html) — the `toggle()` and pin-state API being simulated here.
