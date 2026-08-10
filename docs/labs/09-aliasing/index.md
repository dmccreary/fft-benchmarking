# Lab 9: Sampling Rate and Aliasing

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 8](../08-sound-levels/index.md)  |  **Hardware:** Pico 2, INMP441, OLED, a tone source

!!! mascot-welcome "This lab is going to lie to you"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    On purpose. You'll play a tone that keeps rising, and your Pico will confidently report
    a frequency that's *falling*. Not noisy. Not approximate. Precisely, sincerely wrong.
    Once you've seen it happen you'll never forget why sample rate matters.

## What You'll Build

A frequency meter that folds. You'll sweep a tone upward and watch the reading climb, stall,
and then run backwards — discovering the Nyquist limit by walking off the edge of it.

## Learning Objectives

- **Define** sampling rate, sample period and Nyquist frequency
- **Predict** what frequency a sampler will report for a tone above Nyquist
- **Demonstrate** aliasing with real audio
- **Explain** why an anti-alias filter is necessary
- **Justify** a sample rate choice for a given application

## Concepts Introduced

| ID | Concept |
|---|---|
| 280 | Sample Period |
| 281 | Sampling Theorem |
| 282 | Nyquist Frequency |
| 283 | Aliasing Artifact |
| 284 | Frequency Folding |
| 285 | Anti Aliasing Filter |
| 286 | Undersampling |
| 287 | Tone Generator |
| 288 | Sample Rate Selection |
| 289 | Sample Rate Selection Tradeoff |
| 290 | Productive Failure |

## Background

### Sampling is snapshots

A microphone signal is continuous. We look at it only at intervals — 12,800 times a second in
this course. Between snapshots, we have no idea what happened.

### The Nyquist limit

To capture a wave faithfully you need **at least two samples per cycle** — one for the top, one
for the bottom. So the highest frequency you can represent is **half the sampling rate**:

```
Nyquist frequency = sample rate / 2
```

| Sample rate | Highest honest frequency |
|---|---|
| 4,000 Hz | 2,000 Hz |
| 8,000 Hz | 4,000 Hz |
| 12,800 Hz | 6,400 Hz |
| 44,100 Hz (CD) | 22,050 Hz |

CD audio uses 44.1 kHz because human hearing tops out near 20 kHz. That's not a coincidence.

### What happens above the limit

The sampler doesn't fail, complain, or return an error. It reports a **different frequency** —
one that fits. The true frequency *folds* back like light off a mirror:

```
        reported
           ▲
    Nyq ───┼──────╮
           │     ╱ ╲
           │    ╱   ╲
           │   ╱     ╲
         0 └──┴───────┴────► true frequency
              Nyq    rate
```

At an 8,000 Hz sample rate:

| True tone | Reported as |
|---|---|
| 3,000 Hz | 3,000 Hz ✓ |
| 5,000 Hz | **3,000 Hz** ✗ |
| 6,000 Hz | **2,000 Hz** ✗ |
| 7,000 Hz | **1,000 Hz** ✗ |

A 7 kHz tone and a 1 kHz tone become genuinely indistinguishable. The information is gone, not
merely degraded.

!!! mascot-thinking "You've seen this before"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Wagon wheels rolling backwards in films. A camera samples 24 times a second; if the
    spokes move slightly less than one full gap between frames, your brain reads it as
    slow backwards motion. Same phenomenon, different sensor. Aliasing isn't an audio
    quirk — it's what sampling *does*.

### The fix: filter before you sample

You can't undo aliasing afterwards, so you prevent it: an **anti-alias filter** removes
everything above Nyquist *before* the sampler sees it. Better a missing high frequency than a
fake low one.

## Setup

You need a tone source with adjustable frequency:

- a tone generator app on a phone, or
- an online tone generator in a browser, or
- a musical instrument if you're feeling fancy

Hold it near the microphone. Loud and steady works best.

## Procedure

### Step 1 — Predict first

