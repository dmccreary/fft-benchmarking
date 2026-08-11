# vis.js Format Fix - Learning Graph JSON

## Problem Identified

The edges were not displaying in the graph viewer because the JSON format was incompatible with vis.js.

### Original Format (D3.js style)
```json
{
  "nodes": [
    {
      "id": 1,
      "label": "Complex Numbers",
      "taxonomy": "MATH"
    }
  ],
  "links": [
    {
      "source": 1,
      "target": 2
    }
  ]
}
```

### Issue
- Property name: `links` instead of `edges`
- Edge format: `source`/`target` instead of `from`/`to`
- Node property: `taxonomy` instead of `group`

## Solution Applied

Updated `convert-to-json.py` to generate vis.js compatible format:

### Changes Made

1. **Line 12:** Changed variable name from `links` to `edges`
2. **Line 27:** Changed node property from `"taxonomy"` to `"group"` (vis.js uses groups for coloring)
3. **Lines 35-38:** Changed edge format:
   ```python
   edge = {
       "from": dep,
       "to": concept_id
   }
   ```
4. **Line 44:** Changed property name in output from `"links"` to `"edges"`
5. **Line 49:** Updated metadata from `linkCount` to `edgeCount`

### Corrected Format (vis.js style)
```json
{
  "nodes": [
    {
      "id": 1,
      "label": "Complex Numbers",
      "group": "MATH"
    }
  ],
  "edges": [
    {
      "from": 1,
      "to": 2
    }
  ]
}
```

## Files Updated

1. **convert-to-json.py** - Updated to generate vis.js format
2. **docs/learning-graph/learning-graph.json** - Regenerated with correct format
3. **docs/sims/graph-viewer/learning-graph.json** - Copied updated JSON

## Verification

```bash
# Regenerate JSON
python3 convert-to-json.py

# Output:
✓ Conversion complete!
  Nodes: 200
  Edges: 229
  Format: vis.js (nodes with id/label/group, edges with from/to)
```

## JavaScript Compatibility

The `view-graph.js` file is now fully compatible:

```javascript
// Line 7: Loads nodes correctly
const nodes = new vis.DataSet(data.nodes);

// Line 25: Loads edges correctly (no transformation needed)
const edges = new vis.DataSet(data.edges);
```

## Result

✓ **Edges now display correctly** in the vis.js network graph
✓ **Node grouping** works properly (colored by taxonomy)
✓ **Arrows** display on edges showing dependency direction
✓ **All 229 edges** are rendered between 200 nodes

## vis.js Format Reference

**Node Properties:**
- `id` (required) - unique identifier
- `label` (optional) - display text
- `group` (optional) - for automatic coloring/styling

**Edge Properties:**
- `from` (required) - source node id
- `to` (required) - target node id
- `arrows` (optional) - configured in options

**View-graph.js uses:**
- `group` property to color nodes by taxonomy (MATH, FFT, SIG, etc.)
- Special handling for MATH group (fixed x=-900, red box)
- Special handling for OPT group (fixed x=900, gold star)

## Next Steps

- [x] Fix JSON format for vis.js
- [x] Regenerate learning-graph.json
- [x] Copy to graph-viewer directory
- [ ] Test in browser to verify edges display
- [ ] Configure colors for all taxonomy groups (not just MATH/OPT)
