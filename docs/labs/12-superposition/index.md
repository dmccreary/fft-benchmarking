# Lab 12: Adding Waves — Superposition and Beats

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 11](../11-sine-waves/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Real sound is never one tone"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A voice, a violin, a car engine — none of them is a single sine wave. They're *sums* of
    sine waves, added up. Which sets up the question the rest of this course answers:
    if sounds are sums, can we work out what went into the mix? Let's tune in.

## What You'll Build

Complex waveforms built by stacking simple ones: an octave pair, a square wave assembled from
harmonics, perfect cancellation, and beats — the wobble two nearly-identical tones make.

## Learning Objectives

- **Apply** superposition: add waves sample by sample
- **Explain** constructive and destructive interference
- **Build** a square wave from odd harmonics
- **Predict** the beat frequency of two close tones
- **Connect** harmonic content to timbre

## Concepts Introduced

| ID | Concept |
|---|---|
| 310 | Superposition Principle |
| 311 | Wave Addition |
| 312 | Constructive Interference |
| 313 | Destructive Interference |
| 314 | Beat Frequency |
| 315 | Amplitude Envelope |
| 316 | Fundamental Frequency |
| 317 | Overtones |
| 318 | Timbre |
| 319 | Additive Synthesis |

## Background

### Superposition: just add them

When two sounds arrive together, the air pressure at your ear is simply the **sum** of what each
would produce alone.

```python
combined = [a[i] + b[i] for i in range(len(a))]
```

No special rule, no interaction. Waves pass through each other unchanged.

### Harmonics and why a violin isn't a flute

Play the same note on different instruments and the **fundamental frequency** is identical —
that's why it's the same note. What differs is the **overtones**: multiples of the fundamental,
each at its own strength.

That recipe of overtones is **timbre**. It's why you can recognise a friend's voice from one
word.

### Building a square from sines

Add odd harmonics at shrinking amplitudes:

```
sin(f) + sin(3f)/3 + sin(5f)/5 + sin(7f)/7 + ...
```

The corners get squarer with every term. A perfect square wave needs infinitely many — which is
also *why* a clipped signal (Lab 10) contains frequencies that were never in the room. Flatten
the tops of a wave and you've added harmonics.

!!! mascot-thinking "This is the FFT question, backwards"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Here you add known sines to make a complex wave. The FFT does the reverse: it takes a
    complex wave and tells you which sines were added. Same relationship, opposite
    direction — and the reverse is far more useful, because the world hands you the sum
    and keeps the recipe secret.

## Procedure

### Step 1 — Run it

Open `12-superposition.py` and run it:

```python
--8<-- "docs/labs/12-superposition/code/12-superposition.py"
```

### Step 2 — Watch a square wave assemble

The second plot adds five odd harmonics. Compare it to the pure sine above: flatter top,
steeper sides. Try deleting terms and re-running — with only two harmonics it barely differs
from a sine.

### Step 3 — Cancel a sound completely

```
in phase  (0)  -> peak amplitude 2.00   CONSTRUCTIVE
anti-phase(pi) -> peak amplitude 0.00   DESTRUCTIVE
```

Two identical waves, half a cycle apart, sum to **exactly nothing**. That's not a trick — it's
how noise-cancelling headphones work: sample the noise, invert it, play it back.

### Step 4 — Beats

Add 200 Hz and 205 Hz and the envelope swells and fades **5 times a second** — the difference
between them:

```
  beat frequency = |f1 - f2|
```

Look at the envelope plot: it starts full, collapses near 100 ms, and rises again. That's one
half-cycle of a 5 Hz wobble.

!!! mascot-tip "Piano tuners use this"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Strike a tuning fork and a piano string together, and count the wobbles. Three per second
    means you're 3 Hz out. Tighten until the wobble stops and you're exact. It's a
    frequency comparison accurate to a fraction of a hertz, using only your ears.

### Step 5 — Predict, then measure

> **Prediction:** what beat frequency do 440 Hz and 443 Hz produce? What about 440 and 460?

Change `f1` and `f2` and check.

## Expected Output

```
=== Interference: same frequency, different phase ===
in phase  (0)  -> peak amplitude 2.00   CONSTRUCTIVE
anti-phase(pi) -> peak amplitude 0.00   DESTRUCTIVE

=== Beats: two close tones ===
200 Hz + 205 Hz -> you hear a wobble at 5 Hz

Envelope over 160 ms (each row is the local peak):
    0.0 ms |#################################################
   50.0 ms |###################################
  100.0 ms |###
  155.0 ms |########################################
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Cancellation isn't exactly zero | Floating-point rounding | 1e-16 is zero for our purposes |
| No visible beat | Frequencies too far apart | Beats are only audible when close — try within 10 Hz |
| Envelope looks flat | Window too short to hold one beat cycle | A 5 Hz beat needs 200 ms; raise `long_n` |
| Square wave looks like a sine | Too few harmonics | Add more odd terms |

## Challenges

1. **Sawtooth.** Use *all* harmonics (not just odd) at amplitude 1/n. How does it differ from
   the square?
2. **Beat hunt.** Find the smallest frequency difference that still shows a visible envelope in
   a 160 ms window. What limits it? (This is Lab 23's frequency-resolution problem in disguise.)
3. **Fake an instrument.** Pick a fundamental and invent an overtone recipe. Plot it. Would you
   guess it's a "brass" or "string" sound from the shape alone?

## Check Your Understanding

1. State the superposition principle in one sentence.
2. Two identical tones cancel completely. What must be true about their phase?
3. What's the beat frequency of 300 Hz and 307 Hz?
4. Why do a trumpet and a flute playing the same note sound different?
5. Lab 10 showed clipping creating new frequencies. Using this lab, explain why.

!!! mascot-celebration "You can build any sound now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Adding waves is the easy direction. **Next lab we go backwards** — given a mixed-up
    signal, work out which frequencies are inside it. That's the one everything else
    stands on.

---

**Next:** [Lab 13: Correlation](../13-correlation/index.md)  |  **Previous:** [Lab 11](../11-sine-waves/index.md)
