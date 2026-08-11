# References: Measuring Time: The DWT Cycle Counter

1. [Clock rate](https://en.wikipedia.org/wiki/Clock_rate) - Wikipedia - Explains how a processor's oscillator frequency defines the clock cycle, the fundamental unit of time this chapter converts into the 6.7-nanosecond resolution of the Pico 2's 150 MHz cycle counter.

2. [Hardware performance counter](https://en.wikipedia.org/wiki/Hardware_performance_counter) - Wikipedia - Describes special-purpose CPU registers, the same category as the DWT's CYCCNT, that count clock cycles and hardware events with zero software overhead once enabled.

3. [Integer overflow](https://en.wikipedia.org/wiki/Integer_overflow) - Wikipedia - Covers how fixed-width unsigned counters wrap around to zero after reaching their maximum value, the exact behavior behind the chapter's counter wraparound section and its masked-subtraction fix.

4. The Definitive Guide to Arm Cortex-M23 and Cortex-M33 Processors - Joseph Yiu - Newnes (Elsevier) - Yiu is credited with the clearest published walkthrough of the DWT unit's DEMCR/TRCENA and DWT.CTRL/CYCCNTENA enable-bit sequence and the CYCCNT register itself, the exact three-register gating pattern this chapter teaches.

5. Programming Embedded Systems: With C and GNU Development Tools (2nd Edition) - Michael Barr and Anthony Massa - O'Reilly Media - Barr popularized the bitmask-and-OR idiom (`register |= BIT`) for setting a single bit of a memory-mapped hardware register without disturbing its neighbors, the technique this chapter applies to DEMCR and DWT.CTRL.

6. [Profiling Firmware on Cortex-M](https://interrupt.memfault.com/blog/profiling-firmware-on-cortex-m) - Memfault Interrupt Blog - Walks through enabling the DWT's CYCCNTENA bit and reading CYCCNT before and after a code region to measure elapsed cycles, the same pattern this chapter builds into `elapsed_us`.

7. [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf) - Raspberry Pi Ltd - Official datasheet for the RP2350 chip and its dual Cortex-M33 cores at 150 MHz, the exact board and clock speed this chapter's cycle-to-microsecond conversion is calibrated against.

8. [machine — functions related to the hardware](https://docs.micropython.org/en/latest/library/machine.html) - MicroPython Documentation - Documents `machine.mem32` and related functions for reading and writing memory-mapped registers by address, the mechanism the chapter's code uses to access DEMCR, DWT.CTRL, and CYCCNT directly.

9. [Check for Integer Overflow](https://www.geeksforgeeks.org/dsa/check-for-integer-overflow/) - GeeksforGeeks - Explains how exceeding a fixed-width integer's range produces wraparound rather than an error, reinforcing why CYCCNT's 32-bit width forces the masked-subtraction technique after 28.6 seconds.

10. [Cycle Counting on ARM Cortex-M with DWT](https://mcuoneclipse.com/2017/01/30/cycle-counting-on-arm-cortex-m-with-dwt/) - MCU on Eclipse - Walks through enabling DEMCR and DWT_CONTROL and reading CYCCNT to measure function execution time, and notes this hardware is absent on the Cortex-M0+, reinforcing the chapter's DEMCR/CYCCNTENA gating sequence.
