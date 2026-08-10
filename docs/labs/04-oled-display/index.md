# Lab 4: The OLED Display

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 3](../03-know-your-board/index.md)  |  **Hardware:** Pico 2, SSD1306 OLED, breadboard, jumper wires

!!! mascot-welcome "Time to give your chip a face"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Up to now everything has happened in a text console on your laptop. After this lab
    your Pico can *show* you things on its own. Every spectrum, meter and tuner we build
    later lands on this little screen. Time to transform!

## What You'll Build

Text, pixels, lines, boxes, and a sweeping animated bar — all on a 128×64 OLED that your Pico
drives directly. You'll also meet `config.py`, the single file that describes your whole kit.

## Learning Objectives

- **Wire** an SPI display to the Pico 2 correctly
- **Explain** what SPI is and what the chip-select line does
- **Draw** text and shapes using pixel coordinates
- **Describe** why nothing appears until you call `show()`
- **Use** a shared configuration module instead of hard-coded pin numbers

## Concepts Introduced

| ID | Concept |
|---|---|
| 229 | Serial Peripheral Interface |
| 230 | SPI Clock And Data |
| 231 | Chip Select Line |
| 232 | Display Driver Chip |
| 233 | SSD1306 Controller |
| 234 | Framebuffer |
| 235 | Monochrome Display |
| 236 | Pixel Coordinates |
| 237 | Text Rendering |
| 238 | Display Refresh |
| 239 | Shared Configuration Module |

## Background

### SPI: a conversation with a clock

Your Pico talks to the display over **SPI** — Serial Peripheral Interface. Three ideas cover it:

- **Clock (SCL)** — a pin the Pico wiggles up and down to set the pace. Every tick means "here
  comes one bit."
- **Data (SDA)** — the bits themselves, one per clock tick.
- **Chip select (CS)** — "I'm talking to *you* now." Several devices can share the same clock
  and data wires; CS decides which one is listening.

Two extra wires here are specific to this display: **DC** (is this byte a command or picture
data?) and **RES** (reset).

### The framebuffer: draw first, show later

The display has its own memory. Your drawing commands don't touch the glass — they fill a
**framebuffer** in the Pico's RAM. Only `oled.show()` ships that buffer over SPI.

That's not an inconvenience, it's the point. Drawing pixel by pixel directly onto a screen
produces flicker and tearing. Building a complete picture and then sending it all at once
produces a clean frame.

!!! mascot-thinking "One bit per pixel"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    This screen is **monochrome** — each pixel is on or off, no grey. 128 × 64 = 8,192
    pixels, one bit each, so the whole framebuffer is just **1,024 bytes**. Your Pico has
    ~485 KB of RAM. We can afford a lot of frames.

## Wiring

| Display pin | Pico 2 GPIO | Purpose |
|---|---|---|
| VCC | 3V3 (pin 36) | power |
| GND | GND (pin 38) | ground |
| SCL / CLK | **GPIO 2** | SPI clock |
| SDA / MOSI | **GPIO 3** | SPI data |
| RES | **GPIO 4** | reset |
| DC | **GPIO 5** | data/command |
| CS | **GPIO 6** | chip select |

!!! mascot-warning "3.3 V only"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Connect VCC to **3V3**, never to VBUS or the 5 V rail. The Pico's GPIO pins are 3.3 V
    parts and 5 V can damage them permanently. Double-check this wire before you plug the
    USB cable in — it's the one mistake that costs money rather than time.

## Procedure

### Step 1 — Meet `config.py`

Open `config.py` on the Pico. It holds every pin number for the entire kit:

```python
SCL_PIN = 2
SDA_PIN = 3
RES_PIN = 4
DC_PIN = 5
CS_PIN = 6
```

…plus helper functions like `init_display()`.

Why bother? Because the previous version of this course *didn't*. Pin numbers were copy-pasted
into every lab file, and over time they drifted apart. Labs stopped working with no error
message — just a blank screen. One file, one truth, no drift.

