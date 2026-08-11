---
title: 'Peripherals: The OLED Display, Buttons, and Deploying Standalone Code'
description: Wire an SPI OLED display and two debounced buttons to the Pico 2, then deploy code that runs standalone on power-up.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 19:24:40
version: 0.09
---

# Peripherals: The OLED Display, Buttons, and Deploying Standalone Code

## Summary

This chapter covers the two physical peripherals used throughout the course — an SPI-driven OLED display and two debounced push buttons — along with the deployment workflow that lets a program run untethered from a computer. It introduces the framebuffer and draw/show display pattern, event-driven button handling, and the import paths and boot scripts needed for standalone operation. By the end, a board can display live output and respond to input without Thonny attached.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. Active Low Logic
2. Autorun main.py
3. Chip Select Line
4. Code Organization
5. Data Visualization
6. Debouncing
7. Digital Input
8. Display Driver Chip
9. Display Refresh
10. Edge Detection
11. Event Loop
12. File Transfer To Device
13. Framebuffer
14. Import Path
15. Library Directory
16. Mode Switching
17. Module Import
18. Monochrome Display
19. Pixel Coordinates
20. Polling Loop
21. Pull Up Resistor
22. SPI Clock And Data
23. SSD1306 Controller
24. Serial Peripheral Interface
25. Shared Configuration Module
26. Standalone Operation
27. Switch Bounce
28. Text Rendering
29. mpremote Tool

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)

---

!!! mascot-welcome "Let's give your board a voice and a way to listen"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    So far your Pico 2 can blink one light and tell you about itself over USB. This chapter gives it a real screen to draw on and two buttons to listen to — and then teaches it to do both without a laptop attached at all. Let's tune in.

A blinking LED can only communicate one bit of information: on or off. Real instruments — a tuner, a spectrum analyzer, the tools you will build in this course — need to show much richer information: numbers, shapes, entire graphs that update live. That need has a name: **data visualization**, the practice of representing data visually — as shapes, graphs, or text on a screen — so that patterns a person could never spot in a list of raw numbers become immediately obvious. Everything in this chapter exists to put data visualization capability onto a five-dollar board.

## Talking Over SPI

The screen this course uses does not connect through USB or a handful of simple on/off wires — it needs a fast, dedicated communication channel built for moving many bytes per second. That channel is the **Serial Peripheral Interface**, commonly abbreviated SPI: a synchronous communication protocol that uses a small, fixed set of GPIO pins to move data between a microcontroller and a peripheral chip at high speed, one bit at a time, in step with a shared clock signal.

Two of those fixed pins carry the substance of an SPI connection, and their name describes exactly what they do: **SPI clock and data** — one pin (the clock line) ticks at a steady rate to pace every bit transferred, while a second pin (the data line) carries the actual bits, each one read or written in sync with a clock tick. Without the clock line, the receiving chip would have no way to know where one bit ends and the next begins.

SPI is also, unusually, a protocol designed to let one microcontroller talk to *several* peripheral chips over the same clock and data wires — which raises an obvious question: how does a chip know which peripheral a given message is meant for? The answer is the **chip select line**: a dedicated GPIO pin, one per connected peripheral, that the microcontroller pulls low to say "this specific message is for you" — only the peripheral whose chip select line is active pays attention to what is on the shared data line.

On the receiving end of all that wiring sits a **display driver chip** — a small, dedicated integrated circuit, physically separate from the display's own pixels, that translates commands and pixel data arriving over SPI into the specific electrical signals needed to light up the display hardware. Your microcontroller never talks to the screen's pixels directly; it always talks to this driver chip, which does the low-level work of actually addressing rows and columns of pixels.

## The SSD1306 and the Framebuffer

The specific driver chip used throughout this course is the **SSD1306 controller** — a widely used display driver chip, found on countless small OLED modules, that this course's 128×64-pixel display is built around. Because the SSD1306 is so common, MicroPython ships with a ready-made software library for talking to it, which means you will rarely write raw SPI commands by hand for the display — you will call methods on an SSD1306 driver object instead.

