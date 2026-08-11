---
title: 'Hello World: Thonny, MicroPython, and Your First GPIO Program'
description: Connect a Raspberry Pi Pico 2 to Thonny, work in the REPL, and write your first GPIO program to blink the onboard LED.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 19:13:39
version: 0.09
---

# Hello World: Thonny, MicroPython, and Your First GPIO Program

## Summary

This chapter introduces the Raspberry Pi Pico 2 and the MicroPython development workflow: connecting over USB serial, working in the REPL, and running your first scripts with Thonny. It also covers the board's first GPIO program, blinking the onboard LED, establishing the toggle-and-delay pattern used throughout the course. By the end, you can save code to the device, interrupt a running script, and explain the difference between MicroPython and CPython.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Device Filesystem
2. Digital Output
3. GPIO Pin
4. General Purpose IO
5. Infinite Loop
6. Keyboard Interrupt
7. Logic High And Low
8. MicroPython
9. MicroPython Firmware
10. MicroPython vs CPython
11. Microcontroller
12. Onboard LED
13. Pin Object
14. Pin Toggle
15. Print Statement
16. Python Language
17. REPL
18. Saving To Device
19. Script Execution
20. Sleep Delay
21. Thonny IDE
22. USB Serial Connection

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

## Meet Your $5 Superpower

Every superpower needs an origin story. This one starts with a **microcontroller** — a single chip that packs a processor, memory, and input/output circuitry into one small package, built to run one program and talk directly to the physical world. Unlike the laptop or phone you are reading this on, a microcontroller does not run an operating system with dozens of background apps. It boots, runs your code, and does exactly what you told it to do — nothing more, nothing less.

The microcontroller at the center of this course is the Raspberry Pi Pico 2, built around an ARM Cortex-M33 processor running at 150 MHz. It costs about five dollars. By the end of Week 10 you will have used this same five-dollar chip to compute audio spectrums in real time, something that used to require specialized laboratory equipment. That gap — between what this chip is capable of and what most people assume a five-dollar board can do — is the whole reason this course exists.

!!! mascot-welcome "Hi! I'm Echo."
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waves hello">
    Welcome aboard! I'm **Echo**, a dolphin who happens to think in frequencies — echolocation is real-time signal processing, so this course is basically my home turf. I'll be popping up in the margins all the way through this book, but I do not show up randomly. I have exactly **six jobs**, and you'll learn to recognize me by which one I'm doing:

    1. **Welcome you** at the start of every chapter — that's what I'm doing right now.
    2. **Help you think through** a key concept when an idea is worth pausing on.
    3. **Give you tips** — the small moves an experienced signal hunter makes that nobody writes down.
    4. **Warn you gently** about the specific spots where students (and I, honestly) get tripped up.
    5. **Encourage you** when a concept looks intimidating on first contact.
    6. **Celebrate with you** when you've earned it, usually at the end of a chapter.

    That's it. If I'm not doing one of those six things, I'm not in the chapter. Time to transform!

## Two Flavors of Python

You will write every line of code in this course in the **Python language**, a general-purpose programming language known for readable syntax — code that reads almost like plain English, using indentation instead of curly braces to mark blocks of code. If you have written a `for` loop or defined a function in Python before, that experience transfers directly.

But the Pico 2 does not run the same Python interpreter that lives on a desktop computer. It runs **MicroPython**, a compact reimplementation of the Python language designed to fit inside a microcontroller's tiny memory footprint — kilobytes of RAM instead of gigabytes. MicroPython supports the core Python syntax and a useful subset of the standard library, plus hardware-specific modules (like `machine`, which you will meet shortly) that do not exist on a desktop at all, because a desktop computer has no GPIO pins to control.

The full-size Python interpreter that runs on laptops and servers has a name too: **CPython**, the reference implementation of Python written in the C language. Comparing **MicroPython vs CPython** side by side makes the differences concrete.

Before comparing them in a table, it helps to name why the difference matters practically: CPython assumes a full operating system underneath it — a filesystem with folders, network access, and megabytes of RAM to spare. MicroPython assumes none of that. It is Python re-engineered to boot directly on bare metal.

