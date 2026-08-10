# Lab 10: Bit Depth, Headroom and Clipping

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 9](../09-aliasing/index.md)  |  **Hardware:** Pico 2, INMP441

!!! mascot-welcome "How much detail is in a number?"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Last lab was about *how often* we look at the signal. This one is about *how precisely*
    we write down what we saw — and what happens when a sound is too loud to write down at
    all. Let's tune in.

## What You'll Build

Three experiments on one captured sound: measure your headroom, watch detail vanish as you
throw away bits, and deliberately clip audio until three-quarters of it slams into the wall.

## Learning Objectives

- **Calculate** dynamic range from bit depth
- **Measure** headroom before clipping
- **Demonstrate** how fewer bits raises the noise floor
- **Explain** what clipping does to a waveform and why it invents new frequencies
- **Relate** the 6 dB-per-bit rule to what you measure

## Concepts Introduced

| ID | Concept |
|---|---|
| 291 | Dynamic Range |
| 292 | Full Scale Value |
| 293 | Headroom |
| 294 | Clipping |
| 295 | Clipping Distortion |
| 296 | Quantization Error |
| 297 | Noise Floor |
| 298 | Amplitude Normalization |
| 299 | Integer Overflow |

## Background

### Bit depth is grid spacing

Sampling puts your measurements on a grid. **Bit depth** sets how fine that grid is.

| Bits | Distinct levels | Used by |
|---|---|---|
| 8 | 256 | old game consoles |
| 12 | 4,096 | many microcontroller ADCs |
| 16 | 65,536 | CD audio |
| **24** | **16,777,216** | **your INMP441** |

Every real value gets rounded to the nearest grid line. That rounding is **quantization error**,
and it behaves exactly like added noise.

### The 6 dB rule

Each extra bit doubles the number of levels, halving the error — worth about **6 dB** of
dynamic range:

```
dynamic range ≈ 6.02 × bits
```

For 24 bits that's about **144 dB**, which is enormous: from a whisper to a jet engine inside
one number.

### Full scale and headroom

`FULL_SCALE = 8388608` — that's 2²³, the largest a signed 24-bit sample can hold. **Headroom**
is how much louder your signal could get before hitting it.

### Clipping doesn't just get loud — it lies

When a sample exceeds full scale it can't. It stops at the maximum. Every sample in the peak
becomes the *same* value, so the rounded top of the wave flattens into a plateau:

```
   before                after clipping
     ╱‾╲                  ┌───┐
    ╱   ╲                 │   │
───╱─────╲───          ───┘   └───
```

That flat-topped shape isn't the original sound any more. Squared-off waves contain extra
**harmonics** — frequencies that were never in the room. In Lab 21 you'll see them appear as
spurious spikes in a spectrum.

!!! mascot-warning "Clipping is not recoverable"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Like aliasing, it destroys information rather than degrading it. Once a thousand samples
    all read `8388608`, nothing can tell you what they were. Turning the volume down
    afterwards just gives you a quieter flat top.

## Procedure

### Step 1 — Run all three experiments

Open `10-bit-depth.py` and run it. Make some noise during the "Capturing..." message:

```python
--8<-- "docs/labs/10-bit-depth/code/10-bit-depth.py"
```

### Step 2 — Read your headroom

```
full scale : 8388608  (2^23)
your peak  : 41998
peak level : -46.0 dBFS
headroom   : 46.0 dB before clipping
```

46 dB of headroom means the sound could get about **200× louder** before clipping. Microphones
are usually configured with plenty of headroom, because clipping is unfixable and a slightly
quiet recording is not.

### Step 3 — Watch bits disappear

```
  bits      step size quant. noise dB
    24              1         -140.0
    16            256          -95.1
    12           4096          -71.0
     8          65536          -47.0
     6         262144          -33.7
     4        1048576          -21.2
```

Look at the noise column. Each row drops 4 bits and the noise rises about **24 dB** — that's
6 dB per bit, exactly as the rule predicts. Theory, confirmed on your own desk.

Now compare against Lab 8: your quiet room measured around −75 dB. At 12 bits the noise floor
is −71 dB, which is *louder than your room*. **At 12 bits, silence would be buried in
quantization noise.** That's what bit depth buys you.

### Step 4 — Break it

```
    gain    clipped         peak
       1       0.0%        41999
      64       0.0%      2687910
     256      14.3%      8388608
    1024      74.6%      8388608
```

At ×256, one sample in seven is pinned. At ×1024, three-quarters of the waveform is a flat
plateau. Notice the peak column stops changing — it can't go higher, so extra gain only
flattens more of the wave.

### Step 5 — Predict, then measure

> **Prediction:** if 16-bit audio is "CD quality", why would anyone use 24?

Write your answer, then look again at the headroom number. (Hint: what if you don't know in
advance how loud the sound will be?)

## Expected Output

See the tables above — your peak and noise numbers will differ with room loudness, but the
**6 dB per bit** pattern and the clipping progression should hold.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Peak very small, huge headroom | Quiet room | Clap during the capture message |
| Quantization noise all −140 | Signal too quiet to quantize | Make more noise, then re-run |
| No clipping even at ×1024 | Extremely quiet capture | Raise the gains, or capture something louder |
| Peak already near full scale | Very loud source | Move the source back; you're near clipping already |

## Challenges

1. **Find the breaking point.** Binary-search the gain that first produces exactly 1% clipping.
2. **Hear the difference.** Quantize to 4 bits and print the ASCII waveform from Lab 7 for both
   versions. The staircase is visible.
3. **Do the arithmetic.** Your room floor is about −75 dB. Using 6 dB per bit, what's the
   fewest bits that keeps quantization noise below it? Check against the table.

## Check Your Understanding

1. How many distinct levels does a 24-bit sample have?
2. What is headroom, and why aim for plenty of it?
3. Why does clipping create frequencies that weren't in the original sound?
4. Roughly how much dynamic range does each extra bit buy?
5. Aliasing and clipping are both unrecoverable. What do they have in common?

!!! mascot-celebration "Module 2 complete — you speak audio now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Capture, loudness, sample rate, bit depth. You can measure *how loud* and you know
    exactly how your instrument can deceive you.
    **But you still can't tell a whistle from a rumble.** That's next — and Module 3 is
    where you build the answer yourself, from scratch. Now *that's* going to be a superpower.

---

**Next:** [Lab 11: Sine Waves](../11-sine-waves/index.md)  |  **Previous:** [Lab 9](../09-aliasing/index.md)
