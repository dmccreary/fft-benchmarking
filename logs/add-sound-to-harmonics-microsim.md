# Adding Sound to the Harmonic Stack Synthesizer

Session log for adding a **Play Sound** button to
`docs/sims/harmonic-stack-synthesizer/`. This is the second audio MicroSim in the
book, after `frequency-to-musical-note-calculator` (see `logs/piano-keys.md`).
That log established the oscillator lifecycle; this one is worth reading for the
parts that were *new*: normalizing a multi-oscillator mix, and a p5.sound
scheduling bug that the single-oscillator sim never exposed.

**Date:** 2026-08-11
**Sim ID:** `harmonic-stack-synthesizer`
**Chapter:** 4 — Waves

## What Was Built

One button that sounds the mix currently drawn on screen: five sine oscillators
at 440 / 880 / 1320 / 1760 / 2200 Hz, at the amplitudes the five sliders are set
to. The button toggles its own label between **Play Sound** and **Stop Sound**,
and an on-canvas status line to its right reports the state in words.

The pedagogical point of the sim is that overtone mixture changes timbre but not
pitch. Sound makes that claim checkable by ear instead of only by eye, which is
the whole reason to add it — so every design decision below is subordinate to one
requirement: **changing the sliders must change the character of the sound and
nothing else.** In particular it must not change the loudness, or students will
hear "louder" and record it as "different."

## 1. Five Oscillators, Not One Wavetable

Three ways to synthesize this:

| Approach | Nodes | Cost of a slider move |
|---|---|---|
| Five `p5.Oscillator`s, one per harmonic | 5 | ramp one gain |
| One `OscillatorNode` + `PeriodicWave` | 1 | rebuild and swap the wavetable |
| One oscillator with a p5 custom wavetable | 1 | same, via p5's wrapper |

`PeriodicWave` is the efficient answer and is what a synth would do — you hand it
the harmonic amplitude array directly, which is almost literally the sim's model.
It was rejected anyway, for two reasons:

1. **Swapping a wavetable is discontinuous.** `setPeriodicWave()` cannot be
   ramped. Dragging a slider would step the timbre in audible chunks, and each
   step risks a click at the discontinuity. Five independent gains can each glide.
2. **One node per slider is the honest model.** The sim teaches that a complex
   tone *is* a sum of sines. Code that literally sums five sine oscillators is
   the thing being taught. Five nodes cost nothing at this scale.

If a future sim needs 32 harmonics, revisit this — the gain-per-partial approach
does not scale indefinitely, and at that point wavetable-swap-on-mouse-release
(ramping only between releases) becomes the better trade.

## 2. Loudness Normalization — The Central Design Decision

Naive gain assignment is `gain[n] = amplitudes[n]/100 * MASTER_AMP`. This is
wrong in a way that undermines the lesson. With all five harmonics at 100% the
mix peaks at five times the fundamental alone: it clips, and long before it clips
it just gets *louder*. A student raising an overtone would hear volume, not
timbre.

So the mix is normalized: divide every gain by the peak excursion of the summed
waveform.

```js
function gainFor(n, peak) {
  return MASTER_AMP * (amplitudes[n] / 100) / peak;
}
```

### Why the peak, and not the sum

The obvious cheap normalizer is the sum of the amplitudes — guaranteed safe,
since the peak can never exceed it. It is also needlessly quiet, because the
harmonics do not all reach maximum at the same instant. Measured on the presets:

| Preset | Sum of amplitudes | True peak | Loss if you divide by the sum |
|---|---|---|---|
| Flute | 1.25 | 1.05 | −1.6 dB |
| Violin | 2.80 | 2.07 | −2.6 dB |
| Clarinet | 2.25 | 1.55 | −3.2 dB |

Worse, the error is *different per preset*, so switching presets would change the
loudness — reintroducing exactly the artifact normalization exists to remove.
Dividing by the true peak makes every preset land at the same output level.

### Sharing the peak with the plot

`drawPlot()` already computed a peak, for the same reason (keep the waveform
filling the frame at any mix). Two independent peak computations of the same
quantity is a bug waiting to happen, so both now call one function:

```js
function peakOfMix() {
  let peak = 0.001;
  for (let i = 0; i <= PEAK_SAMPLES; i++) {
    peak = Math.max(peak, Math.abs(combinedAt((i / PEAK_SAMPLES) * WINDOW_S)));
  }
  return peak;
}
```

