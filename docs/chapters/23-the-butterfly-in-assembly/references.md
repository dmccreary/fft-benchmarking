# References: The Butterfly in Assembly: A Complete FFT and Production Libraries

1. [Butterfly diagram](https://en.wikipedia.org/wiki/Butterfly_diagram) - Wikipedia - Explains the classic FFT butterfly structure combining an even and odd value through a twiddle factor, the exact operation this chapter hand-codes in eight ARM FPU instructions.

2. [Register allocation](https://en.wikipedia.org/wiki/Register_allocation) - Wikipedia - Covers register pressure and spilling excess values to memory when a routine needs more live values than available registers, the concepts this chapter applies to its twelve-register butterfly.

3. [Comparison of free and open-source software licenses](https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licenses) - Wikipedia - Tabulates permissive versus copyleft license terms, background for this chapter's comparison of CMSIS-DSP's Apache license, KissFFT's BSD license, and FFTW's GPL license.

4. ARM System Developer's Guide: Designing and Optimizing System Software - Andrew N. Sloss, Dominic Symes, and Chris Wright - Morgan Kaufmann - Widely cited for its hands-on treatment of hand-optimizing ARM/Thumb routines, including deliberately managing register allocation and minimizing spill code, the discipline this chapter's scratch-register discussion draws on directly.

5. The Fast Fourier Transform and Its Applications - E. Oran Brigham - Prentice Hall - Originated the standard butterfly-diagram notation for the divide-and-conquer FFT structure that this chapter's hand-written assembly butterfly directly implements, real and imaginary parts separated.

6. [CMSIS-DSP](https://github.com/ARM-software/CMSIS-DSP) - Arm Software (GitHub) - Source repository for Arm's own Apache-2.0-licensed DSP and FFT library referenced in this chapter as the Arm Math Library, hand-optimized for Cortex-M cores including the M33.

7. [CMSIS-DSP: Complex FFT F32](https://arm-software.github.io/CMSIS-DSP/main/group__ComplexFFTF32.html) - Arm Software - API documentation for `arm_cfft_f32` and its initializers, the kind of library API documentation this chapter contrasts with reading a hand-written assembly butterfly's source directly.

8. [kissfft](https://github.com/mborgerding/kissfft) - Mark Borgerding (GitHub) - Repository for KissFFT, the small BSD-licensed open source FFT library this chapter names as easy to read and integrate at some cost in raw speed.

9. [FFTW: Fastest Fourier Transform in the West](https://www.fftw.org/) - FFTW Project - Official site for the highly optimized, GPL-licensed FFT library this chapter cites as too large for a microcontroller but a standard name in broader signal-processing work.

10. [audio-spectrogram-example-for-pico](https://github.com/ArmDeveloperEcosystem/audio-spectrogram-example-for-pico) - Arm Developer Ecosystem (GitHub) - Working example linking CMSIS-DSP into a Raspberry Pi Pico project for real-time audio spectrum display, a concrete illustration of this chapter's library-integration and Pico SDK FFT discussion.
