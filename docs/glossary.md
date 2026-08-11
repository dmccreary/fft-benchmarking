# Glossary of Terms

This glossary defines the 550 concepts used throughout the Benchmarking FFT course, following ISO 11179 metadata registry guidelines: each definition is precise, concise, distinct, non-circular, and free of business rules.

#### Absolute Error

The plain numeric difference between a computed value and its true or expected value, without regard to the expected value's own size.

**Example:** An Absolute Error of 0.0003 in a DFT bin magnitude is well within the test's Numerical Tolerance.

#### Abstraction Cost

The performance penalty paid for using a higher-level, more convenient programming construct instead of a lower-level, more direct one.

**Example:** Comparing standard MicroPython, the Native Code Emitter, the Viper Code Emitter, and hand-written ARM assembly on the same FFT quantifies the Abstraction Cost at each rung of the Abstraction Ladder.

#### Abstraction Ladder

The conceptual ordering of implementation approaches from highest-level to lowest-level, from plain MicroPython through the Native Code Emitter and Viper Code Emitter to hand-written Inline Assembler.

**Example:** The course's benchmarking arc climbs down the Abstraction Ladder one rung at a time, measuring Speedup Factor at each step.

#### Active Low Logic

A convention in which a signal is considered "active" or "pressed" when its Logic Level is low (0) rather than high (1).

**Example:** A Push Button Component wired with a Pull Up Resistor uses Active Low Logic, so the code checks for a `0` reading to detect a press.

#### Add Instruction

An ARM assembly instruction (ADD) that computes the sum of two register values, or a register and an immediate constant, storing the result in a destination register.

**Example:** An Add Instruction implements the addition half of the Cross Add And Subtract step inside a hand-written Butterfly Operation.

#### Additive Synthesis

A sound-generation technique that builds a complex waveform by summing multiple simple sinusoids, each with its own frequency, amplitude, and Phase Offset.

**Example:** Additive Synthesis of a Fundamental Frequency plus several Overtone components approximates the Timbre of a simple musical instrument.

#### Address Computation Cost

The processing time spent computing a Memory Address via Pointer Arithmetic before a Load Store Architecture instruction can actually access data.

**Example:** Address Computation Cost inside the innermost Stage Loop can rival the cost of the Butterfly Operation's actual arithmetic if not carefully minimized.

#### Address Of Buffer

The starting Memory Address of an array or buffer object, obtained in MicroPython to pass into an Assembly Decorator function for direct memory access.

**Example:** MicroPython's `uctypes.addressof()` returns the Address Of Buffer needed to give an Inline Assembler routine direct access to an Audio Buffer.

#### Algebra Of Sine And Cosine

The set of trigonometric identities, such as sum and difference formulas, that describe how sine and cosine terms combine, underlying derivations like the Butterfly Operation.

**Example:** The Algebra Of Sine And Cosine explains why splitting the DFT sum into even and odd terms leads directly to the Cooley-Tukey Algorithm.

#### Algorithmic Complexity

A characterization of how the number of operations an algorithm performs grows as its input size increases, commonly expressed with Big O Notation.

**Example:** Comparing the Algorithmic Complexity of the DFT and FFT explains why the FFT becomes dramatically faster as transform size N grows.

#### Aliasing

A distortion in which frequency content above the Nyquist Frequency is misrepresented as a lower, false frequency after sampling, because the sampling process cannot distinguish them.

**Example:** Undersampling a 30 kHz tone at a 44.1 kHz rate risks Aliasing it down into an audible but incorrect frequency in the captured spectrum.

#### Amdahl's Law

A formula describing the maximum overall speedup achievable by optimizing only one part of a system, limited by the fraction of total time that part originally consumed.

**Example:** Amdahl's Law explains why fully eliminating Draw Time yields little overall Speedup Factor if Draw Time was already a small fraction of the total Frame Duration.

#### Amplitude Envelope

A curve describing how a signal's overall amplitude rises and falls over time, independent of its faster oscillation within each cycle.

**Example:** A plucked-string synthesis model applies an Amplitude Envelope that decays exponentially after the initial attack.

#### Amplitude Normalization

The process of scaling a signal's sample values by a fixed factor, often relative to its Full Scale Value, so its range fits a desired target before further processing.

**Example:** Amplitude Normalization divides raw 16-bit samples by 32768 so the FFT input ranges from -1.0 to 1.0.

#### Amplitude Parameter

A variable specifying the peak height of a synthesized or analyzed sinusoid, one of the three defining values (with Frequency Parameter and Phase Offset) of a sine wave.

**Example:** Doubling the Amplitude Parameter of a synthesized test tone doubles the resulting Magnitude Of A Complex Number reported at its DFT bin.

#### Analyze Level Outcome

A Bloom's Taxonomy level involving breaking a problem into parts and examining relationships between them, such as identifying a Performance Bottleneck through Stage Profiling.

**Example:** An Analyze Level Outcome lab asks students to use Debugging By Bisection to isolate which Logarithmic Stages level of their FFT has a bug.

#### Angular Frequency

The rate of change of a sinusoid's phase over time, measured in Radians per second and equal to 2*pi times the ordinary frequency in Hertz.

**Example:** A 440 Hz tone has an Angular Frequency of about 2765 radians per second, used inside the Sine Synthesis formula `sin(angular_frequency * t)`.

#### Anti Aliasing Filter

An analog or digital low-pass filter applied before sampling to remove frequency content above the Nyquist Frequency and prevent Aliasing.

**Example:** The MEMS Microphone's internal Anti Aliasing Filter attenuates ultrasonic content before the I2S Protocol digitizes the signal.

#### Apply Level Outcome

A Bloom's Taxonomy level involving using a known procedure or formula in a new but structured situation.

**Example:** An Apply Level Outcome lab has students compute a Bin To Frequency Mapping for a given N and sample rate they haven't seen before.

#### Arctangent Phase Recovery

The technique of computing a signal's Phase Angle at a given frequency by taking the arctangent of its Quadrature Component divided by its In Phase Component.

**Example:** Arctangent Phase Recovery on a DFT bin tells a student exactly how many degrees into its cycle a detected tone started.

#### Argmax Search

An algorithm that scans an array and returns the index of its largest element, used to find the Peak Bin within a Spectrum Array.

**Example:** An Argmax Search over the Half Spectrum Display's magnitude array locates the Peak Bin representing the played note's Fundamental Frequency.

#### Argument Passing Convention

The standardized rule specifying which CPU Register holds each function argument when Inline Assembler code is called from MicroPython.

**Example:** Under the Argument Passing Convention used by the Assembly Decorator, the first two function arguments arrive in registers r0 and r1.

#### Arithmetic Right Shift

A bit-shift operation that moves a signed integer's bits toward the least-significant end while replicating the sign bit, preserving the number's sign and approximating division by a power of two.

**Example:** An Arithmetic Right Shift by 8 bits converts a 32-bit I2S Serial Data word into a properly scaled 24-bit signed sample.

#### ARM Cortex M Architecture

The family of ARM processor designs, including the Cortex M0 Plus and Cortex M33 Processor, aimed at embedded microcontrollers and sharing a common Thumb-2 Encoding instruction style.

**Example:** Understanding the general ARM Cortex M Architecture register model makes it easier to compare the capabilities of different Pico chip generations.

#### ARMv6-M

A minimal ARM Instruction Set Architecture profile used by simple, low-cost cores such as the Cortex M0 Plus, lacking hardware floating point and many DSP instructions.

**Example:** ARMv6-M, used in the original Raspberry Pi Pico's RP2040 chip, is why that board suffers from Original Pico Incompatibility with this course's FPv5 Floating Point Unit labs.

#### ARMv7-M

An intermediate ARM Instruction Set Architecture profile that adds more instructions and optional DSP extensions compared to ARMv6-M, used by processors like the Cortex-M4.

**Example:** ARMv7-M cores support hardware Fused Multiply Add instructions unavailable on the simpler ARMv6-M.

#### ARMv8-M

The ARM Instruction Set Architecture profile implemented by the Cortex M33 Processor used in the Pico 2, adding security extensions and improved DSP/FPU support over ARMv7-M.

**Example:** ARMv8-M gives the Pico 2 access to the FPv5 Floating Point Unit that powers this course's hardware-accelerated Butterfly Operation labs.

#### Array Sum Speedup

A simple, illustrative benchmark that sums an array of numbers in plain MicroPython versus hand-written ARM assembly, used early in the course to introduce the Speedup Factor achievable by dropping to assembly.

**Example:** The Array Sum Speedup lab typically shows a large multiple improvement in Cycle Counter measurements before students tackle the more complex Butterfly Operation.

#### ASIC FFT Implementation

An FFT realized as a custom, application-specific integrated circuit rather than software or reprogrammable logic, mentioned for context but not built in this course.

**Example:** An ASIC FFT Implementation such as those in professional audio equipment achieves extreme speed and efficiency at a fixed, non-reprogrammable hardware cost.

#### Assembler Limitation

A restriction of MicroPython's built-in Inline Assembler, such as a limited subset of supported Instruction Mnemonic entries, compared to a full standalone ARM assembler toolchain.

**Example:** An Assembler Limitation in MicroPython's `asm_thumb` support may require a workaround Data Directive when a needed Instruction Mnemonic isn't recognized directly.

#### Assembly Butterfly

A hand-written ARM assembly implementation of the FFT's Butterfly Operation, using FPU instructions like VLDR Instruction, VMUL Instruction, and VADD Instruction for maximum speed.

**Example:** Benchmarking the Assembly Butterfly against the equivalent MicroPython version is the course's central demonstration of Speedup Factor from low-level optimization.

#### Assembly Debugging

The process of finding and fixing errors in hand-written assembly code, typically harder than debugging Python due to the lack of high-level error messages.

**Example:** Assembly Debugging of a broken Assembly Butterfly routine often relies on Debugging By Bisection, printing intermediate register values back out to MicroPython.

#### Assembly Decorator

The `@micropython.asm_thumb` decorator that marks a MicroPython function body as containing Inline Assembler instructions rather than ordinary Python statements.

**Example:** The Assembly Decorator tells MicroPython's compiler to parse the following function body as Thumb Instruction Set mnemonics instead of Python code.

#### Assembly Label

A named marker point within Inline Assembler code that a Conditional Branch or unconditional jump instruction can target.

**Example:** An Assembly Label named `loop_top` marks the start of the repeated Butterfly Operation sequence in an Assembly Loop.

#### Assembly Loop

A repeating sequence of ARM assembly instructions, controlled by a Compare Instruction and Conditional Branch pair, that mirrors a MicroPython While Loop but runs at native speed.

**Example:** The hand-written FFT's Stage Loop is implemented as an Assembly Loop that avoids Bytecode Interpretation overhead entirely.

#### Audio Buffer

A block of RAM that temporarily holds a batch of audio samples between being captured from a microphone and being processed or transformed.

**Example:** The tuner program fills a 1024-sample Audio Buffer before running the FFT to detect Fundamental Frequency.

#### Auto Calibration

A procedure in which a program automatically measures a baseline condition, such as ambient Noise Floor, and adjusts its own thresholds or reference values accordingly.

**Example:** Holding the Tactile Switch triggers Auto Calibration that records the current room's Noise Floor so the level meter can display relative loudness above it.

#### Autorun Main Script

A file, conventionally named `main.py`, that MicroPython automatically executes every time the board powers on or completes a Soft Reset, without manual intervention.

**Example:** Saving the tuner program as the Autorun Main Script lets the Pico 2 start tuning immediately when plugged into a USB power source, with no laptop attached.

#### Bar Graph Display

A visual layout that represents one or more numeric values as proportionally sized rectangular bars, commonly used for sound level meters or spectrum analyzers.

**Example:** The OLED Display Module renders a Bar Graph Display where each bar's height corresponds to the magnitude of one frequency bin.

#### Basis Function

One of a set of elementary signals, such as sinusoids at specific frequencies, used as reference patterns against which a signal is compared or decomposed.

**Example:** The DFT uses a complex exponential Basis Function at each Test Frequency to measure how much of that frequency is present in the input.

#### Beat Frequency

The slow amplitude oscillation heard when two tones of close but slightly different frequency are added, equal to the absolute difference between the two frequencies.

**Example:** Adding a 440 Hz and a 444 Hz Sine Wave produces an audible Beat Frequency of 4 Hz.

#### Benchmark Exclusions

Portions of a program's execution, such as one-time setup or Precomputation, that a benchmark deliberately does not count toward the reported timing.

**Example:** Twiddle Factor Table construction is a documented Benchmark Exclusions item, since it happens once and is not part of the per-frame FFT cost being measured.

#### Benchmark Report Format

The standardized structure the course requires for presenting timing results, typically including test conditions, the Minimum Sample Statistic, sample count, and any Benchmark Exclusions.

**Example:** Every lab's Benchmark Report Format table lists transform size N, language/implementation, and measured cycles per call side by side.

#### Benchmarking Methodology

The overall systematic approach, combining Measurement Discipline, Fair Comparison, and Honest Reporting, used to produce trustworthy and reproducible performance results.

**Example:** The course's Benchmarking Methodology is applied consistently from the first Millisecond Timer measurement through the final ARM assembly Optimization Composition experiments.

#### Best Of N Sampling

A benchmarking technique that repeats a measurement N times and reports the fastest observed result, minimizing the influence of occasional slowdowns from Interrupt Interference.

**Example:** Best Of N Sampling over 20 runs of the FFT reports the single fastest cycle count as the most representative measurement.

#### Big O Notation

A mathematical notation, such as O(N^2) or O(N log N), used to describe the upper-bound growth rate of an algorithm's Algorithmic Complexity as input size increases, ignoring constant factors.

**Example:** Big O Notation lets students compare the DFT's O(N^2) and the FFT's O(N log N) without getting distracted by implementation-specific constants.

#### Bin Averaging

Combining several adjacent DFT or FFT bins into one displayed value, reducing visual clutter or noise at the cost of Frequency Resolution Limit.

**Example:** Bin Averaging groups every four adjacent bins into one Spectrum Bars column so a 512-bin spectrum fits on a 128-pixel-wide OLED Display Module.

#### Bin Center Frequency

The exact frequency, in Hertz, that a given DFT or FFT output Bin Index represents, computed as (bin index * sample rate) / N.

**Example:** For N=1024 at 44.1 kHz, Bin Index 1 has a Bin Center Frequency of about 43.1 Hz.

#### Bin Exact Frequency

A test tone frequency chosen so it falls precisely on a DFT or FFT Bin Center Frequency, avoiding Spectral Leakage and simplifying validation.

**Example:** Choosing a Bin Exact Frequency test tone lets a Known Signal Test expect energy in exactly one Bin Index, with all others near zero.

#### Bin Index

The integer position, from 0 to N-1, of a specific entry in a DFT or FFT output Spectrum Array.

**Example:** Bin Index 10 in a 1024-point, 44.1 kHz DFT corresponds to a Bin Center Frequency near 430 Hz.

#### Bin To Frequency Mapping

The formula and process for converting a DFT or FFT Bin Index into its corresponding Bin Center Frequency in Hertz.

**Example:** Bin To Frequency Mapping multiplies the Peak Bin index by (sample_rate / N) to get the detected frequency in Hz.

#### Bin Width

The frequency span each DFT or FFT output bin effectively represents, equal to the sample rate divided by N, and equivalent to the Frequency Resolution Limit.

**Example:** Doubling the transform length N halves the Bin Width, giving finer Frequency Resolution Limit at the cost of a longer capture time.

#### Binary Data Unpacking

The process of interpreting a sequence of raw bytes as structured numeric values, such as converting bytes from an Audio Buffer into signed integer samples.

**Example:** MicroPython's `struct.unpack` performs Binary Data Unpacking to turn a byte string read from I2S Protocol hardware into a list of integers.

#### Bit Clock

The I2S Protocol signal line whose pulses pace the transfer of each individual bit of audio data, analogous to the SPI Clock Line in Serial Peripheral Interface.

**Example:** At a 44.1 kHz sample rate with 32-bit words, the Bit Clock toggles over a million times per second on the I2S Protocol bus.

#### Bit Depth

The number of bits used to represent each sample's amplitude, determining both Quantization Error and theoretical Dynamic Range.

**Example:** The INMP441 Microphone Module effectively delivers 24-bit Bit Depth audio over the I2S Protocol.

#### Bit For Bit Match

A strict correctness criterion requiring two implementations' outputs to be numerically identical, or within a very tight Numerical Tolerance, rather than merely "close."

**Example:** Achieving a Bit For Bit Match between the Assembly Butterfly and its MicroPython Reference Implementation gives strong confidence the assembly routine has no Sign Error.

#### Bit Mask

A pattern of bits used with bitwise AND, OR, or XOR operations to isolate, set, or clear specific bits within a larger value.

**Example:** A Bit Mask of `0xFFFF` extracts only the lower 16 bits of a 32-bit I2S Serial Data word during Sample Word Format unpacking.

#### Bit Reversal Permutation

The specific reordering of an input sequence's indices, obtained by reversing the binary digits of each index, required by the standard Iterative FFT to place data in the correct order for in-place computation.

**Example:** Before running an Iterative FFT, index 3 (binary 011) and index 6 (binary 110) are swapped as part of the Bit Reversal Permutation for an 8-point transform.

#### Bit Shift Operator

An operator that moves the bits of an integer left or right by a specified number of positions, used for fast multiplication/division by powers of two and for packing or unpacking fields.

**Example:** An Arithmetic Right Shift by one Bit Shift Operator call divides a signed sample value by two while preserving its sign.

#### Blackman Window

A tapering function using a more complex cosine combination than the Hanning Window or Hamming Window, achieving lower Side Lobe Level at the cost of a wider Main Lobe Width.

**Example:** A Blackman Window is chosen when the Instrument Identifier Project needs to suppress faint spurious peaks near a strong Fundamental Frequency.

#### Bloom's Taxonomy

A hierarchical framework categorizing learning objectives into levels of increasing cognitive complexity, from Remember Level Outcome through Create Level Outcome, used to structure course goals.

**Example:** The course's syllabus tags each lab with its target Bloom's Taxonomy level to ensure a progression from basic recall to independent design.

#### Bluestein's Algorithm

An FFT variant that computes a transform of arbitrary length N, including sizes with no small prime factors, by reformulating the DFT as a convolution.

**Example:** Bluestein's Algorithm is mentioned as an alternative to zero-padding when a student wants an exact-length transform that violates the Power Of Two Constraint.

#### Board Identification

Information exposed by a microcontroller's software or hardware, such as chip name and Unique Device ID, that lets a program or developer confirm exactly which board it is running on.

**Example:** A startup script prints Board Identification so a student can confirm code is running on a Pico 2 rather than an incompatible Original Pico Incompatibility board.

#### Board Recovery Procedure

A documented sequence of steps to restore a microcontroller to a working state after a bad script or Firmware issue makes it unresponsive over USB Serial Connection.

**Example:** The course's Board Recovery Procedure has a student hold the BOOTSEL Button and reflash MicroPython Firmware if an infinite While Loop in the Autorun Main Script locks up the REPL.

#### Boot Script

A file, conventionally named `boot.py`, that MicroPython runs once at power-up before the Autorun Main Script, typically used for low-level hardware setup.

**Example:** A Boot Script can raise the Pico 2's CPU Clock Frequency before `main.py` starts running the FFT benchmark loop.

#### BOOTSEL Button

A physical push button on the Raspberry Pi Pico 2 that, when held during power-up, puts the board into USB mass-storage mode for installing new Firmware.

**Example:** Holding the BOOTSEL Button while plugging in the Pico 2 makes it appear as a USB drive so a student can drag on a new `.uf2` Firmware Update file.

#### Bottleneck Identification

The analytical process of using Stage Profiling data to determine exactly which stage of a pipeline is the Performance Bottleneck worth optimizing first.

