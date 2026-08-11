---
title: FPU Capability Probe
description: Run the same MVFR0 bit-field check against three simulated chips and watch one function give three correct answers.
image: /sims/fpu-capability-probe/fpu-capability-probe.png
og:image: /sims/fpu-capability-probe/fpu-capability-probe.png
twitter:image: /sims/fpu-capability-probe/fpu-capability-probe.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# FPU Capability Probe

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the FPU Capability Probe MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/fpu-capability-probe/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Whether your float multiply takes one cycle or forty depends on a piece of
silicon that may or may not be there. You should not guess, and you should not
hard-code the answer — you should **ask the chip**.

ARM cores expose their floating-point capabilities in a read-only register called
**MVFR0**, the Media and VFP Feature Register. The probe is two lines:

```c
uint32_t v = read_MVFR0();
return (v & 0xF) != 0;
```

Select each chip and press the button. The same function runs three times and
returns three different, correct answers — because it is reading hardware, not
consulting a table.

| Chip | MVFR0 | Low nibble | Verdict |
|------|-------|-----------|---------|
| Cortex-M0+ | `0x00000000` | `0x0` | No FPU |
| Cortex-M4 | `0x10110021` | `0x1` | FPU detected |
| Cortex-M33 | `0x10110021` | `0x1` | FPU detected |

## Why Ask Instead of Assume

Three reasons this matters more than it looks:

**Your code outlives your board.** A `#define HAS_FPU 1` is correct until someone
builds your firmware for a different target, at which point it is silently and
catastrophically wrong.

**The RP2350 is genuinely ambiguous.** It contains *both* a Cortex-M33 and a
Hazard3 RISC-V core, selectable at boot. Which one is running determines what the
probe returns, and a compile-time constant cannot know.

**Wrong answers are expensive, not fatal.** Software float emulation works — it
just runs 10-50× slower. You will not get a crash telling you something is wrong;
you will get an FFT that misses its deadline for no visible reason.

## Reading the Mask

`0xF` isolates the low four bits, `[3:0]`, which is the A_SIMD field. Zero means
no floating-point register file exists. Anything nonzero means one does.

Note the test is `!= 0`, not `== 1`. Different cores report different nonzero
encodings in this field, and the probe only needs to know whether hardware
floating point exists at all.

## How to Use

1. Start on the **Cortex-M33** card — that is what is in your Pico 2. Press the
   probe button and watch the low nibble light up.
2. Click **Cortex-M0+** and probe. The whole register is zero, so the mask yields
   zero, so the verdict is No FPU.
3. Click **Cortex-M4** and probe. Same result as the M33 — the FPU is present in
   both, even though the ISA generations differ.
4. Note that you never changed the function. Only the hardware changed.
5. Press **Reset all** and consider: what would `#define HAS_FPU 1` have reported
   for the M0+?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- Bitwise AND and hexadecimal
- Memory-mapped read-only registers

### Learning Objective

Students will be able to **apply** the MVFR0 bit-field check to determine FPU
presence for several chips, and **demonstrate** that the same code correctly
reports different verdicts on different hardware.

### Activities

1. **Probe all three** (3 min): Students probe each chip and record the masked
   value and verdict.
2. **Hand-compute** (3 min): Students evaluate `0x10110021 & 0xF` on paper.
3. **Argue against the constant** (4 min): Students explain what breaks if the
   probe is replaced with a compile-time `#define`, using the RP2350's dual-core
   design as the example.

### Assessment

Ask: "Your FFT runs correctly but 30× slower than expected on a new board. What
single register would you read first, and what would each possible answer tell
you?"

## Related Resources

- [Chapter 20: Does Your CPU Have an FPU?](../../chapters/20-does-your-cpu-have-an-fpu/index.md)
- [DWT Register Explorer](../dwt-register-explorer/index.md)

## References

1. [MVFR0, Media and VFP Feature Register 0](https://developer.arm.com/documentation/ddi0403/latest/) — the register field definitions.
2. [RP2350 Datasheet](https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf) — the dual Cortex-M33 / Hazard3 architecture.
3. [Floating-point unit](https://en.wikipedia.org/wiki/Floating-point_unit) — hardware versus software floating point.
