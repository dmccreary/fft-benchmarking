# Lab 21: Spectrum of a Real Sound

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 20](../20-complete-python-fft/index.md)  |  **Hardware:** Pico 2, INMP441, OLED

!!! mascot-welcome "This is the one you've been building toward"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Fourteen labs of groundwork, and now it all points outward. Microphone in, FFT, bars on
    the screen. Then **whistle at it** and slide your pitch around — the peak follows you.
    That's a sound becoming a number you can see. Now *that's* a superpower.

## What You'll Build

A live spectrum analyzer: real audio in, a 32-bar display out, with a peak-frequency readout
that tracks your whistle.

## Learning Objectives

- **Connect** the microphone, FFT and display into one pipeline
- **Import** your FFT as a library rather than pasting it
- **Convert** a complex spectrum to magnitudes, cheaply
- **Group** bins into display bars and scale them sensibly
- **Explain** why a quiet room's spectrum slopes downward
- **Reject** low-frequency rumble when hunting for a peak

## Concepts Introduced

| ID | Concept |
|---|---|
| 400 | Magnitude Computation |
| 401 | Fast Magnitude Approximation |
| 402 | Power Versus Magnitude |
| 403 | Bin Averaging For Display |
| 404 | Logarithmic Scaling |
| 405 | Square Root Scaling |
| 406 | Spectrum Bars |
| 407 | Frame Capture |
| 408 | Live Spectrum Display |
| 409 | Whistle Test |
| 410 | Half Spectrum Display |

## Background

### Your FFT is now a library

The FFT you built in Lab 20 lives in `/lib/fftlab.py`. Same algorithm, nothing added:

```python
from fftlab import FFT
fft = FFT(256)
re, im = fft.buffers()
fft.run(re, im)
mags = fft.fast_magnitudes(re, im)
```

You're using a library whose entire contents you wrote and validated — a far better position
than trusting a black box.

### Magnitude, without the square root

True magnitude needs `sqrt(re² + im²)`, and square roots aren't cheap. When the answer becomes a
bar 40 pixels tall, this approximation is plenty:

```
|z| ≈ max(|re|,|im|) + 0.4 · min(|re|,|im|)
```

Within about 4%, noticeably faster. Knowing *when* precision doesn't matter is an engineering
skill.

### Why N = 256 here

At N = 512 the pure-Python FFT takes 145 ms — about 7 frames per second, which feels sluggish.
N = 256 takes ~71 ms and feels alive.

The cost: bins are 50 Hz wide instead of 25. **Resolution traded for speed** — a tradeoff you'll
meet formally in Lab 24 and finally beat in Module 7.

!!! mascot-thinking "Rooms rumble"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Point this at a silent room and the spectrum slopes steeply downward — bin 2 towering
    over everything. That's **1/f noise**: traffic, ventilation, the building itself. It's
    real sound, not a bug. But it means the loudest bin is *always* low-frequency rumble,
    which would drown out any whistle. So we start hunting above 300 Hz.

## Procedure

### Step 1 — Run it and whistle

Open `21-real-spectrum.py` and run it:

```python
--8<-- "docs/labs/21-real-spectrum/code/21-real-spectrum.py"
```

```
peak: bin   6 =   300 Hz
peak: bin  31 =  1550 Hz
peak: bin  34 =  1700 Hz
```

**Now whistle.** Start low and slide upward. The bar moves right and the number climbs. Slide
back down and it follows.

That's the FFT working on the real world, in real time, on a $5 chip.

### Step 2 — Try different sounds

| Sound | What to look for |
|---|---|
| Whistle | one sharp peak that tracks your pitch |
| Humming | a peak *plus* harmonics — evenly spaced taller bars |
| "Sssss" | broad energy spread across high bins, no peak |
| Clapping | everything lights up briefly (Lab 15's impulse!) |
| Silence | rumble at the left, "listening" on screen |

Humming is the interesting one. Your voice isn't a pure tone — it's a fundamental plus
overtones, exactly the additive recipe from Lab 12, now visible.

### Step 3 — Understand the peak-finder

```python
if best_v < PEAK_RATIO * average:
    return None, 0.0        # just noise -- no honest answer to give
```

Two safeguards. `MIN_BIN` skips the rumble. `PEAK_RATIO` demands the peak stand three times above
average before we believe it — otherwise the display says "listening" rather than inventing a
frequency.

!!! mascot-tip "Reporting nothing beats reporting nonsense"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    A meter that always shows *a* number looks confident and is often lying. One that admits
    "no clear tone" is more useful — and it's the same instinct as Lab 9's aliasing lesson.
    Know when your instrument has nothing to say.

### Step 4 — Square-root scaling

```python
norm = math.sqrt(h / biggest)
```

Raw magnitudes are dominated by the loudest bin and everything else vanishes. Square root
compresses the range so quiet detail stays visible, without the expense of a log. Try removing
it — the display goes almost blank between peaks.

### Step 5 — Predict, then measure

> **Prediction:** whistle a steady note. How many *different* bins does the reading jump
> between? Why doesn't it hold perfectly still?

You've just discovered frequency resolution, which is Lab 23's whole problem.

## Expected Output

Thirty-two bars responding to sound, a peak-frequency readout, and a marker under the peak bar.
Silence shows "listening".

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Always shows "listening" | `PEAK_RATIO` too high, or too quiet | Lower it to 2.0, or whistle louder |
| Peak stuck at the lowest bin | `MIN_BIN` too low | Raise toward 8 |
| Bars all maxed out | Normalising to the wrong value | `biggest` should be the max across bars |
| Very sluggish | N too large | 256 is the sweet spot in pure Python |
| Bin 0 enormous | DC not removed | Subtract the mean (Lab 7) |
| `ImportError: fftlab` | Library not on the board | It belongs in `/lib` |

## Challenges

1. **Peak hold.** Keep the highest peak seen in the last two seconds and mark it, like Lab 8's
   VU meter.
2. **Waterfall.** Scroll the display downward each frame, drawing brightness by magnitude. You'll
   have built a spectrogram.
3. **Count the harmonics.** Hum a steady note and count evenly-spaced peaks. Does the spacing
   match your fundamental?

## Check Your Understanding

1. Why is a quiet room's spectrum loudest at low frequencies?
2. Why does the peak-finder ignore bins below 300 Hz?
3. What does the fast magnitude approximation trade away, and why is that acceptable here?
4. Why does square-root scaling make the display more readable?
5. Humming shows several evenly-spaced peaks. What are they?

!!! mascot-celebration "You made a sound into a picture"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Fourteen labs ago you couldn't tell a whistle from a rumble. Now your Pico draws the
    difference, live. **Next lab: why your whistle sometimes smears across several bars
    instead of making one clean spike.**

---

**Next:** [Lab 22: Windowing and Spectral Leakage](../22-windowing/index.md)  |  **Previous:** [Lab 20](../20-complete-python-fft/index.md)
