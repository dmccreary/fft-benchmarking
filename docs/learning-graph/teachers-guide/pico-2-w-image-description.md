# Image Brief: Raspberry Pi Pico 2 W

Written for a text-to-image model because no suitably licensed photograph of
this part was found in the workspace. (The `pico-w.png` in learning-micropython
shows the older RP2040 Pico W, which is the wrong board.) Wikimedia Commons is
worth one more check before generating. Delete this note once the image exists.

## Prompt

> A single Raspberry Pi Pico 2 W microcontroller board, a long narrow green
> printed circuit board about 51 mm × 21 mm, with a silver rectangular metal
> RF shield can near one end covering the wireless chip, a small black square
> RP2350 processor chip in the middle, a white BOOTSEL push button, a silver
> Micro-USB connector at the opposite short end from the shield, and a row of
> 20 gold castellated pin holes along each long edge, with "Pico 2 W" printed in
> white silkscreen. Resting flat on a plain white seamless background. Soft,
> even product-photography lighting with no harsh shadows. Shot directly
> overhead. The board fills roughly 60% of the frame. Sharp focus throughout,
> high detail, no text overlay, no watermark, no hands, no packaging, no other
> objects.

## Physical details that must be right

- **Size:** 51 mm × 21 mm, about 1 mm thick
- **Package / form factor:** Pico form factor, 2 × 20 castellated pins at 2.54 mm pitch
- **Color:** green solder mask, gold pads, silver shield can
- **Leads/pins:** 40 edge pins plus 3 debug pins at the end opposite the USB port
- **Distinguishing marks:** the metal RF shield can (absent on the plain Pico 2),
  the "Pico 2 W" silkscreen, the RP2350 chip

## What it must not look like

- The **plain Pico 2** has no metal shield can. The shield is the visual tell for the W.
- The older **Pico W (RP2040)** looks very similar but says "Pico W" and has an
  RP2040 chip. Do not render an RP2040 or the text "Pico W".
- Not the larger Raspberry Pi single-board computers.

## Aspect ratio and size

- Aspect ratio: 4:3 landscape
- Target: at least 1000px on the long edge

## Where it goes

- File: `docs/learning-graph/teachers-guide/pico-2-w.png`
- Referenced from: the `## Purchasing Guide` section of
  `docs/learning-graph/teachers-guide/index.md` as `./pico-2-w.png`
- Alt text to use: `Raspberry Pi Pico 2 W board with its metal wireless shield, top view`
