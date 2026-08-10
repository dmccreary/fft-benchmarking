#!/usr/bin/env python3
"""Merge the hands-on lab concepts into the learning graph.

Adds the concepts introduced by the 35 labs of Plan 03 to the existing
200-concept graph, assigning IDs 201+ in LAB ORDER so that concept ID
sequence matches teaching sequence.

Dependencies are written as concept LABELS (not IDs) and resolved here, so
this file stays readable and reorder-safe. Every dependency must resolve to a
concept introduced in the same lab or earlier -- the script checks this and
refuses to write a graph that would teach a concept before its prerequisite.

Usage:  python3 add-lab-concepts.py
"""

import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
GRAPH = os.path.join(HERE, "learning-graph.csv")

# New taxonomy categories introduced by the lab series.
NEW_TAXONOMIES = {
    "TOOL": "Development Environment",
    "MCIO": "Microcontroller I/O",
    "AUDI": "Audio and Acoustics",
    "ASMP": "Assembly Programming",
    "LABM": "Laboratory Method",
}

# (lab number, lab title, [(label, taxonomy, [dependency labels]), ...])
LABS = [
 (1, "Hello World with Thonny", [
   ("Thonny IDE", "TOOL", []),
   ("MicroPython Firmware", "TOOL", ["MicroPython"]),
   ("USB Serial Connection", "TOOL", ["Thonny IDE"]),
   ("REPL", "TOOL", ["Thonny IDE"]),
   ("Print Statement", "TOOL", ["REPL"]),
   ("Script Execution", "TOOL", ["Thonny IDE"]),
   ("Saving To Device", "TOOL", ["Script Execution", "MicroPython Firmware"]),
   ("Device Filesystem", "TOOL", ["Saving To Device"]),
   ("Keyboard Interrupt", "TOOL", ["Script Execution"]),
   ("MicroPython vs CPython", "TOOL", ["MicroPython", "Python Language"]),
 ]),
 (2, "Blink: Your First Hardware Program", [
   ("General Purpose IO", "MCIO", ["Microcontroller"]),
   ("GPIO Pin", "MCIO", ["General Purpose IO"]),
   ("Pin Object", "MCIO", ["GPIO Pin", "Script Execution"]),
   ("Digital Output", "MCIO", ["Pin Object"]),
   ("Onboard LED", "MCIO", ["Digital Output"]),
   ("Logic High And Low", "MCIO", ["Digital Output"]),
   ("Pin Toggle", "MCIO", ["Logic High And Low"]),
   ("Sleep Delay", "MCIO", ["Script Execution"]),
   ("Infinite Loop", "MCIO", ["Sleep Delay", "Keyboard Interrupt"]),
 ]),
 (3, "Know Your Board", [
   ("Firmware Version", "TOOL", ["MicroPython Firmware"]),
   ("CPU Clock Frequency", "HARD", ["Clock Speed"]),
   ("RAM Versus Flash", "HARD", ["Memory Architecture"]),
   ("Free Memory Query", "TOOL", ["RAM Versus Flash"]),
   ("Filesystem Statistics", "TOOL", ["Device Filesystem", "RAM Versus Flash"]),
   ("Memory Mapped Register", "HARD", ["Memory Architecture"]),
   ("CPUID Register", "HARD", ["Memory Mapped Register", "ARM Cortex M33"]),
   ("Silicon Revision", "HARD", ["CPUID Register"]),
   ("Unique Device ID", "HARD", ["Memory Mapped Register"]),
 ]),
 (4, "The OLED Display", [
   ("Serial Peripheral Interface", "MCIO", ["GPIO Pin"]),
   ("SPI Clock And Data", "MCIO", ["Serial Peripheral Interface"]),
   ("Chip Select Line", "MCIO", ["Serial Peripheral Interface"]),
   ("Display Driver Chip", "MCIO", ["Serial Peripheral Interface"]),
   ("SSD1306 Controller", "MCIO", ["Display Driver Chip"]),
   ("Framebuffer", "VAPP", ["SSD1306 Controller"]),
   ("Monochrome Display", "VAPP", ["Framebuffer"]),
   ("Pixel Coordinates", "VAPP", ["Framebuffer"]),
   ("Text Rendering", "VAPP", ["Pixel Coordinates"]),
   ("Display Refresh", "VAPP", ["Framebuffer"]),
   ("Shared Configuration Module", "TOOL", ["Saving To Device"]),
 ]),
 (5, "Buttons and Interaction", [
   ("Digital Input", "MCIO", ["Pin Object"]),
   ("Pull Up Resistor", "MCIO", ["Digital Input"]),
   ("Active Low Logic", "MCIO", ["Pull Up Resistor", "Logic High And Low"]),
   ("Switch Bounce", "MCIO", ["Digital Input"]),
   ("Debouncing", "MCIO", ["Switch Bounce", "Sleep Delay"]),
   ("Polling Loop", "MCIO", ["Digital Input", "Infinite Loop"]),
   ("Edge Detection", "MCIO", ["Polling Loop", "Debouncing"]),
   ("Event Loop", "MCIO", ["Polling Loop"]),
   ("Mode Switching", "MCIO", ["Edge Detection", "Event Loop"]),
 ]),
 (6, "Deploying Code and Libraries", [
   ("File Transfer To Device", "TOOL", ["Device Filesystem"]),
   ("mpremote Tool", "TOOL", ["File Transfer To Device"]),
   ("Library Directory", "TOOL", ["File Transfer To Device"]),
   ("Import Path", "TOOL", ["Library Directory"]),
   ("Module Import", "TOOL", ["Import Path", "Shared Configuration Module"]),
   ("Autorun main.py", "TOOL", ["Device Filesystem"]),
   ("Standalone Operation", "TOOL", ["Autorun main.py"]),
   ("Code Organization", "TOOL", ["Module Import"]),
 ]),
 (7, "Your First Sound Capture", [
   ("MEMS Microphone", "AUDI", []),
   ("INMP441 Microphone", "AUDI", ["MEMS Microphone"]),
   ("Digital Microphone Output", "AUDI", ["INMP441 Microphone", "Digital Signals"]),
   ("I2S Protocol", "MCIO", ["Serial Peripheral Interface"]),
   ("Bit Clock", "MCIO", ["I2S Protocol"]),
   ("Word Select Line", "MCIO", ["I2S Protocol"]),
   ("I2S Serial Data", "MCIO", ["I2S Protocol"]),
   ("Audio Buffer", "AUDI", ["I2S Protocol"]),
   ("Buffered Read", "MCIO", ["Audio Buffer"]),
   ("Sample Word Format", "AUDI", ["Digital Microphone Output", "Bit Depth"]),
   ("Twenty Four Bit In Thirty Two", "AUDI", ["Sample Word Format"]),
   ("Arithmetic Right Shift", "AUDI", ["Twenty Four Bit In Thirty Two"]),
   ("Unpacking Binary Data", "AUDI", ["Buffered Read", "Sample Word Format"]),
 ]),
 (8, "Sound Levels: RMS and a VU Meter", [
   ("Root Mean Square", "AUDI", ["Unpacking Binary Data", "Magnitude"]),
   ("Sound Level", "AUDI", ["Root Mean Square"]),
   ("Loudness Perception", "AUDI", ["Sound Level"]),
   ("Thonny Plotter", "VAPP", ["Print Statement"]),
   ("Moving Average", "AUDI", ["Sound Level"]),
   ("Exponential Smoothing", "AUDI", ["Moving Average"]),
   ("Sensor Auto Calibration", "AUDI", ["Sound Level"]),
   ("Bar Graph Display", "VAPP", ["Pixel Coordinates", "Sound Level"]),
   ("Decibel Scale", "AUDI", ["Sound Level", "Decibel Conversion"]),
   ("Level Meter", "VAPP", ["Bar Graph Display", "Decibel Scale"]),
 ]),
 (9, "Sampling Rate and Aliasing", [
   ("Sample Period", "SIGP", ["Sampling Rate"]),
   ("Sampling Theorem", "SIGP", ["Nyquist Theorem", "Sample Period"]),
   ("Nyquist Frequency", "SIGP", ["Sampling Theorem"]),
   ("Aliasing Artifact", "SIGP", ["Aliasing", "Nyquist Frequency"]),
   ("Frequency Folding", "SIGP", ["Aliasing Artifact"]),
   ("Anti Aliasing Filter", "SIGP", ["Aliasing Artifact", "Low Pass Filter"]),
   ("Undersampling", "SIGP", ["Nyquist Frequency"]),
   ("Tone Generator", "AUDI", ["Frequency"]),
   ("Sample Rate Selection", "SIGP", ["Nyquist Frequency", "Sample Rate Selection Tradeoff"]),
   ("Sample Rate Selection Tradeoff", "SIGP", ["Sampling Theorem"]),
   ("Productive Failure", "LABM", []),
 ]),
 (10, "Bit Depth, Headroom and Clipping", [
   ("Dynamic Range", "AUDI", ["Bit Depth"]),
   ("Full Scale Value", "AUDI", ["Dynamic Range"]),
   ("Headroom", "AUDI", ["Full Scale Value"]),
   ("Clipping", "AUDI", ["Full Scale Value"]),
   ("Clipping Distortion", "AUDI", ["Clipping", "Harmonics"]),
   ("Quantization Error", "SIGP", ["Quantization"]),
   ("Noise Floor", "AUDI", ["Quantization Error", "Signal Noise"]),
   ("Amplitude Normalization", "AUDI", ["Full Scale Value", "Normalization"]),
   ("Integer Overflow", "AUDI", ["Full Scale Value"]),
 ]),
 (11, "Sine Waves: Amplitude, Frequency, Phase", [
   ("Radians", "MATH", ["Unit Circle"]),
   ("Angular Frequency", "MATH", ["Radians", "Frequency"]),
   ("Period Of A Wave", "MATH", ["Frequency"]),
   ("Phase Offset", "MATH", ["Phase", "Radians"]),
   ("Sine Synthesis", "MATH", ["Sine Wave", "Angular Frequency"]),
   ("Sample Index To Time", "SIGP", ["Sample Period", "Sine Synthesis"]),
   ("Waveform Plotting", "VAPP", ["Thonny Plotter", "Sine Synthesis"]),
   ("Peak Amplitude", "MATH", ["Amplitude"]),
   ("DC Component", "SIGP", ["Amplitude"]),
   ("Signal Synthesis", "SIGP", ["Sine Synthesis"]),
 ]),
 (12, "Adding Waves: Superposition and Beats", [
   ("Superposition Principle", "MATH", ["Signal Synthesis"]),
   ("Wave Addition", "MATH", ["Superposition Principle"]),
   ("Constructive Interference", "MATH", ["Wave Addition", "Phase Offset"]),
   ("Destructive Interference", "MATH", ["Wave Addition", "Phase Offset"]),
   ("Beat Frequency", "AUDI", ["Wave Addition"]),
   ("Amplitude Envelope", "AUDI", ["Beat Frequency"]),
   ("Fundamental Frequency", "AUDI", ["Harmonics"]),
   ("Overtones", "AUDI", ["Fundamental Frequency"]),
   ("Timbre", "AUDI", ["Overtones"]),
   ("Additive Synthesis", "AUDI", ["Wave Addition", "Overtones"]),
 ]),
 (13, "Correlation: Does My Signal Contain This Note?", [
   ("Correlation", "FOUR", ["Wave Addition"]),
   ("Multiply And Sum", "FOUR", ["Correlation"]),
   ("Dot Product", "MATH", ["Multiply And Sum"]),
   ("Test Frequency", "FOUR", ["Correlation", "Sine Synthesis"]),
   ("Similarity Measure", "FOUR", ["Correlation"]),
   ("Orthogonal Functions", "FOUR", ["Orthogonality", "Dot Product"]),
   ("In Phase Component", "FOUR", ["Correlation", "Cosine Wave"]),
   ("Quadrature Component", "FOUR", ["Correlation", "Sine Wave"]),
   ("Phase Independence", "FOUR", ["In Phase Component", "Quadrature Component"]),
   ("Correlation Magnitude", "FOUR", ["Phase Independence", "Magnitude"]),
   ("Basis Function", "FOUR", ["Orthogonal Functions"]),
   ("Projection Onto Basis", "FOUR", ["Basis Function", "Dot Product"]),
 ]),
 (14, "Sweeping All Frequencies: You Just Built a DFT", [
   ("Frequency Sweep", "FOUR", ["Test Frequency"]),
   ("Bin Index", "FOUR", ["Frequency Bins", "Frequency Sweep"]),
   ("Bin Center Frequency", "FOUR", ["Bin Index"]),
   ("Bin Width", "FOUR", ["Bin Center Frequency", "Bin Resolution"]),
   ("Spectrum Array", "FOUR", ["Bin Index", "Correlation Magnitude"]),
   ("Eight Point DFT By Hand", "FOUR", ["Spectrum Array", "DFT Definition"]),
   ("Complex Exponential", "MATH", ["Euler's Formula", "Radians"]),
   ("Real And Imaginary Parts", "MATH", ["Complex Exponential"]),
   ("Spectrum Symmetry", "FOUR", ["Spectrum Array", "Complex Conjugate"]),
   ("Negative Frequencies", "FOUR", ["Spectrum Symmetry"]),
   ("DC Bin", "FOUR", ["Bin Index", "DC Component"]),
   ("Nyquist Bin", "FOUR", ["Bin Index", "Nyquist Frequency"]),
 ]),
 (15, "Validating Your DFT on a Known Signal", [
   ("Ground Truth", "LABM", []),
   ("Known Signal Test", "LABM", ["Ground Truth", "Signal Synthesis"]),
   ("Validation Before Trust", "LABM", ["Known Signal Test"]),
   ("Numerical Tolerance", "LABM", ["Ground Truth"]),
   ("Absolute Error", "LABM", ["Numerical Tolerance"]),
   ("Relative Error", "LABM", ["Absolute Error"]),
   ("Bin Exact Frequency", "FOUR", ["Bin Center Frequency", "Known Signal Test"]),
   ("Expected Peak", "LABM", ["Bin Exact Frequency"]),
   ("Debugging By Bisection", "LABM", ["Validation Before Trust"]),
   ("Test Signal Design", "LABM", ["Known Signal Test"]),
 ]),
 (16, "Your DFT Is Too Slow", [
   ("Algorithmic Complexity", "BNCH", ["DFT Complexity"]),
   ("Quadratic Complexity", "BNCH", ["Algorithmic Complexity"]),
   ("Operation Counting", "BNCH", ["Algorithmic Complexity"]),
   ("Scaling Behavior", "BNCH", ["Quadratic Complexity"]),
   ("Real Time Budget", "PERF", ["Real Time Constraints", "Sample Period"]),
   ("Frame Duration", "PERF", ["Real Time Budget", "FFT Size"]),
   ("Processing Deadline", "PERF", ["Frame Duration"]),
   ("Performance Bottleneck", "BNCH", ["Operation Counting"]),
   ("Motivation For Optimization", "BNCH", ["Performance Bottleneck", "Processing Deadline"]),
 ]),
 (17, "Divide and Conquer: From DFT to FFT", [
   ("Divide And Conquer", "FFTA", ["Motivation For Optimization"]),
   ("Even Odd Split", "FFTA", ["Divide And Conquer"]),
   ("Recursive Decomposition", "FFTA", ["Even Odd Split"]),
   ("Subproblem", "FFTA", ["Recursive Decomposition"]),
   ("Recombination Step", "FFTA", ["Subproblem"]),
   ("Logarithmic Stages", "FFTA", ["Recursive Decomposition"]),
   ("Complexity Reduction", "FFTA", ["Logarithmic Stages", "O(N log N)"]),
   ("Power Of Two Constraint", "FFTA", ["Even Odd Split", "Power Of Two Sizes"]),
   ("Redundant Computation", "FFTA", ["Divide And Conquer"]),
   ("Symmetry Exploitation", "FFTA", ["Redundant Computation", "Spectrum Symmetry"]),
 ]),
 (18, "Bit Reversal and Twiddle Factors", [
   ("Bit Reversal Permutation", "FFTA", ["Bit Reversal", "Even Odd Split"]),
   ("Index Reversal", "FFTA", ["Bit Reversal Permutation"]),
   ("Permutation Table", "FFTA", ["Index Reversal"]),
   ("Roots Of Unity", "MATH", ["Unit Circle", "Complex Exponential"]),
   ("Twiddle Factor Table", "FFTA", ["Twiddle Factors", "Roots Of Unity"]),
   ("Precomputation", "PERF", ["Twiddle Factor Table"]),
   ("Lookup Table", "PERF", ["Precomputation", "Permutation Table"]),
   ("Loop Invariant Hoisting", "PERF", ["Precomputation"]),
   ("In Place Reordering", "FFTA", ["Permutation Table", "In Place FFT"]),
   ("Swap Operation", "FFTA", ["In Place Reordering"]),
   ("Interleaved Storage", "PERF", ["Twiddle Factor Table"]),
 ]),
 (19, "The Butterfly", [
   ("Butterfly Structure", "FFTA", ["Butterfly Operation", "Recombination Step"]),
   ("Complex Multiplication", "MATH", ["Complex Numbers", "Real And Imaginary Parts"]),
   ("Four Multiply Form", "FFTA", ["Complex Multiplication"]),
   ("Butterfly Pair", "FFTA", ["Butterfly Structure"]),
   ("Stage Span", "FFTA", ["Butterfly Pair", "FFT Stages"]),
   ("Data Flow Graph", "FFTA", ["Butterfly Diagram"]),
   ("Butterfly Count", "FFTA", ["Stage Span", "Logarithmic Stages"]),
   ("Stage Loop", "FFTA", ["Stage Span"]),
   ("Cross Add And Subtract", "FFTA", ["Butterfly Structure"]),
 ]),
 (20, "A Complete Python FFT", [
   ("Iterative FFT", "FFTA", ["Stage Loop", "In Place Reordering"]),
   ("Algorithm Assembly", "FFTA", ["Iterative FFT", "Four Multiply Form"]),
   ("Reference Implementation", "LABM", ["Algorithm Assembly", "Validation Before Trust"]),
   ("Cross Validation", "LABM", ["Reference Implementation", "Relative Error"]),
   ("Speedup Factor", "BNCH", ["Execution Time"]),
   ("Correctness Before Speed", "LABM", ["Cross Validation"]),
   ("Function Decomposition", "PROG", ["Code Organization"]),
 ]),
 (21, "Spectrum of a Real Sound", [
   ("Magnitude Computation", "PIPE", ["Magnitude Calculation", "Iterative FFT"]),
   ("Fast Magnitude Approximation", "PIPE", ["Magnitude Computation"]),
   ("Power Versus Magnitude", "PIPE", ["Magnitude Computation", "Power Spectrum"]),
   ("Bin Averaging For Display", "VAPP", ["Bin Index", "Bar Graph Display"]),
   ("Logarithmic Scaling", "VAPP", ["Decibel Scale"]),
   ("Square Root Scaling", "VAPP", ["Bin Averaging For Display"]),
   ("Spectrum Bars", "VAPP", ["Bin Averaging For Display", "Spectrum Plot"]),
   ("Frame Capture", "AUDI", ["Buffered Read", "Frame Duration"]),
   ("Live Spectrum Display", "VAPP", ["Spectrum Bars", "Frame Capture"]),
   ("Whistle Test", "LABM", ["Live Spectrum Display", "Tone Generator"]),
   ("Half Spectrum Display", "VAPP", ["Spectrum Symmetry", "Spectrum Bars"]),
 ]),
 (22, "Windowing and Spectral Leakage", [
   ("Spectral Leakage Effect", "SIGP", ["Spectral Leakage", "Bin Exact Frequency"]),
   ("Rectangular Window", "SIGP", ["Windowing Functions"]),
   ("Hanning Window", "SIGP", ["Windowing Functions", "Spectral Leakage Effect"]),
   ("Hamming Window", "SIGP", ["Hanning Window"]),
   ("Blackman Window", "SIGP", ["Hanning Window"]),
   ("Main Lobe Width", "SIGP", ["Hanning Window"]),
   ("Side Lobe Level", "SIGP", ["Main Lobe Width"]),
   ("Window Tradeoff", "SIGP", ["Main Lobe Width", "Side Lobe Level"]),
   ("Coherent Gain", "SIGP", ["Hanning Window", "Amplitude Normalization"]),
   ("Edge Discontinuity", "SIGP", ["Spectral Leakage Effect"]),
   ("Window Table", "SIGP", ["Hanning Window", "Precomputation"]),
 ]),
 (23, "Peak Detection: Build a Tuner", [
   ("Argmax Search", "PIPE", ["Peak Detection", "Spectrum Array"]),
   ("Peak Bin", "PIPE", ["Argmax Search", "Bin Index"]),
   ("Bin To Frequency", "PIPE", ["Peak Bin", "Bin Center Frequency"]),
   ("Frequency Resolution Limit", "PIPE", ["Bin Width", "Frequency Resolution"]),
   ("Parabolic Interpolation", "PIPE", ["Peak Bin"]),
   ("Sub Bin Accuracy", "PIPE", ["Parabolic Interpolation", "Frequency Resolution Limit"]),
   ("Local Maximum", "PIPE", ["Argmax Search"]),
   ("Threshold Rejection", "PIPE", ["Local Maximum", "Noise Floor"]),
   ("Pitch", "AUDI", ["Fundamental Frequency"]),
   ("Musical Note Mapping", "AUDI", ["Pitch", "Bin To Frequency"]),
   ("Octave", "AUDI", ["Musical Note Mapping"]),
 ]),
 (24, "Real-Time Spectrum Analyzer", [
   ("Frame Rate", "PERF", ["Frame Duration"]),
   ("Stage Profiling", "BNCH", ["Frame Rate"]),
   ("Capture Time", "BNCH", ["Stage Profiling", "Frame Capture"]),
   ("Compute Time", "BNCH", ["Stage Profiling"]),
   ("Draw Time", "BNCH", ["Stage Profiling", "Display Refresh"]),
   ("Overlap Processing", "PERF", ["Frame Capture"]),
   ("Hop Size", "PERF", ["Overlap Processing"]),
   ("Buffer Swapping", "PERF", ["Double Buffering", "Frame Capture"]),
   ("Processing Latency", "PERF", ["Frame Rate", "Latency Metric"]),
   ("Bottleneck Identification", "BNCH", ["Stage Profiling", "Performance Bottleneck"]),
 ]),
 (25, "How Long Did That Take?", [
   ("Millisecond Timer", "BNCH", ["Execution Time"]),
   ("Microsecond Timer", "BNCH", ["Millisecond Timer"]),
   ("Timer Resolution", "BNCH", ["Microsecond Timer"]),
   ("Counter Wraparound", "BNCH", ["Microsecond Timer"]),
   ("Cycle Counter", "HARD", ["CPU Cycles", "Memory Mapped Register"]),
   ("DWT Unit", "HARD", ["Cycle Counter", "ARM Cortex M33"]),
   ("CYCCNT Register", "HARD", ["DWT Unit"]),
   ("DEMCR Register", "HARD", ["DWT Unit"]),
   ("Register Bit Manipulation", "HARD", ["CYCCNT Register", "DEMCR Register"]),
   ("Cycles To Microseconds", "BNCH", ["CYCCNT Register", "CPU Clock Frequency"]),
   ("Counter Verification", "LABM", ["Cycles To Microseconds", "Validation Before Trust"]),
 ]),
 (26, "Benchmarking Methodology", [
   ("Cold Start Effect", "BNCH", ["Warm Up Runs"]),
   ("Warm Up Discard", "BNCH", ["Cold Start Effect"]),
   ("Best Of N", "BNCH", ["Statistical Sampling"]),
   ("Minimum Sample", "BNCH", ["Best Of N"]),
   ("Variance Sources", "BNCH", ["Standard Deviation"]),
   ("Interrupt Interference", "BNCH", ["Variance Sources"]),
   ("Observer Effect", "LABM", ["Timing Overhead"]),
   ("Timing Overhead", "BNCH", ["Cycles To Microseconds"]),
   ("Measurement Discipline", "LABM", ["Warm Up Discard", "Best Of N"]),
   ("Prediction Before Measurement", "LABM", ["Measurement Discipline"]),
   ("Honest Reporting", "LABM", ["Measurement Discipline"]),
   ("What A Benchmark Excludes", "LABM", ["Honest Reporting", "Fair Comparison"]),
   ("Negative Result", "LABM", ["Honest Reporting"]),
 ]),
 (27, "The Abstraction Ladder", [
   ("Bytecode Interpretation", "PROG", ["MicroPython"]),
   ("Native Code Emitter", "PROG", ["Bytecode Interpretation"]),
   ("Viper Code Emitter", "PROG", ["Native Code Emitter"]),
   ("Boxed Values", "PROG", ["Bytecode Interpretation"]),
   ("Unboxed Values", "PROG", ["Boxed Values"]),
   ("Type Annotation", "PROG", ["Viper Code Emitter"]),
   ("Machine Types", "PROG", ["Unboxed Values", "Type Annotation"]),
   ("Abstraction Cost", "PERF", ["Boxed Values", "Speedup Factor"]),
   ("Language Tradeoff Analysis", "PROG", ["Abstraction Cost", "C Language"]),
   ("Calling C From MicroPython", "PROG", ["C Language", "Module Import"]),
   ("Library Over Handwritten Code", "PROG", ["Language Tradeoff Analysis", "Library Integration"]),
 ]),
 (28, "Does Your CPU Have an FPU?", [
   ("Instruction Set Architecture", "ASMP", ["ARM Architecture"]),
   ("ARMv6-M", "ASMP", ["Instruction Set Architecture"]),
   ("ARMv7-M", "ASMP", ["Instruction Set Architecture"]),
   ("ARMv8-M", "ASMP", ["Instruction Set Architecture", "ARM Cortex M33"]),
   ("Cortex M0 Plus", "HARD", ["ARMv6-M", "RP2040 Chip"]),
   ("FPU Presence Detection", "ASMP", ["Floating Point Unit", "CPUID Register"]),
   ("MVFR0 Register", "ASMP", ["FPU Presence Detection"]),
   ("FPv5-SP Unit", "DSPI", ["Floating Point Unit", "ARMv8-M"]),
   ("Capability Probing", "LABM", ["FPU Presence Detection", "Validation Before Trust"]),
   ("Hardware Feature Gate", "LABM", ["Capability Probing"]),
   ("Portability Constraint", "ASMP", ["Instruction Set Architecture", "Cortex M0 Plus"]),
   ("Failure Root Cause", "LABM", ["Hardware Feature Gate", "Debugging By Bisection"]),
 ]),
 (29, "Your First Assembly Function", [
   ("Inline Assembler", "ASMP", ["Assembly Language", "MicroPython"]),
   ("asm_thumb Decorator", "ASMP", ["Inline Assembler", "Thumb Instructions"]),
   ("CPU Register", "ASMP", ["Instruction Set Architecture"]),
   ("General Purpose Register", "ASMP", ["CPU Register"]),
   ("Register Allocation", "ASMP", ["General Purpose Register"]),
   ("Move Instruction", "ASMP", ["General Purpose Register"]),
   ("Add Instruction", "ASMP", ["General Purpose Register"]),
   ("Compare Instruction", "ASMP", ["General Purpose Register"]),
   ("Conditional Branch", "ASMP", ["Compare Instruction"]),
   ("Assembly Label", "ASMP", ["Conditional Branch"]),
   ("Assembly Loop", "ASMP", ["Assembly Label", "Conditional Branch"]),
   ("Argument Passing Convention", "ASMP", ["Register Allocation", "asm_thumb Decorator"]),
   ("Return Value Register", "ASMP", ["Argument Passing Convention"]),
   ("Machine Code", "ASMP", ["Instruction Mnemonic"]),
   ("Instruction Mnemonic", "ASMP", ["Assembly Language"]),
 ]),
 (30, "Talking to the FPU", [
   ("Floating Point Register", "ASMP", ["FPv5-SP Unit", "CPU Register"]),
   ("Register Bank s0 to s31", "ASMP", ["Floating Point Register"]),
   ("Load Store Architecture", "ASMP", ["Instruction Set Architecture"]),
   ("VLDR Instruction", "ASMP", ["Floating Point Register", "Load Store Architecture"]),
   ("VSTR Instruction", "ASMP", ["VLDR Instruction"]),
   ("VADD Instruction", "ASMP", ["Floating Point Register"]),
   ("VSUB Instruction", "ASMP", ["Floating Point Register"]),
   ("VMUL Instruction", "ASMP", ["Floating Point Register"]),
   ("Memory Address", "ASMP", ["Load Store Architecture", "Memory Mapped Register"]),
   ("Address Of Buffer", "ASMP", ["Memory Address", "Typed Array"]),
   ("Typed Array", "PROG", ["Memory Management"]),
   ("Pointer Arithmetic", "ASMP", ["Memory Address"]),
   ("Byte Offset", "ASMP", ["Pointer Arithmetic"]),
   ("No Allocation In Timed Region", "LABM", ["Measurement Discipline", "Typed Array"]),
 ]),
 (31, "The Butterfly in Assembly, and a Complete FFT", [
   ("Assembly Butterfly", "ASMP", ["Butterfly Structure", "VMUL Instruction"]),
   ("Register Pressure", "ASMP", ["Register Allocation", "Assembly Butterfly"]),
   ("Register Spilling", "ASMP", ["Register Pressure"]),
   ("Scratch Register", "ASMP", ["Register Allocation"]),
   ("Stage Parameter Block", "ASMP", ["Argument Passing Convention", "Stage Loop"]),
   ("Python Assembly Boundary", "ASMP", ["Argument Passing Convention", "Address Of Buffer"]),
   ("Work Split Strategy", "ASMP", ["Python Assembly Boundary", "Stage Loop"]),
   ("Assembly Debugging", "LABM", ["Assembly Butterfly", "Debugging By Bisection"]),
   ("Bit For Bit Match", "LABM", ["Cross Validation", "Assembly Debugging"]),
   ("Hot Loop", "PERF", ["Work Split Strategy", "Performance Bottleneck"]),
 ]),
 (32, "Making It Faster: Specialization and Branchless Code", [
   ("Special Case Optimization", "PERF", ["Hot Loop"]),
   ("Trivial Twiddle", "PERF", ["Special Case Optimization", "Twiddle Factor Table"]),
   ("Multiply By One", "PERF", ["Trivial Twiddle"]),
   ("Multiply By i", "PERF", ["Trivial Twiddle", "Imaginary Unit"]),
   ("Branch Prediction", "HARD", ["Pipelining", "Conditional Branch"]),
   ("Unpredictable Branch", "PERF", ["Branch Prediction"]),
   ("Branchless Code", "PERF", ["Unpredictable Branch"]),
   ("Precomputed Swap List", "PERF", ["Branchless Code", "Permutation Table"]),
   ("Code Size Tradeoff", "PERF", ["Special Case Optimization", "Code Size"]),
   ("Loop Overhead", "PERF", ["Hot Loop"]),
   ("Address Computation Cost", "PERF", ["Loop Overhead", "Pointer Arithmetic"]),
   ("Optimization Attribution", "LABM", ["Measurement Discipline", "Special Case Optimization"]),
 ]),
 (33, "Beyond the Assembler: Hand-Encoding an Instruction", [
   ("Instruction Encoding", "ASMP", ["Machine Code"]),
   ("Opcode", "ASMP", ["Instruction Encoding"]),
   ("Encoding Bit Field", "ASMP", ["Instruction Encoding"]),
   ("Encoding Table", "ASMP", ["Encoding Bit Field"]),
   ("Halfword", "ASMP", ["Instruction Encoding"]),
   ("Thumb-2 Encoding", "ASMP", ["Halfword", "Thumb Instructions"]),
   ("Data Directive", "ASMP", ["Thumb-2 Encoding", "Inline Assembler"]),
   ("Raw Machine Word", "ASMP", ["Data Directive"]),
   ("Fused Multiply Add", "DSPI", ["Multiply Accumulate", "FPv5-SP Unit"]),
   ("VFMA Instruction", "ASMP", ["Fused Multiply Add", "Encoding Table"]),
   ("Fused Rounding", "DSPI", ["Fused Multiply Add", "Single Precision Float"]),
   ("Assembler Limitation", "ASMP", ["Data Directive", "Inline Assembler"]),
   ("ISA Versus Toolchain", "ASMP", ["Assembler Limitation", "Instruction Set Architecture"]),
   ("Encoding Verification", "LABM", ["Raw Machine Word", "Validation Before Trust"]),
 ]),
 (34, "Competing Variants: Predict, Measure, Explain", [
   ("Variant Comparison", "BNCH", ["Fair Comparison", "Measurement Discipline"]),
   ("Controlled Variable", "LABM", ["Variant Comparison"]),
   ("Comparison Matrix", "VAPP", ["Variant Comparison", "Comparison Tables"]),
   ("Ranking Prediction", "LABM", ["Prediction Before Measurement", "Variant Comparison"]),
   ("Optimization Composition", "PERF", ["Optimization Attribution"]),
   ("Sub Linear Composition", "PERF", ["Optimization Composition"]),
   ("Integration Cost", "PERF", ["Variant Comparison"]),
   ("Kernel Versus Total Time", "BNCH", ["Integration Cost", "What A Benchmark Excludes"]),
   ("Data Marshalling Cost", "PERF", ["Integration Cost", "Memory Access Patterns"]),
   ("Surprising Result", "LABM", ["Ranking Prediction", "Negative Result"]),
 ]),
 (35, "Capstone: Design, Benchmark and Report", [
   ("Experimental Design", "LABM", ["Controlled Variable", "Measurement Discipline"]),
   ("Research Question", "LABM", ["Experimental Design"]),
   ("Independent Variable", "LABM", ["Experimental Design"]),
   ("Dependent Variable", "LABM", ["Independent Variable"]),
   ("Methodology Section", "VAPP", ["Experimental Design", "Report Generation"]),
   ("Results Presentation", "VAPP", ["Methodology Section", "Performance Charts"]),
   ("Limitations Statement", "LABM", ["Honest Reporting", "Results Presentation"]),
   ("Conclusion Drawing", "LABM", ["Results Presentation"]),
   ("Project Scoping", "LABM", ["Research Question"]),
   ("Peer Review", "LABM", ["Honest Reporting"]),
 ]),
]