From here on, every lab starts with `import config`.

### Step 2 — Run the display demo

Open `04-oled-display.py` from the Pico and run it:

```python
--8<-- "docs/labs/04-oled-display/code/04-oled-display.py"
```

You should see four scenes: a greeting, four corner dots, some shapes, then a sweeping bar.

### Step 3 — Understand the coordinate system

Look at the corners scene. `(0, 0)` is the **top-left**, and **y increases downward**.

```
(0,0) ─────────────► x increases
  │
  │        128 × 64
  │
  ▼
y increases
```

That downward y trips up everyone who remembers graphs from maths class. It comes from how
screens are scanned — top row first.

### Step 4 — The draw cycle

Every animation in this course is the same four steps:

```python
oled.fill(config.BLACK)      # 1. clear the buffer
oled.text("Hi", 0, 0, 1)     # 2. draw into the buffer
oled.fill_rect(0, 30, w, 16, 1)
oled.show()                  # 3. send it to the glass
time.sleep(0.02)             # 4. pause, then repeat
```

Try deleting the `oled.fill(config.BLACK)` line from the bar demo and running it again. The
bars pile up on top of each other because nothing ever clears. That's what "clear the buffer"
buys you.

!!! mascot-tip "Text is 8 pixels wide, 8 tall"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Each character occupies an 8×8 box. So 128 ÷ 8 = **16 characters per line**, and
    64 ÷ 8 = **8 lines**. Want text right-aligned? `x = 128 - len(text) * 8`. You'll use
    that formula for the frequency readout in Lab 23.

## Expected Output

The Shell prints:

```
Drawing a bar sweep. Ctrl-C to stop early.
Done. The display keeps showing the last thing you drew,
even after the program ends -- it has its own memory.
```

…and the display cycles through the four scenes, ending on "Lab 4 done!". Notice the message
stays on screen after the program finishes — the display holds its own image.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Screen completely blank | Power or wiring | Check VCC → 3V3 and GND. Then check all five signal wires |
| `ImportError: no module named 'ssd1306'` | Driver not on the board | Re-run `upload-code.sh`; the driver goes to `/lib` |
| Garbled or shifted image | SCL and SDA swapped | SCL → GPIO 2, SDA → GPIO 3 |
| Drew something but nothing appeared | Forgot `show()` | Drawing fills a buffer; `show()` sends it |
| Image from an old program still showing | Working as designed | The display keeps its last frame. `oled.fill(0); oled.show()` clears it |
| Faint or flickering display | Loose breadboard connection | Press the wires home; jumper ends wear out |

## Challenges

1. **Bounce.** Make a small filled square travel across the screen and reverse when it hits an
   edge. Hint: keep an `x` and a `dx`, and flip `dx` at the boundaries.
2. **Text alignment.** Print a number in the bottom-right corner, right-aligned, so it stays
   tidy as the number grows from 1 digit to 4.
3. **Frame rate.** Count how many `show()` calls you can do in one second. (Use
   `time.ticks_ms()`.) Write the number down — in Lab 24 you'll find out whether drawing or
   the FFT is your bottleneck, and you'll need this.

## Check Your Understanding

1. What are the three essential SPI signals, and what does chip select do?
2. Why does nothing appear on screen until you call `show()`?
3. Where is pixel `(0, 0)`, and which direction does `y` grow?
4. How many characters fit on one line of this display, and why?
5. Why does every lab import `config` instead of writing pin numbers directly?

!!! mascot-celebration "Your chip has a face now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    That clear-draw-show loop you just ran? It's exactly the loop that will animate a live
    audio spectrum in Lab 21. Same four lines. Much better content.

---

**Next:** [Lab 5: Buttons and Interaction](../05-buttons/index.md)  |  **Previous:** [Lab 3](../03-know-your-board/index.md)
