# References: Why the DFT Is Too Slow

1. [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) - Wikipedia - Formal definition of asymptotic growth notation, including O, Θ, and Ω, the exact notation this chapter uses to label the DFT's O(N²) cost after deriving it directly from operation counting.

2. [Time complexity](https://en.wikipedia.org/wiki/Time_complexity) - Wikipedia - Explains how an algorithm's running time is classified by growth pattern, from constant to quadratic and beyond, the general framework this chapter's quadratic complexity and scaling behavior sections apply specifically to the DFT.

3. [Real-time computing](https://en.wikipedia.org/wiki/Real-time_computing) - Wikipedia - Covers hard, firm, and soft real-time deadlines and the consequences of missing them, directly underlying this chapter's real time budget concept and its 530x-too-slow verdict on the DFT.

4. Introduction to Algorithms (4th Edition) - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein - MIT Press - Widely credited for the field's clearest formal treatment of asymptotic notation and systematic operation counting, the exact technique this chapter uses to derive the DFT's N² operation count from its nested loop.

5. The Algorithm Design Manual (3rd Edition) - Steven S. Skiena - Springer - Known for grounding Big-O growth rates in practical "war stories" and back-of-the-envelope reasoning about real running times rather than pure proof, matching this chapter's engineering-first framing of quadratic cost as a measured 21-second result.

6. [Time Complexity and Space Complexity](https://www.geeksforgeeks.org/dsa/time-complexity-and-space-complexity/) - GeeksforGeeks - Tutorial walking through how to count operations in nested loops to classify an algorithm's time complexity, the identical counting technique this chapter applies to the DFT's two nested loops.

7. [Big-O Algorithm Complexity Cheat Sheet](https://www.bigocheatsheet.com/) - bigocheatsheet.com - Quick-reference chart ranking common complexity classes from constant to factorial, useful for placing the DFT's O(N²) and the upcoming FFT's O(N log N) on the same visual growth scale.

8. [Asymptotic Notations](https://www.programiz.com/dsa/asymptotic-notations) - Programiz - Compares Big-O, Big-Omega, and Big-Theta notation with diagrams and worked examples, reinforcing the vocabulary this chapter uses to name the DFT's quadratic complexity precisely.

9. [Recitation 1: Asymptotic Complexity](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/ce8348ec64dce3841ced6a9d0c9e48f2_MIT6_006F11_rec01.pdf) - MIT OpenCourseWare - University recitation notes building intuition for asymptotic complexity from first principles, a more formal companion to this chapter's from-scratch derivation of the DFT's N² operation count.

10. [Big O Notation — Why It Matters and Why It Doesn't](https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/) - freeCodeCamp - Accessible walkthrough of Big-O notation with worked sorting-algorithm examples and a discussion of its practical limits, complementing this chapter's own real-world measurement of the DFT's 530x overage.
