// Global variables
let network = null;
let allNodes = null;
let allEdges = null;
let graphData = null;
let visibleGroups = new Set();

function initGraph() {
    fetch('learning-graph.json')
        .then(response => response.json())
        .then(data => {
            graphData = data;

            // Initialize all groups as visible
            if (data.groups) {
                Object.keys(data.groups).forEach(g => visibleGroups.add(g));
            }

            // Build legend from groups
            buildLegend(data.groups);

            // Process nodes with group colors
            const processedNodes = data.nodes.map(node => {
                const groupInfo = data.groups && data.groups[node.group];
                return {
                    ...node,
                    color: groupInfo ? groupInfo.color : 'lightgray',
                    font: groupInfo && groupInfo.font ? groupInfo.font : { color: 'black' }
                };
            });

            allNodes = new vis.DataSet(processedNodes);
            allEdges = new vis.DataSet(data.edges);

            // Count foundational nodes (no outgoing dependencies)
            const nodesWithDeps = new Set(data.edges.map(e => e.from));
            const foundationalCount = data.nodes.filter(n => !nodesWithDeps.has(n.id)).length;
            document.getElementById('foundational-count').textContent = foundationalCount;

            // Create network
            const container = document.getElementById('mynetwork');
            const networkData = {
                nodes: allNodes,
                edges: allEdges
            };

            const options = {
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
                        iterations: 1500,
                        updateInterval: 50
                    }
                },
                layout: {
                    improvedLayout: true
                },
                edges: {
                    arrows: {
                        to: { enabled: true, type: 'arrow' }
                    },
                    smooth: {
                        type: 'continuous'
                    },
                    color: { color: '#888', opacity: 0.6 }
                },
                nodes: {
                    shape: 'dot',
                    size: 16,
                    font: {
                        size: 12,
                        color: 'black'
                    },
                    borderWidth: 1,
                    borderWidthSelected: 3
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 200
                }
            };

            network = new vis.Network(container, networkData, options);

            // Stop physics after stabilization
            network.on("stabilizationIterationsDone", function() {
                network.setOptions({ physics: false });
            });

            // Fallback timeout
            setTimeout(() => {
                network.stopSimulation();
                network.setOptions({ physics: false });
            }, 8000);

            // Update stats
            updateStats();
        })
        .catch(error => {
            console.error("Error loading learning-graph.json:", error);
            document.getElementById('mynetwork').innerHTML =
                '<p style="color: red; padding: 20px;">Error loading graph data. Check console for details.</p>';
        });
}

function buildLegend(groups) {
    const container = document.getElementById('legend-container');
    if (!groups) {
        container.innerHTML = '<p>No categories defined</p>';
        return;
    }

    container.innerHTML = '';

    Object.entries(groups).forEach(([groupId, groupInfo]) => {
        const div = document.createElement('div');
        div.className = 'legend-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `chk-${groupId}`;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => toggleGroup(groupId, checkbox.checked));

        const label = document.createElement('label');
        label.htmlFor = `chk-${groupId}`;

        const colorBox = document.createElement('span');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = groupInfo.color;
        colorBox.style.marginRight = '5px';

        const text = document.createTextNode(groupInfo.classifierName || groupId);

        label.appendChild(colorBox);
        label.appendChild(text);

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

function toggleGroup(groupId, visible) {
    if (visible) {
        visibleGroups.add(groupId);
    } else {
        visibleGroups.delete(groupId);
    }
    filterGraph();
}

function filterGraph() {
    if (!allNodes || !allEdges) return;

    // Get IDs of visible nodes
    const visibleNodeIds = new Set();
    allNodes.forEach(node => {
        if (visibleGroups.has(node.group)) {
            visibleNodeIds.add(node.id);
        }
    });

    // Update node visibility
    allNodes.forEach(node => {
        allNodes.update({
            id: node.id,
            hidden: !visibleGroups.has(node.group)
        });
    });

    // Update edge visibility (hide if either endpoint is hidden)
    allEdges.forEach(edge => {
        const visible = visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to);
        allEdges.update({
            id: edge.id,
            hidden: !visible
        });
    });

    updateStats();
}

function updateStats() {
    if (!allNodes || !allEdges) return;

    let visibleNodes = 0;
    let visibleEdges = 0;

    allNodes.forEach(node => {
        if (!node.hidden) visibleNodes++;
    });

    allEdges.forEach(edge => {
        if (!edge.hidden) visibleEdges++;
    });

    document.getElementById('visible-nodes').textContent = visibleNodes;
    document.getElementById('visible-edges').textContent = visibleEdges;
}

function checkAll() {
    if (!graphData || !graphData.groups) return;

    Object.keys(graphData.groups).forEach(groupId => {
        visibleGroups.add(groupId);
        const checkbox = document.getElementById(`chk-${groupId}`);
        if (checkbox) checkbox.checked = true;
    });

    filterGraph();
}

function uncheckAll() {
    visibleGroups.clear();

    document.querySelectorAll('#legend-container input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    filterGraph();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function searchConcepts(query) {
    const resultsDiv = document.getElementById('search-results');

    if (!query || query.length < 2 || !allNodes) {
        resultsDiv.style.display = 'none';
        return;
    }

    const queryLower = query.toLowerCase();
    const matches = [];

    allNodes.forEach(node => {
        if (node.label.toLowerCase().includes(queryLower)) {
            matches.push(node);
        }
    });

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="search-result-item">No matches found</div>';
        resultsDiv.style.display = 'block';
        return;
    }

    resultsDiv.innerHTML = matches.slice(0, 10).map(node => {
        const groupInfo = graphData.groups && graphData.groups[node.group];
        const categoryName = groupInfo ? groupInfo.classifierName : node.group;
        return `<div class="search-result-item" onclick="selectNode(${node.id})">
            <strong>${node.label}</strong>
            <br><small style="color: #666;">${categoryName}</small>
        </div>`;
    }).join('');

    if (matches.length > 10) {
        resultsDiv.innerHTML += `<div class="search-result-item" style="color: #999;">...and ${matches.length - 10} more</div>`;
    }

    resultsDiv.style.display = 'block';
}

function selectNode(nodeId) {
    if (!network) return;

    // Hide search results
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('search-input').value = '';

    // Focus on the node
    network.focus(nodeId, {
        scale: 1.5,
        animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
        }
    });

    // Select the node
    network.selectNodes([nodeId]);
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer.contains(e.target)) {
        document.getElementById('search-results').style.display = 'none';
    }
});