This is more than tidiness. It means **the vertical scale of the drawing and the
loudness of the sound are normalized by the same number**, so the picture and the
sound cannot disagree about how loud the mix is. The plot got slightly more
accurate in the bargain: it previously sampled once per pixel (~350 points across
three cycles, ~23 samples per period of the 5th harmonic — coarse enough to miss
a peak by a few percent). `PEAK_SAMPLES = 1200` fixes the resolution independent
of canvas width, so the scale no longer changes subtly with window size.

The `0.001` floor prevents a divide-by-zero when every slider is at 0. It cannot
produce a spurious loud output, because in that state every numerator is also 0.

### Verified

Every preset produces a mix whose true peak is exactly `MASTER_AMP` (0.25), with
the harmonic ratios preserved exactly:

| Preset | Gains | Ratios to fundamental | Mix peak |
|---|---|---|---|
| Pure tone | 0.25, 0, 0, 0, 0 | 100 / 0 / 0 / 0 / 0 | 0.250 |
| Flute | 0.239, 0.048, 0.012, 0, 0 | 100 / 20 / 5 / 0 / 0 | 0.250 |
| Violin | 0.121, 0.091, 0.067, 0.036, 0.024 | 100 / 75 / 55 / 30 / 20 | 0.250 |
| Clarinet | 0.161, 0.008, 0.113, 0.008, 0.072 | 100 / 5 / 70 / 5 / 45 | 0.250 |

Constant loudness, exact timbre. That is the whole requirement, met.

## 3. BUG: `amp()` Does Not Cancel Queued Automation

This is the find of the session, and it is not in the piano-keys log because a
single oscillator with one gain change at a time never triggers it.

**Symptom:** move a slider immediately after pressing Play and that harmonic does
not come in. The state variables all update correctly — `amplitudes` reads
`[100, 80, 0, 0, 0]` — but the oscillator gains stay at their start-time values.
It looks exactly like an event handler that never fired.

**Cause:** p5's `amp()` is, in essence:

```js
this.output.gain.linearRampToValueAtTime(vol, now + rampTime);
```

There is no `cancelScheduledValues()`. Web Audio applies automation in **event
time order, not call order**. So:

1. `startSound()` schedules a ramp to the attack target at `now + 0.08`.
2. 20 ms later the slider fires and schedules a ramp to the new level at
   `now + 0.03` — which is *earlier* on the timeline.
3. The parameter ramps to the new level at 0.03 s… and then keeps going, on to
   the still-queued attack target, arriving at 0.08 s.

The older event wins because it is later in time. The new level is silently
discarded.

**Fix.** Never use `amp()` for level changes. Ramp the raw `AudioParam`, clearing
the queue first and starting from wherever the gain actually is:

```js
function rampGain(osc, target, seconds) {
  const g = osc.output.gain;
  const now = getAudioContext().currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);        // pin the current value as the ramp origin
  g.linearRampToValueAtTime(target, now + seconds);
}
```

The `setValueAtTime(g.value, now)` is required, not decorative: after cancelling,
the ramp would otherwise originate from the last *event*, not from the current
value, and jump.

All three call sites — attack, release, level change — now go through
`rampGain()`. Once they do, the ordering hazard cannot recur regardless of how
fast a user clicks.

**The window is only 80 ms, so is this real?** Yes. Pressing a preset button
immediately after Play is a natural gesture and reproduces it. More importantly,
the failure is silent and state-consistent, so the next developer to hit it will
debug the event handler for an hour before suspecting the audio graph.

### Related trap: p5 builds oscillator gain nodes at 0.5

`new p5.Oscillator()` leaves `output.gain.value === 0.5`, not 0. Ramping up from
there starts the tone half-open and clicks. The piano-keys sim handled this with
`osc.amp(0)` before `start()`, but `amp(0)` is itself a scheduled ramp, so
combining it with `rampGain()` (which reads `g.value`) is ambiguous at the same
timestamp. Set the value directly instead:

```js
o.output.gain.setValueAtTime(0, now);   // p5 builds the node at 0.5
o.start();
rampGain(o, gainFor(n, peak), FADE);
```

## 4. Setting a Slider in Code Fires No `input` Event

`applyPreset()` calls `sliders[i].value(values[i])`. That updates the DOM element
but does **not** dispatch an `input` event, so the handler that drives the audio
never runs. The preset would change the picture and not the sound.

```js
function applyPreset(name) {
  const values = PRESETS[name];
  for (let i = 0; i < 5; i++) {
    sliders[i].value(values[i]);
    amplitudes[i] = values[i];
  }
  // Setting a slider's value in code fires no input event, so drive the audio.
  updateSoundLevels();
}
```

