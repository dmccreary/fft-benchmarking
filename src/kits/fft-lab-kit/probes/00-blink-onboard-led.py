# use this to test that the Pico is correctly connected to Thonny and running the MicroPython runtime.
from machine import Pin
import time

# Pin 25 is the onboard LED on a regular Raspberry Pi Pico
led = Pin(25, Pin.OUT)

while True:
    led.toggle()           # Switches LED on if off, or off if on
    time.sleep(0.25)       # Wait 0.25 seconds (half a full blink cycle)
