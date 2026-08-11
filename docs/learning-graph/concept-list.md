# Concept List

This document contains 550 concepts for the Benchmarking FFT course, regenerated from the
current `docs/course-description.md` and the full 35-lab series in `docs/labs/`. Each concept
is numbered with a unique ConceptID for use in the learning graph. This numbering also matches
the taxonomy category blocks used in `concept-taxonomy.md` and `learning-graph.csv`.

Concepts are grouped into 12 categories that mirror the course's 8 lab modules plus 4
cross-cutting themes (math foundations, benchmarking, ARM assembly, and course logistics).

## Foundations & Tools (FOUND) — 45 concepts

1. Microcontroller
2. Thonny IDE
3. MicroPython
4. Read Eval Print Loop
5. USB Serial Connection
6. Interpreter Selection
7. Device Filesystem
8. File Transfer
9. Script Execution
10. Print Statement
11. Keyboard Interrupt
12. Soft Reset
13. BOOTSEL Button
14. Firmware
15. Firmware Update
16. Float Precision
17. Integer Precision
18. While Loop
19. Try Except Block
20. General Purpose IO
21. GPIO Pin
22. Pin Object
23. Digital Output
24. Digital Input
25. Onboard LED
26. Logic Level
27. Pin Toggle
28. Sleep Delay
29. Pulse Width Modulation
30. CPU Clock Frequency
31. RAM
32. Flash Memory
33. Memory Mapped Register
34. CPUID Register
35. Bit Shift Operator
36. Bit Mask
37. CPU Cycle Budget
38. Register Address
39. Garbage Collection
40. Free Memory Query
41. Board Identification
42. Silicon Revision
43. Unique Device ID
44. Prediction Before Measurement
45. Mascot Pedagogical Device

## Peripherals & Hardware I/O (HWIO) — 40 concepts

46. Serial Peripheral Interface
47. SPI Clock Line
48. Chip Select Line
49. Display Driver Chip
50. SSD1306 Controller
51. Framebuffer
52. Monochrome Display
53. Pixel Coordinate
54. Text Rendering
55. Display Refresh
56. Data Command Pin
57. Display Reset Pin
58. Shared Configuration Module
59. Draw Show Loop Pattern
60. Coordinate System Origin
61. Character Grid
62. Digital Input Pin
63. Pull Up Resistor
64. Active Low Logic
65. Switch Bounce
66. Debouncing
67. Polling Loop
68. Edge Detection
69. Event Loop
70. Mode Switching
71. Floating Pin
72. Long Press Detection
73. Tactile Switch
74. mpremote Tool
75. Library Directory
76. Import Path
77. Module Import
78. Autorun Main Script
79. Standalone Operation
80. Code Organization
81. Boot Script
82. Board Recovery Procedure
83. Escape Hatch Delay
84. Deployment Workflow
85. Untethered Operation

## Digital Audio & Sampling (AUDIO) — 50 concepts

86. MEMS Microphone
87. I2S Protocol
88. Bit Clock
89. Word Select Line
90. I2S Serial Data
91. Audio Buffer
92. Buffered Read
93. Sample Word Format
94. Arithmetic Right Shift
95. Binary Data Unpacking
96. DC Offset
97. DC Offset Removal
98. Signed Integer Conversion
99. Full Scale Value
100. Channel Select Pin
101. Root Mean Square
102. Sound Level
103. Loudness Perception
104. Moving Average
105. Exponential Smoothing
106. Auto Calibration
107. Bar Graph Display
108. Decibel Scale
109. Level Meter
110. Noise Floor
111. Peak Hold Marker
112. Sample Period
113. Sampling Theorem
114. Nyquist Frequency
115. Aliasing
116. Frequency Folding
117. Anti Aliasing Filter
118. Undersampling
119. Tone Generator
120. Sample Rate Selection
121. Productive Failure
122. Zero Crossing Counting
123. Dynamic Range
124. Headroom
125. Clipping
126. Clipping Distortion
127. Quantization Error
128. Amplitude Normalization
129. Integer Overflow
130. Bit Depth
131. 6 dB Per Bit Rule
132. Flat Top Waveform
133. Harmonic Distortion
134. Live VU Meter
135. Settling Time Discard

