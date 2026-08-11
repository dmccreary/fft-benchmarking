---
title: Instructor's Guide
description: A complete guide for instructors adopting FFT Benchmarking - features, classroom usage, hardware logistics, licensing, and customization.
---

# FFT Benchmarking Instructor's Guide

Welcome to the instructor's guide for *FFT Benchmarking: Real-Time Signal Processing on a $5 Microcontroller*. This guide explains every feature of the textbook, how to run its 35 hands-on hardware labs in a classroom, and how to customize the site for your own course. No prior technical knowledge of the underlying web tools is assumed — every technical term is defined before it is used.

!!! info "Where this book stands today"
    This is an actively developed textbook. As of this writing, all **27 chapters** and all **35 hands-on labs** have full text content, and the **learning graph** (574 concepts, 874 dependency relationships) is complete. The **mascot** (Echo the Dolphin) is fully illustrated and woven through every chapter and lab. The **glossary**, **FAQ**, **per-chapter quizzes**, and most of the **58 specified MicroSims** are still in progress — see [Using the MicroSims](#using-the-microsims) and [Using the Glossary](#using-the-glossary) below for what's live right now versus what's planned. If you're evaluating this book for an upcoming semester, read those two sections before committing to a start date.

## About This Interactive Intelligent Textbook

### What is an Intelligent Textbook?

An **intelligent textbook** is a digital textbook that goes beyond static text and images. It includes interactive simulations, a searchable glossary, and a structured map of how concepts relate to each other. The goal is to give students a richer, more engaging learning experience than a traditional printed textbook — and, in this book's case, to pair that digital content with real hardware students hold in their hands.

### The Five Levels of Intelligent Textbooks

Not all digital textbooks are created equal. We categorize intelligent textbooks into five levels based on how interactive and adaptive they are:

<iframe src="https://dmccreary.github.io/intelligent-textbooks/sims/book-levels/main.html" height="500px" scrolling="no"
  style="overflow: hidden;"></iframe>

| Level | Name | Description | Example Features |
|-------|------|-------------|-----------------|
| **Level 1** | Static Digital | A PDF or basic web version of a print textbook | Text and images only, no interactivity |
| **Level 2** | Interactive | Adds interactive elements like simulations and a searchable glossary | MicroSims, self-check content, concept search |
| **Level 3** | Adaptive | Adjusts content based on student performance | Personalized learning paths, difficulty adjustment |
| **Level 4** | AI-Assisted | Includes an AI tutor that can answer student questions | Chatbot integration, automated feedback |
| **Level 5** | Fully Adaptive AI | Continuously learns from student interactions and optimizes the experience | Real-time content generation, predictive analytics |

**This textbook is a Level 2 Intelligent Textbook**, with its MicroSim library still being built out chapter by chapter (see the development note above).

### What Makes This Textbook Different

- **35 hands-on labs on real hardware** — students don't just read about FFTs, they build one from scratch on a $5 Raspberry Pi Pico 2 and hand-write ARM assembly to make it fast
- **A concrete before/after result** — students take a 512-point transform from roughly 21 seconds down to 0.59 milliseconds on the same chip, and can explain exactly where each factor of improvement came from
- **"Benchmark honestly" as the throughline** — every chapter and lab reinforces measuring performance rigorously rather than eyeballing it, which the course description calls "a harder and rarer skill than writing the fast code itself"
- **Learning graph** — a visual map showing how all 574 concepts connect and build on each other across 874 dependency relationships
- **Echo the Dolphin** — a friendly mascot (a "pedagogical agent") who guides students through each chapter and lab with tips, encouragement, and key insights
- **Completely free and open source** — licensed under Creative Commons for non-commercial use

## Course Structure at a Glance

The course is designed for **10 weeks**, or self-paced independent study, for college juniors and seniors curious about signal processing. It has two parallel tracks that reference each other:

| Track | What It Is | Where | Count |
|-------|-----------|-------|-------|
| **Chapters** | Conceptual explanations, diagrams, and worked examples | `docs/chapters/` | 27 |
| **Hands-On Labs** | Step-by-step procedures students run on physical hardware | `docs/labs/` | 35 |

No prior FFT, DSP, or assembly experience is assumed — Lab 1 assumes only that a student owns a computer. Everything else (microcontrollers, digital audio, sine waves, the Fourier transform, the FFT algorithm, benchmarking, ARM assembly, and instruction encoding) is taught from zero, in that order.

## Using the Chapters

### Chapter Structure

The textbook contains **27 chapters**, organized in a deliberate sequence that mirrors the lab progression. Students should work through them in order:

| Chapters | Topic Area |
|----------|-----------|
| 1–3 | Foundations (Thonny/MicroPython, the Pico 2's ARM Cortex-M architecture, peripherals) |
| 4–6 | Sound as numbers (waves, real audio capture, sampling/quantization/aliasing) |
| 7–10 | Discovering frequency (complex numbers, correlation, the DFT, why it's too slow) |
| 11–13 | The FFT algorithm (divide-and-conquer, a complete recursive implementation, variants) |
| 14–16 | Real spectra (displaying a spectrum, windowing and spectral leakage, a real-time analyzer) |
| 17–19 | Measuring performance (cycle-accurate timing, benchmarking methodology, Python/C/assembly compared) |
| 20–26 | Assembly and optimization (the FPU, first assembly function, hand-written FFT, branchless code, instruction encoding, comparing competing variants) |
| 27 | Capstone (applications, design, and reporting) |

### What Each Chapter Contains

Every chapter follows a consistent structure:

1. **YAML front matter** — Metadata at the top of each chapter file (title, description, version). Students don't see this; it's used by search engines and the website builder.
2. **Summary** — A brief overview of what the chapter covers.
3. **Concepts covered** — A numbered list of the specific concepts addressed, drawn from the learning graph.
4. **Prerequisites** — Links to prior chapters that should be completed first.
5. **Welcome from Echo** — A mascot admonition that opens the chapter in Echo the Dolphin's voice.
6. **Main content** — The core instructional material, written for a college audience with real-world examples and, where a MicroSim has been specified, an embedded interactive diagram (see [Using the MicroSims](#using-the-microsims)).
7. **Mascot admonitions throughout** — Echo appears several more times per chapter to flag key insights, offer tips, warn about common mistakes, and encourage students through harder material.
8. **Chapter Summary** — A closing recap, capped with a celebration from Echo.

Chapters do not currently include separate practice-question or quiz sections — that role is filled by the paired hands-on lab (see below), which ends every lab with a **Challenges** section and a **Check Your Understanding** section.

### Suggested Classroom Use

- **Before class**: Assign the chapter as reading. It sets up the concepts the paired lab will make concrete.
- **During class**: Walk through any embedded diagrams together, then move into the corresponding lab so students apply the idea on real hardware immediately.
- **After class**: The lab's Challenges and Check Your Understanding sections work well as a short homework wrap-up.
- **Pacing**: With 27 chapters and 35 labs across 10 weeks, plan for roughly 2–3 chapter/lab pairs per week; the Assembly and Optimization block (Chapters 20–26 / Labs 28–34) is the densest and may need extra time.

## Using the Hands-On Labs

This is the part of the course that sets it apart from a typical intelligent textbook: students aren't just reading about signal processing, they're capturing real audio and benchmarking real code on a physical chip.

### What is a Lab?

Each of the **35 labs** takes about 45 minutes and walks a student through a specific, hands-on task — wiring a button, capturing a sound sample, hand-writing an ARM assembly function — using **Thonny** (a beginner-friendly Python IDE) and stock **MicroPython** running directly on the board. There is no compiler or SDK to install; all lab code ships pre-loaded on the board.

### The Hardware Kit

Every student needs one kit, at roughly **$19** total:

| Component | Approx. cost | First used | Purpose |
|---|---|---|---|
| Raspberry Pi Pico 2 (RP2350) | $5 | Lab 1 | Cortex-M33, 150 MHz, hardware FPU |
| SSD1306 OLED, 128×64, SPI | $5 | Lab 4 | Live spectrum display |
| Two momentary push buttons | $1 | Lab 5 | Mode switching |
| INMP441 I²S MEMS microphone | $3 | Lab 7 | Real audio capture |
| Breadboard and jumper wires | $5 | Lab 4 | Connections |

!!! warning "Order the Pico 2, not the original Pico"
    A Pico 2 **W** works identically for every lab. The original Pico (RP2040) does **not** — its Cortex-M0+ core has no floating-point unit, so Labs 30–34 (the ARM assembly and FPU labs) cannot run on it. Double-check this when ordering kits for a class; Lab 28 teaches students to detect the problem themselves by reading the CPU's own registers, but by then it's too late to swap hardware mid-semester.

No soldering is required — every component connects via breadboard and jumper wires.

### The Eight Lab Modules

| Module | Labs | Focus |
|--------|------|-------|
| 0 — Getting Started | 1–3 | Thonny, MicroPython, GPIO, reading the chip's own identification registers |
| 1 — Peripherals | 4–6 | OLED display, buttons, deploying standalone code |
| 2 — Sound as Numbers | 7–10 | Real audio capture, RMS/VU metering, sampling rate, aliasing, bit depth |
| 3 — Discovering Frequency | 11–16 | Sine waves, superposition, correlation, building and validating a DFT by hand |
| 4 — The FFT | 17–20 | Divide-and-conquer, bit reversal, twiddle factors, a complete Python FFT |
| 5 — Real Spectra | 21–24 | Real spectrum display, windowing, peak detection (a tuner), a live spectrum analyzer |
| 6 — Measuring Performance | 25–27 | Cycle-accurate timing, benchmarking methodology, the Python/C/assembly abstraction ladder |
| 7 — Assembly Language | 28–31 | FPU detection, first assembly function, floating-point assembly, a hand-written assembly FFT |
| 8 — Optimization and Capstone | 32–35 | Specialization, branchless code, hand-encoding, competing-variant analysis, capstone |

### What Each Lab Contains

Every lab follows the same structure, which is worth knowing before you assign one:

1. **Mascot welcome** from Echo, setting up the lab's goal.
2. **What You'll Build** — a one-line statement of the deliverable.
3. **Learning Objectives** and **Concepts Introduced**.
4. **Background** — just enough theory to attempt the procedure.
5. **Procedure** — numbered, copy-pasteable steps, with mascot tips and warnings inline at the points where students commonly get stuck.
6. **Expected Output** — what a correct run looks or sounds like, so students can self-verify.
7. **Troubleshooting** — a table of common failure symptoms and fixes.
8. **Challenges** — optional extensions for students who finish early.
9. **Check Your Understanding** — short reflection or short-answer questions.
10. **Celebration** from Echo, closing the lab.

### Classroom Logistics Tips

- **Order kits at least two weeks ahead.** The INMP441 microphone and SSD1306 OLED are common but not always in-stock everywhere; a class-wide bulk order is more reliable than asking students to source parts individually.
- **One shared pin-mapping file.** Every lab imports pin numbers from a single `config.py`, set up once in Lab 4. If a student's wiring doesn't match `config.py`, that's the first thing to check.
- **Pair students for Labs 28–34.** The ARM assembly labs are the most conceptually dense in the course; pairing helps students debug register-level mistakes together.
- **Keep a few spare boards on hand.** A Pico 2 that won't mount as a USB drive is almost always a bad MicroPython flash, not a dead board — re-flashing (covered in Lab 1) fixes the vast majority of "my board is broken" reports.
- **The Cornell Labs reference page** (in the main navigation) demonstrates a complete real-time FFT/iFFT implementation on the Pico 2 and is a useful instructor reference when a student's implementation diverges from the expected approach.

### Grading Hands-On Labs

Because labs are not auto-graded, most instructors use a light-touch approach:

- **Completion-based credit** for Labs 1–19 (foundational skills), checked via the Expected Output section.
- **Rubric-based credit** for Labs 20–35 (assembly and optimization), where the Check Your Understanding answers and benchmark numbers a student reports are the evidence of understanding.
- **Capstone (Lab 35 / Chapter 27)** as the summative project — students choose an application, design their FFT pipeline, and report benchmark results with justification.

## Using the MicroSims

### What is a MicroSim?

A **MicroSim** (short for "micro-simulation") is a small, interactive simulation that runs directly in a web browser. Students don't need to install any software — MicroSims work on any device with a modern web browser.

### Current Development Status

This book currently has **2 fully built MicroSims**, both live in the main navigation under **MicroSims**:

| Technology | What It's Good For | Example MicroSims |
|-----------|-------------------|-------------------|
| **vis-network** | Interactive graph diagrams | Learning Graph Viewer |
| **Timeline** | Chronological event exploration | FFT History Timeline |

Beyond those two, **58 additional MicroSims have been fully specified inside the chapters** — each with a documented learning objective, Bloom's Taxonomy level, canvas layout, and interactive controls — but their code has not been written yet, so the `<iframe>` embeds for those will not render until they're built. Of the 58 specified, 49 are planned as p5.js simulations (sliders and live animation), 7 as Chart.js visualizations, and 2 as vis-network diagrams. If you spot a blank space where a diagram should be while previewing a chapter, that's a specified-but-not-yet-built MicroSim, not a bug in your local setup.

### Tips for Using MicroSims in Class

1. **Project them on a screen** — MicroSims are designed to be visible on a projector. Have students call out predictions before you move a slider.
2. **Let students explore independently** — After a demonstration, give students 5–10 minutes to experiment on their own devices.
3. **Connect to the text** — Each MicroSim is placed near the concept it illustrates. After exploring the sim, have students re-read the surrounding text.
4. **Check what's live before class** — Since the MicroSim library is still growing, skim the chapter you're about to teach ahead of time to confirm which embedded sims currently render.

!!! mascot-tip "Echo's Tip: Embed MicroSims Anywhere!"
    <img src="../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    You can add any of the currently-built MicroSims to **any web page** — a Google Site, a WordPress blog, an LMS like Canvas or Schoology, or even a plain HTML file. Just paste a single line of HTML:

    ```html
    <iframe src="https://dmccreary.github.io/fft-benchmarking/sims/graph-viewer/main.html"
        width="100%" height="450px"
        scrolling="no">
    </iframe>
    ```

    Swap `graph-viewer` for `timeline` (or for any newly built MicroSim's directory name) to embed a different one. That's it — one line of code and your students have an interactive simulation on any page you control.

## Using the Learning Graph

### What is a Learning Graph?

A **learning graph** is a visual map showing how concepts in the textbook depend on each other. It is structured as a **DAG** (Directed Acyclic Graph) — a diagram where arrows show which concepts must be understood before others. This book's learning graph contains **574 concepts** connected by **874 dependency relationships**, spanning both the conceptual chapters and the hands-on labs.

### How Instructors Can Use the Learning Graph

- **Prerequisite checking** — Before teaching a concept, verify that students have covered its prerequisites.
- **Remediation** — If a student struggles with a concept (say, twiddle factors), trace back through the graph to find the specific prerequisite gap (complex number multiplication, perhaps).
- **Curriculum mapping** — Compare the learning graph to your existing syllabus to identify coverage gaps if you're adapting this book alongside other material.
- **Enrichment** — Advanced students can explore concepts ahead of the current chapter by following the graph forward.

The interactive **Learning Graph Viewer** is available in the "Learning Graph" section of the left navigation, alongside the underlying concept list, taxonomy, and quality metrics reports.

## Using the Glossary

The book has a **glossary** page in the navigation, but as of this writing it contains only the template scaffold (the ISO 11179 definition-quality criteria and one placeholder entry) rather than real terms. Don't assign it as a study resource yet — check back once the glossary has been generated from the concept list, or generate it yourself (see "Customizing Your Own Textbook" below; the project's `glossary-generator` skill builds it from the same learning graph described above).

## Feedback

### Reporting Issues and Suggestions

This textbook is an open-source project hosted on **GitHub**, a website where software and content projects are developed collaboratively. You don't need to understand programming to report a problem or suggest an improvement.

### How to Submit Feedback

1. Go to the textbook's GitHub repository: [dmccreary/fft-benchmarking](https://github.com/dmccreary/fft-benchmarking)
2. Click the **"Issues"** tab at the top of the page
3. Click the green **"New issue"** button
4. Give your issue a clear title (e.g., "Lab 14 wiring diagram doesn't match config.py" or "Suggestion: add MicroSim for bit-reversal")
5. In the description, provide as much detail as possible: which page or lab has the problem, what you expected versus what you saw, and your browser/device if relevant
6. Click **"Submit new issue"**

You will need a free GitHub account to submit issues. If you prefer not to create an account, use the contact page to reach the author directly.

### Types of Feedback Welcome

- **Typos and errors** — factual mistakes, spelling errors, broken formatting
- **Broken links or wiring diagrams that don't match `config.py`**
- **MicroSim bugs** — simulations that don't load or behave unexpectedly
- **Content suggestions** — topics that should be covered, examples that could be improved
- **Accessibility issues** — content that is difficult to read or navigate for students with disabilities

## Understanding the License

### What is a Creative Commons License?

A **license** is a legal document that explains what others are allowed to do with a piece of work. A **Creative Commons (CC) license** is a standardized, easy-to-understand license used for educational and creative content. It tells you exactly what permissions you have without needing a lawyer.

### This Textbook's License

This textbook uses the **CC BY-NC-SA 4.0** license. Here's what each part means:

| Code | Full Name | What It Means |
|------|-----------|---------------|
| **CC** | Creative Commons | A standard open license |
| **BY** | Attribution | You must give credit to the original author |
| **NC** | Non-Commercial | You cannot use the material to make money |
| **SA** | Share-Alike | If you modify the material, you must share it under the same license |
| **4.0** | Version 4.0 | The version of the license (the current standard) |

### What You CAN Do

- **Copy** the entire textbook or individual chapters/labs for your students
- **Share** the textbook link with other instructors, students, or colleagues
- **Print** chapters or lab procedures for classroom use
- **Modify** the content — add your own examples, remove sections, change the order
- **Translate** the content into other languages
- **Create derivative works** — build your own version of the textbook based on this one

### What You CANNOT Do

- **Sell** the textbook or charge students for access
- **Remove attribution** — you must credit the original author (Dan McCreary)
- **Use a different license** — if you modify and share, it must remain CC BY-NC-SA 4.0
- **Claim it as your own work** — the attribution requirement means you must acknowledge the original source

For the full legal text, see the [License](../license.md) page.

## Customizing Your Own Textbook

One of the most powerful features of this textbook is that you can create your own customized version. This section explains how, step by step.

### Key Technical Terms

- **Repository (repo)** — A folder on GitHub that contains all the files for a project. Think of it as the project's home directory.
- **Git** — A version control tool that tracks changes to files. It lets you see what changed, when, and by whom.
- **Clone** — Making a complete copy of a repository on your own computer.
- **Fork** — Making a complete copy of a repository on your own GitHub account (stays on GitHub, not your computer).
- **MkDocs** — The software that converts the textbook's markdown files into a website. You don't need to learn MkDocs deeply — just enough to make basic changes.
- **Markdown** — A simple text formatting language. If you can write an email, you can write Markdown. `**bold**` makes **bold**, `# Heading` makes a heading, and `-` makes a bullet point.
- **mkdocs.yml** — The main configuration file for the textbook website. It controls the site title, navigation structure, colors, and which features are enabled.

### Step 1: Create a GitHub Account

If you don't already have one, go to [github.com](https://github.com) and create a free account.

### Step 2: Fork or Clone the Repository

**Option A: Fork (easier, stays on GitHub)**

1. Go to [dmccreary/fft-benchmarking](https://github.com/dmccreary/fft-benchmarking)
2. Click the **"Fork"** button in the upper-right corner
3. This creates a copy in your own GitHub account that you can edit

**Option B: Clone (more control, works on your computer)**

1. Install Git on your computer ([git-scm.com](https://git-scm.com/))
2. Open a terminal (Command Prompt on Windows, Terminal on Mac)
3. Run this command:

```bash
git clone https://github.com/dmccreary/fft-benchmarking.git
```

This downloads the entire textbook to your computer.

### Step 3: Make Changes

All content files are in the `docs/` folder. They are written in **Markdown** (`.md` files) — plain text files with simple formatting. You can edit them with any text editor.

#### Changing the Title and Description

Open `mkdocs.yml` and edit these lines:

```yaml
site_name: "Your Custom Textbook Title"
site_description: "Your description here"
site_author: "Your Name"
```

#### Changing the Colors

In `mkdocs.yml`, find the `palette` section:

```yaml
theme:
  palette:
    primary: 'blue'    # Change to: blue, red, purple, teal, etc.
    accent: 'orange'   # Change the accent color
```

MkDocs Material supports these primary colors: red, pink, purple, deep purple, indigo, blue, light blue, cyan, teal, green, light green, lime, yellow, amber, orange, deep orange, brown, grey, blue grey.

#### Changing the Logo

Replace the file `docs/img/logo.png` with your own logo image (PNG format, approximately 128x128 pixels).

### Step 4: Preview Your Changes Locally

1. Install Python (version 3.8 or newer) from [python.org](https://python.org)
2. Install MkDocs and the Material theme:

```bash
pip install mkdocs "mkdocs-material[imaging]"
```

3. Navigate to the project folder and start the preview server:

```bash
cd fft-benchmarking
mkdocs serve
```

4. Open your browser to `http://127.0.0.1:8000/fft-benchmarking/` to see your customized version

The preview server watches for file changes. When you edit and save a Markdown file, the page automatically refreshes in your browser.

### Step 5: Publish Your Version

To publish your customized textbook as a free website using GitHub Pages:

```bash
mkdocs gh-deploy
```

This command builds the website and publishes it to `https://YOUR-USERNAME.github.io/fft-benchmarking/`. The process takes about 1–2 minutes.

## Customizing Your Analytics

### What is Web Analytics?

**Web analytics** is the process of measuring how visitors use a website — which pages they visit, how long they stay, and where they come from. For an educational textbook, analytics can help you understand which chapters or labs students spend the most time on, and where they might be struggling.

### Google Analytics

This textbook does **not** currently have Google Analytics configured (the `extra.analytics` block in `mkdocs.yml` is present but commented out). If you'd like to track visits to your own fork:

1. Go to [analytics.google.com](https://analytics.google.com/) and sign in with a Google account
2. Create a new **property** (Google's term for a tracked website)
3. Google will give you a **Measurement ID** — a code that looks like `G-XXXXXXXXXX`
4. In your `mkdocs.yml`, uncomment and update this section:

```yaml
extra:
  analytics:
    provider: google
    property: G-YOUR-MEASUREMENT-ID
```

5. Rebuild and deploy your site. Analytics data will start appearing within 24–48 hours.

#### What You Can Learn from Analytics

- **Which chapters or labs are most/least visited** — helps you identify where students might be skipping content
- **Average time on page** — longer times may indicate engagement or confusion
- **Device breakdown** — what percentage of students use phones vs. computers
- **Search terms** — what students search for on your site

### xAPI Monitoring (Advanced)

**xAPI** (Experience API, also called "Tin Can API") is an advanced standard for tracking detailed learning activities — not just page views, but specific interactions like "student completed Lab 17" or "student's benchmark result for Lab 26."

#### What is an LRS?

An **LRS** (Learning Record Store) is a database that stores xAPI learning records. Think of it as a specialized analytics system designed specifically for education.

#### Important: Regulatory Considerations

Before collecting student-specific learning data, be aware of these regulations:

- **FERPA** (Family Educational Rights and Privacy Act) — U.S. federal law that protects student education records. If you collect data that can identify individual students, you must comply with FERPA.
- **State laws** — Many U.S. states have additional student privacy laws.
- **GDPR** (General Data Protection Regulation) — European Union law that applies if any of your students are in the EU.

**Recommendation**: The Google Analytics setup described above is anonymous by default — it tracks aggregate page views, not individual students. This is the safest approach. If you want individual student tracking via xAPI, consult your institution's data privacy officer before proceeding.

## Echo the Dolphin: Your Pedagogical Agent

### What is a Pedagogical Agent?

A **pedagogical agent** is a character that appears throughout a textbook to guide students. Research shows that pedagogical agents improve student engagement and perception of learning — a phenomenon called the **persona effect**.

### Meet Echo

Echo is a friendly, ocean-blue dolphin with orange over-ear headphones and a maroon waveform-patterned wristband — a nod to the book's signature colors and its "listening for signals" theme. Echo's catchphrase, **"Time to transform!"**, ties directly to the book's central topic: transforming raw signals into the frequency domain. Echo is patient and encouraging, never condescending about assembly language or DSP math, and leans on sound/wave metaphors ("let's tune into this," "that's the right frequency of thinking").

### How Echo Appears

Echo shows up as colored callout boxes (called **admonitions**) throughout each chapter and lab. There are seven pose/type combinations:

| Type | Purpose | Where You'll See It |
|------|---------|---------------------|
| Welcome | Introduces the chapter or lab | Every chapter and lab opening |
| Thinking | Highlights a key insight | 1–2 per chapter/lab |
| Tip | Shares practical advice | As needed |
| Warning | Alerts to common mistakes | Points where students commonly get stuck (e.g., wiring, board selection) |
| Encourage | Supports students through harder concepts | Near dense material, especially assembly language |
| Celebration | Celebrates progress | Every chapter and lab ending |
| Neutral | General notes | As needed |

Echo appears no more than 5–6 times per chapter or lab to avoid overuse, and is never placed in back-to-back admonitions.

### Tips for Instructors

- **Read Echo's tips aloud** — they're written in a conversational tone that works well when spoken in class.
- **Use "thinking" admonitions as discussion prompts** — they highlight the most important insight in each chapter or lab.
- **Point struggling students to "encourage" admonitions** — they're placed exactly where students tend to get stuck, particularly in the assembly-language labs.
- **Treat "warning" admonitions as a checklist** — many flag the exact mistakes (wrong board revision, mismatched pin config) that generate the most support requests.

## Troubleshooting

### A MicroSim shows as a blank box

Check the [Current Development Status](#current-development-status) table above — most chapters reference MicroSims that are specified but not yet built. This is expected for now, not a broken install.

### A student's board won't run Labs 30–34

Confirm they have a **Pico 2 (RP2350)**, not the original Pico (RP2040). The original board has no floating-point unit and cannot run the assembly/FPU labs. Lab 28 walks students through self-diagnosing this.

### The guide feels out of date

This guide reflects the project state as generated. If you've since added the glossary, FAQ, quizzes, or additional MicroSims, consider regenerating this guide or manually updating the relevant sections above.

## Related Resources

- [Course Description](../course-description.md) — full details on audience, prerequisites, and the hardware kit
- [Learning Graph](../learning-graph/index.md) — the 574-concept dependency map underlying every chapter and lab
- [Cornell Labs FFT on the Pico](../cornell-labs/pico-example.md) — a complete real-time FFT/iFFT reference implementation
- [About This Course](../about.md) — the motivation behind the book
