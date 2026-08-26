# TODO

## Hardware and kit packaging

- **Add a Bill of Materials page.** The course is built around specific,
  inexpensive hardware, but there is no single page that tells a reader what
  to buy before Lab 1. Every one of the 35 labs declares its own parts in its
  `**Hardware:**` header field, so the information exists — it is just spread
  across 35 files and never totalled. A student, parent, or instructor
  currently has to open every lab to find out what the course costs and what
  arrives in the box.

    - **Why it matters:** this is the last thing standing between the course
      and someone being able to *assemble the hardware and follow it*. It is
      also a prerequisite for packaging the course as a physical kit, and for
      any instructor ordering parts for a class set.

    - **What the page should contain:**
        - One table of parts: name, quantity, approximate unit price,
          approximate total, and a "required vs optional" column — a
          meaningful share of the labs run on a bare Pico 2 with no
          peripherals, so the entry cost is far lower than the full kit and
          the page should say so.
        - Which labs need which parts, so a reader can buy in stages rather
          than all at once (Module 0 needs almost nothing; the microphone
          first appears in Lab 7).
        - A note on substitutions. Components go end-of-life, and a swapped
          microphone or display should not invalidate a chapter. Say what
          matters about each part (I2S output, SPI interface, 128×64) rather
          than only the part number.
        - A link from `docs/labs/index.md`, and a nav entry near the top of
          the Hands-On Labs section, since it is a before-Lab-1 page.

    - **Derived parts list**, from the labs' own `Hardware:` fields:

        | Part | First needed | Notes |
        |---|---|---|
        | Raspberry Pi Pico 2 (RP2350) | Lab 1 | The only universally required part |
        | USB cable | Lab 1 | Check the connector the board actually uses |
        | SSD1306 OLED, 128×64 | Lab 4 | SPI |
        | Breadboard and jumper wires | Lab 4 | |
        | Push buttons ×2 | Lab 5 | |
        | INMP441 microphone | Lab 7 | I2S |
        | A tone source | Lab 23 | A phone playing a tone works |

    - **Blocked on a small cleanup first.** The `Hardware:` fields are not
      written in a consistent vocabulary, so the list above cannot yet be
      generated or validated automatically. The same part appears as
      "Pico 2" and "Raspberry Pi Pico 2"; "OLED" and "SSD1306 OLED";
      "INMP441" and "INMP441 microphone"; "buttons" and "two push buttons".
      One lab says only "Pico 2 + kit", which tells the reader nothing.
      Normalising these to canonical names makes the BOM page derivable from
      the labs instead of a second thing to keep in sync by hand.

    - **Resolve the price discrepancy while you are in there.** `README.md`
      describes a "$6 Raspberry Pi Pico 2" and `docs/labs/index.md` says
      "a $5 chip". Both are defensible depending on the variant and the
      seller, but a BOM page makes the number load-bearing — pick one, say
      which variant it refers to, and date the price.

    - **Status:** not started.