Before running anything, fill this in. The program samples at 4,000 Hz, so Nyquist is 2,000 Hz.

| You play | You predict it reads |
|---|---|
| 500 Hz | |
| 1,500 Hz | |
| 2,500 Hz | |
| 3,500 Hz | |

### Step 2 — Run it

Open `09-aliasing.py` and run it:

```python
--8<-- "docs/labs/09-aliasing/code/09-aliasing.py"
```

It cycles through three sample rates, reporting what it hears at each.

### Step 3 — Sweep upward

Start your tone at about 300 Hz and raise it slowly, watching the 4,000 Hz row.

Somewhere near 2,000 Hz the reading stops climbing. Keep going up. **The reported frequency
starts coming down.** You are now in alias territory.

### Step 4 — Find a collision

Find a tone that reads the same at 4,000 Hz sampling as some much lower tone does. Two
completely different sounds, one identical reading. That's what "information is lost" means in
practice.

!!! mascot-encourage "If this feels unsettling, good"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Most measurement errors are *noise* — a bit off, obviously imperfect. Aliasing isn't
    like that. Your instrument reports a clean, confident, completely fictional number.
    Sitting with that discomfort is the point of this lab.

### Step 5 — Compare rates

Play a 3,000 Hz tone and watch all three rows at once:

| Sampling at | Nyquist | Reads |
|---|---|---|
| 4,000 Hz | 2,000 | **1,000 Hz** — wrong |
| 8,000 Hz | 4,000 | 3,000 Hz — correct |
| 12,800 Hz | 6,400 | 3,000 Hz — correct |

Same sound, same room, same microphone. Only the sample rate differs.

## Expected Output

```
  at  4000 Hz sampling, anything above 2000 Hz will be a LIE
  at  8000 Hz sampling, anything above 4000 Hz will be a LIE
  at 12800 Hz sampling, anything above 6400 Hz will be a LIE

rate  4000 Hz (Nyquist 2000) reads   1500 Hz
rate  8000 Hz (Nyquist 4000) reads   1500 Hz
rate 12800 Hz (Nyquist 6400) reads   1500 Hz
```

…until you cross a limit, at which point the rows disagree with each other. **When two sample
rates disagree about the same sound, at least one of them is aliasing.** That's a genuinely
useful diagnostic.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "too quiet" always | Tone not loud enough | Move the source closer, or lower `NOISE_GATE` |
| Readings jump around | Zero-crossing counting is fooled by noise | Use a pure tone; avoid background sound |
| Reads about half the expected | Noise adding extra crossings | Increase the tone volume |
| Every rate agrees, no folding | Tone still below the lowest Nyquist | Go above 2,000 Hz to break the 4 kHz row first |
| Reading drifts while tone is steady | Room echoes | Try a less reverberant spot |

## Challenges

1. **Map the fold.** At 4,000 Hz sampling, record the reported frequency for true tones at
   500 Hz intervals from 500 to 7,500 Hz. Plot it. You should get a triangle wave.
2. **Predict exactly.** Derive a formula for the reported frequency given the true frequency
   and sample rate, then check it against your measurements.
3. **Pick a rate.** You need to capture speech (up to ~3,400 Hz). What's the lowest sample rate
   that works, and why wouldn't you just use the highest available?

## Check Your Understanding

1. State the Nyquist criterion in one sentence.
2. At a 10,000 Hz sample rate, what does a 7,000 Hz tone report as?
3. Why can't aliasing be corrected after sampling?
4. What does an anti-alias filter do, and where in the chain does it sit?
5. Why don't we simply sample everything as fast as possible?

!!! mascot-celebration "You broke it on purpose and learned why"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Every spectrum you build from Lab 21 onward stops at 6,400 Hz — and now you know that
    isn't a limitation someone chose to annoy you, it's arithmetic.

---

**Next:** [Lab 10: Bit Depth, Headroom and Clipping](../10-bit-depth/index.md)  |  **Previous:** [Lab 8](../08-sound-levels/index.md)
