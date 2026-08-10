# Lab 4: The OLED Display
#
# Draws text and shapes on the 128x64 OLED.
#
# Notice what is NOT in this file: pin numbers. They live in config.py, so
# this program cannot disagree with the next one about how the display is
# wired. That is the whole point of a shared config module.

import config
import time

oled = config.init_display()

# Everything you draw goes into a framebuffer in RAM first. Nothing appears
# on the glass until show() pushes that buffer out over SPI.
oled.fill(config.BLACK)
oled.text("Lab 4", 0, 0, config.WHITE)
oled.text("Hello, display!", 0, 12, config.WHITE)
oled.show()
time.sleep(2)

# --- pixel coordinates -----------------------------------------------------
# (0, 0) is the TOP-LEFT corner. x goes right, y goes DOWN. That y direction
# surprises everyone who remembers graphs from maths class.
oled.fill(config.BLACK)
oled.text("Corners:", 0, 0, config.WHITE)
oled.pixel(0, 0, config.WHITE)                                   # top-left
oled.pixel(config.WIDTH - 1, 0, config.WHITE)                    # top-right
oled.pixel(0, config.HEIGHT - 1, config.WHITE)                   # bottom-left
oled.pixel(config.WIDTH - 1, config.HEIGHT - 1, config.WHITE)    # bottom-right
oled.show()
time.sleep(2)

# --- lines and boxes -------------------------------------------------------
oled.fill(config.BLACK)
oled.text("Shapes", 0, 0, config.WHITE)
oled.hline(0, 10, config.WIDTH, config.WHITE)          # x, y, width
oled.rect(4, 16, 40, 20, config.WHITE)                 # outline
oled.fill_rect(52, 16, 40, 20, config.WHITE)           # solid
oled.line(0, 63, 127, 40, config.WHITE)                # x1, y1, x2, y2
oled.show()
time.sleep(2)

# --- an animated bar -------------------------------------------------------
# This is the shape of every meter we build later: clear, draw, show, repeat.
print("Drawing a bar sweep. Ctrl-C to stop early.")
try:
    for pass_num in range(3):
        for width in range(0, config.WIDTH + 1, 4):
            oled.fill(config.BLACK)
            oled.text("Bar demo", 0, 0, config.WHITE)
            oled.fill_rect(0, 30, width, 16, config.WHITE)
            oled.text("%d px" % width, 0, 52, config.WHITE)
            oled.show()
            time.sleep(0.02)
except KeyboardInterrupt:
    pass

oled.fill(config.BLACK)
oled.text("Lab 4 done!", 16, 28, config.WHITE)
oled.show()
print("Done. The display keeps showing the last thing you drew,")
print("even after the program ends -- it has its own memory.")
