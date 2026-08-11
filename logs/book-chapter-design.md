# Session Log: Book Chapter Structure Design

**Date:** 2026-08-10
**Scope:** Ran `/book-chapter-generator` against the expanded (574-concept) learning graph
**Outcome:** 27-chapter structure designed, validated against the full dependency graph, and generated

---

## 1. What This Session Produced

| Deliverable | Location | State |
|---|---|---|
| Chapter structure | `docs/chapters/01-hello-world/` … `27-capstone/` | 27 chapters, all 574 concepts covered exactly once |
| Chapter overview | `docs/chapters/index.md` | Generated |
| Nav wiring | `mkdocs.yml` | New `Chapters:` section added between `Learning Graph:` and `Hands-On Labs:` |
| Stale content removed | `docs/chapters/01-introduction/`, `02-math-foundations/`, `03-fft-altorithm/` | Deleted (pre-lab-expansion stubs, not in nav, user-approved) |
| Dangling links fixed | `docs/plans/01-fft-test-plan.md` | Two links retargeted from the deleted `03-fft-altorithm` to the new `12-building-the-fft` |
| Build check | — | `mkdocs build --strict` — zero warnings originate from the new chapter files or nav |

**Not done / flagged:** `docs/learning-graph/chapter-metrics.md` is a stale auto-generated
report (word counts, section counts) describing the deleted 3-chapter structure. Its two
remaining broken links are cosmetic; the underlying data needs a regeneration run from
whatever book-metrics tool produced it — out of scope for this skill. Chapter content itself
is still `TODO: Generate Chapter Content` in all 27 files — next step is
`chapter-content-generator`.

---

## 2. The Core Problem: Scale Mismatch

The `book-chapter-generator` skill assumes a ~200-concept learning graph and targets
10–15 chapters (max 20). This course's graph had grown to **574 concepts** — the original
200 theory concepts plus 374 concepts pulled directly from the 35 hands-on lab pages
(`add-lab-concepts.py`, run earlier the same day). `concept-taxonomy.md` was also stale,
still describing the old 200-concept/12-category structure; the authoritative taxonomy was
`taxonomy-names.json` (17 categories) plus the `group` field on each of the 574 graph nodes.

Forcing 574 concepts into ≤20 chapters would have meant 25–40+ concepts per chapter
everywhere. Decision: **go to 27 chapters** instead, so most chapters stay near the skill's
12–25 "optimal" band, accepting a chapter count above the usual ceiling as the more honest
tradeoff for a graph nearly 3x the skill's assumed size. Final distribution: min 7, max 35,
average 21.3 concepts/chapter.

## 3. Method

1. Loaded `learning-graph.json` (574 nodes, 874 edges), built the prerequisite map
   (`edge.from` depends on `edge.to` — the dependency direction, per the skill's mandatory
   check), and confirmed it's a valid DAG via Kahn's algorithm with zero cycles.
2. For the 374 lab-added concepts (IDs 201–574), `lab-concepts.csv` gave an explicit,
   authoritative Lab 1–35 assignment for each.
3. For the original 200 theory concepts, no such explicit assignment existed. First attempt:
   propagate a "target lab" backward from each concept's dependents (i.e., place a theory
   concept at the earliest lab that needs it, transitively). This is where it got interesting —
   see §4.
4. Grouped the resulting 35 lab-level buckets into 27 chapters along thematic lines, splitting
   the largest buckets (11, 13, 20) where two genuinely distinct topics had landed in the same
   bucket, and merged thin buckets (7 lab-bucket groups of Module 2, for instance) where a
   single concept or two didn't justify a standalone chapter.
