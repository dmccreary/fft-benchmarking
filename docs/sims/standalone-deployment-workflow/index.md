---
title: Standalone Deployment Workflow
description: The ordered steps from code that only runs under Thonny to code that autoruns on power-up, with the mistake most often made at each step.
image: /sims/standalone-deployment-workflow/standalone-deployment-workflow.png
og:image: /sims/standalone-deployment-workflow/standalone-deployment-workflow.png
twitter:image: /sims/standalone-deployment-workflow/standalone-deployment-workflow.png
social:
   cards: false
status: implemented
library: vis-network
bloom_level: Understand
---

# Standalone Deployment Workflow

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Standalone Deployment Workflow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/standalone-deployment-workflow/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

"It works in Thonny but does nothing when I plug it into a battery" is the single
most common deployment complaint, and it is almost always one of three skipped
steps.

What makes it hard to debug is that all three failures are **silent**. When the
board runs standalone there is no Shell, so there is no traceback. The board
powers up, hits an `ImportError` or finds no `main.py` at all, and simply sits
there looking broken.

This diagram lays the process out as six ordered steps. Steps 1-4 happen while
the computer is still attached (blue); steps 5-6 are the standalone test (green).
Press **Common failures** to flag the three steps that fail silently.

## How to Use

1. Read the six steps in order and summarize the sequence in your own words
   before clicking anything.
2. Click each step to see what it accomplishes, the exact `mpremote` or Thonny
   command, and the mistake most often made there.
3. Press **Common failures**. Three steps get flagged. Click each flagged step
   and note that all three produce the same symptom: nothing happens on power-up.
4. Work the diagnosis backwards. Given "the board does nothing on power-up",
   which step would you check first, and why?

## The Three Silent Failures

| Step | The mistake | The symptom |
|------|-------------|-------------|
| 2. Copy drivers to /lib | Driver left on the laptop | `ImportError`, invisible |
| 3. Copy config.py to root | Copied to /lib, or forgotten | `ImportError`, invisible |
| 4. Save as main.py | Saved as any other filename | Never runs at all |

MicroPython autoruns exactly one filename after `boot.py`: `main.py`. Not
`blink.py`, not `fft_demo.py`. This trips up nearly everyone once.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- Have run a program from Thonny with the board attached
- Know that `import` looks for a module by name

### Learning Objective

Students will be able to **summarize** the correct order of steps required to
move from "code that only runs while Thonny is attached" to "code that runs
standalone on power-up", and **diagnose** which step was skipped when standalone
operation fails.

### Activities

1. **Order the steps** (3 min): With the diagram hidden, students list the steps
   from memory, then check against the sim.
2. **Failure triage** (4 min): The instructor describes three symptoms; students
   name the step responsible for each.
3. **Deploy for real** (3 min): Students carry out the sequence on their own
   board and confirm standalone operation on USB power.

### Assessment

Ask: "Your program uses `ssd1306.py` and runs fine under Thonny. You copy it to
the board as `display_demo.py`, unplug, and power from a battery. Nothing
happens. Name every step that could be responsible and how you would tell them
apart."

## Related Resources

- [Chapter 3: Peripherals](../../chapters/03-peripherals/index.md)

## References

1. [MicroPython on the Raspberry Pi Pico](https://docs.micropython.org/en/latest/rp2/quickref.html) — boot sequence and filesystem layout.
2. [mpremote documentation](https://docs.micropython.org/en/latest/reference/mpremote.html) — the `cp` command used to copy files to the device.
