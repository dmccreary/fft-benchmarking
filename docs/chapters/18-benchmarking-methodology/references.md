# References: Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison

1. [Benchmark (computing)](https://en.wikipedia.org/wiki/Benchmark_(computing)) - Wikipedia - Defines benchmarking as measuring performance under controlled, reproducible conditions, the standard this chapter holds every later performance claim in the course to.

2. [Standard deviation](https://en.wikipedia.org/wiki/Standard_deviation) - Wikipedia - Explains the formula and meaning of standard deviation as a measure of spread around a mean, the exact statistic this chapter pairs with mean execution time to report "412 μs ± 18 μs" style results.

3. [Profiling (computer programming)](https://en.wikipedia.org/wiki/Profiling_(computer_programming)) - Wikipedia - Covers how measuring a running program's performance can itself introduce overhead, directly relevant to the chapter's discussion of the observer effect and timing overhead.

4. Systems Performance (2nd Edition) - Brendan Gregg - Addison-Wesley/Pearson - Gregg is widely credited with formalizing the modern methodology for statistically sound benchmarking on real systems, including warm-up handling, avoiding the observer effect, and stating what a benchmark excludes, the exact practices this chapter teaches.

5. The Art of Computer Systems Performance Analysis: Techniques for Experimental Design, Measurement, Simulation, and Modeling - Raj Jain - John Wiley & Sons - Jain's book is the classic origin of the systematic statistical treatment of performance measurement (mean, standard deviation, confidence intervals, and variance sources), the framework this chapter's statistical sampling section builds on.

6. [How NOT to Measure Latency](https://www.infoq.com/presentations/latency-pitfalls/) - InfoQ - Gil Tene's talk on common latency-measurement pitfalls, including how outliers and coordinated omission distort a mean, reinforcing the chapter's warning that a single statistic can misrepresent a distribution.

7. [timeit — Measure execution time of small code snippets](https://docs.python.org/3/library/timeit.html) - Python Software Foundation - States explicitly that the minimum of repeated timings, not the mean, best estimates true code speed because higher values reflect outside interference, directly paralleling this chapter's best-of-N versus mean discussion.

8. [Lecture Notes: Introduction to Probability and Statistics (18.05)](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/lecture-notes/) - MIT OpenCourseWare - Free lecture notes covering expected value and variance, the formal statistical grounding behind the chapter's mean execution time and standard deviation formulas.

9. [Standard Deviation - Formula, Examples & How to Calculate](https://www.geeksforgeeks.org/maths/standard-deviation-formula/) - GeeksforGeeks - Worked examples of computing standard deviation step by step, useful for students applying the chapter's `run_harness` code to their own timing samples.

10. [Beginner's guide to interrupt latency on the Arm Cortex-M processors](https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/beginner-guide-on-interrupt-latency-and-interrupt-latency-of-the-arm-cortex-m-processors) - Arm Community Blog - Explains how the NVIC services hardware interrupts on Cortex-M cores and the cycle costs involved, the mechanism behind this chapter's interrupt interference variance source.