5. Verified **zero violations** across all 574 concepts × 874 edges before generating any
   files (skill's mandatory gate) — no dependent chapter ever precedes a chapter containing
   one of its prerequisites.

## 4. Design Problems Found in the Graph (and How They Were Handled)

These aren't chapter-design choices so much as things the raw dependency graph got subtly
wrong for *this specific course's* pedagogy, discovered by tracing why certain concepts kept
getting pulled to implausible chapters.

- **A single edge nearly spoiled the FFT reveal.** A lab-8 concept ("Level Meter," the VU
  meter bar graph) was graph-linked as depending on "Decibel Conversion," which chained
  through "Magnitude Calculation" → "FFT Algorithm" → "Discrete Fourier Transform." Taken
  literally via transitive-minimum propagation, that pulled the FFT and DFT concepts into
  Chapter 5 — before students ever meet correlation. That directly undercuts the course's
  explicit "students build the DFT themselves" narrative (course-description.md is
  emphatic about this). Fix: placed FFT/DFT concepts by their true first-use point (Ch.
  9–13) instead of the transitive minimum, accepting that the two lab-8 display concepts
  land slightly later (Ch. 14) as the smaller cost.
- **An over-strict hardware prerequisite.** "Real Time Constraints" was graph-linked to
  depend on "Instruction Latency" and "Pipelining" (assembly-level topics from Labs
  29–31), which would have dragged the concept — and everything real-time-budget-related
  that depends on it — to the end of the book. But the course establishes the real-time
  cycle budget as early as Lab 3 ("6,000,000 cycles per audio frame"). Fix: moved
  "Instruction Latency" and "Pipelining" themselves into Chapter 2 (general CPU
  characteristics, introduced at a high level, revisited concretely in the assembly
  chapters) so the dependency chain no longer forces a late placement.
- **Wave math ordered before audio capture, contrary to lab numbering.** The course
  *teaches* Labs 7–10 (audio capture) before Labs 11–12 (wave math) deliberately —
  concrete experience before formal explanation. But the concept graph makes "Analog/
  Digital Signals" formally depend on "Sine Wave," "Amplitude," "Frequency." Decision:
  chapters follow the dependency graph, not the lab sequence, since chapters are reference
  material rather than a lockstep replay of the labs — Chapter 4 (Waves) precedes Chapter 5
  (Capturing Real Audio) even though the corresponding labs run in the opposite order. This
  is called out explicitly in `chapters/index.md`'s "How to Use This Textbook" section so
  it doesn't read as a mistake.
- **Iterative fixed-point correction.** Each manual override could itself introduce a new
  violation (e.g., moving "Decibel Conversion" later broke ordering for two lab-8 concepts
  that depended on it). Resolved by re-running the full 574×874 violation check after every
  change until it hit zero — took four iterations to converge.

## 5. Final Structure

27 chapters, organized into 8 informal "parts" that mirror the course's existing 8 hands-on
modules (not encoded as nav sub-headers — user chose the flat list option):

| Part | Chapters | Theme |
|---|---|---|
| 0 | 1–3 | Getting Started (MicroPython, GPIO, board architecture, peripherals) |
| 1 | 4–6 | Waves & Digital Audio |
| 2 | 7–10 | Discovering Frequency (complex numbers → correlation → DFT → "too slow") |
| 3 | 11–13 | The FFT Algorithm |
| 4 | 14–16 | Real Spectra |
| 5 | 17–19 | Measuring Performance |
| 6 | 20–23 | Assembly Language |
| 7 | 24–27 | Optimization & Capstone |

Two deliberately thin chapters were kept standalone rather than merged for narrative reasons:
- **Ch. 10, "Why the DFT Is Too Slow" (7 concepts)** — the course's dramatic pivot point (the
  530×-too-slow result that motivates the entire FFT module); kept as its own short chapter
  rather than buried at the end of Ch. 9.
- **Ch. 13, "FFT Variants, Complexity, and Correctness" (11 concepts)** — a natural coda after
  the large Ch. 12 (35 concepts, the biggest chapter, where the recursive FFT is actually
  built).

Each chapter's **Prerequisites** section links to the *specific* earlier chapters it actually
depends on (computed from real cross-chapter edges), not a generic "read everything before
this."

## 6. Decisions Deferred to the User (and Answers Given)

- **27 chapters vs. forcing into ≤20:** presented with full rationale; approved as-is.
- **Nav grouping:** offered flat list vs. nesting under 8 "Part" sub-headers; user chose flat
  (matches the existing `Chapters: → List of Chapters` convention already used elsewhere in
  this book).
- **Stale 3-chapter stubs:** offered keep-alongside vs. remove; user approved removal.
