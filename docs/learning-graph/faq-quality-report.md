# FAQ Quality Report

Generated: 2026-08-10

## Overall Statistics

- **Total Questions:** 91
- **Overall Quality Score:** 80/100
- **Content Completeness Score:** 100/100 (all required inputs present at high quality — see below)
- **Concept Coverage (200-concept core learning graph):** 24.0% (48/200)
- **Concept Coverage (550-term glossary):** 26.7% (147/550)
- **Reading Level:** Flesch-Kincaid Grade 14.1 (college sophomore/junior) — appropriate for the
  course's stated audience of college juniors and seniors

## Content Completeness Assessment

| Input | Status | Score |
|---|---|---|
| `docs/course-description.md` | Complete — title, audience, prerequisites, Bloom's-organized learning outcomes | 25/25 |
| `docs/learning-graph/concept-dependencies.csv` | Valid DAG, 200 concepts, 229 dependencies, no cycles | 25/25 |
| `docs/glossary.md` | 550 ISO-11179-style definitions | 15/15 |
| Chapter content (`docs/chapters/**`) | 27 chapters, 91,583 words | 20/20 |
| Concept coverage in chapter content | 574 concepts documented across chapters per `chapters/index.md` (200 core + 374 lab-derived) | 15/15 |
| **Total** | | **100/100** |

Content completeness was excellent going in — this FAQ was generated from a mature, mostly-complete
textbook rather than an early draft.

## Category Breakdown

| Category | Questions | Avg Word Count | Examples | Links | Dominant Bloom's Levels |
|---|---|---|---|---|---|
| Getting Started | 12 | 126 | 42% | 100% | Remember (58%), Understand (42%) |
| Core Concepts | 26 | 134 | 54% | 100% | Understand (46%), Apply (23%), Remember (19%) |
| Technical Detail | 20 | 117 | 45% | 100% | Understand (40%), Remember (30%), Apply (20%) |
| Common Challenges | 13 | 117 | 46% | 100% | Apply (46%), Understand (31%) |
| Best Practices | 12 | 118 | 33% | 100% | Apply (33%), Analyze (33%), Evaluate (17%) |
| Advanced Topics | 8 | 110 | 25% | 100% | Analyze (38%), Evaluate (38%) |

## Bloom's Taxonomy Distribution