**Example:** Bottleneck Identification steered the course's optimization effort toward the Butterfly Operation loop rather than the display code, since Stage Percentage Breakdown showed it dominated Compute Time.

#### Boxed Value

A value stored with extra runtime type information attached, as standard MicroPython does for numbers and objects, enabling Python's dynamic typing at a memory and speed cost.

**Example:** Every integer in standard MicroPython is a Boxed Value, unlike the raw, Unboxed Value integers used inside a Viper Code Emitter function.

#### Branch Prediction

A processor hardware feature that guesses the outcome of a Conditional Branch before it is resolved, speculatively continuing execution to avoid stalling the instruction pipeline.

**Example:** Branch Prediction usually guesses correctly for a predictable Assembly Loop, but an Unpredictable Branch based on data can cause costly pipeline flushes.

#### Branchless Code

Code written to avoid Conditional Branch instructions entirely, using arithmetic or precomputed data instead, sidestepping any Branch Prediction penalty.

**Example:** Using a Precomputed Swap List instead of runtime index-comparison logic makes Bit Reversal Permutation effectively Branchless Code.

#### Breadboard

A reusable prototyping board with a grid of interconnected holes that lets components and jumper wires be connected without soldering.

**Example:** Students assemble the OLED Display Module, INMP441 Microphone Module, and Push Button Component on a single Breadboard for the semester.

#### Buffer Swapping

A technique that maintains two Audio Buffer instances, filling one while the other is being processed, so capture and computation can proceed without waiting on each other.

**Example:** Buffer Swapping lets the I2S Protocol continue filling a second buffer while the FFT still processes the first, hiding some Capture Time behind Compute Time.

#### Buffered Read

An I/O operation that fills an entire Audio Buffer with samples in one call, rather than reading and handling each sample individually.

**Example:** The I2S driver's Buffered Read call captures 512 samples at once, reducing the per-sample Python overhead compared to reading them one at a time.

#### Butterfly Count

The total number of Butterfly Operation calls an FFT of a given size performs, equal to (N/2) * log2(N) for a Radix 2 Algorithm transform.

**Example:** A 1024-point FFT has a Butterfly Count of 5120, far fewer than the roughly one million Multiply And Sum operations a direct DFT would need.

#### Butterfly Operation

The fundamental Recombination Step computation in the FFT, combining one even-Subproblem and one odd-Subproblem value using a single Twiddle Factor multiplication plus one addition and one subtraction.

**Example:** Every Stage Loop of an FFT consists entirely of repeated Butterfly Operation calls across all Butterfly Pair positions.

#### Butterfly Pair

The two specific input values combined by a single Butterfly Operation within one Stage Loop of the FFT.

**Example:** In the first Logarithmic Stages of an 8-point FFT, index 0 and index 4 form one Butterfly Pair.

#### Byte Offset

The number of bytes between the start of a data structure and a specific field or element within it, used in Pointer Arithmetic to locate that element.

**Example:** The imaginary part of the third complex sample in an Interleaved Storage array sits at a Byte Offset of 20 bytes from the array's start.

#### Bytecode Interpretation

The execution model used by standard MicroPython, in which source code is compiled to an intermediate bytecode format that is then interpreted step by step at runtime, rather than compiled to native machine code.

**Example:** Bytecode Interpretation overhead is the main reason a MicroPython Butterfly Operation runs far slower than the same logic written directly in ARM assembly.

#### Calling C From MicroPython

A technique for invoking pre-compiled C functions from MicroPython code, offering near-native speed without writing raw assembly, though generally out of scope for this course's board setup.

**Example:** Calling C From MicroPython is mentioned as an alternative optimization path used by some MicroPython ports, contrasted with this course's direct Inline Assembler approach.

#### Calling Convention

The agreed-upon rules governing how registers and the stack are used to pass arguments, return values, and preserve state across a function call boundary, extending the Argument Passing Convention.

**Example:** Violating the standard Calling Convention by not restoring a Scratch Register before returning from an Assembly Butterfly can corrupt the calling MicroPython code's state.

#### Capability Probing

The general technique of checking at runtime what hardware or software features are available before relying on them, rather than assuming a fixed configuration.

**Example:** Capability Probing via FPU Presence Detection lets the same codebase gracefully fall back to software float math on a board that lacks an FPv5 Floating Point Unit.

#### Capstone Project Weight

The proportion of the final course grade assigned to the Capstone Report and its associated Experimental Design and implementation work.

**Example:** The Capstone Project Weight is set high enough to reflect it as the course's primary Create Level Outcome deliverable.

#### Capstone Report

The final written deliverable of the course's capstone project, combining a Methodology Section, Results Presentation, and Conclusion Drawing into one document.

**Example:** The Capstone Report is graded partly on Honest Reporting, including a clear Limitations Statement about the chosen Capstone Track Selection.

#### Capstone Track Selection

The decision point where a student chooses which of several offered capstone project options, such as the Spectrogram Project or DTMF Decoder Project, to pursue.

**Example:** Capstone Track Selection happens around the midpoint of the course, once students have enough FFT and assembly background to choose confidently.

#### Capture Time

The portion of a processing cycle spent performing Frame Capture, reading new samples from the microphone into an Audio Buffer.

**Example:** Capture Time dominates the total Frame Duration when using slow Buffered Read calls over I2S Protocol.

#### Cents Deviation

A fine-grained measure of pitch difference, with 100 cents per Semitone Formula step, used to express how far a detected frequency is from the nearest exact musical note.

**Example:** A detected frequency of 442 Hz shows a small positive Cents Deviation from the standard 440 Hz A4 Reference Pitch.

#### Channel Select Pin

A control pin on some I2S Protocol microphones that determines whether the device transmits during the left or right half of the Word Select Line cycle.

**Example:** Tying the INMP441 Microphone Module's Channel Select Pin to ground configures it to output on the left channel.

#### Character Grid

A layout scheme that divides a Monochrome Display into fixed-size rows and columns of character cells for simple Text Rendering without pixel-level font work.

**Example:** A basic status readout uses the OLED Display Module's Character Grid to print numeric readings at fixed row and column positions.

#### Chip Select Line

A Serial Peripheral Interface signal that a controller drives low (or high) to indicate which single peripheral on a shared bus should listen to the current transaction.

**Example:** The Pico 2 pulls the OLED Display Module's Chip Select Line low before sending framebuffer data so other SPI devices on the bus ignore the transfer.

#### Chromatic Tuner

A capstone-style project that detects a played note's Pitch using the FFT and reports its name and Cents Deviation from the ideal frequency.

**Example:** The Chromatic Tuner project combines Peak Bin detection, Parabolic Interpolation, and Musical Note Mapping into one real-time application.

#### Clipping

A distortion that occurs when a signal's amplitude exceeds the Full Scale Value a system can represent, causing peaks to be flattened at the maximum value.

**Example:** Speaking too close to the MEMS Microphone causes Clipping, visible as flat-topped waveforms in Waveform Plotting.

#### Clipping Distortion

The audible or spectral artifact introduced by Clipping, characterized by added Harmonic Distortion not present in the original signal.

**Example:** Clipping Distortion from an overdriven microphone adds spurious high-frequency energy that shows up as extra Spectrum Bars in the live display.

#### Code Organization

The practice of structuring a project's files, functions, and modules so related logic is grouped together and reused rather than duplicated, improving readability and maintenance.

**Example:** Good Code Organization keeps I2S Protocol setup in one Shared Configuration Module rather than copy-pasted into every lab script.

#### Code Size Tradeoff

The balance between a program's speed and how much Flash Memory or RAM its instructions consume, relevant when choosing between compact loops and fully unrolled code.

**Example:** Fully unrolling every Butterfly Operation in a large FFT wins on speed but incurs a significant Code Size Tradeoff against the Pico 2's limited Flash Memory.

#### Coherent Gain

The average amplitude scaling factor a window function applies to a signal, which must be accounted for when comparing Magnitude Computation results across different windows.

**Example:** Because a Hanning Window has lower Coherent Gain than a Rectangular Window, its output magnitudes must be rescaled for a fair Peak Ratio Threshold comparison.

#### Cold Start Baseline Mismatch

A benchmarking error in which one implementation's measurement includes Cold Start Effect overhead while a compared implementation's does not, producing an unfair comparison.

**Example:** A Cold Start Baseline Mismatch would unfairly penalize the assembly FFT if its first-call overhead were counted while the MicroPython version's warm runs were used for comparison.

#### Cold Start Effect

The tendency for the first execution of a piece of code to run slower than subsequent executions, due to factors like cache warming or MicroPython's Bytecode Interpretation setup.

**Example:** The Cold Start Effect on a MicroPython function's first call can add hundreds of extra cycles compared to its second call.

#### Compare Instruction

An ARM assembly instruction (CMP) that subtracts one value from another without storing the result, only updating processor flags for a subsequent Conditional Branch.

**Example:** A Compare Instruction checks a loop counter against the total Butterfly Count before a Conditional Branch decides whether to continue the Stage Loop.

#### Comparison Matrix

A table summarizing benchmark results across multiple implementations and/or multiple test conditions, making a Variant Comparison easy to read at a glance.

**Example:** The lab report's Comparison Matrix lists cycle counts for each of the 6-Way Variant Matrix combinations of language and transform size.

#### Complex Exponential

An expression of the form e^(i*omega*t), which by Euler's Formula traces a point rotating around the Unit Circle and compactly represents a sinusoid's frequency and Phase Offset.

**Example:** The DFT correlates a signal against a Complex Exponential at each Test Frequency instead of separately against sine and cosine.

#### Complex Multiplication

The arithmetic operation of multiplying two Complex Numbers together, requiring four real multiplications and two additions in its direct form, central to the Butterfly Operation.

**Example:** Each Butterfly Operation performs one Complex Multiplication between an odd-half value and a Twiddle Factor.

#### Complex Numbers

Numbers of the form a + bi, combining a Real Part and an Imaginary Part, used throughout the DFT and FFT to represent both magnitude and Phase Angle of a frequency component in a single value.

**Example:** Each entry in a Spectrum Array is a complex number whose Real Part and Imaginary Part together encode the In Phase Component and Quadrature Component of that frequency.

#### Complexity Reduction

The overall decrease in Algorithmic Complexity, from O(N^2) to O(N log N), achieved by the FFT's recursive exploitation of Twiddle Factor Symmetry Exploitation.

**Example:** The Complexity Reduction from DFT to FFT is why a 4096-point transform that once took seconds can run many times per second on the Pico 2.

#### Compute Time

The portion of a processing cycle spent on numerical computation, such as running the FFT and Magnitude Computation, as distinct from Capture Time or Draw Time.

**Example:** Compute Time dropped sharply once the FFT's inner Butterfly Operation loop was rewritten in ARM assembly.

#### Conclusion Drawing

The process of interpreting Results Presentation data to answer the original Research Question, supported by the evidence gathered rather than by assumption.

**Example:** Conclusion Drawing in a capstone report should explicitly connect the measured Speedup Factor back to the Hypothesis Statement made beforehand.

#### Conditional Branch

An ARM assembly instruction that jumps program execution to a different Assembly Label only if a specified condition, set by a prior Compare Instruction, is true.

**Example:** A Conditional Branch implements the loop-continuation test at the bottom of a hand-written Assembly Loop over all Butterfly Pair computations.

#### Constructive Interference

The reinforcement of two overlapping waves when their instantaneous values add in the same direction, producing a combined amplitude larger than either alone.

**Example:** Two in-phase tones of the same frequency exhibit Constructive Interference, doubling the resulting Peak Amplitude.

#### Controlled Variable

A factor deliberately held constant across a Variant Comparison so that any measured performance difference can be attributed only to the factor actually being tested.

**Example:** Holding transform size N as a Controlled Variable across all six FFT variants ensures the Variant Comparison isolates only implementation differences.

#### Cooley-Tukey Algorithm

The classic Divide And Conquer FFT algorithm, published by Cooley and Tukey in 1965, that recursively applies the Even Odd Split and Butterfly Operation to achieve O(N log N) complexity.

**Example:** The Cooley-Tukey Algorithm is the specific FFT variant implemented and optimized throughout this course.

#### Coordinate System Origin

The reference Pixel Coordinate, conventionally (0, 0), from which all other on-screen positions are measured, typically the top-left corner of a display.

**Example:** On the OLED Display Module, the Coordinate System Origin sits at the top-left, so a Bar Graph Display grows upward from a fixed baseline row.

#### Core Register Set

The full collection of General Purpose Register and special-purpose registers (such as the program counter and stack pointer) available on an ARM Cortex-M processor.

**Example:** Understanding the Core Register Set is a prerequisite for writing correct Inline Assembler, since a routine must avoid clobbering registers the caller still needs.

#### Correctness Before Speed

The course's guiding principle that an algorithm must pass Cross Validation against a Reference Implementation before any benchmarking of its Speedup Factor is meaningful.

**Example:** Correctness Before Speed means a beautifully optimized but incorrect Assembly Butterfly routine earns zero credit until it matches the Reference Implementation.

See also: Validation Before Trust

#### Correlation

A measure of how closely two signals resemble each other, computed by multiplying corresponding samples together and summing the results, forming the core operation behind the DFT.

**Example:** High Correlation between a captured signal and a 440 Hz Test Frequency Basis Function indicates a strong 440 Hz component in the input.

#### Correlation Magnitude

The overall strength of a signal's Correlation with a Test Frequency, computed by combining the In Phase Component and Quadrature Component into a single Magnitude Of A Complex Number.

**Example:** Plotting Correlation Magnitude across all Test Frequency values produces the Spectrum Array shown on the OLED Display Module.

#### Cortex M0 Plus

A small, low-power ARM processor core implementing the ARMv6-M Instruction Set Architecture, used in the original Raspberry Pi Pico but lacking hardware floating point.

**Example:** The Cortex M0 Plus in the original Pico cannot run this course's FPv5-dependent assembly labs, which is why the Pico 2's Cortex M33 Processor is required.

#### Cortex M33 Processor

The ARM processor core used in the Raspberry Pi Pico 2's RP2350 chip, implementing ARMv8-M with an optional FPv5 Floating Point Unit and DSP extensions.

**Example:** This course targets the Cortex M33 Processor specifically because of its hardware floating point support, central to the ARM assembly optimization labs.

#### Cosine Function

A periodic trigonometric function identical in shape to the Sine Wave but shifted by a 90-degree Phase Offset, used alongside sine to represent both components of a Complex Exponential.

**Example:** The DFT's In Phase Component is computed by multiplying a signal against a Cosine Function at each Test Frequency.

#### Counter Verification

A sanity check that confirms a timing measurement tool, such as the Cycle Counter, is actually counting correctly before trusting any benchmark results derived from it.

**Example:** Counter Verification runs an Empty Loop Baseline of known iteration count and checks the Cycle Counter result against the expected cycle cost per iteration.

#### Counter Wraparound

The event where a timer or counter register reaches its maximum representable value and rolls back over to zero, potentially causing incorrect elapsed-time calculations if not handled.

**Example:** A 32-bit Cycle Counter running at 133 MHz experiences Counter Wraparound roughly every 32 seconds, which benchmarking code must account for on long-running measurements.

#### CPU Clock Frequency

The rate, measured in Hertz, at which a processor's internal clock advances and executes instruction cycles, setting an upper bound on how much work it can do per second.

**Example:** Raising the Pico 2's CPU Clock Frequency from its default speed reduces the measured Compute Time of an FFT, which the course verifies with the Cycle Counter.

#### CPU Cycle Budget

The maximum number of processor clock cycles available to complete a task before a deadline, derived from the CPU Clock Frequency and the required Frame Duration.

**Example:** At a 44.1 kHz sample rate and a 133 MHz CPU Clock Frequency, a student computes the CPU Cycle Budget available to process each audio sample before the next one arrives.

See also: Real Time Budget, Processing Deadline

#### CPU Register

A small, extremely fast storage location built directly into the processor core, used to hold values being actively computed on, distinct from the much larger but slower RAM.

**Example:** A Butterfly Operation written in assembly keeps its real and imaginary accumulator values in CPU Register storage throughout the computation.

#### CPUID Register

A Memory Mapped Register that reports identifying information about the processor core, such as its architecture, implementer, and Silicon Revision.

**Example:** Reading the CPUID Register on the Pico 2 confirms the board contains an ARM Cortex M33 Processor rather than the RP2040's Cortex-M0+.

#### Create Level Outcome

The highest Bloom's Taxonomy level, involving designing and building an original solution, such as a capstone project, from previously learned components.

**Example:** The capstone itself is the course's primary Create Level Outcome assessment, requiring students to design their own Experimental Design.

#### Cross Add And Subtract

The pair of arithmetic operations at the heart of the Butterfly Operation: adding the two (possibly twiddle-multiplied) inputs for one output and subtracting them for the other.

**Example:** After a Complex Multiplication by the Twiddle Factor, the Butterfly Operation finishes with a simple Cross Add And Subtract to produce its two outputs.

#### Cross Validation

The practice of comparing a new algorithm's output against a trusted Reference Implementation on the same input to confirm they agree within Numerical Tolerance.

**Example:** Cross Validation between the Radix 2 Algorithm FFT and the DFT confirms both produce matching Spectrum Array results for the same Ground Truth Signal.

#### Cycle Count Enable Bit

The specific bit within the DWT Unit's control register that starts the Cycle Count Register incrementing once set.

**Example:** After setting the Trace Enable Bit, code must also set the Cycle Count Enable Bit before the Cycle Counter begins counting cycles.

#### Cycle Count Register

The specific Memory Mapped Register within the DWT Unit that holds the running count of elapsed CPU clock cycles since it was last reset or enabled.

**Example:** Reading the Cycle Count Register immediately before and after an FFT call and subtracting the two values gives the exact cycle cost of that call.

#### Cycle Counter

A hardware register that increments once per CPU clock cycle, providing the finest possible timing resolution for benchmarking short code sequences on the ARM Cortex M33 Processor.

**Example:** The course reads the DWT Unit's Cycle Counter before and after a Butterfly Operation to measure its cost in exact clock cycles.

#### Cycles To Time Conversion

The calculation that converts a raw Cycle Counter value into real elapsed time by dividing by the CPU Clock Frequency.

**Example:** Cycles To Time Conversion of 13300 cycles at a 133 MHz CPU Clock Frequency yields exactly 100 microseconds.

#### Data Command Pin

A control line on some display interfaces that tells the Display Driver Chip whether the current byte being sent is a configuration command or Framebuffer pixel data.

**Example:** The OLED Display Module's Data Command Pin is toggled low when the SSD1306 Controller is being configured and high while streaming pixel data.

#### Data Directive

An assembler pseudo-instruction that embeds a raw constant value directly into the compiled code stream, rather than generating an executable Machine Code instruction.

**Example:** A Data Directive can embed a Twiddle Factor Table constant directly adjacent to the Assembly Butterfly code that reads it.

#### Data Flow Graph

A diagram showing how values move through and combine across the successive Logarithmic Stages of an FFT, visually resembling a series of butterfly-shaped crossing lines.

**Example:** The characteristic "butterfly" Data Flow Graph of an 8-point Radix 2 Algorithm FFT is a standard textbook illustration the course reproduces for its own examples.

#### Data Marshalling Cost

The overhead of converting or copying data between formats or memory layouts, such as between MicroPython objects and a Typed Array, needed to cross the Python Assembly Boundary.

**Example:** Data Marshalling Cost of copying samples into an Interleaved Storage Typed Array before calling assembly code partly offset the Assembly Butterfly's raw speed advantage.

#### 6 dB Per Bit Rule

A rule of thumb stating that each additional bit of Bit Depth improves a digital audio system's Dynamic Range by approximately 6 decibels.

**Example:** Using the 6 dB Per Bit Rule, a student estimates that 16-bit audio offers roughly 96 dB more Dynamic Range than 0-bit (silent) representation.

#### DC Bin

The Bin Index 0 entry of a Spectrum Array, representing the signal's DC Component (zero-frequency, constant) content.