Before drawing anything, that driver object needs somewhere to build an image before sending it to the screen. That somewhere is the **framebuffer**: a block of memory that holds a complete image of everything that should appear on the display, one bit (or byte) per pixel, which your program modifies freely and privately before it is ever sent to the physical screen in one batch. Working through a framebuffer, rather than writing directly to the display for every single pixel change, is both faster and avoids showing a half-drawn image mid-update.

The specific display this course uses only ever needs one bit per pixel, because it is a **monochrome display** — a display capable of showing only two states per pixel, lit or unlit, with no color and no shades of gray — which is exactly why its framebuffer can be so compact: 128 × 64 pixels needs only 1,024 bytes of RAM, easily within the Pico 2's budget.

Every pixel within that framebuffer has an address of its own, expressed as **pixel coordinates** — an (x, y) pair identifying one specific pixel's position, conventionally measured with (0, 0) at the top-left corner of the display and x increasing rightward, y increasing downward. Drawing anything — a line, a letter, a bar on a spectrum plot — ultimately comes down to deciding which pixel coordinates to light up.

Changing the framebuffer in memory does not, by itself, change what is visible on the physical screen — that requires an explicit, separate step: **display refresh**, the act of sending the entire framebuffer's contents over SPI to the display driver chip so the physical pixels are updated to match, typically triggered by calling a `.show()` method. This two-step pattern — draw into the framebuffer, then refresh — is universal across this course's display code.

```python
from machine import Pin, SPI
from ssd1306 import SSD1306_SPI

spi = SPI(0, sck=Pin(18), mosi=Pin(19))
oled = SSD1306_SPI(128, 64, spi, dc=Pin(16), res=Pin(17), cs=Pin(13))

oled.fill(0)
oled.text("Hello, Pico 2!", 0, 0)
oled.show()
```

In this snippet, `SPI(0, sck=Pin(18), mosi=Pin(19))` sets up the clock and data lines discussed above; `dc`, `res`, and `cs` configure the driver chip's data/command, reset, and chip-select pins. The `oled.fill(0)` call clears the framebuffer in memory (0 means every pixel unlit); `oled.text(...)` writes into that same in-memory framebuffer without touching the screen yet; and only `oled.show()` performs the actual display refresh, sending the whole buffer over SPI in one shot.

That `oled.text(...)` call demonstrates **text rendering** — the process of converting characters into patterns of lit pixels at specific pixel coordinates within the framebuffer, using a built-in bitmap font, so that readable text appears on a display that fundamentally only understands individual pixels.

Before looking at the diagram below, it helps to name exactly what it will trace: the round trip from a `oled.text(...)` call, into the in-memory framebuffer, and out to the physical screen only once `oled.show()` runs — the same two-step draw/refresh pattern just described, now shown spatially.

#### Diagram: Framebuffer Draw and Refresh Pipeline

<iframe src="../../sims/framebuffer-draw-refresh-pipeline/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Framebuffer Draw and Refresh Pipeline</summary>
Type: diagram
**sim-id:** framebuffer-draw-refresh-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, summarize

Learning objective: Help students explain why changes to a framebuffer are invisible until `.show()` is called, and trace how a text-rendering call becomes lit pixels on the physical screen.

Purpose: Make the two-step draw/refresh pattern (modify framebuffer in RAM, then send the whole buffer over SPI) concrete and visible, since it is easy to assume drawing calls update the screen immediately.

Components to show (left-to-right flow):
- "Your Code" (e.g. `oled.text("Hi", 0, 0)`) — leftmost node
- "Framebuffer (RAM)" — a small 128x64 grid representation showing a few lit pixels forming letters, mid-left
- "oled.show()" — a distinct trigger node, mid-right
- "SPI (Clock + Data + Chip Select)" — connector node
- "SSD1306 Controller" — receiving node
- "Physical OLED Pixels" — rightmost node, showing the same lit-pixel pattern now "on the glass"

