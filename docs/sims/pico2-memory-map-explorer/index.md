---
title: Pico 2 Memory Map Explorer
description: A clickable model of the Pico 2 address space that lets students classify an address as flash, RAM, or a memory-mapped register and explain why registers behave differently.
image: /sims/pico2-memory-map-explorer/pico2-memory-map-explorer.png
og:image: /sims/pico2-memory-map-explorer/pico2-memory-map-explorer.png
twitter:image: /sims/pico2-memory-map-explorer/pico2-memory-map-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Pico 2 Memory Map Explorer

<iframe src="main.html" height="512px" width="100%" scrolling="no"></iframe>

[Run the Pico 2 Memory Map Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/pico2-memory-map-explorer/main.html"
        height="512px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

"Memory-mapped register" is one of those phrases that stays abstract until you
can point at where it lives. This diagram gives the Pico 2's address space a
shape: three labeled bands you can click, with the register block broken out into
the four sub-blocks this course actually uses.

The bands are **not drawn to scale** — flash is far larger than the register
block in reality. What matters here is the classification, not the proportion.

The key distinction the sim is built around: flash and RAM are *storage*. An
address in either one names a cell that holds a value you put there. A
memory-mapped register address names no cell at all — it is wired straight to
hardware, so reading it samples whatever that hardware is doing right now. That
is why reading a timer register twice gives two different answers while reading a
RAM address twice gives the same answer.

## How to Use

1. Hover over each band to get a one-line summary before committing to a click.
2. Click **Flash**, then **RAM**, and compare the "volatile" lines. Which one
   survives unplugging the board?
3. Click into the register sub-blocks. Notice that none of them are labeled
   volatile *or* non-volatile — ask yourself why that question does not apply.
4. Press each code snippet button in turn. Each one jumps the "you are here"
   marker to the region that snippet actually reads, and explains the connection:
    - `gc.mem_free()` → RAM
    - `machine.unique_id()` → the Unique Device ID register
    - `open("main.py")` → flash
5. Press **Reset** to return to the default view.

## Controls

| Control | Purpose |
|---------|---------|
| Click any band or sub-block | Opens the full definition, an example, and volatility |
| Hover any band | One-line summary tooltip |
| `gc.mem_free()` | Highlights RAM |
| `machine.unique_id()` | Highlights the Unique Device ID register |
| `open("main.py")` | Highlights flash |
| Reset | Returns to the default RAM selection |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- Variables live somewhere in memory
- A program is stored as a file before it runs

### Learning Objective

Students will be able to **classify** a given address or piece of data as
belonging to flash, RAM, or the memory-mapped register block, and **explain** why
reading a register address behaves differently from reading ordinary RAM.

### Activities

1. **Sort the items** (4 min): The instructor names items — a sample buffer, a
   saved WAV file, the current GPIO pin state, the firmware itself. Students
   classify each into a band and defend the choice.
2. **Snippet trace** (3 min): Students press each code button and write down
   which region it reads and why.
3. **The reread question** (3 min): Students explain why calling
   `machine.unique_id()` twice returns the same value but reading a timer
   register twice does not, even though both are register reads.

### Assessment

Ask: "You unplug the board and plug it back in. Which of the three bands still
holds what it held before? Which is now empty? Which question does not apply to
the third band, and why?"

## Related Resources

- [Chapter 2: Know Your Board](../../chapters/02-know-your-board/index.md)

## References

1. [RP2350 Datasheet](https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf) — the authoritative address map and peripheral register listings for the Pico 2.
2. [Memory-mapped I/O](https://en.wikipedia.org/wiki/Memory-mapped_I/O_and_port-mapped_I/O) — the general technique of exposing hardware through the address space.
