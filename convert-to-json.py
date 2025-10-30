#!/usr/bin/env python3
"""
Convert concept dependencies CSV to JSON format for learning graph visualization.
"""

import csv
import json

def convert_csv_to_json(csv_file, json_file):
    """Convert CSV to JSON format compatible with vis.js network library."""
    nodes = []
    edges = []

    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)

        for row in reader:
            concept_id = int(row['ConceptID'])
            label = row['ConceptLabel']
            taxonomy = row['TaxonomyID']
            deps = row['Dependencies'].strip()

            # Create node (vis.js format)
            node = {
                "id": concept_id,
                "label": label,
                "group": taxonomy
            }
            nodes.append(node)

            # Create edges from dependencies (vis.js format: from/to)
            if deps:
                dependencies = [int(d) for d in deps.split('|')]
                for dep in dependencies:
                    edge = {
                        "from": dep,
                        "to": concept_id
                    }
                    edges.append(edge)

    # Create the graph structure (vis.js format)
    graph = {
        "nodes": nodes,
        "edges": edges,
        "metadata": {
            "title": "FFT Benchmarking Course Learning Graph",
            "description": "200 interconnected concepts for a 10-week course on FFT benchmarking",
            "nodeCount": len(nodes),
            "edgeCount": len(edges),
            "taxonomies": {
                "MATH": "Mathematical Foundations",
                "FFT": "FFT Algorithm & Implementation",
                "SIG": "Signal Processing",
                "ARM": "ARM Architecture & DSP Hardware",
                "MEM": "Memory Management & Optimization",
                "FXP": "Fixed-Point Arithmetic",
                "BENCH": "Benchmarking & Testing",
                "LIB": "FFT Libraries & Integration",
                "OPT": "Optimization Techniques"
            }
        }
    }

    # Write to JSON file
    with open(json_file, 'w') as f:
        json.dump(graph, f, indent=2)

    return graph

def main():
    csv_file = 'docs/learning-graph/concept-dependencies.csv'
    json_file = 'docs/learning-graph/learning-graph.json'

    print("Converting CSV to JSON...")
    graph = convert_csv_to_json(csv_file, json_file)

    print(f"\n✓ Conversion complete!")
    print(f"  Input:  {csv_file}")
    print(f"  Output: {json_file}")
    print(f"\n  Nodes: {len(graph['nodes'])}")
    print(f"  Edges: {len(graph['edges'])}")
    print(f"  Taxonomies: {len(graph['metadata']['taxonomies'])}")
    print(f"\n  Format: vis.js (nodes with id/label/group, edges with from/to)")

if __name__ == '__main__':
    main()
