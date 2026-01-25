#!/usr/bin/env python3
"""
Generate taxonomy distribution analysis for the learning graph.
"""

import csv
from collections import defaultdict

def analyze_taxonomy_distribution(csv_file):
    """Analyze taxonomy distribution from CSV file."""
    taxonomy_counts = defaultdict(int)
    concepts_by_taxonomy = defaultdict(list)

    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        total_concepts = 0

        for row in reader:
            taxonomy = row['TaxonomyID']
            label = row['ConceptLabel']
            concept_id = row['ConceptID']

            taxonomy_counts[taxonomy] += 1
            concepts_by_taxonomy[taxonomy].append((concept_id, label))
            total_concepts += 1

    return taxonomy_counts, concepts_by_taxonomy, total_concepts

def main():
    csv_file = 'docs/concept-dependencies.csv'

    print("Analyzing taxonomy distribution...")
    taxonomy_counts, concepts_by_taxonomy, total = analyze_taxonomy_distribution(csv_file)

    print(f"\n{'='*70}")
    print("TAXONOMY DISTRIBUTION ANALYSIS")
    print(f"{'='*70}\n")

    print(f"Total Concepts: {total}\n")

    # Sort by count descending
    sorted_taxonomy = sorted(taxonomy_counts.items(), key=lambda x: x[1], reverse=True)

    print("Distribution by Category:")
    print(f"{'Category':<8} | {'Count':>5} | {'Percentage':>10} | Status")
    print("-" * 70)

    for taxonomy, count in sorted_taxonomy:
        percentage = (count / total) * 100
        status = "✓" if percentage < 30 else "⚠"
        print(f"{taxonomy:<8} | {count:>5} | {percentage:>9.1f}% | {status}")

    print("\n" + "=" * 70)

    # Check for balance
    max_percentage = (max(taxonomy_counts.values()) / total) * 100
    if max_percentage < 30:
        print("✓ All categories are under 30% threshold - BALANCED")
    else:
        print("⚠ Some categories exceed 30% threshold")

    print(f"\nLargest category: {max_percentage:.1f}%")
    print(f"Number of categories: {len(taxonomy_counts)}")
    print("=" * 70)

    # Detailed breakdown
    print("\n\nDetailed Concept Listing by Category:")
    print("=" * 70)

    for taxonomy, count in sorted_taxonomy:
        percentage = (count / total) * 100
        print(f"\n{taxonomy} - {count} concepts ({percentage:.1f}%)")
        print("-" * 70)

        for concept_id, label in concepts_by_taxonomy[taxonomy]:
            print(f"  {concept_id:>3}. {label}")

if __name__ == '__main__':
    main()
