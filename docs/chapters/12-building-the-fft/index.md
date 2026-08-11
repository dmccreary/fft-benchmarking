# Building the FFT: A Complete Recursive Implementation

## Summary

This chapter assembles the divide-and-conquer decomposition, twiddle factors, and butterfly operation from the previous chapter into a complete, working recursive FFT, walking through the recombination step, the logarithmic stage count, and the resulting O(N log N) complexity. It cross-validates the result against the DFT built earlier to confirm correctness before ever discussing speed. This is the single largest chapter in the book because it is where the course's central algorithm actually comes together.

## Concepts Covered

This chapter covers the following 35 concepts from the learning graph:

1. Algorithm Assembly
2. Bit Reversal Permutation
3. Butterfly Count
4. Butterfly Pair
5. Butterfly Structure
6. Complexity Reduction
7. Correctness Before Speed
8. Cross Add And Subtract
9. Cross Validation
10. Divide And Conquer
11. Even Odd Split
12. FFT Complexity
13. FFT Size
14. Frame Duration
15. Function Decomposition
16. In Place Reordering
17. Index Reversal
18. Iterative FFT
19. Logarithmic Stages
20. Lookup Table
21. Motivation For Optimization
22. O(N log N)
23. Permutation Table
24. Power Of Two Constraint
25. Power Of Two Sizes
26. Processing Deadline
27. Recombination Step
28. Recursive Decomposition
29. Redundant Computation
30. Reference Implementation
31. Stage Loop
32. Stage Span
33. Subproblem
34. Swap Operation
35. Symmetry Exploitation

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)

---

TODO: Generate Chapter Content
