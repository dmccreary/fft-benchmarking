---
title: Experimental Design Anatomy
description: Take a benchmark question apart by dragging its phrases into research question, independent variable, dependent variable, and controlled variables.
image: /sims/experimental-design-anatomy/experimental-design-anatomy.png
og:image: /sims/experimental-design-anatomy/experimental-design-anatomy.png
twitter:image: /sims/experimental-design-anatomy/experimental-design-anatomy.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Experimental Design Anatomy

<iframe src="main.html" height="437px" width="100%" scrolling="no"></iframe>

[Run the Experimental Design Anatomy MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/experimental-design-anatomy/main.html"
        height="437px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A well-formed benchmark question already contains its own experimental design.
You do not invent the variables afterward — if the question is written properly,
they are sitting in the sentence, and this simulation is the act of pulling them
out.

Every phrase in the example plays exactly one of four roles:

- **Research question** — what the whole experiment exists to answer. Not a
  variable, and not measurable on its own.
- **Independent variable** — the one thing you deliberately change between runs.
  One. If two things change, no result can tell you which one mattered.
- **Dependent variable** — the number you read off at the end. It must be a
  number, with a unit, or you cannot compare two runs.
- **Controlled variables** — everything held identical across every run.
  Usually the longest list, and the one people forget to write down.

The pattern is easiest to see in the sentence structure itself. "Does *A* change
*B*, holding *C*, *D*, and *E* fixed?" — *A* is what you vary, *B* is what you
measure, and *C* through *E* are what you pin down. Once you can hear that shape,
you can write it, and once you can write it you have a benchmark suite: one run
per value of *A*, recording *B*, with *C* through *E* identical every time.

The three examples come from different domains — audio tone detection, bearing
vibration, and radio signal separation — because the structure is the point, not
the subject. The same four boxes work for all of them.

A wrong placement gets you a hint about the *category*, not the answer. If you
drop "peak-frequency error in Hz" into Independent Variable, the simulation tells
you that phrase describes something you measure rather than something you change,
and leaves you to work out where it goes.

## How to Use

1. Read the whole question first. The highlighted phrases are the ones that have
   a role to fill.
2. Drag each phrase into the box where you think it belongs. A dashed outline
   marks where it came from in the sentence.
3. Press **Check my answers**. Correct phrases turn green; the first incorrect
   one turns red and produces a hint.
4. Fix and re-check until all six are green.
5. Press **Try a new example** for a question from a different domain, and see
   whether the structure you just learned transfers.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 10-12 minutes

**Prerequisites:**

- The idea that an experiment compares outcomes under changed conditions
- Familiarity with the FFT parameters used in the examples

**Learning Objective:** Classify the components of a stated research question
into research question, independent variable, dependent variable, and controlled
variables, and construct a benchmark suite around them.

**Activities:**

1. **Classify the first example (3 min).** Work through the audio example
   individually. Most errors are between independent and dependent — the hint
   text addresses that pair directly.
2. **Transfer to a new domain (3 min).** Do the vibration example without
   discussion. Students who have understood the structure finish it much faster
   than the first.
3. **Construct the suite (3 min).** With all six phrases placed, ask: how many
   benchmark runs does this question require, and what does each row of your
   results table hold? (Two runs — one per value of the independent variable —
   each recording the dependent variable, with the controlled variables recorded
   once in the header.)
4. **Break the design (3 min).** Ask what happens if a second independent
   variable sneaks in — say the clock speed also changes between runs. Establish
   that the result becomes uninterpretable, not merely noisy.

**Assessment:** Write a research question, in the same "Does *A* change *B*,
holding *C* fixed?" form, for a benchmark you would actually want to run on the
Pico 2. Then list the runs your suite would contain.

## Related Resources

- [Variant Performance Dashboard](../variant-performance-dashboard/index.md) — what the results of a design like this look like
- [Optimization Attribution Waterfall](../optimization-attribution-waterfall/index.md) — one-change-at-a-time measurement, applied
- [FFT Applications Map](../fft-applications-map/index.md) — domains you might build a capstone benchmark around

## References

- [NIST/SEMATECH e-Handbook of Statistical Methods: Experimental Design](https://www.itl.nist.gov/div898/handbook/pri/pri.htm) — the formal treatment of the vocabulary used here
- [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf) — the platform named in the controlled variables of the first example
