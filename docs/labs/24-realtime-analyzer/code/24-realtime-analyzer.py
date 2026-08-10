# Lab 24: Real-Time Spectrum Analyzer
#
# The full pipeline, running continuously, with a stopwatch on every stage:
#
#     capture  ->  window  ->  FFT  ->  magnitudes  ->  draw
#
# Timing the whole loop tells you the frame rate. Timing each STAGE tells
# you what to fix. Those are different questions, and only the second one
# is actionable.
#
# Most people assume the FFT dominates. Measure before you believe it.

import config
import math
import struct
import time
from fftlab import FFT

N = 256
RATE = config.SAMPLE_RATE
BIN_HZ = RATE / N
FRAME_MS = N / RATE * 1000        # how much sound one frame represents

BARS = 32
BAR_W = config.WIDTH // BARS
TOP = 14
BAR_H = config.HEIGHT - TOP - 10

fft = FFT(N)
WINDOW = [0.5 - 0.5 * math.cos(2 * math.pi * i / (N - 1)) for i in range(N)]

oled = config.init_display()
mic = config.init_microphone()
raw = bytearray(N * 4)
re, im = fft.buffers()

for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)

# Accumulators, in microseconds.
t_capture = 0
t_window = 0
t_fft = 0
t_mag = 0
t_draw = 0
frames = 0

REPORT_EVERY = 20

print("=== Real-time spectrum analyzer ===")
print("N = %d, bin width = %.0f Hz" % (N, BIN_HZ))
print("one frame of audio = %.1f ms" % FRAME_MS)
print()
print("Timing every stage. Ctrl-C to stop.")
print()

try:
    while True:
        # --- capture ------------------------------------------------------
        t0 = time.ticks_us()
        n = mic.readinto(raw)
        words = struct.unpack("<%di" % (n // 4), raw[:n])
        t1 = time.ticks_us()

        # --- remove DC and apply the window --------------------------------
        count = min(N, len(words))
        total = 0
        for i in range(count):
            total += words[i] >> 8
        dc = total / count
        for i in range(count):
            re[i] = ((words[i] >> 8) - dc) * WINDOW[i]
            im[i] = 0.0
        for i in range(count, N):
            re[i] = 0.0
            im[i] = 0.0
        t2 = time.ticks_us()

        # --- the transform -------------------------------------------------
        fft.run(re, im)
        t3 = time.ticks_us()

        # --- magnitudes ----------------------------------------------------
        mags = fft.fast_magnitudes(re, im)
        t4 = time.ticks_us()

        # --- draw ----------------------------------------------------------
        usable = N // 2
        per_bar = usable // BARS
        heights = []
        biggest = 1.0
        for b in range(BARS):
            s = 0.0
            for k in range(b * per_bar, (b + 1) * per_bar):
                if mags[k] > s:
                    s = mags[k]
            heights.append(s)
            if s > biggest:
                biggest = s

        oled.fill(config.BLACK)
        oled.text("spectrum", 0, 0, config.WHITE)
        oled.hline(0, 11, config.WIDTH, config.WHITE)
        for b, h in enumerate(heights):
            px = int(math.sqrt(h / biggest) * BAR_H)
            if px > 0:
                oled.fill_rect(b * BAR_W, TOP + BAR_H - px, BAR_W - 1, px,
                               config.WHITE)
        oled.show()
        t5 = time.ticks_us()

        t_capture += time.ticks_diff(t1, t0)
        t_window += time.ticks_diff(t2, t1)
        t_fft += time.ticks_diff(t3, t2)
        t_mag += time.ticks_diff(t4, t3)
        t_draw += time.ticks_diff(t5, t4)
        frames += 1

        if frames % REPORT_EVERY == 0:
            total_us = t_capture + t_window + t_fft + t_mag + t_draw
            per_frame = total_us / frames
            fps = 1e6 / per_frame

            print("--- after %d frames ---" % frames)
            print("%-12s %10s %8s" % ("stage", "us/frame", "share"))
            for label, acc in (("capture", t_capture), ("window+DC", t_window),
                               ("FFT", t_fft), ("magnitudes", t_mag),
                               ("draw", t_draw)):
                us = acc / frames
                print("%-12s %10.0f %7.0f%%" % (label, us, 100 * acc / total_us))
            print("%-12s %10.0f" % ("TOTAL", per_frame))
            print("frame rate  : %.1f fps" % fps)
            print("audio frame : %.1f ms   pipeline: %.1f ms" %
                  (FRAME_MS, per_frame / 1000))
            if per_frame / 1000 > FRAME_MS:
                print("VERDICT     : NOT real time -- over budget by %.1fx"
                      % (per_frame / 1000 / FRAME_MS))
            else:
                print("VERDICT     : real time, with %.1f ms to spare"
                      % (FRAME_MS - per_frame / 1000))
            print()

except KeyboardInterrupt:
    mic.deinit()
    oled.fill(config.BLACK)
    oled.text("Stopped.", 32, 28, config.WHITE)
    oled.show()

    if frames:
        total_us = t_capture + t_window + t_fft + t_mag + t_draw
        print()
        print("=== Final report over %d frames ===" % frames)
        stages = (("capture", t_capture), ("window+DC", t_window),
                  ("FFT", t_fft), ("magnitudes", t_mag), ("draw", t_draw))
        worst = max(stages, key=lambda s: s[1])
        for label, acc in stages:
            print("  %-12s %8.0f us  %5.1f%%"
                  % (label, acc / frames, 100 * acc / total_us))
        print()
        print("Biggest cost: %s at %.0f%% of the frame."
              % (worst[0], 100 * worst[1] / total_us))
        print()
        print("If you want this faster, that is where to spend your effort.")
        print("Optimising anything else is rearranging deck chairs.")
