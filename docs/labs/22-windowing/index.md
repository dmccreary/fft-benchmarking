# Lab 22: Windowing and Spectral Leakage

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 21](../21-real-spectrum/index.md)  |  **Hardware:** Pico 2 (microphone optional)

!!! mascot-welcome "Why your whistle sometimes smears"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In Lab 21 a steady whistle sometimes made one crisp spike and sometimes splattered across
    half the display. That wasn't the microphone misbehaving — it's a real property of the
    DFT, and it has a genuinely elegant fix. Let's tune in.

## What You'll Build

A side-by-side demonstration of spectral leakage, then four window functions measured against
each other so you can see exactly what each one costs and buys.

## Learning Objectives

- **Explain** why the DFT assumes your window repeats forever
- **Identify** the discontinuity that causes leakage
- **Apply** a Hanning window and measure the improvement
- **Compare** rectangular, Hanning, Hamming and Blackman windows
- **Describe** the sidelobe/resolution tradeoff
- **Account** for the amplitude a window costs you

## Concepts Introduced

| ID | Concept |
|---|---|
| 411 | Spectral Leakage Effect |
| 412 | Rectangular Window |
| 413 | Hanning Window |
| 414 | Hamming Window |
| 415 | Blackman Window |
| 416 | Main Lobe Width |
| 417 | Side Lobe Level |
| 418 | Window Tradeoff |
| 419 | Coherent Gain |
| 420 | Edge Discontinuity |
| 421 | Window Table |

## Background

### The DFT thinks your signal loops

A DFT sees N samples and assumes they repeat forever, end joined to beginning. If the wave fits
a whole number of cycles in the window, the loop is seamless. If it doesn't, there's a **jump**
at the seam — and a jump is a sharp edge, full of frequencies that were never in the sound.

That's **spectral leakage**: energy from one true frequency spilling into neighbouring bins.

### It is not a small effect

```
--- 800 Hz -- lands exactly on bin 8 ---
   8     800 Hz ##############################################

--- 850 Hz -- falls BETWEEN bins ---
   4     400 Hz ######
   5     500 Hz #######
   6     600 Hz ##########
   7     700 Hz ################
   8     800 Hz ##############################################
   9     900 Hz ###########################################
  10    1000 Hz #############
```

Same pure tone, same amplitude. Only the frequency moved — by half a bin. One is a clean spike;
the other contaminates ten bins.

!!! mascot-thinking "Real sounds are never bin-exact"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A bin is 50 Hz wide in Lab 21. Your whistle doesn't politely land on a multiple of 50.
    So leakage isn't an edge case you occasionally hit — it's the **normal** situation, and
    the clean spike is the rare accident.

### The fix: fade the edges

A window function multiplies your samples by a curve that starts at zero, rises to one in the
middle, and falls back to zero. Now the ends *do* meet, and there's no seam.

```
Hanning window shape:
   0
   2 **
   6 *********
  10 ****************
  14 *********************
  16 ***********************
  20 ********************
  26 ********
  30 *
```

## Procedure

### Step 1 — See the problem

Open `22-windowing.py` and run it:

```python
--8<-- "docs/labs/22-windowing/code/22-windowing.py"
```

Part 1 shows the on-bin and off-bin spectra back to back.

### Step 2 — Find the seam

```
  on-bin   first=+0.000 last=-0.383  jump at the seam = 0.383
  off-bin  first=+0.000 last=+0.924  jump at the seam = 0.924
```

The off-bin tone's discontinuity is more than twice as large. That step *is* the leakage.

### Step 3 — Apply a window

Part 3 windows the same off-bin tone. The smear collapses dramatically — though not to a single
bin. **Windows reduce leakage; they don't abolish it.**

### Step 4 — Compare four windows

```
window               peak         spread worst sidelobe
rectangular          41.9         34 bins      -17.8 dB
hanning              27.0          6 bins      -46.8 dB
hamming              28.2         10 bins      -37.7 dB
blackman             23.5          6 bins      -57.9 dB
```

"Spread" is how many bins one pure tone contaminates above 1% of its own peak. Rectangular
(i.e. no window) ruins **34 bins**; Hanning ruins **6**.

The sidelobe column is the headline: from −17.8 dB to −57.9 dB is a **40 dB** improvement — a
factor of 100 in amplitude.

!!! mascot-tip "There is no 'best' window"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Low sidelobes let you spot a quiet tone beside a loud one. A narrow main lobe lets you
    separate two *close* tones. Windows buy the first by giving up a little of the second,
    and they all cost peak height. Hanning is the sensible default; pick another when you
    know which problem you have.

### Step 5 — Pay the bill

```
  rectangular  peak     64.0   (1.00 of unwindowed)
  hanning      peak     31.7   (0.50 of unwindowed)
  blackman     peak     26.7   (0.42 of unwindowed)
```

A window multiplies most samples by less than one, so total energy drops. Hanning keeps about
**half**. That factor is **coherent gain** — divide by it if you need true amplitudes rather
than a nice-looking picture.

### Step 6 — Predict, then measure

> **Prediction:** add a Hanning window to your Lab 21 spectrum analyzer. What happens to the
> bars while you whistle?

Try it. Precompute the window table once at startup — recomputing a cosine per sample per frame
is exactly the mistake Lab 18 taught you to avoid.

## Expected Output

The leakage comparison in Part 1, the window shape in Part 3, and the two tables above.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No difference from windowing | Test tone is bin-exact | Use a frequency *between* bins |
| Everything got quieter | Working as designed | That's coherent gain — see Part 5 |
| Peak moved bins | Shouldn't happen for a strong tone | Check the window is applied elementwise |
| Leakage worse with a window | Window applied twice | Reset the buffer each frame |

## Challenges

1. **Window your analyzer.** Add Hanning to Lab 21 with a precomputed table. Does the whistle
   peak look tighter?
2. **Two close tones.** Generate 800 Hz and 900 Hz together. Which window separates them best?
   Now try 800 Hz loud and 1,500 Hz very quiet — does the answer change?
3. **Correct the amplitude.** Divide by the coherent gain and confirm the windowed peak matches
   the unwindowed one for a bin-exact tone.

## Check Your Understanding

1. Why does the DFT behave as if your samples repeat forever?
2. What exactly causes leakage for an off-bin tone?
3. Reading the table: which window would you pick to find a quiet tone next to a loud one?
4. What is coherent gain, and when must you correct for it?
5. Why is leakage the normal case rather than the exception with real sounds?

!!! mascot-celebration "Your spectra just got honest"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You know why peaks smear and how to tame them. **Next lab we squeeze real precision out
    of those peaks** — enough to build a working instrument tuner.

---

**Next:** [Lab 23: Peak Detection — Build a Tuner](../23-tuner/index.md)  |  **Previous:** [Lab 21](../21-real-spectrum/index.md)
