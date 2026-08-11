// Standalone Deployment Workflow
// CANVAS_HEIGHT: 500
// The ordered steps from "runs only while Thonny is attached" to "runs on
// power-up", with the mistake most often made at each step.

const ATTACHED = { background: '#bbdefb', border: '#1565c0' };
const STANDALONE = { background: '#a5d6a7', border: '#2e7d32' };
const WARN_BORDER = '#c62828';

const steps = [
  {
    id: 1, label: '1. Write and test in Thonny', phase: 'attached',
    x: 0, y: -180,
    tip: 'Get the program working while the board is still attached.',
    accomplishes: 'Proves the logic is correct while you still have the Shell, ' +
      'tracebacks, and the ability to interrupt with Ctrl-C.',
    command: 'Thonny: Run (F5) with the board selected as the interpreter.',
    mistake: 'Skipping this and deploying untested code. Once the board is ' +
      'standalone there is no traceback to read.'
  },
  {
    id: 2, label: '2. Copy drivers to /lib', phase: 'attached',
    x: 0, y: -108, canFail: true,
    tip: 'Drivers such as ssd1306.py must live on the board, not the laptop.',
    accomplishes: 'Puts every imported driver on the board\'s own filesystem so ' +
      'imports resolve without the laptop.',
    command: 'mpremote cp ssd1306.py :lib/ssd1306.py   (or Thonny: Save as → ' +
      'MicroPython device, into /lib)',
    mistake: 'Leaving the driver on the laptop. It works in Thonny because ' +
      'Thonny can reach your disk; standalone it raises ImportError and stops.'
  },
  {
    id: 3, label: '3. Copy config.py to root', phase: 'attached',
    x: 0, y: -36, canFail: true,
    tip: 'The shared configuration module must be on the board too.',
    accomplishes: 'Makes pin assignments and tuning constants available to the ' +
      'program at boot.',
    command: 'mpremote cp config.py :config.py',
    mistake: 'Copying config.py into /lib instead of the root, or forgetting it ' +
      'entirely — again an ImportError with no visible traceback.'
  },
  {
    id: 4, label: '4. Save as main.py in root', phase: 'attached',
    x: 0, y: 36, canFail: true,
    tip: 'MicroPython autoruns exactly one filename: main.py.',
    accomplishes: 'Gives the firmware the one filename it looks for after boot.py ' +
      'when the board powers up.',
    command: 'mpremote cp myprogram.py :main.py',
    mistake: 'Saving as blink.py or fft_demo.py. MicroPython only autoruns the ' +
      'exact filename main.py — any other name simply never runs.'
  },
  {
    id: 5, label: '5. Unplug, USB power only', phase: 'standalone',
    x: 0, y: 108,
    tip: 'Power without a host: the real test of standalone operation.',
    accomplishes: 'Removes the laptop from the picture entirely, so nothing can ' +
      'be silently supplied by the development host.',
    command: 'Physically move the USB cable to a charger or battery pack.',
    mistake: 'Testing while still plugged into the laptop and assuming success. ' +
      'A live Thonny session can mask a missing file.'
  },
  {
    id: 6, label: '6. Board autoruns main.py', phase: 'standalone',
    x: 0, y: 180,
    tip: 'Standalone operation confirmed.',
    accomplishes: 'The firmware runs boot.py, then main.py, with no host involved. ' +
      'This is what deployment means.',
    command: 'No command — this happens automatically at power-up.',
    mistake: 'If nothing happens here, work backwards: wrong filename (step 4), ' +
      'missing config (step 3), or missing driver (step 2).'
  }
];

const edgeData = [
  { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
  { from: 4, to: 5 }, { from: 5, to: 6 }
];

const GRAPH_W = 290;
const GRAPH_H = 450;
const GRAPH_CX = 0;
const GRAPH_CY = 0;

let nodes, edges, network;
let showFailures = false;

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function colorsFor(step) {
  return step.phase === 'attached' ? ATTACHED : STANDALONE;
}

function buildNodes() {
  return steps.map(s => {
    const c = colorsFor(s);
    const flagged = showFailures && s.canFail;
    return {
      id: s.id,
      label: flagged ? '⚠ ' + s.label : s.label,
      x: s.x,
      y: s.y,
      color: { background: c.background, border: flagged ? WARN_BORDER : c.border },
      borderWidth: flagged ? 5 : 3,
      font: { color: '#212121', size: 15 }
    };
  });
}

function buildEdges() {
  return edgeData.map((e, i) => ({
    id: 'e' + i,
    from: e.from,
    to: e.to,
    color: { color: '#455a64' },
    width: 2
  }));
}

function initializeNetwork() {
  nodes = new vis.DataSet(buildNodes());
  edges = new vis.DataSet(buildEdges());

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
      widthConstraint: { maximum: 250 },
      font: { size: 15, face: 'Arial' },
      borderWidth: 3,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 1.1 } },
      width: 2,
      smooth: false
    }
  };

  network = new vis.Network(document.getElementById('network'),
                            { nodes: nodes, edges: edges }, options);

  network.once('afterDrawing', positionView);
  window.addEventListener('resize', positionView);

  network.on('hoverNode', params => showTip(params.node));
  network.on('click', params => {
    if (params.nodes.length) showDetail(params.nodes[0]);
  });
}

// Fit the graph into whatever the title band, legend, and right panel leave.
function positionView() {
  const container = document.getElementById('network');
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;

  const panelWidth = w < 640 ? 210 : 270;
  const availW = Math.max(180, w - panelWidth - 20);
  const topBand = 90;
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

function showTip(id) {
  const s = steps.find(x => x.id === id);
  if (!s) return;
  document.getElementById('status-title').textContent = 'Step ' + s.id;
  document.getElementById('status-text').textContent = s.tip;
}

function showDetail(id) {
  const s = steps.find(x => x.id === id);
  if (!s) return;
  document.getElementById('status-title').textContent =
    s.label.replace('\n', ' ');
  document.getElementById('status-text').innerHTML =
    '<p>' + s.accomplishes + '</p>' +
    '<p style="margin-top:6px"><strong>Command:</strong><br>' +
    '<code>' + escapeHtml(s.command) + '</code></p>' +
    '<p style="margin-top:6px"><strong>Common mistake:</strong><br>' +
    s.mistake + '</p>';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toggleFailures() {
  showFailures = !showFailures;
  nodes.update(buildNodes());
  document.getElementById('failure-btn').textContent =
    showFailures ? 'Hide failures' : 'Common failures';
  if (showFailures) {
    document.getElementById('status-title').textContent = 'Common failure points';
    document.getElementById('status-text').textContent =
      'Steps 2, 3, and 4 are flagged. Each one fails silently: the program works ' +
      'perfectly in Thonny and then does nothing at all on power-up, with no ' +
      'traceback anywhere you can see it. Click a flagged step for the specific ' +
      'mistake.';
  }
}

function reset() {
  showFailures = false;
  nodes.update(buildNodes());
  document.getElementById('failure-btn').textContent = 'Common failures';
  document.getElementById('status-title').textContent = 'Click a step';
  document.getElementById('status-text').textContent =
    'Hover any step for a one-line summary, or click it for the command involved ' +
    'and the mistake most often made there.';
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('failure-btn').addEventListener('click', toggleFailures);
  document.getElementById('reset-btn').addEventListener('click', reset);
});