**Example:** A large DC Bin value in an uncorrected spectrum usually indicates leftover DC Offset that was not removed before the FFT.

#### DC Component

The zero-frequency (constant, non-oscillating) part of a signal, corresponding to its average value over time.

**Example:** A microphone's DC Offset appears in a captured signal's DC Component and must be removed before spectral analysis.

#### DC Offset

A constant, non-zero average value added to an audio signal, shifting all samples up or down from true zero without representing actual sound.

**Example:** A microphone circuit's DC Offset of a few hundred counts must be subtracted before computing an accurate Root Mean Square sound level.

#### DC Offset Removal

The process of subtracting an estimated constant bias from a signal so its samples center around zero, typically using a running average.

**Example:** DC Offset Removal via a Moving Average filter cleans up microphone samples before they are fed into the FFT, preventing a large DC Bin from dwarfing real frequency peaks.

#### Debouncing

A software or hardware technique that filters out Switch Bounce so a mechanical switch transition is reported to the program exactly once per physical press.

**Example:** Debouncing a Push Button Component by ignoring further edges for 20 milliseconds after the first detected transition prevents a single tap from triggering Mode Switching twice.

#### Debug Exception Register

A control register on ARM Cortex-M processors that must have its trace-enable bit set before the DWT Unit's Cycle Count Register will actually start counting.

**Example:** Forgetting to configure the Debug Exception Register is a common first mistake that leaves the Cycle Counter frozen at zero.

#### Debugging By Bisection

A troubleshooting technique that narrows down the location of a bug by testing progressively smaller portions of an algorithm or dataset until the faulty section is isolated.

**Example:** Debugging By Bisection on a failing FFT means comparing its output stage-by-stage against a Reference Implementation until the first mismatched Butterfly Operation is found.

#### Decibel Scale

A logarithmic scale for expressing ratios of power or amplitude, commonly used to represent audio levels because it compresses a wide dynamic range into manageable numbers.

**Example:** Converting Root Mean Square amplitude to the Decibel Scale via `20*log10(rms/reference)` lets the level meter show a useful range from whisper to shout on one display.

#### Decimation In Time

The specific FFT strategy used in this course, in which the input sequence is split by index (even versus odd samples) before each Recursive Decomposition step, as opposed to splitting the output.

**Example:** Decimation In Time is why the Radix 2 Algorithm implemented in this course begins with an Even Odd Split of the input array.

#### Dependent Variable

The outcome measured in an experiment, expected to change in response to variation in the Independent Variable.

**Example:** Measured Cycle Counter value per FFT call is the Dependent Variable in most of this course's benchmarking experiments.

#### Deployment Workflow

The sequence of steps used to move finished code from a development environment onto a microcontroller for real-world or Standalone Operation.

**Example:** The course's Deployment Workflow is: test in Thonny IDE, copy files with the mpremote Tool, save as the Autorun Main Script, then power-cycle to confirm Standalone Operation.

#### Destructive Interference

The cancellation of two overlapping waves when their instantaneous values add in opposite directions, producing a combined amplitude smaller than either alone.

**Example:** A tone and its perfectly inverted copy exhibit total Destructive Interference, summing to silence.

#### Device Filesystem

The small flash-memory-backed storage area inside a microcontroller that holds script files, imported modules, and configuration data, visible to an IDE as a simple file tree.

**Example:** Saving `main.py` to the Pico 2's Device Filesystem makes it run automatically the next time the board powers on.

#### Digital Input

A GPIO Pin mode in which software reads the pin's current voltage as one of two Logic Level states, used to sense switches or other digital signals.

**Example:** A Push Button Component wired to a GPIO Pin configured as Digital Input lets a script detect a Pin Toggle when the button is pressed.

#### Digital Input Pin

A GPIO Pin configured to read an external circuit's Logic Level, commonly used to sense a Push Button Component or Tactile Switch.

**Example:** A Digital Input Pin connected through a Pull Up Resistor reads high when a Push Button Component is unpressed and low when pressed.

#### Digital Output

A GPIO Pin mode in which software sets the pin's voltage to one of two Logic Level states (high or low) to drive an external device.

**Example:** Setting a Pin Object to Digital Output and calling `.value(1)` turns the Onboard LED on.

#### Discrete Fourier Transform

A mathematical transform that converts a finite sequence of N time-domain samples into N complex frequency-domain values by correlating the signal against each of N evenly spaced Test Frequency values.

**Example:** The course implements the Discrete Fourier Transform directly from its Multiply And Sum definition before ever introducing the faster FFT.

See also: Fast Fourier Transform, Fourier Transform

#### Display Driver Chip

An integrated circuit mounted on a display module that converts commands and pixel data received over a bus into the drive signals a physical screen needs.

**Example:** The SSD1306 Controller is the Display Driver Chip used on the course's monochrome OLED Display Module.

#### Display Refresh

The act of sending the current Framebuffer contents to the Display Driver Chip so the physical screen shows the latest drawn image.

**Example:** Calling `.show()` after drawing a new frame of Spectrum Bars triggers a Display Refresh on the SSD1306 Controller.

#### Display Reset Pin

A control line that, when pulsed, forces a Display Driver Chip back to a known startup state, used during initialization or to recover from a hung display.

**Example:** A driver library pulses the Display Reset Pin low briefly before configuring the SSD1306 Controller at boot.

#### Divide And Conquer

A general algorithm design strategy that solves a problem by splitting it into smaller Subproblem instances, solving each recursively, and combining their results.

**Example:** The FFT applies Divide And Conquer by repeatedly splitting a DFT into smaller transforms via the Even Odd Split.

#### Dot Product

The sum of the products of corresponding entries of two equal-length sequences, mathematically equivalent to Multiply And Sum and used to compute Correlation.

**Example:** The In Phase Component of a DFT bin is the Dot Product of the signal with a Cosine Function reference wave.

#### Draw Show Loop Pattern

A common display-programming idiom in which a program repeatedly clears or draws into an off-screen Framebuffer, then calls a single show/refresh function to update the physical screen.

**Example:** The live spectrum analyzer follows the Draw Show Loop Pattern: clear the buffer, draw new Spectrum Bars, then call `.show()` once per frame.

#### Draw Time

The portion of a processing cycle spent updating the display, including Text Rendering and Display Refresh of Spectrum Bars.

**Example:** Draw Time can become the Performance Bottleneck if every pixel of the OLED Display Module's Framebuffer is redrawn unnecessarily each frame.

#### DTMF Decoder Project

A capstone track that identifies which telephone-keypad tone pair (DTMF) is present in an audio signal by detecting two simultaneous peaks in a Spectrum Array.

**Example:** The DTMF Decoder Project reuses Peak Bin detection techniques from the Chromatic Tuner but searches for two independent tones instead of one.

#### Dual Core Processing

Splitting work across both processor cores of the Pico 2's RP2350 chip to run parts of a computation, such as capture and compute, simultaneously rather than sequentially.

**Example:** Dual Core Processing could dedicate one core to continuous Frame Capture while the other performs Compute Time work on the previous frame.

#### DWT Unit

The Data Watchpoint and Trace unit, a debug peripheral built into ARM Cortex-M processors that includes the Cycle Count Register used for precise performance measurement.

**Example:** Enabling the DWT Unit at startup is a prerequisite for using the Cycle Counter anywhere else in the course's benchmarking code.

#### Dynamic Range

The ratio between the largest and smallest signal magnitudes a system can represent or measure meaningfully, often expressed on the Decibel Scale.

**Example:** A 16-bit Bit Depth microphone has a theoretical Dynamic Range of about 96 dB between its Noise Floor and Full Scale Value.

#### Edge Detection

The act of identifying the moment a digital signal transitions from one Logic Level to another, distinguishing a fresh press or release from a signal that is merely being held.

**Example:** Edge Detection compares the current and previous readings of a Push Button Component's pin to trigger an action only once per press, not repeatedly while held.

#### Edge Discontinuity

An abrupt jump between the end of a captured signal segment and the start of its next assumed repetition, the root cause of Spectral Leakage under the Periodic Extension Assumption.

**Example:** An Edge Discontinuity occurs whenever a captured tone's frequency isn't a Bin Exact Frequency, since the waveform doesn't complete a whole number of cycles within the buffer.

#### Empty Loop Baseline

A benchmark of a loop that does no meaningful work, used to measure and later subtract the fixed overhead of loop control itself from a real measurement.

**Example:** An Empty Loop Baseline of one million iterations reveals the per-iteration loop overhead that should be subtracted from a Butterfly Operation benchmark's raw cycle count.

#### Encoding Bit Field

A specific group of contiguous bits within an instruction's binary Instruction Encoding, reserved for one particular piece of information such as a register number or immediate value.

**Example:** Bits 3 through 5 of a 16-bit Thumb Instruction Set word form the Encoding Bit Field that selects the destination General Purpose Register.

#### Encoding Table

A reference chart, found in an Instruction Reference Manual, listing every valid Opcode and Encoding Bit Field layout for a processor's Instruction Set Architecture.

**Example:** A student consults the ARMv8-M Encoding Table to manually verify that a hand-assembled VMUL Instruction produces the correct Raw Machine Word.

#### Encoding Verification

The practice of manually checking that an assembled instruction's Raw Machine Word matches the bit pattern specified by the Instruction Reference Manual for its intended Opcode and operands.

**Example:** Encoding Verification of a hand-assembled instruction caught a student's transposed Encoding Bit Field before it caused a silent Sign Error.

#### Engineered Productive Failure

A deliberately designed learning activity in which students are set up to encounter a specific, predictable failure, so its correction teaches a concept more deeply than direct instruction would.

**Example:** Having students first build a Sine Only Detector Blind Spot detector is an Engineered Productive Failure that makes the need for the Quadrature Component memorable.

See also: Productive Failure, Real Mistake As Teaching Tool

#### Escape Hatch Delay

A short pause, deliberately inserted at the start of an Autorun Main Script, that gives a developer a brief window to interrupt Script Execution before the main program takes over the console.

**Example:** A two-second Escape Hatch Delay at the top of `main.py` lets a student send a Keyboard Interrupt before a buggy audio loop hangs the board again.

#### Euler's Formula

The identity e^(i*theta) = cos(theta) + i*sin(theta), linking the Complex Exponential to sine and cosine and forming the mathematical basis of the Discrete Fourier Transform.

**Example:** The DFT's Twiddle Factor terms are computed directly from Euler's Formula evaluated at specific angles.

#### Evaluate Level Outcome

A Bloom's Taxonomy level involving making and justifying a judgment about the quality or suitability of an approach, such as choosing between windowing functions.

**Example:** An Evaluate Level Outcome assignment asks students to justify which of the Hanning Window, Hamming Window, or Blackman Window best suits the Instrument Identifier Project.

#### Even Odd Split

The FFT's core decomposition step, dividing an N-point sequence into its even-indexed and odd-indexed samples to form two independent, half-size Subproblem transforms.

**Example:** An 8-point transform's Even Odd Split produces two 4-point sequences, one from indices 0,2,4,6 and one from 1,3,5,7.

#### Event Loop

A program's central repeating cycle that checks for and responds to inputs (button presses, timers, sensor data) each iteration, coordinating a device's overall behavior.

**Example:** The tuner lab's Event Loop samples audio, updates the OLED Display Module, and checks the mode button on every pass.

#### Expected Peak

The specific Bin Index and Magnitude Of A Complex Number a Known Signal Test predicts before running the algorithm, used for comparison against the actual output.

**Example:** For a Bin Exact Frequency 430 Hz tone at N=1024, the Expected Peak is at Bin Index 10.

#### Experimental Design

The overall plan for a benchmarking or investigative study, specifying what will be varied, what will be measured, and what will be held constant to answer a Research Question.

**Example:** The capstone project requires students to write out their Experimental Design before collecting any Cycle Counter data on their chosen optimization.

#### Exponential Smoothing

A running-average technique that updates an estimate by blending a new sample with the previous estimate using a fixed weighting factor, giving recent samples more influence without storing a full history.

**Example:** The VU meter uses Exponential Smoothing on Sound Level readings so the Bar Graph Display doesn't flicker between adjacent frames.

#### Failure Root Cause

The underlying, specific reason a piece of code does not work as expected, distinct from its surface symptoms, identified through Debugging By Bisection or similar analysis.

**Example:** Tracing a mysterious crash to its Failure Root Cause revealed a missing FPU Presence Detection check on a board lacking the FPv5 Floating Point Unit.

#### Fair Comparison

A benchmarking practice that controls for confounding differences, such as Cold Start Baseline Mismatch or unequal Warm Up Discard, so measured differences reflect the algorithms being compared rather than measurement artifacts.

**Example:** A Fair Comparison between the DFT and FFT uses the same Ground Truth Signal, the same Best Of N Sampling count, and the same CPU Clock Frequency for both.

#### Fast Fourier Transform

A family of algorithms that compute the same result as the Discrete Fourier Transform in O(N log N) time instead of O(N^2), by recursively exploiting symmetry in the Twiddle Factor values.

**Example:** Switching from a direct DFT to a Fast Fourier Transform lets the Pico 2 analyze a 1024-sample Audio Buffer fast enough to meet its Real Time Budget.

See also: Discrete Fourier Transform, Cooley-Tukey Algorithm

#### Fast Magnitude Approximation

A computationally cheaper substitute for the exact Magnitude Of A Complex Number square-root formula, trading a small amount of accuracy for reduced Trigonometric Function Cost-like overhead.

**Example:** A Fast Magnitude Approximation such as max(|re|,|im|) + 0.4*min(|re|,|im|) avoids a costly square root in every Bin Index of a real-time spectrum display.

#### Feature Register

A Memory Mapped Register that reports which optional hardware capabilities, such as floating point or DSP extensions, a specific processor implementation includes.

**Example:** Reading a Feature Register during FPU Presence Detection confirms whether VLDR Instruction and VSTR Instruction opcodes will actually execute rather than fault.

#### FFT DFT Crossover Point

The transform size N at which the FFT's O(N log N) runtime becomes faster in practice than the direct DFT's O(N^2) runtime, accounting for real-world constant factors.

**Example:** Benchmarking on the Pico 2 reveals the FFT DFT Crossover Point occurs at a surprisingly small N, after which the FFT wins by an ever-widening margin.

#### File Transfer

The act of copying a script, module, or data file between a host computer and a microcontroller's Device Filesystem, typically over a USB Serial Connection.

**Example:** A student drags `oled_helper.py` into the Pico 2's file list in Thonny IDE to complete a File Transfer before importing it in `main.py`.

#### Filter Design Scope

The course's explicit boundary excluding formal digital filter design (such as FIR or IIR filter synthesis) from its curriculum, beyond the simple Anti Aliasing Filter and Moving Average.

**Example:** Filter Design Scope notes clarify that building a custom bandpass filter is left to a follow-on DSP course, not this one.

#### Final Exam Weight

The proportion of the final course grade assigned to a comprehensive end-of-course exam covering material from Sine Wave fundamentals through ARM assembly optimization.

**Example:** The Final Exam Weight is balanced against Capstone Project Weight so no single assessment dominates the Grading Rubric.

#### Firmware

The low-level software, including the MicroPython interpreter itself, that is flashed onto a microcontroller's persistent storage and runs whenever the board boots.

**Example:** The Pico 2 ships with bootloader Firmware, and students replace it with a MicroPython build to enable Script Execution of Python code.

#### Firmware Update

The process of replacing the software image stored in a microcontroller's flash memory, typically by copying a new file while the board is in a special bootloader mode.

**Example:** A student performs a Firmware Update by holding the BOOTSEL Button and copying the latest MicroPython `.uf2` file onto the Pico 2.

#### Fixed Point Q15 Arithmetic

A number representation that stores fractional values as scaled integers with an implicit binary point, commonly using a 1.15 format where 15 bits represent the fractional part, avoiding floating-point hardware entirely.

**Example:** Fixed Point Q15 Arithmetic lets a Butterfly Operation run entirely using integer instructions on a processor lacking an FPv5 Floating Point Unit.

#### Flash Memory

Non-volatile storage on a microcontroller that retains its contents without power, used to hold Firmware, the Device Filesystem, and saved script files.

**Example:** A `main.py` script saved to Flash Memory survives a power cycle, unlike data held only in RAM.

#### Flat Top Waveform

A waveform shape in which the peaks are cut off flat rather than rounded, the visible signature of Clipping in Waveform Plotting.

**Example:** A Flat Top Waveform on the oscilloscope-style display tells a student the microphone gain is set too high.

#### Float Precision

The number of significant bits used to represent a real (fractional) number, determining the accuracy and range of arithmetic such as sine and cosine evaluations.

MicroPython on the Pico 2 typically uses 32-bit Single Precision Float, which the course revisits when comparing rounding error between the DFT and the FFT.

**Example:** A DFT computed with 32-bit Float Precision may differ from a "ground truth" value by a small Absolute Error near the limits of that precision.

#### Floating Pin

A GPIO Pin configured as an input but left electrically unconnected to a defined high or low source, causing it to read unpredictable, noise-driven values.

**Example:** Forgetting to enable a Pull Up Resistor leaves the button pin a Floating Pin, causing false Edge Detection triggers from electrical noise.

#### Floating Point Register

A CPU Register dedicated to holding floating-point values, part of the FPv5 Floating Point Unit's separate Register Bank from the integer General Purpose Register set.

**Example:** A Complex Multiplication in assembly loads its operands into Floating Point Register locations like s0 and s1 before issuing a VMUL Instruction.

#### Forward Transform Convention

The mathematical sign and scaling convention used when converting a signal from the Time Domain into the Frequency Domain, as distinct from the Inverse Transform Convention used to go back.

**Example:** This course's Forward Transform Convention uses a negative exponent in the complex exponential, matching the common engineering definition of the DFT.

#### Four Multiply Form

The straightforward way of computing a Complex Multiplication using four real multiplications and two real additions/subtractions, before any optimization is applied.

**Example:** A naive Butterfly Operation implemented in the Four Multiply Form performs more arithmetic than necessary compared to the Three Multiply Trick.

#### Fourier Transform

The general mathematical concept of decomposing a signal into its constituent frequencies, of which the Discrete Fourier Transform is the finite, sampled, computable version used in this course.

**Example:** The continuous Fourier Transform is covered only briefly before the course moves directly to its practical, computable cousin, the Discrete Fourier Transform.

#### FPGA FFT Implementation

An FFT implemented as custom digital logic on a field-programmable gate array rather than as software on a general-purpose processor, mentioned as an alternative approach outside this course's scope.

**Example:** An FPGA FFT Implementation could compute a Butterfly Operation with dedicated parallel hardware, but building one is explicitly outside this course's scope.

#### FPU Presence Detection

The process of checking, in software, whether a given processor implementation actually includes a Floating Point Unit before attempting to use FPU instructions.

**Example:** FPU Presence Detection reads the CPUID Register or a Feature Register to confirm the FPv5 Floating Point Unit exists before executing a VADD Instruction.

#### FPv5 Floating Point Unit

The specific hardware floating-point coprocessor variant included in the Pico 2's Cortex M33 Processor, providing single-precision arithmetic instructions like VADD Instruction and VMUL Instruction.

**Example:** The FPv5 Floating Point Unit lets a Butterfly Operation's Complex Multiplication execute as a handful of hardware instructions instead of slow software floating-point routines.

#### Frame Capture

The act of acquiring one complete Audio Buffer of samples to be processed as a single unit through the FFT and display pipeline.

**Example:** Frame Capture time is measured separately from Compute Time and Draw Time during Stage Profiling of the spectrum analyzer.

#### Frame Duration

The length of time represented by one processed chunk (frame) of audio data, equal to the buffer size divided by the Sample Rate Selection.

**Example:** A 512-sample buffer at 44.1 kHz has a Frame Duration of about 11.6 milliseconds.

#### Frame Rate

The number of complete capture-compute-draw cycles a Live Spectrum Display or similar real-time application completes per second.

