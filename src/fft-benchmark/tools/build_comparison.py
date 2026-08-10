#!/usr/bin/env python3
"""Turn the device's variant-results.csv into a readable comparison report.

Runs on the host. Reads outputs/variant-results.csv (captured from the Pico)
and writes outputs/variant-comparison.md.

Deliberately reports speed, accuracy AND the caveats together. A table of
cycle counts alone would rank V6 last and V7 near the bottom without
explaining that V6's kernel is the fastest of all and that V7's ceiling was
predicted to be small. A benchmark that ranks without explaining teaches
students to optimize the number rather than understand the machine.
"""

import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUTPUTS = os.path.join(ROOT, "outputs")

CLOCK_HZ = 150000000.0

# Per-variant interpretation. Keyed by variant name.
NOTES = {
    "v0": "Reference point. Radix-2 DIT, split buffers, generic stages throughout.",
    "v2": "Algorithmic win: transforms 512 real samples via a 256-point complex FFT. "
          "Does roughly half the butterflies, but pays an O(n) split step that eats "
          "part of the saving.",
    "v9": "All the compatible wins stacked. Deliberately excludes V6, whose layout "
          "conversion would cost more than it saves.",
    "v1": "Stages 1 and 2 have twiddles of (1,0) and (0,-1), so their butterflies need "
          "no multiplier at all -- just adds, subtracts and a sign flip.",
    "v4": "Bit-reversal walking a precomputed swap list instead of testing all 512 "
          "indices. Removes an unpredictable data-dependent branch.",
    "v6": "The interleaved KERNEL is the fastest measured (1.28x vs V0), but converting "
          "between split and interleaved layout costs ~95% of the run. Net: 15x slower. "
          "Worth it only if your data arrives interleaved already.",
    "v7": "Uses VFMA, an instruction MicroPython's assembler does not support, emitted "
          "as hand-encoded machine words. Proves the technique works; the speedup is "
          "near zero because arithmetic was never the bottleneck.",
    "v3-viper": "Viper types integers natively but has no float pointer type, so the FFT's "
                "float work stays boxed. Barely faster than @native.",
    "v3-native": "Compiles bytecode to machine code, removing interpreter dispatch, but "
                 "values remain MicroPython objects.",
    "v3-python": "No acceleration. Same algorithm, same operation count as V0.",
}

ORDER = ["v9", "v2", "v1", "v4", "v7", "v0", "v6", "v3-viper", "v3-native", "v3-python"]


def read_results():
    path = os.path.join(OUTPUTS, "variant-results.csv")
    rows = {}
    with open(path) as f:
        next(f)
        for line in f:
            line = line.strip()
            if not line:
                continue
            # label may contain commas, so split from both ends
            parts = line.split(",")
            name = parts[0]
            err = float(parts[-1])
            sd = float(parts[-2])
            mean = float(parts[-3])
            best = int(parts[-4])
            label = ",".join(parts[1:-4])
            rows[name] = {"name": name, "label": label, "best": best,
                          "mean": mean, "sd": sd, "err": err}
    return rows


