---
title: 'Capturing Real Audio: The I2S Microphone'
description: Turn real sound into a MicroPython buffer of numbers over the I2S protocol, using a MEMS microphone.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 20:05:00
version: 0.09
---

# Capturing Real Audio: The I2S Microphone

## Summary

This chapter explains how a MEMS microphone turns sound into a digital bitstream over the I2S protocol, and how MicroPython reads that stream into a usable audio buffer. It introduces the distinction between analog and digital signals and previews the productive-failure pedagogy used later in the course, where a wrong result becomes the lesson. By the end, students can capture and buffer real audio from a physical sensor.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

1. Analog Signals
2. Audio Buffer
3. Bit Clock
4. Buffered Read
5. Digital Microphone Output
6. Digital Signals
7. I2S Protocol
8. I2S Serial Data
9. INMP441 Microphone
10. MEMS Microphone
11. Productive Failure
12. Thonny Plotter
13. Word Select Line

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)
- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)

---

!!! mascot-welcome "Time to catch a real sound"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Everything in the last chapter was pure math — sine waves living only in equations and sliders. That changes right now. This chapter wires up a real microphone and pulls a real sound into your Pico 2 as an array of numbers you can inspect. Let's tune in.

The previous chapter gave you the vocabulary to describe any wave: amplitude, frequency, phase, harmonics. This chapter connects that vocabulary to something you can actually point a microphone at. Before any of the sampling, correlation, or transform math in later chapters can run, a sound wave in the air has to become a sequence of numbers your program can read. That conversion — air pressure to array — is what this chapter builds.

## From Air Pressure to Electrical Signal

Sound in the physical world is a continuous phenomenon: air pressure rises and falls smoothly, with no gaps or steps, as a wave travels through it. A signal that behaves this way — varying smoothly and continuously over time, capable of taking on *any* value within its range — is called an **analog signal**. The voltage coming directly off a microphone's sensing element, before any conversion happens, is analog: at any instant it could be 1.001 volts, or 1.0011 volts, or any value in between, with no smallest possible step.

Computers cannot store or process a value that varies continuously — memory can only hold discrete numbers. A **digital signal**, by contrast, represents information using discrete, distinct values, typically encoded as sequences of 1s and 0s. Every value a digital system stores has been rounded to one of a fixed set of possible numbers, no matter how sound in the room actually continues to vary smoothly in between them. Turning the microphone's continuous analog signal into a sequence of discrete digital numbers is the single job of everything this chapter covers.

!!! mascot-thinking "This isn't optional rounding — it's the entire bridge"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Analog-to-digital conversion isn't a minor implementation detail — it's the bridge between the physical world and every line of code you'll write for the rest of this course. Every number your FFT ever processes started as one of these discrete snapshots of a continuous sound wave.

## How a MEMS Microphone Hears

The microphone in your kit is not the kind found in a decades-old telephone handset. It is a **MEMS microphone**: a microelectromechanical systems microphone that combines a tiny mechanical diaphragm and an analog-to-digital converter on a single chip, small enough to sit on a fingertip and cheap enough to appear in nearly every smartphone made in the last fifteen years. Sound pressure vibrates the microscopic diaphragm; the chip converts that vibration directly into an electrical, and eventually digital, representation — all inside one package roughly four millimeters square.

The specific part in your kit has a name worth knowing, since its datasheet is the reference for everything in this section: the **INMP441 microphone** is the MEMS microphone module used throughout this course, a chip that captures sound and outputs it as a digital bitstream directly, with no separate analog-to-digital converter chip required on your breadboard. That last detail matters — cheaper microphones output a raw analog voltage that a *different* chip must digitize; the INMP441 does the digitizing itself, right on the sensor.

Because the INMP441 digitizes internally, what comes off its output pin is already a **digital microphone output**: an audio signal represented as a stream of binary values rather than a continuously varying voltage, ready for a microcontroller to read directly without any extra conversion hardware. Before looking at how that stream is organized, it helps to see where each labeled part of the chip sits and what job it does.

#### Diagram: MEMS Microphone Cross-Section

<iframe src="../../sims/mems-microphone-cross-section/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>MEMS Microphone Cross-Section</summary>
Type: infographic
**sim-id:** mems-microphone-cross-section<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, describe

Learning objective: Let students identify the internal parts of a MEMS microphone package and explain, in one sentence per part, what each part does to turn sound into a digital bitstream.