**Example:** Optimizing the FFT's Compute Time raised the tuner's Frame Rate from about 10 to over 30 updates per second.

#### Framebuffer

An in-memory array holding the on/off (or color) state of every pixel of a display, which is transferred to the Display Driver Chip to update the visible image.

**Example:** Setting bits in the Framebuffer and calling `.show()` updates the OLED Display Module with the current Spectrum Bars.

#### Free Memory Query

A function call that reports how much RAM remains available for allocation on a microcontroller, used to diagnose memory pressure.

**Example:** Calling `gc.mem_free()` as a Free Memory Query before and after loading a Twiddle Factor Table shows how much RAM the table consumes.

#### Frequency Candidate Sweep

The act of systematically testing a signal's Correlation against many different Test Frequency values in turn to build up a full spectrum.

**Example:** A Frequency Candidate Sweep from 0 Hz to the Nyquist Frequency in fixed steps reproduces the same result as computing the full DFT.

#### Frequency Domain

A representation of a signal in terms of the strength and phase of its constituent frequencies, as opposed to its value over time.

**Example:** The FFT converts an Audio Buffer from the Time Domain into the Frequency Domain so a student can see which pitches are present.

#### Frequency Folding

The specific pattern by which frequencies above the Nyquist Frequency "reflect" back into the valid frequency range during Aliasing, as if folded around that boundary.

**Example:** A tone at 1 kHz above the Nyquist Frequency appears, due to Frequency Folding, at 1 kHz below it in the sampled spectrum.

#### Frequency Parameter

A variable specifying how many cycles per second a synthesized or analyzed sinusoid completes, one of the three defining values of a sine wave alongside Amplitude Parameter and Phase Offset.

**Example:** Sweeping the Frequency Parameter of a Tone Generator across a Frequency Sweep tests every DFT bin in turn.

#### Frequency Resolution Limit

The finest frequency difference a DFT or FFT of a given length and sample rate can distinguish, equal to the Bin Width and fundamentally set by the Sampling Theorem and buffer length.

**Example:** The Frequency Resolution Limit of a 512-point transform at 44.1 kHz is about 86 Hz, too coarse to separate two closely tuned guitar strings without Parabolic Interpolation.

#### Frequency Sweep

A signal or test procedure in which the Test Frequency or the frequency of a Tone Generator is varied continuously or stepwise across a range.

**Example:** A Frequency Sweep test tone that slides from 100 Hz to 5 kHz lets students watch the Spectrum Bars peak track across the display in real time.

#### Full Scale Value

The maximum magnitude representable by a given Integer Precision or Bit Depth, used as a reference point for normalizing or interpreting sample amplitudes.

**Example:** A 16-bit signed sample's Full Scale Value is 32767, and Amplitude Normalization divides raw samples by this value to get a range of -1.0 to 1.0.

#### Function Decomposition

The practice of breaking a large algorithm into smaller, independently testable functions, such as separating Bit Reversal Permutation from the Butterfly Operation loop.

**Example:** Function Decomposition of the FFT into `bit_reverse()`, `butterfly()`, and `fft()` functions makes Debugging By Bisection much easier.

#### Fundamental Frequency

The lowest frequency component of a periodic signal, around which its Overtone and Harmonic Series content are organized, and generally what a listener perceives as the note's Pitch.

**Example:** A guitar string's Fundamental Frequency determines the note name reported by the Chromatic Tuner project.

#### Fused Multiply Add

A single hardware instruction that computes (a * b) + c in one step with only one final Rounding Error, more accurate and often faster than separate VMUL Instruction and VADD Instruction calls.

**Example:** Using a Fused Multiply Add instruction where available can shave cycles off a Complex Multiplication's four-term summation.

#### Fused Rounding

The property of a Fused Multiply Add operation that rounds only once, after the full multiply-then-add computation, rather than after each separate step, reducing accumulated Quantization Error.

**Example:** Fused Rounding gives a Fused Multiply Add slightly better numerical accuracy than performing a VMUL Instruction followed by a separate VADD Instruction.

#### Garbage Collection

An automatic memory-management process that reclaims RAM occupied by objects no longer referenced by a running program, relieving the programmer from manual deallocation.

Garbage Collection can introduce unpredictable pauses, which the course flags as a source of Variance Sources when benchmarking MicroPython code.

**Example:** MicroPython's Garbage Collection can briefly pause a live spectrum display if too many temporary Complex Numbers objects are allocated inside the FFT loop.

#### General Purpose IO

A category of microcontroller hardware pins whose function (digital input, digital output, or a peripheral role) can be configured in software rather than being fixed at manufacture.

**Example:** The Pico 2 exposes dozens of General Purpose IO pins that can be assigned to drive an OLED Display Module, read a Push Button Component, or carry I2S Protocol signals.

#### General Purpose Register

One of a processor's numbered CPU Register locations (such as r0 through r12 on ARM) not dedicated to a single fixed hardware purpose, available for Register Allocation by a program.

**Example:** An Assembly Butterfly routine might use General Purpose Register r0 and r1 to hold pointers into the Audio Buffer.

#### GPIO Pin

A single physical contact on a microcontroller configured for General Purpose IO, addressable in software by a pin number to read or write a Logic Level.

**Example:** GPIO Pin 25 on many Pico boards is wired directly to the Onboard LED.

#### Grading Rubric

A published document detailing exactly how points are allocated across Laboratory Work Grading, Homework And Quiz Grading, the capstone, and the final exam.

**Example:** The Grading Rubric specifies that a capstone's Limitations Statement is worth specific points, not just its measured Speedup Factor.

#### Ground Truth Signal

A synthesized test signal whose exact frequency, amplitude, and phase content are known in advance, used as a reference against which a DFT or FFT implementation's output can be checked.

**Example:** A 440 Hz Ground Truth Signal with amplitude 1.0 should produce a Spectrum Array peak of known Magnitude Of A Complex Number at a known Bin Index.

#### Half Spectrum Display

Showing only the first half of a real-input FFT's Spectrum Array, from the DC Bin to the Nyquist Bin, since the remainder is a redundant Mirror Spectrum.

**Example:** A Half Spectrum Display of a 1024-point transform draws only 512 useful bins instead of all 1024.

#### Halfword

A 16-bit unit of data, half the size of a standard 32-bit word, the size of most basic Thumb Instruction Set encodings.

**Example:** A simple MOV Move Instruction fits in a single Halfword, while a more complex Thumb-2 Encoding instruction may require two.

#### Hamming Window

A tapering function similar to the Hanning Window but using slightly different coefficients, offering a different tradeoff between Main Lobe Width and Side Lobe Level.

**Example:** The course has students compare a Hamming Window against a Hanning Window on the same Two-Tone Signal to observe the resulting Window Tradeoff.

#### Hanning Window

A tapering function that smoothly reduces a signal segment's amplitude to zero at both ends using a raised cosine shape, reducing Spectral Leakage compared to a Rectangular Window.

**Example:** Applying a Hanning Window before the FFT noticeably sharpens the Live Spectrum Display's peaks compared to leaving the signal unwindowed.

#### Hardware Feature Gate

A conditional check in code that only enables a code path, such as an assembly FPU routine, when Capability Probing confirms the required hardware is actually present.

**Example:** A Hardware Feature Gate around the Assembly Butterfly routine prevents it from running, and crashing, on a board without a Floating Point Unit.

#### Hardware Kit Cost

The total approximate price of all physical components, including the Raspberry Pi Pico 2, OLED Display Module, and INMP441 Microphone Module, needed to complete the course.

**Example:** The course's Hardware Kit Cost is designed to stay near five dollars for the core microcontroller, consistent with the course's low-cost hands-on philosophy.

#### Harmonic Distortion

Unwanted signal energy appearing at integer multiples of a Fundamental Frequency, introduced by non-linear effects such as Clipping rather than present in the original source.

**Example:** Harmonic Distortion from an overdriven microphone shows up as unexpected Spectrum Bars at 2x and 3x the true tone's frequency.

#### Harmonic Series

The sequence of frequencies at integer multiples of a Fundamental Frequency, whose relative amplitudes shape a sound's Timbre.

**Example:** A Square Wave's Harmonic Series contains only odd multiples of its Fundamental Frequency.

#### Harness Noise Floor

The baseline measurement variability inherent in a benchmarking setup itself, such as timer Timer Resolution and Interrupt Interference, below which no real effect can be reliably detected.

**Example:** A student's claimed 2% Speedup Factor was judged not significant because it fell within the benchmarking Harness Noise Floor.

#### Headroom

The margin between a signal's typical peak level and the Full Scale Value of its representation, reserved to absorb unexpected loud transients without Clipping.

**Example:** Setting Amplitude Normalization to use only 80% of Full Scale Value leaves Headroom for an unexpectedly loud clap during the live demo.

#### Heap Fragmentation

A condition in which available RAM becomes divided into many small, non-contiguous free blocks over time, potentially preventing allocation of a large Audio Buffer even when total free memory seems sufficient.

**Example:** Repeatedly allocating and discarding small Complex Numbers objects inside the FFT loop can worsen Heap Fragmentation and eventually cause allocation failures despite an apparently healthy Free Memory Query result.

#### Hidden Frequency Detection

The task of identifying which frequencies are present in a signal when they are not visually obvious from a Time Domain plot alone.

**Example:** Hidden Frequency Detection of a quiet 3 kHz tone buried in noisy microphone data becomes easy once the signal is viewed in the Frequency Domain.

#### Homework And Quiz Grading

The portion of a student's final grade determined by written assignments and short quizzes assessing Remember Level Outcome and Understand Level Outcome material.

**Example:** Homework And Quiz Grading includes short quizzes on Radians, Euler's Formula, and other math-foundation topics before the FFT unit begins.

#### Honest Reporting

The practice of disclosing all relevant details of a benchmark, including its limitations and any Negative Result, rather than presenting only favorable outcomes.

**Example:** Honest Reporting means noting that a hand-optimized Butterfly Operation actually ran slower on one test size, not just highlighting where it won.

#### Hop Size

The number of new samples advanced between successive analysis windows when using Overlap Processing, smaller than the full buffer length.

**Example:** A Hop Size of 256 samples with a 1024-sample analysis window produces 75% Overlap Processing between consecutive frames.

#### Hot Loop

A section of code, such as the FFT's innermost Butterfly Operation loop, that executes very frequently and therefore dominates a program's total runtime, making it the natural target for optimization.

**Example:** Profiling identified the Stage Loop as the program's Hot Loop, justifying the effort of rewriting it as an Assembly Butterfly.

#### Hypothesis Statement

A specific, testable prediction made before running an experiment about how the Dependent Variable will respond to a change in the Independent Variable.

**Example:** A Hypothesis Statement might read: "The Assembly Butterfly will run at least five times faster than the MicroPython Reference Implementation at N=1024."

#### I2S Protocol

A synchronous digital audio bus standard using a Bit Clock, a Word Select Line, and a data line to stream stereo or mono PCM audio samples between chips.

**Example:** The Pico 2 reads live audio from the INMP441 Microphone Module using the I2S Protocol built into its General Purpose IO peripherals.

#### I2S Serial Data

The I2S Protocol line that carries the actual audio sample bits, shifted in or out synchronously with the Bit Clock.

**Example:** Binary Data Unpacking converts the raw bytes read from I2S Serial Data into signed integer audio samples for further processing.

#### Imaginary Part

The coefficient of the Imaginary Unit in a complex number, corresponding to the b in a + bi, geometrically the vertical coordinate on the complex plane.

**Example:** In a DFT output bin, the Imaginary Part corresponds to the Quadrature Component of the detected sinusoid.

#### Imaginary Unit

The number i (or j in some notations), defined as the square root of -1, that extends real numbers into Complex Numbers.

**Example:** Euler's Formula uses the Imaginary Unit to link complex exponentials directly to the Sine Wave and Cosine Function.

#### Import Path

The ordered list of filesystem locations MicroPython searches, in sequence, when resolving a Module Import statement to a specific file.

**Example:** Because the Library Directory is on the Import Path by default, `import ssd1306` finds the driver without specifying its full location.

#### Impulse Response Test

A validation technique that feeds a single non-zero sample (an impulse) into a system and inspects the resulting output, useful for revealing a transform's underlying Basis Function structure.

**Example:** An Impulse Response Test on the DFT produces a Spectrum Array that is flat across all frequencies, confirming the transform treats every Test Frequency equally.

#### In Phase Component

The part of a signal's correlation with a reference frequency measured using a Cosine Function reference, corresponding to the Real Part of a DFT bin.

**Example:** The In Phase Component alone cannot detect a tone that happens to align exactly with the Sine Wave reference, which is why the Quadrature Component is also needed.

#### In Place Computation

Performing an algorithm's work using only the input array's own memory for both input and output, without allocating a separate output array.

**Example:** The Iterative FFT's In Place Computation, combined with In Place Reordering, keeps its RAM footprint to a single Audio Buffer-sized array.

#### In Place Reordering

Rearranging an array's elements, such as during Bit Reversal Permutation, using only the array's own memory rather than allocating a second array.

**Example:** In Place Reordering of the FFT's input array avoids doubling the RAM needed for a large transform on the memory-limited Pico 2.

#### Independent Variable

The factor deliberately changed between test conditions in an experiment, whose effect on the Dependent Variable is being studied.

**Example:** In a Variant Comparison of implementation languages, the Independent Variable is which language or optimization level is used.

#### Index Reversal

A synonym in this course for the bit-level reversal operation applied to array indices during the Bit Reversal Permutation step of the FFT.

**Example:** Index Reversal of the 3-bit index 5 (101) produces 5 again, since it is a palindrome in binary.

#### Inline Assembler

A MicroPython feature that allows short sequences of raw ARM assembly instructions to be written directly inside a decorated Python function using the Assembly Decorator.

**Example:** The course's first Inline Assembler example adds two numbers using a single ARM Add Instruction embedded directly in a `.py` file.

#### INMP441 Microphone Module

The specific breakout board included in the course's hardware kit, built around a MEMS Microphone chip that outputs digital audio over the I2S Protocol.

**Example:** The INMP441 Microphone Module is the audio input source for every sampling, spectral analysis, and capstone lab in the course.

#### Instruction Encoding

The specific binary bit pattern that represents a single Machine Code instruction, following rules defined by the Instruction Set Architecture.

**Example:** Decoding the Instruction Encoding of a VADD Instruction by hand shows exactly which bits specify its source and destination Floating Point Register operands.

#### Instruction Encoding Error

A mistake in manually or programmatically constructing an instruction's Raw Machine Word, causing the processor to execute an unintended operation or fault.

**Example:** An Instruction Encoding Error that set the wrong Encoding Bit Field caused a VADD Instruction to silently behave like a VSUB Instruction instead.

#### Instruction Mnemonic

The short, human-readable text abbreviation, such as ADD or MOV, standing in for a specific binary Opcode in assembly language source code.

**Example:** The Instruction Mnemonic `VMUL` corresponds to a specific Opcode within the FPv5 Floating Point Unit's instruction Encoding Table.

#### Instruction Reference Manual

The official ARM documentation defining every instruction's Instruction Mnemonic, valid operands, and exact Instruction Encoding for a given Instruction Set Architecture.

**Example:** The course points students to the relevant Instruction Reference Manual chapter whenever a VLDR Instruction or VSTR Instruction behaves unexpectedly.

#### Instruction Set Architecture

The complete specification of a processor family's machine instructions, registers, and encoding rules, defining what programs written for it can and cannot do.

**Example:** The Pico 2's ARM Cortex M33 Processor implements the ARMv8-M Instruction Set Architecture, which differs from the ARMv6-M used in the original Pico's chip.

#### Instructor's Guide

A companion document to the student-facing course materials, providing teaching notes, common misconceptions, and additional context not needed by students directly.

**Example:** The Instructor's Guide explains the pedagogical reasoning behind each Engineered Productive Failure lab, information not shown to students in the main text.

#### Instrument Identifier Project

A capstone track that classifies which musical instrument produced a recorded note by comparing its Timbre, via relative Overtone magnitudes in its Spectrum Array, against reference profiles.

**Example:** The Instrument Identifier Project relies heavily on accurate Magnitude Computation across many bins, not just a single Peak Bin.

#### Instrumentation Overhead

The extra time or resources consumed specifically by the act of measuring a program, as distinct from the program's actual work, related to the Observer Effect.

**Example:** Instrumentation Overhead from reading the Cycle Counter twice per Butterfly Operation would be unacceptable, so the course times whole FFT calls instead.

#### Integer Overflow

An error condition where an arithmetic result exceeds the maximum value representable at a given Integer Precision, causing the value to wrap around unexpectedly.

**Example:** Summing many samples for a Root Mean Square calculation without care can trigger Integer Overflow in a fixed-point accumulator, corrupting the Sound Level reading.

#### Integer Precision

The number of bits used to represent a whole number, determining its maximum magnitude before Integer Overflow occurs.

**Example:** A 16-bit microphone sample uses Integer Precision that can represent values from -32768 to 32767 before Signed Integer Conversion.

#### Integration Cost

The extra effort or performance overhead incurred specifically by combining separately developed components, such as an Assembly Butterfly and a MicroPython Stage Loop, into one working system.

**Example:** Integration Cost at the Python Assembly Boundary ate into some of the raw Speedup Factor the Assembly Butterfly showed in isolation.

#### Interleaved Layout Variant

A specific implementation variant that stores complex data using Interleaved Storage rather than separate real and imaginary arrays, compared against alternatives in a Variant Comparison.

**Example:** The Interleaved Layout Variant of the Assembly Butterfly simplified Pointer Arithmetic but required a larger Byte Offset per step than the separate-array alternative.

#### Interleaved Storage

A data layout that stores the real and imaginary components of each complex sample next to each other in a single flat array, rather than in two separate arrays.

**Example:** An Interleaved Storage layout stores `[re0, im0, re1, im1, ...]` in one array, which some Assembly Butterfly routines can access more efficiently than separate arrays.

#### Interpreter Selection

The step in an IDE where the user specifies which language runtime or connected device should execute the code, such as choosing "MicroPython (generic)" instead of a desktop Python interpreter.

**Example:** In Thonny IDE, a student selects "MicroPython (Raspberry Pi Pico)" from the interpreter menu so code runs on the board rather than on the laptop.

#### Interrupt Interference

Additional, unpredictable delay in a timed measurement caused by the processor briefly pausing to service a hardware interrupt unrelated to the code being benchmarked.

**Example:** Interrupt Interference from a background USB Serial Connection poll occasionally inflates one Cycle Counter measurement out of every hundred.

#### Inverse FFT

An FFT variant that computes the Inverse Transform Convention, converting a Spectrum Array back into a Time Domain signal, typically by conjugating Twiddle Factor values and scaling by 1/N.

**Example:** Applying the Inverse FFT to an unmodified Spectrum Array should reconstruct the original audio samples, providing another Cross Validation check.

#### Inverse Transform Convention

The mathematical sign and scaling convention used when converting a Spectrum Array back into a Time Domain signal, typically requiring a division by N that the Forward Transform Convention omits.

**Example:** Applying the Inverse Transform Convention to an unmodified Spectrum Array should reconstruct the original audio samples almost exactly, verifying correctness.

#### ISA Versus Toolchain

The distinction between what an Instruction Set Architecture permits in principle and what a specific software toolchain, such as MicroPython's assembler, actually supports.

**Example:** A student researching ISA Versus Toolchain differences discovers that ARMv8-M supports an instruction MicroPython's Inline Assembler cannot directly emit.

#### Iterative FFT

An FFT implementation written as nested loops over Logarithmic Stages rather than as recursive function calls, typically operating In Place Computation after a Bit Reversal Permutation.

**Example:** The course moves from a Recursive Decomposition FFT to an Iterative FFT because the latter avoids function-call overhead on the Pico 2.

#### Jumper Wire

