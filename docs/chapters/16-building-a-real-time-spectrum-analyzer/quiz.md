# Quiz: Building a Real-Time Spectrum Analyzer

Test your understanding of assembling capture, FFT, and display into a continuously running spectrum analyzer with these review questions.

---

#### 1. What is a spectrum analyzer, as defined in this chapter?

<div class="upper-alpha" markdown>
1. A complete, integrated system that continuously captures audio, transforms it into a spectrum, and displays the result in near real time
2. A single one-shot FFT computation run on a static, pre-recorded buffer
3. A hardware peripheral dedicated exclusively to measuring clock cycles
4. A display mode that shows only the phase spectrum instead of magnitude
</div>

??? question "Show Answer"
    The correct answer is **A**. A spectrum analyzer combines every piece this course has built — capture, FFT, windowing, magnitude calculation, and display — into one continuously running whole. Sustaining this indefinitely without falling behind the incoming audio stream is real-time processing, and applying it continuously to a live stream (rather than one isolated capture) is what this chapter calls sound processing.

    **Concept Tested:** Spectrum Analyzer

---

#### 2. What is block processing, as used by this course's real-time pipeline?

<div class="upper-alpha" markdown>
1. Processing audio one individual sample at a time, reacting immediately to each new value
2. Processing audio only after the entire recording has finished
3. Processing audio in discrete, fixed-size chunks of N samples at a time, rather than reacting to each sample separately
4. Processing audio exclusively in the frequency domain, never in the time domain
</div>

??? question "Show Answer"
    The correct answer is **C**. Block processing works on fixed-size frames of N samples rather than reacting to each individual sample, the same frame-capture idea from earlier chapters now serving as the standing operating procedure for a continuously running system. How many complete capture-transform-display cycles this produces per second is the frame rate — the directly perceptible measure of how "live" the display feels.

    **Concept Tested:** Block Processing

---

#### 3. Why does this chapter's real-time pipeline use double buffering instead of a single buffer?

<div class="upper-alpha" markdown>
1. A single buffer uses less memory, so double buffering is only needed for FFT sizes above 1024
2. Double buffering doubles the effective sampling rate of the microphone
3. Double buffering eliminates the need for buffer swapping between cycles
4. Double buffering lets one buffer be filled with new samples by capture while the other, already full, is simultaneously processed and displayed — so capture never has to pause and wait for processing
</div>

??? question "Show Answer"
    The correct answer is **D**. Double buffering uses two separate buffers so capture and processing run concurrently instead of taking turns. At the end of each cycle, buffer swapping exchanges the two buffers' roles: the one just filled becomes available for processing while the one just processed becomes available to be filled again — preventing the dropped samples a naive single-buffer loop would cause.

    **Concept Tested:** Double Buffering

---

#### 4. What happens when a real-time pipeline uses a hop size smaller than the frame size?

<div class="upper-alpha" markdown>
1. The FFT no longer needs to satisfy the power-of-two constraint
2. Consecutive frames share some of the same samples, producing overlap processing — more frequent spectrum updates at the cost of recomputing the FFT over some samples more than once
3. The pipeline switches from a streaming FFT to a single, one-shot FFT
4. Frame duration increases proportionally to how much the hop size shrinks
</div>

??? question "Show Answer"
    The correct answer is **B**. The hop size is the number of new samples the pipeline advances between processed frames. When it is smaller than the frame size, consecutive frames overlap, giving overlap processing — a smoother, more frequent update rate at the cost of extra recomputation, all carried out by the continuously running streaming FFT.

    **Concept Tested:** Hop Size

---

#### 5. A pipeline uses a 512-sample frame size, a 16,000 Hz sampling rate, and a hop size of 256 samples (50% overlap). Approximately how many spectrum updates occur per second?

<div class="upper-alpha" markdown>
1. ~62.5 updates per second
2. ~31 updates per second
3. ~125 updates per second
4. ~16,000 updates per second
</div>

??? question "Show Answer"
    The correct answer is **A**. With overlap processing, updates per second equal the sampling rate divided by the hop size: 16,000 / 256 ≈ 62.5 updates per second. Halving the hop size from the full 512-sample frame roughly doubles the update rate compared to non-overlapping block processing, which would update only about 31 times per second (16,000 / 512).

    **Concept Tested:** Overlap Processing

