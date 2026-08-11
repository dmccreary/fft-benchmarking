# Quiz: Hello World: Thonny, MicroPython, and Your First GPIO Program

Test your understanding of connecting to a Raspberry Pi Pico 2, working in the REPL, and writing your first GPIO program with these review questions.

---

#### 1. What does the acronym REPL stand for?

<div class="upper-alpha" markdown>
1. Rapid Execution Programming Loop
2. Read-Eval-Print Loop
3. Remote Embedded Program Link
4. Runtime Error Prevention Layer
</div>

??? question "Show Answer"
    The correct answer is **B**. REPL stands for Read-Eval-Print Loop: an interactive prompt that reads one line of code, evaluates it immediately, prints the result, and loops back for the next line. It is the `>>>` prompt you see in Thonny's Shell panel once the Pico 2 is connected, and it is where you experiment with single lines of code before committing them to a saved script.

    **Concept Tested:** REPL

---

#### 2. Which statement correctly distinguishes MicroPython from CPython?

<div class="upper-alpha" markdown>
1. MicroPython is a compact reimplementation of Python built to run on a microcontroller's limited RAM, while CPython is the full reference implementation that assumes a desktop operating system underneath it.
2. CPython is designed to boot in milliseconds directly on bare metal, while MicroPython requires an operating system to start.
3. MicroPython and CPython are two names for the exact same interpreter, just compiled for different processors.
4. CPython includes hardware-specific modules like `machine`, while MicroPython does not.
</div>

??? question "Show Answer"
    The correct answer is **A**. MicroPython is re-engineered to fit inside kilobytes of RAM and boot directly on bare metal with no operating system, while CPython assumes gigabytes of RAM and a full OS underneath it. Option B reverses the two interpreters' actual properties. Option C ignores their very different memory footprints and startup behavior. Option D is backward — `machine` and similar hardware modules exist in MicroPython, not CPython.

    **Concept Tested:** MicroPython vs CPython

---

#### 3. What is a GPIO pin?

<div class="upper-alpha" markdown>
1. A software variable that stores the current state of the onboard LED
2. A dedicated pin that can only ever be configured as an output
3. A region of the device filesystem reserved for hardware configuration files
4. A physical metal leg on the Pico 2 that software can configure to either read an incoming signal or send an outgoing one
</div>

??? question "Show Answer"
    The correct answer is **D**. A GPIO (General Purpose Input/Output) pin is a physical pin that software can configure under direct program control, either to read a signal coming in (digital input) or to send a signal out (digital output). Option B is wrong because GPIO pins are general purpose — configurable for either direction, not fixed as output-only. Options A and C confuse a physical pin with software or filesystem concepts.

    **Concept Tested:** GPIO Pin

---

#### 4. A GPIO pin configured with `Pin.OUT` is driving logic high. What voltage is it approximately outputting, and what does that state typically represent?

<div class="upper-alpha" markdown>
1. 3.3 volts, representing an "on" or asserted state
2. 0 volts, representing an "on" or asserted state
3. 5 volts, representing an "off" or unasserted state
4. 1.8 volts, and the meaning depends on which peripheral is attached
</div>

??? question "Show Answer"
    The correct answer is **A**. Logic high on the Pico 2 means the pin is driving roughly 3.3 volts, and by convention this typically represents an "on" or asserted state, such as a lit LED. Logic low means the pin is driving roughly 0 volts (ground), representing "off." Digital logic only recognizes these two discrete states, with no in-between value, unlike an analog voltage that could take on any value.

    **Concept Tested:** Logic High And Low

---

#### 5. Given the following MicroPython code, what happens each time the loop body executes?

```python
from machine import Pin
from time import sleep

led = Pin("LED", Pin.OUT)

while True:
    led.toggle()
    sleep(0.5)
```

<div class="upper-alpha" markdown>
1. The LED is permanently set to logic high, then the script pauses forever.
2. The LED blinks twice, then the loop exits automatically after 0.5 seconds.
3. The LED's state flips to the opposite of whatever it currently is, then the script pauses for 0.5 seconds before repeating.
4. The script reads the LED's current brightness and prints it to the Shell every 0.5 seconds.
</div>

??? question "Show Answer"
    The correct answer is **C**. `led.toggle()` flips the pin from whatever state it is currently in to the opposite state, without the code needing to track which one it was, and `sleep(0.5)` pauses execution for 0.5 seconds before the `while True:` loop repeats indefinitely. This toggle-and-delay pattern inside an infinite loop is the classic blink program and the foundation for later real-time programs in the course.

    **Concept Tested:** Pin Toggle

---

#### 6. Why does a `while True:` loop count as an infinite loop, and why is a keyboard interrupt useful when running one?

