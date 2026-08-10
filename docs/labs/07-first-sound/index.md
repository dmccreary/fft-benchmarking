# Lab 7: Your First Sound Capture

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 6](../06-deploying-code/index.md)  |  **Hardware:** Pico 2, INMP441 microphone

!!! mascot-welcome "Ears! Finally!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is my favourite lab. Everything before now was setup — from here your Pico can
    *listen to the room*. Echolocation is my whole thing, so trust me: the moment a machine
    turns sound into numbers is the moment it can start understanding the world.
    **Time to transform!**

## What You'll Build

A program that captures real audio and shows you what sound looks like as raw numbers — plus
an ASCII waveform drawn from your own voice.

## Learning Objectives

- **Wire** an I²S digital microphone to the Pico 2
- **Explain** what the three I²S wires carry
- **Convert** raw byte buffers into signed integers
- **Recover** 24-bit audio from 32-bit words with a right shift
- **Separate** the DC offset from the actual sound
- **Recognise** why the first reads after power-up must be discarded

## Concepts Introduced

| ID | Concept |
|---|---|
| 257 | MEMS Microphone |
| 258 | INMP441 Microphone |
| 259 | Digital Microphone Output |
| 260 | I2S Protocol |
| 261 | Bit Clock |
| 262 | Word Select Line |
| 263 | I2S Serial Data |
| 264 | Audio Buffer |
| 265 | Buffered Read |
| 266 | Sample Word Format |
| 267 | Twenty Four Bit In Thirty Two |
| 268 | Arithmetic Right Shift |
| 269 | Unpacking Binary Data |

## Background

### A microphone that speaks digital

The INMP441 is a **MEMS** microphone — a microscopic diaphragm etched into silicon. What makes
it interesting for us is that it doesn't output a wobbly analog voltage. It contains its own
amplifier, filter and analog-to-digital converter, and emits **numbers** over a protocol called
I²S.

That's why we need no audio codec, no op-amps, no analog wiring care. Three digital wires and
you have audio. For $3.

### I²S in three wires

| Wire | Name | Job |
|---|---|---|
| SCK | Bit clock | ticks once per bit |
| WS | Word select | says which channel this sample belongs to |
| SD | Serial data | the audio bits themselves |

Same idea as SPI in Lab 4 — a clock plus data — with WS marking sample boundaries.

### The 24-in-32 puzzle

Here's the detail that confuses everyone. We ask for 32-bit samples, but the INMP441 only
produces **24 bits** of real audio. Those 24 bits arrive in the *top* of the 32-bit word, and
the bottom 8 bits are meaningless.

So every sample needs:

```python
value = raw_word >> 8
```

Shifting right by 8 slides the real audio down into place. Skip this and your numbers are 256×
too large and full of junk in the low bits.

!!! mascot-thinking "Sound is the wobble, not the value"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Your samples won't hover around zero. There's a **DC offset** — a constant bias, and on
    this mic it drifts for a while after power-up. Sound is the *variation*, so we compute
    the average and subtract it. Forget this and a loudness meter reads a big constant
    number in total silence, which is a genuinely baffling bug to chase.

## Wiring

| INMP441 | Pico 2 | Purpose |
|---|---|---|
| VDD | 3V3 (pin 36) | power |
| GND | GND (pin 38) | ground |
| SCK | **GPIO 10** | bit clock |
| WS | **GPIO 11** | word select |
| SD | **GPIO 12** | serial data |
| L/R | GND | selects the left channel |

!!! mascot-warning "Don't skip the L/R wire"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    L/R decides whether the mic talks during the left or right half of each frame. Leave it
    floating and the mic may stay silent or send data at the wrong moment — you'll get a
    stream of zeros and no error message. Tie it to **GND** for left channel, which is what
    `config.py` expects.

## Procedure

### Step 1 — Capture

Open `07-first-sound.py` and run it:

```python
--8<-- "docs/labs/07-first-sound/code/07-first-sound.py"
```

### Step 2 — Read the numbers

Look at the "What one sample looks like" section:

```
raw 32-bit word : -116784641  (0xf90a01ff)
after >> 8      : -456191
```

Notice the raw word ends in `ff` — those low bits are noise in the unused positions. After the
shift they're gone.

### Step 3 — Find the DC offset

```
DC offset  :    -440394   <- constant bias, NOT sound
peak swing :      24708   <- this IS the sound
as % of full scale: 0.295%
```

The offset is **eighteen times larger** than the actual sound. If you measured loudness without
removing it, every reading would be dominated by a number that has nothing to do with audio.

### Step 4 — Watch the waveform

The ASCII plot draws each sample as a `*` relative to the centre line. In a quiet room it hugs
the middle. Talk, clap, or whistle and run it again — the wave grows.

!!! mascot-tip "Try a steady tone"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Whistle a steady note while it captures. A pure tone draws a recognisable sine wave —
    smooth, regular, repeating. Speech is much messier. That difference between "one clean
    frequency" and "a jumble" is the entire reason the FFT exists.

## Expected Output

```
Settling the microphone...
Capturing 256 samples at 12800 Hz (20.0 ms of sound)

=== What one sample looks like ===
raw 32-bit word : -116784641  (0xf90a01ff)
after >> 8      : -456191
full scale      : +/-8388608  (2^23)

=== The capture ===
DC offset  :    -440394   <- constant bias, NOT sound
peak swing :      24708   <- this IS the sound
as % of full scale: 0.295%

=== The waveform ===
                     *        |
                       *      |
                              |    *
                              |          *
                              |               *
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Every sample is `0` | L/R not grounded, or SD miswired | Tie L/R to GND; check SD → GPIO 12 |
| Samples never change | Mic has no power | VDD → 3V3, GND → GND |
| Huge values, all garbage | Forgot `>> 8` | 24-bit audio lives in the top of a 32-bit word |
| DC offset enormous and drifting | Not enough settling reads | Discard several buffers before the real capture |
| `OSError: I2S not available` | Wrong pins for I2S0 | Use GPIO 10/11/12 as in `config.py` |
| Waveform all on one side | Normal — slow drift within the window | Plot the whole capture, not the first few samples |

## Challenges

1. **Loud vs quiet.** Capture while silent, then while clapping. Compare the peak swing values.
   How many times bigger is a clap?
2. **How long is a sample?** At 12,800 Hz, how many microseconds pass between samples? How many
   samples in one second?
3. **Whistle steady.** Try to produce a clean sine on the ASCII plot. Count how many samples
   there are between repeats — you've just measured a period by hand, which is the crude
   ancestor of everything in Module 3.

## Check Your Understanding

1. What do the three I²S wires (SCK, WS, SD) each carry?
2. Why do we shift samples right by 8 bits?
3. What is DC offset, and why must it be removed before measuring loudness?
4. Why does the program throw away the first few reads?
5. The INMP441 has its own ADC on board. Why does that make wiring so much simpler?

!!! mascot-celebration "Your Pico can hear!"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Those numbers scrolling past are the room, captured. Next lab we squeeze them into a
    single number — *how loud* — and put a live meter on the screen.

---

**Next:** [Lab 8: Sound Levels](../08-sound-levels/index.md)  |  **Previous:** [Lab 6](../06-deploying-code/index.md)