---

#### 6. Stage profiling on this course's actual pipeline measures capture time at roughly 1%, compute time at roughly 66%, and draw time filling the remainder. Using bottleneck identification, which stage should be optimized first?

<div class="upper-alpha" markdown>
1. Capture time, since it is measured first in each cycle
2. Draw time, since it is the most visually obvious part of the code
3. All three stages equally, since they together make up 100% of the cycle
4. Compute time, since it consumes the largest share of total pipeline time by a wide margin
</div>

??? question "Show Answer"
    The correct answer is **D**. Bottleneck identification uses stage profiling's separated capture time, compute time, and draw time measurements to find which stage dominates. At roughly 66% of every frame, compute time is this pipeline's clear bottleneck — improving capture or draw time first would barely move the total while compute time remains untouched.

    **Concept Tested:** Bottleneck Identification

---

#### 7. If capture time, at 1% of a frame, were somehow reduced to exactly 0%, roughly how much would total frame time improve?

<div class="upper-alpha" markdown>
1. About 66%, since capture feeds directly into compute time
2. About 50%, since capture and draw time are roughly equal
3. About 1%, since capture was already a tiny fraction of the total and the 66% compute-time bottleneck remains untouched
4. About 99%, since eliminating any stage entirely removes nearly all overhead
</div>

??? question "Show Answer"
    The correct answer is **C**. Stage profiling exists precisely to prevent this mistake: optimizing the smallest-share stage feels productive but barely moves the total. Since capture time was already only about 1% of a frame, eliminating it entirely would improve total frame time by only about 1%, leaving the 66% compute-time bottleneck completely unaddressed.

    **Concept Tested:** Stage Profiling

---

#### 8. What does a waterfall display specifically add to a basic spectrogram visualization?

<div class="upper-alpha" markdown>
1. It replaces frequency and time axes with amplitude and phase axes instead
2. It presents the spectrogram so new spectra continuously scroll onto the display from one edge while older spectra scroll off the opposite edge
3. It removes the need for magnitude calculation before plotting
4. It only displays a single frozen spectrum snapshot, never a continuous stream
</div>

??? question "Show Answer"
    The correct answer is **B**. A spectrogram is a two-dimensional visualization plotting frequency against time, built by stacking a stream of individual spectra. A waterfall display is a specific, commonly used way of showing that spectrogram live: new spectra scroll continuously onto one edge while older ones scroll off the other, creating the visual impression of data flowing like a waterfall.

    **Concept Tested:** Waterfall Display

---

#### 9. A developer wants to increase overlap processing further, shrinking the hop size even more, to make the display feel smoother. What is the direct cost of this choice, given the real-time budget?

<div class="upper-alpha" markdown>
1. The FFT's algorithmic complexity increases from O(N log N) to O(N²)
2. The frame size must also shrink, reducing frequency resolution
3. Streaming FFT can no longer be used once hop size drops below the frame size
4. The number of FFTs computed per second rises proportionally, consuming more of the same real-time budget every cycle must still meet
</div>

??? question "Show Answer"
    The correct answer is **D**. Real-time processing means keeping pace with incoming data indefinitely, within a fixed budget per cycle. Shrinking the hop size increases how often the streaming FFT runs, so more FFTs must be computed per second — a direct trade against the real-time budget, not a free improvement in smoothness, since the algorithm's complexity class and frame size are unaffected.

    **Concept Tested:** Real Time Processing

---

#### 10. A pipeline's stage profiling reports capture time = 0.3 ms, compute time = 20 ms, and draw time = 9.7 ms per cycle. What is the resulting frame rate, assuming no other overhead?

<div class="upper-alpha" markdown>
1. ~33 frames per second
2. ~300 frames per second
3. ~3.3 frames per second
4. ~100 frames per second
</div>

??? question "Show Answer"
    The correct answer is **A**. The frame rate is the number of complete cycles per second. Total cycle time is 0.3 + 20 + 9.7 = 30 ms, and 1,000 ms divided by 30 ms gives approximately 33 frames per second. This calculation directly uses stage profiling's separated capture time, compute time, and draw time figures, the same three measurements block processing's cycle is built from.

    **Concept Tested:** Frame Rate