Canvas layout:
- Left (500px): a labeled cross-section illustration of the INMP441 package
- Right (200px): infobox panel, empty until a part is clicked

Visual elements:
- Sound port: a small opening at the top of the package where air pressure waves enter
- Diaphragm: a thin, flexible membrane suspended below the sound port that physically vibrates
- Back plate: a fixed perforated plate near the diaphragm forming a capacitor with it
- ASIC (application-specific integrated circuit): the small silicon chip that reads the capacitance change and performs analog-to-digital conversion
- Output pins: labeled SD (serial data), WS (word select), SCK (bit clock), and L/R (channel select)
- Arrows showing signal flow: sound pressure to diaphragm, diaphragm motion to ASIC, ASIC output to pins

Interactive elements:
- Clicking any labeled part (sound port, diaphragm, back plate, ASIC, each output pin) highlights it and displays its name and a one-sentence explanation in the right-hand infobox
- Hovering briefly outlines the part before clicking

Data displayed on click (examples):
- Diaphragm: "Vibrates in response to sound pressure, changing its distance from the back plate."
- ASIC: "Measures the changing capacitance, then digitizes and encodes it as an I2S bitstream — this is why no separate ADC chip is needed."
- SD pin: "Carries the actual digitized audio bits, one bit per bit-clock pulse."

Instructional Rationale: An Understand-level clickable infographic is appropriate because the objective is explaining what each internal part does, not manipulating a live physical process — progressive disclosure through click-to-reveal keeps the diagram uncluttered while still letting students connect each label to its function at their own pace.

Implementation notes:
- Use p5.js; draw the cross-section as simple shapes (rectangles, a thin arc for the diaphragm) rather than a photorealistic image
- Responsive width; cross-section and infobox both scale to container width on window resize, stacking vertically below 600px width
</details>

## The I2S Protocol: Three Wires, One Bitstream

The INMP441 does not send its digital audio over a single wire the way a simple sensor might. It uses a small, well-defined protocol built specifically for streaming digital audio between chips. The **I2S protocol** (Inter-IC Sound) is a serial communication standard designed specifically for transmitting digital audio data between chips, using a small, fixed set of signal lines that stay synchronized to each other. I2S was designed decades ago for exactly this job — moving audio bits reliably between a sensor or codec and a processor — and it has barely changed since, because the problem it solves has not changed either.

I2S divides its job across three signal lines, each with one clear responsibility. Before naming them individually, it helps to know what problem all three are jointly solving: audio bits have to arrive in the right order, at the right rate, and grouped correctly into left-channel and right-channel samples, all without any of that information being stated explicitly in the data itself. Timing carries the meaning.

The first wire supplies the heartbeat every other signal depends on. The **bit clock** (often abbreviated BCLK or SCK) is the I2S signal line that toggles once for every single data bit transmitted, providing the timing reference the receiving chip uses to know exactly when to read each bit. Without the bit clock, the receiving microcontroller would have no way to know where one bit ends and the next begins.

The second wire tells the receiver which audio channel it is currently receiving. The **word select line** (often abbreviated WS or LRCLK) is the I2S signal line that indicates which audio channel — left or right — the current data word belongs to, typically by staying low during the left channel's bits and high during the right channel's bits. Because the microphone in this kit outputs mono audio on a single channel, the word select line's value tells your code which half of the frame to keep and which to discard.

The third wire carries the payload itself. **I2S serial data** is the actual stream of digitized audio sample bits, transmitted one bit per bit-clock pulse, with each block of bits grouped into a channel's sample according to the word select line's current state. This is the signal that ultimately becomes the numbers your program works with — the other two wires exist purely to make this one interpretable.

Before examining how these three signals interact over time, the table below summarizes the role each one plays, now that all three have been introduced in prose.

| Signal | Common name | What it carries | Toggles |
|---|---|---|---|
| Bit clock | BCLK / SCK | Timing pulse, one per data bit | Once per bit |
| Word select | WS / LRCLK | Which channel (left/right) is active | Once per channel switch |
| Serial data | SD / DOUT | The actual audio sample bits | Carries the payload |

!!! mascot-tip "Three wires, one job each — that's the whole trick"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    If you remember nothing else about I2S, remember this: the bit clock says *when*, the word select line says *which channel*, and the serial data line says *what value*. Every I2S peripheral you'll ever wire up, on this board or any other, follows that same three-wire split.

Seeing the three lines side by side, changing together over time, makes the relationship far more concrete than the table alone.