**General rule:** every path that can change a model value needs its own call to
the audio update, because only *user* interaction with a control fires its event.
Here there are three such paths — slider drag, preset button, and startup.

## 5. Audio State Comes From Events, Not `draw()`

Carried over from the piano-keys log and worth restating because it shaped the
structure. `draw()` stops in a background tab; the audio thread does not. Any
parameter synced only inside `draw()` freezes while the sound keeps playing.

The slider read was therefore factored out of `draw()` into a named function that
both `draw()` and the slider's `input` handler call:

```js
function readSliders() {
  for (let i = 0; i < 5; i++) amplitudes[i] = sliders[i].value();
}
```

`draw()` still calls it — that keeps the drawing correct with no event traffic —
but the audio never depends on a frame having run.

The same reasoning gives the hidden-tab guard:

```js
document.addEventListener('visibilitychange', function () {
  if (document.hidden) switchSoundOff();
});
```

This matters more than it sounds. The sim is embedded in an iframe on a docs
page; a student who switches tabs with the sound on would otherwise have an
invisible 440 Hz tone following them around.

## 6. No `mousePressed` Here — And That Is Why This Sim Is Simpler

Piano-keys §5 documents that p5 binds `mousePressed` to `window`, so a canvas
click handler also fires for every slider and checkbox on top of the canvas, and
must filter on `event.target`. **This sim defines no `mousePressed`**, so none of
that applies. Noted explicitly so a future developer does not go looking for a
guard that was deliberately never needed — and as a warning that adding any
canvas click behavior here would immediately require one.

## 7. Layout: The Canvas Grew 555 → 585

One new control row, at `drawHeight + 250`, with `controlHeight` 255 → 285. Per
the piano-keys checklist, the height lives in five places:

- [x] `// CANVAS_HEIGHT:` comment at the top of the `.js` → 585
- [x] `controlHeight` in the `.js` → 285
- [x] `<iframe height>` in the sim's `index.md` — **twice**, live embed and
      copy-paste snippet → 587px
- [x] `<iframe height>` in `docs/chapters/04-waves/index.md` → 587px
- [x] `canvasHeight` **and** `technical.canvasDimensions.height` in
      `metadata.json` → 585

```bash
grep -rn "harmonic-stack-synthesizer/main.html" docs/
```

The status text sits at `x = 115`, clear of the button, and was checked at 375 px
width — it fits without wrapping or clipping.

## 8. Verification Method

### Mute first

`outputVolume(0)` before any test. Dan hears the browser pane's audio live;
leaving a tone running is rude and leaving one running *unnoticed* is worse.

### The pane hides between tool calls

The Claude browser pane frequently has `document.hidden === true` between calls.
Here that is not merely a rendering nuisance (piano-keys §4) — the sim's own
`visibilitychange` guard **stops the sound between tool calls**. An early attempt
started the sound in one call and measured in the next, and found
`soundOn === false` with zero oscillators. That is the feature working, not a bug.

Two consequences for anyone testing audio in this harness:

- **Every audio measurement must be a single-shot async IIFE**: start, wait,
  measure, stop, all inside one `javascript_tool` call.
- **Minimize `setTimeout` count**, not just total delay. Background tabs clamp
  timers to ≥1 s each, so a loop with ten short waits takes >10 s and can blow
  the 30 s tool timeout. One 900 ms wait beats five 100 ms ones.

Also: `getAudioContext().state` stays `running` once unlocked, so only the *first*
start needs a real click. After that, tests can call `toggleSound()` directly.

### Reading gains correctly

`osc.output.gain.value` mid-ramp returns an interpolated value, not the target.
An early reading of `[0.5, 0.5, 0.5, 0.5, 0.5]` was just the p5 default captured
before any ramp had been applied. **Always wait past `FADE` before asserting on a
gain.**

### Proving audio actually flows

State variables looking right does not prove sound. Tap the oscillators with an
`AnalyserNode` and inspect the spectrum:

```js
const an = getAudioContext().createAnalyser();
an.fftSize = 8192;
an.smoothingTimeConstant = 0;
for (const o of oscillators) o.output.connect(an);
// wait ~600 ms, then getFloatFrequencyData
```

Clarinet preset, 48 kHz, 5.86 Hz bins:

