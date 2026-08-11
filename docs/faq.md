# Benchmarking FFT FAQ

Frequently asked questions about the *Benchmarking FFT: Real-Time Signal Processing on a $5
Microcontroller* course, organized from getting-started logistics through advanced optimization
topics. Use your browser's find function (Ctrl+F / Cmd+F) to jump to a specific term.

## Getting Started Questions

### What is this course about?

This course teaches you to make a $5 microcontroller listen to the real world and understand it
in real time. You build a Fast Fourier Transform (FFT) from scratch — discovering the algorithm
through a sequence of hands-on labs rather than being handed it — and then make that FFT fast
enough for live audio by hand-writing ARM assembly. Along the way you learn to benchmark your own
code honestly, which the course treats as a harder and rarer skill than writing fast code in the
first place. By the final week you will have taken a 512-point transform from about 21 seconds
down to roughly half a millisecond on the same chip, measuring every step yourself.

**Example:** The course's headline number is a full pipeline of measured speedups — brute-force
DFT to optimized assembly FFT — that a student produces personally rather than reads about.

See the [course description](course-description.md) for the full scope, hardware kit, and
weekly schedule.

### Who is this course for?

The course is aimed at college juniors and seniors who are curious about signal processing but
have no prior background in FFTs, digital signal processing, or assembly language — that gap is
the course's binding design constraint. What genuinely helps going in is basic programming
experience in any language (if you can write a loop and a function, you're ready), comfort with
algebra including sine and cosine as functions, and a willingness to plug wires into a
breadboard. No calculus, no prior microcontroller experience, and no soldering are required. See
the [course description](course-description.md) for the full prerequisites table.

### What prior knowledge do I need before starting?

Formally, none. Lab 1 assumes only that you own a computer. Microcontrollers and GPIO are taught
from zero starting in Lab 2, digital audio and sampling in Labs 7–10, sine waves and phase in
Labs 11–12, correlation and the Fourier transform in Labs 13–14, the FFT algorithm itself in Labs
17–20, benchmarking methodology in Labs 25–26, and ARM assembly language in Labs 28–31. The only
things that genuinely help are basic programming ability, comfort with algebra (including sine
and cosine), and patience for wiring a breadboard. See the
[course description](course-description.md) for the complete "first introduced" table.

### What hardware do I need to buy for this course?

Every student needs one kit costing roughly $19 total: a Raspberry Pi Pico 2 (RP2350, about $5),
an SSD1306 OLED display (128×64, SPI, about $5), two momentary push buttons (about $1), an
INMP441 I²S MEMS microphone (about $3), and a breadboard with jumper wires (about $5). **Example:**
the whole kit — board, display, mic, buttons, and breadboard — costs less than a single textbook,
which is the point: real-time signal processing hardware that used to require a dedicated lab
bench now fits in a pocket. The software side needs only Thonny and stock MicroPython — no
compiler, no build system, and no SDK, since all 35 labs run as MicroPython code loaded directly
onto the board. See the [course description](course-description.md) for the full hardware table
with per-item lab references.

### Can I use the original Raspberry Pi Pico instead of the Pico 2?

Mostly no. A Pico 2 **W** (the wireless variant) works identically to a plain Pico 2 for every
lab, but the *original* Pico (built on the RP2040 chip) does not — its Cortex-M0+ core has no
hardware floating-point unit, so Labs 30 through 34 in the assembly module simply cannot run on
it. Lab 28 teaches you to detect this yourself by reading the CPU's own feature registers rather
than trusting a part number or datasheet, since a mislabeled board or a grabbed-by-mistake
original Pico is a real failure mode. See
[Does Your CPU Have an FPU?](chapters/20-does-your-cpu-have-an-fpu/index.md) for the
capability-probing technique and the [course description](course-description.md) for the
hardware kit details.

### How is this textbook organized, and how should I read it?

The book has 27 chapters covering 574 concepts — the course's 200 core theory concepts plus 374
concepts drawn directly from the 35 hands-on labs. Chapters are ordered so every concept appears
after all of its prerequisites, so you can read straight through, or jump to a chapter and follow
its Prerequisites links backward to fill in anything you're missing. The chapters track the
course's 35 labs closely but are organized by concept dependency rather than lab number, so a
small number of chapters (for example, wave math before digital-audio capture) appear in a
different order than the labs they support. See the [chapter overview](chapters/index.md) for
the full list.

### How long does each lab take, and how many labs are there?

There are 35 laboratory exercises, each roughly 45 minutes, organized into eight modules across a
10-week schedule (or self-paced independent study). **Example:** Week 4–5 covers Module 3 (Labs
11–16) alone, since that module builds a complete, working DFT from scratch and the course treats
it as the conceptual core of the whole term. Two labs — Module 3 (Labs 11–16, building the DFT
from scratch) and Lab 28 (the FPU capability probe) — are explicitly load-bearing for everything
that follows, so instructors are advised not to skip them even if other labs are optional. The
lab series is otherwise designed so individual labs can be skipped without breaking later ones.
See the [course description](course-description.md) for the full weekly schedule and module
breakdown.

### What will I be able to build by the end of the course?

By the end you will have built, from scratch and validated at every step: a working DFT, a
working FFT cross-checked against that DFT, a live spectrum analyzer with a real-time display, a
chromatic tuner accurate to about 1.3 Hz, a hand-written ARM assembly FFT that agrees with the
Python version bit-for-bit, and an independent capstone project of your own design. **Example:**
students measure a 512-point FFT going from roughly 21,000 ms on a brute-force DFT down to about
0.59 ms on the best optimized assembly variant — a real, self-measured speedup of over 35,000×
across the whole course. See the [course description](course-description.md) for the full table
of self-measured milestones.

### What software do I need to install before Lab 1?

Just Thonny, a free beginner-friendly Python IDE, and the stock MicroPython firmware for the
Pico 2 (no separate compiler or SDK is required for any of the 35 labs). Lab 1 walks through
connecting the board over USB, working in the interactive REPL, and understanding the difference
between MicroPython — the compact interpreter that runs on the microcontroller itself, with
roughly 520 KB of usable RAM — and CPython, the full desktop Python most students already know,
which typically has gigabytes to work with. That memory gap is exactly why MicroPython exists as
a separate, leaner implementation rather than just running desktop Python on the chip. See
[Hello World](chapters/01-hello-world/index.md) for the full setup walkthrough.

### How is the course graded?

Grading combines laboratory work (30%), homework and quizzes (15%), a midterm at the end of Week
5 covering Modules 0–3 (20%), a capstone project (25%), and a cumulative final exam emphasizing
analysis and evaluation (10%). **Example:** the capstone alone is worth as much as the midterm
and final exam combined, which signals how central the independent project is to the course.
Notably, the capstone is weighted toward method and honesty rather than raw speedup: a negative
result, honestly reported and explained, receives full marks, while an unexplained positive
result does not. The one truly unacceptable move is revising a hypothesis after seeing the data
and presenting it as if it were the original prediction. See the
[course description](course-description.md) for the full grading table.

### What is "productive failure," and why does this course use it deliberately?

Productive failure is a teaching technique this course uses on purpose: certain labs are
engineered so the "obvious" approach produces a confidently wrong answer *before* the fix is
offered, because the struggle itself is the lesson. Two labs are explicitly built this way —
playing a tone above the sampling system's frequency limit causes the instrument to report a
confidently wrong frequency (aliasing), and deliberately overloading the microphone's input
causes new frequencies to appear that were never in the original sound (clipping distortion). If
a lab gives you a result that looks obviously wrong, the course's advice is to resist the urge to
assume you wired something incorrectly and check whether the wrong-looking result is actually the
lesson. See [Capturing Real Audio](chapters/05-capturing-real-audio/index.md) for the preview and
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md)
for the aliasing failure itself.

### What topics does this course explicitly NOT cover?

