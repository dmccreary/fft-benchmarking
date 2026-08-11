# Quiz: Capstone: Applications, Design, and Reporting

Test your understanding of capstone project scoping, experimental design, report structure, and honest reporting with these review questions.

---

#### 1. What must a well-formed research question for a capstone project be, according to this chapter?

<div class="upper-alpha" markdown>
1. Broad enough to cover an entire application domain, such as "is windowing good?"
2. Phrased as a yes/no prediction about whether the student will finish the project on time
3. Written only after all data has been collected, to ensure it matches the results
4. Precisely stated and answerable with a measurement, such as "does applying a Hann window improve peak-frequency accuracy, compared to no window, when detecting a 3.2 kHz tone in a signal with added noise?"
</div>

??? question "Show Answer"
    The correct answer is **D**. A rigorous experimental design starts from a single, precisely stated research question answerable with a measurement, not a vague sentiment like "is windowing good?" This is exactly the standard a capstone project's research question must meet before any signal is captured or measured. Writing the question after seeing the data (C) inverts the course's prediction-before-measurement discipline entirely.

    **Concept Tested:** Research Question

---

#### 2. What does a capstone report's limitations statement do?

<div class="upper-alpha" markdown>
1. It lists every optimization technique the student considered but chose not to implement
2. It restates the research question in past tense
3. It states plainly what the experiment did not control for, test, or rule out, so a reader knows exactly how far to trust the conclusion
4. It apologizes for any part of the project that did not go as planned
</div>

??? question "Show Answer"
    The correct answer is **C**. A limitations statement is the capstone-scale version of Chapter 18's "what a benchmark excludes" — it states plainly what the experiment did not control for, test, or rule out. Far from a confession of weakness, it tells a reader exactly how far to trust the conclusion, which is precisely what separates a scientific report from a sales pitch.

    **Concept Tested:** Limitations Statement

---

#### 3. In the research question "does applying a Hann window improve peak-frequency accuracy, compared to no window, when detecting a 3.2 kHz tone in noisy audio, at 150 MHz on a Pico 2, with a fixed 512-point FFT size," which pairing of independent and dependent variable is correct?

<div class="upper-alpha" markdown>
1. Independent variable: FFT size; dependent variable: clock speed
2. Independent variable: window type (Hann vs. none); dependent variable: peak-frequency accuracy (error)
3. Independent variable: peak-frequency accuracy; dependent variable: window type
4. Independent variable: board model; dependent variable: FFT size
</div>

??? question "Show Answer"
    The correct answer is **B**. The independent variable is the one condition deliberately changed across trials — window type here — and the dependent variable is the outcome measured in response — peak-frequency estimation error. FFT size, clock speed, and board model are all held fixed as controlled variables in this question, exactly as Chapter 26 describes, so any change in the dependent variable can be attributed to window choice alone.

    **Concept Tested:** Independent Variable

---

#### 4. How do a methodology section and a results presentation section differ in a capstone report?

<div class="upper-alpha" markdown>
1. The methodology section describes how the experiment was conducted in enough detail to reproduce it; the results presentation reports what was measured, without interpretation mixed in
2. The methodology section reports raw data tables; the results presentation describes the hardware used
3. They are two names for the same section, required only for word-count purposes
4. The methodology section interprets the results; the results presentation states the original research question
</div>

??? question "Show Answer"
    The correct answer is **A**. The methodology section states the research question, variables, benchmark suite, hardware, and exact procedure in enough detail for someone else to reproduce the results, per Chapter 18's reproducibility standard. The results presentation reports tables and charts of what was actually measured, deliberately without interpretation. Both are pieces of the larger report generation process, which assembles methodology, results, limitations, and conclusion into one coherent document.

    **Concept Tested:** Methodology Section

---

#### 5. A student's initial capstone idea is "build a production-quality noise-cancellation headset." Applying this chapter's project scoping guidance, which revised version is the most defensible scoped capstone question?

<div class="upper-alpha" markdown>
1. "Build a noise-cancellation headset that works as well as a commercial product" — since ambition demonstrates mastery of the material
2. "Research everything ever published about noise cancellation" — since broader background research always strengthens a report
3. "Cancel noise" — since a short title is easier for a peer reviewer to evaluate
4. "Measure how accurately a windowed FFT can identify a single dominant noise frequency in a recorded fan hum, and how that accuracy changes with window choice" — a specific, measurable question achievable within one to three weeks
</div>

??? question "Show Answer"
    The correct answer is **D**. Project scoping narrows a broad application area, like noise cancellation, down to a specific, achievable question that fits the available time and hardware. This chapter's grading philosophy explicitly rewards methodology and honesty over raw ambition — a tightly scoped, rigorously measured project earns more credit than a sprawling, unclear one, even one as compelling in concept as a full noise-cancellation headset.

    **Concept Tested:** Project Scoping

---

#### 6. A student wants to build a capstone project analyzing accelerometer data from a spinning fan to detect an early sign of bearing wear before it becomes an audible problem. Which of this chapter's six application domains does this project most directly extend, and which earlier course skill does it rely on?

<div class="upper-alpha" markdown>
1. Software defined radio, relying on Chapter 16's live spectrum analyzer tuned to radio frequencies
2. Machine monitoring (vibration analysis), relying on Chapter 15's peak-detection skills applied to accelerometer data, since specific spectrum frequencies correspond to specific mechanical faults
3. Voice recognition, relying on Chapter 15's windowing applied to human speech
4. Communication systems, relying on OFDM modulation to decode the accelerometer signal
</div>