| Nominal | Measured | Level | % of fundamental | Target |
|---|---|---|---|---|
| 440 Hz | 439 | −29.5 dB | 100 | 100 |
| 880 Hz | 879 | −55.6 dB | 5 | 5 |
| 1320 Hz | 1318 | −32.9 dB | 68 | 70 |
| 1760 Hz | 1758 | −56.1 dB | 5 | 5 |
| 2200 Hz | 2197 | −37.3 dB | 41 | 45 |

**The 3rd and 5th read low, and that is not a code error.** It is scalloping
loss. `AnalyserNode` applies a Blackman window; a tone landing between bin
centers is attenuated by up to ~1.1 dB. Check the bin offsets: 440 Hz sits
0.1 bins off center and reads exact; 1320 Hz sits 0.3 off and loses 0.25 dB;
2200 Hz sits 0.47 off — nearly the worst case — and loses 0.8 dB. The error
tracks distance from bin center exactly as theory says.

The authoritative measurement is the gain table in §2, which is exact. The FFT
confirms *that sound is present at the right frequencies*; it is the wrong
instrument for asserting amplitude to the percent.

Pleasingly on-topic for this book: verifying the MicroSim meant running an FFT on
its output and then explaining the result with the windowing chapter's own
material.

### Leak test

```js
p5.soundOut.soundArray.filter(o => o instanceof p5.Oscillator).length
```

Five rapid on/off cycles, then wait past the dispose delay: **0**. During the
rapid burst the count transiently hit 25, which is correct and expected — each
stop schedules its disposal 130 ms out, and with zero delay between cycles all
five batches coexist briefly. They all disposed. A human cannot toggle that fast;
the transient is bounded and self-clearing either way.

### Full results

| Check | Result |
|---|---|
| Button click starts audio | `AudioContext` → `running`, 5 oscillators, label → "Stop Sound" |
| Oscillator frequencies | 440 / 880 / 1320 / 1760 / 2200 Hz |
| Preset gains, all four | mix peak exactly 0.250; ratios exact |
| Spectrum (Clarinet) | peaks within one bin of nominal; levels match after scalloping |
| Slider drag while playing | ratio exact, mix peak held at 0.250 |
| Slider change *during* attack fade | broken before `rampGain()`, correct after |
| Preset pressed *during* attack fade | broken before `rampGain()`, correct after |
| 5 on/off cycles | 0 live oscillators |
| Tab hidden | sound stops, button label resets |
| Layout at 760 px and 375 px | no clipping, no scrollbar |
| Console | clean |
| `mkdocs build` | clean; no warnings for this sim or ch04 |

## Files Touched

| File | Change |
|---|---|
| `main.html` | p5.sound CDN script, pinned to the same 1.11.10 as p5 |
| `harmonic-stack-synthesizer.js` | oscillator lifecycle, `rampGain()`, shared `peakOfMix()`, event-driven levels, visibility guard, button + status line, canvas height |
| `index.md` | About paragraph, How-to-Use steps 5–6, iframe heights (×2) |
| `metadata.json` | canvasHeight, canvasDimensions, dependencies, controls, assumptions, limitations |
| `docs/chapters/04-waves/index.md` | iframe height |

## Reusable Takeaways

For the next audio MicroSim, in rough order of how much time they save:

1. **Never call `amp()` for a level change.** Use a `rampGain()` helper that
   cancels queued automation first. Copy the one in this sim verbatim.
2. **Normalize a multi-source mix by its true peak**, and share that peak with
   whatever the sim draws, so the picture and the sound agree.
3. **Setting a control's value in code fires no event.** Call the audio update
   explicitly from every path that changes the model.
4. **Wait past the fade before reading a gain.** Mid-ramp reads mean nothing.
5. **Measure audio in one tool call.** The pane hides between calls and the
   visibility guard will stop your sound out from under you.
6. `p5.Oscillator` gain nodes start at **0.5**, not 0.

## Open Items

- **No keyboard access to the button.** `accessibility.keyboardNavigable` remains
  `false` in `metadata.json`. The button is a real `<button>` so it is reachable
  by Tab and activates on Enter; the *sliders* are the gap, and that is a
  pre-existing condition shared by every slider MicroSim in the book rather than
  something this change introduced.
- **No envelope.** The tone is a flat sustain. Attack and decay are a large part
  of how a real instrument is identified, and their absence is now recorded in
  `metadata.json` limitations. Adding an ADSR would be a genuine improvement to
  the flute/violin/clarinet comparison, but it would also start teaching a second
  lesson on top of the one the sim is scoped to.
- **`MASTER_AMP = 0.25` is untested against a loud page.** If a chapter ever
  embeds two audio sims side by side, they will sum. No current chapter does.
