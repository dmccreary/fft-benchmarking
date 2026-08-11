---
title: DWT Register Explorer
description: Flip the two enable bits that gate the ARM cycle counter, and watch CYCCNT come alive one bit at a time.
image: /sims/dwt-register-explorer/dwt-register-explorer.png
og:image: /sims/dwt-register-explorer/dwt-register-explorer.png
twitter:image: /sims/dwt-register-explorer/dwt-register-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# DWT Register Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the DWT Register Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/dwt-register-explorer/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The Cortex-M33 has a free, exact, zero-overhead cycle counter sitting in the Data
Watchpoint and Trace unit. It is off at reset, and it stays off until you set
**two separate bits in two separate registers**.

```c
CoreDebug->DEMCR  |= (1 << 24);   // TRCENA — power the trace subsystem
DWT->CTRL         |= (1 << 0);    // CYCCNTENA — start the cycle counter
```

Miss either one and `DWT->CYCCNT` reads zero forever. No error, no warning — just
a benchmark that reports every operation taking exactly 0 cycles.

Click the bits in this sim and watch what each one does.

## A Register Is Just Bits

Each row is one 32-bit register drawn as 32 individually addressable squares,
most significant bit on the left. Most of them are grayed out because they are
reserved or do things this course does not use — hover any of them to confirm.

Only two are live:

- **DEMCR bit 24 (TRCENA)** — powers the trace subsystem. Without it, the DWT
  unit is not even clocked.
- **DWT.CTRL bit 0 (CYCCNTENA)** — starts the counter itself.

`1 << 24` in the code above is not arbitrary syntax. It is literally "put a 1 in
the square 24 positions from the right", which is what the sim draws.

## The Order Matters

Try clicking **CYCCNTENA first**, before TRCENA. The status panel turns red.
On real hardware the write may not even stick, because you are writing to a
peripheral that is not powered.

Then set TRCENA and watch the counter start.

## The Counter Holds Its Value

With both bits set and the counter running, click **CYCCNTENA off** again.

CYCCNT does not reset. It freezes at whatever it had reached. That is deliberate
and useful: you can gate the counter around exactly the region you want to
measure, then read the accumulated total.

## How to Use

1. Start at power-on. Every bit is 0 and CYCCNT is frozen.
2. Click **TRCENA**. Read the status — powered, but still not counting.
3. Click **CYCCNTENA**. The counter starts, and the low bits begin flickering.
4. Watch the binary readout roll: bit 0 toggles every count, bit 1 every two,
   bit 2 every four. Binary counting made visible.
5. Click **CYCCNTENA** off. Confirm the value holds rather than resetting.
6. Press **Reset to power-on state** and try the wrong order.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- Binary representation
- Memory-mapped registers

### Learning Objective

Students will be able to **explain** how the DEMCR and DWT.CTRL enable bits gate
access to CYCCNT, and **interpret** a 32-bit register as individually
addressable bits.

### Activities

1. **Enable in order** (3 min): Students set both bits and describe what each
   one changed.
2. **Read the binary** (4 min): Students pause the counter and convert its binary
   display to decimal by hand, checking against the printed value.
3. **Gate a region** (3 min): Students explain how to use CYCCNTENA to measure
   only part of a program.

### Assessment

Ask: "Your benchmark reports 0 cycles for every operation. Name the two most
likely causes and the register bit each corresponds to."

## Related Resources

- [Chapter 17: Measuring Time](../../chapters/17-measuring-time/index.md)
- [Counter Wraparound Visualizer](../counter-wraparound-visualizer/index.md)
- [Pico 2 Memory Map Explorer](../pico2-memory-map-explorer/index.md)

## References

1. [Data Watchpoint and Trace unit](https://developer.arm.com/documentation/ddi0439/b/Data-Watchpoint-and-Trace-Unit) — DWT.CTRL and CYCCNT definitions.
2. [ARMv8-M Debug Extension](https://developer.arm.com/documentation/ddi0553/latest/) — DEMCR and the TRCENA bit.
