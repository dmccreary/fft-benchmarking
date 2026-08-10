# Hardware configuration for the OLED Two-Button Pico kit.
# Every numbered lab in this folder imports this file instead of repeating
# pin numbers, so the whole kit only needs to be described in one place.

from machine import Pin, SPI
import ssd1306

WIDTH = 128
HEIGHT = 64

# 2.42" SSD1306/SSD1309 SPI display
SCL_PIN = 2
SDA_PIN = 3
RES_PIN = 4
DC_PIN = 5
CS_PIN = 6

# Two momentary push buttons. Each button's other leg goes to GND, and
# PULL_UP holds the pin at 1 until a press pulls it to 0.
BUTTON_A_PIN = 14
BUTTON_B_PIN = 15

WHITE = 1
BLACK = 0
NO_FILL = 0
FILL = 1


def init_display():
    clock = Pin(SCL_PIN)
    data = Pin(SDA_PIN)
    res = Pin(RES_PIN)
    dc = Pin(DC_PIN)
    cs = Pin(CS_PIN)
    spi = SPI(0, sck=clock, mosi=data)
    return ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, dc, res, cs)


def init_buttons():
    button_a = Pin(BUTTON_A_PIN, Pin.IN, Pin.PULL_UP)
    button_b = Pin(BUTTON_B_PIN, Pin.IN, Pin.PULL_UP)
    return button_a, button_b