Connections:
- "Your Code" → "Framebuffer (RAM)" labeled "writes bits, no visible change yet"
- "Framebuffer (RAM)" → "oled.show()" labeled "read only when triggered"
- "oled.show()" → "SPI" → "SSD1306 Controller" → "Physical OLED Pixels" labeled "entire buffer sent in one burst"

Interactive features:
- A "Step" button that advances through the pipeline stage by stage, greying out not-yet-reached nodes and highlighting the active one
- Clicking any node opens an infobox with that node's definition from this chapter's vocabulary (Framebuffer, Display Refresh, Serial Peripheral Interface, SSD1306 Controller)
- A toggle: "Draw another line WITHOUT calling show()" — visually adds a second lit shape to the Framebuffer grid but explicitly does NOT propagate it to the Physical OLED Pixels node until Step reaches oled.show() again, reinforcing that multiple draws can accumulate before one refresh

Visual style: Horizontal pipeline, rounded rectangle nodes, small pixel-grid mockups inside the Framebuffer and Physical OLED Pixels nodes

Color scheme: Software-side nodes (Your Code, Framebuffer) in blue; the SPI connector in gray; hardware-side nodes (SSD1306 Controller, Physical OLED Pixels) in orange

Implementation: p5.js, responsive width, step state stored so resizing the window does not reset progress
</details>

## Reading Buttons Without Being Fooled

A display only ever sends information one direction — the OLED cannot tell your program anything. Getting information the other way, from the physical world into your code, is the job of **digital input**: configuring a GPIO pin (via `Pin(number, Pin.IN)`) to read whatever voltage something else is applying to it, rather than driving a voltage out, the mirror image of the digital output you used to blink an LED in Chapter 1.

Left disconnected, a digital input pin does not reliably read as either high or low — it "floats," picking up electrical noise from nearby wires. The standard fix is a **pull-up resistor**: a resistor connected between a GPIO pin and the positive supply voltage, so the pin reads a definite logic high by default, and only reads logic low when something (like a pressed button) actively pulls it down to ground. The Pico 2 has these resistors built into its GPIO peripheral, enabled in software with `Pin(number, Pin.IN, Pin.PULL_UP)` — no external resistor needed for this course's buttons.

That default-high, pressed-low wiring is common enough to have its own name: **active-low logic**, a design convention where the "active" or "pressed" state of a signal is represented by logic low rather than logic high — the opposite of what intuition might suggest, which is exactly why it is worth naming explicitly rather than assuming.

| Button state | Pull-up default | GPIO reads | Meaning under active-low logic |
|---|---|---|---|
| Not pressed | Pulled to 3.3V | Logic high (1) | Inactive |
| Pressed | Pulled to ground | Logic low (0) | Active — button is down |

A pressed mechanical button, however, does not produce one clean transition from high to low. It produces **switch bounce**: the rapid, unwanted series of electrical on/off transitions a mechanical switch produces in the first few milliseconds after being pressed or released, caused by physical contacts literally bouncing against each other before settling. Read naively, one press of a button can look to software like five or six presses in a row.

The standard remedy is **debouncing**: the technique of filtering out switch bounce — typically by ignoring any additional transitions for a short delay (often 20–50 milliseconds, using `sleep_ms()`) immediately after detecting the first one — so that one physical press is reported as exactly one logical event.

```python
from machine import Pin
from time import sleep_ms

button = Pin(14, Pin.IN, Pin.PULL_UP)

def debounced_press():
    if button.value() == 0:
        sleep_ms(30)
        return button.value() == 0
    return False
```

Here, `button.value() == 0` checks for the active-low pressed state; the `sleep_ms(30)` pause lets any bounce settle before the second check confirms the button is genuinely still held down, rather than reporting a bounce as a real press.

Continuously checking a button's state, over and over, is itself a pattern with a name: the **polling loop** — a loop that repeatedly checks a digital input's current state, over and over in quick succession, rather than waiting to be notified when something changes. Polling is simple, but it only tells you the button's *current* state — it cannot, by itself, tell you the exact moment a press *began*.