## Waves & Signal Math Foundations (WAVE) — 45 concepts

136. Radians
137. Angular Frequency
138. Period Of A Wave
139. Phase Offset
140. Sine Wave
141. Cosine Function
142. Sine Synthesis
143. Waveform Plotting
144. Peak Amplitude
145. DC Component
146. Signal Synthesis
147. Samples Per Cycle
148. Superposition Principle
149. Wave Addition
150. Constructive Interference
151. Destructive Interference
152. Beat Frequency
153. Amplitude Envelope
154. Fundamental Frequency
155. Overtone
156. Timbre
157. Additive Synthesis
158. Square Wave
159. Sawtooth Wave
160. Complex Numbers
161. Imaginary Unit
162. Euler's Formula
163. Complex Exponential
164. Real Part
165. Imaginary Part
166. Magnitude Of A Complex Number
167. Phase Angle
168. Unit Circle
169. Roots Of Unity
170. Orthogonality
171. Basis Function
172. Projection Onto Basis
173. Frequency Domain
174. Time Domain
175. Algebra Of Sine And Cosine
176. Amplitude Parameter
177. Frequency Parameter
178. Wave Interference Pattern
179. Harmonic Series
180. Signal Envelope

## Correlation & the DFT (DFT) — 55 concepts

181. Correlation
182. Multiply And Sum
183. Dot Product
184. Test Frequency
185. Similarity Measure
186. In Phase Component
187. Quadrature Component
188. Phase Independence
189. Correlation Magnitude
190. Hidden Frequency Detection
191. Sine Only Detector Blind Spot
192. Arctangent Phase Recovery
193. Frequency Candidate Sweep
194. Frequency Sweep
195. Bin Index
196. Bin Center Frequency
197. Bin Width
198. Spectrum Array
199. 8-Point DFT Example
200. Real And Imaginary Parts
201. Spectrum Symmetry
202. Negative Frequency
203. DC Bin
204. Nyquist Bin
205. Two-Tone Signal
206. Mirror Spectrum
207. Forward Transform Convention
208. Inverse Transform Convention
209. Discrete Fourier Transform
210. Fourier Transform
211. Ground Truth Signal
212. Known Signal Test
213. Validation Before Trust
214. Numerical Tolerance
215. Absolute Error
216. Relative Error
217. Bin Exact Frequency
218. Expected Peak
219. Debugging By Bisection
220. Test Signal Design
221. Impulse Response Test
222. Single Precision Float
223. Parseval's Theorem
224. Test Suite Blind Spot
225. Sign Error
226. Algorithmic Complexity
227. Quadratic Complexity
228. Operation Counting
229. Scaling Behavior
230. Real Time Budget
231. Frame Duration
232. Processing Deadline
233. Performance Bottleneck
234. Big O Notation
235. Trigonometric Function Cost

## The FFT Algorithm (FFT) — 50 concepts

236. Fast Fourier Transform
237. Divide And Conquer
238. Even Odd Split
239. Recursive Decomposition
240. Subproblem
241. Recombination Step
242. Logarithmic Stages
243. Complexity Reduction
244. Power Of Two Constraint
245. Redundant Computation
246. Symmetry Exploitation
247. Twiddle Factor
248. Radix 2 Algorithm
249. Mixed Radix FFT
250. Cooley-Tukey Algorithm
251. Bit Reversal Permutation
252. Index Reversal
253. Permutation Table
254. Twiddle Factor Table
255. Precomputation
256. Lookup Table
257. Loop Invariant Hoisting
258. In Place Reordering
259. Swap Operation
260. Interleaved Storage
261. Butterfly Operation
262. Complex Multiplication
263. Four Multiply Form
264. Three Multiply Trick
265. Butterfly Pair
266. Stage Span
267. Data Flow Graph
268. Butterfly Count
269. Stage Loop
270. Cross Add And Subtract
271. Iterative FFT
272. Reference Implementation
273. Cross Validation
274. Speedup Factor
275. Correctness Before Speed
276. Function Decomposition
277. Inverse FFT
278. Table Hoisting Optimization
279. FFT DFT Crossover Point
280. In Place Computation
281. O(N Log N) Complexity
282. Real Input Transform
283. Decimation In Time
284. Bluestein's Algorithm
285. Radix 4 FFT