A short, flexible wire with connector pins on each end, used to make electrical connections between a microcontroller's GPIO Pin headers and a Breadboard.

**Example:** A handful of Jumper Wire connections links the Pico 2's SPI Clock Line and Chip Select Line to the OLED Display Module.

#### Kernel Versus Total Time

The distinction between the time spent in an algorithm's core computational routine (its "kernel," such as the Butterfly Operation) and the total end-to-end time including setup, I/O, and Data Marshalling Cost.

**Example:** A Kernel Versus Total Time comparison showed the Assembly Butterfly kernel was 20x faster, but total frame time only improved 3x once Data Marshalling Cost was included.

#### Keyboard Interrupt

A signal sent from the IDE (conventionally Ctrl-C) that stops a running MicroPython script and returns control to the Read Eval Print Loop.

**Example:** A student presses Ctrl-C in Thonny IDE to halt a runaway While Loop that is flooding the console with Print Statement output.

#### Known Signal Test

A validation technique that feeds a Ground Truth Signal into an algorithm and checks that the output matches the mathematically expected result within some Numerical Tolerance.

**Example:** Running a Known Signal Test with a pure Sine Wave catches sign errors in a student's DFT implementation before it is trusted on real audio.

#### Lab Demonstrated Outcome

A specific, observable skill or result a student must show working correctly during a lab session, used as a concrete checkpoint for a Bloom's Taxonomy level.

**Example:** A Lab Demonstrated Outcome for the FFT week is a working Cross Validation match between a student's FFT and DFT Reference Implementation.

#### Laboratory Work Grading

The portion of a student's final grade determined by completed and demonstrated hands-on lab exercises throughout the semester.

**Example:** Laboratory Work Grading rewards a working Lab Demonstrated Outcome for each week's hardware exercise, not just a written report.

#### Language Tradeoff Analysis

A structured comparison of the speed, development effort, and readability tradeoffs between implementing the same algorithm in different languages or compilation modes.

**Example:** The course's Language Tradeoff Analysis lab times the identical Butterfly Operation logic in plain MicroPython, Viper, and assembly to make the Abstraction Cost concrete.

#### Level Meter

A device or program feature that continuously displays a signal's current Sound Level, typically updated many times per second.

**Example:** The course's first audio lab builds a simple Level Meter before moving on to full spectral analysis.

#### Library Directory

A folder on the Device Filesystem, conventionally named `lib`, where reusable MicroPython modules are stored so they can be found by Module Import statements.

**Example:** The `ssd1306.py` driver is copied into the Pico 2's Library Directory so any script can `import ssd1306`.

#### Library Over Handwritten Code

A design choice to use an existing, well-tested library implementation rather than writing custom code, weighed against the speed or educational benefits of a hand-optimized version.

**Example:** The course discusses Library Over Handwritten Code tradeoffs when comparing a vendor DSP FFT library against the students' own hand-tuned Assembly Butterfly implementation.

#### Limitations Statement

A section of a report honestly describing the known weaknesses, untested conditions, or possible sources of error in a study's Experimental Design.

**Example:** A Limitations Statement might note that a capstone's Speedup Factor was measured only at one transform size and might not generalize to others.

#### Live Spectrum Display

A real-time visualization that continuously captures audio, computes its FFT, and redraws Spectrum Bars fast enough to appear smoothly animated.

**Example:** The course's Live Spectrum Display project is the first to combine Frame Capture, an FFT, and a Draw Show Loop Pattern into a single working system.

#### Live VU Meter

An interactive project that continuously displays a running measure of audio Sound Level in real time, typically as animated Spectrum Bars or a Bar Graph Display.

**Example:** The Live VU Meter lab combines Buffered Read, Root Mean Square, and Exponential Smoothing into a responsive on-screen meter.

#### Load Bearing Module

A course module or concept whose understanding is a hard prerequisite for later material, such that skipping it would collapse a student's ability to follow subsequent labs.

**Example:** The Discrete Fourier Transform module is a Load Bearing Module, since the entire FFT unit assumes students already understand Correlation and Basis Function concepts.

#### Load Store Architecture

A processor design principle, used by ARM, in which arithmetic instructions operate only on register values, and separate explicit instructions are required to move data between memory and registers.

**Example:** Because ARM uses a Load Store Architecture, an Assembly Butterfly routine must issue a VLDR Instruction to bring a sample from RAM into a Floating Point Register before it can be added.

#### Local Maximum

A data point in a Spectrum Array whose Magnitude Computation value is greater than both of its immediate neighbors, a candidate for Peak Bin selection.

**Example:** An Argmax Search finds the global Local Maximum across the whole spectrum, while more advanced peak-finding also considers smaller local maxima for Overtone content.

#### Logarithmic Scaling

Displaying values on a scale where equal steps represent equal ratios rather than equal differences, matching Loudness Perception more closely than a linear scale.

**Example:** Logarithmic Scaling of Spectrum Array magnitudes, similar to the Decibel Scale, keeps quiet harmonics visible alongside a much louder fundamental.

#### Logarithmic Stages

The property that an N-point Radix 2 Algorithm FFT requires exactly log2(N) sequential levels of computation, each halving the problem via the Even Odd Split.

**Example:** A 1024-point FFT (2^10) completes in 10 Logarithmic Stages, each one a full pass of Butterfly Operation calculations.

#### Logic Level

One of the two discrete voltage states, conventionally called high (1) and low (0), that a digital circuit uses to represent binary information.

**Example:** A GPIO Pin configured for Digital Output drives roughly 3.3 volts for a high Logic Level on the Pico 2.

#### Long Press Detection

A technique that distinguishes a button held down for an extended duration from a brief tap, typically by measuring elapsed time between a press's Edge Detection and its release.

**Example:** Long Press Detection on the Tactile Switch triggers Auto Calibration of the sound-level meter, while a short press only advances Mode Switching.

#### Lookup Table

A precomputed array of values indexed directly by position, used to replace an expensive runtime calculation with a fast memory read.

**Example:** The Twiddle Factor Table is a Lookup Table that replaces per-Butterfly Operation calls to sine and cosine.

#### Loop Invariant Hoisting

An optimization technique that moves a calculation which produces the same result on every iteration of a loop outside the loop body, so it executes only once.

**Example:** Loop Invariant Hoisting moves the Twiddle Factor Table lookup for a given Stage Loop out of the innermost Butterfly Pair loop where it does not change.

#### Loop Overhead

The fixed cost, in extra instructions and cycles, of maintaining a loop's counter and Conditional Branch on every iteration, separate from the useful work the loop body performs.

**Example:** Loop Overhead becomes proportionally significant when each Assembly Loop iteration performs only a single, very cheap Butterfly Operation.

#### Loudness Perception

The subjective, non-linear way the human ear interprets sound intensity, which the Decibel Scale is designed to approximate more closely than raw linear amplitude.

**Example:** Because Loudness Perception is roughly logarithmic, doubling a signal's raw Root Mean Square value sounds far less than twice as loud.

#### Machine Code

The raw binary numeric instructions a processor directly executes, produced by assembling Instruction Mnemonic text or compiling higher-level source code.

**Example:** Assembling a VADD Instruction mnemonic produces a specific 16-bit or 32-bit Machine Code word the Cortex M33 Processor can fetch and execute.

#### Machine Type

A low-level data type, such as `int` or `ptr`, recognized by the Viper Code Emitter for Type Annotation, mapping closely to how ARM assembly represents values.

**Example:** The `ptr32` Machine Type lets Viper code read and write RAM directly as an array of 32-bit words.

#### Magnitude Computation

The step of converting each complex Spectrum Array entry into a single real number representing signal strength, using the Magnitude Of A Complex Number formula.

**Example:** Magnitude Computation on the raw FFT output is required before drawing Spectrum Bars, since a bar height cannot represent a complex value directly.

#### Magnitude Of A Complex Number

The distance of a complex number from the origin on the complex plane, computed as the square root of the sum of its Real Part and Imaginary Part squared.

**Example:** Magnitude Of A Complex Number applied to a DFT bin gives the strength of that frequency in the original signal, independent of Phase Angle.

#### Main Lobe Width

The width, in bins, of the central peak a window function produces around a single true frequency, wider windows generally trading width for lower Side Lobe Level.

**Example:** The Rectangular Window has the narrowest Main Lobe Width of the windows compared in this course, but the worst Side Lobe Level.

#### Mascot Pedagogical Device

A recurring illustrated character used in course materials to introduce tips, warnings, or common misconceptions in a consistent, approachable voice.

**Example:** A course mascot appears in an admonition box to warn students that Integer Overflow silently wraps around instead of raising an error in MicroPython.

#### Measurement Discipline

The set of careful practices, such as Warm Up Discard, Best Of N Sampling, and Counter Verification, that together produce trustworthy benchmark results.

**Example:** The course insists on Measurement Discipline before allowing any Speedup Factor claim to be included in a lab report.

#### Memory Address

A numeric value identifying a specific location in a microcontroller's RAM or Flash Memory, used by Load Store Architecture instructions to read or write data.

**Example:** The Memory Address of the first element in an Audio Buffer is passed into an Assembly Butterfly routine as a General Purpose Register argument.

#### Memory Mapped Register

A hardware control or status value that a processor can read or write using ordinary memory-load and memory-store instructions at a fixed address, rather than through special instructions.

**Example:** The DWT Unit's Cycle Count Register is exposed as a Memory Mapped Register that MicroPython or assembly code can read directly to time a routine.

#### MEMS Microphone

A microphone built using micro-electromechanical systems (MEMS) fabrication, integrating a tiny mechanical diaphragm and signal-conditioning circuitry on a single small chip.

**Example:** The course's INMP441 Microphone Module is a MEMS Microphone that outputs digital audio directly over the I2S Protocol, avoiding the need for an analog-to-digital converter chip.

#### Methodology Section

The part of a report describing exactly how an experiment was conducted, including hardware, test signals, and measurement procedure, sufficient to support Reproducibility.

**Example:** A capstone report's Methodology Section states the board revision, CPU Clock Frequency, transform size, and Best Of N Sampling count used.

#### Microcontroller

A small, self-contained computer chip combining a processor core, RAM, flash memory, and I/O peripherals on a single die, used to run embedded software without an operating system.

**Example:** The Raspberry Pi Pico 2 is a microcontroller board built around an ARM Cortex-M33 chip, used throughout this course to sample audio and compute FFTs in real time.

#### MicroPython

A compact implementation of the Python 3 language and standard library optimized to run on microcontrollers with limited RAM and flash memory.

MicroPython lets students prototype hardware and DSP logic quickly before dropping into ARM assembly for the optimized stages of the course.

**Example:** The course's early labs read a MEMS Microphone and blink an Onboard LED using a few lines of MicroPython instead of C.

#### Microsecond Timer

A software or hardware timer that reports elapsed time with one-millionth-of-a-second resolution, finer than a Millisecond Timer but still coarse compared to a Cycle Counter.

**Example:** `time.ticks_us()` provides a Microsecond Timer that can distinguish the runtime of a small FFT from a larger one more precisely than millisecond timing.

#### Midterm Assessment

A graded evaluation occurring roughly halfway through the course, typically covering material through the DFT and into the early FFT unit.

**Example:** The Midterm Assessment tests whether students can correctly implement and Cross Validation-check an 8-Point DFT Example by hand.

#### Millisecond Timer

A software or hardware timer that reports elapsed time with one-thousandth-of-a-second resolution, adequate for coarse timing but too imprecise for measuring a single Butterfly Operation.

**Example:** MicroPython's `time.ticks_ms()` is a Millisecond Timer, useful for measuring an entire FFT call but too coarse for a single instruction.

#### Minimum Sample Statistic

The smallest value observed across a set of repeated timing measurements, used as the benchmark result under Best Of N Sampling because it is least affected by transient slowdowns.

**Example:** The Minimum Sample Statistic from 50 timed FFT runs is reported in the Benchmark Report Format rather than the average.

#### 45-Minute Lab Format

The course's standard time-boxed structure for a single hands-on lab session, designed to fit one hardware exercise with room for a Predict Then Measure Pattern step.

**Example:** The 45-Minute Lab Format for the Butterfly Operation lab budgets roughly ten minutes for prediction, twenty-five for implementation, and ten for measurement and discussion.

#### Mirror Spectrum

The redundant, symmetric upper half of a real-signal DFT's Spectrum Array, a direct consequence of Spectrum Symmetry and typically discarded in a Half Spectrum Display.

**Example:** Ignoring the Mirror Spectrum halves the data a student needs to plot without losing any real information.

#### Mixed Radix FFT

An FFT variant that splits a transform of length N into subproblems of different sizes (not exclusively two), allowing transform lengths that are not pure powers of two.

**Example:** A Mixed Radix FFT could handle a 12-point transform by splitting into subproblems of size 3 and 4, unlike the Radix 2 Algorithm's Power Of Two Constraint.

#### Mode Switching

Changing a program's current operating state or display screen in response to user input, such as a button press, so different functionality becomes active.

**Example:** Pressing a Tactile Switch performs Mode Switching between the live spectrum view and the chromatic tuner view on the same OLED Display Module.

#### Module Import

A statement that loads a separate MicroPython file's code and makes its functions and variables available in the current script.

**Example:** `from config import OLED_CS_PIN` performs a Module Import that pulls a pin number from the Shared Configuration Module.

#### Monochrome Display

A screen capable of showing only two states per pixel (on or off), as opposed to grayscale or color, commonly used for compact, low-power status displays.

**Example:** The course's OLED Display Module is a Monochrome Display, so Spectrum Bars are drawn as simple lit or unlit pixel columns.

#### Move Instruction

An ARM assembly instruction (MOV) that copies a value from one CPU Register to another, or loads an immediate constant into a register.

**Example:** `MOV r2, r0` is a Move Instruction that copies the pointer in register r0 into register r2.

#### Moving Average

A smoothing technique that continuously computes the average of the most recent N samples, used to reduce noise or estimate a slowly varying quantity like DC Offset.

**Example:** A Moving Average of the last 100 microphone samples tracks slow DC Offset drift without reacting to individual audio peaks.

#### mpremote Tool

A command-line utility for interacting with a MicroPython device, supporting File Transfer, running scripts, and opening a Read Eval Print Loop without a full IDE.

**Example:** A student runs `mpremote cp main.py :` from a terminal to copy a file to the Pico 2 using the mpremote Tool instead of Thonny IDE.

#### Multi Dimensional Transform

A Fourier-type transform applied across more than one dimension, such as a 2D FFT used for image processing, outside the one-dimensional audio focus of this course.

**Example:** A Multi Dimensional Transform used in image compression is mentioned only as a conceptual extension beyond this course's one-dimensional Spectrum Array work.

#### Multiply And Sum

The elementary two-step arithmetic operation of multiplying corresponding elements of two sequences and adding the products together, the mechanical basis of Correlation and the Dot Product.

**Example:** Computing one DFT bin requires a Multiply And Sum between the input signal and a complex exponential Basis Function.

#### Multiply By I Shortcut

A Special Case Optimization that replaces a Complex Multiplication by the imaginary unit with a simple swap-and-negate of the real and imaginary components, avoidable via a VNEG Instruction.

**Example:** The Multiply By I Shortcut turns a Trivial Twiddle case into two register moves and one VNEG Instruction instead of a full Complex Multiplication.

#### Multiply By One Shortcut

A Special Case Optimization that skips the entire Complex Multiplication step when the Twiddle Factor equals exactly 1, since multiplying by one changes nothing.

**Example:** The Multiply By One Shortcut removes four real multiplications from every first Butterfly Pair of each Logarithmic Stages level.

#### Musical Note Mapping

The process of converting a frequency in Hertz into the name of the nearest musical note, using the Semitone Formula and a Reference Pitch.

**Example:** Musical Note Mapping converts a detected 293.66 Hz Peak Bin frequency into the note name "D4."

#### Nanosecond Resolution

Timing precision at the billionth-of-a-second level, finer than what a Microsecond Timer offers and achievable on the Pico 2 only via direct Cycle Counter readings converted with Cycles To Time Conversion.

**Example:** A single Butterfly Operation taking about 20 cycles at 133 MHz corresponds to roughly 150 nanoseconds, a duration only visible at Nanosecond Resolution.

#### Native Code Emitter

A MicroPython compilation mode that translates a decorated function directly into native ARM machine code ahead of time, rather than using Bytecode Interpretation.

**Example:** Marking a function with the Native Decorator invokes the Native Code Emitter, typically giving a modest Speedup Factor over standard MicroPython.

#### Native Decorator

The MicroPython `@micropython.native` decorator that triggers the Native Code Emitter for a specific function.

**Example:** Adding the Native Decorator above a Python Butterfly Operation function is the easiest first optimization step students try, before moving to Viper or assembly.

#### Negative Frequency

The mathematical mirror-image frequency component, above the Nyquist Bin, produced by the DFT of a real signal due to Spectrum Symmetry, without physical meaning of its own.

**Example:** Bin Index 900 of a 1024-point real-input DFT corresponds to a Negative Frequency mirror of Bin Index 124.

#### Negative Result

A benchmark outcome in which an expected optimization fails to improve performance, or actually makes it worse, reported honestly rather than discarded.

**Example:** A Negative Result showed that Loop Invariant Hoisting on a very small FFT actually added Instrumentation Overhead exceeding its benefit.

#### No Compiler Required

A course design feature stating that students never need to install or use a full cross-compiler toolchain, since MicroPython's Inline Assembler handles Instruction Encoding directly.

**Example:** No Compiler Required means a student can go from Thumb Instruction Set mnemonics to running Machine Code without installing GCC or any separate ARM toolchain.

#### Noise Floor

The baseline level of unwanted signal (electrical noise, ambient sound, or measurement error) present even when no meaningful signal is being measured.

**Example:** A quiet room's Noise Floor sets the minimum Sound Level the meter will ever report, and the Auto Calibration step measures it directly.

#### Non ARM Instruction Sets

Processor instruction set families, such as x86 or RISC-V, that this course does not cover, since all hardware labs target the ARM Cortex M Architecture exclusively.

**Example:** Non ARM Instruction Sets like x86 SIMD extensions are mentioned only briefly for context, since the Pico 2 uses ARMv8-M.

#### Non Power Of Two Transform

A transform length that does not satisfy the Power Of Two Constraint, requiring approaches like Mixed Radix FFT or Bluestein's Algorithm, treated only briefly in this course.

**Example:** A Non Power Of Two Transform of length 1000 would need zero-padding to 1024 rather than a dedicated algorithm in this course's labs.

#### Numerical Tolerance

The small allowed margin of difference between a computed result and its expected value, accounting for unavoidable rounding in Float Precision or Fixed Point Q15 Arithmetic.

**Example:** A Known Signal Test might accept any Absolute Error under 0.001 as passing, given the Numerical Tolerance of 32-bit floats.

#### Nyquist Bin

The middle Bin Index of a Spectrum Array, exactly at N/2, corresponding to the Nyquist Frequency and marking the boundary of Spectrum Symmetry.

**Example:** For N=1024, the Nyquist Bin is Bin Index 512.

#### Nyquist Frequency

Half of the sampling rate; the highest frequency that can be unambiguously represented in a digitally sampled signal per the Sampling Theorem.

**Example:** At a 44.1 kHz Sample Rate Selection, the Nyquist Frequency is 22.05 kHz, and the DFT's Nyquist Bin corresponds exactly to this frequency.

#### O(N Log N) Complexity

The Algorithmic Complexity class characteristic of the FFT, in which runtime grows proportionally to N times the logarithm of N, far slower than the DFT's Quadratic Complexity for large N.

**Example:** O(N Log N) Complexity means doubling the FFT's transform size only slightly more than doubles its runtime, unlike the DFT's quadrupling.

#### Observer Effect

The phenomenon where the act of measuring a system's performance, such as adding timing code, itself changes that performance, potentially producing misleading results.

**Example:** Wrapping every single Butterfly Operation in its own Cycle Counter read-and-print call demonstrates the Observer Effect by making the whole FFT run far slower than normal.

