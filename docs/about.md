---
title: "About This Book"
description: "About Real-Time DSP on a $5 Microcontroller — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Echo

!!! mascot-welcome "Welcome!"
    ![Echo the Dolphin waving welcome](./img/mascot/welcome.png){ class="mascot-admonition-img" }
    Hi, I'm Echo! I use echolocation to "see" the world by listening to the frequencies that bounce back — which is exactly what an FFT does with a signal. In this course you'll build that same superpower yourself, from scratch, on a microcontroller that costs less than a sandwich. It looks intimidating at first, but every idea here is built from the last one, and I'll be right there with you at each step. Time to transform!

## Why This Intelligent Textbook

The Fast Fourier Transform is not a niche academic curiosity — it was named one of the ten algorithms with the greatest influence on science and engineering in the entire 20th century, alongside Quicksort and the simplex method[^1]. Nearly every field that measures a signal over time — audio, vibration, radio, medical imaging, power quality, seismology — eventually needs to ask "what frequencies are hiding in this data?" The FFT is how that question gets answered fast enough to matter.

**In the United States (2025):**

- The Bureau of Labor Statistics projects **7% growth** in electrical and electronics engineering occupations from 2024 to 2034, faster than the average for all occupations, with roughly **17,500 openings** projected each year[^2]
- The FFT itself dates to a 1965 paper by Cooley and Tukey, but the underlying idea traces back to Gauss's 1805 calculations for tracking asteroid orbits — a 220-year-old technique still doing real-time work on $5 hardware[^1]

**Worldwide:**

- Arm's silicon partners have shipped more than **200 billion** Arm-based chips to date, and Cortex-M processors — the exact family this course targets — account for roughly **three-quarters** of all Arm-based chip shipments each year[^3]
- The global market for Arm-based microcontrollers was valued at **$11.12 billion in 2024** and is projected to grow at an **8.3% compound annual rate** through 2032, driven by industrial sensing, automotive, and IoT demand[^4]

These numbers point at the same gap: the hardware capable of real-time frequency-domain analysis is now everywhere and shockingly cheap, but most engineers never get hands-on practice putting it to work. Most students meet the FFT as a black-box function call in a textbook chapter, never see it fail, and never learn to tell a real speedup from a measurement artifact.

This course takes a fundamentally different approach. It is built on a **learning graph of 574 interconnected concepts** spanning DSP theory, embedded hardware, and benchmarking methodology, organized across **27 chapters** and **35 hands-on laboratory exercises**. Every concept is introduced only after its prerequisites are in place, and nothing is handed to you pre-built — you derive the DFT from a single question ("does my signal contain this note?"), watch it run 530x too slow, and then build the FFT yourself to close that gap. Throughout the book you will find **61 interactive MicroSims** that let you manipulate the math and the hardware directly rather than just reading about it. The entire textbook is **open source and free** — no paywalls, no access codes — and written so that Lab 1 assumes only that you own a computer.

## How to Use This Book

This textbook is designed for a 10-week course or self-paced independent study. Each chapter builds on the ones before it, so working through the material in order is recommended — with Module 3 (Chapters 8–10) and the FPU check in Chapter 20 called out as load-bearing for everything that follows. The book includes:

- **27 Chapters** covering waves, sampling, the DFT and FFT, real-time spectrum analysis, ARM assembly, and benchmarking methodology
- **35 Hands-On Labs** performed on real hardware — a Raspberry Pi Pico 2, an OLED display, and a MEMS microphone, at roughly $19 for the full kit
- **61 Interactive MicroSims** — browser-based simulations for exploring the math, the signals, and the hardware directly
- **Quizzes** at the end of each chapter to test understanding
- **Annotated References** linking to Wikipedia and authoritative sources
- **Glossary** with definitions for every key concept
- **FAQ** with common questions and answers
- **Learning Graph** visualizing how all 574 concepts connect and depend on each other
- **Search** available from any page using the search bar

The [Learning Graph](learning-graph/index.md) visualizes how concepts connect across chapters. If you want to explore non-linearly or check prerequisites for a specific topic, start there.

## About the Author

![](./img/dan-headshot-small.png){ width="150px" align="right"}

Dan McCreary has been writing FFT code since 1981, as a junior in college, running FORTRAN on a VAX-11/780 that the entire campus shared — one megabyte of RAM for everyone. That contrast has stuck with him ever since: the same transform that once required time-sharing a room-sized institutional computer now runs in well under a millisecond on a microcontroller that costs five dollars and fits on a keychain.

Dan is a semi-retired AI researcher, solution architect, and educator who has spent more than three decades helping Fortune 100 organizations reason over massive datasets. At Optum he founded the Generative AI Center of Excellence and led the team that built one of the world's largest healthcare knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights. He built this course to support his own DIY signal-processing projects, including the [Low Cost Spectrum Analyzer](https://dmccreary.github.io/spectrum-analyzer/), after finding that most FFT libraries for low-cost microcontrollers like the Pico 2 ignored the chip's own DSP hardware and ran roughly 10x slower than they should.

Dan believes that visualizing signals in the frequency domain is a core, transferable skill — a genuinely universal one that engineers in acoustics, mechanical vibration, RF, biomedical instrumentation, and power systems all eventually need, regardless of their home discipline. This course, paired with the accompanying FFT kit, is meant to let you build that intuition yourself through real-time sound processing rather than take it on faith from a slide.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the founding chair of the NoSQL Now! conference, and a frequent keynote speaker on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the same rigor to building open educational resources. You can visit the [Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/) to see over 87 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals, lesson plans, or other publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Real-Time DSP on a $5 Microcontroller*. https://dmccreary.github.io/fft-benchmarking/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Real-Time DSP on a $5 Microcontroller*. https://dmccreary.github.io/fft-benchmarking/.

**MLA (9th edition)**

McCreary, Dan. *Real-Time DSP on a $5 Microcontroller*. 2026, dmccreary.github.io/fft-benchmarking/.

**BibTeX**

```bibtex
@book{mccreary2026fftbenchmarking,
  title     = {Real-Time DSP on a $5 Microcontroller},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/fft-benchmarking/},
  note      = {Interactive intelligent textbook}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 11: From DFT to FFT. In *Real-Time DSP on a $5 Microcontroller*. https://dmccreary.github.io/fft-benchmarking/chapters/11-from-dft-to-fft/

## License

This work is released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt the
material for non-commercial purposes as long as you give appropriate credit
and share your adaptations under the same license.

## References

[^1]: Dongarra, J., & Sullivan, F. (2000). Guest Editors' Introduction: The Top 10 Algorithms. *Computing in Science & Engineering*, 2(1), 22–23. https://dl.acm.org/doi/10.1109/MCISE.2000.814652
[^2]: U.S. Bureau of Labor Statistics. (2025). *Occupational Outlook Handbook: Electrical and Electronics Engineers*. https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm
[^3]: Arm Holdings. (2023). *Arm Partners Have Shipped 200 Billion Chips*. Arm Newsroom. https://newsroom.arm.com/blog/200bn-arm-chips
[^4]: Intel Market Research. (2025). *ARM Microcontrollers Market Outlook 2025–2032*. https://www.intelmarketresearch.com/arm-microcontrollers-market-13031
