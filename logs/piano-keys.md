# Adding Sound and Clickable Keys to a p5.js MicroSim

Session log for the work on
`docs/sims/frequency-to-musical-note-calculator/`. Written up because the audio
lessons here apply to **any** MicroSim that needs to make a sound, and three of
them are non-obvious enough that they will bite again.

Date: 2026-08-11

## What Was Built

Three feature requests, delivered in order:

1. A **Play tone** checkbox that synthesizes a sine wave at the selected frequency
2. **Clickable piano keys** — click a key to jump to its exact pitch and hear it
3. **Click anywhere off the keyboard to stop the tone**

Along the way two real bugs surfaced, both audio lifecycle problems, both
described below.

## 1. Loading p5.sound

p5.sound is a separate addon, not part of the p5 core bundle. Add it to
`main.html` **after** p5 itself, pinned to the same version:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/addons/p5.sound.min.js"></script>
```

The npm p5 package ships the addon at `lib/addons/p5.sound.min.js`, so jsDelivr
serves it from the same version path. Verify a new version actually exists before
committing:

```bash
curl -sI https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/addons/p5.sound.js | head -3
```

No p5.sound global collided with the sketch's existing names. Worth a glance
anyway — p5.sound adds `freqToMidi`, `midiToFreq`, `soundOut`, `userStartAudio`,
`outputVolume`, `loadSound`, and friends to the global namespace.

## 2. The Autoplay Policy

Browsers refuse to start an AudioContext except from a user gesture. The fix is
one line at the top of the start path:

```js
function startTone() {
  userStartAudio();          // resumes the suspended AudioContext
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();
  osc.freq(frequency);
  osc.amp(TONE_AMP, FADE);   // ramp up so the attack does not click
}
```

This works because `startTone()` only ever runs from a checkbox `changed()` or a
canvas click — both real gestures. **Do not** call `userStartAudio()` from
`setup()`; there is no gesture there and the context stays suspended.

Always ramp the gain instead of setting it. Starting at full amplitude produces
an audible click on the attack. `amp(0)` before `start()`, then
`amp(TONE_AMP, FADE)` with `FADE = 0.08` seconds, sounds instant but clean.

## 3. BUG: `amp(0)` Does Not Stop An Oscillator

This is the one that caused a stuck tone during the session.

The first implementation faded the gain to zero on uncheck:

```js
// WRONG — silent, but the oscillator is still running
} else if (osc) {
  osc.amp(0, 0.1);
}
```

The node keeps running forever. It is inaudible *if* the gain ramp lands, but
any cancelled or rescheduled ramp brings the tone straight back, and the node
leaks. The correct teardown fades **and then disposes**:

```js
function stopTone() {
  if (!osc) return;
  const dying = osc;
  osc = null;                                   // next start builds a fresh one
  dying.amp(0, FADE);
  setTimeout(function () { dying.dispose(); }, (FADE + 0.05) * 1000);
}
```

Notes on this shape:

- Null the module-level reference **immediately**, so a fast re-check builds a
  new oscillator rather than racing the dying one.
- `dispose()` beats `stop()` — it stops the node, disconnects it, *and* removes
  it from p5.sound's registry of live nodes. Repeated `new p5.Oscillator()`
  without `dispose()` grows that registry forever. (The registry is the
  internal `p5sound.soundArray`; reachable from a console as
  `p5.soundOut.soundArray`.)
- The timeout must exceed the fade, or you cut off the fade and reintroduce the
  click you were avoiding.

### How to prove a tone really stopped

Do not trust silence — a muted-but-running oscillator sounds identical to a
disposed one. Count the live nodes in p5's registry:

```js
p5.soundOut.soundArray.filter(o => o instanceof p5.Oscillator).length
// must be 0 after stopping
```

Running five on/off cycles and confirming this stays at 0 is a cheap leak test.

## 4. BUG: A Hidden Tab Freezes `draw()` But Not The Audio

`draw()` runs on `requestAnimationFrame`, which browsers throttle to a full stop
in a background tab. The Web Audio thread is **not** throttled. Consequences:

- A tone started before the tab was hidden keeps sounding, with no visible sim
  to stop it. Bad in an iframe on a docs page.
- Any state the sketch syncs inside `draw()` silently stops updating.

Guard for it:

```js
document.addEventListener('visibilitychange', function () {
  if (document.hidden) switchToneOff();
});
```

The second consequence also argues for driving audio parameters from **DOM
events rather than from `draw()`**. The frequency glide originally lived in
`draw()` and compared against a `lastToneFreq`; it now hangs off the slider's own
input event, so it tracks regardless of frame throttling:

```js
freqSlider.input(updateToneFrequency);

