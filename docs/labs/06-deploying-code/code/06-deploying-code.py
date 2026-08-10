# Lab 6: Deploying Code and Libraries
#
# Where do your files live, how does `import` find them, and how do you make
# a program run without a laptop attached?
#
# This program answers all three by inspecting the board it is running on.

import config
import os
import sys

print("=== Where Python looks for modules ===")
# sys.path is the search list. '' means the current directory (the root of
# the device), and '/lib' is the conventional home for libraries.
for entry in sys.path:
    print("  ", repr(entry))

print()
print("=== What is in the root directory ===")
root = sorted(os.listdir("/"))
for name in root:
    info = os.stat("/" + name)
    # info[0] is the mode. The 0x4000 bit means "this is a directory".
    # Asking a directory for its size (info[6]) returns nonsense, so check
    # the mode first -- this is the kind of detail that makes a listing
    # either trustworthy or quietly wrong.
    if info[0] & 0x4000:
        print("  %-28s <dir>" % name)
    else:
        print("  %-28s %6d bytes" % (name, info[6]))

print()
print("=== What is in /lib ===")
try:
    for name in sorted(os.listdir("/lib")):
        print("  ", name)
except OSError:
    print("   (no /lib directory yet)")

print()
print("=== Proving the import worked ===")
# `import config` searched sys.path, found /config.py, and ran it.
# Everything defined in that file is now available with a config. prefix.
print("config module :", config.__name__)
print("display size  : %dx%d" % (config.WIDTH, config.HEIGHT))
print("mic pins      : SCK=%d WS=%d SD=%d" % (
    config.SCK_PIN, config.WS_PIN, config.SD_PIN))

print()
print("=== Storage ===")
fs = os.statvfs("/")
total = fs[0] * fs[2]
free = fs[0] * fs[3]
print("flash total : %.0f KB" % (total / 1024))
print("flash free  : %.0f KB" % (free / 1024))
print("used        : %.0f KB" % ((total - free) / 1024))

print()
print("=== Making it standalone ===")
if "main.py" in root:
    print("main.py EXISTS -- this board runs it automatically on power-up.")
else:
    print("No main.py yet. Create one and the board will run it every time")
    print("it powers on, with no computer attached. See the lab for how.")
