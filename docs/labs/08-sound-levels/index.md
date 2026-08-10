# Lab 8: Sound Levels — RMS and a VU Meter

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 7](../07-first-sound/index.md)  |  **Hardware:** Pico 2, INMP441, OLED

!!! mascot-welcome "512 numbers, one answer"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Last lab gave you a pile of wobbling numbers. Useful, but not exactly readable at a
    glance. Today we squeeze each pile down to a single number — *how loud* — and put it on
    screen as a bar that dances when you talk. Let's tune in.

## What You'll Build

A live sound level meter: a bar graph on the OLED with a peak-hold marker, a decibel readout,
and a graph in Thonny's plotter that follows your voice.

## Learning Objectives

- **Explain** why the average of a sound wave is useless and RMS is not
- **Compute** RMS from a buffer of samples
- **Convert** a level to decibels relative to full scale
- **Smooth** a noisy reading with a moving average
- **Use** Thonny's plotter as a live graph
- **Draw** a bar meter with peak hold on the OLED

## Concepts Introduced

| ID | Concept |
|---|---|
| 270 | Root Mean Square |
| 271 | Sound Level |
| 272 | Loudness Perception |
| 273 | Thonny Plotter |
| 274 | Moving Average |
| 275 | Exponential Smoothing |
| 276 | Sensor Auto Calibration |
| 277 | Bar Graph Display |
| 278 | Decibel Scale |
| 279 | Level Meter |

## Background

### Why not just average?

A sound wave spends as much time below zero as above it. Add up a loud sine wave and you get…
roughly zero. Add up a quiet one: also roughly zero. Useless.

**RMS** — Root Mean Square — fixes this in three steps:

1. **Square** every sample (negatives become positive)
2. Take the **mean** of those squares
3. Take the **square root** to get back to sensible units

```python
rms = math.sqrt(sum(v*v for v in samples) / len(samples))
```

Read the name backwards and it's the recipe.

### Decibels, because ears are logarithmic

Your ear doesn't hear loudness linearly. Doubling a sound's power isn't "twice as loud" — it's
one small step. So we use a logarithmic scale:

```python
db = 20 * math.log10(rms / FULL_SCALE)
```

This is **dBFS** — decibels relative to full scale. `0 dBFS` is the loudest the hardware can
represent, so real sounds are always negative. A quiet room measures around −70 dBFS. Speech
lands nearer −40.

!!! mascot-thinking "Every 6 dB is a doubling"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Add 6 dB and the amplitude doubles. So −40 dB is about *thirty times* bigger than
    −70 dB, even though the numbers look close. That compression is exactly why dB is
    readable where raw numbers aren't — it squeezes a range of a million into a range of
    about 120.

### Smoothing without lying

Raw readings twitch. A **moving average** — keep the last N readings and average them —
steadies the display. Bigger N means smoother but slower to react. That's a genuine tradeoff,
and you'll meet it again as "averaging" in Lab 26.

## Procedure

### Step 1 — Run the meter

Open `08-sound-levels.py` and run it:

```python
--8<-- "docs/labs/08-sound-levels/code/08-sound-levels.py"
```

Talk, clap, whistle. The bar on the OLED follows you, and the peak marker lingers then falls.

### Step 2 — Open the plotter

In Thonny: **View → Plotter**. Because the program prints one bare number per reading, Thonny
graphs it automatically. Now you have a rolling chart of the room's loudness.

Try:

- speaking normally
- clapping once (watch the peak marker hold, then decay)
- staying silent (find your room's noise floor)

!!! mascot-tip "Find your noise floor"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Be completely quiet and note the reading — probably around −75 to −80 dB. That is your
    room plus the microphone's own electrical noise, and **nothing quieter than that will
    ever be measurable.** Every sensor has one. Knowing yours tells you what's real and
    what's just the floor.

### Step 3 — Tune the smoothing

Change `SMOOTHING` from 4 to 1, then to 20:

| Value | Behaviour |
|---|---|
| 1 | jumpy, instant response |
| 4 | balanced (default) |
| 20 | glassy smooth, noticeably laggy |

There's no correct answer — it depends whether you're measuring a drum hit or room ambience.

### Step 4 — Predict, then measure

Write your prediction down first:

> **Prediction:** if you clap twice as loudly, how many dB does the reading rise?

Then test it. (Hint: doubling amplitude is +6 dB. Most people guess much higher.)

## Expected Output

Shell, with the plotter drawing them as a graph:

```
Make some noise! Ctrl-C to stop.
Tip: View -> Plotter to see this as a graph.
-80.59595
-71.84481
-63.53012
-56.0706
-59.44247
-62.05345
```

On the OLED: a title, a filled bar with a peak marker, and the dB readouts.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Bar pinned at maximum in silence | DC offset not removed | Subtract the mean before squaring |
| Reading never changes | Mic not delivering data | Re-check [Lab 7](../07-first-sound/index.md) wiring |
| Bar always empty | Range mismatch | The meter maps −80…0 dB; a very quiet room may sit below −80 |
| Plotter shows nothing | Printing extra text | Thonny plots bare numbers only — one per line |
| Meter twitches wildly | Smoothing too low | Raise `SMOOTHING` |
| Meter feels sluggish | Smoothing too high | Lower `SMOOTHING` |

## Challenges

1. **Auto-ranging.** Track the quietest and loudest levels seen so far and stretch the bar
   between them. Now the meter adapts to any room.
2. **Clap detector.** Trigger something when the level jumps more than 20 dB in one reading.
   Careful: what stops it firing repeatedly on one clap? (You solved this in Lab 5.)
3. **Exponential smoothing.** Replace the moving average with
   `smooth = 0.8 * smooth + 0.2 * new`. Same steadying effect, one variable instead of a list.
   Which do you prefer, and why?

## Check Your Understanding

1. Why is the plain average of a sound wave close to zero regardless of loudness?
2. Write the three steps of RMS in order.
3. Why are dBFS values always negative?
4. If a sound gets 6 dB louder, what happened to its amplitude?
5. What is a noise floor, and why can't you measure below it?

!!! mascot-celebration "One number, live, on a screen"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know *how loud*. But not **what** — a rumble and a whistle can read identically.
    Cracking that open is what Module 3 is for. First, though, two labs on how sampling can
    fool you.

---

**Next:** [Lab 9: Sampling Rate and Aliasing](../09-aliasing/index.md)  |  **Previous:** [Lab 7](../07-first-sound/index.md)