def main():
    # Load the existing graph.
    rows = []
    with open(GRAPH, newline="") as f:
        for row in csv.DictReader(f):
            rows.append(row)

    label_to_id = {r["ConceptLabel"]: int(r["ConceptID"]) for r in rows}
    next_id = max(int(r["ConceptID"]) for r in rows) + 1
    existing_count = len(rows)

    # Pass 1: assign IDs in lab order.
    new_rows = []
    lab_of = {}
    for lab_num, lab_title, concepts in LABS:
        for label, taxonomy, _deps in concepts:
            if label in label_to_id:
                raise SystemExit(
                    "Lab %d re-defines existing concept %r. Reference it as a "
                    "dependency instead of redefining it." % (lab_num, label))
            label_to_id[label] = next_id
            lab_of[label] = lab_num
            new_rows.append({"ConceptID": next_id, "ConceptLabel": label,
                             "TaxonomyID": taxonomy, "_deps": _deps,
                             "_lab": lab_num})
            next_id += 1

    # Pass 2: resolve dependency labels to IDs and check ordering.
    problems = []
    for r in new_rows:
        ids = []
        for dep in r["_deps"]:
            if dep not in label_to_id:
                problems.append("Lab %d: %r depends on unknown concept %r"
                                % (r["_lab"], r["ConceptLabel"], dep))
                continue
            dep_lab = lab_of.get(dep)
            if dep_lab is not None and dep_lab > r["_lab"]:
                problems.append(
                    "Lab %d: %r depends on %r which is not taught until lab %d"
                    % (r["_lab"], r["ConceptLabel"], dep, dep_lab))
            ids.append(label_to_id[dep])
        r["Dependencies"] = "|".join(str(i) for i in sorted(ids))

    if problems:
        print("REFUSING TO WRITE -- %d ordering problems:" % len(problems))
        for p in problems:
            print("  " + p)
        raise SystemExit(1)

    # Write the merged graph.
    with open(GRAPH, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["ConceptID", "ConceptLabel", "Dependencies", "TaxonomyID"])
        for r in rows:
            w.writerow([r["ConceptID"], r["ConceptLabel"],
                        r["Dependencies"], r["TaxonomyID"]])
        for r in new_rows:
            w.writerow([r["ConceptID"], r["ConceptLabel"],
                        r["Dependencies"], r["TaxonomyID"]])

    # Write a lab -> concept index the lab authors can cite.
    with open(os.path.join(HERE, "lab-concepts.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Lab", "LabTitle", "ConceptID", "ConceptLabel", "TaxonomyID"])
        for lab_num, lab_title, concepts in LABS:
            for label, taxonomy, _ in concepts:
                w.writerow([lab_num, lab_title, label_to_id[label], label, taxonomy])

    total_new = len(new_rows)
    print("existing concepts : %d" % existing_count)
    print("new lab concepts  : %d" % total_new)
    print("total             : %d  (ceiling 600)" % (existing_count + total_new))
    print("labs              : %d" % len(LABS))
    print("avg per lab       : %.1f" % (total_new / len(LABS)))
    if existing_count + total_new > 600:
        print("WARNING: over the 600-concept ceiling")


if __name__ == "__main__":
    main()