#### Octave

A frequency interval in which the higher pitch has exactly double the frequency of the lower one, a fundamental unit of musical pitch organization.

**Example:** A note one Octave above 440 Hz is 880 Hz.

#### Off Bin Tone

A test tone whose frequency falls between two DFT or FFT Bin Center Frequency values, violating the Periodic Extension Assumption and producing visible Spectral Leakage.

**Example:** An Off Bin Tone demonstrates Spectral Leakage clearly, spreading energy across several neighboring bins instead of one.

#### OLED Display Module

The small monochrome screen, driven by an SSD1306 Controller over Serial Peripheral Interface, included in the course's hardware kit for visual output.

**Example:** The OLED Display Module displays everything from the Live VU Meter to the Chromatic Tuner's note name throughout the course.

#### On Bin Tone

A test tone whose frequency exactly matches a DFT or FFT Bin Center Frequency, satisfying the Periodic Extension Assumption and producing minimal Spectral Leakage.

**Example:** An On Bin Tone at exactly the 10th Bin Center Frequency produces a Spectrum Array with energy in essentially one bin only.

#### Onboard LED

A light-emitting diode built directly onto a microcontroller board and wired to a fixed GPIO Pin, commonly used as a first "hello world" output test.

**Example:** The first MicroPython lab in the course blinks the Pico 2's Onboard LED to confirm Firmware and USB Serial Connection are working.

#### Opcode

The portion of an instruction's Instruction Encoding that identifies which operation (such as add, move, or branch) the processor should perform.

**Example:** Two different Instruction Mnemonic entries, such as ADD and SUB, correspond to two different Opcode bit patterns within the same Encoding Table.

#### Operation Counting

The practice of tallying the number of arithmetic operations (multiplications, additions) an algorithm performs, used to predict and explain its Scaling Behavior.

**Example:** Operation Counting shows the direct DFT performs roughly N^2 complex multiplications, while the FFT performs roughly N*log2(N).

#### Optimistic Prediction Pattern

A commonly observed student tendency to predict larger speed improvements from an optimization than actually occur, useful as a teaching moment about Amdahl's Law and Sub Linear Composition.

**Example:** The Optimistic Prediction Pattern shows up almost every time students guess the Speedup Factor of combining multiple optimizations at once.

#### Optimization Attribution

The practice of isolating and measuring the specific performance contribution of one individual optimization technique, separate from the combined effect of several applied together.

**Example:** Optimization Attribution measured that the Multiply By One Shortcut alone contributed about 15% of the total Speedup Factor in the final assembly FFT.

#### Optimization Composition

The effect of combining multiple individual optimizations together, which may produce more, less, or exactly the sum of their individually measured Speedup Factor contributions.

**Example:** Optimization Composition of the Multiply By One Shortcut and Table Hoisting Optimization together produced a slightly smaller combined Speedup Factor than adding their individual gains predicted.

#### Original Pico Incompatibility

The documented fact that the first-generation Raspberry Pi Pico, built on the ARMv6-M Cortex M0 Plus, lacks the FPv5 Floating Point Unit this course's assembly labs require.

**Example:** Original Pico Incompatibility is called out early in the course so students don't mistakenly order the wrong board revision.

#### Orthogonality

A property of a set of Basis Function signals whereby the correlation (dot product) between any two distinct members is zero, allowing each to be measured independently.

**Example:** Orthogonality of sine waves at different Test Frequency values is what allows the DFT to separate a mixed signal into distinct frequency bins without cross-contamination.

#### Overflow Masking

Applying a Bit Mask to a counter's raw value to correctly compute elapsed time even when Counter Wraparound has occurred between two readings.

**Example:** Overflow Masking with a 32-bit mask correctly computes elapsed cycles even if the Cycle Counter wrapped around once during a long benchmark run.

#### Overlap Processing

Reusing a portion of samples from the previous Audio Buffer in the current analysis window, rather than only using entirely fresh samples, to produce smoother frame-to-frame updates.

**Example:** Overlap Processing with a 50% overlap updates the Live Spectrum Display twice as often as non-overlapping Frame Capture would allow.

#### Overtone

Any frequency component of a periodic signal above its Fundamental Frequency, contributing to the signal's perceived Timbre.

**Example:** A violin's rich Overtone content is why it sounds different from a flute even when both play the same Fundamental Frequency.

#### Parabolic Interpolation

A technique that fits a parabola to a Peak Bin and its two neighboring bin magnitudes to estimate a frequency more precisely than the raw Frequency Resolution Limit allows.

**Example:** Parabolic Interpolation improves the Chromatic Tuner's accuracy by estimating a note's true frequency to a fraction of a bin, achieving Sub Bin Accuracy.

#### Parseval's Theorem

A mathematical identity stating that the total energy of a signal in the Time Domain equals the total energy of its representation in the Frequency Domain, providing a powerful correctness check for a transform implementation.

**Example:** Parseval's Theorem gives students a quick sanity check: summing the squared Spectrum Array magnitudes should match the summed squared input samples.

#### Peak Amplitude

The maximum absolute deviation of a waveform from its zero (or DC) level over some interval.

**Example:** A Sine Wave with Peak Amplitude of 1.0 ranges continuously between -1.0 and 1.0.

#### Peak Bin

The Bin Index holding the largest Magnitude Computation value in a Spectrum Array, typically corresponding to a signal's dominant frequency.

**Example:** The tuner project converts the Peak Bin into a Bin To Frequency Mapping and then into a musical note name.

#### Peak Hold Marker

A display feature that remembers and shows the highest recent value of a changing signal, decaying slowly so brief peaks remain visible.

**Example:** A Peak Hold Marker on the Bar Graph Display lingers for a second after a loud clap before falling back toward the current Sound Level.

#### Peak Ratio Threshold

A minimum ratio between a candidate peak's magnitude and the surrounding Noise Floor or average level, required before that peak is accepted as a real signal.

**Example:** A Peak Ratio Threshold of 3x prevents random noise bins from being mistaken for a genuine Fundamental Frequency peak.

#### Peer Review

A process in which students evaluate each other's Methodology Section, Results Presentation, or Conclusion Drawing for soundness and clarity before final submission.

**Example:** A Peer Review session catches a classmate's Cold Start Baseline Mismatch before their capstone report is finalized.

#### Performance Bottleneck

The single stage or operation within a larger process that takes the most time and therefore limits the overall throughput, making it the most valuable target for optimization.

**Example:** Stage Profiling of the spectrum analyzer often reveals Display Refresh, not the FFT itself, as the Performance Bottleneck.

#### Period Of A Wave

The time it takes for one complete cycle of a repeating waveform to occur, equal to the reciprocal of its frequency.

**Example:** A 440 Hz Sine Wave has a Period Of A Wave equal to about 2.27 milliseconds.

#### Periodic Extension Assumption

The implicit assumption underlying the DFT that a finite captured signal segment repeats forever, which is only exactly true when the segment contains a whole number of Period Of A Wave cycles.

**Example:** The Periodic Extension Assumption is why an On Bin Tone produces a clean single peak while an Off Bin Tone suffers Spectral Leakage.

#### Permutation Table

A precomputed array mapping each original index to its Bit Reversal Permutation destination, avoiding repeated bit-manipulation work at runtime.

**Example:** Building a Permutation Table once at startup lets the FFT reorder its input with simple table lookups instead of computing Index Reversal on every call.

#### Phase Angle

The angle a complex number makes with the positive real axis, computed with the arctangent of its Imaginary Part over its Real Part, describing timing offset rather than strength.

**Example:** Arctangent Phase Recovery computes the Phase Angle of a DFT bin to determine when, within its cycle, a detected tone began.

#### Phase Independence

The property that a correctly implemented frequency-detection method reports a tone's presence and strength regardless of when, within its cycle, the tone happens to start.

**Example:** Using both In Phase Component and Quadrature Component gives the DFT Phase Independence, unlike the flawed Sine Only Detector Blind Spot approach.

#### Phase Offset

A shift, measured in Radians or degrees, in where a periodic waveform starts relative to a reference point in time.

**Example:** Two identical tones that differ only by a 90-degree Phase Offset can still produce Destructive Interference when added if their amplitudes align oppositely.

#### Pico 2 W Variant

A version of the Raspberry Pi Pico 2 that adds wireless networking hardware, otherwise sharing the same Cortex M33 Processor and compatible with all course labs.

**Example:** A student using the Pico 2 W Variant can complete every FFT lab identically to a plain Pico 2, simply with unused Wi-Fi hardware onboard.

#### Pin Object

A MicroPython software object that represents a specific GPIO Pin and exposes methods to configure its direction and read or write its value.

**Example:** `led = Pin(25, Pin.OUT)` creates a Pin Object bound to the Onboard LED and sets it for Digital Output.

#### Pin Toggle

The act of switching a GPIO Pin's Digital Output between its high and low Logic Level states, typically in a loop to blink an LED or generate a square wave.

**Example:** Repeatedly calling `.toggle()` on a Pin Object connected to the Onboard LED performs a Pin Toggle at a rate controlled by a Sleep Delay.

#### Pitch

The perceptual quality of a sound corresponding most closely to its Fundamental Frequency, letting listeners order sounds from low to high.

**Example:** The Chromatic Tuner project converts a detected Peak Bin frequency into a Pitch expressed as a musical note name.

#### Pixel Coordinate

A pair of integer values, typically (x, y), identifying a single addressable point on a display relative to its Coordinate System Origin.

**Example:** Drawing a Bar Graph Display requires converting each frequency bin's magnitude into a Pixel Coordinate range on the OLED Display Module.

#### 8-Point DFT Example

A small, fully worked eight-sample Discrete Fourier Transform used in the course as a concrete, hand-checkable illustration of how correlation against each Test Frequency produces a Spectrum Array.

**Example:** Working through the 8-Point DFT Example by hand lets a student verify their code's Spectrum Array output against known correct values before trusting larger transforms.

#### Pointer Arithmetic

Computing new Memory Address values by adding or subtracting offsets to an existing address, commonly used to step through an array element by element.

**Example:** Pointer Arithmetic advances a Typed Pointer by 8 bytes at a time to move from one Interleaved Storage complex sample to the next.

#### Polling Loop

A program structure that repeatedly checks the current state of an input, such as a GPIO Pin, rather than waiting for a hardware interrupt to signal a change.

**Example:** A Polling Loop reads the button's Digital Input Pin on every pass through the Event Loop to check for a new press.

#### Portability Constraint

A limitation on how broadly a piece of code can run correctly, such as depending on a specific Instruction Set Architecture feature not present on all target boards.

**Example:** Relying on the FPv5 Floating Point Unit is a known Portability Constraint that makes the assembly labs incompatible with the ARMv6-M-based original Pico.

#### Power Of Two Constraint

The requirement, in the classic Radix 2 Algorithm, that the transform length N be an exact power of two so the Even Odd Split divides evenly at every Recursive Decomposition level.

**Example:** The Power Of Two Constraint means a student must zero-pad a 1000-sample buffer up to 1024 samples before running the Radix 2 Algorithm FFT.

#### Power Versus Magnitude

The distinction between a bin's squared amplitude (power, proportional to energy) and its plain amplitude (magnitude, proportional to Root Mean Square-like level), each useful for different display or analysis purposes.

**Example:** Using power instead of magnitude in the Power Versus Magnitude choice exaggerates loud peaks and suppresses quiet ones on the Decibel Scale display.

#### Precomputation

The practice of calculating fixed values, such as a Twiddle Factor Table or Permutation Table, once ahead of time rather than recomputing them inside a performance-critical loop.

**Example:** Precomputation of sine and cosine values before the main FFT loop runs avoids repeated Trigonometric Function Cost during every Stage Loop.

#### Precomputed Swap List

A Lookup Table listing exactly which index pairs need swapping during Bit Reversal Permutation, computed once ahead of time to avoid runtime Index Reversal calculation and branching.

**Example:** A Precomputed Swap List for a 1024-point FFT lets the reordering step run as a tight loop of Swap Operation calls with no conditional logic.

#### Predict Then Measure Pattern

A recurring lab structure in which students must write a numeric prediction before running a benchmark, then compare it against the actual Cycle Counter or Speedup Factor result.

**Example:** The Predict Then Measure Pattern repeats in nearly every optimization lab, from the first Array Sum Speedup to the final Assembly Butterfly comparison.

#### Prediction Before Measurement

A pedagogical practice of writing down an expected numeric result before running a benchmark, so the actual measurement can be compared against that expectation.

This practice is central to the course's teaching method: forcing a stated Prediction Before Measurement surfaces misconceptions about performance more effectively than measurement alone.

**Example:** Before timing a Radix 2 Algorithm FFT, a student predicts it will be roughly N times faster than the Discrete Fourier Transform for N=1024, then checks that prediction against the Cycle Counter result.

See also: Optimistic Prediction Pattern, Predict Then Measure Pattern

#### Print Statement

A MicroPython instruction that writes text or variable values to the USB Serial Connection so they appear in the IDE's output console.

**Example:** Adding `print(sample_count)` inside a sampling loop lets a student watch how many audio samples were captured each second.

#### Processing Deadline

The specific point in time by which a computation must finish in order to keep pace with a real-time data stream, violation of which causes dropped or delayed output.

**Example:** Missing the Processing Deadline for one Audio Buffer causes the live spectrum display to stutter or skip a frame.

#### Processing Latency

The total elapsed time between a sound occurring and its effect appearing on the display, summing Capture Time, Compute Time, and Draw Time.

**Example:** A Live Spectrum Display with 50 milliseconds of Processing Latency feels noticeably less responsive than one with 10 milliseconds.

#### Productive Failure

A pedagogical approach where students first attempt a task likely to fail in an instructive way, so the failure itself builds deeper understanding before the correct method is taught.

**Example:** The course intentionally has students try Zero Crossing Counting for pitch detection first, as a Productive Failure that motivates the more robust DFT-based approach.

See also: Engineered Productive Failure, Real Mistake As Teaching Tool

#### Project Scoping

The process of defining the boundaries of a project, deciding what will and will not be attempted, to keep it achievable within available time.

**Example:** Project Scoping for the Spectrogram Project might exclude real-time display update, focusing instead on offline analysis of a recorded Audio Buffer.

#### Projection Onto Basis

The mathematical operation of measuring how much of a signal aligns with a given Basis Function, computed via a Dot Product or Correlation.

**Example:** Each DFT output bin is a Projection Onto Basis of the input signal against one complex exponential frequency.

#### Pull Up Resistor

A resistor connecting a Digital Input Pin to a high voltage rail so the pin reads a defined high Logic Level when no external circuit is actively pulling it low.

**Example:** Enabling the Pico 2's internal Pull Up Resistor on a button pin avoids the need for an external resistor in the Active Low Logic wiring.

#### Pulse Width Modulation

A technique for approximating an analog output level from a digital pin by rapidly switching it on and off and varying the fraction of time it stays high.

**Example:** Pulse Width Modulation on a GPIO Pin can dim an LED or, at audio rates, approximate a simple Tone Generator output.

#### Push Button Component

A generic momentary switch, typically a Tactile Switch, included in the course's hardware kit for user-input labs such as Mode Switching.

**Example:** A Push Button Component wired with a Pull Up Resistor lets students practice Debouncing before any audio labs begin.

#### Python Assembly Boundary

The interface point in code where execution transitions from ordinary MicroPython into an Inline Assembler function and back, governed by the Argument Passing Convention and Return Value Register.

**Example:** Crossing the Python Assembly Boundary too often, for a single Butterfly Operation at a time, adds enough call overhead to erode the benefit of using assembly at all.

#### Quadratic Complexity

An Algorithmic Complexity in which the number of operations grows proportionally to the square of the input size, written O(N^2), characteristic of the direct Discrete Fourier Transform.

**Example:** The DFT's Quadratic Complexity means doubling N quadruples its Operation Counting, unlike the FFT's much gentler growth.

#### Quadrature Component

The part of a signal's correlation with a reference frequency measured using a Sine Wave reference shifted 90 degrees from the In Phase Component, corresponding to the Imaginary Part of a DFT bin.

**Example:** Combining the Quadrature Component with the In Phase Component lets the DFT detect a tone regardless of its Phase Offset.

#### Quantization Error

The small difference between an analog signal's true value and the nearest representable value after being rounded to a finite Bit Depth during sampling.

**Example:** Reducing Bit Depth from 16 to 8 bits noticeably increases Quantization Error, audible as a faint hiss layered under the signal.

#### Radians

A unit of angle measurement based on the ratio of arc length to radius, where one full circle equals 2*pi radians, used throughout trigonometric computation in DSP.

**Example:** MicroPython's `math.sin()` expects its argument in Radians, so a 1 kHz Tone Generator must convert cycles into radians before calling it.

#### Radix 2 Algorithm

The most common FFT variant, which splits each transform into exactly two half-size Subproblem instances at every Recursive Decomposition level, requiring the Power Of Two Constraint.

**Example:** The course's first working FFT implementation is a straightforward Radix 2 Algorithm applied to a 256-sample buffer.

#### Radix 4 FFT

An FFT variant that splits each transform into four Subproblem instances per Recursive Decomposition level instead of two, reducing the total Butterfly Count relative to Radix 2 Algorithm for suitable sizes.

**Example:** A Radix 4 FFT of the same size N as a Radix 2 Algorithm FFT performs fewer total stages, though each Butterfly Operation becomes more complex.

#### RAM

Random access memory: the microcontroller's fast, volatile working memory used to hold variables, buffers, and the call stack while a program runs.

**Example:** An Audio Buffer and a Spectrum Array both live in RAM while the live spectrum analyzer script is running, and both disappear on Soft Reset.

#### Ranking Prediction

The exercise of guessing, in advance, the relative speed order of several implementations before measuring them, exercising Prediction Before Measurement at the level of a whole Variant Comparison.

**Example:** A Ranking Prediction exercise asks students to order six FFT implementations from fastest to slowest before running the Comparison Matrix benchmark.

#### Raspberry Pi Pico 2

The RP2350-based microcontroller board, built around the ARM Cortex M33 Processor, used as the primary hardware platform for every lab and project in this course.

**Example:** All Cycle Counter benchmarking figures quoted in the course assume a Raspberry Pi Pico 2 running at its default CPU Clock Frequency.

#### Raw Machine Word

The literal 16-bit or 32-bit numeric value produced by assembling an instruction, as it would appear stored in Flash Memory or RAM.

**Example:** Printing the Raw Machine Word of an assembled VADD Instruction lets a student cross-check it bit by bit against the Encoding Table.

#### Read Eval Print Loop

An interactive command prompt, also called a REPL, that reads one line of code, executes it immediately on the microcontroller, and prints the result before waiting for the next line.

**Example:** Typing `print(2+2)` at the MicroPython REPL over USB Serial Connection immediately returns `4` without needing to save or run a script file.

See also: USB Serial Connection, Script Execution

#### Reading Versus Writing Skill

The distinction between being able to read and understand existing assembly or optimized code versus being able to independently write new code at that level, a realistic skill-level goal for this course.

**Example:** The course targets Reading Versus Writing Skill such that students can confidently modify a provided Assembly Butterfly routine even if writing one entirely from scratch remains challenging.

#### Real And Imaginary Parts

The pair of values (Real Part and Imaginary Part) that together fully specify each complex entry of a DFT or FFT Spectrum Array.

**Example:** Printing the Real And Imaginary Parts of each bin separately helps a student debug a DFT implementation before combining them into a Magnitude Of A Complex Number.

#### Real Input Transform

An FFT variant specialized for purely real-valued (non-complex) input signals, exploiting Spectrum Symmetry to compute the result using roughly half the work of a general complex-input FFT.

**Example:** Because microphone samples are always real numbers, a Real Input Transform could in principle halve the Compute Time of the tuner's FFT stage.

#### Real Mistake As Teaching Tool

