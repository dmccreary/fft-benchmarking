# Course Description

**Title:** Benchmarking FFT
**Course Length:** 10-weeks or independent study
**Audience:** College juniors or seniors with a curiosity in signal processing

## Summary

This course covers the process of doing objective benchmarking of the FFT algorithm on both microcontrollers as well as standard CPUs.  We provide a high-level background to the FFT algorithm and why it is critical in modern real-time signal processing.  We then describe a framework for benchmarking FFT algorithm performance on different data sets.
We conclude with methods for presenting the results of FFT benchmarks.

## Why This Course

In the past, only expensive digital signal processing (DSP) chips did real-time FFTs.  However, in 2001 companies like ARM started to add DSP instructions to their low cost CPUs and microcontrollers.  For example in 2010 the ARM Cortex M4 added instructions to specifically perform DSP functions.  In August 2024 the Raspberry Pi Foundation release the Raspberry Pi Pico 2 built around the ARM Cortex-M33 which had many DSP and floating point functions.  For $6 this made real-time FFT for signal processing affordable for many products.

However, many programmers were not aware of these DSP functions and the impact faster signal processing has on applications.  Many FFT libraries still used older instruction sets.  The root cause was that many developers were unaware of the signal processing power they had but were not using.

This course attempts to guide students from the basics of what the FFT algorithm does and how DSP-specific hardware can accelerate signal processing products.  

We study the process of not only comparing different FFT implementations, but we look at the tradeoffs of different FFT parameters such as FFT size, integer vs. floating point and other choices that impact FFT processing speed.

## Content

Fourier Transforms
Math Foundations
Programming Background
FFT History
FFT Timeline
FFT Basics
FFT Butterfly
FFT and IFFT
FFT Performance
FFT Benchmarking
FFT Parameters
FFT Size
Integer vs Floating Point
Preprocessing Signals
Post Processing of Signals
Programming Languages
C Language
Python Libraries
Machine Language
Reading Assembly Languages
DSP Functions
FFT Libraries
GitHub Repositories
FFT Licenses
Benchmarking Frameworks
Performance Comparisons
Presenting Results
Performance Charts

## Outcomes

The Bloom Taxonomy gives us a way to categorize
outcomes starting with memorization of terms through the
ability to create new artifacts.

After this course a student will

### Remember
- Recall the key properties of the Fast Fourier Transform (FFT) algorithm
- List the DSP instructions available in ARM Cortex-M33 and M4 processors
- Identify common FFT libraries and their licensing requirements
- Define terminology such as FFT size, butterfly operations, and preprocessing
- Name the tradeoffs between integer and floating-point FFT implementations

### Understand
- Explain how the FFT algorithm transforms time-domain signals to frequency domain
- Describe the relationship between FFT size and computational complexity
- Summarize the historical development of DSP hardware acceleration
- Interpret assembly language output to understand low-level FFT operations
- Clarify why certain hardware features improve FFT performance

### Apply
- Implement FFT benchmarks using provided frameworks on microcontrollers
- Use appropriate FFT libraries in C and Python for signal processing tasks
- Configure FFT parameters (size, precision, windowing) for specific applications
- Execute performance measurements across different hardware platforms
- Apply preprocessing and post-processing techniques to improve FFT results

### Analyze
- Compare the performance characteristics of different FFT implementations
- Examine assembly code to identify optimization opportunities
- Differentiate between factors affecting FFT speed (hardware, software, parameters)
- Investigate the relationship between FFT parameters and execution time
- Break down complex benchmarking results to identify performance bottlenecks

### Evaluate
- Assess which FFT library is most appropriate for a given application
- Critique benchmarking methodologies for validity and completeness
- Judge the quality and accuracy of FFT performance claims
- Determine optimal FFT parameters based on application constraints
- Justify hardware and software choices for real-time signal processing systems

### Create
- Design a comprehensive benchmarking framework for FFT evaluation
- Develop custom visualizations to present FFT performance comparisons
- Produce a capstone project documenting FFT performance across platforms
- Generate recommendations for FFT implementation strategies
- Construct a complete analysis report with methodology, results, and conclusions

## Grading

The grading will be as follows:

1. 25% homework
2. 25% midterm
3. 25% capstone project
4. 25% final exam



