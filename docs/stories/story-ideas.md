---
title: Story Ideas
description: Curated graphic-novel story ideas connecting this course's hardware, algorithms, and benchmarking ethic to the people who built them.
---

# Story Ideas for Real-Time DSP on a $5 Microcontroller

These mini-graphic novel ideas are designed to inspire readers by connecting the subject matter
of this course — ARM Cortex-M architecture, floating point, digital audio, the FFT, and honest
benchmarking — to the real people (and one deliberately fictional case study) who shaped those
ideas. Each story can be generated using the book-media-generator story route, with the
suggested panel count or your own override via `--panels N`.

**Note on the FFT itself:** the definitive story of Cooley and Tukey's 1965 FFT algorithm
already exists in the *Signal Processing* textbook and is linked, not duplicated, from
[Stories](index.md) — see that page for the cross-link. The ideas below deliberately cover
different people and moments so the two books' Stories sections complement rather than repeat
each other.

## Selection Criteria

Stories were selected for:

- **Relevance** — direct connection to this course's chapters and labs (ARM architecture,
  floating point, sampling, DSP hardware, assembly language, and benchmarking methodology)
- **Diversity** — range of backgrounds, cultures, genders, and time periods
- **Inspiration** — themes that resonate with students learning to go "down the abstraction
  ladder" from Python to bare metal
- **Drama** — compelling narrative arcs with conflict and resolution

## Story Ideas

### 1. Two in a Garden Shed: How Sophie Wilson and Steve Furber Invented ARM

| | |
|---|---|
| **Subject** | Sophie Wilson (b. 1957) and Steve Furber (b. 1953), United Kingdom |
| **Theme** | Doing more with less — elegance forced by a tiny budget |
| **Connection** | Every board in this course's kit runs an ARM Cortex-M33 core. This is the origin story of the instruction set architecture itself — the "R" in ARM's original RISC design philosophy that Chapters 2, 21–25 depend on. |
| **Panels** | **12** — full origin-to-legacy arc, from Acorn's cash crisis through the ARM1 prototype to today's billions of shipped cores |

In 1983, Acorn Computers needed a processor for the BBC Micro's successor and could not afford
one from Intel or Motorola. Sophie Wilson and Steve Furber designed the Acorn RISC Machine from
scratch with a two-person team and almost no budget, discovering that a radically simple
instruction set could outperform far more expensive chips. Forty years later that same design
philosophy — few instructions, low power, done exceptionally well — is why a $5 board can run a
real-time FFT.

*Why this inspires:* the chip in every student's hand was designed by two people with a tiny
budget who refused to accept that "powerful" had to mean "expensive."

---

### 2. The Machine in the Living Room: Konrad Zuse and the First Programmable Computer

| | |
|---|---|
| **Subject** | Konrad Zuse (1910–1995), Germany |
| **Theme** | Building alone, and rebuilding after everything is destroyed |
| **Connection** | Zuse's Z3 (1941) was the first working programmable computer and used binary floating-point arithmetic — the direct ancestor of the IEEE 754 format this course's FPU chapters (20–22) depend on. |
| **Panels** | **9** — mystery (why does no one believe him), setback (the machine is destroyed), and reveal (floating point survives) |

Working nights and weekends in his parents' Berlin apartment with no institutional support, Zuse
built a calculating machine that used binary floating-point numbers years before anyone else saw
the need. Allied bombing destroyed his early machines and most of his records, and for decades
his work was barely known outside Germany. Only later did historians confirm the Z3 was Turing-
complete — a genuinely programmable computer, built essentially alone.

*Why this inspires:* an idea this course now teaches in an afternoon — floating point in binary
— took one person years of solitary, repeatedly-destroyed work to discover first.

---

### 3. The Man Who Wouldn't Let Floating Point Lie

