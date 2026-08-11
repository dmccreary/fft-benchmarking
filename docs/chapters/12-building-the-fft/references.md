# References: Building the FFT: A Complete Recursive Implementation

1. [Fast Fourier transform](https://en.wikipedia.org/wiki/Fast_Fourier_transform) - Wikipedia - Overview of the FFT family of algorithms, their O(N log N) complexity, and common implementation variants, the general context for this chapter's specific recursive and iterative radix-2 implementations.

2. [Bit-reversal permutation](https://en.wikipedia.org/wiki/Bit-reversal_permutation) - Wikipedia - Defines the whole-array reordering by bit-reversed index required before an in-place iterative FFT can run, directly covering this chapter's bit reversal permutation and permutation table sections.

3. [Divide-and-conquer algorithm](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm) - Wikipedia - Explains the general strategy of splitting a problem into subproblems, solving each, and combining results, the exact pattern this chapter formalizes as recursive decomposition in the FFT function.

4. Introduction to Algorithms (4th Edition) - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein - MIT Press - The FFT chapter is known for rigorously deriving O(N log N) from the recurrence T(N) = 2T(N/2) + O(N) via the master method, the same recursive-to-complexity argument this chapter's logarithmic stages and butterfly count sections build informally.

5. The Scientist and Engineer's Guide to Digital Signal Processing (2nd Edition) - Steven W. Smith - California Technical Publishing - Smith's FFT chapter is known for a plain-language, no-derivation walkthrough of bit-reversal sorting followed by iterative butterfly passes, closely matching this chapter's own progression from recursive to iterative implementation.

6. [Fast Fourier transform](https://cp-algorithms.com/algebra/fft.html) - Algorithms for Competitive Programming - Covers both a recursive FFT implementation and an optimized iterative, in-place version using bit-reversal permutation, directly paralleling this chapter's own recursive-to-iterative conversion with working code.

7. [Iterative Fast Fourier Transformation for Polynomial Multiplication](https://www.geeksforgeeks.org/dsa/iterative-fast-fourier-transformation-polynomial-multiplication/) - GeeksforGeeks - Implements the iterative FFT with an explicit bit-reversal copy step and stage loop, matching this chapter's fft_iterative function structure with pseudocode and multi-language code samples.

8. [Master Theorem for Divide and Conquer Recurrences](https://www.geeksforgeeks.org/dsa/advanced-master-theorem-for-divide-and-conquer-recurrences/) - GeeksforGeeks - Explains how to solve recurrences of the form T(n) = aT(n/b) + f(n) to obtain a closed-form complexity, the formal tool behind this chapter's derivation of the FFT's O(N log N) butterfly count.

9. [Lecture 3: Divide & Conquer: FFT](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-3-divide-conquer-fft/) - MIT OpenCourseWare - Graduate algorithms lecture deriving the FFT as a divide-and-conquer algorithm and proving its O(N log N) running time, a more formal companion to this chapter's own stage-counting and butterfly-counting derivation.

10. [How the Cooley-Tukey FFT Algorithm Works, Part 3 - The Inner Butterfly](https://www.dsprelated.com/showarticle/1712.php) - dsprelated.com - Focuses specifically on the butterfly's shared multiply-then-add/subtract structure, reinforcing this chapter's cross add and subtract and butterfly pair sections with an independent worked explanation.
