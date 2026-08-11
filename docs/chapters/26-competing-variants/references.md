# References: Competing Variants: Predict, Measure, Explain

1. [Benchmark (computing)](https://en.wikipedia.org/wiki/Benchmark_(computing)) - Wikipedia - Surveys benchmarking principles including relevance, repeatability, and fair comparison, the general framework behind this chapter's variant comparison, where every FFT implementation runs through one identical test harness.

2. [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law) - Wikipedia - Derives why an optimization's overall speedup is capped by the fraction of execution time it actually affects, the classical explanation behind this chapter's sub-linear composition, where combined optimizations rarely multiply cleanly.

3. [Scientific control](https://en.wikipedia.org/wiki/Scientific_control) - Wikipedia - Explains why holding all conditions but one constant isolates a single variable's true effect, the exact discipline behind this chapter's controlled-variable requirement for a fair variant comparison across FFT implementations.

4. Systems Performance (2nd Edition) - Brendan Gregg - Addison-Wesley - Gregg distinguishes passive benchmarking (run it, record the number) from active benchmarking (analyze and explain results while the test runs), the direct ancestor of this chapter's predict-measure-explain discipline.

5. Computer Organization and Design: The Hardware/Software Interface (RISC-V Edition) - David A. Patterson and John L. Hennessy - Morgan Kaufmann - Their clear, worked derivation of Amdahl's Law and the "iron law" of performance is the standard explanation of why stacked optimizations undersell their naively-multiplied predictions.

6. [Amdahl's law in Computer Organization](https://www.geeksforgeeks.org/computer-organization-architecture/computer-organization-amdahls-law-and-its-proof/) - GeeksforGeeks - Works a numeric Amdahl's Law example showing a heavily-optimized code section still yielding modest overall speedup, reinforcing why this chapter's specialized assembly variant rarely hits its naively predicted best case.

7. [Active Benchmarking](https://www.brendangregg.com/activebenchmarking.html) - Brendan Gregg - Contrasts fire-and-forget "passive" benchmarking with actively explaining why a result came out the way it did while the test runs, the same predict-then-explain standard this chapter applies to every FFT variant measured.

8. [Control Variables in Scientific Experiments](https://www.geeksforgeeks.org/maths/control-variable/) - GeeksforGeeks - Defines controlled variables and shows how holding them fixed isolates the effect of a deliberately changed variable, supporting this chapter's requirement that only the implementation differ across every variant's benchmark run.

9. [Maximising Python Speed](https://docs.micropython.org/en/latest/reference/speed_python.html) - MicroPython Documentation - Official documentation of the @native and @viper code emitters compared in this chapter's variant lineup, describing their relative performance gains and the tradeoffs each makes against plain bytecode execution.

10. [Gernot's List of Systems Benchmarking Crimes](https://gernot-heiser.org/benchmarking-crimes.html) - Gernot Heiser (UNSW Sydney) - Catalogs common benchmarking pitfalls, including unfair comparisons and cherry-picked results, a widely cited checklist supporting the honest, surprising-result-embracing comparison methodology this chapter insists on for every variant.
