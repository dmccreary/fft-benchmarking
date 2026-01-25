# FFT Benchmarking Course Taxonomy

## Taxonomy Categories

The 200 concepts are organized into 12 pedagogically-sound categories with balanced distribution.

### 1. MATH - Mathematical Foundations (16 concepts, 8%)
**Abbreviation:** MATH
**Description:** Core mathematical concepts underlying FFT and signal processing

**Concept IDs:** 1-16

**Concepts:**

- Complex Numbers, Imaginary Unit, Euler's Formula
- Sine Wave, Cosine Wave, Amplitude, Frequency, Phase
- Periodic Functions, Harmonics
- Complex Conjugate, Magnitude, Unit Circle
- Hertz, Time Domain, Frequency Domain

### 2. SIGP - Signal Processing Fundamentals (16 concepts, 8%)
**Abbreviation:** SIGP
**Description:** Basic signal processing concepts including sampling, filtering, and windowing

**Concept IDs:** 17-32

**Concepts:**

- Analog Signals, Digital Signals
- Sampling, Sampling Rate, Nyquist Theorem, Aliasing
- Quantization, Bit Depth, ADC Conversion
- Signal Noise, Signal To Noise Ratio, Bandwidth
- Low Pass Filter, Band Pass Filter
- Windowing Functions, Spectral Leakage

### 3. FOUR - Fourier Theory (16 concepts, 8%)
**Abbreviation:** FOUR
**Description:** Theoretical foundations of Fourier transforms including DFT and spectral analysis

**Concept IDs:** 33-48

**Concepts:**

- Jean Baptiste Fourier, Fourier Series
- Continuous Fourier Transform, Discrete Fourier Transform
- DFT Definition, DFT Complexity, Inverse DFT
- Frequency Bins, Bin Resolution
- Spectral Analysis, Power Spectrum, Magnitude Spectrum, Phase Spectrum
- Frequency Resolution, Zero Padding, Orthogonality

### 4. FFTA - FFT Algorithm (24 concepts, 12%)
**Abbreviation:** FFTA
**Description:** FFT algorithm implementations, variants, and computational structures

**Concept IDs:** 49-72

**Concepts:**

- FFT Algorithm, FFT History, Cooley Tukey Algorithm
- Radix-2 FFT, Radix-4 FFT, Split Radix FFT
- Butterfly Operation, Butterfly Diagram, Twiddle Factors
- Bit Reversal, In Place FFT
- Decimation In Time, Decimation In Frequency
- FFT Stages, FFT Complexity, O(N log N)
- FFT Size, Power Of Two Sizes
- Real FFT, Complex FFT, Inverse FFT, IFFT Algorithm
- Normalization Factor, FFT Scaling

### 5. HARD - Hardware Platforms (16 concepts, 8%)
**Abbreviation:** HARD
**Description:** Microcontrollers, processors, and embedded systems used for FFT computation

**Concept IDs:** 73-88

**Concepts:**

- Microcontroller, ARM Architecture, ARM Cortex M Series
- ARM Cortex M4, ARM Cortex M33
- Raspberry Pi Pico, Raspberry Pi Pico 2
- RP2040 Chip, RP2350 Chip
- DSP Chip, General Purpose CPU
- Clock Speed, CPU Cycles
- Memory Architecture, Cache Memory, Embedded Systems

### 6. DSPI - DSP Instructions (16 concepts, 8%)
**Abbreviation:** DSPI
**Description:** Digital signal processing instructions and hardware acceleration features

**Concept IDs:** 89-104

**Concepts:**

- DSP Instructions, SIMD Instructions
- MAC Instruction, Multiply Accumulate
- Saturating Arithmetic, Fixed Point Arithmetic
- Floating Point Unit, FPU Operations, Single Precision Float
- Q Format Numbers, Q15 Format, Q31 Format
- Hardware Multiplier, Pipelining, Instruction Latency
- Real Time Constraints

### 7. PROG - Programming (16 concepts, 8%)
**Abbreviation:** PROG
**Description:** Programming languages, compilers, and development tools

**Concept IDs:** 105-120

**Concepts:**

- C Language, C Compiler, GCC Compiler, ARM Compiler
- Compiler Optimization, Optimization Flags
- Assembly Language, ARM Assembly, Thumb Instructions
- Python Language, NumPy Library, SciPy FFT, MicroPython
- Memory Management, Reading Assembly Code, Disassembly

### 8. LIBS - FFT Libraries (12 concepts, 6%)
**Abbreviation:** LIBS
**Description:** Software libraries for FFT computation and their licensing

**Concept IDs:** 121-132

**Concepts:**

- FFT Libraries, CMSIS DSP Library, Kiss FFT, FFTW Library
- Arm Math Library, Pico SDK FFT, Open Source FFT
- Library Licensing, MIT License, GPL License
- Library Integration, API Documentation

