# References: Specialization and Branchless Code

1. [Branch predictor](https://en.wikipedia.org/wiki/Branch_predictor) - Wikipedia - Explains how a CPU guesses a branch outcome and speculatively executes down that path, the pipeline mechanism this chapter uses to explain why an unpredictable trivial-twiddle check would be costly.

2. [Predication (computer architecture)](https://en.wikipedia.org/wiki/Predication_(computer_architecture)) - Wikipedia - Covers conditionally executed instructions that remove a branch from the control flow entirely, matching this chapter's MOVGE/MOVLT branchless-select example.

3. [Loop unrolling](https://en.wikipedia.org/wiki/Loop_unrolling) - Wikipedia - Describes duplicating a loop body to amortize pointer-advance and branch overhead across more work per iteration, the exact technique this chapter applies to the butterfly hot loop.

4. Hacker's Delight (2nd Edition) - Henry S. Warren Jr. - Addison-Wesley - The definitive catalog of branchless bit-manipulation tricks, including branchless min/max and conditional-select patterns, that the conditional-move technique in this chapter's branchless butterfly selection directly descends from.

5. Computer Architecture: A Quantitative Approach - John L. Hennessy and David A. Patterson - Morgan Kaufmann - The standard, widely cited quantitative treatment of pipelining and dynamic branch prediction, explaining precisely why a misprediction stall costs real cycles as this chapter describes.

6. [Arm Cortex-M33 Devices Generic User Guide: IT instruction](https://developer.arm.com/documentation/100235/0003/the-cortex-m33-instruction-set/branch-and-control-instructions/it?lang=en) - Arm Developer - Official reference for the IT block mechanism behind Thumb conditional execution, the instruction-level basis for the branchless conditional-move pattern this chapter introduces.

7. [Conditional Execution and Branching (Part 6)](https://azeria-labs.com/arm-conditional-execution-and-branching-part-6/) - Azeria Labs - Tutorial on ARM condition codes and conditionally executed instructions, reinforcing this chapter's distinction between a branch instruction and a conditionally committed instruction like MOVGE.

8. [Loop Unrolling](https://www.geeksforgeeks.org/c/loop-unrolling/) - GeeksforGeeks - Explains loop unrolling as reducing loop-control and end-of-loop-test overhead per useful operation performed, the code-size-versus-speed tradeoff this chapter raises for unrolling the butterfly loop.

9. [Software optimization resources](https://www.agner.org/optimize/) - Agner Fog - Collection of assembly and C++ optimization manuals covering loop structure, branch costs, and low-level performance tuning, a practical complement to this chapter's optimization-attribution methodology.

10. [Gallery of Processor Cache Effects](http://igoro.com/archive/gallery-of-processor-cache-effects/) - Igor Ostrovsky - Demonstrates with measured timings how cache-line size and access stride change performance independent of instruction count, the same cache-effects argument this chapter makes about bit-reversed memory access.
