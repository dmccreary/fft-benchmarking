# Lab 2: Blink
#
# The "hello world" of hardware. If this works, your board is alive and you
# can control the physical world from Python.

from machine import Pin
import time

# Where is the onboard LED? It depends on which board you have:
#
#   Pico 2    -> GPIO 25, an ordinary pin
#   Pico 2 W  -> not a GPIO at all. The wireless chip drives it, and
#                MicroPython exposes it under the name "LED".
#
# Asking for Pin(25) on a W board succeeds but lights nothing, which is a
# nasty way to lose an afternoon. So we ask for "LED" first and fall back.
try:
    led = Pin("LED", Pin.OUT)      # Pico 2 W and other wireless boards
except (ValueError, TypeError):
    led = Pin(25, Pin.OUT)         # plain Pico 2

# Pin.OUT means "I want to drive this pin", not "read it".

print("Blinking! Press Ctrl-C to stop.")

try:
    while True:
        led.value(1)         # 1 = on  (3.3 volts on the pin)
        time.sleep(0.5)
        led.value(0)         # 0 = off (0 volts)
        time.sleep(0.5)

except KeyboardInterrupt:
    # Ctrl-C lands here. Always leave the hardware in a tidy state.
    led.value(0)
    print("Stopped. LED off.")