| Feature | CPython (desktop) | MicroPython (Pico 2) |
|---|---|---|
| Typical RAM available | Gigabytes | ~520 KB |
| Runs on | Operating system (Windows, macOS, Linux) | Bare metal, no OS |
| Standard library | Full | Compact subset |
| Hardware access | None built in | `machine`, `time`, and other hardware modules |
| Startup time | Seconds | Milliseconds |

That compact interpreter has to live somewhere on the chip before it can run anything. The **MicroPython firmware** is the pre-built binary image — MicroPython itself, compiled for the Pico 2's specific processor — that gets flashed onto the board's internal flash memory. Once installed, the firmware is what wakes up every time you power on the Pico and gives you a Python prompt instead of a blank, unresponsive chip.

!!! mascot-thinking "Why does the interpreter matter?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Here's the mental model worth keeping: CPython is Python for a computer that already has everything. MicroPython is Python for a chip that has almost nothing — and that constraint is exactly why it can boot in milliseconds and fit in half a megabyte. You'll feel this constraint again later in the course when floating-point math on this chip turns out to be slower than you'd expect. Same reason: small, focused, and built for hardware.

## Getting Connected — Thonny and the REPL

To write and run MicroPython code, this course uses **Thonny**, a free, beginner-friendly Python IDE (integrated development environment) that can talk directly to a microcontroller over a USB cable, upload files, and show you what the board is doing in real time. Thonny is the only software tool this course requires — no compiler, no build system, no command-line setup.

The physical link between your computer and the Pico 2 is the **USB serial connection** — a USB cable that carries both power and a two-way stream of text data between your computer and the board, using a protocol that makes the microcontroller appear as a serial port your computer can open. This is the same style of connection old modems used, just far faster and running over USB instead of a phone line.

Connecting for the first time follows a short, repeatable sequence:

1. Plug the Pico 2 into your computer with a USB cable that supports data (not a charge-only cable).
2. Open Thonny and check the bottom-right corner of the window for the interpreter selector.
3. Select **MicroPython (Raspberry Pi Pico)** and the correct serial port from that menu.
4. Watch the Shell panel at the bottom of the window for a `>>>` prompt — that prompt means the board is alive and listening.
5. Type a short command, like `1 + 1`, and press Enter to confirm the connection works.

That `>>>` prompt is your entry point into the **REPL** — Read-Eval-Print Loop, an interactive prompt that reads one line of code you type, evaluates it immediately, prints the result, and loops back to wait for your next line. The REPL is where you will experiment throughout this course: testing a single line before committing to a full script, checking a variable's value, or confirming a peripheral responds the way you expect.

Every time you type a line into the REPL and see output appear, you are relying on the **print statement** — the `print()` function, which sends text output from your running MicroPython program back over the USB serial connection so Thonny can display it in the Shell panel. It is the simplest and most-used debugging tool in this entire course; whenever something on the board seems to be doing the wrong thing, a well-placed `print()` is usually the fastest way to find out why.

Typing commands one at a time in the REPL is useful for exploration, but real programs live in files. **Script execution** is the process of running an entire saved `.py` file from start to finish, rather than one line at a time — in Thonny, that means clicking Run (or pressing F5) with a file open in the editor pane above the Shell. The board executes every line of the file in order, printing any output to the Shell exactly as it would if you had typed each line into the REPL yourself.

Before looking at how Thonny and the board's REPL fit together as a system, it helps to name the three pieces this diagram will show: the **editor pane** where you write a script, the **Shell** where the REPL lives, and the **board** itself, which only ever sees text sent over the USB serial connection — it has no idea whether that text came from a saved file or a line you typed by hand.

#### Diagram: Thonny and the Pico 2 Workflow

<iframe src="../../sims/thonny-repl-workflow/main.html" width="100%" height="502px" scrolling="no"></iframe>

<details markdown="1">
<summary>Thonny and the Pico 2 Workflow</summary>
Type: workflow
**sim-id:** thonny-repl-workflow<br/>
**Library:** vis-network<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, summarize

