---
title: I2S Protocol Timing Explorer
description: Step through an I2S transmission one bit at a time and see how BCLK, WS, and SD line up in time, and which bits belong to which channel.
image: /sims/i2s-protocol-timing-explorer/i2s-protocol-timing-explorer.png
og:image: /sims/i2s-protocol-timing-explorer/i2s-protocol-timing-explorer.png
twitter:image: /sims/i2s-protocol-timing-explorer/i2s-protocol-timing-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# I2S Protocol Timing Explorer

<iframe src="main.html" height="432px" width="100%" scrolling="no"></iframe>

[Run the I2S Protocol Timing Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/i2s-protocol-timing-explorer/main.html"
        height="432px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

I2S carries stereo audio on three wires, and the trick to reading it is that no
single wire tells you very much on its own. You have to read all three at once:

- **BCLK** (bit clock) ticks once per bit. It sets the pace.
- **WS** (word select) says which channel the current bits belong to: low for
  left, high for right. One full WS cycle is one stereo sample.
- **SD** (serial data) carries the actual bits, one per BCLK pulse.

This is a logic-analyzer view of all three on a shared time axis. The blue region
is the left channel's bits; the orange region is the right channel's. The red
playhead marks the bit you are currently inspecting.

The thing worth noticing is that **WS is not a marker between words — it is the
word's own label**, held for the entire duration of that channel's bits. A
student who expects a pulse at the boundary will misread every frame.

## How to Use

1. Start at bit 1 and press **Bit ▶** repeatedly. Watch the readout track the bit
   number and channel.
2. Press **Next word boundary**. WS flips, the shading changes, and the readout
   announces a new word starting on the right channel.
3. Step to the last bit of a word. The readout shows the fully assembled binary
   value and its unsigned decimal equivalent.
4. Switch **Word length** to 24-bit. Count how many BCLK pulses now fit in one WS
   half-cycle, and confirm it matches.
5. Press **Play** to watch it run, then pause on a transition to inspect it.

## Reading the Traces

| Question | Where to look |
|----------|---------------|
| How many bits per channel? | Count BCLK pulses in one WS half-cycle |
| Which channel is this bit? | WS level at that instant — low is left |
| What is the bit's value? | SD level during that BCLK pulse |
| Where does a sample end? | Where WS returns to its starting level |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- A digital signal is high or low over time
- Binary place value

### Learning Objective

Students will be able to **examine** the timing relationship between BCLK, WS,
and SD, and **distinguish** which bits belong to the left channel versus the
right.

### Activities

1. **Bit-by-bit trace** (5 min): Students step through an entire left word,
   recording each SD bit, and compare their assembled value to the readout.
2. **Find the boundary** (4 min): Students locate the exact BCLK pulse at which
   the channel changes and describe what WS does there.
3. **Word length** (4 min): Students switch to 24-bit and explain what changed
   about the WS period and what did not change about BCLK's role.

### Assessment

Ask: "You capture a trace and see WS high for 24 BCLK pulses, then low for 24.
How many stereo samples did you capture, and how many bits of audio in total?"
(One sample, 48 bits.)

## Related Resources

- [Chapter 5: Capturing Real Audio](../../chapters/05-capturing-real-audio/index.md)

## References

1. [I2S bus specification](https://www.sparkfun.com/datasheets/BreakoutBoards/I2SBUS.pdf) — the original Philips specification defining WS and BCLK timing.
2. [I2S](https://en.wikipedia.org/wiki/I%C2%B2S) — overview of the protocol and its common variants.
3. [INMP441 datasheet](https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf) — the 24-bit word format this microphone actually transmits.