That moment matters, so a further refinement is usually layered on top of polling: **edge detection**, noticing the specific instant a digital input's value changes from one state to another (for example, high to low), rather than simply reporting whatever the current state happens to be. Combining a polling loop with edge detection and debouncing produces the standard shape of button-handling code used throughout this course, generalized as an **event loop**: a loop, structurally similar to a polling loop, that repeatedly checks for meaningful state changes (events) and dispatches a response — such as calling a specific function — whenever one is detected.

!!! mascot-tip "Debounce first, react second"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    A common early bug: reading a button, seeing it "pressed," and immediately acting on it — before the bounce has settled. Always debounce first, then treat the confirmed result as the actual event. It is a small extra step that saves a lot of confusing double-triggered behavior.

With reliable button-press events available, this course's two buttons drive one recurring interaction pattern: **mode switching** — using a detected button-press event to change which of several operating modes a program is currently in (for example, cycling a spectrum analyzer between a waveform view and a frequency view), implemented as an event loop that updates a mode variable each time a press event fires.

Before the interactive debounce visualizer below, it is worth naming exactly what its two traces represent: a raw, noisy voltage signal straight off a physical switch (showing the bounce this section just defined), and the same signal after the debouncing logic above has been applied to it.

#### Diagram: Switch Bounce and Debounce Visualizer

<iframe src="../../sims/switch-bounce-debounce-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Switch Bounce and Debounce Visualizer</summary>
Type: microsim
**sim-id:** switch-bounce-debounce-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Demonstrate, apply

Learning objective: Let students apply a debounce delay to a simulated noisy switch signal and observe how too short a delay still lets bounce through, while a reasonable delay produces exactly one clean logical press event.

Canvas layout:
- Top (200px): "Raw signal" strip chart — simulated noisy square wave showing 3-6 rapid bounces within the first ~15ms after a simulated press
- Middle (200px): "Debounced signal" strip chart — the same time window, showing the output of the debounce logic applied with the current delay setting
- Bottom (150px): controls and event counter

Visual elements:
- Two stacked, time-aligned strip charts sharing the same x-axis (time in milliseconds)
- Vertical marker lines at each detected "logical press event" on the debounced chart
- Event counter: "Logical presses detected: N" (should read 1 for a single simulated press, if the delay is adequate)

Interactive controls:
- Button: "Simulate one press" — triggers a new randomized bounce pattern (3-6 bounces within 15ms) on the raw signal
- Slider: Debounce delay, range 0-60 ms, default 30 ms
- Checkbox: "Show bounce count" — displays how many raw transitions occurred vs how many were filtered

Default parameters:
- Debounce delay: 30 ms
- No press simulated until "Simulate one press" is clicked

Behavior:
- Each click of "Simulate one press" generates a new random bounce sequence (always ending in a stable pressed state) and redraws the raw signal chart
- The debounced chart applies the current delay slider value to that same raw sequence and redraws, updating the "Logical presses detected" counter
- Setting the delay too low (e.g., 5ms) against a bounce pattern that lasts 15ms visibly produces more than one logical press, letting students discover the failure mode themselves before being told about it

Instructional Rationale: An Apply-level parameter exploration is appropriate because the objective asks students to connect a numeric debounce-delay choice to an observable correctness outcome (one press = one event), including deliberately letting them choose a value that is too small and see it fail.

Implementation notes:
- Use p5.js; keep both strip charts on a shared millisecond timescale so vertical alignment is meaningful
- Responsive width; both charts and controls scale to container width on window resize
</details>

!!! mascot-thinking "Polling, events, and modes are the same idea at three scales"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Zoom out for a second: a polling loop asks "what's the state right now?" repeatedly. Edge detection asks "did the state just change?" And mode switching asks "given that it changed, what should the whole program do differently?" Each one builds directly on the last — the same three-question pattern will show up again when this course reaches real-time audio processing.

## Deploying Code That Runs on Its Own