Learning objective: Help students explain how the editor pane, the Shell/REPL, and the physical board relate to one another, and why "Run" behaves differently from typing directly into the Shell.

Purpose: Show the round trip of code and data between Thonny (running on a laptop) and the Pico 2 (connected by USB), so students understand what "the REPL" actually is before they start typing commands into it.

Components to show (as clickable nodes in a simple left-to-right flow):
- "Editor Pane" (top left) — where a `.py` script is written and saved
- "Run Button / F5" (small connector node between editor and Shell)
- "Shell Panel (REPL)" (middle) — shows the `>>>` prompt and output
- "USB Serial Connection" (connector node between Shell and Board)
- "Pico 2 Board" (right) — running the MicroPython firmware
- "print() output" (small node feeding back from Board into Shell)

Connections:
- Editor Pane → Run Button → Shell Panel (script sent for execution)
- Shell Panel ⇄ USB Serial Connection ⇄ Pico 2 Board (two-way arrow, code down, output back)
- Pico 2 Board → print() output → Shell Panel (labeled "printed text returns here")
- A separate direct arrow from a "Type directly here" label into Shell Panel, showing the REPL also accepts commands with no editor/Run step at all

Interactive features:
- Hovering any node shows a one-sentence definition of that term pulled from this chapter's vocabulary (Editor Pane, Shell Panel/REPL, USB Serial Connection, MicroPython Firmware)
- Clicking "Run Button / F5" highlights the full path a saved script takes, dimming the direct-typing path
- Clicking "Type directly here" highlights the direct REPL path instead, dimming the script path
- Zoom and pan enabled; layout is left-to-right hierarchical

Visual style: Simple horizontal flowchart, rounded rectangle nodes, arrows labeled with what travels along them ("code", "text output")

Color scheme: Software-side nodes (Editor Pane, Shell Panel) in blue; hardware-side nodes (Pico 2 Board) in orange; the USB Serial Connection edge in gray with a small USB icon

Implementation: vis-network, responsive to container width, canvas height 500px
</details>

!!! mascot-tip "Two ways to run code, one board listening"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Typing directly into the Shell is great for a quick experiment — try a line, see the result, done. But anything you want to keep needs to live in a saved file. Get in the habit early of moving working REPL lines into a real script; you'll thank yourself in Week 4 when scripts get longer.

A script only survives a power cycle if it actually lives on the board. **Saving to device** means writing your `.py` file onto the Pico 2's own storage — using Thonny's Save dialog and choosing "Raspberry Pi Pico" as the destination — rather than saving it to your computer's hard drive. That storage location is the **device filesystem**, the small persistent flash storage built into the Pico 2 that holds your saved scripts, MicroPython's own firmware, and any files you upload, all of which survive even after you unplug the board.

There is one filename that matters more than any other: a file saved as `main.py` in the device filesystem's root folder runs automatically every time the board powers on, with no computer or Thonny required at all. That single fact is what makes Lab 6, later in this course, possible — a spectrum analyzer that runs standalone from a phone charger.

## Your First GPIO Program — Blinking the Onboard LED

With the REPL and Thonny workflow in hand, it's time for the program every embedded-systems course starts with: making a single LED blink. Before writing it, three pieces of vocabulary need to be in place.

A **GPIO pin** is General Purpose Input/Output — one of the physical metal legs on the Pico 2 that software can configure to either read a signal coming in or send a signal out, under direct program control. **General Purpose IO** (GPIO, the same idea at the system level) is what makes a microcontroller useful at all: it is the set of these configurable pins, collectively, that let a chip sense buttons, drive LEDs, and talk to sensors like the microphone you will wire up in Module 2.

When a GPIO pin is configured to send a signal out rather than read one in, that configuration is called **digital output** — the pin actively drives its own voltage, rather than passively reporting whatever voltage something else is putting on it. Digital output only ever has two states, and those two states have names: **logic high and low**. Logic high means the pin is driving roughly 3.3 volts; logic low means it is driving roughly 0 volts (ground). There is no in-between in digital logic — a pin is either high or low, and that binary distinction is what your code controls directly.

