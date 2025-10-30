#!/usr/bin/env python3
"""
Analyze the learning graph for quality metrics and DAG validation.
"""

import csv
from collections import defaultdict, deque

def load_graph(csv_file):
    """Load the concept graph from CSV file."""
    concepts = {}
    graph = defaultdict(list)  # adjacency list
    reverse_graph = defaultdict(list)  # reverse edges for indegree

    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            concept_id = int(row['ConceptID'])
            label = row['ConceptLabel']
            deps = row['Dependencies'].strip()

            concepts[concept_id] = label

            if deps:
                dependencies = [int(d) for d in deps.split('|')]
                for dep in dependencies:
                    graph[dep].append(concept_id)
                    reverse_graph[concept_id].append(dep)

    return concepts, graph, reverse_graph

def detect_cycles(graph, n_nodes):
    """Detect cycles using DFS. Returns True if DAG (no cycles)."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * (n_nodes + 1)

    def dfs(node):
        if color[node] == GRAY:
            return False  # Cycle detected
        if color[node] == BLACK:
            return True   # Already processed

        color[node] = GRAY
        for neighbor in graph.get(node, []):
            if not dfs(neighbor):
                return False
        color[node] = BLACK
        return True

    for node in range(1, n_nodes + 1):
        if color[node] == WHITE:
            if not dfs(node):
                return False
    return True

def find_foundational_concepts(reverse_graph, n_nodes):
    """Find concepts with no dependencies (indegree = 0)."""
    foundational = []
    for node in range(1, n_nodes + 1):
        if len(reverse_graph[node]) == 0:
            foundational.append(node)
    return foundational

def calculate_indegree_stats(reverse_graph, n_nodes):
    """Calculate indegree distribution."""
    indegrees = {}
    for node in range(1, n_nodes + 1):
        indegree = len(reverse_graph[node])
        if indegree not in indegrees:
            indegrees[indegree] = 0
        indegrees[indegree] += 1
    return indegrees

def find_longest_chains(graph, foundational, concepts):
    """Find longest dependency chains using BFS from foundational concepts."""
    max_depth = {}

    for start in foundational:
        queue = deque([(start, 0)])
        visited = set()

        while queue:
            node, depth = queue.popleft()
            if node in visited:
                continue
            visited.add(node)

            max_depth[node] = max(max_depth.get(node, 0), depth)

            for neighbor in graph.get(node, []):
                queue.append((neighbor, depth + 1))

    # Find top 10 deepest chains
    sorted_by_depth = sorted(max_depth.items(), key=lambda x: x[1], reverse=True)
    top_chains = []
    for node, depth in sorted_by_depth[:10]:
        top_chains.append((concepts[node], depth))

    return top_chains

def find_disconnected_components(graph, reverse_graph, n_nodes):
    """Find disconnected subgraphs."""
    visited = set()
    components = []

    def dfs(node, component):
        if node in visited:
            return
        visited.add(node)
        component.append(node)

        # Check both forward and backward edges
        for neighbor in graph.get(node, []):
            dfs(neighbor, component)
        for neighbor in reverse_graph.get(node, []):
            dfs(neighbor, component)

    for node in range(1, n_nodes + 1):
        if node not in visited:
            component = []
            dfs(node, component)
            components.append(component)

    return components

def main():
    csv_file = 'docs/concept-dependencies.csv'

    print("Loading graph...")
    concepts, graph, reverse_graph = load_graph(csv_file)
    n_nodes = len(concepts)

    print(f"\n{'='*60}")
    print("LEARNING GRAPH QUALITY ANALYSIS")
    print(f"{'='*60}\n")

    print(f"Total Concepts: {n_nodes}")

    # Check for cycles
    print("\n1. DAG VALIDATION")
    is_dag = detect_cycles(graph, n_nodes)
    if is_dag:
        print("   ✓ Graph is a valid DAG (no cycles detected)")
    else:
        print("   ✗ ERROR: Cycles detected in graph!")

    # Find foundational concepts
    print("\n2. FOUNDATIONAL CONCEPTS (No Dependencies)")
    foundational = find_foundational_concepts(reverse_graph, n_nodes)
    print(f"   Count: {len(foundational)} concepts")
    print("   Concepts:")
    for node_id in foundational[:15]:  # Show first 15
        print(f"      {node_id}: {concepts[node_id]}")
    if len(foundational) > 15:
        print(f"      ... and {len(foundational) - 15} more")

    # Indegree analysis
    print("\n3. INDEGREE DISTRIBUTION")
    indegrees = calculate_indegree_stats(reverse_graph, n_nodes)
    print("   Dependencies | Count")
    print("   " + "-" * 25)
    for degree in sorted(indegrees.keys()):
        print(f"   {degree:12} | {indegrees[degree]}")

    # Longest chains
    print("\n4. LONGEST DEPENDENCY CHAINS")
    top_chains = find_longest_chains(graph, foundational, concepts)
    print("   Concept                          | Chain Length")
    print("   " + "-" * 50)
    for label, depth in top_chains:
        print(f"   {label:32} | {depth}")

    # Check for disconnected components
    print("\n5. CONNECTIVITY ANALYSIS")
    components = find_disconnected_components(graph, reverse_graph, n_nodes)
    if len(components) == 1:
        print("   ✓ Graph is fully connected (1 component)")
    else:
        print(f"   ⚠ Graph has {len(components)} disconnected components")
        for i, comp in enumerate(components, 1):
            print(f"      Component {i}: {len(comp)} concepts")

    # Count total edges
    total_edges = sum(len(reverse_graph[node]) for node in range(1, n_nodes + 1))
    print("\n6. GRAPH STATISTICS")
    print(f"   Total Edges: {total_edges}")
    print(f"   Average Dependencies per Concept: {total_edges / n_nodes:.2f}")
    print(f"   Graph Density: {total_edges / (n_nodes * (n_nodes - 1)):.4f}")

    print(f"\n{'='*60}")
    print("Analysis complete!")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