#### Diagram: I2S Protocol Timing Explorer

<iframe src="../../sims/i2s-protocol-timing-explorer/main.html" width="100%" height="432px" scrolling="no"></iframe>

<details markdown="1">
<summary>I2S Protocol Timing Explorer</summary>
Type: microsim
**sim-id:** i2s-protocol-timing-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, distinguish

Learning objective: Let students step through an I2S transmission bit by bit and analyze how the bit clock, word select line, and serial data line relate to each other in time, distinguishing which bits belong to the left channel versus the right channel.

Canvas layout:
- Top (350px): three stacked digital timing traces (like a logic analyzer view), labeled BCLK, WS, SD, sharing a common horizontal time axis
- Bottom (150px): step controls and a readout panel

Visual elements:
- BCLK trace: a regular square wave, one pulse per bit
- WS trace: a slower square wave, low for the left channel's 16 or 24 bits, high for the right channel's bits
- SD trace: a square wave showing an example bit pattern for one sample word, changing only at BCLK edges
- A vertical "playhead" line marking the currently selected bit, movable by the step controls
- Background shading: light blue behind the left-channel region of all three traces, light orange behind the right-channel region

Interactive controls:
- Button: "Step forward one bit" — advances the playhead to the next BCLK pulse
- Button: "Step back one bit"
- Button: "Jump to next word boundary" — advances directly to the next WS transition
- Slider: "Word length" (16-bit or 24-bit), changes how many BCLK pulses occur per WS half-cycle
- Play/Pause button for automatic continuous stepping at an adjustable speed

Data Visibility Requirements:
  Stage 1 (initial state): Show all three idle traces with the playhead at time zero, WS low (left channel)
  Stage 2 (each step): Show the playhead advancing one BCLK pulse, with the readout panel displaying "Bit N of [16 or 24], Channel: LEFT" or RIGHT
  Stage 3 (word boundary): Show WS flipping and the readout announcing "New word starting — Channel: RIGHT"
  Final: Show a completed word with the readout displaying the full assembled binary value and its channel

Instructional Rationale: An Analyze-level step-through pattern is appropriate because the objective requires students to trace the precise timing relationship between three simultaneous signals and distinguish channel boundaries — a continuously animated waveform would move too fast to inspect individual bit-to-channel correspondence, while manual stepping lets students pause exactly at the transitions that matter.

Implementation notes:
- Use p5.js; represent each trace as a simple high/low square-wave line redrawn from an internal bit-pattern array
- Responsive width; all three traces and the control panel scale to container width on window resize
</details>

## Reading the Stream into MicroPython

Wiring the three I2S signals to the Pico 2's GPIO pins gets the raw bitstream physically present at the microcontroller. Turning that stream into numbers your program can use is the job of MicroPython's `I2S` class, part of the `machine` module you first met in the peripherals chapter. Rather than handing you one sample at a time, the class fills a block of memory with many samples at once, because reading samples one by one would be far too slow to keep up with continuous audio.

That block of memory has a name: an **audio buffer** is a region of memory used to temporarily hold a sequence of audio samples, allowing many samples to be read, processed, or transmitted together as a group rather than one at a time. Filling that buffer is called a **buffered read**: reading multiple samples from an I2S peripheral into a pre-allocated buffer in a single operation, rather than issuing a separate read call for every individual sample. Buffered reads are dramatically more efficient, because the underlying hardware and MicroPython driver do the repetitive work of pulling bits off the wire, leaving your code free to process a whole chunk of audio at once.

Before looking at the code itself, it helps to know what each piece does: `readinto()` is the MicroPython method that performs a buffered read, filling a `bytearray` you provide with raw sample bytes; `sample_rate` sets how many samples per second the microphone captures; and `bits` sets how many bits make up each sample.

```python
from machine import I2S, Pin

audio_in = I2S(
    0,                      # I2S peripheral ID
    sck=Pin(16),            # Bit clock pin
    ws=Pin(17),             # Word select pin
    sd=Pin(18),             # Serial data pin
    mode=I2S.RX,            # Receive mode (microphone input)
    bits=32,                # Bits per sample (INMP441 outputs 24 bits inside a 32-bit word)
    format=I2S.MONO,        # Single-channel audio
    rate=16000,             # Sample rate in Hz
    ibuf=4000,              # Internal buffer size in bytes
)

audio_buffer = bytearray(2000)     # Pre-allocated audio buffer
num_bytes_read = audio_in.readinto(audio_buffer)   # Buffered read
```