The course deliberately scopes out assembly language for non-ARM instruction sets, FPGA and ASIC
FFT implementations, multi-dimensional and non-power-of-two transforms, and filter design beyond
the windowing needed for clean spectra. It also does not build a working fixed-point Q15 FFT in
implementation — Lab 28 demonstrates that MicroPython's inline assembler exposes none of the
required DSP saturating instructions, so the tradeoff is discussed but no working Q15 FFT is
built (a Q15 scoping study is an available capstone topic instead). See
[Beyond the Assembler](chapters/25-beyond-the-assembler/index.md) for that discussion and the
[course description](course-description.md) for the full "Concepts Not Covered" list.

## Core Concepts

### What is the Fast Fourier Transform (FFT)?

The Fast Fourier Transform is an algorithm that computes the same result as the Discrete Fourier
Transform (DFT) — converting a signal from the time domain into the frequency domain — but far
more cheaply, using O(N log N) operations instead of the DFT's O(N²). It works by recursively
splitting the transform into smaller sub-transforms (divide and conquer) and recombining their
results with a butterfly operation, an insight first published by Cooley and Tukey in 1965 (and,
unnoticed for over a century, sketched by Gauss in 1805). **Example:** for a 512-point transform,
the FFT needs on the order of 512 × log₂(512) ≈ 4,600 operations versus the DFT's 512² ≈ 262,000
— which is exactly why the course spends an entire module deriving it. See
[From DFT to FFT](chapters/11-from-dft-to-fft/index.md) for the derivation.

### What is the Discrete Fourier Transform (DFT), and how does it differ from the FFT?

The DFT is the direct mathematical definition of converting a sampled, discrete signal into its
frequency-domain representation: for each output frequency bin, it multiplies the entire signal
by a complex exponential test wave and sums the result. It is exactly correct, but it costs
O(N²) operations because every one of N bins requires a full N-term sum. The FFT computes the
identical mathematical result — it is not an approximation — using the same underlying formula,
but restructures the computation with divide and conquer to reach O(N log N) operations instead.
This course builds the DFT first and validates it by hand before deriving the FFT from it, so
that "faster" is provably not "different." See
[Computing and Validating the DFT](chapters/09-computing-and-validating-the-dft/index.md) and
[Why the DFT Is Too Slow](chapters/10-why-the-dft-is-too-slow/index.md).

### How does correlation detect whether a signal contains a specific frequency?

Correlation answers the question "does my signal contain this note?" by multiplying the captured
signal, sample by sample, against a test wave at the frequency you're checking for, then summing
all the products. If the signal genuinely contains that frequency, the products reinforce each
other and the sum is large; if it doesn't, the products largely cancel out and the sum comes out
close to zero. **Example:** correlating a captured 440 Hz tone against a 440 Hz test wave
produces a large sum, while correlating the same signal against a 500 Hz test wave produces a
sum near zero. This single multiply-and-sum operation, swept across every frequency of interest,
is the conceptual seed of the DFT introduced in the next chapter. See
[Correlation](chapters/08-correlation/index.md).

### Why do non-matching frequencies cancel out during correlation?

Because sine waves at different frequencies are mathematically orthogonal: over a complete
enough sample, the positive and negative products of two different-frequency waves balance out
almost exactly, driving their multiply-and-sum total toward zero. Matching frequencies, in
contrast, multiply against themselves and never go negative in the same reinforcing way, so their
sum stays large. This orthogonality property is what makes correlation — and by extension the
DFT, which is a whole bank of correlations against every possible frequency bin at once — able to
isolate individual frequencies out of a mixed signal. See
[Correlation](chapters/08-correlation/index.md).

### What is the Cooley-Tukey algorithm?

The Cooley-Tukey algorithm is the classic divide-and-conquer strategy behind the FFT: instead of
computing one large N-point DFT directly, it recursively splits the input into even-indexed and
odd-indexed samples (decimation in time), computes a smaller DFT on each half, and recombines the
two results using twiddle factors and a butterfly operation. Splitting the input costs almost
nothing — the real savings come from the fact that two size-N/2 DFTs together cost only N²/2
operations, already half the work of one size-N DFT, before the recursion is even applied a
second time. **Example:** at N = 512, one direct DFT costs 512² = 262,144 operations, while two
256-point DFTs together cost 2 × 256² = 131,072 — already half the work, and that's before the
same splitting trick is applied again recursively to each half. Cooley and Tukey published the technique in 1965 while analyzing seismic data;
Gauss had derived an equivalent method in 1805 that went unnoticed for over a century. See
[From DFT to FFT](chapters/11-from-dft-to-fft/index.md).

### What is a butterfly operation?

A butterfly operation is the small recombination step at the heart of every FFT stage: it takes
two inputs, multiplies one of them by a twiddle factor, and produces two outputs by adding and
subtracting that product from the other input. The key efficiency trick is that both outputs
reuse the exact same product — one multiplication yields two answers, rather than needing two
separate multiplications. **Example:** a full 512-point FFT executes N/2 × log₂(N) = 256 × 9 =
2,304 butterfly operations across its 9 stages. See [From DFT to FFT](chapters/11-from-dft-to-fft/index.md)
for the derivation and [The Butterfly in Assembly](chapters/23-the-butterfly-in-assembly/index.md)
for a hand-written implementation.

### What are twiddle factors?

Twiddle factors are the complex numbers, drawn from the roots of unity, that an FFT butterfly
multiplies by when recombining the results of its two sub-transforms — defined as
W_N^k = e^(−i2πk/N). They are precomputed once into a lookup table rather than recalculated
inside the hot loop, since the same set of values is reused across every stage of the transform.
**Example:** for N = 8, the twiddle factor W_8^1 = e^(−i2π/8) is a single fixed complex number
that gets reused across multiple butterflies within a stage, which is exactly why precomputing
the whole table once is so much cheaper than recalculating it on the fly. A trivial twiddle is a
special case worth knowing about: a twiddle factor equal to exactly 1, −1,
i, or −i needs no real multiplication at all, since multiplying by 1 is a no-op and multiplying
by i is just a register swap with a sign flip. See [From DFT to FFT](chapters/11-from-dft-to-fft/index.md)
and [Specialization and Branchless Code](chapters/24-specialization-and-branchless-code/index.md)
for how trivial twiddles get exploited for speed.

### What is bit reversal permutation, and why does an in-place FFT need it?

Bit reversal permutation is the reordering step that lets an iterative FFT compute its result
"in place" — overwriting the same buffer it started with, rather than allocating new memory at
every recursive step. Because the recursive even/odd splitting scrambles sample order according
to the binary digits of each index, converting the recursive FFT into an iterative loop requires
first reordering the input array so that each sample sits at the position given by reversing the
bits of its original index. **Example:** for an 8-point FFT, index 3 (binary 011) reverses to 110,
which is 6 — so the sample originally at position 3 moves to position 6 before the stage loop
runs. See [Building the FFT](chapters/12-building-the-fft/index.md).

### Why is the FFT's O(N log N) complexity so much better than the DFT's O(N²)?

Because the gap between N² and N log N grows explosively as N gets larger, even though both are
just "big O" descriptions of how operation count scales with input size. **Example:** at N = 512,
the DFT needs 512² = 262,144 operations while the FFT needs roughly N/2 × log₂(N) = 2,304
butterfly operations — a difference of over 100×, which the course measures directly as a 146×
real-world speedup on Pico 2 hardware. Doubling N always quadruples the DFT's cost but only
slightly more than doubles the FFT's cost, which is exactly why a brute-force DFT that barely
tolerates small hand-computed examples becomes catastrophically slow at real audio sizes. See
[Why the DFT Is Too Slow](chapters/10-why-the-dft-is-too-slow/index.md) and
[Building the FFT](chapters/12-building-the-fft/index.md).

