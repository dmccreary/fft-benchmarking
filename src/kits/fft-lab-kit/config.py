# Hardware configuration for the FFT lab kit.
# Every numbered lab in this course imports this file instead of repeating
# pin numbers, so the whole kit only needs to be described in one place.

from machine import Pin, SPI, I2S
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

# I2S configuration for INMP441 microphone
SCK_PIN = 10  # Serial Clock
WS_PIN = 11   # Word Select
SD_PIN = 12   # Serial Data

# The INMP441 sends 24 real bits of audio inside a 32-bit word, so we read
# 32-bit samples and shift right by 8 to recover the value.
I2S_ID = 0
SAMPLE_BITS = 32
SAMPLE_RATE = 12800
AUDIO_BUFFER_BYTES = 40000

# 512 samples at 12800 Hz is exactly 40 ms of sound per frame.
FFT_SIZE = 512

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


def init_microphone(rate=SAMPLE_RATE):
    sck = Pin(SCK_PIN)
    ws = Pin(WS_PIN)
    sd = Pin(SD_PIN)
    return I2S(I2S_ID, sck=sck, ws=ws, sd=sd, mode=I2S.RX,
               bits=SAMPLE_BITS, format=I2S.MONO, rate=rate,
               ibuf=AUDIO_BUFFER_BYTES)
