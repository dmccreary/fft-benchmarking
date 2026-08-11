---
title: Thonny REPL Workflow
description: An interactive flow diagram of how the Thonny editor pane, the Shell/REPL, and the Pico 2 board relate, and why Run behaves differently from typing at the prompt.
image: /sims/thonny-repl-workflow/thonny-repl-workflow.png
og:image: /sims/thonny-repl-workflow/thonny-repl-workflow.png
twitter:image: /sims/thonny-repl-workflow/thonny-repl-workflow.png
social:
   cards: false
status: implemented
library: vis-network
bloom_level: Understand
---

# Thonny REPL Workflow

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Thonny REPL Workflow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/thonny-repl-workflow/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Before you type your first command into the Pico's REPL, it helps to know what
"the REPL" actually is and where it lives. This diagram lays out the round trip
of code and text between Thonny running on your laptop and the Pico 2 connected
by USB.

The important insight is that there are **two different routes** to the same
board:

- **The script path** — you write a `.py` file in the editor pane, press Run
  (F5), and Thonny sends the whole file down the serial link at once.
- **The direct REPL path** — you type one statement at the `>>>` prompt and it
  goes straight to the board, with no file, no save, and no Run step.

Both paths end at the same place. Only one of them involves a file.

Blue boxes are software running on the laptop, the orange box is the physical
board, and gray boxes are the links and commands that connect them.

## How to Use

1. Hover over any box to read a one-sentence definition of that term.
2. Click **Run Button / F5** (or the **Script Path** button) to light up the
   full route a saved script takes. Notice that the editor pane is part of it.
3. Click **Type directly here** (or the **Direct REPL** button) to light up the
   typing route instead. Notice that the editor pane goes dim — it plays no part.
4. Compare the two highlighted routes and state in your own words what the Run
   button adds that typing at the prompt does not.
5. Press **Reset** to return every node to its normal color.

Note that the segment from the Shell down through USB to the board — and the
`print()` output coming back — is shared by both routes. That shared section is
the REPL itself.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior) or advanced high school

### Duration

8-10 minutes

### Prerequisites

- Have Thonny installed and a Pico 2 connected
- Know that a `.py` file holds Python source code

### Learning Objective

Students will be able to **explain** how the editor pane, the Shell/REPL, and the
physical board relate to one another, and **summarize** why "Run" behaves
differently from typing directly into the Shell.

### Activities

1. **Vocabulary sweep** (3 min): Students hover every node and write down the
   four key terms — Editor Pane, Shell Panel (REPL), USB Serial Connection,
   MicroPython Firmware.
2. **Path comparison** (4 min): Students trace both highlighted paths and list
   which nodes appear in one but not the other.
3. **Explain back** (3 min): In pairs, one student explains the script path and
   the other explains the direct path without looking at the diagram.

### Assessment

Ask: "You typed `print(2+2)` at the `>>>` prompt and saw `4`. Where did the
addition actually happen, and how did the `4` get onto your laptop screen?"
A correct answer names the board as the site of execution and the USB serial
link as the return route.

## Related Resources

- [Chapter 1: Hello World](../../chapters/01-hello-world/index.md)

## References

1. [Thonny IDE](https://thonny.org/) — the official site for the editor used in this chapter.
2. [MicroPython REPL documentation](https://docs.micropython.org/en/latest/reference/repl.html) — how the Read-Eval-Print Loop behaves on a microcontroller.
