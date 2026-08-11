# References: Hello World: Thonny, MicroPython, and Your First GPIO Program

1. [MicroPython](https://en.wikipedia.org/wiki/MicroPython) - Wikipedia - Overview of the compact Python 3 reimplementation this course runs on the Pico 2, covering its history, supported hardware, and REPL, directly grounding the chapter's MicroPython vs CPython comparison.

2. [General-purpose input/output](https://en.wikipedia.org/wiki/General-purpose_input/output) - Wikipedia - Explains how GPIO pins are configured in software as digital input or output, the exact mechanism behind the `Pin("LED", Pin.OUT)` call this chapter uses to blink the onboard LED.

3. [Read–eval–print loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) - Wikipedia - Defines the read-evaluate-print interactive programming loop, the general computer-science concept behind the Thonny Shell's `>>>` prompt this chapter uses to test commands before saving them to a script.

4. Get Started with MicroPython on Raspberry Pi Pico (2nd Edition) - Gareth Halfacree and Ben Everard - Raspberry Pi Press - The official Raspberry Pi guide credited for its fully-photographed, step-by-step approach linking Thonny's REPL directly to first GPIO wiring, the same beginner-friendly sequence this chapter follows from connection to blink.

5. Programming with MicroPython: Embedded Programming with Microcontrollers and Python - Nicholas H. Tollervey - O'Reilly Media - Tollervey, a core MicroPython contributor, is credited for the clearest account of why MicroPython re-implements rather than merely trims CPython, framing the distinction this chapter's comparison table is built on.

6. [MicroPython RP2 Quick Reference](https://docs.micropython.org/en/latest/rp2/quickref.html) - MicroPython Documentation - Official hardware API reference for the Pico's `machine.Pin` class and other RP2040/RP2350 peripherals, documenting the exact constructor and methods this chapter's blink program calls.

7. [MicroPython on Microcontrollers](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html) - Raspberry Pi Documentation - Official Raspberry Pi page explaining what MicroPython is and how it runs directly on Pico hardware, with links to installation and quick-start guides for the exact board this chapter sets up.

8. [Thonny](https://thonny.org/) - Thonny.org - Official home page of the beginner-focused Python IDE used throughout this chapter, describing its built-in interpreter, step-through debugging, and variable inspection features that make it well suited to first-time microcontroller programmers.

9. [machine.Pin – MicroPython Library Reference](https://docs.micropython.org/en/latest/library/machine.Pin.html) - MicroPython Documentation - Full reference for the Pin class, covering constructor arguments, modes, and methods like `value()`, `on()`, `off()`, and `toggle()` that this chapter's LED-blinking code depends on directly.

10. [The REPL](https://docs.micropython.org/en/latest/reference/repl.html) - MicroPython Documentation - Documents MicroPython's interactive REPL features, including auto-indent, paste mode, and the Ctrl-C keyboard interrupt this chapter uses to stop a running infinite loop and return control to the prompt.
