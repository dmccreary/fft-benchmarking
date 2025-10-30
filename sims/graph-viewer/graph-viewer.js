function drawGraph() {
  // Fetch the graph data from the JSON file
  fetch('learning-graph.json')
    .then(response => response.json())
    .then(data => {
      // Extract nodes from the JSON data
      const nodes = new vis.DataSet(data.nodes);

      // Function to fix the x positions for foundation and goal groups after JSON load
      nodes.forEach(function (node) {
          if (node.group === "MATH") {
              node.x = -900;
              node.fixed = { x: true, y: false }; // Fix x, but let y be adjusted by physics
              node.shape = "box";
              node.color = "red";
              node.font = {"color": "white"};
          } else if (node.group === "OPT") {
              node.x = 900;
              node.fixed = { x: true, y: false }; // Fix x, but let y be adjusted by physics
              node.shape = "star";
              node.color = "gold";
          }
        });

      const edges = new vis.DataSet(data.edges);

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
       stabilization: {
         iterations: 1000,
         updateInterval: 25
      },
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
      borderWidth: 2,
      borderWidthSelected: 4
    }
};

  // Initialize the network
    const network = new vis.Network(container, graphData, options);
  })
  .catch(error => {
          console.error("Error loading or parsing learning-graph.json:", error);
  });
}