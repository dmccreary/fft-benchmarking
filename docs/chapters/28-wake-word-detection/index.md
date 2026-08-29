---
title: "Wake Word Detection: Listening for a Trigger Phrase on a Dual-Core Pico 2 W"
description: An optional extension chapter applying this course's FFT and correlation skills to always-on wake word detection — the false-accept/false-reject tradeoff in noisy environments, splitting capture and inference across the RP2350's two cores, enrolling a custom trigger phrase, and using a Pico 2 W to hand detected audio off to cloud speech-to-text
generated_by: claude (drafted with Claude Code from a course-planning conversation)
date: 2026-08-19
version: 0.01
---

# Wake Word Detection: Listening for a Trigger Phrase on a Dual-Core Pico 2 W

## Summary

This is an **optional extension chapter**, sitting outside the core 35-lab sequence. It asks
one question: can the FFT and correlation skills you already built be pointed at a genuinely
different problem — a device that listens *continuously* for one specific phrase, the way
"Alexa" or "Hey Google" wakes a smart speaker? The answer is yes, and the RP2350's two Cortex-M33
cores turn out to be exactly the right shape for it. This chapter covers why "always listening"
is a harder problem than a one-shot spectrum analysis, how to split signal capture and inference
across the two cores, how to enroll a custom trigger phrase using nothing but correlation you
already know, and why this is the one point in the entire course where the Pico 2 **W** stops
being merely compatible and becomes actually necessary. It closes by drawing a hard line around
scope: this chapter builds a wake-word *detector*, not a smart speaker.

## Concepts Covered

This chapter introduces the following 14 new concepts from the learning graph:

1. Wake Word Detection
2. False Accept Rate
3. False Reject Rate
4. Keyword Spotting Model
5. Wake Word Enrollment
6. Custom Trigger Phrase
7. Dual Core Partitioning
8. Inter Core Communication
9. On Device Inference
10. Always On Listening
11. Post Wake Audio Capture
12. Pico 2 W Wireless
13. Cloud Speech To Text
14. Edge Cloud Split

## Prerequisites

This chapter builds on concepts from:

- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [8. Correlation: Does My Signal Contain This Note?](../08-correlation/index.md)
- [14. Computing and Displaying a Real Spectrum](../14-computing-and-displaying-a-real-spectrum/index.md)
- [15. Windowing, Spectral Leakage, and Peak Detection](../15-windowing-spectral-leakage-and-peak-detection/index.md)
- [18. Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison](../18-benchmarking-methodology/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [27. Capstone: Applications, Design, and Reporting](../27-capstone/index.md)

---

!!! mascot-welcome "Time to transform — a whistle test into a whole conversation"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every chapter so far analyzed a signal when *you* decided to look at it. A wake word
    detector has to look all the time, forever, on battery power, and be right almost every
    time it decides to interrupt you. That's a genuinely different kind of hard — let's dig in.

## Why "Always Listening" Is a Harder Problem Than It Sounds

Every lab in this course so far ran the FFT on demand: press a button, capture a frame, look at
the spectrum. A wake word system can't work that way. It has to run the same capture-and-analyze
pipeline **continuously**, forever, in a room that is never actually quiet — a TV playing in the
next room, a dishwasher running, someone else's conversation, your own voice saying a sentence
that just happens to *contain* the trigger word inside it. Real acoustic environments are full of
sounds that sound almost, but not quite, like the phrase you're listening for.

That "almost" is the whole problem. Every wake word system has to pick an operating point on a
tradeoff between two failure modes:

- **False Accept Rate** — how often the system triggers on audio that was *not* the wake word.
  Too high, and the device interrupts you constantly, streams audio it shouldn't, and burns
  battery and bandwidth on false alarms.
- **False Reject Rate** — how often the system *misses* the real wake word. Too high, and you
  find yourself repeating "Alexa... Alexa... ALEXA" at an unresponsive speaker.

You cannot drive both to zero at once. Make the detector stricter and false accepts drop while
false rejects climb; loosen it and the reverse happens. Commercial engines publish numbers for
exactly this reason — Espressif's WakeNet engine on the ESP32-S3, for example, is tuned to keep
false accepts under roughly 2% measured in ordinary home background noise. That number is not a
curiosity; it *is* the product, in the same sense that this course has insisted a benchmark
number without its methodology is meaningless.

!!! mascot-thinking "The false-accept/false-reject tradeoff is the whole design problem"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Nearly every decision in this chapter — how long the trigger phrase is, how many enrollment
    samples you record, how you split work across the two cores — ultimately exists to push this
    one tradeoff curve in a better direction. Keep it in the back of your mind through the rest of
    the chapter.

## Splitting the Work Across the RP2350's Two Cores

Here is the timing problem underneath "always listening": the moment you add a keyword-spotting
decision on top of FFT-based feature extraction, you have two jobs competing for the same chip —
and one of them, sampling the microphone over I2S, cannot ever be late. Miss a sample deadline
and you lose audio, exactly as [Chapter 5](../05-capturing-real-audio/index.md) warned. But
keyword-spotting inference, whether it's a small neural network or a correlation match, can take
a variable amount of time from one window to the next.

The RP2350 answers this with a hardware feature this course has not yet needed: it is a genuine
**dual-core** chip, with two independent Cortex-M33 cores that can each run their own code at the
same time. That maps almost too neatly onto this problem:

- **Core 0 — the signal-processing core.** Runs the exact pipeline you already built: I2S
  capture, windowing, FFT, magnitude spectrum. It never touches the keyword-spotting model. Its
  only job, every single frame, is to finish that pipeline on schedule and hand off the result.
- **Core 1 — the inference core.** Continuously pulls the most recently finished feature frame
  and runs the keyword-spotting decision against it — nothing else. If inference for one frame
  runs a little long, Core 0 never notices; it was never waiting.

This division of labor is called **Dual Core Partitioning**, and the mechanism that hands a
finished frame from Core 0 to Core 1 without either core blocking on the other is **Inter Core
Communication** — typically a small ring buffer or the RP2350's built-in inter-core FIFO,
extending the same [Audio Buffer](../05-capturing-real-audio/index.md) idea from Chapter 5 across
a core boundary instead of just across an interrupt boundary.

!!! mascot-tip "A slow inference must never stall the microphone"
    ![Echo giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The entire reason to burn a second core on this is that a keyword-spotting model's runtime
    can vary from frame to frame in a way raw FFT computation mostly doesn't. Decoupling the two
    means a slightly slow inference costs you a slightly stale wake-word decision — never a
    dropped audio sample, which you can't get back.

MicroPython exposes the RP2350's second core through its `_thread` module; production-grade
wake-word engines more often reach for the C SDK to get tighter timing guarantees on the
inter-core handoff. That's the same abstraction-ladder tradeoff [Chapter
19](../19-the-abstraction-ladder/index.md) already taught you to reason about, now applied one
level higher than a single function.

## Setting Up a Custom Wake Word

A production engine like Porcupine or WakeNet ships with a trigger phrase already trained into
its model. Building your *own* trigger phrase — "Signal Hunter," say, instead of "Alexa" — starts
with a design decision and ends with a data-collection step:

**Choosing a Custom Trigger Phrase.** A good trigger phrase is a design choice, not an
afterthought. Longer, multi-syllable phrases with unusual sound combinations are dramatically
easier to detect reliably than a single short syllable, because there's simply more distinctive
acoustic pattern for the detector to lock onto — and less chance an unrelated word accidentally
contains it. This is a direct, practical consequence of the false-accept-rate discussion above:
the phrase itself is your first and cheapest lever on that tradeoff, before you've written a line
of detection code.

**Wake Word Enrollment.** Once you've picked a phrase, you record it — the same I2S capture from
Chapter 5, repeated 20 to 50 times, ideally by more than one speaker and with some background
noise mixed in. Each recording runs through the identical windowing-and-FFT pipeline this course
already built, producing a short sequence of spectral frames — a time-frequency *fingerprint* of
your phrase, exactly analogous to the single-tone correlation from [Chapter
8](../08-correlation/index.md), just stretched across many frames instead of one.

!!! mascot-thinking "Two ways to turn a fingerprint into a decision"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    There are two honest ways to build the **Keyword Spotting Model** that judges each incoming
    frame sequence against your enrolled fingerprint:

    - **Template correlation** — average your enrollment recordings into one reference pattern,
      then correlate every incoming window against it, the same multiply-and-sum idea from
      Chapter 8, just applied over a sliding sequence of frames instead of one. No external
      toolchain, no training pipeline — it runs entirely inside this course's zero-toolchain
      philosophy.
    - **A small trained neural network** — the approach production engines actually use (see the
      [references](./references.md) for real published numbers from the RP2350 itself). It
      needs an offline training step in Python and a quantized model deployed back to the board,
      but it reliably pushes the false-accept rate much lower for the same false-reject rate.

    Comparing these two approaches honestly — same enrolled phrase, same test recordings, same
    false-accept/false-reject measurement — is exactly the kind of scoped, predict-then-measure
    project [Chapter 26](../26-competing-variants/index.md) and [Chapter
    27](../27-capstone/index.md) already trained you to run.

Running keyword-spotting inference directly on the board, whichever method you choose, is called
**On Device Inference**, and running it forever, in the background, without ever pausing for a
human to press a button, is **Always On Listening** — the operating mode this whole chapter has
been building toward.

## After the Wake Word Fires: Handing Off to the Cloud

A wake word detector only has to answer one yes/no question: *was that the trigger phrase?* Full
speech-to-text is a completely different scale of problem — an open vocabulary, any sentence, any
speaker — and it needs a language model that is hundreds of megabytes, not the few kilobytes a
keyword-spotting model needs. That model has no honest path onto a $5 microcontroller, and it
doesn't need one. The wake word's whole job is to be the cheap, always-on filter that decides
*when* the expensive part is even worth paying for.

Once Core 1 decides the trigger phrase was heard, the board switches modes: instead of throwing
each frame away after the keyword-spotting decision, it starts **Post Wake Audio Capture** —
buffering the next several seconds of raw audio, the same [Audio
Buffer](../05-capturing-real-audio/index.md) mechanism from Chapter 5, just running for longer
and for a different purpose. That buffered clip then gets sent, over the network, to a server
that performs **Cloud Speech To Text** and returns an actual transcription.

| Stage | Where it runs | What it does |
|---|---|---|
| I2S capture, windowing, FFT | Core 0, continuously | Same pipeline as Chapters 5–15 |
| Keyword-spotting decision | Core 1, continuously | Correlation match or on-device inference |
| Post-wake audio buffering | Core 0, only after a trigger | Captures the sentence that follows the wake word |
| Speech-to-text | Remote server, only after a trigger | Turns buffered audio into text |

This pattern — cheap, continuous inference on the edge device, with the expensive, general-purpose
inference reserved for the cloud and invoked only when the edge device says so — is worth naming
on its own: an **Edge Cloud Split**. It's the same "spend your budget where it counts" instinct
this course has applied to CPU cycles all along, now applied to a network call instead of a
clock cycle.

## Why a Pico 2 W, Not a Plain Pico 2

The [course description](../../course-description.md) has said all along that "a Pico 2 **W**
works identically for every lab" — because until now, nothing in this course ever left the board.
Every FFT, every benchmark, every assembly routine ran entirely on-chip. This chapter is the first
place that stops being true: the moment a wake word fires, the board needs to send audio
somewhere else.

That's what **Pico 2 W Wireless** buys you — the W variant adds an onboard Wi-Fi/Bluetooth radio
(an Infineon CYW43439) that the plain Pico 2 simply does not have. For every earlier chapter, the
W was a nice-to-have that cost about two extra dollars and changed nothing. Here, it's the one
piece of hardware this chapter cannot work without.

!!! mascot-warning "Radio time isn't free time"
    ![Echo warning about a common mistake](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    It's tempting to treat the Wi-Fi radio as a background detail that doesn't compete with your
    real-time audio budget. It does — joining a network, managing a TLS connection, and uploading
    a multi-second audio clip all cost real CPU time and RAM, on a chip that is simultaneously
    trying to keep Core 0's sample deadline. Measure it, the way [Chapter
    18](../18-benchmarking-methodology/index.md) insisted you measure everything else. Don't
    assume it's free just because it happens after the interesting part is done.

## Where This Kit Stops — and Where the Full Smart Speaker Begins

It's worth being precise about scope, in the same spirit as [Chapter 27's Project
Scoping](../27-capstone/index.md) discussion. What this chapter describes — a microphone, a
Pico 2 W, on-device wake word detection, and a single audio upload after a trigger — is a **wake
word kit**. It is genuinely just about the microphone.