Each call to `readinto()` performs one buffered read, filling `audio_buffer` with raw bytes straight off the I2S serial data line and returning the number of bytes actually captured. Later chapters unpack those raw bytes into signed integer sample values and remove an unwanted DC offset — but capturing the bytes at all, reliably and efficiently, is what this chapter's code accomplishes.

## Seeing What You Captured

Numbers scrolling past in a text console are hard to reason about. Thonny, the IDE introduced in Chapter 1, includes a built-in tool built exactly for this problem. The **Thonny Plotter** is a feature of the Thonny IDE that graphs numeric values printed by a running MicroPython program in real time, turning a stream of `print()` output into a live scrolling line chart with no extra code required. Printing each captured sample value in your buffered-read loop is enough to see your own voice, a clap, or a whistle appear as a moving waveform on screen — the exact time domain plot shape introduced in the previous chapter, but now built from a real sound instead of an equation.

!!! mascot-encourage "Watching your own voice appear as a wiggly line never gets old"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    The wiring and the protocol details in this chapter are genuinely fiddly — three pins, exact voltage levels, exact pin assignments. But the payoff is immediate: the first time you see the Thonny Plotter trace jump when you clap near the microphone, all of that setup suddenly feels worth it.

## Productive Failure: Some Labs Are Built to Go Wrong First

Not every lab in this course is designed to work the first time. Two labs coming up in the next module are deliberately engineered so that the "obvious" approach produces a confidently wrong answer — on purpose. **Productive failure** is a teaching approach in which a student first attempts a task in a way that predictably fails, then learns the underlying concept by directly examining why that failure happened, producing deeper and more durable understanding than being told the correct approach up front.

Concretely: an upcoming lab has you play a tone *above* a frequency limit this course has not defined yet, and watch your instrument confidently report a completely wrong frequency. Another has you deliberately overload the microphone's input and watch new frequencies appear in the output that were never present in the original sound. Both results look like bugs. Neither one is — they are the direct, correct consequence of a hardware limit you have not yet named. The next chapter names it.

| Lab behavior | What it looks like | What it actually demonstrates |
|---|---|---|
| Instrument reports a wrong frequency | A confident, precise, *incorrect* number | A hardware limit on how fast a signal can safely vary |
| New frequencies appear from nowhere | Tones that were never played | A hardware limit on how large a signal can safely get |

!!! mascot-warning "When a lab looks broken, read the number carefully first"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning"> 
    If an upcoming lab gives you a result that looks obviously wrong, resist the urge to assume you wired something incorrectly. Check first whether the wrong-looking result is actually the lesson. The next chapter gives you the exact vocabulary — Nyquist frequency, clipping — to recognize these failures on sight instead of debugging code that was never broken.

## Chapter Summary

You can now take a real, physical sound and turn it into numbers your Pico 2 can store and inspect — the first link in the chain that eventually leads to a working FFT.

Key ideas to carry forward:

- **Analog signals** vary continuously; **digital signals** are represented as discrete values a computer can store — every microphone bridges this gap.
- A **MEMS microphone**, specifically the **INMP441 microphone** in your kit, digitizes sound on-chip and produces a **digital microphone output** with no separate ADC required.
- The **I2S protocol** carries that output over three synchronized wires: the **bit clock** (timing), the **word select line** (channel), and **I2S serial data** (the actual sample bits).
- MicroPython captures I2S audio with a **buffered read**, filling an **audio buffer** in one efficient operation instead of one sample at a time.
- The **Thonny Plotter** turns printed sample values into a live waveform, so you can see your own captured sound.
- **Productive failure** is used deliberately in upcoming labs — a wrong-looking result is sometimes the entire lesson, not a bug to chase.

??? note "Quick check: why does I2S need a separate word select line at all, instead of just alternating left and right samples automatically? — Click to expand"
    Because the receiving chip has no other way to know which channel a given block of bits belongs to — the serial data line carries only raw bits, with no built-in labels. The word select line is what makes those bits interpretable as "this is the left channel" or "this is the right channel," entirely through timing rather than any data encoded in the bitstream itself.

!!! mascot-celebration "Your first real captured sound"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    You just turned real, physical sound into a buffer of numbers on a five-dollar chip — no lab bench, no dedicated DSP hardware. Next up: the theory that explains exactly how fast and how loud a signal can be before this capture process starts lying to you. Not bad for a $5 chip!
