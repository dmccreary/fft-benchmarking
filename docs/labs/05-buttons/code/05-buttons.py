# Lab 5: Buttons and Interaction
#
# Two buttons, three modes, one counter. The interesting part is not reading
# a button -- it is reading it *correctly*.
#
# A mechanical switch does not close cleanly. Its contacts physically bounce
# apart and together again for a few milliseconds, so one press can look like
# five presses to a chip running at 150 MHz. Debouncing is how we ignore that.

import config
import time

oled = config.init_display()
button_a, button_b = config.init_buttons()

MODES = ["Count up", "Count down", "Count by 5"]
mode = 0
counter = 0

# Remember what each button looked like last time round the loop, so we can
# spot the *moment* it changes rather than the fact that it is held down.
last_a = button_a.value()
last_b = button_b.value()
last_press_ms = time.ticks_ms()

DEBOUNCE_MS = 50        # ignore changes closer together than this


def pressed(pin, last_value):
    """True on the falling edge: the moment the button goes 1 -> 0.

    PULL_UP means the pin sits at 1 and a press drags it to 0, so a press is
    a FALLING edge. This trips up nearly everyone the first time.
    """
    return last_value == 1 and pin.value() == 0


def draw():
    oled.fill(config.BLACK)
    oled.text("Lab 5: Buttons", 0, 0, config.WHITE)
    oled.hline(0, 10, config.WIDTH, config.WHITE)
    oled.text("Mode:", 0, 18, config.WHITE)
    oled.text(MODES[mode], 0, 30, config.WHITE)
    oled.text("Count: %d" % counter, 0, 46, config.WHITE)
    oled.text("A=mode B=go", 0, 56, config.WHITE)
    oled.show()


draw()
print("A changes mode, B applies it. Ctrl-C to stop.")

try:
    while True:
        now = time.ticks_ms()
        # Has enough time passed since the last accepted press?
        settled = time.ticks_diff(now, last_press_ms) > DEBOUNCE_MS

        if settled and pressed(button_a, last_a):
            mode = (mode + 1) % len(MODES)
            last_press_ms = now
            print("mode ->", MODES[mode])
            draw()

        if settled and pressed(button_b, last_b):
            if mode == 0:
                counter += 1
            elif mode == 1:
                counter -= 1
            else:
                counter += 5
            last_press_ms = now
            print("count ->", counter)
            draw()

        last_a = button_a.value()
        last_b = button_b.value()

        time.sleep_ms(5)      # polling every 5 ms is plenty for human fingers

except KeyboardInterrupt:
    oled.fill(config.BLACK)
    oled.text("Stopped.", 30, 28, config.WHITE)
    oled.show()
    print("Stopped.")
