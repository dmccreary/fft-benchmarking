# Lab 1: Hello World
#
# Your first program on the Raspberry Pi Pico 2.
# Run it with the green Run button in Thonny, and save it to the DEVICE
# (not your computer) when Thonny asks where to put it.

import sys
import time

print("Hello from a $5 computer!")
print("This chip is a " + sys.implementation._machine + ".")

# range(1, 6) counts 1, 2, 3, 4, 5 -- it stops *before* the second number.
for i in range(1, 6):
    print("Counting:", i)
    time.sleep(0.5)          # half a second, so you can watch it happen

print("Done! Nothing exploded.")