## Spectral Analysis & Real Spectra (SPEC) — 55 concepts

286. Magnitude Computation
287. Fast Magnitude Approximation
288. Power Versus Magnitude
289. Bin Averaging
290. Logarithmic Scaling
291. Square Root Scaling
292. Spectrum Bars
293. Frame Capture
294. Live Spectrum Display
295. Whistle Test
296. Half Spectrum Display
297. Rumble Rejection
298. Peak Ratio Threshold
299. Resolution Speed Tradeoff
300. Spectral Leakage
301. Rectangular Window
302. Hanning Window
303. Hamming Window
304. Blackman Window
305. Main Lobe Width
306. Side Lobe Level
307. Window Tradeoff
308. Coherent Gain
309. Edge Discontinuity
310. Window Table
311. Periodic Extension Assumption
312. On Bin Tone
313. Off Bin Tone
314. Argmax Search
315. Peak Bin
316. Bin To Frequency Mapping
317. Frequency Resolution Limit
318. Parabolic Interpolation
319. Sub Bin Accuracy
320. Local Maximum
321. Threshold Rejection
322. Pitch
323. Musical Note Mapping
324. Octave
325. Cents Deviation
326. Semitone Formula
327. Chromatic Tuner
328. Reference Pitch
329. Frame Rate
330. Stage Profiling
331. Capture Time
332. Compute Time
333. Draw Time
334. Overlap Processing
335. Hop Size
336. Buffer Swapping
337. Processing Latency
338. Bottleneck Identification
339. Amdahl's Law
340. Stage Percentage Breakdown

## Benchmarking & Measurement Methodology (BENCH) — 50 concepts

341. Millisecond Timer
342. Microsecond Timer
343. Timer Resolution
344. Counter Wraparound
345. Cycle Counter
346. DWT Unit
347. Cycle Count Register
348. Debug Exception Register
349. Register Bit Manipulation
350. Cycles To Time Conversion
351. Counter Verification
352. Trace Enable Bit
353. Cycle Count Enable Bit
354. Nanosecond Resolution
355. Overflow Masking
356. Empty Loop Baseline
357. Cold Start Effect
358. Warm Up Discard
359. Best Of N Sampling
360. Minimum Sample Statistic
361. Variance Sources
362. Interrupt Interference
363. Observer Effect
364. Timing Overhead
365. Measurement Discipline
366. Honest Reporting
367. Benchmark Exclusions
368. Negative Result
369. Benchmark Report Format
370. Cold Start Baseline Mismatch
371. Bytecode Interpretation
372. Native Code Emitter
373. Viper Code Emitter
374. Boxed Value
375. Unboxed Value
376. Type Annotation
377. Machine Type
378. Abstraction Cost
379. Language Tradeoff Analysis
380. Calling C From MicroPython
381. Library Over Handwritten Code
382. Native Decorator
383. Viper Decorator
384. Typed Pointer
385. Abstraction Ladder
386. Reading Versus Writing Skill
387. Benchmarking Methodology
388. Fair Comparison
389. Reproducibility
390. Instrumentation Overhead

## ARM Architecture & Assembly Language (ASM) — 55 concepts