The course's practice of preserving and discussing an actual bug or wrong result a student encountered, rather than only presenting polished correct examples.

**Example:** A Real Mistake As Teaching Tool session walks through a student's actual Sign Error in a Twiddle Factor formula and how Debugging By Bisection found it.

#### Real Part

The non-imaginary component of a complex number, corresponding to the a in a + bi, geometrically the horizontal coordinate on the complex plane.

**Example:** In a DFT output bin, the Real Part corresponds to the In Phase Component of the detected sinusoid.

#### Real Time Budget

The maximum total time available to process one unit of streaming data (such as one Audio Buffer) before the next unit arrives, set by the Sample Rate Selection and buffer size.

**Example:** At a 1024-sample buffer and 44.1 kHz sample rate, the Real Time Budget for FFT plus display work is about 23 milliseconds.

See also: CPU Cycle Budget, Processing Deadline

#### Recombination Step

The stage of a Divide And Conquer algorithm where results from two or more Subproblem solutions are merged, using Twiddle Factor multiplication and addition, into the solution for the larger problem.

**Example:** The FFT's Recombination Step is exactly the Butterfly Operation, which merges an even-half and odd-half Subproblem result.

#### Rectangular Window

The default, implicit windowing applied when a fixed-length segment of a signal is simply truncated with no tapering, producing relatively wide Spectral Leakage compared to shaped windows.

**Example:** Using a Rectangular Window (that is, no explicit window at all) produces the widest Main Lobe Width and highest Side Lobe Level among the window functions the course compares.

#### Recursive Decomposition

The repeated application of Divide And Conquer splitting, such as the Even Odd Split, until subproblems reach a trivially small, directly solvable size.

**Example:** Recursive Decomposition of a 1024-point FFT continues until each Subproblem is a single 1-point "transform," which is just its own input value.

#### Redundant Computation

Repeated work performed by the direct DFT that the FFT avoids by recognizing that many of its Multiply And Sum terms share identical Twiddle Factor values.

**Example:** Symmetry Exploitation lets the FFT skip Redundant Computation that the O(N^2) DFT performs over and over across its Test Frequency sweep.

#### Reference Implementation

A trusted, typically simpler and slower, implementation of an algorithm (such as the direct DFT) used as a correctness baseline for a faster, more complex implementation like the FFT.

**Example:** Every new FFT variant in the course is checked with Cross Validation against the direct DFT Reference Implementation before its speed is measured.

#### Reference Pitch

A standardized frequency, conventionally 440 Hz for the note A4, used as the anchor point for Musical Note Mapping calculations.

**Example:** Changing the Reference Pitch to 442 Hz shifts every note name boundary used by the Chromatic Tuner project.

#### Register Address

The fixed numeric memory location assigned to a Memory Mapped Register, used by software to read or write that specific hardware control or status value.

**Example:** The DWT cycle counter's Register Address is documented in the ARM Cortex M33 Processor reference manual and used directly in Inline Assembler code.

#### Register Allocation

The decision, made by a compiler or by hand in Inline Assembler, of which CPU Register each variable or intermediate value should occupy during a computation.

**Example:** Careful Register Allocation avoids Register Spilling when hand-writing an Assembly Butterfly routine that needs more values than available registers.

#### Register Bank

The complete named set of registers of a particular kind, such as the integer Core Register Set or the FPU's separate set of Floating Point Register locations.

**Example:** The FPv5 Floating Point Unit's Register Bank provides 32 single-precision registers, separate from the 13 general-purpose integer registers.

#### Register Bit Manipulation

The act of setting, clearing, or testing individual bits within a Memory Mapped Register using a Bit Mask and Bit Shift Operator, used to enable hardware features like the DWT Unit.

**Example:** Register Bit Manipulation sets bit 24 of the Debug Exception Register to enable tracing before the Cycle Counter can be used.

#### Register Pressure

The situation where a routine needs more simultaneous values than there are available CPU Register or Floating Point Register locations, forcing Register Spilling.

**Example:** A fully unrolled Butterfly Operation for a large Radix 4 FFT can create enough Register Pressure to require careful Register Allocation.

#### Register Spilling

The technique of temporarily storing a register's value to memory (and reloading it later) when Register Pressure exceeds the number of available registers.

**Example:** Register Spilling a rarely used loop counter to a stack location frees up a Floating Point Register for the Complex Multiplication inside a Butterfly Operation.

#### Relative Error

The difference between a computed value and its expected value, expressed as a fraction or percentage of the expected value's magnitude, useful when comparing errors across very different scales.

**Example:** A Relative Error of 0.1% flags a rounding issue even when the underlying Absolute Error looks numerically small.

#### Remember Level Outcome

The lowest Bloom's Taxonomy level, involving recall of facts or definitions, such as stating what a Twiddle Factor is without yet using it.

**Example:** A Remember Level Outcome quiz question might simply ask a student to define Nyquist Frequency.

#### Reproducibility

The property that a benchmark, when repeated under the same stated conditions, produces consistent results that another person could obtain independently.

**Example:** Documenting the exact transform size, board revision, and CPU Clock Frequency in a lab report supports Reproducibility of the reported Speedup Factor.

#### Research Question

A clearly stated question that an experiment or benchmark is designed to answer, framed narrowly enough to be testable with available tools.

**Example:** "Does applying the Three Multiply Trick reduce measured cycles for a 1024-point FFT on the Pico 2?" is an example Research Question suitable for a capstone.

#### Resolution Speed Tradeoff

The inherent conflict between using a longer transform for finer Frequency Resolution Limit and a shorter transform for faster Frame Duration and lower Processing Deadline pressure.

**Example:** The Resolution Speed Tradeoff means a 4096-point FFT gives sharper tuner readings but updates the Live Spectrum Display more slowly than a 512-point FFT.

#### Results Presentation

The part of a report where measured data is displayed, typically as tables or charts such as a Comparison Matrix, without yet interpreting what it means.

**Example:** The Results Presentation section shows the raw cycle counts for each FFT variant before the Conclusion Drawing section interprets them.

#### Retrofitted Hypothesis Error

A methodological mistake in which a Hypothesis Statement is written after results are already known and quietly adjusted to match them, undermining the purpose of Prediction Before Measurement.

**Example:** The course explicitly warns against Retrofitted Hypothesis Error, requiring hypothesis text to be submitted before any benchmark data is collected.

#### Return Value Register

The specific CPU Register, conventionally r0 on ARM, used to pass a function's result back to its caller.

**Example:** An Inline Assembler function places its computed result in the Return Value Register just before returning to MicroPython.

#### Root Mean Square

A statistical measure of a signal's magnitude computed as the square root of the average of the squared sample values, closely related to perceived Loudness Perception and signal power.

**Example:** The sound-level meter lab computes the Root Mean Square of each Audio Buffer and converts it to a Decibel Scale reading for the Bar Graph Display.

#### Roots Of Unity

The set of N complex numbers that, when raised to the Nth power, equal 1; these values lie evenly spaced on the Unit Circle and generate the DFT and FFT's Twiddle Factor values.

**Example:** The 8-Point DFT Example uses the eight 8th Roots Of Unity as its full set of possible Twiddle Factor values.

#### Rumble Rejection

Filtering or ignoring very low frequency bins, often below tens of Hz, that represent handling noise or building vibration rather than meaningful audio content.

**Example:** Rumble Rejection zeroes out the first few Bin Index entries before Peak Bin search so table-thump noise doesn't dominate the tuner's Live Spectrum Display.

#### Sample Period

The fixed time interval between consecutive samples taken from an analog signal, equal to the reciprocal of the Sample Rate Selection.

**Example:** At a 44.1 kHz sample rate, the Sample Period is about 22.7 microseconds between successive microphone readings.

#### Sample Rate Selection

The chosen rate, in samples per second, at which an analog-to-digital process captures a signal, set based on the Sampling Theorem and the frequencies of interest.

**Example:** Sample Rate Selection of 8 kHz is sufficient for the DTMF Decoder Project since telephone tones stay below 2 kHz.

#### Sample Word Format

The specific bit layout (word size, alignment, and justification) in which an audio sample is packed within the data stream from an I2S Protocol peripheral.

**Example:** The INMP441 Microphone Module outputs a 24-bit sample left-justified within a 32-bit Sample Word Format, requiring an Arithmetic Right Shift to extract the meaningful bits.

#### Samples Per Cycle

The number of discrete samples captured within one Period Of A Wave, determining how finely a waveform's shape is resolved.

**Example:** At a 44.1 kHz sample rate, a 441 Hz tone is captured with exactly 100 Samples Per Cycle.

#### Sampling Theorem

A mathematical result, also known as the Nyquist-Shannon theorem, stating that a signal can be perfectly reconstructed from its samples only if it contains no frequency content at or above half the Sample Rate Selection.

**Example:** The Sampling Theorem explains why the course samples audio at 44.1 kHz to faithfully capture tones up to the audible range without Aliasing.

#### Sawtooth Wave

A periodic waveform that ramps linearly and then drops sharply, containing both even and odd Harmonic Series components at decreasing amplitude.

**Example:** A Sawtooth Wave test signal exercises the FFT with a richer spectrum than a pure Sine Wave.

#### Scaling Behavior

How an algorithm's runtime or resource usage changes as its input size grows, typically summarized by its Algorithmic Complexity.

**Example:** Plotting measured Compute Time against N for both the DFT and FFT visually demonstrates their very different Scaling Behavior.

#### Scratch Register

A register used only for short-lived, temporary values within a routine, not expected to hold meaningful data before or after the routine runs.

**Example:** An Assembly Butterfly routine uses a Scratch Register to hold an intermediate Complex Multiplication product before the final Cross Add And Subtract.

#### Script Execution

The process of running a saved Python file on the microcontroller from start to finish, as opposed to typing commands one at a time at the Read Eval Print Loop.

**Example:** Clicking "Run" in Thonny IDE performs Script Execution of `main.py`, which reads the microphone and updates the OLED Display Module in a loop.

#### Self Paced Study Option

A course structure allowing students to work through modules at their own speed rather than strictly following the weekly schedule, provided prerequisite Load Bearing Module material is completed first.

**Example:** The Self Paced Study Option lets an advanced student move directly from the FFT unit into ARM assembly labs ahead of the posted Weekly Milestone Schedule.

#### Semitone Formula

The mathematical relationship, based on the twelfth root of two, that relates the frequency ratio between two adjacent notes in the standard equal-tempered musical scale.

**Example:** The Semitone Formula predicts that each successive semitone's frequency is about 5.9% higher than the one before it.

#### Serial Peripheral Interface

A synchronous digital bus protocol using separate clock and data lines plus a Chip Select Line, used to connect a microcontroller to peripherals such as a display.

**Example:** The Pico 2 talks to its OLED Display Module over Serial Peripheral Interface, sending framebuffer bytes one bit per clock pulse.

#### Settling Time Discard

The practice of ignoring the first several samples or frames captured after starting a peripheral or filter, because early values have not yet stabilized to steady-state behavior.

**Example:** The course applies Settling Time Discard by throwing away the first I2S Protocol Audio Buffer after startup, since the MEMS Microphone's output has not yet settled.

#### Shared Configuration Module

A single MicroPython file that centralizes pin assignments and setup constants so multiple scripts and labs can import consistent hardware configuration instead of repeating it.

**Example:** A `config.py` Shared Configuration Module defines which GPIO Pin drives the OLED Display Module's Chip Select Line so every lab in the course agrees on the wiring.

#### Side Lobe Level

The height of the smaller, spurious ripples a window function produces on either side of its Main Lobe Width, representing residual Spectral Leakage.

**Example:** A lower Side Lobe Level from a Blackman Window makes a quiet secondary tone easier to distinguish from leakage of a loud nearby tone.

#### Sign Error

A common implementation bug in which a plus sign is swapped for a minus sign (or vice versa) in a formula, such as the exponent sign in the Forward Transform Convention.

**Example:** A Sign Error in the Twiddle Factor formula silently turns a forward FFT into an Inverse FFT, a bug typically caught by Debugging By Bisection.

#### Signal Envelope

A smooth curve tracing the outer boundary of a signal's oscillations over time, capturing overall loudness or intensity changes separate from the underlying waveform detail.

**Example:** Extracting a signal's Signal Envelope from microphone data can drive a Level Meter without needing a full spectral analysis.

#### Signal Synthesis

The general process of constructing a signal from mathematical building blocks such as sinusoids, rather than capturing it from the physical world.

**Example:** Signal Synthesis of a two-tone test signal lets a student verify the DFT correctly resolves both a Ground Truth Signal frequencies simultaneously.

#### Signed Integer Conversion

The process of interpreting a raw bit pattern as a two's-complement signed number rather than an unsigned one, restoring correct negative values.

**Example:** Signed Integer Conversion turns a raw 16-bit unsigned value of 65000 into the correct negative audio sample of -536.

#### Silicon Revision

A version number identifying a specific manufacturing revision of a processor chip, which can affect available features or known errata.

**Example:** Reading the CPUID Register reveals the Silicon Revision of the Pico 2's RP2350 chip, useful when checking for FPU Presence Detection quirks.

#### Similarity Measure

A general term for any quantity, such as Correlation, that expresses how alike two signals or patterns are.

**Example:** Correlation Magnitude serves as the Similarity Measure between a captured signal and each candidate Test Frequency.

#### Sine Only Detector Blind Spot

The flaw in a simplified correlation detector that uses only a Sine Wave reference: it fails to detect a tone whose Phase Offset happens to align with the Cosine Function, producing a false zero reading.

**Example:** The course deliberately has students build a Sine Only Detector Blind Spot detector first, then observe it miss a cosine-phased tone entirely, motivating the full complex DFT.

See also: Productive Failure, Phase Independence

#### Sine Synthesis

The process of generating a discrete-time waveform by evaluating the sine function at successive time steps, used to create test tones or musical waveforms.

**Example:** Sine Synthesis at a chosen Sample Rate Selection produces the array of samples fed into a Tone Generator's output buffer.

#### Sine Wave

A smooth periodic waveform following the mathematical sine function, characterized entirely by its amplitude, frequency, and Phase Offset, and treated as the basic building block of DSP.

**Example:** The course's first Tone Generator lab synthesizes a pure Sine Wave using MicroPython's `math.sin()` function.

#### Single Precision Float

A 32-bit IEEE floating-point number format offering roughly 7 decimal digits of precision, the default Float Precision used for most numeric computation in this course's MicroPython code.

**Example:** Comparing a DFT computed in Single Precision Float against a higher-precision reference reveals how much Rounding Error accumulates in a 1024-point transform.

#### Sleep Delay

A function call that pauses program execution for a specified duration, used to control timing in loops such as blinking or polling.

**Example:** `time.sleep(0.5)` inserts a half-second Sleep Delay between each Pin Toggle of the Onboard LED.

#### Soft Reset

A command (conventionally Ctrl-D) that restarts the MicroPython interpreter and re-runs boot and main scripts without power-cycling the microcontroller or clearing the Device Filesystem.

**Example:** After editing `main.py`, a student issues a Soft Reset from the REPL to reload the script without unplugging the Pico 2.

#### Software Toolchain

The complete set of software tools, including Thonny IDE, MicroPython Firmware, and the mpremote Tool, needed to develop and deploy code for the course.

**Example:** Setting up the Software Toolchain is the first task of the course, before any GPIO Pin or Sine Wave code is written.

#### Sound Level

A numeric measure of how loud an audio signal is, typically derived from Root Mean Square amplitude and often expressed on a Decibel Scale.

**Example:** The live VU Meter project updates its Sound Level reading roughly 20 times per second as new Audio Buffer frames arrive.

#### Special Case Optimization

An optimization technique that detects when input values match a simpler special case, such as a Twiddle Factor of exactly 1, and substitutes cheaper code for that case instead of the general-purpose path.

**Example:** Special Case Optimization skips the full Complex Multiplication entirely whenever a Trivial Twiddle is detected in a Butterfly Operation.

#### Spectral Leakage

The spreading of a single frequency's energy across multiple neighboring Bin Index entries, occurring whenever a signal's frequency does not fall exactly on a Bin Center Frequency.

**Example:** Spectral Leakage smears a 445 Hz tone's energy across several bins around the 440 Hz Bin Center Frequency instead of producing one clean peak.

#### Spectrogram Project

A capstone track that captures successive Frame Capture windows over time and displays their Spectrum Array results stacked into a two-dimensional time-versus-frequency image.

**Example:** The Spectrogram Project extends the Live Spectrum Display concept by keeping a history of past frames instead of showing only the current one.

#### Spectrum Array

The complete set of complex output values produced by a DFT or FFT, one entry per Bin Index, representing the signal's full Frequency Domain content.

**Example:** The tuner reads the Spectrum Array and searches for the Peak Bin to identify the played note's Pitch.

#### Spectrum Bars

The visual elements of a Bar Graph Display, one per frequency bin or group of bins, whose heights represent Magnitude Computation results.

**Example:** The live spectrum analyzer draws 32 Spectrum Bars on the OLED Display Module, each summarizing several adjacent Bin Averaging groups.

#### Spectrum Symmetry

The property that the DFT of a real-valued (non-complex) input signal produces a Spectrum Array whose second half mirrors the first, differing only by a sign flip in the Imaginary Part.

**Example:** Spectrum Symmetry means only half of the Spectrum Array needs to be displayed for real audio input, as shown in the Half Spectrum Display.

#### Speedup Factor

The ratio of the runtime of a slower implementation to the runtime of a faster one, quantifying how much an optimization improved performance.

**Example:** Measuring a Speedup Factor of 8x when switching from the DFT to the FFT at N=256 matches the Operation Counting prediction reasonably well.

#### SPI Clock Line

The Serial Peripheral Interface signal, driven by the controller device, whose transitions pace when each data bit is sampled by the receiving device.

**Example:** The SPI Clock Line toggles once per bit transferred between the Pico 2 and the SSD1306 Controller.

#### Square Root Scaling

Displaying magnitude values raised to a power less than one (such as 0.5), compressing large values and expanding small ones without the full computational cost of Logarithmic Scaling.

**Example:** Square Root Scaling of Spectrum Bars heights makes quiet Overtone peaks more visible than raw linear magnitude would.

#### Square Wave

A periodic waveform that alternates abruptly between two fixed levels, mathematically equivalent to an infinite Harmonic Series of odd-numbered Overtone components.

**Example:** Additive Synthesis of the first few odd harmonics approximates a Square Wave, illustrating how the FFT decomposes non-sinusoidal signals.

#### SSD1306 Controller

A specific Display Driver Chip commonly used to drive small monochrome OLED panels, accepting a Framebuffer over Serial Peripheral Interface or I2C and refreshing the screen.

**Example:** MicroPython's `ssd1306` library talks to the SSD1306 Controller to draw the live Bar Graph Display in the sound-level lab.

#### Stack Frame

The region of the call stack allocated for a single function invocation, holding saved registers, local variables, and Register Spilling data for that call.

**Example:** A Stack Frame for an Assembly Butterfly routine holds any registers spilled during a period of high Register Pressure.

#### Stage Loop

The code structure that iterates through all Butterfly Pair computations belonging to a single Logarithmic Stages level of the FFT before moving to the next stage.

**Example:** An Iterative FFT implementation nests a Stage Loop inside an outer loop over all log2(N) stages.

#### Stage Parameter Block

A small structure of related values, such as Stage Span and a Twiddle Factor Table pointer, passed together into an Assembly Loop to describe one Logarithmic Stages level of the FFT.

**Example:** Passing a Stage Parameter Block into the Assembly Butterfly routine avoids recomputing Stage Span-related values on every call.

#### Stage Percentage Breakdown

A summary, typically as percentages, of how much of a total processing cycle each Stage Profiling category (capture, compute, draw) consumes.

**Example:** A Stage Percentage Breakdown showing 10% Capture Time, 70% Compute Time, and 20% Draw Time clearly points to the FFT as the priority for optimization.

#### Stage Profiling

