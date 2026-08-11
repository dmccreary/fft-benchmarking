# MicroSim Build Log: FFT Applications Map

- **MicroSim ID:** `fft-applications-map`
- **Chapter:** 27 — Capstone: Applications, Design, and Reporting
- **Library:** p5.js 1.11.10
- **Bloom level:** Understand (exemplify, connect)
- **Canvas height:** 485 (iframe 487px)
- **Date:** 2026-08-11

## Learning Objective

Connect each of six real-world FFT application domains back to the specific
course chapter that taught its underlying technique.

## Chapter Attributions

The spec fixes only one mapping — machine monitoring to Chapter 15's peak
detection — so the other five were chosen by checking the actual chapter list
and content rather than guessing from titles. Each domain is attributed to the
one chapter it leans on *most directly*, which is more useful than listing
everything it touches.

| Domain | Chapter | Rationale |
|---|---|---|
| Voice Recognition | 16 — Building a Real-Time Spectrum Analyzer | speech is a stream of short-frame spectra, so it needs the frame pipeline, not just one transform |
| Noise Cancellation | 7 — Complex Numbers and Wave Superposition | cancellation is superposition with inverted phase; phase is the complex part |
| Machine Monitoring | 15 — Windowing, Spectral Leakage, and Peak Detection | spec-mandated, and correct: a fault peak is small and dies in leakage |
| Radar Processing | 8 — Correlation | pulse compression is matched filtering, which is correlation |
| Software Defined Radio | 6 — Sampling, Quantization, and Aliasing | undersampling is aliasing used on purpose |
| Communication Systems | 13 — FFT Variants, Complexity, and Correctness | OFDM's modulator is an inverse FFT; confirmed chapter 13 covers the inverse transform (14 references) and chapter 12 does not |

Chapter titles were read from each chapter's front matter rather than inferred
from the directory names, so the strings shown in the sim match the book.

## Design Decisions

**Icons drawn as p5 primitives, no image files.** Six hand-drawn glyphs —
microphone, headphones, gear, radar dish, antenna, signal bars — in each card's
accent color. No external assets to break, and they scale with the card.

**Three-part reveal, identical structure for all six.** Description, then
"Builds on Chapter N — Title" with a one-line reason, then a capstone idea. The
uniform shape is what makes the six comparable; a student can scan the same slot
in each card.

**Tooltip on hover, panel on click.** The spec asks for both. The tooltip is a
real floating box that follows the cursor and flips above it near the bottom
edge, rather than a change to the panel — the two interactions do visibly
different things.

**Capstone ideas are scoped to the hardware.** Each project is something a Pico 2
and this course's existing code can actually do — a five-word command
recognizer, a bearing-fault classifier, an ultrasonic correlator, a two-Pico
OFDM link over an audio cable. An unbuildable idea is worse than no idea.

## Bugs Found and Fixed

**Tooltip clipped its final word.** The box was sized to exactly
`textWidth(tip) + 2 × padding`, and the line-count was derived from the same
number, so it always computed one line. p5's wrapping then pushed the last word
onto a second line that the box was too short to show — "…correlation is an"
with the "FFT." missing. Fixed by giving the box 10px of slack beyond the
measured width, deriving the line count from the slacked inner width, and
capping the width at 380px so long tips wrap to two visible lines. Verified with
both the shortest and the longest tip.

**Detail panel clipped the longest capstone idea.** The project text had a 24px
box, enough for one line; the Communication Systems entry needs two. Raised the
panel from 148px to 166px and `drawHeight` from 422 to 440, and gave the project
text a 34px box. Re-checked against the longest of the six entries specifically.

**`label.join(' / ')` produced "Communication / Systems".** The two-element
label array exists for line-wrapping inside the card, not as a compound name, so
joining it read as a slash pair for five of the six domains. Added an explicit
`title` field used by the detail heading and the status line; only Machine
Monitoring / Vibration Analysis genuinely carries a slash.

## Verification

- Chapter numbers and titles cross-checked against `docs/chapters/*/index.md`
  front matter; chapter 13's coverage of the inverse transform confirmed by
  grep before attributing OFDM to it.
- All six cards clicked; detail panel content fits within the panel for the
  longest entry (Communication Systems).
- Tooltips checked at both extremes of length, and near the bottom edge where
  the box flips above the cursor.
- Playwright capture at exactly 800×487 with pageerror and console-error
  listeners; both empty.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