### 9. BNCH - Benchmarking (18 concepts, 9%)
**Abbreviation:** BNCH
**Description:** Benchmarking methodology, metrics, and measurement frameworks

**Concept IDs:** 133-150

**Concepts:**

- Benchmarking, Performance Metrics
- Execution Time, Clock Cycles
- Microseconds Per FFT, FFTs Per Second
- Throughput Metric, Latency Metric, Memory Usage, Code Size
- Test Harness, Warm Up Runs, Statistical Sampling
- Mean Execution Time, Standard Deviation
- Reproducibility, Fair Comparison, Benchmarking Framework

### 10. PERF - Performance Optimization (14 concepts, 7%)
**Abbreviation:** PERF
**Description:** Performance factors, optimization techniques, and real-time processing

**Concept IDs:** 151-164

**Concepts:**

- Integer FFT, Floating Point FFT, Fixed Point FFT
- Precision Tradeoffs, Speed Accuracy Tradeoff
- Cache Effects, Memory Access Patterns
- Loop Unrolling, Vectorization
- Real Time Processing, Streaming FFT, Block Processing
- Double Buffering, Compiler Settings

### 11. PIPE - Signal Pipeline (12 concepts, 6%)
**Abbreviation:** PIPE
**Description:** Signal preprocessing and post-processing operations

**Concept IDs:** 165-176

**Concepts:**

- Signal Preprocessing, DC Offset Removal, Normalization
- Window Application, Zero Padding Input
- Post Processing, Magnitude Calculation, Phase Calculation
- Decibel Conversion, Peak Detection
- Frequency Estimation, Dominant Frequency

### 12. VAPP - Visualization and Applications (24 concepts, 12%)
**Abbreviation:** VAPP
**Description:** Data visualization, reporting, and practical FFT applications

**Concept IDs:** 177-200

**Concepts:**

- Data Visualization, Spectrum Plot, Spectrogram, Waterfall Display
- Time Domain Plot, Performance Charts, Comparison Tables
- Performance Dashboard, Benchmark Results, Report Generation
- Audio Processing, Music Analysis, Voice Recognition
- Noise Cancellation, Spectrum Analyzer, Pitch Detection
- Vibration Analysis, Machine Monitoring, Radar Processing
- Communication Systems, Software Defined Radio, Biomedical Signals
- Sound Processing, Capstone Project, Benchmark Suite

## Distribution Summary

| Category | Code | Count | Percentage | Status |
|----------|------|-------|------------|--------|
| Mathematical Foundations | MATH | 16 | 8.0% | ✓ Under 30% |
| Signal Processing | SIGP | 16 | 8.0% | ✓ Under 30% |
| Fourier Theory | FOUR | 16 | 8.0% | ✓ Under 30% |
| FFT Algorithm | FFTA | 24 | 12.0% | ✓ Under 30% |
| Hardware Platforms | HARD | 16 | 8.0% | ✓ Under 30% |
| DSP Instructions | DSPI | 16 | 8.0% | ✓ Under 30% |
| Programming | PROG | 16 | 8.0% | ✓ Under 30% |
| FFT Libraries | LIBS | 12 | 6.0% | ✓ Under 30% |
| Benchmarking | BNCH | 18 | 9.0% | ✓ Under 30% |
| Performance Optimization | PERF | 14 | 7.0% | ✓ Under 30% |
| Signal Pipeline | PIPE | 12 | 6.0% | ✓ Under 30% |
| Visualization & Applications | VAPP | 24 | 12.0% | ✓ Under 30% |
| **Total** | | **200** | **100%** | **✓ Balanced** |

## Category Relationships

**Mathematical Foundation:** MATH → FOUR → SIGP
**Algorithm Path:** FOUR → FFTA → PERF
**Hardware Platform:** HARD → DSPI
**Software Path:** PROG → LIBS → BNCH
**Processing Pipeline:** SIGP → PIPE → VAPP

## Pedagogical Flow

1. **Weeks 1-2:** MATH and SIGP foundations
2. **Weeks 3-4:** FOUR and FFTA algorithm concepts
3. **Weeks 5-6:** HARD and DSPI hardware
4. **Week 7:** PROG programming and LIBS libraries
5. **Week 8:** BNCH benchmarking methodology
6. **Week 9:** PERF optimization and PIPE signal pipeline
7. **Week 10:** VAPP applications and capstone project

## Quality Metrics

- **12 categories** (target: ~12)
- **All categories < 30%** of total (largest: FFTA and VAPP at 12%)
- **Balanced distribution** across theoretical and practical domains
- **Clear abbreviations** (3-5 letters)
- **Pedagogically coherent** category groupings
