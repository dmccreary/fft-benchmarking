// Variant Performance Dashboard - Chart.js
// CANVAS_HEIGHT: 564
// Five implementations of the same kernel, measured four ways. The winner is
// not the same variant in all four.

const VARIANTS = ['Plain Python', '@native', '@viper', 'Assembly',
                  'Specialized Assembly'];

// Illustrative values, consistent with the chapter's worked example.
const METRICS = {
  kernel: {
    name: 'Kernel time',
    unit: 'μs',
    axis: 'Kernel time (μs)',
    values: [21000, 9800, 3200, 850, 710],
    insight:
      'Specialized assembly wins by 29.6× over plain Python. This is the ' +
      'number everyone quotes, and it measures exactly the code the ' +
      'optimization touched — which is why it flatters the optimization.'
  },
  total: {
    name: 'Total time',
    unit: 'μs',
    axis: 'Total time (μs)',
    values: [21050, 9900, 3350, 1100, 950],
    insight:
      'The same ranking as kernel time, but the margin drops from 29.6× to ' +
      '22.2×. The difference between the two metrics is fixed overhead — ' +
      '240 μs for specialized assembly against 50 μs for plain Python — and ' +
      'it is the total, not the kernel, that a user waits for.'
  },
  code: {
    name: 'Code size',
    unit: 'bytes',
    axis: 'Code size (bytes)',
    values: [400, 480, 620, 900, 1400],
    insight:
      'Exactly the reverse ranking. The fastest variant is the largest, at ' +
      '3.5× the size of plain Python. On a part with 512 KB of flash nobody ' +
      'cares. On one with 32 KB shared across an entire application, this ' +
      'single chart ends the discussion.'
  },
  memory: {
    name: 'Memory usage',
    unit: 'bytes',
    axis: 'Memory usage (bytes)',
    values: [2048, 2048, 1536, 512, 512],
    insight:
      'A third ranking, and this one has ties. Both assembly variants use ' +
      '512 bytes because they transform in place; the Python variants ' +
      'allocate a second buffer. When two variants tie on the metric you ' +
      'care about, the decision has to come from somewhere else entirely.'
  }
};

const COLORS = ['#78909c', '#5c6bc0', '#26a69a', '#2e7d32', '#1565c0'];

let chart;
let metric = 'kernel';
let overlayOn = false;
let predOrder = [0, 1, 2, 3, 4];   // learner's predicted ranking, best first
let dragFrom = null;

function m() { return METRICS[metric]; }

// Every metric here is lower-is-better, so the measured ranking sorts ascending.
function measuredOrder() {
  const v = m().values;
  return VARIANTS.map((_, i) => i).sort((a, b) => v[a] - v[b]);
}

function winners() {
  const v = m().values;
  const best = Math.min(...v);
  return VARIANTS.map((_, i) => i).filter(i => v[i] === best);
}

function fmt(v) {
  return v.toLocaleString('en-US') + ' ' + m().unit;
}

function barColors() {
  const w = winners();
  return VARIANTS.map((_, i) => w.includes(i) ? '#f9a825' : COLORS[i]);
}

function createChart() {
  const ctx = document.getElementById('variantChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: VARIANTS.map(v => v.split(' ')),
      datasets: [{
        label: m().name,
        data: m().values.slice(),
        backgroundColor: barColors(),
        borderColor: barColors(),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 380 },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: {
          beginAtZero: true,
          title: { display: true, text: m().axis, font: { size: 13 } },
          ticks: { font: { size: 11 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => VARIANTS[items[0].dataIndex],
            label: item => {
              const i = item.dataIndex;
              const order = measuredOrder();
              return [m().name + ': ' + fmt(m().values[i]),
                      'Rank on this metric: ' + (order.indexOf(i) + 1) +
                        ' of ' + VARIANTS.length];
            }
          }
        }
      }
    }
  });
}

function update() {
  chart.data.datasets[0].label = m().name;
  chart.data.datasets[0].data = m().values.slice();
  chart.data.datasets[0].backgroundColor = barColors();
  chart.data.datasets[0].borderColor = barColors();
  chart.options.scales.y.title.text = m().axis;
  chart.update();
  renderPredict();
  renderInfo();
}

