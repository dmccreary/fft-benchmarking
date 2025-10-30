function drawGraph() {
  // Fetch the graph data from the JSON file
  fetch('learning-graph.json')
    .then(response => response.json())
    .then(data => {
      // Extract nodes from the JSON data
      const nodes = new vis.DataSet(data.nodes);
      const edges = new vis.DataSet(data.edges);

      // Build maps of incoming and outgoing edges for each node
      const incomingEdges = new Map();
      const outgoingEdges = new Map();

      // Initialize maps with empty arrays for all nodes
      data.nodes.forEach(node => {
        incomingEdges.set(node.id, []);
        outgoingEdges.set(node.id, []);
      });

      // Populate edge maps
      data.edges.forEach(edge => {
        outgoingEdges.get(edge.from).push(edge.to);
        incomingEdges.get(edge.to).push(edge.from);
      });

      // Position and style nodes based on edge patterns and groups
      nodes.forEach(function (node) {
          // use edge maps to determine incoming/outgoing edges
          const hasIncoming = incomingEdges.get(node.id).length > 0;
          const hasOutgoing = outgoingEdges.get(node.id).length > 0;

          // Place nodes with NO outgoing edges (no prerequisites) on the left (foundational concepts)
          if (node.group === "MATH") {
              node.x = -1000;
              node.fixed = { x: true, y: false };
          }

          // Place nodes with only outgoing (NO incoming) right (outcome concepts)
          else if (!hasIncoming && hasOutgoing) {
              node.x = 1000;
              node.fixed = { x: true, y: false };
          }

          // Apply group-specific styling
          if (node.group === "MATH") {
              node.shape = "box";
              node.color = "red";
              node.font = {"color": "white"};
              // Override position for MATH group if not already set
              if (!node.fixed) {
                node.x = -1000;
                node.fixed = { x: true, y: false };
              }
          } else if (node.group === "OPT") {
              node.shape = "star";
              node.color = "gold";
              // Override position for OPT group if not already set
              if (!node.fixed) {
                node.x = 1000;
                node.fixed = { x: true, y: false };
              }
          }
        });

      // Create a network
      const container = document.getElementById('mynetwork');
      const graphData = {
            nodes: nodes,
            edges: edges
      };

    // Network options
    // Configuration options
    var options = {
       physics: {
       enabled: true,
       solver: 'forceAtlas2Based',
       forceAtlas2Based: {
         gravitationalConstant: -50,
         centralGravity: 0.01,
         springLength: 100,
         springConstant: 0.08,
         damping: 0.4,
         avoidOverlap: 0.5
       },
       stabilization: {
         iterations: 2000,
         updateInterval: 50,
         onlyDynamicEdges: false,
         fit: true
      },
      adaptiveTimestep: true
    },
    layout: {
      improvedLayout: false, // must use false if any pinned nodes
    },
    edges: {
        arrows: {
          to: {
            enabled: true, // all edges have an arrow on the "to"" side
            type: 'arrow' // Options: 'arrow', 'bar', 'circle', 'triangle'
          }
        },
        smooth: {
          type: 'continuous' // Smooth edges
        }
      },
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        size: 14,
        color: 'black'
      },
      borderWidth: .5,
      borderWidthSelected: 4
    }
};

  // Initialize the network
    const network = new vis.Network(container, graphData, options);

    // Disable physics after stabilization to stop jittering
    network.on("stabilizationIterationsDone", function () {
        network.setOptions({ physics: false });
    });

    // Fallback: disable physics after a timeout if stabilization doesn't complete
    setTimeout(function() {
        network.stopSimulation();
        network.setOptions({ physics: false });
    }, 10000);
  })
  .catch(error => {
          console.error("Error loading or parsing learning-graph.json:", error);
  });
}