# Quiz: Wake Word Detection: Listening for a Trigger Phrase on a Dual-Core Pico 2 W

Test your understanding of the false-accept/false-reject tradeoff, dual-core partitioning, custom
wake word enrollment, and the edge/cloud split with these review questions.

---

#### 1. In a wake word system, what does a high false accept rate mean in practice?

<div class="upper-alpha" markdown>
1. The device frequently fails to respond when the real wake word is spoken
2. The device frequently triggers on audio that was not the wake word
3. The device's microphone has a poor signal-to-noise ratio
4. The device's battery drains faster than expected
</div>

??? question "Show Answer"
    The correct answer is **B**. False accept rate measures how often the detector fires on audio
    that was not the trigger phrase — background noise, other words, or an unrelated sentence
    that happens to sound close enough. A high false accept rate means constant, unwanted
    triggers. Missing the real wake word (A) describes the false reject rate instead.

    **Concept Tested:** False Accept Rate

---

#### 2. Why can't a wake word system simply be tuned to drive both false accepts and false rejects to zero at the same time?

<div class="upper-alpha" markdown>
1. Because the RP2350 does not have enough RAM to store both metrics simultaneously
2. Because false accept rate and false reject rate move in opposite directions as the detection threshold changes — tightening one loosens the other
3. Because false rejects only happen on a plain Pico 2, never on a Pico 2 W
4. Because only one of the two metrics can be measured using recorded test audio
</div>

??? question "Show Answer"
    The correct answer is **B**. Making the detector stricter reduces false accepts but increases
    false rejects, and loosening it does the reverse — the two trade against each other along a
    single operating-point curve, which is why commercial engines publish a specific tuned
    tradeoff rather than claiming both numbers are zero.

    **Concept Tested:** False Reject Rate

---

#### 3. What is the purpose of splitting wake word processing across the RP2350's two Cortex-M33 cores?

<div class="upper-alpha" markdown>
1. To run two independent wake word phrases at the same time
2. To let one core handle I2S capture and FFT feature extraction on a strict schedule, while the other runs the keyword-spotting decision, whose runtime can vary from frame to frame
3. To double the clock speed available to the FFT computation
4. To allow one core to run MicroPython while the other runs a different programming language
</div>

??? question "Show Answer"
    The correct answer is **B**. Audio capture cannot ever miss a sample deadline, but a
    keyword-spotting decision's runtime can vary. Dual core partitioning puts the schedule-critical
    capture-and-FFT pipeline on one core and the variable-length inference decision on the other,
    so a slow inference frame never causes a dropped audio sample.

    **Concept Tested:** Dual Core Partitioning

---

#### 4. What role does inter-core communication play in this chapter's dual-core design?

<div class="upper-alpha" markdown>
1. It lets the inference core directly control the I2S microphone hardware
2. It hands a completed feature frame from the capture core to the inference core without either core blocking on the other
3. It synchronizes the clock speeds of both cores so they run in lockstep
4. It compresses audio data before it is sent over Wi-Fi
</div>

??? question "Show Answer"
    The correct answer is **B**. A small ring buffer or the RP2350's inter-core FIFO passes each
    finished feature frame from the capture core to the inference core, extending the same audio
    buffering idea from Chapter 5 across a core boundary — decoupling the two cores' timing from
    each other rather than forcing them to run in strict lockstep.

    **Concept Tested:** Inter Core Communication

---

#### 5. When choosing a custom trigger phrase, why is a longer, multi-syllable phrase generally preferred over a single short syllable?

<div class="upper-alpha" markdown>
1. Longer phrases take less time to enroll
2. Longer, more distinctive phrases give the detector more acoustic pattern to lock onto, reducing the chance an unrelated word is mistaken for the trigger
3. The RP2350's FFT can only process phrases longer than one syllable
4. Longer phrases automatically reduce the false reject rate to zero
</div>

??? question "Show Answer"
    The correct answer is **B**. A longer, more distinctive phrase has more spectral-temporal
    pattern for the detector to match against, which directly lowers the odds that some unrelated
    sound accidentally resembles it closely enough to trigger a false accept — the phrase choice
    itself is the cheapest lever on that tradeoff, before any detection code is written.

    **Concept Tested:** Custom Trigger Phrase

---

#### 6. What happens during wake word enrollment?

<div class="upper-alpha" markdown>
1. The device is connected to Wi-Fi for the first time
2. Several recordings of the chosen trigger phrase are captured and run through windowing and FFT to build a reference spectral-temporal fingerprint
3. The RP2350's second core is permanently disabled to save power
4. A cloud speech-to-text server is configured with a new user account
</div>

??? question "Show Answer"
    The correct answer is **B**. Enrollment records the trigger phrase multiple times (ideally
    from more than one speaker, with some background noise), runs each recording through the same
    windowing-and-FFT pipeline built earlier in the course, and produces a reference fingerprint
    that later incoming audio is compared against — either by correlation or by a trained model.

    **Concept Tested:** Wake Word Enrollment

---

#### 7. Why does this chapter argue that full speech-to-text should run in the cloud rather than on the Pico 2 itself?

<div class="upper-alpha" markdown>
1. Cloud servers are always faster than any microcontroller, regardless of the task
2. A full speech-to-text language model is hundreds of megabytes, while a keyword-spotting model needs only kilobytes — there is no honest path to running open-vocabulary transcription on a microcontroller-class chip
3. The Pico 2 W's Wi-Fi radio cannot transmit audio data, only text
4. Running speech-to-text on-device would violate the wake word's false accept rate requirement
</div>

??? question "Show Answer"
    The correct answer is **B**. Wake word detection is a narrow yes/no decision that fits in a
    tiny model; full speech-to-text handles an open vocabulary and needs a language model far
    beyond what a $5-class chip can hold or run. The edge device's job is to be the cheap,
    always-on filter that decides when the expensive cloud step is worth invoking at all.

    **Concept Tested:** Cloud Speech To Text

---

#### 8. What does this chapter mean by an "edge/cloud split," and why does the Pico 2 need to be the **W** variant to implement it?

<div class="upper-alpha" markdown>
1. It means running half the FFT on the edge device and half in the cloud; the W variant has a faster CPU needed for this split
2. It means keeping cheap, continuous wake-word inference on-device and reserving expensive, general-purpose inference for the cloud, invoked only after a trigger; the W variant is needed because it is the first point in the course where the board must send data over a network, which requires the W's onboard Wi-Fi radio
3. It means splitting the audio buffer in half between the two cores; the W variant has twice the RAM of a plain Pico 2
4. It means alternating between edge and cloud processing every other frame; the W variant is required because only it supports dual-core operation
</div>

??? question "Show Answer"
    The correct answer is **B**. The edge/cloud split keeps continuous, cheap inference on the
    board and only pays for an expensive cloud call after a local trigger fires. Every earlier
    chapter in this course ran entirely on-chip, so a plain Pico 2 was always sufficient; this
    chapter is the first to send audio off the board, which needs the Wi-Fi radio only the Pico 2
    W has. (Both Pico 2 and Pico 2 W share the same dual-core RP2350 and RAM, ruling out C and D.)

    **Concept Tested:** Edge Cloud Split

---