| State | Approx. voltage | Common meaning |
|---|---|---|
| Logic high | 3.3 V | "On" — LED lit, signal asserted |
| Logic low | 0 V | "Off" — LED dark, signal not asserted |

The easiest place to see logic high and low in action is a component already soldered onto the board: the **onboard LED**, a small light-emitting diode built directly into the Pico 2 that is wired to a specific GPIO pin (labeled `"LED"` in MicroPython) so it can be controlled without any extra wiring or breadboard. Driving that pin logic high lights the LED; driving it logic low turns it dark.

In MicroPython, you control a specific pin through a **Pin object** — an instance of the `Pin` class from the `machine` module that represents one physical GPIO pin and exposes methods to configure and control it. Creating one looks like this:

```python
from machine import Pin

led = Pin("LED", Pin.OUT)
```

Here, `"LED"` tells MicroPython which physical pin to attach to — in this case, the pin already wired to the onboard LED — and `Pin.OUT` configures that pin for digital output, meaning your code will drive its voltage rather than read it. Once `led` exists, two calls follow directly from what you just learned: `led.value(1)` drives the pin logic high (LED on), and `led.value(0)` drives it logic low (LED off).

Rather than setting the value explicitly every time, MicroPython offers a shortcut built exactly for blinking: **pin toggle**, the `led.toggle()` method, which flips a digital output pin from whatever state it is currently in to the opposite state — high becomes low, low becomes high — without your code needing to track which one it was.

Toggling once just changes the LED's state one time. To make it blink, the program needs to pause between toggles, which is the job of **sleep delay**: `sleep()`, a function from MicroPython's `time` module that pauses script execution for a specified number of seconds (or, using `sleep_ms()`, milliseconds) before the next line runs.

Putting `Pin`, `toggle()`, and `sleep()` together produces the classic blink program:

```python
from machine import Pin
from time import sleep

led = Pin("LED", Pin.OUT)

while True:
    led.toggle()
    sleep(0.5)
```

That `while True:` line is an **infinite loop** — a loop whose condition (`True`) can never become false, so the code inside it repeats forever until something outside the loop stops it, such as the board losing power or the user interrupting the script. Infinite loops show up constantly in embedded systems, because a microcontroller usually has exactly one job and no reason to ever stop doing it. This is the toggle-and-delay pattern you will reuse, in more sophisticated forms, throughout the rest of this course.

Before running this in the interactive timing explorer below, it's worth naming what the sim will show explicitly: the pin's voltage over time as a simple two-level graph — high or low, nothing in between — updating as you adjust the sleep delay.

#### Diagram: Blink Timing Explorer

<iframe src="../../sims/blink-timing-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>Blink Timing Explorer</summary>
Type: microsim
**sim-id:** blink-timing-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Demonstrate, calculate

Learning objective: Let students manipulate the sleep-delay parameter and directly observe its effect on the onboard LED's logic-high/logic-low timeline and blink frequency, connecting the `sleep()` argument to a physical rate they can predict.

Canvas layout:
- Top (350px height): a scrolling voltage-vs-time strip chart showing the LED pin's state as a square wave (two levels only — logic high at 3.3V line, logic low at 0V line)
- Bottom (150px height): control panel

Visual elements:
- Square wave trace scrolling right to left, redrawn each frame
- A small onboard-LED icon that visibly lights up (yellow/white) when the simulated pin is logic high, and goes dark gray when logic low
- Horizontal gridlines labeled "3.3V (HIGH)" and "0V (LOW)"
- A running readout: "Blinks per second: X.X" and "Delay per toggle: Y ms"

Interactive controls:
- Slider: Sleep delay, range 0.05 to 2.0 seconds, default 0.5 seconds, updates `sleep()` argument in the displayed code snippet live
- Button: "Toggle Once" — manually step the pin state by one toggle, for students who want to see a single transition in isolation
- Button: "Run / Pause" — starts or stops the automatic toggle-and-delay loop
- Checkbox: "Show code" — reveals the exact three-line loop (`led.toggle()`, `sleep(delay)`) being simulated, with the current slider value substituted in

