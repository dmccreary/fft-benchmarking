# References: Correlation: Does My Signal Contain This Note?

1. [Cross-correlation](https://en.wikipedia.org/wiki/Cross-correlation) - Wikipedia - Defines correlation as a "sliding dot product" measuring similarity between two signals as a function of time offset, the general operation this chapter specializes into multiply-and-sum correlation against a test frequency.

2. [Matched filter](https://en.wikipedia.org/wiki/Matched_filter) - Wikipedia - Describes correlating a known template signal against an unknown one to detect its presence, the same echolocation-style principle this chapter's welcome section uses to motivate correlation as a frequency detector.

3. [Orthogonal functions](https://en.wikipedia.org/wiki/Orthogonal_functions) - Wikipedia - Proves that sine functions of different integer frequencies have zero correlation over a full period, the exact orthogonality property this chapter relies on to explain why non-matching frequencies cancel out.

4. The Scientist and Engineer's Guide to Digital Signal Processing - Steven W. Smith - California Technical Publishing - Chapter 7's correlation section is credited for presenting correlation and matched filtering as a plain multiply-and-sum "template matching" operation with worked numeric examples, avoiding the integral notation used in most other treatments.

5. Understanding Digital Signal Processing (3rd Edition) - Richard Lyons - Prentice Hall - Lyons, winner of the IEEE Signal Processing Society's 2012 Educator of the Year award, is widely credited for the clearest engineering treatment of in-phase/quadrature (I/Q) signals, exactly the I and Q components this chapter uses to make correlation magnitude phase-independent.

6. [Cross - Correlation](https://www.geeksforgeeks.org/data-science/cross-correlation/) - GeeksforGeeks - Tutorial on the cross-correlation formula and its use for detecting time delay and similarity between signals, reinforcing this chapter's multiply-and-sum correlation calculation.

7. [A Quadrature Signals Tutorial: Complex, But Not Complicated](https://www.dsprelated.com/showarticle/192.php) - Rick Lyons, DSPRelated.com - A freely available deep dive into in-phase and quadrature signals by the author credited in reference 5, directly expanding this chapter's I/Q component and correlation magnitude discussion.

8. [RMS Voltage](https://www.geeksforgeeks.org/electrical-engineering/rms-voltage/) - GeeksforGeeks - Explains the root-mean-square formula and why squaring before averaging prevents positive and negative swings from canceling, reinforcing this chapter's use of RMS to summarize a signal's overall size before computing sound level.

9. [The Basics of Anti-Aliasing Low-Pass Filters](https://www.digikey.com/en/articles/the-basics-of-anti-aliasing-low-pass-filters) - DigiKey - Explains why a low-pass filter must remove content above the Nyquist frequency before sampling, reinforcing this chapter's anti-aliasing filter entry in its filter-type comparison table.

10. [Band Pass Filter](https://www.geeksforgeeks.org/electronics-engineering/band-pass-filter/) - GeeksforGeeks - Covers how a band pass filter's center frequency and bandwidth are calculated from its cutoff frequencies, reinforcing this chapter's description of isolating a specific note or instrument range before correlating.