The practice of separately measuring the time consumed by each distinct phase of a pipeline, such as Capture Time, Compute Time, and Draw Time, to locate a Performance Bottleneck.

**Example:** Stage Profiling of the Live Spectrum Display revealed that Draw Time, not the FFT, was consuming most of each frame's Real Time Budget.

#### Stage Span

The distance, in array positions, between the two indices of a Butterfly Pair at a given Logarithmic Stages level, which doubles at each successive stage.

**Example:** At the first stage of an 8-point FFT the Stage Span is 1, while at the final stage it grows to 4.

#### Standalone Operation

Running a microcontroller program using only its own power and peripherals, with no host computer or IDE connection required after deployment.

**Example:** Once loaded as the Autorun Main Script, the sound-level meter achieves Standalone Operation from a USB power bank alone.

#### Sub Bin Accuracy

Frequency estimation precision finer than one full Bin Width, achieved through techniques like Parabolic Interpolation rather than raw Argmax Search alone.

**Example:** Sub Bin Accuracy lets the tuner report a pitch within a few Cents Deviation instead of being limited to whole Bin Width steps.

#### Sub Linear Composition

The common real-world outcome where combining several optimizations yields less total speedup than the sum of each optimization's individual Speedup Factor, often due to Amdahl's Law effects.

**Example:** Sub Linear Composition explained why three optimizations that each individually saved 20% only combined for about 45%, not 60%.

#### Subproblem

A smaller instance of the original problem produced by a Divide And Conquer split, solved independently before being combined in the Recombination Step.

**Example:** Each half-size DFT produced by the Even Odd Split is a Subproblem that is itself further split by Recursive Decomposition.

#### Superposition Principle

The property that the combined response of a linear system to multiple simultaneous inputs equals the sum of its responses to each input individually.

**Example:** The Superposition Principle justifies treating a two-tone signal as the simple addition of two independent Sine Wave signals for analysis.

#### Surprising Result

A benchmark outcome that contradicts a student's Prediction Before Measurement or Ranking Prediction, prompting deeper investigation into its Failure Root Cause.

**Example:** A Surprising Result where a "trivial" optimization made the FFT slower led a class to discover it had introduced an Unpredictable Branch.

#### Swap Operation

The act of exchanging the values stored at two positions in an array, the basic mechanism used to perform In Place Reordering during Bit Reversal Permutation.

**Example:** Each Swap Operation during Bit Reversal Permutation exchanges array elements at an index and its bit-reversed partner.

#### Switch Bounce

The rapid, unintended series of electrical on/off transitions a mechanical switch produces for a few milliseconds when its contacts physically make or break.

**Example:** Without handling Switch Bounce, a single press of a Tactile Switch can register as several presses in a Polling Loop.

#### Symmetry Exploitation

The FFT's central insight: because Twiddle Factor values repeat and mirror at regular intervals, many DFT sums can be computed once and reused rather than recomputed.

**Example:** Symmetry Exploitation is what allows the Even Odd Split and Butterfly Operation to replace the DFT's brute-force Multiply And Sum with far fewer operations.

#### Table Hoisting Optimization

The specific application of Loop Invariant Hoisting to FFT code, moving Twiddle Factor Table and Permutation Table lookups outside the innermost Butterfly Operation loop.

**Example:** The Table Hoisting Optimization alone can noticeably shrink measured Compute Time before any assembly-level work begins.

#### Tactile Switch

A small momentary mechanical Push Button Component commonly used on prototyping boards, which closes an electrical contact only while physically pressed.

**Example:** The course's hardware kit includes a Tactile Switch wired to a Digital Input Pin for menu navigation.

#### Test Frequency

A specific candidate frequency against which a signal is correlated to measure how strongly that frequency is present, corresponding to one Bin Center Frequency of the DFT.

**Example:** An 8-Point DFT Example evaluates Correlation at eight distinct Test Frequency values, one for each output bin.

#### Test Signal Design

The deliberate choice of a test signal's frequency, amplitude, phase, and length to expose a specific class of bug or verify a specific property of an algorithm.

**Example:** Test Signal Design for Spectrum Symmetry checks purposefully uses a real-valued (non-complex) Ground Truth Signal so the mirrored bins can be verified.

#### Test Suite Blind Spot

A gap in a set of Known Signal Test cases where a class of bug could exist without being caught, because no test exercises that specific condition.

**Example:** A Test Suite Blind Spot around Bin Exact Frequency-only tests can hide a Spectral Leakage handling bug that only appears with off-bin tones.

#### Text Rendering

The process of converting characters into pixel patterns on a display, typically by looking up a bitmap font and writing it into the Framebuffer.

**Example:** A chromatic tuner lab uses Text Rendering to display the detected musical note name on the OLED Display Module.

#### Thonny IDE

A beginner-friendly Python integrated development environment that provides an editor, a MicroPython-aware Read Eval Print Loop connection, and a simple file browser for microcontroller boards.

**Example:** Students use Thonny to write MicroPython scripts on a laptop and upload them directly to the Pico 2 over a USB Serial Connection.

#### Three Multiply Trick

An algebraic identity that computes a Complex Multiplication using only three real multiplications (at the cost of extra additions), reducing arithmetic compared to the Four Multiply Form.

**Example:** Applying the Three Multiply Trick to every Butterfly Operation in a large FFT measurably reduces total multiply instructions on the Pico 2.

#### Threshold Rejection

Discarding candidate peaks whose magnitude falls below a minimum cutoff, such as a Peak Ratio Threshold, to avoid mistaking noise for signal.

**Example:** Threshold Rejection filters out spurious Local Maximum bumps caused by the Noise Floor before the Chromatic Tuner reports a note.

#### Thumb Instruction Set

A compact, 16-bit-Halfword-oriented instruction encoding scheme for ARM processors, offering smaller Machine Code size than the older full 32-bit ARM instruction encoding.

**Example:** The Assembly Decorator in MicroPython generates code using the Thumb Instruction Set, matching what the Cortex M33 Processor natively executes.

#### Thumb-2 Encoding

An extension of the original Thumb Instruction Set that mixes 16-bit and 32-bit instruction widths, giving access to more operations while keeping common instructions compact.

**Example:** Thumb-2 Encoding is what allows the Cortex M33 Processor to execute both simple Move Instruction operations and more complex FPU instructions like VMUL Instruction.

#### Timbre

The perceived quality or "color" of a sound that distinguishes two tones of the same Pitch and loudness, determined largely by their relative Overtone content.

**Example:** The Instrument Identifier Project analyzes Timbre by comparing the relative Spectrum Array magnitudes of different instruments playing the same note.

#### Time Domain

A representation of a signal as a sequence of values over successive moments in time, the natural form in which audio samples are captured.

**Example:** A Waveform Plotting view shows the microphone signal in the Time Domain, before any Fourier Transform is applied.

#### Timer Resolution

The smallest time increment a given timer can reliably distinguish, determining whether it is suitable for measuring a particular operation's duration.

**Example:** A routine that finishes in a few dozen CPU cycles requires Timer Resolution finer than any Millisecond Timer or Microsecond Timer can offer, motivating use of the Cycle Counter.

#### Timing Overhead

The small but non-zero cost of the timing mechanism itself, such as reading the Cycle Counter, which can distort measurements of very short operations if not accounted for.

**Example:** Timing Overhead of a few cycles per Cycle Count Register read becomes significant when benchmarking something as short as a single Butterfly Operation.

#### Tone Generator

Code or hardware that produces a signal at a specified, controllable frequency, typically a Sine Wave or Square Wave, used for testing DSP algorithms with a Known Signal Test.

**Example:** A software Tone Generator produces a 440 Hz Sine Wave in MicroPython to verify the DFT correctly reports a peak at the expected Bin Center Frequency.

#### Trace Enable Bit

The specific bit within the Debug Exception Register that must be set to allow the DWT Unit's counters to operate.

**Example:** Setting the Trace Enable Bit is the first line of the course's standard `enable_cycle_counter()` helper function.

#### Trigonometric Function Cost

The relatively high computational expense, measured in CPU Cycle Budget, of evaluating sine, cosine, or arctangent compared to basic addition and multiplication on a microcontroller.

**Example:** Trigonometric Function Cost motivates Precomputation of a Twiddle Factor Table so sine and cosine are evaluated once instead of inside every loop iteration.

#### Trivial Twiddle

A Twiddle Factor value equal to exactly 1, -1, i, or -i, for which the general Complex Multiplication can be replaced by a much simpler operation.

**Example:** The very first Butterfly Pair in every Logarithmic Stages level always multiplies by the Trivial Twiddle value of 1, so a Multiply By One Shortcut applies.

#### Try Except Block

A control-flow construct that attempts to run a block of code and catches specified errors, allowing a program to handle failures gracefully instead of crashing.

**Example:** A student wraps I2S Protocol setup in a Try Except Block so a missing microphone connection prints a helpful message instead of stopping the script.

#### Twiddle Factor

A precomputed complex constant, a specific Root Of Unity, that a Butterfly Operation multiplies against one input to combine even and odd Subproblem results correctly.

**Example:** An 8-point FFT uses only four distinct Twiddle Factor values, each a point evenly spaced around the Unit Circle.

#### Twiddle Factor Table

A precomputed array holding every distinct Twiddle Factor value an FFT of a given size will need, computed once and reused across every Butterfly Operation.

**Example:** A 1024-point FFT's Twiddle Factor Table holds 512 unique complex values computed once via Precomputation.

#### Two-Tone Signal

A synthesized test signal composed of exactly two Sine Wave components at different frequencies, added by Wave Addition, used to validate that a transform can resolve multiple simultaneous frequencies.

**Example:** A Two-Tone Signal at 440 Hz and 1000 Hz should produce exactly two clear peaks in the DFT's Spectrum Array.

#### Type Annotation

An explicit declaration of a variable's Machine Type, required by the Viper Code Emitter to generate efficient native code instead of general-purpose Boxed Value handling.

**Example:** Adding a Type Annotation of `int` to a loop counter lets the Viper Decorator emit a tight machine-code loop instead of slower generic bytecode.

#### Typed Array

A MicroPython array object, such as `array.array`, that stores elements of a fixed, declared numeric type contiguously in memory, compatible with direct assembly access.

**Example:** Storing the Twiddle Factor Table as a Typed Array of 32-bit floats lets Inline Assembler read it directly via Pointer Arithmetic.

#### Typed Pointer

A Viper Code Emitter variable type that references a raw memory address and allows direct, bounds-check-free reads and writes, similar to a pointer in C.

**Example:** A Typed Pointer into an Audio Buffer lets Viper code read successive samples nearly as fast as hand-written ARM assembly.

#### Unboxed Value

A raw numeric value stored without attached type metadata, as used inside Viper Code Emitter functions with explicit Type Annotation, closer to how C represents numbers.

**Example:** Declaring a loop variable as an Unboxed Value `int` inside a Viper-decorated function avoids the overhead of a Boxed Value on every iteration.

#### Undersampling

Sampling a signal at a rate too low to satisfy the Sampling Theorem for the frequencies it contains, resulting in Aliasing artifacts.

**Example:** A student demonstrates Undersampling on purpose by feeding a 25 kHz tone into a system sampling at 8 kHz and observing the resulting alias frequency.

#### Understand Level Outcome

A Bloom's Taxonomy level involving explaining a concept in one's own words or interpreting its meaning, beyond simple recall.

**Example:** An Understand Level Outcome might ask a student to explain why the Even Odd Split reduces computation, not just define it.

#### Unique Device ID

A factory-programmed identifier, unique to each physical chip, that software can read to distinguish one microcontroller board from another of the same model.

**Example:** A lab exercise reads the Pico 2's Unique Device ID and prints it so two boards on the same desk can be told apart in logged data.

#### Unit Circle

The circle of radius one centered at the origin of the complex plane, on which every Complex Exponential value with a real exponent lies.

**Example:** The Twiddle Factor values used throughout the FFT are all points on the Unit Circle, spaced at equal angular intervals.

#### Unpredictable Branch

A Conditional Branch whose outcome varies data-dependently in a way that defeats a processor's Branch Prediction hardware, causing a performance penalty when mispredicted.

**Example:** A Special Case Optimization check for a Trivial Twiddle can introduce an Unpredictable Branch if trivial and non-trivial cases are unevenly and unpredictably mixed.

#### Untethered Operation

A synonym used in this course for running a microcontroller project on battery or independent power, disconnected from any development computer.

**Example:** After Deployment Workflow steps are complete, the vibration monitor project achieves Untethered Operation clipped to a motor housing far from any laptop.

#### USB Serial Connection

A communication link over a USB cable that carries a virtual serial (text) channel between a host computer and a microcontroller, used for the REPL, print output, and file transfer.

**Example:** Thonny IDE connects to the Pico 2's USB Serial Connection to show live Print Statement output while a script runs.

#### VADD Instruction

An ARM FPU instruction that adds two Floating Point Register values together, storing the sum in a destination register.

**Example:** The addition half of Cross Add And Subtract in a hardware-accelerated Butterfly Operation is a single VADD Instruction.

#### Validation Before Trust

The course's guiding principle that any new signal-processing routine must pass a Known Signal Test before its output is used or benchmarked, since a fast but wrong algorithm is worthless.

**Example:** Validation Before Trust means a newly written FFT is checked against a Reference Implementation on a Ground Truth Signal before any Speedup Factor is measured.

#### Variance Sources

The various factors, such as Garbage Collection, Interrupt Interference, or the Cold Start Effect, that cause repeated timing measurements of the same code to differ from run to run.

**Example:** Identifying Variance Sources helped students explain why one FFT run took twice as long as the others in a batch of measurements.

#### Variant Comparison

A structured benchmarking exercise that measures multiple different implementations of the same algorithm side by side under identical conditions.

**Example:** The capstone's Variant Comparison lab times six different FFT implementations, from plain MicroPython to fully optimized assembly, on the same Ground Truth Signal.

#### Vibration Monitor Project

A capstone track that analyzes the frequency content of mechanical vibration data, such as from an accelerometer, to detect abnormal machine behavior.

**Example:** The Vibration Monitor Project applies the same FFT pipeline used for audio to a different physical Ground Truth Signal source.

#### Viper Code Emitter

An aggressive MicroPython compilation mode, invoked with the Viper Decorator, that generates optimized native code and allows explicit Machine Type annotations for further speed at the cost of some safety checks.

**Example:** The Viper Code Emitter lets a student use Typed Pointer access to an Audio Buffer, avoiding the Boxed Value overhead of ordinary MicroPython.

#### Viper Decorator

The MicroPython `@micropython.viper` decorator that triggers the Viper Code Emitter and enables Type Annotation syntax within a function.

**Example:** The Viper Decorator requires explicit Machine Type annotations on function arguments, unlike the more permissive Native Decorator.

#### VLDR Instruction

An ARM FPU instruction that loads a single floating-point value from memory into a Floating Point Register.

**Example:** A VLDR Instruction reads one real-part sample from the Audio Buffer into register s0 before a Butterfly Operation begins.

#### VMUL Instruction

An ARM FPU instruction that multiplies two Floating Point Register values together, storing the product in a destination register.

**Example:** A Complex Multiplication in assembly issues several VMUL Instruction calls to compute the needed cross products.

#### VNEG Instruction

An ARM FPU instruction that negates a Floating Point Register value, flipping its sign, storing the result in a destination register.

**Example:** A VNEG Instruction can implement the Multiply By I Shortcut, since multiplying by the imaginary unit swaps and negates real and imaginary components.

#### Voice Activity Detector Project

A capstone track that determines whether a captured audio frame contains human speech, typically using Root Mean Square energy and spectral shape features from the FFT.

**Example:** The Voice Activity Detector Project must distinguish speech energy from generic Noise Floor using both time-domain and Frequency Domain cues.

#### VSTR Instruction

An ARM FPU instruction that stores a value from a Floating Point Register back out to memory.

**Example:** After computing a Butterfly Operation's output, a VSTR Instruction writes the result from a floating-point register back into the Spectrum Array in RAM.

#### VSUB Instruction

An ARM FPU instruction that subtracts one Floating Point Register value from another, storing the difference in a destination register.

**Example:** The subtraction half of Cross Add And Subtract in a hardware-accelerated Butterfly Operation is a single VSUB Instruction.

#### Warm Up Discard

The practice of running a routine several times and throwing away the first few timing results to avoid the Cold Start Effect skewing a benchmark.

**Example:** Warm Up Discard of the first three FFT calls in a benchmark loop keeps the Cold Start Effect from inflating the reported average time.

#### Wave Addition

The arithmetic operation of summing the sample values of two or more waveforms at each point in time to produce a combined signal.

**Example:** Wave Addition of a 440 Hz and a 880 Hz Sine Wave produces the two-tone test signal used to validate the DFT.

#### Wave Interference Pattern

The resulting shape produced when two or more waves undergo Wave Addition, exhibiting regions of Constructive Interference and Destructive Interference.

**Example:** Plotting the Wave Interference Pattern of two close-frequency tones visually reveals the Beat Frequency as a slow amplitude ripple.

#### Waveform Plotting

The act of graphing a signal's amplitude against time or sample index, used to visually inspect a signal for correctness, Clipping, or noise.

**Example:** Waveform Plotting of a captured Audio Buffer quickly reveals a Flat Top Waveform caused by microphone Clipping.

#### 6-Way Variant Matrix

The course's standard Comparison Matrix layout of six FFT implementations, typically spanning plain MicroPython, Native Decorator, Viper Decorator, and assembly-based variants, benchmarked side by side.

**Example:** The capstone report is expected to reproduce the 6-Way Variant Matrix results with the student's own transform size and test signal.

#### Weekly Milestone Schedule

The week-by-week plan mapping course topics, from MicroPython basics through the capstone, onto the ten weeks of the semester.

**Example:** The Weekly Milestone Schedule places the Cooley-Tukey Algorithm unit around week six, after the DFT and correlation foundations are solid.

#### While Loop

A programming construct that repeatedly executes a block of code as long as a specified condition remains true, used to implement continuous sampling or display loops.

**Example:** The course's live spectrum analyzer runs its capture-compute-draw sequence inside a single While Loop that never exits during normal operation.

#### Whistle Test

An informal validation technique in which a student whistles a known Pitch into the microphone and confirms the Live Spectrum Display shows a peak at the expected Bin Center Frequency.

**Example:** A Whistle Test at roughly 1 kHz is a quick sanity check that the whole audio-to-display pipeline is working before more rigorous Known Signal Test checks.

#### Window Table

A precomputed array of tapering coefficients for a chosen window function, computed once via Precomputation and multiplied against each new Audio Buffer before the FFT.

**Example:** A Window Table for the Hanning Window is calculated once at startup and reused every Frame Capture to avoid repeated Trigonometric Function Cost.

#### Window Tradeoff

The general design choice among windowing functions between a narrower Main Lobe Width (better frequency separation) and a lower Side Lobe Level (better dynamic range), no single window optimizing both.

**Example:** The Window Tradeoff explains why the course has students choose windows based on their specific project's needs rather than always using one default.

#### Word Select Line

The I2S Protocol signal that indicates which audio channel (left or right) the current data word belongs to, toggling once per sample period.

**Example:** A mono MEMS Microphone is wired so its Channel Select Pin matches the Word Select Line state the microcontroller expects for the left channel.

#### Work Split Strategy

A design decision about how much of an algorithm to implement in assembly versus MicroPython, balancing Speedup Factor against Python Assembly Boundary crossing overhead.

**Example:** The course's recommended Work Split Strategy is to implement an entire Stage Loop in one assembly call rather than one Butterfly Operation at a time.

#### Zero Crossing Counting

A simple pitch-estimation technique that counts how often a signal's sign changes per unit time and infers a fundamental frequency from that rate.

**Example:** Zero Crossing Counting misestimates the Fundamental Frequency of a signal rich in Harmonic Distortion, motivating the course's move to correlation-based methods.

