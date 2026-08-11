# Quiz: Capturing Real Audio: The I2S Microphone

Test your understanding of turning real sound into a digital audio buffer over the I2S protocol with these review questions.

---

#### 1. What is an analog signal?

<div class="upper-alpha" markdown>
1. A signal represented using discrete, distinct values encoded as 1s and 0s
2. A signal that only exists inside a MEMS microphone's internal ASIC
3. A signal that varies smoothly and continuously over time, capable of taking on any value within its range
4. A signal that has already been quantized to a fixed bit depth
</div>

??? question "Show Answer"
    The correct answer is **C**. An analog signal varies smoothly and continuously, capable of taking on any value within its range, with no smallest possible step — the voltage coming directly off a microphone's sensing element is analog. Option A instead describes a digital signal, which represents information using discrete, distinct values that a computer can actually store.

    **Concept Tested:** Analog Signals

---

#### 2. What distinguishes the INMP441 microphone from a simpler analog microphone?

<div class="upper-alpha" markdown>
1. It requires an external analog-to-digital converter chip on the breadboard to digitize sound
2. It combines a microscopic diaphragm and an analog-to-digital converter on a single chip, outputting a digital bitstream directly with no separate ADC chip required
3. It can only capture sound above the Nyquist frequency
4. It outputs sound as a raw continuous voltage, identical to a decades-old telephone microphone
</div>

??? question "Show Answer"
    The correct answer is **B**. The INMP441, a MEMS microphone, digitizes sound internally on the same chip as its sensing diaphragm, outputting a digital bitstream directly — unlike cheaper microphones, which output a raw analog voltage that a separate ADC chip elsewhere on the board must digitize. This is why no extra digitizing hardware is needed on the breadboard.

    **Concept Tested:** MEMS Microphone

---

#### 3. Why does the I2S protocol require three separate signal lines instead of just one?

<div class="upper-alpha" markdown>
1. Because a single wire cannot physically carry any electrical current
2. Because I2S is designed to transmit video as well as audio, and each wire handles one color channel
3. Because the word select line alone is sufficient, and the other two wires exist only for backward compatibility
4. Because audio bits must arrive in the right order, at the right rate, and correctly grouped into left/right channel samples — jobs split across the bit clock (timing), the word select line (channel), and the serial data line (payload)
</div>

??? question "Show Answer"
    The correct answer is **D**. I2S divides its job across three lines, each with one clear responsibility: the bit clock says *when* to read each bit, the word select line says *which channel* a bit belongs to, and the serial data line carries *what value* each bit holds. None of that structural information is encoded directly in the data itself — timing across all three wires carries the meaning.

    **Concept Tested:** I2S Protocol

---

#### 4. Given the code `num_bytes_read = audio_in.readinto(audio_buffer)`, what does this line accomplish?

<div class="upper-alpha" markdown>
1. It performs a buffered read, filling the pre-allocated `audio_buffer` with multiple raw sample bytes from the I2S peripheral in one operation, rather than reading one sample at a time
2. It permanently writes the captured audio to the device filesystem as a `.wav` file
3. It configures the I2S peripheral's sample rate and bit depth for the first time
4. It converts the raw audio bytes directly into a frequency-domain spectrum
</div>

??? question "Show Answer"
    The correct answer is **A**. `readinto()` performs a buffered read: it fills the `audio_buffer` bytearray with raw sample bytes straight off the I2S serial data line in a single operation and returns the number of bytes actually captured. It does not save a file, configure the peripheral (that happens when the `I2S` object is constructed), or perform any frequency-domain analysis.

    **Concept Tested:** Buffered Read

---

#### 5. Why does MicroPython's I2S class fill an entire buffer in one `readinto()` call rather than returning samples one at a time?

<div class="upper-alpha" markdown>
1. Because a microcontroller can only store one sample in memory at any given moment
2. Because reading one sample at a time would require the buffer to be stored in flash instead of RAM
3. Because the INMP441 microphone physically refuses to send fewer than 2,000 bytes per request
4. Because reading samples one by one would be far too slow to keep up with continuous audio; a buffered read lets the hardware and driver do the repetitive work while your code processes a whole chunk at once
</div>

??? question "Show Answer"
    The correct answer is **D**. An audio buffer is a region of memory that temporarily holds a sequence of samples, allowing many to be read and processed together. Filling it in one buffered read is dramatically more efficient than issuing a separate read call per sample, because continuous audio arrives far faster than one-at-a-time reads could keep up with.

    **Concept Tested:** Audio Buffer