### How do you cross-validate a new FFT implementation to prove it's correct?

By running the same input signal through both the new FFT and a reference implementation already
proven correct — in this course, the brute-force DFT built and validated against hand-computed
examples in an earlier chapter — and comparing the two outputs bin by bin within a small numerical
tolerance. This "correctness before speed" discipline exists because a fast wrong answer is
worthless, and measuring performance before confirming correctness risks optimizing a bug rather
than an algorithm. If validation fails, the recommended strategy is debugging by bisection: check
whether the first half of the computation (say, the first few FFT stages) is already correct
before assuming the bug is somewhere later. See [Building the FFT](chapters/12-building-the-fft/index.md).

### What is the ARM Cortex-M series, and which variant does this course use?

The ARM Cortex-M series is a family of embedded processor cores designed for microcontrollers,
distinguished by a fixed instruction set architecture and predictable, low-power operation rather
than the flexibility of a general-purpose computer. This course centers on the Cortex-M33 core
inside the Raspberry Pi Pico 2's RP2350 chip, running at 150 MHz with a hardware floating-point
unit and DSP instruction extensions — released in August 2024 at a price point (about $5) that
put real-time signal processing hardware within reach of an undergraduate lab kit for the first
time. **Example:** at 150 MHz, a 40 millisecond real-time audio deadline gives exactly
150,000,000 × 0.040 = 6,000,000 CPU cycles to work with — the single number that governs every
performance budget for the rest of the course. See
[Know Your Board](chapters/02-know-your-board/index.md).

### What is a floating-point unit (FPU), and why does it matter for FFT performance?

A floating-point unit is dedicated hardware circuitry that executes floating-point arithmetic
(like multiplication and addition of decimal numbers) directly in silicon, rather than emulating
it step by step in software. Without one, floating-point operations must be emulated, which the
course notes can be tens to hundreds of times slower for a single operation — a cost that
compounds enormously across an FFT's thousands of multiply-accumulate operations. The Pico 2's
Cortex-M33 includes an FPv5-SP floating-point unit; the original Pico's Cortex-M0+ does not,
which is precisely why the original Pico cannot run this course's later assembly labs. See
[Does Your CPU Have an FPU?](chapters/20-does-your-cpu-have-an-fpu/index.md).

### How do you check whether your chip actually has an FPU?

By reading the chip's own feature registers at runtime rather than trusting a datasheet or part
number — a datasheet is not the chip actually in front of you, and a mislabeled board or a
substituted chip is a real failure mode. On the Cortex-M33 and Cortex-M4, this means reading the
MVFR0 register at address 0xE000EF40 and checking whether bits [3:0] report single-precision
support. This "capability probing" function is only a few lines of MicroPython code, and it turns
a missing capability into diagnostic information — a clear root cause — rather than a confusing
dead end. See [Does Your CPU Have an FPU?](chapters/20-does-your-cpu-have-an-fpu/index.md).

### What are windowing functions, and why does an FFT need them?