function updateToneFrequency() {
  if (toneOn && osc) osc.freq(freqSlider.value(), 0.02);   // 20 ms glide
}
```

General rule: **`draw()` is for rendering; use DOM events for anything that must
happen whether or not a frame runs.**

### Testing artifact from the same cause

In the Claude browser pane the tab is frequently `document.hidden === true`. When
it is, the page collapses to zero width and the sketch never advances:

```
{"canvasWidth":0,"containerWidth":0,"frameCount":0,"hidden":true,"mainRect":0}
```

That is *not* a sketch bug. Taking a screenshot forces a render and the real
values appear. Do not go debugging a zero-width canvas before checking
`document.hidden` and `frameCount`.

## 5. p5's `mousePressed` Fires For The Whole Window

The most surprising finding, and the one that would have shipped a broken
checkbox.

p5 binds mouse events to `window`, not to the canvas. `mousePressed()` therefore
fires for clicks on **every** DOM control — including the sliders and checkboxes
a MicroSim positions on top of the canvas. Confirmed empirically by logging
`event.target`:

```
{"tag":"INPUT","type":"checkbox","onControl":true,...}
{"tag":"INPUT","type":"range","onControl":true,...}
{"tag":"CANVAS","onControl":false,...}
{"tag":"HTML","onControl":false,...}
```

So the naive "click off the keyboard stops the tone" would have made the **Play
tone** checkbox impossible to turn on: the mousedown would have fired
`switchToneOff()` before/around the checkbox's own `changed()` handler. Same for
the slider — every drag would have killed the tone.

`mousePressed` receives the event, so filter on the target:

```js
function mousePressed(event) {
  // p5 listens on the whole window, so this also fires for the slider and the
  // checkbox that sit on top of the canvas.
  if (event && isOnControl(event.target)) return;

  const k = keyAt(mouseX, mouseY);
  if (k !== null) {
    playKey(k);
  } else {
    switchToneOff();
  }
}

function isOnControl(target) {
  return freqSlider.elt.contains(target) || playToneCheckbox.elt.contains(target);
}
```

`.elt.contains()` rather than `===` because `createCheckbox()` builds a `div`
wrapping an `input` and a `label`; a click can land on any of the three.

**Reusable takeaway:** any MicroSim that gives the canvas a click behavior must
exclude its own p5 DOM controls, or those controls will fight the canvas
handler. This applies to every MicroSim with `createSlider`/`createCheckbox` plus
`mousePressed`, not just audio ones.

## 6. Keeping The Checkbox Honest

Three separate paths can stop the tone (uncheck, click-away, tab hidden). Each
must also update the checkbox, or the UI lies about the audio state. One helper,
used everywhere:

```js
function switchToneOff() {
  if (!toneOn) return;
  playToneCheckbox.checked(false);
  toggleTone();                 // reads the checkbox, so state stays single-sourced
}
```

`toggleTone()` reads `playToneCheckbox.checked()` rather than taking a boolean
argument, so the checkbox remains the single source of truth.

## 7. Hit-Testing A Piano Keyboard

The geometry was originally computed inline inside `drawKeyboard()`. Clicking
needs the same geometry, and two copies drift apart. Extracted into one
`keyLayout()` returning `{k, black, x, y, w, h}` records, **whites first then
blacks** so the array doubles as draw order:

```js
return whites.concat(blacks);
```

The hit test then walks the same array **backwards**, so the black keys drawn on
top also win the overlap:

```js
function hitTest(keys, x, y) {
  for (let i = keys.length - 1; i >= 0; i--) {
    const r = keys[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r.k;
  }
  return null;
}
```

Verified: 21 white + 15 black = 36 keys for C3–B5; a click on A#4's body returns
A#4, a click on the lower part of A4 (below the black key) returns A4, and clicks
above or below the strip return `null`.

`drawKeyboard()` builds the layout once per frame and passes it to `hitTest()`
for the hover highlight, so the layout is not rebuilt twice per frame.

## 8. Slider Step vs. Musical Exactness

The slider was `createSlider(80, 2000, 440, 1)` — 1 Hz steps. Clicking a key to
get its exact pitch does not work on a whole-Hertz grid: C3 is 130.813 Hz, so the
nearest integer is ~1 cent flat and the readout would say "flat" the instant you
clicked C3.

Fixed by using 0.1 Hz steps and deriving the endpoints from the drawn keys, so
the slider can never run off the keyboard either:

```js
const MIN_FREQ = Math.round(exactFrequency(FIRST_KEY) * 10) / 10;   // C3, 130.8 Hz
const MAX_FREQ = Math.round(exactFrequency(LAST_KEY) * 10) / 10;    // B5, 987.8 Hz

freqSlider = createSlider(MIN_FREQ, MAX_FREQ, 440, 0.1);
```

Deriving from `FIRST_KEY`/`LAST_KEY` rather than hardcoding means the range stays
correct if the drawn octave span ever changes.

Two follow-on details:

- Fractional steps leave float dust (`987.8000000000001`). Round once per frame:
  `frequency = Math.round(freqSlider.value() * 10) / 10;`
- Displays need a formatter so integers do not render as `440.0`:
  ```js
  function formatHz(f) {
    return Number.isInteger(f) ? f.toString() : f.toFixed(1);
  }
  ```

Clamping the slider to the keyboard also made the readout's "outside the drawn
range" branch unreachable, so it was deleted.

## 9. Silent Verification Technique

To exercise every click path without blasting tones at the user, mute the master
output first — everything else behaves identically:

```js
outputVolume(0);
```

To confirm audio is *genuinely* flowing (not just that state variables look
right), tap the output with an AnalyserNode and find the peak bin:

```js
const an = getAudioContext().createAnalyser();
an.fftSize = 4096;
osc.output.connect(an);
// ...wait ~400 ms, then getFloatFrequencyData and argmax
// measured 445 Hz for a 440 Hz tone at 11.7 Hz bin spacing — correct
```

Pleasingly on-topic for an FFT textbook: verifying the MicroSim meant running an
FFT on its output and checking the peak bin, with the bin-spacing error the book
spends a chapter on.

## 10. Checklist: Growing A MicroSim's Control Area

Adding a second control row changed the canvas height 385 → 415, which has to be
updated in **five** places or the iframe clips or gains a scrollbar:

- [ ] `// CANVAS_HEIGHT:` comment at the top of the `.js`
- [ ] `controlHeight` in the `.js` (45 → 75 for a second row)
- [ ] `<iframe height="...">` in the sim's own `index.md` (**twice** — the live
      embed and the copy-paste snippet)
