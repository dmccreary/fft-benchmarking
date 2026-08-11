# References: Building a Real-Time Spectrum Analyzer

1. [Spectrogram](https://en.wikipedia.org/wiki/Spectrogram) - Wikipedia - Defines a spectrogram as a time-frequency visualization built from successive spectra and describes waterfall-style 3D display variants, matching this chapter's spectrogram and waterfall display sections exactly.

2. [Real-time computing](https://en.wikipedia.org/wiki/Real-time_computing) - Wikipedia - Explains hard, firm, and soft real-time deadline classifications and why meeting deadlines consistently matters more than raw throughput, the concept this chapter's continuously running real-time processing loop must satisfy every frame.

3. [Multiple buffering](https://en.wikipedia.org/wiki/Multiple_buffering) - Wikipedia - Covers double buffering and buffer-role swapping between a producer and consumer, directly matching this chapter's double buffering and buffer swapping mechanism for overlapping capture with processing.

4. Real-Time Digital Signal Processing: Implementations, Applications and Experiments with the TMS320C55x - Sen M. Kuo, Bob H. Lee, and Wenshun Tian - Wiley - This text is known for its widely copied ping-pong (double) buffer code pattern for keeping real-time audio capture and processing running concurrently on embedded hardware without dropping samples, the exact pattern this chapter's buffer swapping section describes.

5. Digital Processing of Speech Signals - Lawrence R. Rabiner and Ronald W. Schafer - Prentice Hall - This classic text is credited with popularizing the spectrogram as a standard time-frequency analysis tool, with diagrams that became the template most later spectrogram and waterfall displays, including this chapter's, still follow.

6. [Ping Pong Buffers](https://embedded.fm/blog/2017/3/21/ping-pong-buffers) - Embedded.fm - Explains, using an audio-sampling example, how alternating between two buffers with DMA lets a processor handle incoming samples continuously without pausing, the exact mechanism behind this chapter's double buffering and buffer swapping.

7. [Ping Pong Buffer Audio Stream](https://audiodsplab.wordpress.com/ping-pong-buffer-audio-stream/) - Audio DSP Lab - Walks through implementing double-buffered I2S audio capture with DMA on an STM32 microcontroller, a close embedded-hardware parallel to this chapter's capture-while-processing pipeline on the Pico 2.

8. [Characteristics of Real-time Systems](https://www.geeksforgeeks.org/characteristics-of-real-time-systems/) - GeeksforGeeks - Surveys deadline-driven, deterministic, and fault-tolerant properties of real-time systems, framing this chapter's frame-rate-sustaining real-time processing loop within the broader real-time systems concept it draws on.

9. [Bottleneck Conditions Identification in System Design](https://www.geeksforgeeks.org/bottleneck-conditions-identification-in-system-design/) - GeeksforGeeks - Explains how to identify which stage of a multi-stage pipeline limits overall throughput, the general technique this chapter applies as stage profiling to find that compute time, not capture or draw time, is the pipeline's true bottleneck.

10. [Lecture 21: Short-Time Fourier Analysis](https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/3634773c2eb17d84e4f5de0c1446a374_lec21.pdf) - MIT OpenCourseWare - Course notes on computing a sequence of short-time spectra from a continuous signal, the underlying streaming-FFT and windowed-frame machinery this chapter assembles into a spectrogram and waterfall display.
