# References: Capturing Real Audio: The I2S Microphone

1. [I2S](https://en.wikipedia.org/wiki/I%C2%B2S) - Wikipedia - Overview of the Inter-IC Sound serial bus, its separate clock and data lines, and how it transmits two-channel PCM audio between chips such as the INMP441 and a microcontroller.

2. [Microphone](https://en.wikipedia.org/wiki/Microphone) - Wikipedia - General overview of microphone technology, including a section on MEMS (silicon) microphones that etch a pressure-sensitive diaphragm directly into silicon with an integrated ADC, the design used in this chapter's INMP441.

3. [Analog-to-digital converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter) - Wikipedia - Explains how a physical voltage becomes a digital number, the underlying process the INMP441 performs on-chip before ever handing samples to the Pico 2 over I2S.

4. Making Embedded Systems: Design Patterns for Great Software (2nd Edition) - Elecia White - O'Reilly Media - Chapter 7, "Communicating with Peripherals," is credited for demystifying serial bus timing diagrams like I2S through hands-on, hardware-debugging-first narration of clock, word-select, and data lines rather than abstract spec-sheet language.

5. The Art of Electronics (3rd Edition) - Paul Horowitz and Winfield Hill - Cambridge University Press - The standard practical-electronics reference, long credited for grounding the analog-to-digital boundary in concrete circuit behavior, building the physical intuition this chapter assumes before describing the microphone's own internal ADC.

6. [What is the I2S Communication Protocol?](https://www.digikey.com/en/maker/tutorials/2023/what-is-the-i2s-communication-protocol) - DigiKey - Maker-focused tutorial walking through the bit clock, word select, and serial data lines of I2S, directly matching this chapter's three-wire breakdown of the protocol.

7. [class I2S – Inter-IC Sound bus protocol](https://docs.micropython.org/en/latest/library/machine.I2S.html) - MicroPython Documentation - Official reference for the `machine.I2S` class used in this chapter's capture code, documenting `readinto()`, buffered reads, and internal DMA buffering of audio samples.

8. [Raspberry Pi Wiring & Test, Adafruit I2S MEMS Microphone Breakout](https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout/raspberry-pi-wiring-test) - Adafruit Learning System - Step-by-step wiring guide connecting an I2S MEMS microphone's bit clock, word select, and data lines to a microcontroller, reinforcing the pin roles introduced in this chapter.

9. [INMP441 MEMS High Precision Omnidirectional Microphone Module with I2S](https://components101.com/modules/inmp441-mems-omnidirectional-microphone) - components101 - Datasheet-style overview of the exact microphone module used in this course, covering its pinout (SCK, SD, WS, L/R) and specifications referenced throughout the chapter.

10. [How to Plot in Thonny](https://medium.com/@shilleh/how-to-plot-in-thonny-dc482712ff69) - Medium - Practical walkthrough of Thonny's built-in Plotter feature, showing how printed numeric values become a live scrolling chart, the exact technique this chapter uses to visualize captured audio samples.
