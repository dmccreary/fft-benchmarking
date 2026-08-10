# Lab 2: Blink
#
# The "hello world" of hardware. If this works, your board is alive and you
# can control the physical world from Python.

from machine import Pin
import time

# GPIO 25 is wired to the little green LED on the Pico 2 board.
# Pin.OUT means "I want to drive this pin", not "read it".
led = Pin(25, Pin.OUT)

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