- [ ] `<iframe height="...">` in every chapter that embeds the sim
      (`grep -rn "<sim-name>/main.html" docs/`)
- [ ] `canvasHeight` **and** `technical.canvasDimensions.height` in
      `metadata.json`

Find every embed with:

```bash
grep -rn "frequency-to-musical-note-calculator/main.html" docs/
```

Row geometry that worked: row 1 control at `drawHeight + 12`, row 2 at
`drawHeight + 42`, with `controlHeight = 75`. On-canvas labels for row 2 sit at
`drawHeight + 53`.

## Gotcha: Browser Tool Coordinate Space

Unrelated to p5, but it cost a wasted click. The `computer` tool's coordinates
are in **screenshot** space, which is not the space of the image as displayed —
the returned image was 2× the reported `Screenshot size: 800x450`. Reading
coordinates off the rendered image and passing them straight in clicks the wrong
place (and a y beyond the screenshot height silently misses).

Safer: use `read_page` to get `ref_N` handles and click by `ref`, or divide the
image coordinates by the scale factor.

## Files Touched

| File | Change |
|---|---|
| `main.html` | added p5.sound CDN script |
| `frequency-to-musical-note-calculator.js` | oscillator lifecycle, click handling, shared key layout, slider range/step |
| `index.md` | About + How to Use steps, iframe heights |
| `metadata.json` | canvasHeight, controls, dependencies, limitations |
| `docs/chapters/15-.../index.md` | iframe height |

## Verification Performed

| Click target | `event.target` | Result |
|---|---|---|
| Play tone checkbox | `INPUT[checkbox]` | tone on, not self-cancelled |
| Readout panel | `CANVAS` | tone off, 0 live oscillators |
| Piano key C4 | `CANVAS` | tone on at 261.6 Hz |
| Slider | `INPUT[range]` | tone stays on, glides to new pitch |
| Page background | `HTML` | tone off, 0 live oscillators |

Plus: slider clamps at 130.8 / 987.8 when asked for 60 or 3000; endpoint keys
read in tune (−0.17 and +0.06 cents); five on/off cycles leak no oscillators;
`visibilitychange` silences and unchecks; `mkdocs build` clean.

## Open Item

The keys are mouse-only — `accessibility.keyboardNavigable` is still `false` in
`metadata.json`. Keyboard users can reach the slider and checkbox but cannot
trigger a specific key. Making the keyboard focusable with arrow-key navigation
would be a separate change, and would be worth a shared pattern if more
instrument-style MicroSims appear.