---

#### 6. A sensor's datasheet states its output pin carries "a stream of binary values, ready for a microcontroller to read directly with no extra conversion hardware." Based on this chapter, what kind of output is this sensor providing?

<div class="upper-alpha" markdown>
1. An analog signal requiring an external ADC before use
2. A digital microphone output — already digitized on-chip, unlike sensors that output raw analog voltage requiring a separate digitizing chip
3. A DC component that must be filtered before sampling
4. An I2S word select signal only, with no actual sample data
</div>

??? question "Show Answer"
    The correct answer is **B**. A digital microphone output represents audio as a stream of binary values rather than a continuously varying voltage, ready for a microcontroller to read directly — exactly what the INMP441 provides because it digitizes internally. An analog signal, by contrast, would still need external conversion hardware before a microcontroller could use it.

    **Concept Tested:** Digital Microphone Output

---

#### 7. What does the Thonny Plotter provide that a plain scrolling text console of printed numbers does not?

<div class="upper-alpha" markdown>
1. It automatically applies a Discrete Fourier Transform to any printed values
2. It records printed values permanently to the device filesystem for later analysis
3. It graphs numeric values printed by a running MicroPython program in real time, turning `print()` output into a live scrolling line chart with no extra code required
4. It replaces the need for an I2S microphone entirely by simulating audio input
</div>

??? question "Show Answer"
    The correct answer is **C**. The Thonny Plotter turns a stream of `print()` output into a live scrolling line chart, letting a captured sound's waveform appear visually with no extra plotting code required. It performs no frequency-domain transform, does not persist data to the filesystem, and has nothing to do with simulating input — it only visualizes numbers already being printed.

    **Concept Tested:** Thonny Plotter

---

#### 8. What is the specific job of the I2S word select line?

<div class="upper-alpha" markdown>
1. It indicates which audio channel — left or right — the current data word belongs to, typically staying low during the left channel and high during the right channel
2. It carries the actual digitized audio sample bits
3. It supplies the timing pulse for every single bit transmitted
4. It sets the sampling rate used by the microphone
</div>

??? question "Show Answer"
    The correct answer is **A**. The word select line (WS or LRCLK) indicates which channel — left or right — the current data word belongs to, by convention staying low during the left channel's bits and high during the right channel's. Carrying the payload bits is the serial data line's job, and supplying the bit-by-bit timing pulse is the bit clock's job.

    **Concept Tested:** Word Select Line

---

#### 9. A lab has students play a tone above a frequency limit the course has not yet named, and the instrument confidently reports a completely wrong frequency. According to this chapter's productive failure approach, what is the correct response to this result?

<div class="upper-alpha" markdown>
1. Assume the wiring is faulty and re-solder every connection before continuing
2. Conclude the instrument is broken and replace the microphone
3. Ignore the result entirely, since a wrong-looking number provides no useful information
4. Recognize that the confidently wrong result is not a bug but the direct, predictable consequence of a hardware limit not yet named — and that examining why the failure happened is how the underlying concept gets learned
</div>

??? question "Show Answer"
    The correct answer is **D**. Productive failure deliberately has students first attempt a task in a way that predictably fails, then learn the underlying concept — in this case, a sampling limit the next chapter names explicitly — by examining why the failure happened, rather than being told the correct approach up front. Reflexively re-wiring or replacing hardware misses the actual lesson.

    **Concept Tested:** Productive Failure

---

#### 10. A digital signal is described in this chapter as representing information using "discrete, distinct values." What practical consequence does this have compared to the continuously varying analog voltage coming directly off a microphone's sensing element?

<div class="upper-alpha" markdown>
1. Digital signals can represent infinitely many possible values, exactly like analog signals, so there is no practical difference
2. Every value a digital system stores has been rounded to one of a fixed set of possible numbers, no matter how smoothly the original analog sound actually continued to vary in between them
3. Digital signals are only used for storing video, never audio
4. Digital signals eliminate the need for any analog-to-digital conversion process
</div>

??? question "Show Answer"
    The correct answer is **B**. A digital signal represents information using a discrete, distinct set of possible values, so every stored value has been rounded to the nearest one of those values — even though the sound in the room continues to vary smoothly in between. This rounding is precisely why analog-to-digital conversion is the bridge between the physical world and everything a program later computes.

    **Concept Tested:** Digital Signals
