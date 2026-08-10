# Lab 3: Know Your Board

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 2](../02-blink/index.md)  |  **Hardware:** Pico 2, USB cable

!!! mascot-welcome "Let's interrogate the chip"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Before we ask this chip to do something hard, we should find out what it's made of.
    The fun part: we won't look it up in a datasheet. We'll ask the CPU to tell us about
    itself, in its own words. Let's tune in.

## What You'll Build

A program that prints a full report on your board: firmware, clock speed, memory, and — the
good bit — the CPU's identity read directly out of a hardware register.

The numbers you write down today will decide how you optimize in Lab 32. Speed only means
something when you know the budget.

## Learning Objectives

- **Query** firmware version, clock speed, RAM and flash from MicroPython
- **Read** a memory-mapped hardware register with `machine.mem32`
- **Decode** the CPUID register into manufacturer, part number and revision
- **Calculate** how many CPU cycles fit inside one audio frame
- **Explain** the difference between RAM and flash on a microcontroller

## Concepts Introduced

| ID | Concept |
|---|---|
| 220 | Firmware Version |
| 221 | CPU Clock Frequency |
| 222 | RAM Versus Flash |
| 223 | Free Memory Query |
| 224 | Filesystem Statistics |
| 225 | Memory Mapped Register |
| 226 | CPUID Register |
| 227 | Silicon Revision |
| 228 | Unique Device ID |

## Background

### RAM and flash are not the same drawer

| | RAM | Flash |
|---|---|---|
| Holds | variables while running | your saved programs |
| Size here | ~485 KB | ~3 MB free |
| On power-off | **erased** | kept |
| Speed | fast | slower |

Your programs live in flash. Your data lives in RAM. When Lab 21 asks for buffers to hold 512
audio samples, it's RAM we're spending.

### Memory-mapped registers: the chip's control panel

Here's a genuinely neat idea. Some memory addresses aren't memory at all — they're wired
directly to hardware. Reading address `0xE000ED00` doesn't fetch a stored byte; it asks the CPU
"who are you?" and the answer comes back on the data bus.

ARM guarantees this address on **every** Cortex-M chip ever made. Same address, same meaning,
across the entire family. That's what `machine.mem32[0xE000ED00]` reads.

!!! mascot-thinking "Why bother reading a register you could just look up?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Because datasheets describe the chip you *think* you have. The register describes the
    chip you *actually* have. In Lab 28 that difference is the whole lesson — an earlier
    version of this very course wasted enormous effort writing code for hardware the board
    didn't contain. Ask the silicon.

## Procedure

### Step 1 — Run the report

Open `03-know-your-board.py` from the Pico and run it:

```python
--8<-- "docs/labs/03-know-your-board/code/03-know-your-board.py"
```

### Step 2 — Decode CPUID by hand

The program printed `CPUID raw : 0x411fd210`. That single number packs four facts into
different groups of bits:

| Bits | Meaning | Our value | Decodes to |
|---|---|---|---|
| 31–24 | who made it | `0x41` | ARM |
| 23–20 | variant ("r") | `1` | r1 |
| 19–16 | architecture | `0xF` | ARMv7-M style encoding |
| 15–4 | part number | `0xD21` | **Cortex-M33** |
| 3–0 | revision ("p") | `0` | p0 |

So this is an **ARM Cortex-M33, revision r1p0**.

Work through the shifting yourself in the REPL:

```python
cpuid = 0x411fd210
hex((cpuid >> 24) & 0xFF)     # who made it
hex((cpuid >> 4) & 0xFFF)     # which core
```

`>>` slides the bits right; `& 0xFF` keeps only the low 8. You'll use this pattern constantly
once we reach assembly.

### Step 3 — Work out your budget

This is the number that matters for the rest of the course.

Audio arrives continuously. We process it in chunks of 512 samples. At 12,800 samples per
second, one chunk covers:

```
512 / 12800 = 0.04 seconds = 40 milliseconds
```

Your CPU runs at 150 MHz, so in 40 ms it executes:

```
150,000,000 × 0.04 = 6,000,000 cycles
```

**Six million cycles per frame.** That's the whole budget. Everything — capturing audio, the
FFT, updating the display — has to fit.

!!! mascot-tip "Write these down"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Clock speed, RAM free, and cycles-per-frame. Stick them on a note. When your Lab 16 DFT
    blows the budget by 30×, these numbers are how you'll know *by how much* — and that's a
    much more interesting failure than "it felt slow."

## Expected Output

```
=== Firmware ===
MicroPython : 3.4.0; MicroPython v1.28.0 on 2026-04-06
board       : Raspberry Pi Pico2 with RP2350
platform    : rp2

=== Speed ===
clock       : 150000000 Hz  (150 MHz)
one cycle   : 6.667 nanoseconds

=== Memory ===
RAM free    : 490896 bytes (479.4 KB)
RAM used    : 6256 bytes
RAM total   : 485.5 KB
flash total : 3072 KB
flash free  : 2584 KB

=== The CPU, straight from its own registers ===
CPUID raw   : 0x411fd210
made by     : 0x41 (0x41 means ARM)
part number : 0xd21 (0xd21 means Cortex-M33)
revision    : r1p0
device ID   : f9f443f103f8c1cb

=== What this means for us ===
A Cortex-M33 at 150 MHz gives us 150.0 million cycles per second.
A 512-point FFT has to finish inside 40 ms to keep up with audio.
That is 6000000 cycles of budget. Remember that number.
```

Your flash-free and RAM numbers will differ slightly. Your device ID will be unique to your
board — no two are alike.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| CPUID reads `0` | Typo in the address | It's `0xE000ED00` — count the zeros |
| Part number isn't `0xd21` | You're on an original Pico (RP2040) | That board has a Cortex-M0+. Labs 28–35 need a Pico 2 |
| RAM free looks low | Garbage not collected | Call `gc.collect()` before measuring |
| `AttributeError: mem32` | Missing import | `import machine` first |

## Challenges

1. **Overclock (carefully).** Try `machine.freq(200_000_000)` and re-run. How does the cycle
   budget change? Set it back to 150 MHz afterwards.
2. **Where did the RAM go?** Create a big list — `x = [0] * 50000` — then check `gc.mem_free()`
   again. How many bytes did each entry cost?
3. **Fingerprint.** `machine.unique_id()` is different on every chip ever made. What could you
   use that for?

## Check Your Understanding

1. What's the difference between RAM and flash, and which one holds your saved program?
2. What does `machine.mem32[0xE000ED00]` actually do — is it reading memory?
3. Your chip runs at 150 MHz. How many cycles pass in one millisecond?
4. Why might reading the CPUID register be more trustworthy than reading a datasheet?

!!! mascot-celebration "Module 0 complete!"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can talk to the board, drive a pin, and read the CPU's own ID register. That's the
    whole foundation. Next module we give it a screen, some buttons, and — best of all —
    ears.

---

**Next:** [Lab 4: The OLED Display](../04-oled-display/index.md)  |  **Previous:** [Lab 2](../02-blink/index.md)