| | |
|---|---|
| **Subject** | William Kahan (b. 1933), Canada / United States |
| **Theme** | Standing alone against an industry that wanted a cheaper, sloppier answer |
| **Connection** | Kahan's IEEE 754 standard is the exact floating-point format the Cortex-M33's hardware FPU implements — the subject of Chapters 20–22 and Labs 28–31. |
| **Panels** | **8** — linear discovery: the committee fight, the holdouts, the standard that won anyway |

In the early 1980s, chip makers wanted incompatible, cost-cutting floating-point formats that
would have made numerical results unpredictable across machines. William Kahan, hired by Intel
as a consultant, pushed through a rigorous, mathematically complete standard over the objections
of manufacturers who thought it was overengineered. IEEE 754 became the standard implemented
in virtually every FPU built since — including the one on a $5 board.

*Why this inspires:* one uncompromising mathematician's insistence on doing arithmetic
correctly, not just cheaply, is why every `float` a student writes behaves predictably.

---

### 4. Amazing Grace: From Naval Officer to the First Compiler

| | |
|---|---|
| **Subject** | Grace Hopper (1906–1992), United States |
| **Theme** | Building the ladder this course asks students to climb back down |
| **Connection** | Hopper invented the first compiler and pushed computing toward human-readable languages — the top of the "abstraction ladder" this course explores in Chapter 19, which students then deliberately descend toward assembly. |
| **Panels** | **12** — full life arc: Navy service, the Mark I, the first bug, the compiler, COBOL |

Grace Hopper joined the Navy in WWII and worked on the Harvard Mark I, one of the first large-
scale computer. Convinced that programmers shouldn't have to write in raw machine code, she built
the first compiler in 1952 against widespread skepticism that a machine could reliably translate
human instructions into correct code. Her work led directly to COBOL and the entire idea of
high-level programming languages.

*Why this inspires:* Hopper spent a career building the abstraction layers between humans and
machine code — this course asks readers to appreciate what those layers cost by walking back
down through them.

---

### 5. The Telephone Engineer Who Invented Digital Audio Fifty Years Too Early

| | |
|---|---|
| **Subject** | Alec Reeves (1902–1971), United Kingdom |
| **Theme** | Being right before the technology exists to prove it |
| **Connection** | Reeves invented pulse-code modulation (PCM) — the exact technique this course's sampling and bit-depth chapters (6, Labs 7–10) use to turn a microphone's analog wiggle into numbers. |
| **Panels** | **6** — tight before/after: analog telephony's noise problem, and Reeves's digital solution |

In 1937, working for International Telephone and Telegraph in Paris, Alec Reeves patented pulse-
code modulation as a way to make telephone signals immune to noise by converting sound into
discrete digital samples. The vacuum-tube electronics of the era were far too slow and expensive
to make PCM practical, and the idea sat mostly dormant for decades until transistors and
integrated circuits finally caught up.

*Why this inspires:* every I²S microphone sample this course's students capture in Lab 7 uses an
idea one engineer got right in 1937, decades before hardware existed that could use it.

---

### 6. Built for Sound: Gene Frantz and the First DSP Chip

| | |
|---|---|
| **Subject** | Gene Frantz (b. 1941), United States |
| **Theme** | Purpose-built hardware versus general-purpose compromise |
| **Connection** | This course explicitly frames its story as "for decades this superpower needed expensive dedicated hardware" — Frantz's TMS320 at Texas Instruments (1978–1983) was that dedicated hardware, the direct ancestor of the DSP instructions now built into the Cortex-M33. |
| **Panels** | **8** — linear discovery: the speech-synthesis problem, the chip that couldn't do multiply fast enough, the custom silicon that fixed it |

Gene Frantz and his team at Texas Instruments were building a speech-synthesis toy — eventually
the Speak & Spell — and kept hitting a wall: general-purpose processors of the era could not
multiply numbers fast enough to filter audio in real time. Their solution was a chip built around
a single job: one multiply-and-accumulate operation per clock cycle. That chip, the TMS320, created
the entire category of dedicated digital signal processors.

*Why this inspires:* the DSP instructions the Cortex-M33 has built in exist because one team
decided a toy needed a chip that did one thing extremely well.

---