Every peripheral so far has been driven by code you ran from Thonny with a laptop attached. The last piece of this chapter removes that dependency entirely, so a finished project can run from nothing but a USB power source.

The first requirement is getting more than one file onto the board. **File transfer to device** is the general act of copying any file — not just the `main.py` you saved directly from Thonny in Chapter 1 — onto the Pico 2's device filesystem, which becomes necessary the moment a project needs supporting files like a display driver library. Thonny's Save dialog can do this one file at a time, but larger projects benefit from a purpose-built command-line tool: the **mpremote tool**, MicroPython's official command-line utility for copying files to and from a connected board, running scripts, and opening a REPL session, all without opening Thonny at all.

```bash
mpremote cp ssd1306.py :lib/ssd1306.py
mpremote cp main.py :main.py
```

Here, the `cp` command copies a local file to the board; the colon prefix (`:lib/ssd1306.py`) tells `mpremote` the destination path is on the device filesystem, not your computer's own disk.

That `lib/` destination is not arbitrary. MicroPython automatically searches a specific folder for library code: the **library directory**, a conventional folder named `/lib` on the device filesystem where MicroPython automatically looks for modules that scripts try to import, keeping reusable driver code separate from your project's own top-level scripts like `main.py`.

Automatic searching still requires MicroPython to know *where* to look, which is governed by the **import path** — the ordered list of folder locations, including the `/lib` directory, that MicroPython checks, in order, when a script executes an `import` statement, stopping at the first matching module it finds. Understanding the import path matters because a module saved to the wrong location on the device filesystem will fail to import even though the file is genuinely present on the board.

Beyond a single display driver, most projects in this course share settings — pin numbers, display dimensions, calibration constants — across several files. Rather than repeating those values, this course collects them in a **shared configuration module**: a single `.py` file (commonly named `config.py`), saved to the device filesystem, that defines shared constants and settings once, so that every other script can import and reuse them instead of hard-coding the same values repeatedly.

Bringing a library directory, an import path, and a shared configuration module together is what makes the standard Python **module import** statement work reliably on-device: the `import` statement that loads another `.py` file's code into your current script, following the import path described above to locate it, exactly as `import gc` or `import machine` did in earlier chapters — except now resolving to files you saved yourself.

```python
# config.py — a shared configuration module
OLED_WIDTH = 128
OLED_HEIGHT = 64
SPI_SCK_PIN = 18
SPI_MOSI_PIN = 19

# main.py
import config
from machine import Pin, SPI

spi = SPI(0, sck=Pin(config.SPI_SCK_PIN), mosi=Pin(config.SPI_MOSI_PIN))
```

Splitting a project this way — driver code in `/lib`, shared constants in `config.py`, and the top-level logic in `main.py` — is an instance of a broader engineering practice worth naming directly: **code organization**, the practice of splitting a program's source code across multiple files and modules by responsibility, rather than writing everything in one large script, so that each piece can be read, tested, and reused independently.

The very last piece makes all of this run without Thonny at all. **Autorun main.py** is the specific, built-in MicroPython behavior of automatically executing a file named exactly `main.py`, located in the device filesystem's root folder, immediately every time the board powers on or resets — no button press, no command, no attached computer required. That single built-in behavior is what enables **standalone operation**: running a complete program directly from the device filesystem on power-up, with no computer, IDE, or USB data connection attached at all — only power, commonly supplied by an ordinary phone charger.

Before the deployment workflow diagram below, it is worth naming the order these pieces must happen in, since getting the sequence wrong is the most common deployment mistake: files first, correct locations second, correct filename (`main.py`, root folder) last.

#### Diagram: Standalone Deployment Workflow

<iframe src="../../sims/standalone-deployment-workflow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Standalone Deployment Workflow</summary>
Type: workflow
**sim-id:** standalone-deployment-workflow<br/>
**Library:** vis-network<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Summarize, explain

Learning objective: Help students summarize the correct order of steps required to move from "code that only runs while Thonny is attached" to "code that runs standalone on power-up," and diagnose which step was skipped when standalone operation fails.

