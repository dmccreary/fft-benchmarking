# Concept List

This document contains 574 concepts for the Benchmarking FFT course.
Each concept is numbered with a unique ConceptID for use in the learning graph.

Concepts 1-200 come from the original course design. Concepts 201+ are introduced by the
hands-on lab series and are numbered in **lab order**, so a higher ID is always taught later.

## Mathematical Foundations (MATH) — 31 concepts

1. Complex Numbers
2. Imaginary Unit
3. Euler's Formula
4. Sine Wave
5. Cosine Wave
6. Amplitude
7. Frequency
8. Phase
9. Periodic Functions
10. Harmonics
11. Complex Conjugate
12. Magnitude
13. Unit Circle
14. Hertz
15. Time Domain
16. Frequency Domain
300. Radians
301. Angular Frequency
302. Period Of A Wave
303. Phase Offset
304. Sine Synthesis
307. Peak Amplitude
310. Superposition Principle
311. Wave Addition
312. Constructive Interference
313. Destructive Interference
322. Dot Product
338. Complex Exponential
339. Real And Imaginary Parts
376. Roots Of Unity
385. Complex Multiplication

## Signal Processing (SIGP) — 40 concepts

17. Analog Signals
18. Digital Signals
19. Sampling
20. Sampling Rate
21. Nyquist Theorem
22. Aliasing
23. Quantization
24. Bit Depth
25. ADC Conversion
26. Signal Noise
27. Signal To Noise Ratio
28. Bandwidth
29. Low Pass Filter
30. Band Pass Filter
31. Windowing Functions
32. Spectral Leakage
280. Sample Period
281. Sampling Theorem
282. Nyquist Frequency
283. Aliasing Artifact
284. Frequency Folding
285. Anti Aliasing Filter
286. Undersampling
288. Sample Rate Selection
289. Sample Rate Selection Tradeoff
296. Quantization Error
305. Sample Index To Time
308. DC Component
309. Signal Synthesis
411. Spectral Leakage Effect
412. Rectangular Window
413. Hanning Window
414. Hamming Window
415. Blackman Window
416. Main Lobe Width
417. Side Lobe Level
418. Window Tradeoff
419. Coherent Gain
420. Edge Discontinuity
421. Window Table

## Fourier Theory (FOUR) — 38 concepts

33. Jean Baptiste Fourier
34. Fourier Series
35. Continuous Fourier Transform
36. Discrete Fourier Transform
37. DFT Definition
38. DFT Complexity
39. Inverse DFT
40. Frequency Bins
41. Bin Resolution
42. Spectral Analysis
43. Power Spectrum
44. Magnitude Spectrum
45. Phase Spectrum
46. Frequency Resolution
47. Zero Padding
48. Orthogonality
320. Correlation
321. Multiply And Sum
323. Test Frequency
324. Similarity Measure
325. Orthogonal Functions
326. In Phase Component
327. Quadrature Component
328. Phase Independence
329. Correlation Magnitude
330. Basis Function
331. Projection Onto Basis
332. Frequency Sweep
333. Bin Index
334. Bin Center Frequency
335. Bin Width
336. Spectrum Array
337. Eight Point DFT By Hand
340. Spectrum Symmetry
341. Negative Frequencies
342. DC Bin
343. Nyquist Bin
350. Bin Exact Frequency

## FFT Algorithm (FFTA) — 50 concepts

49. FFT Algorithm
50. FFT History
51. Cooley Tukey Algorithm
52. Radix-2 FFT
53. Radix-4 FFT
54. Split Radix FFT
55. Butterfly Operation
56. Butterfly Diagram
57. Twiddle Factors
58. Bit Reversal
59. In Place FFT
60. Decimation In Time
61. Decimation In Frequency
62. FFT Stages
63. FFT Complexity
64. O(N log N)
65. FFT Size
66. Power Of Two Sizes
67. Real FFT
68. Complex FFT
69. Inverse FFT
70. IFFT Algorithm
71. Normalization Factor
72. FFT Scaling
363. Divide And Conquer
364. Even Odd Split
365. Recursive Decomposition
366. Subproblem
367. Recombination Step
368. Logarithmic Stages
369. Complexity Reduction
370. Power Of Two Constraint
371. Redundant Computation
372. Symmetry Exploitation
373. Bit Reversal Permutation
374. Index Reversal
375. Permutation Table
377. Twiddle Factor Table
381. In Place Reordering
382. Swap Operation
384. Butterfly Structure
386. Four Multiply Form
387. Butterfly Pair
388. Stage Span
389. Data Flow Graph
390. Butterfly Count
391. Stage Loop
392. Cross Add And Subtract
393. Iterative FFT
394. Algorithm Assembly