### 7. 1201 Alarm: Margaret Hamilton and the Software That Landed on the Moon

| | |
|---|---|
| **Subject** | Margaret Hamilton (b. 1936), United States |
| **Theme** | Real-time systems have no second chances |
| **Connection** | This course revolves around a hard real-time budget — 6,000,000 CPU cycles per audio frame (Chapter 17, Lab 25). Hamilton's Apollo Guidance Computer software operated under an equally unforgiving real-time deadline, with human lives on the line. |
| **Panels** | **9** — mystery and reveal: an alarm nobody expected, minutes to decide, a landing that almost didn't happen |

As director of the Software Engineering Division at MIT's Instrumentation Laboratory, Margaret
Hamilton insisted the Apollo Guidance Computer's software handle overload gracefully rather than
crash — a decision NASA managers initially resisted as unnecessary. Minutes before the Apollo 11
lunar landing, a 1201 program alarm fired exactly the kind of overload Hamilton had designed for;
the software shed lower-priority tasks and kept running, and the landing proceeded.

*Why this inspires:* a system that has been engineered to fail gracefully under a real-time
deadline can save a mission — the same discipline this course applies to a 40-millisecond audio
frame.

---

### 8. Self-Taught at NASA: Annie Easley's Path from Human Computer to Programmer

| | |
|---|---|
| **Subject** | Annie Easley (1933–2011), United States |
| **Theme** | Teaching yourself the machine when no one will teach you |
| **Connection** | This course's binding design constraint is that "you need no prior experience... Lab 1 assumes only that you own a computer." Easley taught herself programming from scratch, mid-career, exactly the leap this course asks every reader to make. |
| **Panels** | **10** — life arc: hired as a "human computer," self-taught programming, decades of energy-systems code at NASA |

Annie Easley was hired by the NACA (soon to become NASA) in 1955 as one of the agency's few
Black "human computers," doing calculations by hand. When electronic computers arrived, she
taught herself to program them rather than be replaced by them, and spent the next three decades
writing code for battery and energy-conversion research that underpins hybrid and electric
vehicle technology today.

*Why this inspires:* Easley turned a technology that threatened to end her career into the tool
that defined it — proof that self-teaching a machine from zero is a career-long superpower, not
just a first course.

---

### 9. Cooling the Fire: Seymour Cray's Obsession with Honest Speed

| | |
|---|---|
| **Subject** | Seymour Cray (1925–1996), United States |
| **Theme** | Refusing to let marketing numbers substitute for measured performance |
| **Connection** | This course's central discipline — "benchmarking honestly... a harder and rarer skill than writing the code itself" — was Cray's obsession decades before it had a name; his supercomputers were engineered and measured, never marketed on paper specs alone. |
| **Panels** | **12** — full life arc: CDC 6600, the freon-cooled Cray-1, a career of chasing real, verified cycles |

Seymour Cray built some of the fastest computers in the world, and cared as much about how a
machine's speed was proven as about the machine itself — famously skeptical of any performance
claim he could not personally verify. His Cray-1, cooled by liquid freon coursing through its
distinctive C-shaped cabinet, became the standard against which "supercomputer" was measured for
a decade.

*Why this inspires:* Cray's insistence on verified, reproducible speed over a spec sheet is the
same standard this course's benchmarking chapters (17–18, 25–26) hold students to.

---

### 10. RISC vs. CISC: The Architecture Debate That Decided How Chips Would Be Built

| | |
|---|---|
| **Subject** | David Patterson (b. 1947) and John Hennessy (b. 1952), United States |
| **Theme** | A simpler idea, proven with data, beating decades of accumulated complexity |
| **Connection** | The reduced instruction set philosophy Patterson and Hennessy proved out at Berkeley and Stanford in the early 1980s is the direct architectural ancestor of the ARM core inside every board this course's students hold — and the reason Chapters 21–25's assembly instructions are so learnable in a single course module. |
| **Panels** | **9** — mystery and reveal: an industry convinced complex instructions were the future, a research result that said otherwise, a debate settled by benchmarks |

