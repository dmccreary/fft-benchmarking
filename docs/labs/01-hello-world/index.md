# Lab 1: Hello World with Thonny

**Time:** ~30 minutes  |  **Prerequisites:** none  |  **Hardware:** Raspberry Pi Pico 2, USB cable

!!! mascot-welcome "Time to transform!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Hi, I'm Echo. Every superpower starts somewhere unglamorous, and ours starts here:
    making a $5 chip say hello. Thirty-four labs from now this same chip will be analysing
    sound in real time. Let's tune in.

## What You'll Build

You'll connect a Raspberry Pi Pico 2 to your computer, open a program called Thonny, and make
the chip print a message back to you. Then you'll save a program *onto* the chip so it belongs
to the board, not to your laptop.

That's it. No wiring, no soldering, nothing to break.

## Learning Objectives

By the end of this lab you will be able to:

- **Describe** what MicroPython is and how it differs from the Python on your laptop
- **Connect** to a Pico 2 from Thonny over USB
- **Execute** code two ways: interactively and as a saved script
- **Explain** the difference between a program on your computer and one on the device
- **Stop** a running program deliberately

## Concepts Introduced

| ID | Concept |
|---|---|
| 201 | Thonny IDE |
| 202 | MicroPython Firmware |
| 203 | USB Serial Connection |
| 204 | REPL |
| 205 | Print Statement |
| 206 | Script Execution |
| 207 | Saving To Device |
| 208 | Device Filesystem |
| 209 | Keyboard Interrupt |
| 210 | MicroPython vs CPython |

## Background

A **microcontroller** is a whole computer on one chip — processor, memory, and pins that connect
to the physical world. The Pico 2 costs about $5 and is roughly as powerful as a desktop PC from
the mid-1990s. That turns out to be plenty.

Normally you'd program one in C, which means compilers, linkers, and a lot of ceremony.
**MicroPython** is a version of Python that runs *on the chip itself*, so you can type a line
and watch it happen. Same language you may already know, running somewhere surprising.

!!! mascot-thinking "MicroPython isn't quite Python"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    MicroPython is Python 3 with the heavy bits removed to fit in a few hundred kilobytes.
    You get `for`, `while`, functions, classes, `import` — all the good stuff. You *don't*
    get the giant standard library. No `pandas` here. That's a feature: what's left is fast
    and fits.

## Procedure

### Step 1 — Install Thonny

Download from [thonny.org](https://thonny.org) and install it. It's free, it's small, and it
was built for exactly this.

### Step 2 — Put MicroPython on the board

Your Pico 2 may arrive blank. To load MicroPython:

1. **Unplug** the Pico 2.
2. **Hold down the BOOTSEL button** (the little white button on the board).
3. **While still holding it**, plug the USB cable into your computer.
4. Release. A new drive appears, named `RP2350`.

Now in Thonny: **Tools → Options → Interpreter**, choose **MicroPython (Raspberry Pi Pico)**,
then click **Install or update MicroPython** at the bottom right. Pick the Pico 2 variant and
install.

!!! mascot-warning "Pico 2, not Pico 1"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Make sure you install the firmware for the **Pico 2 / RP2350**, not the original Pico.
    They look nearly identical and the wrong firmware simply won't boot. Later on this
    distinction gets *very* important — the older chip is missing hardware we're going to
    depend on. (Foreshadowing! See Lab 28.)

### Step 3 — Say hello, interactively

At the bottom of Thonny is the **Shell** panel. That's the **REPL** — Read, Evaluate, Print,
Loop. It's a live conversation with the chip.

Click into it and type:

```python
print("Hello from a $5 computer!")
```

Press Enter. The chip runs that line and answers immediately.

Try a few more:

```python
2 + 2
"signal" * 3
import sys
sys.platform
```

That last one should say `rp2`. You're talking to the actual silicon.

### Step 4 — Open a real program

The REPL is great for poking around, but it forgets everything when you unplug. Programs are
better.

Good news: **every lab's code is already on your Pico.** In Thonny, find the **Files** panel on
the left. (If you don't see it, turn it on with **View → Files**.) The lower half shows
**Raspberry Pi Pico** — that's the device's own filesystem.

Open `01-hello-world.py`. Here's what's inside:

```python
--8<-- "docs/labs/01-hello-world/code/01-hello-world.py"
```

Press the green **Run** button (or F5) and watch the Shell. Your program runs, counts to five,
and stops.

!!! mascot-tip "Two filesystems, one window"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The Files panel shows *two* places: your computer on top, the Pico underneath. A file
    open from the Pico stays on the Pico when you save it. A file open from your laptop
    doesn't exist on the chip at all. Mixing these up is the single most common way to lose
    twenty minutes — check the title bar if you're unsure which one you're editing.

### Step 5 — Stop something on purpose

Programs that run forever are normal in embedded work — a thermostat never "finishes." You need
a way to interrupt them.

Change the last part of your program to loop forever:

```python
while True:
    print("Still here!")
    time.sleep(1)
```

Run it. It never stops. Now press **Ctrl-C** in the Shell.

That's a **KeyboardInterrupt**. Get comfortable with it — you'll use it in almost every lab.

## Expected Output

```
Hello from a $5 computer!
This chip is a Raspberry Pi Pico 2.
Counting: 1
Counting: 2
Counting: 3
Counting: 4
Counting: 5
Done! Nothing exploded.
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No device in Thonny's interpreter list | Cable is charge-only | Swap for a cable that carries data — this is the #1 problem |
| `RP2350` drive never appears | BOOTSEL not held while plugging in | Unplug, hold the button *first*, then plug in |
| Shell shows nothing at all | Wrong interpreter selected | Tools → Options → Interpreter → MicroPython (Raspberry Pi Pico) |
| "Device is busy" | A program is still running | Press Ctrl-C, or click the red Stop button |
| Edits vanished after unplugging | You edited the copy on your computer | Reopen the file from the **Raspberry Pi Pico** half of the Files panel |
| Files panel is missing | Panel hidden | **View → Files** |

## Challenges

1. **Make it yours.** Change the message and the count. Can you make it count backwards?
2. **Do some math.** In the REPL, ask the chip for `2 ** 100`. It handles integers of any size.
   Now try `1 / 3` and look closely at the digits — we'll come back to that in Lab 10.
3. **Explore.** Type `help()` in the REPL, then `help('modules')` to see what's aboard.

## Check Your Understanding

1. What's the difference between typing code in the Shell and saving it as a program?
2. Your program disappeared when you unplugged the Pico. What most likely happened?
3. What does Ctrl-C do, and why do you need it more on a microcontroller than on a laptop?
4. Name one thing MicroPython has that desktop Python doesn't, and one thing it lacks.

!!! mascot-celebration "You're on frequency"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just ran code on a computer smaller than a stick of gum. Next lab we make it do
    something you can *see* from across the room.

---

**Next:** [Lab 2: Blink — Your First Hardware Program](../02-blink/index.md)
