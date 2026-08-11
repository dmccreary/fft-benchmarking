---
title: Address and Byte Offset Explorer
description: Compute the byte offset and full address for any element of a float array, and see the VLDR instruction it produces.
image: /sims/address-byte-offset-explorer/address-byte-offset-explorer.png
og:image: /sims/address-byte-offset-explorer/address-byte-offset-explorer.png
twitter:image: /sims/address-byte-offset-explorer/address-byte-offset-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Address and Byte Offset Explorer

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the Address and Byte Offset Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/address-byte-offset-explorer/main.html"
        height="492px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

In Python you write `samples[3]` and the language handles the rest. In assembly
there is no such thing as element three. There is only a base address in a
register and a number of bytes to add to it. Every array access you write by
hand has to make that translation yourself, and getting it wrong does not
produce an error — it produces a wrong number.

The memory strip at the top shows eight consecutive 32-bit floats starting at
`0x20001000`. Each slot occupies four bytes, so the addresses climb by four:
`0x20001000`, `0x20001004`, `0x20001008`, and so on. Underneath each slot the
simulation shows both the absolute address and the offset from the base, which
is the number that actually appears in the instruction.

The calculator applies the one formula that matters:

$$\text{offset} = \text{index} \times \text{bytes per element}$$

For a `float32` array, bytes per element is 4. Element 3 is therefore at offset
12, and the instruction that loads it is `VLDR s0, [r0, #12]` — assuming `r0`
holds the base address of the array.

The bottom panel is where the lesson bites. Type an offset that is not a
multiple of four and the simulation tells you what actually happens: nothing
complains. The assembler encodes it, the processor may well execute it, and you
get four bytes straddling two elements — a value that is not any number in your
array. Type an offset past the end of the array and you get whatever memory
follows, because assembly performs no bounds checking at all.

## How to Use

1. Drag the **Element index** slider, or click any slot in the memory strip, to
   select an element from 0 to 7.
2. Watch the byte offset, the full address, and the `VLDR` instruction update
   together. Confirm for yourself that the offset is always four times the index.
3. Type a value into **Check offset #** to test any byte offset you like:
    - A multiple of 4 inside the array is reported as addressing that element.
    - A multiple of 4 past the end warns that you are reading unrelated memory.
    - A non-multiple of 4 warns that the load straddles two elements.
4. Try offset 12 and offset 14 back to back. They differ by two bytes and by
   nothing else visible — which is exactly why this class of bug is hard to find.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 10-12 minutes

**Prerequisites:**

- An array is a contiguous block of memory
- A 32-bit float occupies four bytes
- Registers hold addresses as well as values

**Learning Objective:** Apply the byte-offset formula to compute the correct
`VLDR` offset for a chosen element of a float array, and identify offsets that
are misaligned or out of range.

**Activities:**

1. **Read the strip (2 min).** Before touching the controls, predict the address
   of element 5. Then select it and check.
2. **Derive the formula (3 min).** Step through indices 0 through 7 and record
   the offsets. Students should recognize the multiplication before being told it.
3. **Change the element type (3 min).** Ask what the strip would look like for
   an `int16` array. The formula becomes `index × 2`, and eight elements now
   span 16 bytes instead of 32. The formula does not change; only the constant does.
4. **Break it deliberately (3 min).** Enter offset 14 and read the warning aloud.
   Discuss why the hardware does not stop you, and what a real program would do
   with the resulting value.

**Assessment:** Given a base address of `0x20002000` and an array of `float32`,
write the instruction that loads element 9 into `s2`. (Answer: offset 36, so
`VLDR s2, [r0, #36]`.)

## Related Resources

- [Register Tracer](../register-tracer/index.md) — how registers hold and update values
- [Instruction Encoding Bit Builder](../instruction-encoding-bit-builder/index.md) — how an instruction like this becomes bits
- [Pico 2 Memory Map Explorer](../pico2-memory-map-explorer/index.md) — where in the address space `0x20001000` actually lives

## References

- [ARM Cortex-M33 Devices Generic User Guide](https://developer.arm.com/documentation/100235/latest/) — VLDR addressing modes and alignment requirements
- [ARMv8-M Architecture Reference Manual](https://developer.arm.com/documentation/ddi0553/latest/) — the immediate offset field encoding for floating-point loads
