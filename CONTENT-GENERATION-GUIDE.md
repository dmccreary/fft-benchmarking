# Content Generation Guide

This file collects style and consistency rules for AI-generated
student-facing content in this repository (chapters, hands-on-labs, lesson plans,
quizzes, FAQ, etc.). Instructor-facing content (teacher/instructor guide)
does not need to follow the mascot or tone rules below — it can stay
straightforward and professional.

## Big Idea: A Fast FFT Is a Superpower

Every piece of student-facing content should carry this thread, even when
it's not stated outright: **a fast FFT turns a cheap little chip into
something that can listen to the real world and instantly understand it.**
Raw sensor data — sound, vibration, radio, anything that wiggles — looks
like noise until you transform it into the frequency domain. Then patterns
jump out. That transformation, done in real time, is the closest thing
signal processing has to a superpower.

Make sure content leans into why that's a big deal, not just how the math
works:

- **Speed is the whole story.** A slow FFT is a curiosity. A *fast* FFT
  running in real time on cheap hardware is what makes live audio,
  vibration monitoring, and sensor fusion actually possible. Frame
  optimization work as "unlocking" that speed, not just "improving
  performance."
- **This is genuinely rare territory.** Very few college courses put
  ultra-fast FFT benchmarking directly on a $5 microcontroller like the
  Raspberry Pi Pico 2. Most treat real-time DSP as something you need
  expensive lab equipment or a dedicated DSP chip to touch. Students
  working through this book are doing something most CS/EE undergrads
  never get to do — say so, and let that feel exciting rather than being
  buried as a footnote.
- **Democratization is the theme, not a slogan.** The $5 price tag isn't
  just a fun fact — it's the point. Cheap, ubiquitous hardware that can do
  real-time frequency analysis means signal-processing superpowers are no
  longer locked behind expensive gear. Content can lean on this when
  motivating *why* a chapter or technique matters.

## Overall Tone

Student-facing content should read as **fun, lighthearted, and positive**
— even when the material is dense (assembly instructions, DSP registers,
benchmarking methodology). Technical accuracy is never optional, but the
voice around it should feel like an enthusiastic guide, not a reference
manual.

- **Celebrate discovery.** Treat each new concept as something cool the
  reader just unlocked, not a requirement to check off.
- **Keep energy up without hype-fatigue.** Enthusiasm should feel earned
  and specific ("this butterfly operation is why your FFT just got 10x
  faster"), not generic cheerleading slapped on every sentence.
- **Humor is welcome, clarity is not negotiable.** A well-placed pun or
  light aside is great; it should never obscure what a student needs to
  understand or do next.
- **Avoid dry, dense textbook tone.** Prefer short, direct sentences and
  concrete examples over long qualifier-laden academic prose.

**Example — same fact, two tones:**

> Dry: "The FFT reduces the computational complexity of the DFT from
> O(N²) to O(N log N), enabling real-time execution on resource-constrained
> hardware."
>
> Guide voice: "Here's the magic trick: the FFT does the same job as the
> brute-force DFT but throws away almost all the wasted work. That's the
> difference between a Pico that chokes on a signal and one that reads it
> in real time."

## Learning Mascot: Echo the Dolphin

### Mascot File Index

The canonical files for this mascot. When editing any of these, update the
others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| `docs/img/mascot/neutral.png` | Default / general-purpose pose. *(not yet generated)* |
| `docs/img/mascot/welcome.png` | Chapter-opening pose. *(not yet generated)* |
| `docs/img/mascot/thinking.png` | Key-concept pose. *(not yet generated)* |
| `docs/img/mascot/tip.png` | Hint / helpful-guidance pose. *(not yet generated)* |
| `docs/img/mascot/warning.png` | Common-mistake / pitfall pose. *(not yet generated)* |
| `docs/img/mascot/encouraging.png` | Difficult-content / struggle pose. *(not yet generated)* |
| `docs/img/mascot/celebration.png` | End-of-chapter / achievement pose. *(not yet generated)* |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |

### Character Overview

- **Name**: Echo
- **Species**: Dolphin
- **Personality**: Friendly, patient, encouraging, gently playful
- **Catchphrase**: "Time to transform!"
- **Visual**: Ocean blue-gray dolphin with a pale cream belly, small orange
  over-ear headphones, and a thin maroon wristband printed with a tiny
  waveform icon. Flat vector cartoon style, chibi proportions.

### Voice Characteristics

- Uses simple, encouraging language — never condescending about assembly
  language or DSP math
- Leans on sound/wave metaphors ("let's tune into this", "that's the right
  frequency of thinking")
- Treats speed and frequency-domain insight as Echo's own "superpower" —
  echolocation is literally real-time signal processing, so Echo gets
  genuinely excited when a fast FFT reveals something a slow one would
  have missed
- Refers to students as "signal hunters" or just "you" — warm, not gimmicky
- Signature phrases: "Time to transform!", "Let's tune in.", "You're right
  on frequency.", "Now *that's* a superpower.", "Not bad for a $5 chip!"

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar.
**Image paths are relative to the rendered page URL, not the markdown
file** — MkDocs uses directory URLs, so count directories from the page to
`docs/img/mascot/`. For a chapter page at `chapters/01-intro/index.md`, use
`../../img/mascot/`.

    !!! mascot-welcome "Title Here"
        ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
        Admonition text goes here after the image.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | mascot-neutral | As needed |
| Chapter opening | mascot-welcome | Every chapter |
| Key concept | mascot-thinking | 2-3 per chapter |
| Helpful tip | mascot-tip | As needed |
| Common mistake | mascot-warning | As needed |
| Difficult content | mascot-encourage | Where students may struggle |
| Section completion | mascot-celebration | End of major sections |

### Do's and Don'ts

**Do:**

- Use Echo to introduce new topics warmly
- Include the catchphrase ("Time to transform!") in welcome admonitions
- Keep dialogue brief (1-3 sentences)
- Match the pose/image to the content type
- Have Echo treat frequency-domain insight as a superpower being unlocked,
  not just a computation being performed
- Let Echo call out the $5-Pico angle when it's genuinely relevant (e.g. "a
  chip this small doing this? that's the whole point")

**Don't:**

- Use Echo more than 5-6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Echo's personality or speech patterns
- Give Echo gendered pronouns — refer to Echo by name, or use they/them
- Let enthusiasm turn into empty hype — every "superpower" moment should
  point at something specific and true, not generic excitement