## Hardware Platforms (HARD) — 29 concepts

73. Microcontroller
74. ARM Architecture
75. ARM Cortex M Series
76. ARM Cortex M4
77. ARM Cortex M33
78. Raspberry Pi Pico
79. Raspberry Pi Pico 2
80. RP2040 Chip
81. RP2350 Chip
82. DSP Chip
83. General Purpose CPU
84. Clock Speed
85. CPU Cycles
86. Memory Architecture
87. Cache Memory
88. Embedded Systems
221. CPU Clock Frequency
222. RAM Versus Flash
225. Memory Mapped Register
226. CPUID Register
227. Silicon Revision
228. Unique Device ID
447. Cycle Counter
448. DWT Unit
449. CYCCNT Register
450. DEMCR Register
451. Register Bit Manipulation
482. Cortex M0 Plus
533. Branch Prediction

## DSP Instructions (DSPI) — 19 concepts

89. DSP Instructions
90. SIMD Instructions
91. MAC Instruction
92. Multiply Accumulate
93. Saturating Arithmetic
94. Fixed Point Arithmetic
95. Floating Point Unit
96. FPU Operations
97. Single Precision Float
98. Q Format Numbers
99. Q15 Format
100. Q31 Format
101. Hardware Multiplier
102. Pipelining
103. Instruction Latency
104. Real Time Constraints
485. FPv5-SP Unit
549. Fused Multiply Add
551. Fused Rounding

## Programming (PROG) — 28 concepts

105. C Language
106. C Compiler
107. GCC Compiler
108. ARM Compiler
109. Compiler Optimization
110. Optimization Flags
111. Assembly Language
112. ARM Assembly
113. Thumb Instructions
114. Python Language
115. NumPy Library
116. SciPy FFT
117. MicroPython
118. Memory Management
119. Reading Assembly Code
120. Disassembly
399. Function Decomposition
467. Bytecode Interpretation
468. Native Code Emitter
469. Viper Code Emitter
470. Boxed Values
471. Unboxed Values
472. Type Annotation
473. Machine Types
475. Language Tradeoff Analysis
476. Calling C From MicroPython
477. Library Over Handwritten Code
515. Typed Array

## FFT Libraries (LIBS) — 12 concepts

121. FFT Libraries
122. CMSIS DSP Library
123. Kiss FFT
124. FFTW Library
125. Arm Math Library
126. Pico SDK FFT
127. Open Source FFT
128. Library Licensing
129. MIT License
130. GPL License
131. Library Integration
132. API Documentation

## Benchmarking (BNCH) — 44 concepts

133. Benchmarking
134. Performance Metrics
135. Execution Time
136. Clock Cycles
137. Microseconds Per FFT
138. FFTs Per Second
139. Throughput Metric
140. Latency Metric
141. Memory Usage
142. Code Size
143. Test Harness
144. Warm Up Runs
145. Statistical Sampling
146. Mean Execution Time
147. Standard Deviation
148. Reproducibility
149. Fair Comparison
150. Benchmarking Framework
354. Algorithmic Complexity
355. Quadratic Complexity
356. Operation Counting
357. Scaling Behavior
361. Performance Bottleneck
362. Motivation For Optimization
397. Speedup Factor
434. Stage Profiling
435. Capture Time
436. Compute Time
437. Draw Time
442. Bottleneck Identification
443. Millisecond Timer
444. Microsecond Timer
445. Timer Resolution
446. Counter Wraparound
452. Cycles To Microseconds
454. Cold Start Effect
455. Warm Up Discard
456. Best Of N
457. Minimum Sample
458. Variance Sources
459. Interrupt Interference
461. Timing Overhead
555. Variant Comparison
562. Kernel Versus Total Time