def main():
    rows = read_results()
    base = rows["v0"]["best"]

    lines = []
    lines.append("# FFT Variant Comparison\n")
    lines.append("Competing 512-point FFT implementations measured on a Raspberry Pi Pico 2 "
                 "(RP2350, Cortex-M33 r1p0 @ 150 MHz, MicroPython v1.28.0).\n")
    lines.append("All variants ran the same 10 test signals under identical conditions: one "
                 "discarded warm-up per signal, then up to 15 timed trials, timed with the "
                 "DWT cycle counter.\n")

    lines.append("## Results\n")
    lines.append("| Variant | Best cycles | Mean | Std dev | µs | Speedup | Max err vs V0 |")
    lines.append("|---------|------------:|-----:|--------:|---:|--------:|--------------:|")
    for name in ORDER:
        if name not in rows:
            continue
        r = rows[name]
        us = r["mean"] / CLOCK_HZ * 1e6
        speed = base / r["best"]
        errtxt = "exact" if r["err"] == 0.0 else "%.1e" % r["err"]
        lines.append("| **%s** %s | %d | %d | %.0f | %.1f | **%.2fx** | %s |" % (
            name, r["label"], r["best"], int(r["mean"]), r["sd"], us, speed, errtxt))

    lines.append("\n## What each result means\n")
    for name in ORDER:
        if name not in rows:
            continue
        lines.append("**%s — %s**  \n%s\n" % (name, rows[name]["label"],
                                              NOTES.get(name, "")))

    # ---- analysis -----------------------------------------------------
    lines.append("## Findings\n")

    v9 = rows["v9"]["best"]
    composed = 1.0
    for n in ("v2", "v1", "v4", "v7"):
        composed *= base / rows[n]["best"]
    lines.append("### Optimizations compose, but sub-linearly\n")
    lines.append("Multiplying the individual speedups of V2, V1, V4 and V7 predicts "
                 "**%.2fx**; the combined V9 actually delivers **%.2fx**. They stack well "
                 "because they attack different costs, but V1 and V7 partially overlap — "
                 "V1 deletes the very multiplications V7 would have fused.\n" % (
                     composed, base / v9))

    lines.append("### The predicted small win was even smaller\n")
    lines.append("Plan 02 predicted VFMA would yield 5–7%%, reasoning that it removes only "
                 "2 instructions from a ~28-instruction butterfly. Measured: **%.1f%%**. "
                 "Loop control, address arithmetic and memory access dominate so thoroughly "
                 "that removing arithmetic barely registers. The prediction was directionally "
                 "right and still too optimistic.\n" % ((base / rows["v7"]["best"] - 1) * 100))

    lines.append("### Compiled Python is not fast Python\n")
    py = rows["v3-python"]["best"]
    lines.append("`@micropython.native` gives %.2fx over plain Python and `@micropython.viper` "
                 "%.2fx — both far short of assembly's **%.0fx**. The reason is specific and "
                 "worth teaching: viper's native types are integer types. It has `ptr32` but no "
                 "float pointer, so an FFT's float arithmetic stays boxed no matter how the "
                 "loop counters are typed. Viper is excellent for integer and bit manipulation "
                 "work; this is not that.\n" % (
                     py / rows["v3-native"]["best"], py / rows["v3-viper"]["best"],
                     py / base))

    lines.append("### An optimization can be correct and still lose\n")
    lines.append("V6's interleaved kernel is the fastest transform measured — 1.28x faster "
                 "than the baseline kernel. But the harness feeds every variant split "
                 "buffers, so V6 must convert in and out, and that conversion costs about 95%% "
                 "of its runtime. Net result: **%.2fx**, or 15x slower. The optimization is "
                 "real; the integration cost destroys it. In a system where the ADC or DMA "
                 "delivered interleaved samples directly, V6 would be the winner.\n" % (
                     base / rows["v6"]["best"]))

    lines.append("### Measurement discipline changed the headline number\n")
    lines.append("An early ad-hoc measurement of V2 — no warm-up, single trial — reported "
                 "**1.93x**. Under the disciplined harness the honest figure is **%.2fx**. "
                 "The difference was entirely a cold-start baseline: V0's first run costs "
                 "~186k cycles against ~130k warm, so the sloppy comparison flattered V2 by "
                 "over 50%%. This is the course's own subject matter caught in the act.\n" % (
                     base / rows["v2"]["best"]))

    lines.append("## Reproducing\n")
    lines.append("```bash\n"
                 "# copy variants + harness to the device, then\n"
                 "mpremote connect /dev/cu.usbmodem14401 run device/compare.py\n"
                 "mpremote connect /dev/cu.usbmodem14401 cp :/outputs/variant-results.csv outputs/\n"
                 "python3 tools/build_comparison.py\n"
                 "```\n")

    out = os.path.join(OUTPUTS, "variant-comparison.md")
    with open(out, "w") as f:
        f.write("\n".join(lines) + "\n")

    print("wrote %s" % out)
    for name in ORDER:
        if name in rows:
            print("  %-10s %9d cycles  %.2fx" % (
                name, rows[name]["best"], base / rows[name]["best"]))


if __name__ == "__main__":
    main()