<div class="upper-alpha" markdown>
1. `True` eventually becomes `False` after enough iterations, and the keyboard interrupt speeds up that transition.
2. Infinite loops are a MicroPython-specific syntax error, and a keyboard interrupt is required to compile the script.
3. The loop is not actually infinite; it stops automatically once the onboard LED burns out.
4. The condition `True` can never become false on its own, so the loop repeats forever until something outside it — such as a keyboard interrupt — stops it.
</div>

??? question "Show Answer"
    The correct answer is **D**. Because the loop's condition (`True`) can never evaluate to false, the code inside repeats forever unless something external stops it — either unplugging the board or, more cleanly, a keyboard interrupt (Ctrl+C in Thonny), which halts the running script and returns control to the REPL. Infinite loops are normal and intentional in embedded systems, where a microcontroller usually has exactly one job and no reason to stop.

    **Concept Tested:** Infinite Loop

---

#### 7. What distinguishes saving a script to the device filesystem from simply clicking Run in Thonny's editor pane?

<div class="upper-alpha" markdown>
1. Clicking Run only executes the script from Thonny's memory on the laptop, so it disappears when the board is unplugged; saving to the device filesystem writes the file onto the Pico 2's own persistent storage so it survives a power cycle.
2. There is no difference; both permanently store the script on the Pico 2.
3. Saving to the device filesystem only works for files named `main.py`; any other filename must be run instead of saved.
4. Clicking Run automatically saves a backup copy to the device filesystem in the background.
</div>

??? question "Show Answer"
    The correct answer is **A**. A script run from the editor pane without an explicit save lives only in Thonny's session on the computer and vanishes the instant the Pico is unplugged. Saving to the device filesystem — the Pico 2's built-in persistent flash storage — writes the file onto the board itself, so it survives being unplugged. This distinction matters because only files actually saved to the device filesystem persist across power cycles.

    **Concept Tested:** Saving To Device

---

#### 8. What is the primary purpose of MicroPython's `print()` function in this course's workflow?

<div class="upper-alpha" markdown>
1. It permanently saves a variable's value to the device filesystem.
2. It configures a GPIO pin for digital output.
3. It sends text output from a running MicroPython program back over the USB serial connection so Thonny can display it in the Shell panel.
4. It compiles a MicroPython script into machine code before execution.
</div>

??? question "Show Answer"
    The correct answer is **C**. The `print()` function sends text output back over the USB serial connection so Thonny's Shell panel can display it, making it the simplest and most-used debugging tool in the course — whenever a board seems to be doing the wrong thing, a well-placed `print()` is usually the fastest way to find out why. It does not save files, configure pins, or compile code.

    **Concept Tested:** Print Statement

---

#### 9. A student types `1 + 1` directly into Thonny's Shell and sees `2` appear immediately, without saving any file. Which best explains what just happened?

<div class="upper-alpha" markdown>
1. Thonny silently saved a temporary script called `main.py` and executed it as a full script run.
2. This is only possible because the onboard LED was already blinking.
3. Thonny requires every command to be part of a saved file before it can be evaluated.
4. The line was evaluated through the REPL, which reads, evaluates, and prints a single line's result immediately, distinct from running a saved `.py` file from start to finish via script execution.
</div>

??? question "Show Answer"
    The correct answer is **D**. Typing directly into the Shell exercises the REPL, which evaluates one line at a time and immediately prints the result — no file needs to exist. Script execution, by contrast, runs an entire saved `.py` file from start to finish. Both ultimately send text to the Shell, but they represent two different ways of getting code to the board: line-by-line versus a complete saved program.

    **Concept Tested:** Script Execution

---

#### 10. A student writes a blink program, clicks Run, watches the LED blink successfully, then unplugs the Pico 2 and reconnects it directly to a wall charger with no computer attached. The LED does not blink. What is the most likely explanation, and what does it reveal about how the board actually works?

<div class="upper-alpha" markdown>
1. The onboard LED requires a live USB serial connection to receive power, so it cannot function on a wall charger at all.
2. The script only ever existed in Thonny's editor pane and was never saved to the device filesystem as `main.py`, so the Pico 2 has nothing stored to execute automatically on power-up; running code from the editor and permanently storing code on the board are two separate steps.
3. Wall chargers supply a different voltage than USB ports, which prevents any MicroPython script from running.
4. The keyboard interrupt sent when Thonny was closed erased the script from the board's memory.
</div>

??? question "Show Answer"
    The correct answer is **B**. This scenario exposes a common misconception: clicking Run only sends the script for temporary execution while Thonny is attached — it does not, by itself, write anything to the device filesystem. Only a script explicitly saved to the board, ideally as `main.py`, persists and can run standalone. Wall-charger power is sufficient to run the board; the missing piece is a permanently saved file, not power or voltage.

    **Concept Tested:** Device Filesystem