??? question "Show Answer"
    The correct answer is **B**. Machine monitoring, also called vibration analysis in industrial contexts, applies the FFT to accelerometer data from rotating machinery, where specific frequencies in the spectrum correspond to specific mechanical faults like bearing wear or shaft imbalance — a direct extension of Chapter 15's peak-detection skills. Voice recognition and software defined radio apply the same windowing and spectral-analysis foundation to unrelated signals (speech and radio), and radar processing and communication systems (OFDM demodulation) target range/velocity extraction and time-versus-frequency-domain conversion respectively, neither of which fits a spinning fan's accelerometer data.

    **Concept Tested:** Machine Monitoring

---

#### 7. A capstone measures whether a Hann window improves peak-frequency accuracy using exactly one recorded fan hum, tested once, with no other noise levels or tone frequencies. Applying this chapter's benchmark suite concept, what is the most significant weakness in this design?

<div class="upper-alpha" markdown>
1. A single test condition cannot show whether the result generalizes across different noise levels or frequencies; a benchmark suite of several representative signals and conditions is needed to properly support the research question
2. Nothing is wrong; one representative test signal is sufficient for any research question
3. The weakness is that a fan hum is not a periodic signal, so an FFT cannot be applied to it at all
4. The weakness is that Hann windowing requires a dedicated hardware coprocessor this course's board does not have
</div>

??? question "Show Answer"
    The correct answer is **A**. A benchmark suite is a curated, reusable collection of representative test signals and conditions — several noise levels, several tone frequencies, several window functions — built once and run consistently across every trial, extending Chapter 18's single-test harness into a full, repeatable evaluation set. Testing a research question properly rarely means running just one signal once; a single trial cannot demonstrate that a result generalizes beyond that one specific condition.

    **Concept Tested:** Benchmark Suite

---

#### 8. During peer review, a classmate points out that a capstone's "after" measurements were all taken on a warmer day than the "before" measurements, and ambient temperature was never listed as a controlled variable. What is the analytically correct response?

<div class="upper-alpha" markdown>
1. Ignore the comment, since ambient temperature cannot plausibly affect a microcontroller's execution speed
2. Delete the peer reviewer's comment from the report, since acknowledging it would weaken the conclusion
3. Add ambient temperature as an unstated controlled variable to the limitations statement, and, if time allows, rerun the comparison with temperature controlled to check whether the result holds
4. Recompute the original hypothesis to match whatever the data already shows, so the report appears consistent
</div>

??? question "Show Answer"
    The correct answer is **C**. Peer review exists to catch unstated assumptions and missed controlled variables that are difficult to see in one's own work. The right response is to disclose the gap honestly in the limitations statement and, time permitting, rerun the measurement with the variable controlled — not to dismiss the reviewer, hide the comment, or quietly revise the hypothesis to match already-observed data, which is the one genuinely unacceptable move this course identifies.

    **Concept Tested:** Peer Review

---

#### 9. Two capstone reports reach the review stage. Report A shows a clean 15% speedup, includes no limitations statement, and does not disclose sample size or board revision. Report B shows a smaller, inconclusive result, includes a full methodology section, a limitations statement naming three untested conditions, and an honest conclusion stating the hypothesis was not clearly supported. Which report better satisfies this course's grading standard, and why?

<div class="upper-alpha" markdown>
1. Report A, because a larger measured speedup is always more valuable than an inconclusive result, regardless of what was disclosed
2. Neither report can be evaluated without seeing the exact source code, since grading depends only on implementation correctness
3. Report A, because omitting a limitations statement demonstrates the student's confidence in a clean result
4. Report B, because honest reporting of a negative or inconclusive result, with full methodology and disclosed limitations, is treated as equal in value to a positive result under this course's standard, while Report A's missing methodology and limitations make its conclusion untrustworthy
</div>

??? question "Show Answer"
    The correct answer is **D**. This course closes on the same principle it opened with: a negative or inconclusive result, honestly reported and explained, is a completely successful outcome, exactly as valuable as a positive one. Report B's conclusion drawing follows its evidence and discloses what it did not establish; Report A's missing methodology and limitations statement leave its impressive-looking 15% number unverifiable and untrustworthy, regardless of its size.

    **Concept Tested:** Conclusion Drawing

---

#### 10. You are designing an experimental design for a capstone testing whether increasing FFT size from 256 to 1024 points changes the peak-frequency detection accuracy for a synthesized 1 kHz tone buried in white noise. Which combination of research question, independent variable, and dependent variable best fits this course's experimental design structure?

<div class="upper-alpha" markdown>
1. Research question: "Is a bigger FFT always better?" Independent variable: noise color. Dependent variable: FFT size.
2. Research question: "Does increasing FFT size from 256 to 1024 points improve peak-frequency detection accuracy for a 1 kHz tone in white noise?" Independent variable: FFT size (256 vs. 1024). Dependent variable: peak-frequency detection accuracy (error).
3. Research question: "How fast is the FFT?" Independent variable: board clock speed. Dependent variable: FFT size.
4. Research question: "Does peak-frequency accuracy affect FFT size?" Independent variable: peak-frequency accuracy. Dependent variable: FFT size.
</div>

??? question "Show Answer"
    The correct answer is **B**. A sound experimental design pairs a precise, testable research question with exactly one deliberately varied independent variable (FFT size, 256 vs. 1024) and one measured outcome, the dependent variable (peak-frequency detection accuracy). Option A mismatches its stated variable of interest, C asks an unrelated question about speed rather than accuracy, and D reverses cause and effect by treating accuracy as something that is manipulated rather than measured.

    **Concept Tested:** Experimental Design

---