Default parameters:
- Sleep delay: 0.5 seconds
- Running: paused until student presses Run

Behavior:
- When running, the simulated pin flips state every `delay` seconds, exactly mirroring `while True: led.toggle(); sleep(delay)`
- The strip chart redraws the square wave in real time as delay changes, so a shorter delay visibly produces a faster-alternating wave and a lower delay value visibly increases "Blinks per second"
- "Toggle Once" pauses automatic running and performs exactly one state flip, useful for stepping through the logic-high/logic-low transition slowly

Instructional Rationale: An Apply-level parameter-exploration pattern is appropriate because the objective asks students to connect a numeric input (the sleep delay argument) to an observable physical rate (blink frequency) — a calculation they should be able to predict before dragging the slider, then confirm by watching the wave.

Implementation notes:
- Use p5.js with `frameRate()`-independent timing (based on `millis()`) so the wave speed matches real seconds, not frame count
- Responsive width; strip chart and controls both scale to container width on window resize
</details>

!!! mascot-warning "The board doesn't know what a file is until you save it"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo warning">
    A script you only *ran* from the editor pane, without ever using Save-to-device, disappears the moment you unplug the Pico. It lived in Thonny's memory on your laptop, not in the device filesystem. If you want your blink program to survive a power cycle, save it to the board as `main.py` — not just click Run.

Sooner or later, an infinite loop needs to stop — usually because you want to edit the code and try something different. In Thonny, pressing Ctrl+C (or clicking the Stop button) sends a **keyboard interrupt** — a signal that halts a running MicroPython script immediately, mid-line if necessary, and returns control to the REPL so you can type new commands or run a different script. Without a keyboard interrupt, the only way to stop a `while True:` loop would be to physically unplug the board — which works, but is a blunt instrument compared to a clean interrupt.

!!! mascot-encourage "Infinite loops feel weird at first — that's normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    If `while True:` feels unsettling — a loop that's designed to *never* end on its own — you're reacting exactly the way most people do the first time. On a desktop program, that would usually be a bug. On a microcontroller with exactly one job, it's the normal shape of the whole program. You'll write dozens of these before this course is done.

## Chapter Summary

You now have everything needed to get a Raspberry Pi Pico 2 talking to Thonny and blinking its own LED — the foundation every later lab in this course builds on.

Key ideas to carry forward:

- A **microcontroller** runs one program directly on hardware, with no operating system in between.
- **MicroPython** is a compact Python implementation built for that constraint; **CPython** is the full desktop version. They share syntax but not scale.
- The **REPL**, reached through **Thonny** over a **USB serial connection**, lets you test code one line at a time before committing it to a saved script.
- Saving a file to the **device filesystem** — especially as `main.py` — is what makes code survive a power cycle and run standalone.
- A **GPIO pin** configured for **digital output** can only be **logic high** or **logic low**; the **onboard LED** wired to one specific pin makes that binary state visible.
- The toggle-and-delay pattern — `Pin.toggle()` plus `sleep()` inside a `while True:` **infinite loop** — is the blueprint for the real-time programs the rest of this course builds, and a **keyboard interrupt** is how you stop one cleanly.

??? note "Quick check: what happens if you unplug the Pico while a script is only saved on your laptop, not on the device? — Click to expand"
    The script disappears from the board immediately — the Pico only remembers what has been explicitly saved to its own device filesystem (ideally as `main.py`). Anything that only ever lived in Thonny's editor on your computer has to be re-sent the next time you connect.

!!! mascot-celebration "You just brought a $5 chip to life"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Nice work — you connected to a real microcontroller, talked to it through the REPL, and made it blink a light entirely under your own code's control. That toggle-and-delay pattern you just learned is the exact same shape you'll use to drive an OLED display in the next chapter, and eventually to output a live audio spectrum. Not bad for a $5 chip! Time to transform!

[See Annotated References](./references.md)