A window function is a tapering curve — such as Rectangular, Hann, Hamming, or Blackman — applied
to a captured signal frame before running the FFT, multiplying each sample by a weight that
fades the beginning and end of the frame toward zero. It exists because the DFT/FFT implicitly
assumes the captured frame repeats forever; if the signal doesn't complete a whole number of
cycles inside the frame, an edge discontinuity appears at the seam, smearing energy across
neighboring frequency bins (spectral leakage). Every window makes a tradeoff between main lobe
width (how sharp the peak looks) and side lobe level (how much leakage bleeds into other bins) —
no window wins on both axes at once. See
[Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### Why does every window function trade main lobe width against side lobe level?

Because tapering a signal's edges to reduce the discontinuity that causes leakage necessarily
spreads the frame's effective frequency content across more bins, widening the main lobe even as
it suppresses the side lobes. A rectangular window (effectively no tapering) has the narrowest
possible main lobe but the worst side lobe leakage; a Blackman window tapers aggressively and
achieves excellent side lobe suppression at the cost of the widest main lobe of the common
choices, with Hann and Hamming sitting in between. This is a genuine engineering tradeoff, not a
solved problem — choosing a window means choosing which kind of spectral smearing you can live
with for a given application. See
[Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### What is spectral leakage, and what causes it?

Spectral leakage is the spreading of a signal's true frequency energy across multiple neighboring
FFT bins instead of a single sharp spike, and it is caused by an edge discontinuity: the DFT
treats a captured frame as if it repeats forever, and if the signal inside that frame doesn't
complete a whole number of cycles, the mismatch at the frame's seam smears energy outward when
transformed. Applying a window function tapers the frame's edges toward zero, reducing (but never
fully eliminating) that discontinuity, at the cost of widening the main lobe of the resulting
peak. See [Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### How do you achieve sub-bin frequency accuracy with parabolic interpolation?

By fitting a parabola through the peak bin's magnitude and the magnitudes of its two immediate
neighbors, then using that parabola's vertex to estimate where the true peak sits between bins,
rather than reporting only the coarse bin-width resolution of the raw FFT output. **Example:**
with neighbor magnitudes α (below the peak) and γ (above the peak) around peak magnitude β, the
offset is δ = ½ × (α − γ) / (α − 2β + γ), and the refined frequency estimate becomes
(k + δ) × sample_rate / N. This technique is what lets the course's chromatic tuner reach roughly
1.3 Hz accuracy despite a much coarser raw bin width — but it only works well when a window
function has already been applied, since leakage badly distorts the neighboring-bin magnitudes
the parabola depends on. See
[Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### What are complex numbers, and why does the FFT depend on them?

A complex number extends the ordinary number line with an imaginary component, written as
a + bi, where i represents the square root of −1; its magnitude, √(a² + b²), and its complex
conjugate, a − bi, are used throughout the course. The FFT depends on complex numbers because
each frequency bin's result naturally has two independent pieces of information — how strongly a
frequency is present, and what phase it's shifted by — and a single complex number elegantly
carries both at once via Euler's formula, rather than needing two separate real-valued tracking
schemes. See [Complex Numbers and Wave Superposition](chapters/07-complex-numbers-and-wave-superposition/index.md).

### What is Euler's formula, and why does it matter for the FFT?

Euler's formula states that e^(iθ) = cos(θ) + i·sin(θ), unifying rotation around a circle,
complex numbers, and waves into a single equation. It is doing three jobs simultaneously: it
describes a rotation by angle θ, it names a point on the unit circle with real and imaginary
coordinates, and it describes a wave via its cosine and sine components. This is precisely the
identity that lets the DFT and FFT express "correlate against a test frequency" as a clean
complex exponential multiplication, and it's where twiddle factors (W_N^k = e^(−i2πk/N)) come
from. See [Complex Numbers and Wave Superposition](chapters/07-complex-numbers-and-wave-superposition/index.md).

### What is the difference between the time domain and the frequency domain?

The time domain describes a signal as it's naturally captured — amplitude plotted against time,
which is how any microphone or sensor records the world. The frequency domain describes the same
signal in terms of which frequencies are present and how strong each one is, discarding the
notion of "when" in favor of "which pitch." The Fourier transform (and its fast cousin, the FFT)
is the mathematical bridge between the two representations: raw sensor data looks like noise in
the time domain until it's transformed into the frequency domain, where patterns like a musical
note or an engine's rattle become identifiable numbers. **Example:** a whistled note looks like a
plain wiggling line on a time-domain plot, but transformed into the frequency domain it becomes a
single sharp peak at the whistled pitch — exactly what the course's whistle test relies on. See
[Waves](chapters/04-waves/index.md) and [Complex Numbers and Wave Superposition](chapters/07-complex-numbers-and-wave-superposition/index.md).

### What is the Nyquist frequency, and how do you calculate it?

The Nyquist frequency is the highest frequency a given sampling rate can represent without
ambiguity, and it is calculated as exactly half the sampling rate. **Example:** this course's
microphone samples at 16,000 Hz, so its Nyquist frequency is 16,000 / 2 = 8,000 Hz — any real
frequency above that will be misrepresented when sampled. This limit comes directly from the
Nyquist–Shannon sampling theorem, and it is the reason a system's sample rate must always be
chosen with the highest frequency of interest already in mind. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### What is aliasing, and why does an undersampled tone get reported at the wrong frequency?

Aliasing is the distortion that occurs when a signal contains frequency content above the Nyquist
frequency: the sampling process cannot distinguish that high frequency from a lower "alias"
frequency, so it gets folded down and reported as something it isn't. **Example:** an 11,000 Hz
tone sampled at 16,000 Hz doesn't vanish — it folds down and is reported as 5,000 Hz, with total
confidence and no error message. The fix is never to debug the code; it's to raise the sampling
rate above twice the highest frequency present, or filter out anything above the Nyquist
frequency before sampling. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### How do you measure execution time precisely using the DWT cycle counter?

By enabling the ARM Cortex-M33's Data Watchpoint and Trace (DWT) unit — setting the TRCENA bit in
the DEMCR register and the CYCCNTENA bit in the DWT.CTRL register — and then reading its 32-bit
CYCCNT hardware register before and after the code you want to time. Subtracting the two readings
(using masked, unsigned subtraction to handle the counter wrapping around after about 28.6
seconds at 150 MHz) gives elapsed time in clock cycles, which can be converted to real time since
one cycle equals 6.67 nanoseconds at the Pico 2's default clock speed. This resolution is what
makes it possible to time a sub-millisecond FFT at all — MicroPython's ordinary millisecond timer
is far too coarse for that job. See [Measuring Time](chapters/17-measuring-time/index.md).

### What statistics should a trustworthy benchmark report?

At minimum, a trustworthy benchmark should report the number of trials run, which statistic was
used (mean with standard deviation, or a best-of-N minimum), and what the timed region does and
does not include. **Example:** "412 μs ± 18 μs, mean of 50 runs" is far more trustworthy than a
bare "412 μs," because the spread tells you how much a single measurement can be trusted and the
sample size tells you how stable that estimate is. This course's convention is to report
best-of-N when comparing raw algorithmic speed between implementations, and to report the mean
when describing what a deployed system will actually feel like to a user in practice. See
[Benchmarking Methodology](chapters/18-benchmarking-methodology/index.md).

### What is cache memory, and why does memory access pattern affect FFT speed?

Cache memory is a small, fast pool of memory that sits between the CPU and main memory, holding
recently or predictably accessed data so the processor doesn't have to wait on slower memory
accesses every time. Memory access pattern matters because sequential, predictable access lets
the cache do its job well, while scattered or unpredictable access (a cache miss) stalls the
processor while it waits for data to arrive. Bit-reversal reordering, used to convert a recursive
FFT into an in-place iterative one, is the course's canonical example of a cache-unfriendly access
pattern, since it deliberately jumps around the buffer rather than walking through it in order.
**Example:** for an 8-point FFT, bit reversal moves the sample at index 1 to index 4 and the
sample at index 3 to index 6 — a scattered access pattern that a straight, sequential loop over
the array would never produce. See
[Specialization and Branchless Code](chapters/24-specialization-and-branchless-code/index.md).

### What is the CMSIS-DSP library, and when would you use it instead of hand-written code?

CMSIS-DSP (also called Arm Math) is ARM's own production-grade DSP and FFT library, permissively
licensed (Apache 2.0) and well-tested across the Cortex-M family, including the Pico 2's
Cortex-M33. You'd reach for it — or a comparable library like KissFFT — instead of hand-written
assembly any time you need a well-tested, maintained FFT in a real project, since production
systems almost always call a battle-tested library rather than shipping custom code. This course
builds a hand-written FFT anyway, on the theory that understanding the internals is what lets you
correctly read, evaluate, and integrate a production library later, rather than treating it as a
black box. See [The Butterfly in Assembly](chapters/23-the-butterfly-in-assembly/index.md).

## Technical Detail Questions

### What does "frequency bin" mean, and how do you calculate a bin's center frequency?

A frequency bin is one discrete output slot of a DFT or FFT, representing a narrow band of
frequencies rather than a single exact frequency. A bin's center frequency is computed as
(bin index × sample rate) / N. **Example:** for N = 1024 at a 44.1 kHz sample rate, bin index 1
has a center frequency of about 43.1 Hz, and the width each bin spans (the bin width, equal to
sample_rate / N) is also the transform's frequency resolution — meaning doubling N halves the bin
width and gives finer resolution, at the cost of a longer capture time. See
[Computing and Validating the DFT](chapters/09-computing-and-validating-the-dft/index.md).

### What is the difference between a magnitude spectrum, a phase spectrum, and a power spectrum?

Given a complex FFT bin with real and imaginary parts, the magnitude spectrum is
√(re² + im²) — how strongly that frequency is present — and the phase spectrum is
atan2(im, re) — how that frequency component is shifted in time. The power spectrum is the
magnitude squared, proportional to signal energy rather than amplitude; using power instead of
magnitude exaggerates loud peaks and suppresses quiet ones on a display that isn't already
decibel-scaled. **Example:** two neighboring bins with magnitudes 100 and 10 differ by a factor
of 10, but their power values — 10,000 and 100 — differ by a factor of 100, which is why a raw
power display makes a dominant peak look even more dominant than a magnitude display of the exact
same data would. This
course mostly displays magnitude (and its decibel-scaled form) since the driving question is
"which notes are present," not the finer phase information, though phase remains meaningful for
tasks like synthesis or filtering that this course doesn't emphasize. See
[Computing and Displaying a Real Spectrum](chapters/14-computing-and-displaying-a-real-spectrum/index.md).

### What are the three I2S signal wires, and what does each one do?

I2S (Inter-IC Sound) audio streams from the INMP441 microphone over three wires: the bit clock
(BCLK/SCK), which toggles once per bit and provides timing; the word select line (WS/LRCLK), which
indicates which audio channel is currently being transmitted; and the serial data line (SD/DOUT),
which carries the actual sample payload bit by bit. MicroPython's `I2S` class reads this stream
into a pre-allocated audio buffer via a buffered `readinto()` call, which is far more efficient
than reading one sample at a time. See
[Capturing Real Audio](chapters/05-capturing-real-audio/index.md).

### Why does the INMP441 microphone output 24-bit samples inside a 32-bit word?

Because the I2S protocol and the microphone's own electrical design communicate in fixed 32-bit
word slots even though the sensor's actual resolution is 24 bits, left-justified inside that
32-bit container. To recover a correct sample value, the extra low bits have to be discarded with
an arithmetic right shift after unpacking the raw binary data — in this course's example code,
unpacking with `struct.unpack("<i", ...)` and then shifting right by 8 bits. Getting this shift
wrong is a common source of garbled or scaled-wrong audio in early labs. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### What is quantization, and how does bit depth affect quantization error?

Quantization is the rounding that happens when a continuous analog signal is represented with a
finite number of discrete amplitude levels, and bit depth is how many bits are used to represent
each sample — more bits mean more levels and smaller rounding error. **Example:** 8-bit depth
gives only 256 levels and roughly 0.4% maximum quantization error, while 16-bit depth gives
65,536 levels and roughly 0.0015% error; each additional bit of depth roughly doubles the number
of levels and adds about 6 dB of dynamic range. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### What is the difference between clipping and quantization error?

Quantization error is small, unavoidable rounding noise from representing a continuous signal
with finite bit depth — more bits shrink it, but it's always present. Clipping is different and
more severe: it happens when a signal's amplitude exceeds the format's full-scale value, and once
a sample clips, the information above full scale is simply gone — there is no processing trick
later in the pipeline that can recover it. That irreversibility is why this course teaches
watching input levels *before* recording rather than trying to fix an over-driven signal
afterward, and why leaving headroom (not recording as loud as possible) matters. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### What is the difference between the Hann, Hamming, and Blackman windows?

All three are tapering window functions applied before an FFT to reduce spectral leakage, but
they sit at different points on the main-lobe-width versus side-lobe-level tradeoff. The Hann
window offers a moderate main lobe with good side lobe suppression; the Hamming window narrows
the main lobe slightly further and gives very good suppression specifically near the main lobe;
the Blackman window widens the main lobe the most of the three but achieves the best overall side
lobe suppression. None dominates the others — choosing between them means choosing which kind of
spectral smearing is acceptable for a given application. See
[Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### What is a "real FFT," and why is it faster than a general complex FFT?

A real FFT is an FFT variant specifically optimized for real-valued input (like microphone audio,
which has no imaginary component) rather than the fully general case of complex-valued input. It
runs roughly twice as fast as a general complex FFT on the same real-valued input by exploiting
spectrum symmetry — the fact that a real signal's spectrum has the property that its upper half
is a mirror of its lower half, so only half of the output actually needs to be computed and
stored. See [FFT Variants, Complexity, and Correctness](chapters/13-fft-variants-complexity-and-correctness/index.md).

### What is the difference between decimation in time and decimation in frequency?

Decimation in time is the specific FFT strategy used throughout this course: it splits the
*input* sequence by index — even-indexed samples versus odd-indexed samples — before each
recursive step, which is why the course's Radix-2 implementation begins with an even/odd split of
the input array. Decimation in frequency instead splits by *output* bin rather than input index,
producing a different but mathematically equivalent recursive structure. Both remain O(N log N)
divide-and-conquer algorithms built from twiddle factors and butterflies — they only change which
axis gets split first. See [FFT Variants, Complexity, and Correctness](chapters/13-fft-variants-complexity-and-correctness/index.md).

### What are radix-4 and split-radix FFTs, and how do they compare to radix-2?

Radix-4 splits each stage into four sub-transforms instead of two, needing only log₄(N) stages
compared to radix-2's log₂(N) stages; split-radix is a hybrid approach that minimizes the total
multiplication count by mixing radix-2 and radix-4 style splits. All three variants remain
O(N log N) in complexity — the radix choice only changes the constant factor (relative
multiplication count and implementation complexity), not the fundamental complexity class. This
course builds a radix-2 FFT because it's the clearest to derive and implement by hand, but
production libraries often use higher radices or split-radix for a modest additional speed edge.
See [FFT Variants, Complexity, and Correctness](chapters/13-fft-variants-complexity-and-correctness/index.md).

### What is the difference between ARMv6-M, ARMv7-M, and ARMv8-M?

These are three generations of ARM's Cortex-M instruction set architecture. ARMv6-M (used by the
Cortex-M0+ in the original Raspberry Pi Pico's RP2040 chip) is integer-only, with no
floating-point unit and no DSP extensions. ARMv7-M (used by the Cortex-M4) adds an optional FPU
and DSP instruction extensions. ARMv8-M (used by the Cortex-M33 in the Pico 2's RP2350 chip) adds
security extensions on top of the ARMv7-M feature set, while keeping the FPU and DSP instructions.
**Example:** the Pico 2's Cortex-M33 implements ARMv8-M, which is exactly why it can run this
course's assembly labs while the original Pico's ARMv6-M chip cannot. See
[Does Your CPU Have an FPU?](chapters/20-does-your-cpu-have-an-fpu/index.md).

### What are general-purpose registers, and how many does the Cortex-M33 provide?

General-purpose registers are small, extremely fast storage locations built directly into the
CPU, used to hold values during computation instead of constantly reading and writing to memory.
**Example:** the Cortex-M33 provides thirteen general-purpose registers, r0 through r12, each
holding one 32-bit value, plus three special-purpose registers: sp (the stack pointer), lr (the
link register), and pc (the program counter). The FPU adds a separate bank of 32 floating-point
registers, s0 through s31, used exclusively for floating-point arithmetic. See
[Your First Assembly Function](chapters/21-your-first-assembly-function/index.md) and
[Talking to the FPU](chapters/22-talking-to-the-fpu/index.md).

### What does the ARM argument-passing convention specify?

The argument-passing convention is the standardized rule specifying which CPU register holds each
function argument when assembly code is called. **Example:** under MicroPython's inline
assembler decorator, the first argument arrives in register r0, the second in r1, and so on up
through r3, with the function's return value coming back in r0. Naming a parameter something other than `r0` in the
Python-level function signature doesn't change this — the parameter name is documentation for the
programmer, not an instruction to the hardware, which always places arguments in registers by
position regardless of what they're called. See
[Your First Assembly Function](chapters/21-your-first-assembly-function/index.md).

### What does the VMLA (multiply-accumulate) instruction do?

VMLA is a fused multiply-accumulate FPU instruction: `VMLA s2, s0, s1` computes
s2 = s2 + (s0 × s1) in a single instruction, rather than requiring a separate VMUL followed by a
separate VADD. This saves a cycle compared to issuing the two instructions individually, and it
also avoids rounding the intermediate product before adding it, making the result slightly more
numerically accurate. Because a butterfly operation's core arithmetic is exactly this
"multiply-then-add" pattern, VMLA is the arithmetic core of a hand-written assembly FFT. See
[Talking to the FPU](chapters/22-talking-to-the-fpu/index.md).

### Why must byte offsets, not element indices, be used when addressing a typed array from assembly?

Because hardware memory addresses only count bytes — there is no concept of "the third float" at
the hardware level, only "the byte at this address." To load the Nth element of a buffer of
32-bit floats, assembly code must compute base_address + (N × 4), since each float occupies 4
bytes. **Example:** if a loop that should advance the pointer by 4 bytes per element instead
advances it by only 1 byte, every load after the first will read from the wrong address, landing
in the middle of a float rather than at an element boundary, and produce garbage values. This is
also why the course uses `array.array` typed arrays rather than plain Python lists for assembly
work — typed arrays guarantee a fixed, predictable stride between elements that byte-offset math
depends on. See [Talking to the FPU](chapters/22-talking-to-the-fpu/index.md).

### What is the difference between Q15 and Q31 fixed-point formats?

Both are fixed-point number formats that represent fractional values using integers rather than
floating point. Q15 uses a 16-bit signed integer with 15 fractional bits, representing values in
the range [−1, 1); Q31 is the 32-bit counterpart with 31 fractional bits, giving finer precision
at twice the storage cost. Unlike floating point, whose exponent lets precision track a value's
magnitude automatically, fixed-point formats have constant precision regardless of magnitude —
which is why a Q15 implementation handles signals with very wide dynamic range (quiet passages
plus loud transients) poorly without careful manual scaling. See
[Beyond the Assembler](chapters/25-beyond-the-assembler/index.md).

### What is the difference between a CPU's instruction set architecture and its toolchain?

A CPU's instruction set architecture (ISA) is the complete specification of every machine
instruction, register, and encoding rule the hardware actually supports — it defines what a
program running on that chip can and cannot do. The toolchain (an assembler or compiler) is a
separate piece of software that translates human-written code into machine instructions, and it
only implements a subset of what the ISA actually allows. **Example:** the Cortex-M33's FPU
supports the VFMA instruction in hardware, but MicroPython's `asm_thumb` inline assembler has no
mnemonic for it at all — an assembler limitation, not a hardware one — which is why this course
shows how to hand-encode that instruction directly as a raw machine word. See
[Beyond the Assembler](chapters/25-beyond-the-assembler/index.md).

### What is the difference between kernel time and total time when benchmarking a variant?

Kernel time is how long an algorithm's core computational routine takes in isolation — for
example, just the butterfly loop of an FFT. Total time is the full end-to-end time, including
setup, data marshalling across a Python/assembly boundary, and any other integration overhead
around that kernel. **Example:** a kernel-versus-total-time comparison in this course found an
assembly butterfly kernel running 20× faster than a Python equivalent, but the total frame time
only improved 3× once the data marshalling cost of crossing the language boundary was included.
This is exactly why a fast kernel doesn't automatically translate into a fast overall program. See
[Competing Variants](chapters/26-competing-variants/index.md).

### What is the difference between MicroPython's @native and @viper decorators?

Both are MicroPython decorators that compile a function ahead of time instead of interpreting its
bytecode, but they differ in how aggressively they optimize. The `@micropython.native` decorator
skips the interpreter's dispatch overhead but still uses ordinary boxed Python values.
`@micropython.viper` goes further, using type annotations and machine types to work with unboxed
values directly — skipping both interpreter dispatch and boxing — which typically makes it the
fastest of the three, but at the cost of losing MicroPython's automatic memory-safety net inside
that function. See [The Abstraction Ladder](chapters/19-the-abstraction-ladder/index.md).

### What is the difference between boxed and unboxed values, and why does it affect speed?

A boxed value is a value stored with extra runtime type information attached — standard
MicroPython boxes every integer and object this way, which enables Python's dynamic typing but
costs extra memory and CPU time to allocate and unwrap. An unboxed value, used inside a
`@micropython.viper` function, is a raw machine value with no such wrapper, directly usable by
CPU arithmetic instructions with no unwrapping step. Skipping boxing is one of the two main
reasons the viper code emitter runs faster than plain MicroPython (the other being skipped
interpreter dispatch). See [The Abstraction Ladder](chapters/19-the-abstraction-ladder/index.md).

## Common Challenge Questions

### Why does my script disappear after I unplug the Pico?

Because a script that was only *run* from Thonny's editor pane, without ever being saved to the
device, lived in Thonny's memory on your laptop rather than in the Pico's own device filesystem.
The fix is to explicitly save the file to the board (not just run it), and if you want it to start
automatically on power-up with no computer attached, it must be saved under the exact filename
`main.py` in the root folder of the device filesystem — not `main.PY`, not inside a `/lib`
subfolder, and not any other filename. See [Hello World](chapters/01-hello-world/index.md).

### Why does my OLED display not update even though I called the drawing functions?

Because drawing functions (like drawing text or shapes) only modify an in-memory framebuffer —
they don't push anything to the physical screen by themselves. You have to explicitly call the
display's `.show()` (or equivalent refresh) method to actually transfer the framebuffer's contents
over SPI to the SSD1306 controller and update the visible pixels. **Example:** the course's
128×64 monochrome display needs only 1,024 bytes of RAM for its entire framebuffer, small enough
to redraw completely on every frame, but that redrawn buffer still sits in memory invisibly until
`.show()` sends it over the wire. This draw-then-show pattern shows up throughout the course
anywhere the OLED is used, and forgetting the final `.show()` call is one of the most common early
mistakes when wiring up the display for the first time. See
[Peripherals](chapters/03-peripherals/index.md).

### Why does my button read the opposite of what I expect (active-low logic)?

Because many button circuits, including the ones in this course's kit, use active-low logic: the
signal reads as logic *low* (0) when the button is actively pressed, and logic *high* (1) when
it's at rest — the opposite of what intuition suggests "active" should mean. This wiring uses a
pull-up resistor to hold the pin high by default, with a press pulling it down to ground.
**Example:** code that reads `pin.value() == 1` to detect a press will silently get it exactly
backwards, responding when the button is released and ignoring it when pressed — check for `0`
instead. See [Peripherals](chapters/03-peripherals/index.md).

### Why did my instrument report a completely wrong frequency with total confidence?

Almost certainly aliasing: the tone you played was above the Nyquist frequency for your sampling
rate, and the sampling process folded it down to a lower frequency it reported instead — with no
error message, because as far as the math is concerned, that's the correct answer given an
ambiguous input. **Example:** an 11,000 Hz tone sampled at 16,000 Hz gets reported as 5,000 Hz.
The fix is never to debug the reporting code; it's to raise the sampling rate above twice the
highest frequency you care about, or filter out anything above the Nyquist frequency before
sampling. This is one of this course's deliberate "productive failure" labs. See
[Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### Why can't I fix a clipped audio recording after the fact?

Because clipping isn't noise that can be filtered out — it's a hard information loss. Once a
sample's true amplitude exceeds the format's full-scale value, everything above that ceiling is
simply gone from the recording; there is no processing trick anywhere later in a signal-processing
pipeline that can recover data that was never captured. That's fundamentally different from
quantization error, which is small and unavoidable but doesn't destroy information the same way.
The only real fix is preventative: watch input levels and leave headroom before recording, not
after. See [Sampling, Quantization, and Aliasing](chapters/06-sampling-quantization-and-aliasing/index.md).

### Why does correlating a signal against a single test wave sometimes give a false zero (the "phase problem")?

Because correlation against a single test wave is phase-sensitive: if a captured signal genuinely
contains the test frequency but is 90 degrees out of phase with the test wave, the multiply-and-sum
total comes out at or near zero even though the frequency is clearly present. This is a real flaw
in using a single test wave, not a feature. The fix is to correlate against two test waves 90
degrees apart — an in-phase component and a quadrature component — and combine them into a
phase-independent correlation magnitude, √(I² + Q²), which is what the DFT effectively does at
every bin. See [Correlation](chapters/08-correlation/index.md).

### My 8-point DFT test passed — why is my full-size DFT still too slow?

Because quadratic complexity is a trap that looks fine at small scale and only reveals itself at
realistic sizes: an 8-point DFT by hand only needs 64 operations total, which runs instantly no
matter how it's implemented, so a small hand-computed test can validate correctness while
completely hiding the scaling problem. **Example:** at N = 512 (a realistic audio frame size),
the same O(N²) DFT needs 262,144 operations, and on this course's Pico 2 hardware that measures
out to roughly 21,000 ms against a 40 ms real-time budget — about 530× too slow. Passing a small
correctness test and being fast enough for real-time use are two completely different questions.
See [Why the DFT Is Too Slow](chapters/10-why-the-dft-is-too-slow/index.md).

### My FFT is still 3.5x over budget after validation passed — does that mean it's wrong?

No — don't confuse "still too slow" with "still wrong." If your FFT has already been cross-validated
bin-by-bin against a trusted DFT reference and passed, its correctness has been proven
independently of its speed. Being over a real-time budget is a *performance* problem caused by how
the code executes (interpreter overhead, language-level costs, and so on), not a *correctness*
problem in the algorithm itself. This exact situation — a validated, correct FFT that's still 3.5×
over budget — is precisely what motivates this course's later optimization work (native/viper
compilation and hand-written assembly), rather than signaling a bug to hunt down. See
[Building the FFT](chapters/12-building-the-fft/index.md).

### Why doesn't my FFT's magnitude output match NumPy's, even though both should be correct?

Because two mathematically correct FFT implementations can still disagree in their raw numbers
due to differing normalization conventions — some libraries scale by 1/N, some by 1/√N, and some
apply no scaling factor at all, and different libraries apply it at different points (forward
transform, inverse transform, or split between both). A factor-of-N or factor-of-√N mismatch
between two correct implementations is one of the most common false alarms in signal processing.
Before assuming a bug, check the normalization convention each implementation uses rather than
comparing raw magnitudes directly. See
[FFT Variants, Complexity, and Correctness](chapters/13-fft-variants-complexity-and-correctness/index.md).

### Why can't I just use time.ticks_ms() to time an FFT?

Because MicroPython's millisecond timer is far too coarse for timing something as fast as an
optimized FFT — like timing a sprinter with a sundial. **Example:** this course's fully optimized
assembly FFT runs in about 0.59 milliseconds — a duration a millisecond-resolution timer can
barely distinguish from zero, let alone measure precisely enough to compare against a competing
implementation. The DWT hardware cycle counter, by contrast, offers 6.67-nanosecond resolution at the
Pico 2's 150 MHz clock speed — nearly six orders of magnitude finer — which is precise enough to
meaningfully measure and compare fast implementations. See
[Measuring Time](chapters/17-measuring-time/index.md).

### What is counter wraparound, and how do I handle it correctly?

The DWT cycle counter (CYCCNT) is only a 32-bit register, so it wraps back around to zero after
counting 2³² − 1 cycles — about 28.6 seconds at the Pico 2's 150 MHz clock speed. If a timed
region happens to straddle that wraparound point, a naive `end - start` subtraction can produce a
negative or absurdly large number instead of the correct small elapsed value. The fix is masked,
unsigned subtraction: `elapsed = (end - start) & 0xFFFFFFFF`, which correctly handles the wrap
regardless of whether it occurred. Wraparound bugs like this have shipped in real production
firmware, so it's worth handling deliberately rather than assuming it won't happen. See
[Measuring Time](chapters/17-measuring-time/index.md).

### Why did my benchmark comparison of two variants not match my prediction?

That's expected, and it's valuable — a surprising result is data, not a failure. This course has
students commit to a ranking prediction of every FFT variant *before* measuring, precisely
because being wrong is instructive: nearly every quantitative prediction made while building this
course turned out to be optimistic. The correct response when a measured ranking surprises you is
to investigate and explain why the prediction was wrong (common culprits include data marshalling
cost, sub-linear composition of combined optimizations, or an unaccounted controlled variable),
not to hide or quietly "fix" the surprising result. See
[Competing Variants](chapters/26-competing-variants/index.md).

### What is the most common bug when hand-writing ARM assembly?

Overwriting a register you still needed for something else. Because assembly registers have no
built-in scoping or protection the way local variables do in a high-level language, it's easy to
reuse a register for a new purpose without realizing an earlier value stored there — like a loop
counter — is still needed later in the routine. **Example:** if a summing loop accidentally wrote
its running total into the same register holding the loop counter, the counter would silently be
destroyed, and the loop would run the wrong number of times (or infinitely) with no error message
at all, since the CPU has no way to know the value "shouldn't" have changed. See
[Your First Assembly Function](chapters/21-your-first-assembly-function/index.md).

## Best Practice Questions

### When should I report the mean execution time versus the best-of-N (minimum) time?

Report best-of-N (the minimum across many trials) when the goal is comparing raw algorithmic
speed between implementations — it strips out transient interference and answers "how fast can
this code go under ideal conditions?" Report the mean, together with its standard deviation, when
the goal is describing what a deployed system will actually feel like to a real user in practice,
since a user experiences the typical case, not the best case. **Example:** one implementation
might have the lowest mean but the widest spread (making it inconsistent in practice), while a
best-of-N comparison of the same data tells a different story — conflating the two statistics is
a common source of misleading benchmark claims. See
[Benchmarking Methodology](chapters/18-benchmarking-methodology/index.md).

### How do I account for the observer effect when benchmarking code?

The observer effect is the fact that the act of measuring changes what you measure: every extra
register read, print statement, or function call inside a timing loop consumes cycles that get
counted as part of the result if you're not careful. The practical fix is to keep the timed region
as tight as possible around only the code you actually care about, avoid any allocation or I/O
inside it, and where feasible, measure and subtract the overhead of the timing mechanism itself so
it doesn't get attributed to the code under test. See
[Benchmarking Methodology](chapters/18-benchmarking-methodology/index.md).

### Why should you validate correctness before measuring performance?

Because a fast wrong answer is worthless, and measuring performance on unvalidated code risks
optimizing a bug rather than an algorithm — you could spend real effort making incorrect code
faster without ever noticing it was wrong. This course enforces "correctness before speed" as a
strict sequencing rule: every new FFT implementation is cross-validated bin-by-bin against a
trusted reference before any performance claim is made about it. If validation fails, debugging by
bisection (checking whether an earlier portion of the computation is already correct before
assuming the bug is later) is the recommended systematic strategy. See
[Building the FFT](chapters/12-building-the-fft/index.md).

### What is debugging by bisection, and when should I use it?

Debugging by bisection is a systematic strategy for isolating a bug: rather than guessing where
an error might be, you check whether a known-good intermediate point in the computation — say, the
midpoint of a multi-stage FFT — already matches a trusted reference, and use that to eliminate half
the search space at a time. **Example:** if a hand-written assembly FFT matches its Python
reference bit-for-bit through stage 7 of 9 but diverges at stage 8, the bug search narrows
immediately to that one stage's parameters rather than the whole implementation. Use it whenever a
multi-step computation produces a wrong final answer and a single obvious cause isn't apparent.
See [Computing and Validating the DFT](chapters/09-computing-and-validating-the-dft/index.md) and
[The Butterfly in Assembly](chapters/23-the-butterfly-in-assembly/index.md).

### Why should you avoid memory allocation inside a benchmarked region of code?

Because MicroPython's garbage collector can pause execution at unpredictable moments to reclaim
memory, and if that pause happens to fall inside a timed region, it silently inflates the
measurement with time that has nothing to do with the algorithm being tested. This course treats
"no allocation in timed region" as a strict rule for exactly this reason — any allocation
(creating a new list, a new buffer, or a new object) inside benchmarked code risks an invisible,
non-reproducible garbage-collection cost showing up in your results. Pre-allocate all buffers
before entering the timed region instead. See [Talking to the FPU](chapters/22-talking-to-the-fpu/index.md).

### How do I choose which window function to use for a given application?

Choose based on which side of the main-lobe-width versus side-lobe-level tradeoff matters more
for your application. If you need to distinguish two closely spaced frequencies, a narrower main
lobe (favoring something closer to rectangular or Hann) helps more. If you need to reliably detect
a quiet tone in the presence of a much louder nearby frequency, better side lobe suppression
(favoring Hamming or Blackman) matters more, since poor suppression lets the loud tone's leakage
mask the quiet one. There's no universally "best" window — the right choice depends on which kind
of spectral smearing your specific application can tolerate. See
[Windowing, Spectral Leakage, and Peak Detection](chapters/15-windowing-spectral-leakage-and-peak-detection/index.md).

### How do I decide between MicroPython, C, and assembly for a given task?

Treat it as a five-rung ladder — plain MicroPython, `@micropython.native`, `@micropython.viper`,
C, and hand-written assembly — where each step down trades more development effort and less
portability for more speed. Start at the top and only descend the ladder when profiling shows a
specific piece of code is actually the bottleneck; assembly applied to code that isn't the
bottleneck is added complexity with no measurable benefit. Also measure your own hardware rather
than trusting a generic table of expected speedup multipliers, since actual gains depend heavily
on what the specific code does. **Example:** this course's own 512-point FFT went from about
140 ms in pure Python to about 0.85 ms in hand-written assembly — a real, measured 165× speedup —
but that multiplier is specific to this exact computation and hardware, not a number to assume
will transfer to a different piece of code. See
[The Abstraction Ladder](chapters/19-the-abstraction-ladder/index.md).

### Why should optimizations be measured one at a time (optimization attribution)?

Because when several optimizations are combined, their total effect is almost never simply the
sum of their individually measured gains — this course calls that phenomenon sub-linear
composition, since combined techniques often compete for the same limited resource, like CPU
registers or instruction-cache space. Measuring and recording each optimization's contribution one
change at a time, before combining it with the next, is the only way to honestly credit each
individual technique rather than attributing a shared, overlapping gain to whichever change
happened to be measured last. See
[Specialization and Branchless Code](chapters/24-specialization-and-branchless-code/index.md) and
[Competing Variants](chapters/26-competing-variants/index.md).

### What should a benchmark report state to be considered trustworthy?

At minimum: the hardware and clock speed it ran on, the input size (such as FFT length), the
number of trials and which statistic was reported (mean plus standard deviation, or best-of-N),
whether timing overhead was measured and subtracted, whether warm-up runs were discarded before
measuring, and explicitly what the timed region does and does not include. A bare number like
"380 μs, best of 50 runs" is still missing most of this context. Honest reporting also means
disclosing exclusions and negative results rather than quietly omitting whichever runs don't
support the conclusion you expected. See
[Benchmarking Methodology](chapters/18-benchmarking-methodology/index.md).

### How do you scope a capstone project so it's actually achievable?

By narrowing an ambitious idea down to one precise, answerable research question with a clearly
identified independent variable, dependent variable, and everything else held as a controlled
variable — achievable within one to three weeks. **Example:** "build a production noise-cancellation
headset" is not scoped, but "measure how accurately a windowed FFT can identify a single
dominant noise frequency in a recorded fan hum, and how that accuracy changes with window choice"
is — it names exactly what varies (window type), what's measured (peak-frequency error), and what
stays fixed. See [Capstone](chapters/27-capstone/index.md).

### What is the "work split" strategy between Python and hand-written assembly, and when should you use it?

The work split strategy keeps one-time setup work — building a twiddle factor table, orchestrating
which stage runs next — in ordinary Python, while only the repeatedly executed "hot loop" (the
actual butterfly arithmetic, run thousands of times per transform) is hand-written in assembly.
The two sides communicate through a small typed-array "stage parameter block" crossing the
Python/assembly boundary rather than many separate arguments. Use this approach whenever most of a
program's total runtime is concentrated in a small, well-defined inner loop — rewriting the whole
program in assembly for a one-time setup cost that barely matters is effort spent in the wrong
place. See [The Butterfly in Assembly](chapters/23-the-butterfly-in-assembly/index.md).

### Why is a negative or unsupported benchmark result still a fully successful outcome?

Because this course's grading and methodology both treat honest reporting as the actual skill
being assessed, not raw speedup. A negative result — an optimization that didn't help, or a
hypothesis the data didn't support — honestly reported and explained, receives full marks; an
unexplained positive result does not. The only genuinely unacceptable move, in a capstone or
anywhere else, is revising a hypothesis after seeing the data and presenting the revision as if it
had been the original prediction. Science (and honest engineering) values a well-explained "no"
over a suspiciously convenient "yes." See
[Benchmarking Methodology](chapters/18-benchmarking-methodology/index.md) and
[Capstone](chapters/27-capstone/index.md).

## Advanced Topic Questions

### Why doesn't MicroPython's assembler support the VFMA instruction even though the hardware does?

Because a chip's instruction set architecture (ISA) is a superset of whatever any one specific
assembler or compiler chooses to implement — the Cortex-M33's FPU supports VFMA (vector fused
multiply-add) in hardware, but MicroPython's `asm_thumb` inline assembler simply has no mnemonic
for it. This is a toolchain limitation, not a hardware one, and it's a useful reminder that "my
assembler doesn't have an instruction for X" is a different claim entirely from "my chip can't do
X." See [Beyond the Assembler](chapters/25-beyond-the-assembler/index.md).

### How do you hand-encode a machine instruction your assembler doesn't support?

By looking up the instruction's official encoding table (which specifies opcode bits and operand
bit fields), computing the exact 32-bit machine word by hand, and inserting it directly using a
raw `data()` directive, since the assembler performs no validation of hand-supplied bytes.
**Example:** encoding `VFMA s2, s0, s1` means correctly setting bit fields for the opcode plus the
destination register (Sd), first operand (Sn), and second operand (Sm) across specific bit
positions like 6, 12, and 22. Because a single wrong bit produces a different but still valid
instruction rather than an assembler error, verification requires two independent checks: testing
the result bit-for-bit against a hand-computed expected value, and disassembling the encoded word
as an independent witness that it means what you think it means. See
[Beyond the Assembler](chapters/25-beyond-the-assembler/index.md).

### What is "sub-linear composition," and why don't combined optimizations add up?

Sub-linear composition is the observed pattern where combining several individually effective
optimizations yields less total speedup than simply adding their separately measured gains would
predict. It happens because optimizations often compete for the same limited, shared resource —
CPU registers, instruction-cache space, or the same portion of the execution pipeline — so their
benefits overlap rather than stack cleanly. **Example:** four optimizations to an assembly FFT
each measured a real individual improvement, but their combined effect was noticeably smaller than
the sum of the four gains, which is exactly the expected pattern rather than a sign anything is
broken. See [Specialization and Branchless Code](chapters/24-specialization-and-branchless-code/index.md)
and [Competing Variants](chapters/26-competing-variants/index.md).

### Why can a variant with the fastest kernel time still lose on total time?

Because a benchmark's kernel time only measures the isolated computational core, while total time
also includes data marshalling cost and integration cost — such as copying data into the exact
buffer format an assembly routine expects, or crossing the Python/assembly call boundary. A
variant can have a dramatically faster inner loop and still lose overall if the overhead of
feeding it data and retrieving results eats into that advantage. This is exactly why this course's
comparison matrices report kernel time and total time as two separate columns rather than a single
number. See [Competing Variants](chapters/26-competing-variants/index.md).

### What real-world applications use the same FFT techniques taught in this course?

Real-time FFT techniques from this course underpin voice recognition (isolating speech frequency
content), active noise cancellation (identifying and countering dominant frequencies), machine
monitoring and vibration analysis (diagnosing equipment faults from their frequency signature),
radar processing, software-defined radio, and communication systems like the OFDM scheme used in
Wi-Fi and cellular networks. Each of these domains reuses the same core building blocks this
course builds from scratch — sampling, windowing, the FFT itself, peak detection, and honest
benchmarking — just applied to a different signal source and a different question. See
[Capstone](chapters/27-capstone/index.md).

### How do open-source licenses like MIT and GPL affect the choice of an FFT library?

Permissive licenses like the MIT-style terms used by CMSIS-DSP or the BSD-style terms used by
KissFFT allow a library to be used in almost any project, including closed-source or commercial
ones, with minimal obligations. The GPL license used by FFTW is more restrictive — it generally
requires that a project incorporating GPL-licensed code also be released under compatible terms,
or that the project instead purchase a commercial license — which is one reason FFTW "rarely" fits
a typical microcontroller project's needs despite being a well-regarded library. Checking a
library's license is therefore a real engineering decision, not just a legal formality. See
[The Butterfly in Assembly](chapters/23-the-butterfly-in-assembly/index.md).

### Why does this course deliberately not implement a working fixed-point Q15 FFT?

Because MicroPython's inline assembler exposes none of the actual DSP saturating-arithmetic
instructions a real Q15 fixed-point FFT implementation would need, so building one isn't
practically achievable within the course's chosen toolchain. The tradeoffs of fixed-point versus
floating-point arithmetic (constant precision regardless of magnitude, versus floating point's
ability to track magnitude via its exponent) are still discussed, and a Q15 scoping study remains
an available capstone project topic for students who want to explore the road not taken. See
[Beyond the Assembler](chapters/25-beyond-the-assembler/index.md).

### What four sections does a rigorous capstone report need, and what does each one do?

A capstone report needs a methodology section (what was measured and how, including the
independent, dependent, and controlled variables), a results presentation (the actual measured
data, typically as tables or charts), a limitations statement (an honest account of anything that
could affect how far the conclusion should be trusted, such as an uncontrolled variable), and a
conclusion drawing (what the results actually support, distinct from what was merely hoped for).
Writing a limitations statement can feel like admitting weakness, but the course frames it as the
opposite — it's precisely what separates a scientific report from a sales pitch. See
[Capstone](chapters/27-capstone/index.md).
