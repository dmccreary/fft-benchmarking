# Quiz: Peripherals: The OLED Display, Buttons, and Deploying Standalone Code

Test your understanding of the SPI OLED display, debounced buttons, and standalone deployment with these review questions.

---

#### 1. What is the Serial Peripheral Interface (SPI)?

<div class="upper-alpha" markdown>
1. A protocol that uses only a chip select line and no clock signal to synchronize data transfer
2. A single-wire protocol used only for reading digital input from buttons
3. A protocol for transferring files between a computer and the device filesystem
4. A synchronous communication protocol that uses a small, fixed set of GPIO pins — including dedicated clock and data lines — to move data between a microcontroller and a peripheral chip at high speed, in step with a shared clock signal
</div>

??? question "Show Answer"
    The correct answer is **D**. SPI moves data one bit at a time between a microcontroller and a peripheral chip using a small, fixed set of pins, including dedicated clock and data lines that keep the transfer synchronized. A chip select line is also part of SPI, but a clock signal is required, not optional — without it, the receiving chip could not know where one bit ends and the next begins. SPI is unrelated to digital-input button reading or file transfer.

    **Concept Tested:** Serial Peripheral Interface

---

#### 2. What role does the SSD1306 controller play in this course's OLED display?

<div class="upper-alpha" markdown>
1. It is the physical layer of lit pixels on a monochrome display that a program addresses directly for pixel-level data visualization
2. It is a display driver chip that translates commands and pixel data arriving over SPI into the electrical signals needed to light up the display hardware
3. It is a MicroPython module used only for debouncing button input
4. It is the GPIO pin dedicated to chip select
</div>

??? question "Show Answer"
    The correct answer is **B**. The SSD1306 is a display driver chip, physically separate from the display's own pixels, that translates SPI commands and pixel data into the electrical signals needed to light up the monochrome display's pixels. A microcontroller never addresses the pixels directly for data visualization — it always talks to this driver chip, which does the low-level addressing work.

    **Concept Tested:** Display Driver Chip

---

#### 3. Why does calling `oled.text("Hi", 0, 0)` not immediately change what is visible on the physical OLED screen?

<div class="upper-alpha" markdown>
1. Because `oled.text()` only writes into the in-memory framebuffer; the physical screen only updates when `oled.show()` performs a display refresh, sending the whole buffer over SPI
2. Because text rendering requires a restart of the SSD1306 controller before it takes effect
3. Because `oled.text()` only records pixel coordinates internally and requires a separate `pixel()` call to actually light anything
4. Because the display can only show pre-loaded images, not dynamically rendered text
</div>

??? question "Show Answer"
    The correct answer is **A**. Text rendering with `oled.text()` writes bits into the framebuffer, an in-memory block that privately holds the complete image before anything is sent to the screen. The physical pixels only change once `oled.show()` triggers a display refresh, sending the whole buffer over SPI in one batch. This draw-then-refresh pattern avoids showing a half-drawn image mid-update.

    **Concept Tested:** Framebuffer

---

#### 4. A button is wired with a pull-up resistor and reads active-low. What does the GPIO pin read when the button is not pressed, and why?

<div class="upper-alpha" markdown>
1. Logic low, because pull-up resistors default a pin to ground
2. An unpredictable floating value, because pull-up resistors do nothing until a button is pressed
3. Logic high, because the pull-up resistor holds the pin at the positive supply voltage by default; pressing the button actively pulls it down to logic low, which is why this convention is called active-low
4. Logic high only while Thonny is connected, and logic low otherwise
</div>

??? question "Show Answer"
    The correct answer is **C**. A pull-up resistor holds a GPIO pin at a definite logic high by default, so an unpressed button reads high. Pressing the button pulls the pin down to ground, producing logic low — the opposite of what intuition might suggest, which is exactly what "active-low" describes. The Pico 2's built-in pull-up resistors are enabled in software with `Pin.PULL_UP`.

    **Concept Tested:** Pull Up Resistor

---

#### 5. What is switch bounce?

<div class="upper-alpha" markdown>
1. A deliberate software delay inserted before reading any button
2. The rapid, unwanted series of electrical on/off transitions a mechanical switch produces in the first few milliseconds after being pressed, caused by the physical contacts bouncing against each other
3. A hardware defect present only in low-quality buttons
4. The intended behavior of an event loop when a button is held down
</div>

??? question "Show Answer"
    The correct answer is **B**. Switch bounce is the rapid series of unwanted on/off transitions a mechanical switch produces as its physical contacts bounce before settling, typically lasting a few milliseconds. Read naively, one press can look like several rapid presses. Debouncing — ignoring transitions for a short delay after the first one — is the standard fix, not a hardware defect limited to cheap buttons.

    **Concept Tested:** Switch Bounce

