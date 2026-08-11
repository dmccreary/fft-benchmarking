# References: Peripherals: The OLED Display, Buttons, and Deploying Standalone Code

1. [Serial Peripheral Interface](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) - Wikipedia - Explains the synchronous SPI protocol's clock, data, and chip-select lines, the exact communication channel this chapter uses to drive the SSD1306 OLED display from the Pico 2.

2. [Contact bounce](https://en.wikipedia.org/wiki/Contact_bounce) - Wikipedia - Describes why mechanical switch contacts bounce apart before settling and the digital-sampling and hardware techniques used to debounce them, directly supporting this chapter's button-debouncing code.

3. [Framebuffer](https://en.wikipedia.org/wiki/Framebuffer) - Wikipedia - Covers the general concept of an in-memory bitmap that is later sent to a display, the same draw-then-refresh pattern this chapter's `oled.fill()`, `oled.text()`, and `oled.show()` sequence follows.

4. Programming the Raspberry Pi Pico/W in MicroPython (Third Edition) - Harry Fairhead and Mike James - I/O Press - Fairhead and James are credited for building GPIO input and output up through events, interrupts, and the SPI bus in the same MicroPython idiom this chapter uses for the display and buttons.

5. The Art of Designing Embedded Systems (2nd Edition) - Jack Ganssle - Newnes (Elsevier) - Ganssle is credited with the classic sample-twice-and-compare debounce algorithm in the book's "Debouncing Firmware Implications" section, the template nearly every later software debounce tutorial still follows.

6. [framebuf – MicroPython Library Reference](https://docs.micropython.org/en/latest/library/framebuf.html) - MicroPython Documentation - Official reference for the FrameBuffer class underlying the SSD1306 driver, documenting `fill()`, `text()`, `pixel()`, and `blit()` operations that this chapter's display code calls directly.

7. [machine.SPI – MicroPython Library Reference](https://docs.micropython.org/en/latest/library/machine.SPI.html) - MicroPython Documentation - Documents the SPI and SoftSPI classes, including baudrate, polarity, and phase configuration, supporting this chapter's explanation of the SPI clock and data lines wired to the display.

8. [mpremote](https://docs.micropython.org/en/latest/reference/mpremote.html) - MicroPython Documentation - Official reference for the command-line tool this chapter uses to copy the SSD1306 driver and configuration files to the device's `/lib` and root folders without opening Thonny.

9. [Switch Debounce in Digital Circuits](https://www.geeksforgeeks.org/digital-logic/switch-debounce-in-digital-circuits/) - GeeksforGeeks - Compares software and hardware debounce techniques for mechanical switches, reinforcing this chapter's `sleep_ms()`-based debouncing approach and explaining why a naive button read can misfire.

10. [ssd1306.py driver source](https://github.com/micropython/micropython-lib/blob/master/micropython/drivers/display/ssd1306/ssd1306.py) - micropython-lib (GitHub) - Official MicroPython driver defining `SSD1306_I2C` and `SSD1306_SPI` as FrameBuffer subclasses, the exact source of the `SSD1306_SPI` class this chapter imports and uses to drive the OLED.