Through the early 1980s, chip makers kept adding ever more complex instructions to their
processors, assuming complexity meant capability. Patterson at Berkeley and Hennessy at Stanford
independently built research chips using a small, fast, simple instruction set instead, and
measured them against the industry's complex designs — the simpler chips won on real workloads.
Their "RISC" philosophy reshaped how nearly every modern processor, including ARM, is designed.

*Why this inspires:* two research teams changed an entire industry by trusting a measured
benchmark over decades of received wisdom about what a good processor needed.

---

### 11. The List That Made Benchmarking Honest: Jack Dongarra and LINPACK

| | |
|---|---|
| **Subject** | Jack Dongarra (b. 1950), United States |
| **Theme** | Fighting misinformation with a standard everyone has to run the same way |
| **Connection** | This course's own material states that it demonstrates "four ways benchmarks lie" and that "a benchmark's exclusions can reverse its conclusion" (Chapters 17–18, 26) — exactly the problem Dongarra's LINPACK benchmark and TOP500 list were built to solve for an entire industry. |
| **Panels** | **8** — linear discovery: vendors quoting best-case numbers, a benchmark anyone can run and verify, a public list that ends the guessing |

In the 1970s and 80s, computer vendors routinely advertised performance numbers that only ever
held under artificial best-case conditions. Jack Dongarra built LINPACK, a benchmark any lab
could run identically on any machine, and later co-founded the TOP500 list ranking the world's
fastest computers by that single honest measurement rather than marketing claims.

*Why this inspires:* Dongarra proved that the fix for misleading performance claims isn't a
better argument — it's a benchmark rigorous enough that everyone has to agree on the number.

---

### 12. Five Dollars of Computer: Eben Upton and the Raspberry Pi

| | |
|---|---|
| **Subject** | Eben Upton (b. 1978), United Kingdom |
| **Theme** | Democratizing capability that used to require a budget |
| **Connection** | This is the direct lineage story behind the course's own hardware kit — the Pico 2 that every student uses descends from the same Cambridge engineering culture and mission that produced the Raspberry Pi: real computing power at a price any student can afford. |
| **Panels** | **8** — linear discovery: a shrinking pool of students who'd ever touched real hardware, a $25 computer built to fix it, unexpected global demand |

Eben Upton, a Cambridge computer science lecturer, watched university applicants arrive each year
with less and less hands-on hardware experience, because home computers had become sealed
appliances instead of things you could program down to the metal. He and colleagues built the
Raspberry Pi as a $25 computer capable of teaching real programming and hardware interaction —
and demand from students, hobbyists, and engineers worldwide outstripped every projection.

*Why this inspires:* the same "why should powerful hardware be expensive" instinct that produced
a $25 computer now, a decade later, puts a real-time DSP-capable chip in this course's $5 board.

---

### 13. The Benchmark That Lied *(fictional case study)*

| | |
|---|---|
| **Setting** | A university embedded-systems lab, present day |
| **Theme** | The gap between a number and the truth it claims to measure |
| **Connection** | Dramatizes exactly the trap this course warns against in Chapters 17–18 and 26: a vendor's FFT library claims a blazing time-per-transform, and a student has to figure out why their own honestly-measured code can't get close — until they find what the vendor's number quietly left out. |
| **Panels** | **7** — single-technique mystery: the suspicious number, the investigation, the fix that makes the comparison fair |

A student benchmarking their own FFT implementation against a vendor's published number can't
explain a 40× gap, until digging into the vendor's test harness reveals it discarded the first
several runs, used a pre-warmed cache, and never counted the memory transfer required to get real
data into place. Rerunning both benchmarks under identical, fully-accounted conditions closes
most of the gap — and reveals the real, smaller, honestly-earned difference.

*Why this inspires:* the most common form of dishonesty in engineering isn't a lie, it's a
benchmark that quietly measures the wrong thing — and this course trains students to notice.

---

### 14. 0.59 Milliseconds *(fictional synthesis capstone)*