Actual vs. category-weighted target (each category's target percentages from the FAQ generator
skill, weighted by that category's question count and summed):

| Level | Actual | Target | Deviation |
|---|---|---|---|
| Remember | 20.9% (19) | 21.6% | −0.7% ✓ |
| Understand | 34.1% (31) | 31.1% | +3.0% ✓ |
| Apply | 22.0% (20) | 24.8% | −2.8% ✓ |
| Analyze | 15.4% (14) | 14.5% | +0.9% ✓ |
| Evaluate | 5.5% (5) | 4.6% | +0.9% ✓ |
| Create | 2.2% (2) | 3.3% | −1.1% ✓ |

Total absolute deviation: 9.4 percentage points (0–10% band).

**Bloom's Distribution Score: 25/25** — every category individually tracks its target range
(Getting Started skews Remember/Understand as intended; Advanced Topics skews Analyze/Evaluate/
Create as intended), and the aggregate deviation is well inside the excellent band.

## Answer Quality Analysis

- **Examples:** 40/91 (44%) — Target: 40%+ ✓
- **Links:** 91/91 (100%) — Target: 60%+ ✓
- **Avg Length:** 122 words (min 95, max 191) — Target: 100–300 ✓
- **Complete Answers:** 91/91 (100%) — every answer directly and fully addresses its question ✓
- **Zero anchor links:** confirmed by automated scan (`grep -oE '\]\([^)]*#[^)]*\)'` → 0 matches) ✓
- **Zero duplicate questions:** confirmed by automated scan ✓
- **All 28 distinct link targets verified to exist on disk** ✓

**Answer Quality Score: 25/25**

## Concept Coverage

Two coverage figures are reported because this course maintains two overlapping concept
inventories: the 200-concept course-planning DAG (`concept-dependencies.csv`, used for
prerequisite sequencing) and the 550-term glossary (`glossary.md`, the specific vocabulary
actually used in chapter prose). Coverage below is computed by exact (hyphen/apostrophe-normalized)
substring matching of each concept label against the full FAQ text — a conservative method that
undercounts true thematic coverage. For example, "Radix-4 FFT" is flagged as uncovered even though
[What are radix-4 and split-radix FFTs, and how do they compare to radix-2?](../faq.md) discusses
it directly, because the FAQ's phrasing ("radix-4 and split-radix FFTs") never places the words
"radix-4" and "FFT" immediately adjacent.

**Coverage of the 200-concept core learning graph: 24.0% (48/200)**

**Coverage of the 550-term glossary: 26.7% (147/550)**

**High-centrality concepts (top 25 by number of downstream dependents) are covered much more
completely: 16/25 (64%)** — every top-7 concept (Fast Fourier Transform, ARM Cortex M Series,
Windowing Functions, Complex Numbers, Discrete Fourier Transform, Cooley-Tukey Algorithm, Time
Domain) is directly covered. The nine gaps in the top 25 are umbrella/category-level labels from
the planning DAG (e.g. "Performance Metrics," "Statistical Analysis," "Fixed Point Numbers") whose
*specific* sub-concepts are covered under more concrete names (execution time, throughput, mean,
standard deviation, Q15, Q31) rather than the umbrella term itself.

**Why coverage is lower than a typical FAQ:** this course defines an unusually large vocabulary —
550 glossary terms across 27 chapters — for a curated, 91-question FAQ to name-check individually.
A FAQ answering common student questions naturally clusters around the ~50-80 concepts students
actually ask about, while granular implementation details (e.g. "Cache Line Size," "Structure
Packing," specific register names) are better served by the glossary itself, which already exists
and is comprehensive. Treat the number below as a starting point for expansion, not a defect to
fix all at once.

Coverage Score: 10/30 (below the 50% threshold under the skill's literal scoring rubric)

See [faq-coverage-gaps.md](faq-coverage-gaps.md) for the full prioritized gap list.

## Organization Quality

- Logical categorization (6 categories, each internally coherent): ✓
- Progressive difficulty (Getting Started → Core Concepts → Technical Details → Common Challenges
  → Best Practices → Advanced Topics): ✓
- No duplicate questions (automated scan, 0 found): ✓
- Clear, specific, searchable questions (all end in "?", average 11 words): ✓

Organization Score: 20/20

## Overall Quality Score: 80/100

- Coverage: 10/30
- Bloom's Distribution: 25/25
- Answer Quality: 25/25
- Organization: 20/20

## Recommendations

### High Priority

1. If deeper concept-level coverage is a goal, add a second wave of Technical Detail and Core
   Concept questions targeting the 12 high-centrality gaps identified in
   [faq-coverage-gaps.md](faq-coverage-gaps.md): Performance Metrics, Statistical Analysis,
   Compiler Optimization Levels, Fixed Point Numbers, Q Format Notation, Input Signal Generation,
   Sine Wave Representation, DSP Extension Instructions, Memory Alignment, Data Layout, Test Case
   Design, and Linking Libraries.
2. Re-run the coverage check after Instructor's Guide content
   (`docs/instructors-guide/`, currently untracked/in progress) stabilizes, since it may surface
   additional student-facing questions worth folding into this FAQ.

### Medium Priority

1. Consider 2–3 more examples in the Best Practice and Advanced Topic categories (currently 33%
   and 25% respectively) to bring every category above the 40% target individually, even though
   the aggregate already clears it.
2. If a future revision adds a "Hardware & Wiring" question or two (e.g., a wiring diagram
   reference for the OLED/microphone/buttons), link directly to any wiring-diagram assets the
   course may add later.

### Low Priority

1. The 100-word-per-answer floor is met but tight on a few Getting Started questions; a light
   pass to add one more concrete detail to the shortest 5–10 answers would improve consistency.
2. Consider a "Search Keywords" appendix or per-question tag list in a future revision if this FAQ
   is wired into a site search widget, using the `keywords` field already present in
   `faq-chatbot-training.json`.
