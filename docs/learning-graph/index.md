# FFT Benchmarking Learning Graph

## Overview

This directory contains a complete **learning graph** for the FFT Benchmarking course, generated using the Learning Graph Generator methodology. The graph represents 200 interconnected concepts organized into a pedagogically sound structure.

## Generated Files

### Core Outputs

1. **course-concepts-v1.md** - List of 200 concept labels
   - Organized by taxonomy category
   - Title Case format (max 32 characters)
   - Covers mathematical foundations through practical implementation

2. **concept-dependencies.csv** - Dependency graph in CSV format
   - Columns: ConceptID, ConceptLabel, Dependencies, TaxonomyID
   - Dependencies use pipe-delimited format (e.g., "1|4|5")
   - Valid DAG structure (no cycles)
   - Ready for import into spreadsheet tools

3. **learning-graph.json** - JSON format for visualization tools
   - Nodes: 200 concepts with ID, label, and taxonomy
   - Links: 229 directed edges representing prerequisites
   - Metadata: Course title, description, taxonomy definitions
   - Compatible with D3.js, vis.js, and other graph visualization libraries

### Analysis & Documentation

4. **quality-assessment.md** - Course content depth analysis
   - Validates course has sufficient depth for 200 concepts
   - Compares against similar courses
   - Identifies content gaps and strengths

5. **quality-metrics.md** - Graph structure validation
   - ✓ DAG validation (no cycles detected)
   - Foundational concepts: 10 entry points
   - Indegree distribution analysis
   - Longest dependency chains: 7 levels
   - Connectivity: 94% in main component

6. **concept-taxonomy.md** - Category organization
   - 9 balanced categories (3.5% - 15% each)
   - All categories under 30% threshold ✓
   - Pedagogical flow recommendations
   - Clear 3-5 letter abbreviations

7. **taxonomy-distribution.md** - Statistical breakdown
   - Detailed concept listing by category
   - Visual distribution table
   - Balance verification

## Taxonomy Categories

| Code  | Name                            | Concepts | % |
|-------|----------------------------------|----------|---|
| MATH  | Mathematical Foundations         | 20       | 10.0% |
| FFT   | FFT Algorithm & Implementation   | 25       | 12.5% |
| SIG   | Signal Processing                | 25       | 12.5% |
| ARM   | ARM Architecture & DSP Hardware  | 30       | 15.0% |
| MEM   | Memory Management & Optimization | 25       | 12.5% |
| FXP   | Fixed-Point Arithmetic           | 18       | 9.0% |
| BENCH | Benchmarking & Testing           | 30       | 15.0% |
| LIB   | FFT Libraries & Integration      | 20       | 10.0% |
| OPT   | Optimization Techniques          | 7        | 3.5% |

## Quality Metrics Summary

✓ **DAG Structure:** Valid - no cycles
✓ **Balanced Distribution:** All categories < 30%
✓ **Foundational Base:** 10 entry-point concepts
✓ **Manageable Complexity:** Avg 1.15 dependencies per concept
✓ **Clear Progression:** Max chain length of 7 levels
✓ **High Connectivity:** 94% in main component

## Usage

### For Course Development

1. Use **concept-dependencies.csv** to plan weekly modules
2. Follow dependency chains to order lessons
3. Start with foundational concepts (zero dependencies)
4. Build assessments based on taxonomy categories

### For Visualization

1. Load **learning-graph.json** into visualization tools:
   - D3.js force-directed graph
   - vis.js network diagram
   - Graphviz DOT format
   - Neo4j graph database

### For Analysis

1. Run **analyze-graph.py** to validate structure
2. Run **taxonomy-distribution.py** for category stats
3. Run **convert-to-json.py** to regenerate JSON

## Python Utilities

Three Python scripts are provided in the repository root:

```bash
# Validate graph structure
python3 analyze-graph.py

# Generate taxonomy distribution report
python3 taxonomy-distribution.py > docs/taxonomy-distribution.md

# Convert CSV to JSON
python3 convert-to-json.py
```

## Pedagogical Recommendations

### 10-Week Course Structure

**Weeks 1-2:** MATH foundations (20 concepts)
**Weeks 3-4:** FFT + SIG (50 concepts)
**Weeks 5-6:** ARM + MEM (55 concepts)
**Week 7:** FXP + BENCH part 1 (33 concepts)
**Week 8:** BENCH part 2 + LIB (27 concepts)
**Weeks 9-10:** OPT + Capstone project (15 concepts)

### Learning Paths

**Mathematics-First Path:** MATH → FFT → SIG → BENCH
**Hardware-First Path:** ARM → MEM → FXP → BENCH
**Practical-First Path:** LIB → SIG → BENCH → FFT

## Visualization Ideas

1. **Interactive Network Graph**
   - Color-code by taxonomy
   - Show dependencies on hover
   - Filter by category
   - Highlight learning paths

2. **Dependency Matrix**
   - Heatmap showing concept relationships
   - Identify prerequisite clusters
   - Spot isolated concepts

3. **Learning Path Timeline**
   - Linear visualization by dependency level
   - Show parallel learning opportunities
   - Estimate time per concept

4. **Category Distribution Sunburst**
   - Hierarchical view
   - Show proportions visually
   - Drill down into categories

## Next Steps

1. ✓ Generate learning graph (complete)
2. ☐ Create interactive visualization
3. ☐ Develop detailed lesson plans per concept
4. ☐ Design assessments aligned with Bloom's taxonomy
5. ☐ Build capstone project integrating concepts
6. ☐ Create MkDocs pages for each concept

## References

- Learning Graph Generator: https://github.com/dmccreary/learning-graphs/tree/main/skills/learning-graph-generator
- Graph Visualization: D3.js, vis.js, Cytoscape.js
- Bloom's Taxonomy: Knowledge → Comprehension → Application → Analysis → Synthesis → Evaluation

## License

Same as parent repository: Creative Commons ShareAlike Attribution Noncommercial