Purpose: Turn the multi-step, easy-to-get-wrong deployment process into a checkable, clickable sequence.

Components to show (as a left-to-right or top-to-bottom sequence of nodes):
1. "Write and test in Thonny" (editor pane, board attached)
2. "Copy driver libraries to /lib" (via mpremote or Thonny Save, e.g. ssd1306.py)
3. "Copy config.py to device root" (shared configuration module)
4. "Save your program as main.py in device root" (NOT any other filename)
5. "Unplug from computer, connect to USB power only"
6. "Board autoruns main.py — standalone operation confirmed"

Connections: simple linear arrows, node 1 → 2 → 3 → 4 → 5 → 6

Interactive features:
- Clicking any node opens an infobox with: what the step accomplishes, the specific MicroPython/mpremote command involved, and the most common mistake at that step (e.g., for node 4: "Saving as blink.py instead of main.py — MicroPython only autoruns the exact filename main.py")
- A "Common failure" toggle button that, when active, adds small red warning icons to nodes 2-4 with a one-line note on what breaks if that step is skipped or done wrong
- Hover over any node shows a one-line summary before clicking for the full infobox

Visual style: Vertical or horizontal linear flowchart, numbered rounded-rectangle nodes, arrows between each

Color scheme: Steps performed while still connected to a computer (1-4) in blue; the final standalone steps (5-6) in green

Implementation: vis-network, responsive to container width, canvas height 500px
</details>

!!! mascot-warning "One wrong filename breaks the whole plan"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo warning">
    Autorun only triggers for a file named exactly `main.py`, sitting in the device filesystem's root folder — not `main.PY`, not inside `/lib`, not `blink.py`. This single naming rule trips up more students building their first standalone project than any wiring mistake does.

Once a project deploys cleanly this way, it stays deployed. The device filesystem keeps every file exactly where it was — `main.py`, `config.py`, everything in `/lib` — across power cycles, until you explicitly overwrite something. Reconnecting to Thonny later to fix a bug does not undo any of it; you are editing a file on the same filesystem the board already boots from, not starting deployment over. That permanence is exactly why it is worth getting the sequence right once, rather than something to repeat before every use.

!!! mascot-encourage "This is the last setup-heavy chapter"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Wiring, import paths, and deployment steps are a lot of plumbing to absorb at once — and plumbing is genuinely less exciting than a spectrum analyzer. Good news: once your display, buttons, and standalone deployment all work, you will not need to revisit any of this setup again. Every chapter from here forward builds on top of it.

## Chapter Summary

Your board can now show information, respond to input, and run entirely on its own.

Key ideas to carry forward:

- The **SSD1306 controller** talks over **SPI**, using dedicated clock, data, and chip-select lines; your code draws into an in-memory **framebuffer** and only updates the physical screen on **display refresh**.
- **Pull-up resistors** and **active-low logic** mean a button reads high when untouched and low when pressed — the opposite of what intuition suggests.
- **Debouncing** turns messy **switch bounce** into one clean logical press, and layering **edge detection** on a **polling loop** produces a proper **event loop** for **mode switching**.
- Reliable deployment depends on getting three things right, in order: files in the right places (**library directory**, **import path**), a **shared configuration module** for constants, and a program saved as exactly `main.py` so **autorun** enables true **standalone operation**.

??? note "Quick check: your button reads logic HIGH when you are not touching it. Is that active-high or active-low wiring, and why? — Click to expand"
    Active-low. The pull-up resistor holds the pin high by default, so the "active" or pressed state is represented by the pin reading LOW — pressing the button pulls it down to ground, the opposite of what "active" might intuitively suggest.

!!! mascot-celebration "Your board can see, listen, and stand on its own"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Screen wired, buttons debounced, code deployed to run without a laptop in sight — that's the complete hardware platform this entire course builds on. Everything from here forward is about what you choose to *show* on that screen and *compute* in response to those buttons. Time to transform!
