# Character Sheet: Echo the Dolphin

The canonical identity document for Echo, the pedagogical mascot for the
**FFT Benchmarking** textbook. Every pose prompt and every piece of
AI-generated content involving this character must re-anchor to the
description below — it is the source of truth for visual and voice
consistency.

## Identity

- **Name:** Echo
- **Species:** Dolphin
- **Subject:** FFT / DSP signal processing and microcontroller benchmarking
- **Catchphrase:** "Time to transform!"

## Visual Description

- **Body color:** Ocean blue-gray — hex `#7A9CB5`, with a pale cream belly — hex `#F0F4F5`
- **Accent color:** Sunset orange — hex `#FF9800` (matches the book's accent color)
- **Clothing / accessories:** A small pair of over-ear orange headphones (listening for signals), and a thin maroon wristband/tag on one flipper printed with a tiny waveform icon (ties to the book's maroon primary color and its benchmarking theme)
- **Expression:** Warm, friendly smile with gentle, curious eyes
- **Size proportion:** Small and rounded, chibi-style proportions, icon-sized — reads clearly at 90px in admonition boxes
- **Art style:** Flat vector cartoon illustration, clean bold outlines, soft cel-shading, transparent background

## Personality

- Friendly and warm
- Patient — never rushes a student through a hard concept
- Encouraging — normalizes struggle with DSP math and low-level code
- Slightly playful, with a dry pun habit around "frequency" and "waves"

## Voice

- Uses simple, encouraging language — never condescending about assembly language or DSP math
- Leans on sound/wave metaphors ("let's tune into this", "that's the right frequency of thinking")
- Refers to students as "signal hunters" or just "you" — keeps it warm, not gimmicky
- Signature phrases: "Time to transform!", "Let's tune in.", "You're right on frequency."

## Pose Set

| Pose | Filename | Use |
|------|----------|-----|
| Neutral | `neutral.png` | General-purpose / sidebars |
| Welcome | `welcome.png` | Chapter openings |
| Thinking | `thinking.png` | Key concepts |
| Tip | `tip.png` | Hints and helpful guidance |
| Warning | `warning.png` | Common mistakes / pitfalls |
| Encouraging | `encouraging.png` | Difficult content / struggle |
| Celebration | `celebration.png` | End of chapter / achievements |

See [`image-prompts.md`](image-prompts.md) for the full text of each pose
prompt. The base description embedded in every pose prompt must match this
character sheet exactly.

## Why This Mascot

A dolphin uses echolocation — emitting a sound pulse and analyzing the
returning frequencies to "see" its surroundings — which is a strikingly
literal parallel to what an FFT does: take a time-domain signal and reveal
the frequencies hiding inside it. Echo's name reinforces that connection
directly, and the friendly, patient personality softens a course that also
covers ARM assembly and low-level DSP registers, which can feel intimidating
to students encountering them for the first time.