// --- prediction overlay ------------------------------------------------------

function moveTo(from, to) {
  if (to < 0 || to >= predOrder.length || from === to) return;
  const item = predOrder.splice(from, 1)[0];
  predOrder.splice(to, 0, item);
  renderPredict();
  renderInfo();
}

function chipEl(idx, pos, opts) {
  const el = document.createElement('div');
  el.className = 'chip' + (opts.cls ? ' ' + opts.cls : '');
  el.innerHTML = '<span class="rank">' + (pos + 1) + '.</span> ' + VARIANTS[idx];
  if (opts.draggable) {
    el.draggable = true;
    el.addEventListener('dragstart', () => {
      dragFrom = pos;
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
    el.addEventListener('dragover', e => e.preventDefault());
    el.addEventListener('drop', e => {
      e.preventDefault();
      if (dragFrom !== null) moveTo(dragFrom, pos);
      dragFrom = null;
    });
    const up = document.createElement('button');
    up.className = 'nudge';
    up.textContent = '◀';
    up.title = 'move up one rank';
    up.addEventListener('click', () => moveTo(pos, pos - 1));
    const down = document.createElement('button');
    down.className = 'nudge';
    down.textContent = '▶';
    down.title = 'move down one rank';
    down.addEventListener('click', () => moveTo(pos, pos + 1));
    el.appendChild(up);
    el.appendChild(down);
  }
  if (opts.value !== undefined) {
    const v = document.createElement('span');
    v.className = 'rank';
    v.style.fontWeight = 'normal';
    v.textContent = '(' + opts.value + ')';
    el.appendChild(v);
  }
  return el;
}

function renderPredict() {
  const box = document.getElementById('predict');
  box.innerHTML = '';
  if (!overlayOn) {
    box.className = 'predict off';
    box.textContent = 'Tick "Overlay my ranking prediction" to record your own ' +
      'predicted order before reading the chart — then switch metrics and see ' +
      'how many of your positions survive.';
    return;
  }
  box.className = 'predict';

  const order = measuredOrder();
  let hits = 0;
  for (let p = 0; p < predOrder.length; p++) {
    if (predOrder[p] === order[p]) hits++;
  }

  const l1 = document.createElement('div');
  l1.className = 'row-label';
  l1.innerHTML = '<b>Your predicted ranking</b> — best first. Drag a chip, or ' +
    'use ◀ ▶, to reorder.';
  box.appendChild(l1);

  const r1 = document.createElement('div');
  r1.className = 'chips';
  predOrder.forEach((idx, pos) => r1.appendChild(
    chipEl(idx, pos, { draggable: true })));
  box.appendChild(r1);

  const l2 = document.createElement('div');
  l2.className = 'row-label';
  l2.innerHTML = '<b>Measured ranking</b> by ' + m().name.toLowerCase() +
    ' — green where it agrees with your prediction.';
  box.appendChild(l2);

  const r2 = document.createElement('div');
  r2.className = 'chips';
  order.forEach((idx, pos) => r2.appendChild(chipEl(idx, pos, {
    cls: 'measured ' + (predOrder[pos] === idx ? 'hit' : 'miss'),
    value: m().values[idx].toLocaleString('en-US')
  })));
  box.appendChild(r2);

  const v = document.createElement('div');
  v.className = 'verdict';
  v.innerHTML = '<b>' + hits + ' of ' + VARIANTS.length +
    ' positions correct</b> on ' + m().name.toLowerCase() +
    '. Change the metric without touching your prediction — the same guess ' +
    'scores differently, because there is no single ranking to be right about.';
  box.appendChild(v);
}

function renderInfo() {
  const w = winners().map(i => VARIANTS[i]);
  document.getElementById('infobox').innerHTML =
    '<span class="name">' + m().name + '</span> — best: ' +
    '<span class="win">' + w.join(' and ') + '</span> at ' +
    fmt(Math.min(...m().values)) + '<br>' + m().insight;
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  renderPredict();
  renderInfo();

  document.getElementById('metric').addEventListener('change', function () {
    metric = this.value;
    update();
  });
  document.getElementById('overlay').addEventListener('change', function () {
    overlayOn = this.checked;
    renderPredict();
  });
});