391. Instruction Set Architecture
392. ARMv6-M
393. ARMv7-M
394. ARMv8-M
395. Cortex M0 Plus
396. Cortex M33 Processor
397. ARM Cortex M Architecture
398. FPU Presence Detection
399. Feature Register
400. FPv5 Floating Point Unit
401. Capability Probing
402. Hardware Feature Gate
403. Portability Constraint
404. Failure Root Cause
405. Inline Assembler
406. Assembly Decorator
407. CPU Register
408. General Purpose Register
409. Register Allocation
410. Move Instruction
411. Add Instruction
412. Compare Instruction
413. Conditional Branch
414. Assembly Label
415. Assembly Loop
416. Argument Passing Convention
417. Return Value Register
418. Machine Code
419. Instruction Mnemonic
420. Core Register Set
421. Array Sum Speedup
422. Floating Point Register
423. Register Bank
424. Load Store Architecture
425. VLDR Instruction
426. VSTR Instruction
427. VADD Instruction
428. VSUB Instruction
429. VMUL Instruction
430. VNEG Instruction
431. Memory Address
432. Pointer Arithmetic
433. Byte Offset
434. Typed Array
435. Address Of Buffer
436. Assembly Butterfly
437. Register Pressure
438. Register Spilling
439. Scratch Register
440. Stage Parameter Block
441. Python Assembly Boundary
442. Work Split Strategy
443. Assembly Debugging
444. Bit For Bit Match
445. Hot Loop

## Optimization & Instruction Encoding (OPT) — 45 concepts

446. Special Case Optimization
447. Trivial Twiddle
448. Multiply By One Shortcut
449. Multiply By I Shortcut
450. Branch Prediction
451. Unpredictable Branch
452. Branchless Code
453. Precomputed Swap List
454. Code Size Tradeoff
455. Loop Overhead
456. Address Computation Cost
457. Optimization Attribution
458. Heap Fragmentation
459. Instruction Encoding
460. Opcode
461. Encoding Bit Field
462. Encoding Table
463. Halfword
464. Thumb Instruction Set
465. Thumb-2 Encoding
466. Data Directive
467. Raw Machine Word
468. Fused Multiply Add
469. Fused Rounding
470. Assembler Limitation
471. ISA Versus Toolchain
472. Encoding Verification
473. Instruction Reference Manual
474. Variant Comparison
475. Controlled Variable
476. Comparison Matrix
477. Ranking Prediction
478. Optimization Composition
479. Sub Linear Composition
480. Integration Cost
481. Kernel Versus Total Time
482. Data Marshalling Cost
483. Surprising Result
484. 6-Way Variant Matrix
485. Dual Core Processing
486. Interleaved Layout Variant
487. Fixed Point Q15 Arithmetic
488. Instruction Encoding Error
489. Calling Convention
490. Stack Frame

## Capstone, Experimental Design & Pedagogy (CAPS) — 35 concepts

491. Experimental Design
492. Research Question
493. Independent Variable
494. Dependent Variable
495. Methodology Section
496. Results Presentation
497. Limitations Statement
498. Conclusion Drawing
499. Project Scoping
500. Peer Review
501. Hypothesis Statement
502. Harness Noise Floor
503. Capstone Track Selection
504. Retrofitted Hypothesis Error
505. Spectrogram Project
506. DTMF Decoder Project
507. Vibration Monitor Project
508. Instrument Identifier Project
509. Voice Activity Detector Project
510. Bloom's Taxonomy
511. Remember Level Outcome
512. Understand Level Outcome
513. Apply Level Outcome
514. Analyze Level Outcome
515. Evaluate Level Outcome
516. Create Level Outcome
517. Lab Demonstrated Outcome
518. Engineered Productive Failure
519. Predict Then Measure Pattern
520. Optimistic Prediction Pattern
521. Real Mistake As Teaching Tool
522. Load Bearing Module
523. 45-Minute Lab Format
524. Self Paced Study Option
525. Capstone Report

## Course Logistics, Hardware Kit & Scope (KIT) — 25 concepts

526. Raspberry Pi Pico 2
527. Pico 2 W Variant
528. Original Pico Incompatibility
529. OLED Display Module
530. Push Button Component
531. INMP441 Microphone Module
532. Breadboard
533. Jumper Wire
534. Hardware Kit Cost
535. Software Toolchain
536. No Compiler Required
537. Non ARM Instruction Sets
538. FPGA FFT Implementation
539. ASIC FFT Implementation
540. Multi Dimensional Transform
541. Non Power Of Two Transform
542. Filter Design Scope
543. Midterm Assessment
544. Laboratory Work Grading
545. Homework And Quiz Grading
546. Capstone Project Weight
547. Final Exam Weight
548. Grading Rubric
549. Instructor's Guide
550. Weekly Milestone Schedule
