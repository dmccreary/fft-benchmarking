# Lab 5: Buttons and Interaction

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 4](../04-oled-display/index.md)  |  **Hardware:** Pico 2, OLED, two push buttons

!!! mascot-welcome "Now it can listen to your fingers"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your Pico can show you things. Now let's let you talk back. Reading a button sounds
    trivial — and then you discover that one press can register as five. Let's tune in.

## What You'll Build

A three-mode counter you drive with two buttons: one cycles the mode, the other applies it.
Along the way you'll meet the sneakiest bug in embedded programming — switch bounce.

## Learning Objectives

- **Wire** a push button using an internal pull-up resistor
- **Explain** why a pressed button reads `0` and not `1`
- **Describe** switch bounce and why it breaks naive code
- **Implement** debouncing with a time window
- **Detect** the *moment* a button is pressed rather than whether it's held
- **Build** an event loop that switches between modes

## Concepts Introduced

| ID | Concept |
|---|---|
| 240 | Digital Input |
| 241 | Pull Up Resistor |
| 242 | Active Low Logic |
| 243 | Switch Bounce |
| 244 | Debouncing |
| 245 | Polling Loop |
| 246 | Edge Detection |
| 247 | Event Loop |
| 248 | Mode Switching |

## Background

### A floating pin is a liar

An input pin not connected to anything doesn't read `0`. It reads *whatever the nearby
electrical noise says*, flickering randomly. That's a **floating** pin.

The fix is a **pull-up resistor**: a gentle connection to 3.3 V that holds the pin at `1`
whenever nothing else is driving it. The Pico has these built in — `Pin.PULL_UP` switches one
on.

So we wire each button between its pin and **ground**:

| Button state | Pin connected to | Reads |
|---|---|---|
| not pressed | pull-up → 3.3 V | **1** |
| pressed | ground | **0** |

That's **active low**: pressed is `0`. Backwards from intuition, universal in practice.

### Switch bounce: one press, many presses

Here's the part that surprises people. A button is two pieces of metal springing together. For
a few milliseconds after contact they physically bounce apart and back:

```
button pressed here
        ↓
   1 ───┐ ┌─┐ ┌───────────  ← electrically, this is what the pin sees
        └─┘ └─┘
   0        ↑
        bouncing
```

Your finger felt one press. Your Pico, checking millions of times a second, saw five.

!!! mascot-thinking "Why software fixes a hardware problem"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    You *could* fix bounce with a capacitor. But bounce settles within about 20 ms, and
    no human presses a button twice in 20 ms — so we just ignore any change that arrives
    too soon after the last one. Free, adjustable, no extra parts. **Debouncing.**

### Edges, not levels

There's a difference between "is the button down?" and "did the button just go down?"

If your loop runs 200 times a second and you check *level*, holding the button for one second
counts 200 presses. You want the **edge** — the single moment it changed from `1` to `0`.

You detect that by remembering what it looked like last time:

```python
def pressed(pin, last_value):
    return last_value == 1 and pin.value() == 0
```

## Wiring

Each button connects its GPIO pin to **GND**. No resistor needed — the pull-up is internal.

| Button | GPIO | Other leg |
|---|---|---|
| A | **14** | GND |
| B | **15** | GND |

A typical 4-pin tactile switch connects pins diagonally. If it seems permanently pressed, rotate
it 90°.

## Procedure

### Step 1 — Watch a button, raw

Before running the full lab, try this in the REPL:

```python
import config
a, b = config.init_buttons()
a.value()          # 1 when you're not touching it
```

Hold the button down and run `a.value()` again. It reads `0`. That's active low, live.

### Step 2 — Run the lab

Open `05-buttons.py` and run it:

```python
--8<-- "docs/labs/05-buttons/code/05-buttons.py"
```

- **Button A** cycles: Count up → Count down → Count by 5
- **Button B** applies the current mode to the counter

### Step 3 — Break it on purpose

Find this line and change the value to `0`:

```python
DEBOUNCE_MS = 50        # try 0
```

Run it again and press B once. Watch the counter jump by 2, 3, or more. **That's bounce**, and
you just saw it with your own eyes.

Now put it back to `50`. Try `5`. Try `200` — notice the button starts feeling sluggish and
ignores fast presses. Debounce timing is a real tradeoff, not a magic number.

!!! mascot-encourage "If your counter jumps around, you haven't failed"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    You've reproduced a bug that has shipped in real products. Seeing it deliberately, in a
    lab where nothing's at stake, is much nicer than discovering it in week ten of a project.

### Step 4 — Levels versus edges

Replace the edge test with a level test:

```python
if settled and button_b.value() == 0:      # level, not edge
```

Hold B down. The counter runs away. Restore the `pressed()` version and it takes one press per
count. That's the difference an edge makes.

## Expected Output

The display shows mode and count; the Shell logs each accepted press:

```
A changes mode, B applies it. Ctrl-C to stop.
count -> 1
count -> 2
mode -> Count by 5
count -> 7
mode -> Count down
count -> 6
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Reads `0` constantly | Button orientation | Rotate the switch 90°; pins connect diagonally |
| Reads `1` always | Not reaching ground | Check the wire from the button's other leg to GND |
| Counter jumps several per press | Debounce too short | Raise `DEBOUNCE_MS` toward 50 |
| Have to press very deliberately | Debounce too long | Lower `DEBOUNCE_MS` toward 30 |
| Counter races while held | Testing level, not edge | Use the `pressed()` edge helper |
| Nothing on screen | Display issue, not buttons | Re-check [Lab 4](../04-oled-display/index.md) |

## Challenges

1. **Long press.** Detect a button held for more than one second and use it to reset the
   counter to zero. Hint: record the time on the falling edge, check on the rising one.
2. **Both at once.** Make pressing A *and* B together do something distinct.
3. **A real menu.** Use A to move a `>` cursor down a list of three items and B to select. This
   is the pattern you'll want in Lab 24 to switch display modes on a live analyzer.

## Check Your Understanding

1. Why does a pressed button read `0` instead of `1`?
2. What would happen with no pull-up resistor at all?
3. Describe switch bounce and one way to handle it.
4. What's the difference between edge detection and level detection, and when does it matter?
5. Why is a 50 ms debounce window reasonable — what sets the upper and lower bounds?

!!! mascot-celebration "You've got input and output now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Screen, buttons, and a chip that knows itself. One more setup lab and then — my
    favourite part — we plug in ears.

---

**Next:** [Lab 6: Deploying Code and Libraries](../06-deploying-code/index.md)  |  **Previous:** [Lab 4](../04-oled-display/index.md)
