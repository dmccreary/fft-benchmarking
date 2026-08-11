// Thonny REPL Workflow
// CANVAS_HEIGHT: 500
// Shows the round trip of code and text between Thonny on a laptop and the
// Pico 2 over USB, so students can explain why "Run" differs from typing
// directly into the Shell.

const SOFTWARE = { background: '#bbdefb', border: '#1565c0' };
const HARDWARE = { background: '#ffcc80', border: '#e65100' };
const LINK = { background: '#eceff1', border: '#607d8b' };
const DIM = { background: '#f5f5f5', border: '#cfd8dc' };

const EDGE_NORMAL = '#455a64';
const EDGE_HIGHLIGHT = '#d32f2f';
const EDGE_DIM = '#e0e0e0';

// One-sentence definitions drawn from the chapter vocabulary.
const definitions = {
  editor: ['Editor Pane',
    'The upper Thonny pane where you write and save a .py script file; nothing ' +
    'in it runs until you tell Thonny to run it.'],
  run: ['Run Button / F5',
    'The command that sends the whole saved script to the board at once and then ' +
    'hands control back to the Shell.'],
  shell: ['Shell Panel (REPL)',
    'The Read-Eval-Print Loop: the >>> prompt that reads one statement, evaluates ' +
    'it on the board, prints the result, and loops.'],
  usb: ['USB Serial Connection',
    'The physical cable carrying a serial character stream in both directions: ' +
    'code down to the board, text back to the laptop.'],
  board: ['Pico 2 Board',
    'The RP2350 microcontroller running MicroPython firmware; it is what actually ' +
    'executes every statement you type or run.'],
  print: ['print() output',
    'Text produced on the board and sent back up the serial link, which is why it ' +
    'appears in the Shell and not on the board itself.'],
  direct: ['Type directly here',
    'Typing at the >>> prompt sends a single statement straight to the board with ' +
    'no file, no save, and no Run step.']
};

const nodeData = [
  { id: 'editor', label: 'Editor Pane\n(your .py script)', x: -300, y: -150, group: 'software' },
  { id: 'run',    label: 'Run Button / F5',               x: -300, y: -40,  group: 'link' },
  { id: 'shell',  label: 'Shell Panel (REPL)\n>>>',       x: -110, y: -40,  group: 'software' },
  { id: 'usb',    label: 'USB Serial\nConnection',        x: 70,   y: -40,  group: 'link' },
  { id: 'board',  label: 'Pico 2 Board\n(MicroPython)',   x: 250,  y: -40,  group: 'hardware' },
  { id: 'print',  label: 'print() output',                x: 70,   y: 90,   group: 'link' },
  { id: 'direct', label: 'Type directly here',            x: -300, y: 90,   group: 'link' }
];

// Bounding box of the laid-out graph in canvas units, including node widths.
const GRAPH_W = 760;
const GRAPH_H = 340;
const GRAPH_CX = -25;
const GRAPH_CY = -30;

const edgeData = [
  { id: 'e1', from: 'editor', to: 'run',   label: 'saved script', path: 'script' },
  { id: 'e2', from: 'run',    to: 'shell', label: 'code',         path: 'script' },
  { id: 'e3', from: 'shell',  to: 'usb',   label: 'code',         path: 'both' },
  { id: 'e4', from: 'usb',    to: 'board', label: 'code',         path: 'both' },
  { id: 'e5', from: 'board',  to: 'print', label: 'text output',  path: 'both' },
  { id: 'e6', from: 'print',  to: 'shell', label: 'printed text returns here', path: 'both' },
  { id: 'e7', from: 'direct', to: 'shell', label: 'typed command', path: 'direct' }
];

const groupColors = { software: SOFTWARE, hardware: HARDWARE, link: LINK };

let nodes, edges, network;
let activePath = 'none';

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function buildNodes() {
  return nodeData.map(n => ({
    id: n.id,
    label: n.label,
    x: n.x,
    y: n.y,
    color: { background: groupColors[n.group].background,
             border: groupColors[n.group].border },
    font: { color: '#212121', size: 15, multi: false }
  }));
}

function buildEdges() {
  return edgeData.map(e => ({
    id: e.id,
    from: e.from,
    to: e.to,
    label: e.label,
    color: { color: EDGE_NORMAL },
    width: 2,
    font: { size: 13, align: 'horizontal', background: 'aliceblue' }
  }));
}

