# Lab 01: Hello World
# Confirms the OLED is wired correctly and MicroPython can run code on it.

import config

oled = config.init_display()

oled.fill(config.BLACK)
oled.text("Hello World!", 16, 28, config.WHITE)
oled.show()
