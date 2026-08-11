---
title: MEMS Microphone Cross Section
description: A clickable cut-away of the INMP441 package explaining, one part at a time, how sound becomes an I2S bitstream with no separate ADC.
image: /sims/mems-microphone-cross-section/mems-microphone-cross-section.png
og:image: /sims/mems-microphone-cross-section/mems-microphone-cross-section.png
twitter:image: /sims/mems-microphone-cross-section/mems-microphone-cross-section.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# MEMS Microphone Cross Section

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the MEMS Microphone Cross Section MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/mems-microphone-cross-section/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The INMP441 you wire to the Pico is about the size of a grain of rice, and it
does something that used to take three separate components: it senses sound,
converts it to a number, and speaks a digital protocol — all inside one package.

This cut-away shows the five things inside and the four wires coming out. Click
any part to read what it contributes.

The chain is short:

1. Air pressure enters through the **sound port**.
2. The **diaphragm** flexes. It is the only part that physically moves.
3. Its distance from the fixed **back plate** changes, so the capacitance between
   them changes.
4. The **ASIC** measures that capacitance and digitizes it.
5. The result leaves on **SD**, timed by **SCK** and **WS**.

The part worth pausing on is the ASIC. On an older analog microphone you would
wire the output to a separate ADC chip and configure that yourself. Here the
conversion already happened inside the package, which is why the Pico reads bits
rather than a voltage.

## How to Use

1. Click each part in order, following the arrows from sound to pins.
2. For each part, state in one sentence what it does before reading the panel,
   then compare.
3. Pay attention to the **back plate** perforations. Ask yourself why a plate
   that is supposed to be a capacitor electrode has holes in it.
4. Click all four pins. Only one of them carries audio — identify which, and work
   out what the other three are for.

## The Four Pins

| Pin | Name | Carries |
|-----|------|---------|
| SD | Serial Data | The audio bits, one per bit-clock pulse |
| WS | Word Select | Which channel these bits belong to |
| SCK | Bit Clock | The tick that paces every bit |
| L/R | Channel Select | Which half of the WS cycle this mic speaks in |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- Sound is a pressure wave in air
- A capacitor's value depends on the distance between its plates

### Learning Objective

Students will be able to **identify** the internal parts of a MEMS microphone
package and **explain**, in one sentence per part, what each does to turn sound
into a digital bitstream.

### Activities

1. **Trace the chain** (4 min): Students click through the parts in signal order
   and write the five-step chain in their own words.
2. **Why no ADC?** (3 min): Students explain what the ASIC replaces and why this
   is called a digital microphone.
3. **Pin sort** (3 min): Given the four pin names, students classify each as
   data, timing, or configuration.

### Assessment

Ask: "Your code reads bits from the SD pin. At what point in the chain did the
sound stop being an analog quantity, and what component performed that
conversion?"

## Related Resources

- [Chapter 5: Capturing Real Audio](../../chapters/05-capturing-real-audio/index.md)

## References

1. [INMP441 datasheet](https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf) — the specific microphone used in this course.
2. [Microelectromechanical systems](https://en.wikipedia.org/wiki/Microelectromechanical_systems) — the fabrication technology behind the moving diaphragm.
3. [Condenser microphone](https://en.wikipedia.org/wiki/Microphone#Condenser) — the capacitive sensing principle in its original, larger form.
