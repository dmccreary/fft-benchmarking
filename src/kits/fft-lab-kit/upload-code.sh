#!/usr/bin/env bash
# Upload the whole FFT lab kit to a connected Raspberry Pi Pico 2 using
# mpremote. Run from within this directory or from anywhere — the script
# resolves its own location.
#
# What gets uploaded:
#   lib/*.py                     display driver etc.  -> :lib/
#   config.py                    pin definitions      -> :config.py
#   probes/*.py                  hardware probes      -> :probes/*.py
#   docs/labs/NN-*/code/*.py     every lab's programs -> :NN-*.py
#
# config.py is uploaded before the labs so the other programs can import
# it. Lab code lives under docs/labs/ so the markdown and the runnable file
# are the same file — there is no second copy to drift out of sync. probes/
# holds one-off hardware capability scripts (asm_thumb support, CPUID, etc.)
# that predate the numbered labs and aren't part of that sequence.
#
# IMPORTANT: Quit (or "Stop/Disconnect" from) Thonny before running this.
# Only one program can use the Pico's serial port at a time. If Thonny is
# connected, mpremote fails with:
#   "failed to access /dev/cu.usbmodem... (it may be in use by another program)"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
LABS_DIR="$REPO_ROOT/docs/labs"

if ! command -v mpremote >/dev/null 2>&1; then
    echo "Error: mpremote is not installed. Install with: pip install mpremote" >&2
    exit 1
fi

echo "NOTE: Quit or disconnect Thonny first — only one program can use the"
echo "      Pico's serial port at a time."
echo

echo "Checking for connected Pico..."
# We pass the exact serial port to mpremote rather than using "connect auto",
# which only matches a fixed list of vendor/product IDs and silently reports
# "no device found" for boards it does not recognize.
#
# You can force a specific port:  PORT=/dev/cu.usbmodem14301 ./upload-code.sh
if [[ -n "${PORT:-}" ]]; then
    echo "Using device from PORT environment variable: $PORT"
else
    # macOS uses /dev/cu.usbmodem* (preferred for outgoing connections);
    # Linux uses /dev/ttyACM* or /dev/ttyUSB*.
    shopt -s nullglob
    serial_devs=(
        /dev/cu.usbmodem*
        /dev/tty.usbmodem*
        /dev/ttyACM*
        /dev/ttyUSB*
    )
    shopt -u nullglob
    if (( ${#serial_devs[@]} == 0 )); then
        echo "Error: No Pico detected (no usbmodem/ttyACM/ttyUSB device). Plug it in and try again." >&2
        exit 1
    fi
    PORT="${serial_devs[0]}"
    if (( ${#serial_devs[@]} > 1 )); then
        echo "Multiple serial devices found; using the first:"
        printf '  %s\n' "${serial_devs[@]}"
        echo "Override with: PORT=/dev/your-device ./upload-code.sh"
    fi
    echo "Using device: $PORT"
fi

# Interrupt any running program before copying files.
mpremote connect "$PORT" soft-reset >/dev/null 2>&1 || true

upload() {
    # upload <local path> <remote path>
    local src="$1" dest="$2"
    echo "  -> $dest"
    if ! mpremote connect "$PORT" cp "$src" ":$dest"; then
        echo >&2
        echo "Error: could not write to the Pico." >&2
        echo "If the port is 'in use by another program', QUIT or DISCONNECT" >&2
        echo "Thonny (or any other serial monitor) and run this script again." >&2
        exit 1
    fi
}

shopt -s nullglob
lib_files=( lib/*.py )
probe_files=( probes/*.py )
lab_files=( "$LABS_DIR"/*/code/*.py )
shopt -u nullglob

if [[ ! -f config.py ]] && (( ${#lib_files[@]} == 0 && ${#probe_files[@]} == 0 && ${#lab_files[@]} == 0 )); then
    echo "Nothing to upload: no config.py, no lib/*.py, no probes/*.py, no lab code." >&2
    exit 1
fi

# 1. Libraries first — labs import these.
if (( ${#lib_files[@]} > 0 )); then
    echo "Uploading ${#lib_files[@]} file(s) to Pico :lib/ ..."
    mpremote connect "$PORT" mkdir :lib >/dev/null 2>&1 || true
    for f in "${lib_files[@]}"; do
        upload "$f" "lib/$(basename "$f")"
    done
fi

# 2. config.py next — every lab from Lab 4 onward imports it.
if [[ -f config.py ]]; then
    echo "Uploading shared configuration..."
    upload config.py config.py
fi

# 3. Hardware probes.
if (( ${#probe_files[@]} > 0 )); then
    echo "Uploading ${#probe_files[@]} probe script(s) to Pico :probes/ ..."
    mpremote connect "$PORT" mkdir :probes >/dev/null 2>&1 || true
    for f in "${probe_files[@]}"; do
        upload "$f" "probes/$(basename "$f")"
    done
fi

# 4. Every lab's code, in lab order.
if (( ${#lab_files[@]} > 0 )); then
    echo "Uploading ${#lab_files[@]} lab program(s)..."
    for f in "${lab_files[@]}"; do
        upload "$f" "$(basename "$f")"
    done
else
    echo "No lab code found under $LABS_DIR/*/code/ yet."
fi

echo "Done. Files on Pico:"
mpremote connect "$PORT" ls
mpremote connect "$PORT" ls :lib 2>/dev/null || true
mpremote connect "$PORT" ls :probes 2>/dev/null || true
