# FFT Benchmarking Learning Graph

## Overview

This directory contains a complete **learning graph** for the FFT Benchmarking course, generated using the Learning Graph Generator v0.03. The graph represents 200 interconnected concepts organized into a pedagogically sound structure.

## Graph Statistics

- **Total Concepts**: 200
- **Foundational Concepts**: 10 (no prerequisites)
- **Total Dependencies**: 348 directed edges
- **Taxonomy Categories**: 12
- **Maximum Chain Length**: 15 concepts
- **Connected Components**: 1 (all concepts connected)

## Generated Files

### Core Outputs

1. **[concept-list.md](./concept-list.md)** - List of 200 concept labels
   - Organized by taxonomy category
   - Title Case format (max 32 characters)
   - Covers mathematical foundations through practical implementation

2. **[learning-graph.csv](./learning-graph.csv)** - Dependency graph in CSV format
   - Columns: ConceptID, ConceptLabel, Dependencies, TaxonomyID
   - Dependencies use pipe-delimited format (e.g., "1|4|5")
   - Valid DAG structure (no cycles)
   - Ready for import into spreadsheet tools

3. **[learning-graph.json](./learning-graph.json)** - JSON format for visualization tools
   - Nodes: 200 concepts with ID, label, and taxonomy
   - Edges: 348 directed edges representing prerequisites
   - Metadata: Course title, description, taxonomy definitions
   - Compatible with vis.js and other graph visualization libraries

### Analysis & Documentation

4. **[course-description-assessment.md](./course-description-assessment.md)** - Course content depth analysis
   - Quality score: 98/100
   - Validates course has sufficient depth for 200 concepts
   - Identifies content strengths and suggestions

5. **[quality-metrics.md](./quality-metrics.md)** - Graph structure validation
   - DAG validation (no cycles detected)
   - Foundational concepts: 10 entry points
   - Indegree distribution analysis
   - Longest dependency chain: 15 levels

6. **[concept-taxonomy.md](./concept-taxonomy.md)** - Category organization
   - 12 balanced categories (6% - 12% each)
   - All categories under 30% threshold
   - Pedagogical flow recommendations
   - Clear 4-letter abbreviations

7. **[taxonomy-distribution.md](./taxonomy-distribution.md)** - Statistical breakdown
   - Detailed concept listing by category
   - Visual distribution table
   - Balance verification

## Taxonomy Categories

| Code | Name | Concepts | % |
|------|------|----------|---|
| MATH | Mathematical Foundations | 16 | 8.0% |
| SIGP | Signal Processing | 16 | 8.0% |
| FOUR | Fourier Theory | 16 | 8.0% |
| FFTA | FFT Algorithm | 24 | 12.0% |
| HARD | Hardware Platforms | 16 | 8.0% |
| DSPI | DSP Instructions | 16 | 8.0% |
| PROG | Programming | 16 | 8.0% |
| LIBS | FFT Libraries | 12 | 6.0% |
| BNCH | Benchmarking | 18 | 9.0% |
| PERF | Performance Optimization | 14 | 7.0% |
| PIPE | Signal Pipeline | 12 | 6.0% |
| VAPP | Visualization & Applications | 24 | 12.0% |

## Quality Metrics Summary

- **DAG Structure:** Valid - no cycles
- **Balanced Distribution:** All categories < 30%
- **Foundational Base:** 10 entry-point concepts
- **Average Dependencies:** 1.83 per concept
- **Clear Progression:** Max chain length of 15 levels
- **High Connectivity:** Single connected component

## Foundational Concepts

These 10 concepts have no prerequisites and serve as entry points:

1. Complex Numbers
2. Sine Wave
3. Jean Baptiste Fourier
4. Microcontroller
5. Fixed Point Arithmetic
6. C Language
7. Assembly Language
8. Python Language
9. Benchmarking
10. Data Visualization

## Longest Learning Path

The longest dependency chain in the graph (15 concepts):

1. Sine Wave → Cosine Wave → Periodic Functions → Harmonics
2. → Fourier Series → Continuous Fourier Transform
3. → Discrete Fourier Transform → DFT Definition → DFT Complexity
4. → FFT Algorithm → FFT History → Cooley Tukey Algorithm
5. → Radix-2 FFT → Radix-4 FFT → Split Radix FFT

## Usage

### For Course Development

1. Use **learning-graph.csv** to plan weekly modules
2. Follow dependency chains to order lessons
3. Start with foundational concepts (zero dependencies)
4. Build assessments based on taxonomy categories

### For Visualization

Load **learning-graph.json** into visualization tools:

- vis.js network diagram
- D3.js force-directed graph
- Graphviz DOT format
- Neo4j graph database

### Python Utilities

```bash
# Validate graph structure
python analyze-graph.py learning-graph.csv quality-metrics.md

# Generate taxonomy distribution report
python taxonomy-distribution.py learning-graph.csv taxonomy-distribution.md taxonomy-names.json

# Convert CSV to JSON
python csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json
```

## Pedagogical Recommendations

### 10-Week Course Structure

- **Weeks 1-2:** MATH and SIGP foundations (32 concepts)
- **Weeks 3-4:** FOUR and FFTA algorithm concepts (40 concepts)
- **Weeks 5-6:** HARD and DSPI hardware (32 concepts)
- **Week 7:** PROG programming and LIBS libraries (28 concepts)
- **Week 8:** BNCH benchmarking methodology (18 concepts)
- **Week 9:** PERF optimization and PIPE signal pipeline (26 concepts)
- **Week 10:** VAPP applications and capstone project (24 concepts)

### Learning Paths

- **Mathematics-First Path:** MATH → FOUR → SIGP → FFTA → BNCH
- **Hardware-First Path:** HARD → DSPI → PROG → LIBS → BNCH
- **Practical-First Path:** LIBS → BNCH → PERF → VAPP

## Next Steps

1. Review and refine concept list and dependencies
2. Create interactive visualization
3. Develop detailed lesson plans per concept
4. Design assessments aligned with Bloom's taxonomy
5. Build capstone project integrating concepts
6. Create MkDocs pages for each concept

## References

- Learning Graph Generator: https://github.com/dmccreary/learning-graphs
- Graph Visualization: vis.js, D3.js, Cytoscape.js
- Bloom's Taxonomy: Remember → Understand → Apply → Analyze → Evaluate → Create

## License

Same as parent repository: Creative Commons ShareAlike Attribution Noncommercial
