# References: Computing and Displaying a Real Spectrum

1. [Spectral density](https://en.wikipedia.org/wiki/Spectral_density) - Wikipedia - Defines power spectral density and its relationship to squared amplitude, directly explaining this chapter's power-versus-magnitude tradeoff and why a power spectrum makes strong peaks look more dominant than magnitude does.

2. [Fourier transform](https://en.wikipedia.org/wiki/Fourier_transform) - Wikipedia - Explains representing a transform's output in polar form as magnitude and phase, the exact split this chapter performs on every FFT bin before building the magnitude spectrum and phase spectrum arrays.

3. [Decibel](https://en.wikipedia.org/wiki/Decibel) - Wikipedia - Defines the logarithmic decibel scale and the factor-of-two difference between power-based and amplitude-based decibel formulas, matching this chapter's dB = 20log10(magnitude) versus dB = 10log10(power) distinction exactly.

4. The Scientist and Engineer's Guide to Digital Signal Processing - Steven W. Smith - California Technical Publishing - Smith is known for pairing every spectral-analysis concept, including magnitude/phase decomposition and decibel compression, with a directly adjacent worked numerical example and plot, a before/after visual style widely credited with making these formulas concrete for self-taught engineers.

5. Understanding Digital Signal Processing - Richard G. Lyons - Prentice Hall - Lyons is credited with popularizing the "alpha max plus beta min" fast magnitude approximation as a practical, multiplication-cheap alternative to computing sqrt(re^2+im^2), the exact technique this chapter presents for magnitude calculation on constrained hardware.

6. [Spectrum Analysis in Python](https://www.geeksforgeeks.org/artificial-intelligence/spectrum-analysis-in-python/) - GeeksforGeeks - Walks through decomposing a signal into frequency components with FFT and power spectral density, including a periodogram example, reinforcing this chapter's pipeline from raw FFT output to a displayable spectrum.

7. [Interpret FFT results - obtaining magnitude and phase information](https://www.gaussianwaves.com/2015/11/interpreting-fft-results-obtaining-magnitude-and-phase-information/) - GaussianWaves - Shows exactly how to extract magnitude and phase from complex FFT bins, including the atan2-versus-plain-arctangent quadrant problem this chapter flags for its own phase calculation formula.

8. [The Fundamentals of FFT-Based Signal Analysis and Measurement](https://www.sjsu.edu/people/burford.furman/docs/me120/FFT_tutorial_NI.pdf) - National Instruments (hosted via San Jose State University) - Application-note-style tutorial covering magnitude, phase, and decibel scaling of FFT output, directly paralleling this chapter's post-processing pipeline from raw bins to a decibel-scaled display value.

9. [Understanding the Decibel - Formula, Definition, Calculations](https://www.electronics-notes.com/articles/basic_concepts/decibel/basics-tutorial-formula-equation.php) - Electronics Notes - Explains the base-10 logarithmic decibel formula and the separate power versus voltage/amplitude conventions, the precise arithmetic behind this chapter's decibel conversion step for compressing a spectrum's dynamic range.

10. [fft - Fast Fourier Transform](https://www.mathworks.com/help/matlab/ref/fft.html) - MathWorks - Documents computing and plotting a single-sided magnitude spectrum from FFT output, giving a second worked implementation of the magnitude-spectrum and half-spectrum-display steps this chapter builds on the Pico 2.
