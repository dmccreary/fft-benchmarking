# Lab 6: Deploying Code and Libraries

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 5](../05-buttons/index.md)  |  **Hardware:** Pico 2, OLED, buttons

!!! mascot-welcome "Let's cut the cord"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    So far your Pico has needed a laptop the way a puppet needs a hand. By the end of this
    lab it runs on its own from a phone charger. Time to transform!

## What You'll Build

A program that inspects the board's own filesystem and import machinery — then a `main.py` that
makes your Pico run standalone, no computer attached.

## Learning Objectives

- **Explain** how `import` finds a module, using `sys.path`
- **Describe** what `/lib` is for and why drivers live there
- **List** and inspect files on the device filesystem
- **Create** a `main.py` that runs automatically at power-up
- **Recover** a board whose `main.py` misbehaves

## Concepts Introduced

| ID | Concept |
|---|---|
| 249 | File Transfer To Device |
| 250 | mpremote Tool |
| 251 | Library Directory |
| 252 | Import Path |
| 253 | Module Import |
| 254 | Autorun main.py |
| 255 | Standalone Operation |
| 256 | Code Organization |

## Background

### How `import` actually works

When you write `import config`, MicroPython walks a list of places called `sys.path`, in order,
looking for `config.py`. On your board that list is:

```python
['', '.frozen', '/lib']
```

| Entry | Meaning |
|---|---|
| `''` | the device's root directory |
| `.frozen` | modules baked into the firmware itself |
| `/lib` | the conventional home for libraries |

So `import config` finds `/config.py`, and `import ssd1306` finds `/lib/ssd1306.py`. Nothing
mysterious — just a search through three folders.

### Two filesystems, easily confused

Thonny's Files panel shows your computer on top and the Pico underneath. A file open from your
laptop doesn't exist on the chip at all. This is the single most common way to lose twenty
minutes in this course.

!!! mascot-tip "How this course puts code on your board"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    All 35 labs' code is pre-loaded for you, using `upload-code.sh` in the kit directory.
    It uses a tool called **mpremote** — the command-line way to talk to a Pico. If you ever
    need to reset your board to a clean state, that script is how.

### `main.py`: the autorun file

Two filenames are special to MicroPython:

| File | When it runs |
|---|---|
| `boot.py` | first, at power-up — for low-level setup |
| `main.py` | immediately after, every power-up |

Put your program in `main.py` and the board becomes an appliance. Plug it into a USB charger
and it just works.

## Procedure

### Step 1 — Inspect your board

Open `06-deploying-code.py` and run it:

```python
--8<-- "docs/labs/06-deploying-code/code/06-deploying-code.py"
```

It prints `sys.path`, lists the root directory and `/lib`, proves `import config` worked, and
reports your flash usage.

### Step 2 — Trace an import yourself

In the REPL:

```python
import sys
sys.path                    # where Python will look
import config
config.__name__             # 'config'
config.SCK_PIN              # 10 -- came from /config.py
import ssd1306
ssd1306.__name__            # found in /lib
```

You've just followed the search path by hand.

### Step 3 — Go standalone

Look at `main.py.example`:

```python
--8<-- "docs/labs/06-deploying-code/code/main.py.example"
```

Copy it to your Pico and rename it to **`main.py`**. Then unplug the board from your computer
and plug it into a phone charger.

It runs. No laptop. That's an embedded product.

!!! mascot-warning "Always leave yourself an escape hatch"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Notice the three-second delay at the top of `main.py` before anything else happens. A
    `main.py` that jumps straight into a tight loop can make the board hard to interrupt —
    it's busy running your program before you can get a word in. That delay is your window
    to press Ctrl-C. Put one in every `main.py` you write.

### Step 4 — Rescue a board

If a `main.py` ever locks you out:

1. Connect in Thonny and press **Ctrl-C** repeatedly while it boots.
2. If that fails, delete the file over the REPL:
   ```python
   import os
   os.remove('main.py')
   ```
3. Last resort: hold **BOOTSEL** while plugging in and re-flash MicroPython. This erases
   everything — you'd re-run `upload-code.sh` afterwards.

Knowing step 3 exists is what lets you experiment fearlessly.

## Expected Output

```
=== Where Python looks for modules ===
   ''
   '.frozen'
   '/lib'

=== What is in the root directory ===
  01-hello-world.py               552 bytes
  ...
  config.py                      1656 bytes
  lib                          <dir>

=== What is in /lib ===
   ssd1306.py

=== Proving the import worked ===
config module : config
display size  : 128x64
mic pins      : SCK=10 WS=11 SD=12

=== Storage ===
flash total : 3072 KB
flash free  : 2584 KB
used        : 488 KB

=== Making it standalone ===
No main.py yet. Create one and the board will run it every time
it powers on, with no computer attached. See the lab for how.
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ImportError: no module named 'config'` | File is on your laptop, not the Pico | Check the **Raspberry Pi Pico** half of the Files panel |
| `ImportError: no module named 'ssd1306'` | Driver missing from `/lib` | Re-run `upload-code.sh` |
| `main.py` won't stop | No escape hatch | Ctrl-C during boot, or `os.remove('main.py')` |
| Board seems bricked | Bad `main.py` | BOOTSEL + re-flash, then re-upload |
| Edits keep disappearing | Editing the laptop copy | Reopen from the Pico side |
| Changed a module but behaviour is stale | Module already imported | Soft-reset (Ctrl-D) — imports are cached |

## Challenges

1. **Make your own library.** Write `mymath.py` with a function, put it in `/lib`, and import it
   from a separate program. You've just built a reusable module.
2. **Boot counter.** Have `main.py` read a count from a file, add one, display it, and write it
   back. Now your board remembers across power cycles.
3. **Button-selected startup.** Have `main.py` check whether button A is held at boot, and run a
   different program if it is. That's a genuinely useful pattern for a shipped device.

## Check Your Understanding

1. What does `sys.path` contain, and in what order is it searched?
2. Why do drivers go in `/lib` rather than the root?
3. What's the difference between `boot.py` and `main.py`?
4. Why should every `main.py` start with a delay?
5. Your edits vanish each time you unplug. What's the most likely cause?

!!! mascot-celebration "Setup complete — now the fun starts"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Screen, buttons, standalone operation, and a chip that knows its own name. That's the
    entire foundation. **Next lab we plug in a microphone** — and everything after that is
    about turning sound into insight. Now *that's* a superpower.

---

**Next:** [Lab 7: Your First Sound Capture](../07-first-sound/index.md)  |  **Previous:** [Lab 5](../05-buttons/index.md)