## Performance Optimization (PERF) — 42 concepts

151. Integer FFT
152. Floating Point FFT
153. Fixed Point FFT
154. Precision Tradeoffs
155. Speed Accuracy Tradeoff
156. Cache Effects
157. Memory Access Patterns
158. Loop Unrolling
159. Vectorization
160. Real Time Processing
161. Streaming FFT
162. Block Processing
163. Double Buffering
164. Compiler Settings
358. Real Time Budget
359. Frame Duration
360. Processing Deadline
378. Precomputation
379. Lookup Table
380. Loop Invariant Hoisting
383. Interleaved Storage
433. Frame Rate
438. Overlap Processing
439. Hop Size
440. Buffer Swapping
441. Processing Latency
474. Abstraction Cost
528. Hot Loop
529. Special Case Optimization
530. Trivial Twiddle
531. Multiply By One
532. Multiply By i
534. Unpredictable Branch
535. Branchless Code
536. Precomputed Swap List
537. Code Size Tradeoff
538. Loop Overhead
539. Address Computation Cost
559. Optimization Composition
560. Sub Linear Composition
561. Integration Cost
563. Data Marshalling Cost

## Signal Pipeline (PIPE) — 23 concepts

165. Signal Preprocessing
166. DC Offset Removal
167. Normalization
168. Window Application
169. Zero Padding Input
170. Post Processing
171. Magnitude Calculation
172. Phase Calculation
173. Decibel Conversion
174. Peak Detection
175. Frequency Estimation
176. Dominant Frequency
400. Magnitude Computation
401. Fast Magnitude Approximation
402. Power Versus Magnitude
422. Argmax Search
423. Peak Bin
424. Bin To Frequency
425. Frequency Resolution Limit
426. Parabolic Interpolation
427. Sub Bin Accuracy
428. Local Maximum
429. Threshold Rejection

## Visualization and Applications (VAPP) — 42 concepts

177. Data Visualization
178. Spectrum Plot
179. Spectrogram
180. Waterfall Display
181. Time Domain Plot
182. Performance Charts
183. Comparison Tables
184. Performance Dashboard
185. Benchmark Results
186. Report Generation
187. Audio Processing
188. Music Analysis
189. Voice Recognition
190. Noise Cancellation
191. Spectrum Analyzer
192. Pitch Detection
193. Vibration Analysis
194. Machine Monitoring
195. Radar Processing
196. Communication Systems
197. Software Defined Radio
198. Sound Processing
199. Capstone Project
200. Benchmark Suite
234. Framebuffer
235. Monochrome Display
236. Pixel Coordinates
237. Text Rendering
238. Display Refresh
273. Thonny Plotter
277. Bar Graph Display
279. Level Meter
306. Waveform Plotting
403. Bin Averaging For Display
404. Logarithmic Scaling
405. Square Root Scaling
406. Spectrum Bars
408. Live Spectrum Display
410. Half Spectrum Display
557. Comparison Matrix
569. Methodology Section
570. Results Presentation

## Development Environment (TOOL) — 22 concepts

201. Thonny IDE
202. MicroPython Firmware
203. USB Serial Connection
204. REPL
205. Print Statement
206. Script Execution
207. Saving To Device
208. Device Filesystem
209. Keyboard Interrupt
210. MicroPython vs CPython
220. Firmware Version
223. Free Memory Query
224. Filesystem Statistics
239. Shared Configuration Module
249. File Transfer To Device
250. mpremote Tool
251. Library Directory
252. Import Path
253. Module Import
254. Autorun main.py
255. Standalone Operation
256. Code Organization

## Microcontroller I/O (MCIO) — 28 concepts

