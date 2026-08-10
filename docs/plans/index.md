# Sample GenAI Plans to Generate Fast FFT Algorithms

## Assembly FFT Plan 1

[Assembly FFT Plan 1](./01-fft-test-plan.md)

Build a 512-point radix-2 FFT with the arithmetic hand-written in ARM assembly, callable from
MicroPython on stock firmware. Verified against 10 synthetic audio signals with cycle-accurate
timing. **Complete** — 885 µs per FFT, 178× faster than pure MicroPython, 10/10 signals pass.

## Assembly FFT Plan 2

[Competing FFT Variants](./02-competing-variants.md)

Build a family of competing implementations — real-input FFT, radix-4, specialized stages,
dual-core, hand-encoded instructions — measured against each other under one harness, so
students can discover the architecture tradeoffs by measurement rather than assertion.