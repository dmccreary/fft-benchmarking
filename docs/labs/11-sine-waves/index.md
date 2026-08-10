# Lab 11: Sine Waves — Amplitude, Frequency, Phase

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 10](../10-bit-depth/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Now we build signals instead of catching them"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Module 2 was about catching sound. Module 3 is about *understanding* it — and to do
    that we need signals where we already know the answer. You can only trust a tool you've
    tested on something known. **Time to transform!**

## What You'll Build

Sine waves from scratch, in code, with the three knobs that define any wave — and a console
plot so you can see what each knob does.

## Learning Objectives

- **Generate** a sine wave from a frequency, amplitude and phase
- **Convert** a sample index into a moment in time
- **Explain** why angles are measured in radians
- **Relate** frequency, period, and samples-per-cycle
- **Predict** how many cycles fit in a window of N samples

## Concepts Introduced

| ID | Concept |
|---|---|
| 300 | Radians |
| 301 | Angular Frequency |
| 302 | Period Of A Wave |
| 303 | Phase Offset |
| 304 | Sine Synthesis |
| 305 | Sample Index To Time |
| 306 | Waveform Plotting |
| 307 | Peak Amplitude |
| 308 | DC Component |
| 309 | Signal Synthesis |

## Background

### Three numbers describe any sine wave

```python
value = amplitude * sin(2*pi*frequency*t + phase)
```

| Knob | Controls | Change it and… |
|---|---|---|
| **amplitude** | how tall | louder or quieter |
| **frequency** | how fast | higher or lower pitch |
| **phase** | where it starts | *sounds identical* |

That last one is worth dwelling on. Phase changes where in its cycle the wave begins. Your ear
can't hear it at all for a single tone — but it will nearly break our frequency detector in
Lab 13, so keep it in mind.

### From sample number to time

Your samples are just a list. To use the formula you need *when* each one happened:

```python
t = i / SAMPLE_RATE
```

Sample 128 at 12,800 Hz happened at 0.01 seconds. That single line connects "item in a list" to
"moment in time."

### Why radians

`sin()` repeats every **2π**. So `2*pi*frequency*t` advances by exactly one full turn per cycle
of the wave. Degrees would work, but you'd be writing 360 everywhere instead of 2π.

!!! mascot-thinking "The magic frequency: rate ÷ N"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    With 64 samples at 12,800 Hz, a **200 Hz** wave fits exactly one whole cycle in the
    window. 400 Hz fits two. Any multiple of 200 fits a whole number of cycles — and those
    are exactly the frequencies our detector will handle perfectly in Lab 13. Frequencies
    *between* them cause trouble, which becomes the entire subject of Lab 22.

## Procedure

### Step 1 — Generate and look

Open `11-sine-waves.py` and run it:

```python
--8<-- "docs/labs/11-sine-waves/code/11-sine-waves.py"
```

You'll see four plots: one cycle, two cycles, a quieter wave, and a phase-shifted one.

### Step 2 — Compare the plots

- **One vs two cycles** — same window, twice the wiggles. That's frequency.
- **Amplitude 0.3** — same shape, squashed toward the middle.
- **Phase π/2** — starts at the peak instead of the middle. Same wave, different starting point.

### Step 3 — Check the numbers

```
i=0  t=0.000000 s  angle=0.000 rad  sin=+0.0000
i=1  t=0.000078 s  angle=0.098 rad  sin=+0.0980
```

Each sample is 1/12,800 s = 78 µs later, and the angle advances a little each time. After 64
samples the angle reaches 2π and the wave has come full circle.

### Step 4 — Predict, then measure

> **Prediction:** change `N` from 64 to 128 without changing the frequency. How many cycles
> appear in the plot?

Try it. Then work out why — and what frequency would restore exactly one cycle.

## Expected Output

```
One cycle across 64 samples = 200.0 Hz
Two cycles                  = 400.0 Hz

--- 200 Hz -- exactly ONE cycle ---
                            *
                            | *
                            |    *
...

Period of a 200 Hz wave = 1/200 = 5.0000 ms
At 12800 Hz sampling that is 64 samples per cycle.
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Plot looks like noise | Frequency above Nyquist | Keep it under 6,400 Hz — you're aliasing (Lab 9) |
| Wave doesn't fit the window | Frequency isn't a multiple of rate/N | That's fine and normal; Lab 22 is all about it |
| Flat line | Amplitude is zero, or frequency is | Check your arguments |
| Plot fills the whole width | Amplitude greater than 1.0 | The plotter scales to ±1 |

## Challenges

1. **Make a cosine two ways.** Once with `math.cos`, once with `math.sin` and a phase shift.
   Confirm they match.
2. **Add a DC offset.** Add 0.5 to every sample. Where does the wave sit now? (You met this as
   the microphone's bias in Lab 7.)
3. **Sub-Nyquist check.** Generate a 6,000 Hz wave with 64 samples. Does it still look like a
   sine? How many samples per cycle do you get, and does that match Lab 9's rule?

## Check Your Understanding

1. What are the three parameters of a sine wave, and which one can't you hear?
2. Convert sample index 100 to a time, at 12,800 Hz.
3. Why is a full cycle 2π rather than 360?
4. With 256 samples at 12,800 Hz, what frequency fits exactly one cycle?
5. What's the period of a 400 Hz wave, in milliseconds?

!!! mascot-celebration "You can build any wave now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    One sine is a pure tone — a bit boring. Next lab we start stacking them, which is where
    real sound actually comes from.

---

**Next:** [Lab 12: Adding Waves](../12-superposition/index.md)  |  **Previous:** [Lab 10](../10-bit-depth/index.md)