| | |
|---|---|
| **Setting** | This course itself, told as a single connected journey |
| **Theme** | Every layer of speed has a name, a reason, and a person who discovered it |
| **Connection** | A montage capstone dramatizing the course's own headline result — a 512-point transform going from 21 seconds to 0.59 milliseconds — tying together the DFT, the FFT, benchmarking discipline, the FPU, and hand-written assembly into one visual timeline. |
| **Panels** | **14** — synthesis montage: one panel per major optimization step, so students can see the whole 165× journey as a single connected story |

A single student's project retraces the entire course in miniature: a brute-force DFT that takes
21 seconds, the divide-and-conquer insight that turns it into an FFT, the discovery that
MicroPython's own overhead is the next bottleneck, the leap to hardware floating point, and
finally hand-written ARM assembly that lands the same transform at 0.59 milliseconds — a factor
of 35,000 improvement, each step named and measured.

*Why this inspires:* seeing the entire 35-lab arc compressed into one connected visual story
makes the scale of what a single student accomplishes in this course viscerally clear.

---

### 15. The Six Who Programmed by Hand: Betty Holberton and the First Programmers

| | |
|---|---|
| **Subject** | Frances "Betty" Holberton (1917–2001) and the "ENIAC Six," United States |
| **Theme** | Programming so close to the hardware that there was no abstraction to hide behind |
| **Connection** | The ENIAC programmers wired plugboards and set switches by hand with no operating system, no assembler, and no manual — the same "nothing between you and the hardware" experience this course's assembly-language module (Chapters 21–25, Labs 28–31) deliberately recreates. |
| **Panels** | **10** — life arc: recruited without being told what they'd build, learning ENIAC's logic from its wiring diagrams alone, a public demonstration with no formal recognition |

In 1945, six women — recruited as "computers" without being told they would program the first
general-purpose electronic computer — learned ENIAC's operation entirely from its logical wiring
diagrams, since no manual or programming language yet existed. Betty Holberton and her colleagues
physically wired the machine to calculate ballistic trajectories, then later demonstrated it
successfully to the press, with their essential role uncredited for decades afterward.

*Why this inspires:* the ENIAC programmers had nothing but the hardware itself to reason about —
exactly the skill this course asks students to rebuild by hand in its assembly-language labs.

---

### 16. The Theorem Nobody Needed Yet: Harry Nyquist and the Sampling Limit

| | |
|---|---|
| **Subject** | Harry Nyquist (1889–1976), Sweden / United States |
| **Theme** | A mathematical limit discovered decades before the technology that would make it matter |
| **Connection** | The Nyquist limit is the exact rule this course's aliasing chapter (6) and Lab 9 teach students to respect: sample below twice the highest frequency present, or the signal lies to you. |
| **Panels** | **7** — single-technique arc: the telegraph-bandwidth problem, the theorem, decades of dormancy before digital audio made it essential |

Working at Bell Labs in 1928 on the entirely analog problem of how much telegraph signal a
limited-bandwidth line could carry, Harry Nyquist derived the precise mathematical limit on how
fast a signal must be sampled to be reconstructed without loss. The result sat as a piece of
communications theory for decades until digital audio and, later, every microphone this course's
students wire up made it a rule they hit directly.

*Why this inspires:* a limit worked out for 1920s telegraph wires turns out to be the exact law
that governs whether a $3 microphone captures a clean signal or a distorted one.

---

## How to Generate a Story

To turn any of these ideas into a full graphic novel with generated images, use:

> book-media-generator (story route): {Story Title} --panels {N}

Provide the subject's name (and optionally `--panels N` to override the suggested count) and the
skill will handle the rest — writing the narrative, creating image prompts, and optionally
generating all panel images via a text-to-image API (currently Google Gemini 2.5 Flash Image).
Current cost for high-quality images with accurate text placement is approximately **$0.039 per
image**, so $0.039 × (N + 1) per story — from about $0.27 for a 6-panel story up to $0.66 for the
16-panel capstone montage.