---

#### 6. How do a polling loop, edge detection, and an event loop relate to each other in this chapter's button-handling code?

<div class="upper-alpha" markdown>
1. They are three unrelated techniques that solve completely separate problems, none of which relate to mode switching
2. Edge detection replaces the need for a polling loop entirely
3. A polling loop is a more advanced version of an event loop used only for mode switching
4. A polling loop repeatedly checks a pin's current state; edge detection layered on top notices the exact moment that state changes; combining both, with debouncing, produces an event loop that dispatches a response — such as a mode switch — when a meaningful change occurs
</div>

??? question "Show Answer"
    The correct answer is **D**. A polling loop asks "what's the state right now?" repeatedly. Edge detection asks "did the state just change?" An event loop combines polling and edge detection with debouncing to reliably dispatch a response, such as switching between a spectrum analyzer's waveform and frequency views (mode switching), whenever a genuine press event fires. Each concept builds directly on the last rather than existing independently.

    **Concept Tested:** Event Loop

---

#### 7. A student runs `mpremote cp ssd1306.py :lib/ssd1306.py` and then writes `import ssd1306` in `main.py`. Why does this import succeed?

<div class="upper-alpha" markdown>
1. Because `/lib` is the conventional library directory that MicroPython automatically searches as part of its import path when resolving an `import` statement
2. Because `mpremote` automatically renames the file to `main.py` during the copy
3. Because files transferred to the device with `mpremote` are given special permissions that regular saved files lack
4. Because `import` statements in MicroPython ignore file location entirely
</div>

??? question "Show Answer"
    The correct answer is **A**. `/lib` is MicroPython's conventional library directory, automatically checked as part of the import path whenever a script executes an `import` statement. The `mpremote` tool's `cp` command performs the file transfer to device; it does not rename files or grant special permissions. A module saved to the wrong location would fail to import even if the file genuinely exists on the board.

    **Concept Tested:** mpremote Tool

---

#### 8. What triggers MicroPython's autorun behavior?

<div class="upper-alpha" markdown>
1. Pressing the onboard BOOTSEL button while powering on
2. Running `mpremote run main.py` from a connected computer
3. A file named exactly `main.py`, located in the device filesystem's root folder, executing automatically every time the board powers on or resets
4. Naming any Python file with the `.py` extension and saving it anywhere on the device
</div>

??? question "Show Answer"
    The correct answer is **C**. MicroPython automatically executes a file named exactly `main.py`, sitting in the device filesystem's root folder, immediately on every power-on or reset — no button press, command, or attached computer required. This single naming rule is what makes standalone operation possible; any other filename or location will not autorun.

    **Concept Tested:** Autorun main.py

---

#### 9. What problem does collecting pin numbers and display dimensions into a shared configuration module like `config.py` solve?

<div class="upper-alpha" markdown>
1. It encrypts sensitive hardware settings so other scripts cannot read them
2. It allows the device filesystem to compress the values, saving flash space
3. It is required by MicroPython's autorun behavior to identify `main.py`
4. It defines shared constants once so every other script can import and reuse them, avoiding repeated hard-coded values scattered across multiple files — an instance of broader code organization practice
</div>

??? question "Show Answer"
    The correct answer is **D**. A shared configuration module collects settings like pin numbers and display dimensions into one file that other scripts import, rather than repeating the same hard-coded values everywhere. This is a specific instance of code organization — splitting a project's source across files by responsibility so each piece can be read, tested, and reused independently.

    **Concept Tested:** Shared Configuration Module

---

#### 10. A student wires the OLED and buttons, copies `ssd1306.py` to `/lib`, copies `config.py` to the device root, and saves their program as `display_test.py` in the device root. After unplugging from the computer and connecting to a USB power bank, nothing happens on the screen. What is the most likely cause?

<div class="upper-alpha" markdown>
1. USB power banks cannot supply enough current to run the SSD1306 controller
2. The program was saved as `display_test.py` instead of exactly `main.py`, so MicroPython's autorun behavior never triggers and standalone operation never begins, even though every other file is correctly in place
3. The `config.py` file must be copied to `/lib` instead of the device root for standalone operation to work
4. Standalone operation is only possible if Thonny remains open in the background
</div>

??? question "Show Answer"
    The correct answer is **B**. Every other step was done correctly — driver library in `/lib`, configuration module in place — but autorun only ever triggers for a file named exactly `main.py`. Saving the program under any other filename means the board has nothing to execute automatically on power-up, which is the single most common deployment mistake described in this chapter. Power source and file location for `config.py` are not the issue here.

    **Concept Tested:** Standalone Operation
