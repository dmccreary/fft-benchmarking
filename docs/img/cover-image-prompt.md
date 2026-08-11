# Cover Image Prompt

Please generate a professional-quality cover image for this textbook.
This image will be used in social media previews and must follow the
formatting guidelines for an Open Graph image preview.

**Required specifications:**
- Format: PNG
- Wide-landscape format
- Size: 1200x630 pixels (1.91:1 aspect ratio)
- This is the Open Graph standard for social media previews

The image has four layers, back to front: background montage, color
treatment, mascot, and title text.

## Subject & Tone

**Real-Time DSP on a $5 Microcontroller** is a textbook that teaches students
to build a Fast Fourier Transform from scratch and hand-optimize it in ARM
assembly until it runs live audio analysis on a $5 Raspberry Pi Pico 2 — taking
a 512-point transform from 21 seconds down to 0.59 milliseconds, benchmarked
honestly at every step. The intended audience is college juniors and seniors
curious about signal processing, with no prior DSP or assembly background
assumed. The visual tone should be **modern and technical, with a hands-on,
maker-lab energy** — this is a book about cheap hardware doing something that
used to require a lab bench, so the cover should feel approachable and a
little thrilling, not sterile or corporate.

## Title

Place **Real-Time DSP on a $5 Microcontroller** in the center of the image,
in a clean, highly legible sans-serif font. Use a light/white font color with
a subtle drop shadow or dark scrim behind it so it stays readable against the
busy montage background. Keep the title short enough to render at a large
size — do not shrink it to fit; instead simplify the background directly
behind the text. If a subtitle is included, render **Building and
Benchmarking the FFT from Scratch** smaller, directly beneath the main title.

## Background Montage

Arrange a montage of the following 8 concepts around the title, each
rendered in a consistent illustration style (see Style below) so the
composition reads as one image rather than a collage of unrelated styles:

- **Raspberry Pi Pico 2 on a breadboard** — a small green microcontroller
  board wired with jumper wires to a tiny OLED display and a microphone
  module, evoking the course's real $19 hardware kit.
- **Waveform transforming into a spectrum** — a time-domain sine-like
  waveform on one side flowing (with a subtle arrow or morph effect) into a
  frequency-domain spectrum with sharp vertical peaks on the other side.
- **FFT butterfly diagram** — the classic signal-flow "butterfly": two input
  nodes crossing in an X-shape to two output nodes, with small twiddle-factor
  labels, rendered as a clean glowing line diagram.
- **Complex plane with roots of unity** — a unit circle on a complex
  (real/imaginary) plane with evenly spaced points and radiating spokes,
  suggesting Euler's formula and the math foundation of the FFT.
- **Glowing OLED spectrum display** — a small 128x64 monochrome display
  showing live vertical spectrum bars and a tuner-style needle, representing
  the real-time visual payoff of the course.
- **ARM register / instruction grid** — a grid of labeled CPU registers with
  hex values and a fragment of encoded assembly instructions, representing
  the low-level optimization work in the back half of the course.
- **Benchmark bar chart with dramatically shrinking bars** — a simple bar
  chart showing execution time collapsing across stages (slow brute-force DFT
  down to fast hand-tuned assembly), representing the course's benchmarking
  narrative.
- **Cycle-counter stopwatch** — a digital readout showing a nanosecond-scale
  timing value next to a stylized stopwatch icon, representing the DWT cycle
  counter used to measure everything honestly.

## Mascot

Place the book's mascot, **Echo the Dolphin**, in the lower-left corner in
the **Welcome pose**, sized so it does not overlap the title text. Echo is
waving cheerfully with one flipper raised, facing the viewer with a warm,
welcoming expression that says "let's get started." Echo is ocean blue-gray
(`#7A9CB5`) with a pale cream belly (`#F0F4F5`), wears a small pair of
over-ear orange headphones (`#FF9800`), and has a thin maroon wristband on
one flipper printed with a tiny waveform icon. Echo is small and rounded,
chibi-style proportions, with a warm friendly smile and gentle, curious eyes,
drawn in the same flat vector cartoon style as the rest of the illustration
(clean bold outlines, soft cel-shading). A reference image is available at
`docs/img/mascot/welcome.png` — match Echo's design to it exactly.

## Style & Composition

- Illustration style: **flat vector cartoon / technical illustration** —
  clean bold outlines, soft cel-shading, no photorealism — applied
  consistently to every montage element and to the mascot so the whole
  composition reads as one illustration.
- Color palette: **deep blue and teal**, matching the book's blue primary
  theme color, with **sunset orange** accents (`#FF9800`, matching both the
  book's accent color and Echo's headphones), plus a touch of **maroon** from
  Echo's wristband for contrast highlights.
- Lighting/mood: bright, energetic, and technical — glowing waveform and
  circuit-trace highlights against a deep blue background, conveying
  hands-on discovery rather than a sterile lab.
- Composition: title centered with generous negative space immediately
  behind it, montage elements arranged in a loose ring or grid around the
  title, Echo the Dolphin waving from the lower-left corner.

## Avoid

- Do not render dense paragraphs of illegible text anywhere in the image.
- Avoid generic stock-photo cliches (handshakes, isolated lightbulbs, people
  pointing at whiteboards) — every montage element above is drawn from the
  book's actual content.
- Avoid photorealistic human faces or photorealistic circuit-board photos —
  keep everything in the flat vector illustration style.
- Do not let montage elements or the mascot visually compete with or overlap
  the title text.