function initializeNetwork() {
  nodes = new vis.DataSet(buildNodes());
  edges = new vis.DataSet(buildEdges());

  // Mouse pan/zoom stays off inside an iframe so the page keeps its scroll.
  const enableMouseInteraction = !isInIframe();

  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      selectConnectedEdges: false,
      hover: true,
      dragNodes: false,
      dragView: enableMouseInteraction,
      zoomView: enableMouseInteraction,
      navigationButtons: true,
      keyboard: { enabled: false }
    },
    nodes: {
      shape: 'box',
      margin: 10,
      widthConstraint: { maximum: 170 },
      font: { size: 15, face: 'Arial' },
      borderWidth: 3,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 1.1 } },
      width: 2,
      smooth: { type: 'curvedCW', roundness: 0.12 }
    }
  };

  network = new vis.Network(document.getElementById('network'),
                            { nodes: nodes, edges: edges }, options);

  // Fit the graph into the area left over by the title band, the legend, and
  // the right-hand panel. Runs after vis-network finishes its auto-centering.
  network.once('afterDrawing', positionView);
  window.addEventListener('resize', positionView);

  network.on('hoverNode', params => showDefinition(params.node));
  network.on('click', params => {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    showDefinition(id);
    if (id === 'run') highlightPath('script');
    else if (id === 'direct') highlightPath('direct');
  });
}

// Scale and pan so the whole graph lands in the region that is not covered by
// the title band, the legend, or the right-hand panel — at any container width.
function positionView() {
  const container = document.getElementById('network');
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;

  const panelWidth = w < 640 ? 210 : 270;
  const availW = Math.max(180, w - panelWidth - 20);
  const topBand = 95;                     // title plus legend
  const availH = Math.max(160, h - topBand - 10);

  const scale = Math.min(availW / GRAPH_W, availH / GRAPH_H, 1);
  const targetPx = 10 + availW / 2;
  const targetPy = topBand + availH / 2;

  network.moveTo({
    position: {
      x: GRAPH_CX + (w / 2 - targetPx) / scale,
      y: GRAPH_CY + (h / 2 - targetPy) / scale
    },
    scale: scale,
    animation: false
  });
}

function showDefinition(nodeId) {
  const def = definitions[nodeId];
  if (!def) return;
  document.getElementById('status-title').textContent = def[0];
  document.getElementById('status-text').textContent = def[1];
}

// Highlight one route through the diagram and dim the other, so the contrast
// between "Run a saved script" and "type at the prompt" is visible at a glance.
function highlightPath(which) {
  activePath = which;
  const onPath = e => e.path === which || e.path === 'both';

  edges.update(edgeData.map(e => ({
    id: e.id,
    color: { color: onPath(e) ? EDGE_HIGHLIGHT : EDGE_DIM },
    width: onPath(e) ? 4 : 1,
    font: { size: 13, color: onPath(e) ? '#212121' : '#bdbdbd',
            align: 'horizontal', background: 'aliceblue' }
  })));

  const litNodes = new Set();
  edgeData.filter(onPath).forEach(e => { litNodes.add(e.from); litNodes.add(e.to); });

  nodes.update(nodeData.map(n => {
    const lit = litNodes.has(n.id);
    const base = lit ? groupColors[n.group] : DIM;
    return {
      id: n.id,
      color: { background: base.background, border: base.border },
      font: { color: lit ? '#212121' : '#b0bec5', size: 15 }
    };
  }));

  const title = which === 'script' ? 'Script path (Run / F5)' : 'Direct REPL path';
  const text = which === 'script'
    ? 'Thonny sends the entire saved file down the serial link, the board runs it ' +
      'top to bottom, and any print() output comes back up into the Shell. The ' +
      'editor and the Run command are both involved.'
    : 'You type one statement at the >>> prompt. It goes straight down the serial ' +
      'link, the board evaluates it immediately, and the result returns to the ' +
      'Shell. No file is saved and the editor is never involved.';
  document.getElementById('status-title').textContent = title;
  document.getElementById('status-text').textContent = text;
}

function reset() {
  activePath = 'none';
  nodes.update(buildNodes());
  edges.update(buildEdges());
  document.getElementById('status-title').textContent = 'Hover or click a node';
  document.getElementById('status-text').textContent =
    'Hover any box for a one-sentence definition. Click "Run Button / F5" to trace ' +
    'what happens when you run a saved script, or "Type directly here" to trace ' +
    'what happens when you type straight into the Shell.';
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('script-btn').addEventListener('click', () => highlightPath('script'));
  document.getElementById('direct-btn').addEventListener('click', () => highlightPath('direct'));
  document.getElementById('reset-btn').addEventListener('click', reset);
});