A real smart speaker product needs a great deal more, none of which this chapter attempts:

- A full speech-to-text and natural-language-understanding pipeline, not just one upload
- Intent parsing and skill routing — turning "set a timer for five minutes" into an actual timer
- A response, which means text-to-speech synthesis and a speaker, not just a microphone
- **Acoustic echo cancellation**, so the device doesn't hear *itself* talking and re-trigger
- Multi-turn conversation state — remembering what "it" referred to a moment ago
- A real backend server, with accounts, security, and far more than a single STT endpoint
- Often, a microphone *array* with beamforming for far-field pickup, rather than one mic

That's an entire second project, with its own hardware, its own backend, and its own course-scale
body of knowledge — not a bigger version of this chapter. This chapter's job was narrower and more
achievable: prove that a $5 (or $7, with the W) chip really can listen for one specific phrase,
continuously, honestly measured, and hand off cleanly to something bigger when it hears it.

!!! mascot-encourage "Scoping down here is the same skill you already learned"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Chapter 27 told you a tightly scoped capstone beats a sprawling one. The exact same
    discipline applies to this chapter's kit: it does one job — wake word detection — and does it
    honestly measured, rather than gesturing vaguely at "building Alexa." That's not a
    consolation prize. It's the right size of problem to actually finish.

??? question "You've built a template-correlation wake word detector and measured its false accept and false reject rates on a test set of recordings. A classmate suggests the natural next step is to add full on-device speech-to-text so the whole system never needs Wi-Fi. Is that a reasonable scope extension? Click to check."
    No — and naming why is good practice for the scoping judgment this course has asked for all
    along. A real speech-to-text language model is hundreds of megabytes, versus the few
    kilobytes a keyword-spotting model needs; there is no honest path to running one on a
    microcontroller-class chip, so this isn't a scope *extension*, it's a different, much larger
    project with its own hardware requirements. A more honest next step, in the spirit of Chapter
    26 and 27, is to rigorously compare your template-correlation detector against a small
    trained neural network on the *same* enrolled phrase and the *same* test recordings — a
    scoped, measurable question that stays inside what this chip can actually do.

## What You've Learned

This chapter took the FFT and correlation skills built across the whole course and pointed them
at a new kind of problem: one that never stops running, has to survive a noisy room, and has to
know when *not* to act as much as when to act. You've seen why that turns into a false-accept/
false-reject tradeoff, how the RP2350's two cores let you decouple "never miss a sample" from
"take your time deciding," how a custom trigger phrase gets enrolled using nothing more exotic
than correlation, and exactly where the line sits between "wake word kit" and "smart speaker."

!!! mascot-celebration "Not bad for a $5 chip that's now also listening"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You're right on frequency. The same board that took a 512-point FFT from 21 seconds down to
    0.59 milliseconds can now sit quietly in a room, listening for exactly one phrase, and only
    speak up when it actually hears it. Time to transform — this time, into something that knows
    when to stay quiet.

[See Annotated References](./references.md)