211. General Purpose IO
212. GPIO Pin
213. Pin Object
214. Digital Output
215. Onboard LED
216. Logic High And Low
217. Pin Toggle
218. Sleep Delay
219. Infinite Loop
229. Serial Peripheral Interface
230. SPI Clock And Data
231. Chip Select Line
232. Display Driver Chip
233. SSD1306 Controller
240. Digital Input
241. Pull Up Resistor
242. Active Low Logic
243. Switch Bounce
244. Debouncing
245. Polling Loop
246. Edge Detection
247. Event Loop
248. Mode Switching
260. I2S Protocol
261. Bit Clock
262. Word Select Line
263. I2S Serial Data
265. Buffered Read

## Audio and Acoustics (AUDI) — 34 concepts

257. MEMS Microphone
258. INMP441 Microphone
259. Digital Microphone Output
264. Audio Buffer
266. Sample Word Format
267. Twenty Four Bit In Thirty Two
268. Arithmetic Right Shift
269. Unpacking Binary Data
270. Root Mean Square
271. Sound Level
272. Loudness Perception
274. Moving Average
275. Exponential Smoothing
276. Sensor Auto Calibration
278. Decibel Scale
287. Tone Generator
291. Dynamic Range
292. Full Scale Value
293. Headroom
294. Clipping
295. Clipping Distortion
297. Noise Floor
298. Amplitude Normalization
299. Integer Overflow
314. Beat Frequency
315. Amplitude Envelope
316. Fundamental Frequency
317. Overtones
318. Timbre
319. Additive Synthesis
407. Frame Capture
430. Pitch
431. Musical Note Mapping
432. Octave

## Laboratory Method (LABM) — 40 concepts

290. Productive Failure
344. Ground Truth
345. Known Signal Test
346. Validation Before Trust
347. Numerical Tolerance
348. Absolute Error
349. Relative Error
351. Expected Peak
352. Debugging By Bisection
353. Test Signal Design
395. Reference Implementation
396. Cross Validation
398. Correctness Before Speed
409. Whistle Test
453. Counter Verification
460. Observer Effect
462. Measurement Discipline
463. Prediction Before Measurement
464. Honest Reporting
465. What A Benchmark Excludes
466. Negative Result
486. Capability Probing
487. Hardware Feature Gate
489. Failure Root Cause
518. No Allocation In Timed Region
526. Assembly Debugging
527. Bit For Bit Match
540. Optimization Attribution
554. Encoding Verification
556. Controlled Variable
558. Ranking Prediction
564. Surprising Result
565. Experimental Design
566. Research Question
567. Independent Variable
568. Dependent Variable
571. Limitations Statement
572. Conclusion Drawing
573. Project Scoping
574. Peer Review

## Assembly Programming (ASMP) — 52 concepts

478. Instruction Set Architecture
479. ARMv6-M
480. ARMv7-M
481. ARMv8-M
483. FPU Presence Detection
484. MVFR0 Register
488. Portability Constraint
490. Inline Assembler
491. asm_thumb Decorator
492. CPU Register
493. General Purpose Register
494. Register Allocation
495. Move Instruction
496. Add Instruction
497. Compare Instruction
498. Conditional Branch
499. Assembly Label
500. Assembly Loop
501. Argument Passing Convention
502. Return Value Register
503. Machine Code
504. Instruction Mnemonic
505. Floating Point Register
506. Register Bank s0 to s31
507. Load Store Architecture
508. VLDR Instruction
509. VSTR Instruction
510. VADD Instruction
511. VSUB Instruction
512. VMUL Instruction
513. Memory Address
514. Address Of Buffer
516. Pointer Arithmetic
517. Byte Offset
519. Assembly Butterfly
520. Register Pressure
521. Register Spilling
522. Scratch Register
523. Stage Parameter Block
524. Python Assembly Boundary
525. Work Split Strategy
541. Instruction Encoding
542. Opcode
543. Encoding Bit Field
544. Encoding Table
545. Halfword
546. Thumb-2 Encoding
547. Data Directive
548. Raw Machine Word
550. VFMA Instruction
552. Assembler Limitation
553. ISA Versus Toolchain

