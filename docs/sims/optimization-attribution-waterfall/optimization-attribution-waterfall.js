// Optimization Attribution Waterfall - Chart.js
// CANVAS_HEIGHT: 516
// Four optimizations, each measured on its own by re-running the whole harness
// with only that one change added. The bars show what each one actually bought.

const BASELINE = 850;   // microseconds, illustrative

// Order matters: each step is measured with every earlier step already in place.
const STEPS = [
  {
    label: ['+ Trivial', 'twiddle skip'],
    delta: -60,
    detail: 'Test each twiddle factor for ±1 or ±i and skip the four multiplies ' +
            'when it is trivial. Roughly one twiddle in eight qualifies at ' +
            'N = 512, and the multiplies it removes are the most expensive ' +
            'instructions in the butterfly.'
  },
  {
    label: ['+ Branchless', 'butterfly select'],
    delta: -15,
    detail: 'Replace the branch introduced by the previous step with conditional ' +
            'execution. The test itself was never expensive; the unpredictable ' +
            'branch that followed it was. Note that this step only exists ' +
            'because the step before it added a branch.'
  },
  {
    label: ['+ Loop', 'unrolling ×2'],
    delta: -40,
    detail: 'Process two butterflies per loop iteration. This halves the loop ' +
            'bookkeeping and hands the scheduler two independent chains of ' +
            'arithmetic instead of one.'
  },
  {
    label: ['+ Cache-aware', 'ordering'],
    delta: -25,
    detail: 'Traverse each stage in the order the prefetcher expects, so more ' +
            'loads hit in cache. Changes no arithmetic at all — only when the ' +
            'data arrives.'
  }
];

const FINAL = BASELINE + STEPS.reduce((s, x) => s + x.delta, 0);   // 710

const LABELS = [['Baseline', '(ch23 assembly FFT)']]
  .concat(STEPS.map(s => s.label))
  .concat([['Final']]);

// Running level after each bar, used for the connector lines.
const LEVELS = [BASELINE];
STEPS.forEach(s => LEVELS.push(LEVELS[LEVELS.length - 1] + s.delta));

let chart;
let units = 'us';
let selected = -1;

function toUnits(v) {
  return units === 'us' ? v : (v / BASELINE) * 100;
}

function fmt(v, digits) {
  const d = digits === undefined ? (units === 'us' ? 0 : 1) : digits;
  return v.toFixed(d) + (units === 'us' ? ' μs' : '%');
}

// Floating bars: [from, to]. Totals sit on the axis; steps float.
function barData() {
  const bars = [[0, toUnits(BASELINE)]];
  for (let i = 0; i < STEPS.length; i++) {
    bars.push([toUnits(LEVELS[i]), toUnits(LEVELS[i + 1])]);
  }
  bars.push([0, toUnits(FINAL)]);
  return bars;
}

function barColors() {
  const c = ['rgba(84, 110, 122, 0.85)'];
  for (const s of STEPS) {
    c.push(s.delta <= 0 ? 'rgba(46, 125, 50, 0.85)' : 'rgba(198, 40, 40, 0.85)');
  }
  c.push('rgba(21, 101, 192, 0.85)');
  return c;
}

function borderColors() {
  return barColors().map(c => c.replace('0.85', '1'));
}

// Dashed connectors from the top of one bar to the next, plus a value label
// above every bar.
const decoratePlugin = {
  id: 'decorate',
  afterDatasetsDraw(c) {
    const meta = c.getDatasetMeta(0);
    const y = c.scales.y;
    const ctx = c.ctx;
    if (!meta.data.length) return;

    ctx.save();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < meta.data.length - 1; i++) {
      const a = meta.data[i];
      const b = meta.data[i + 1];
      const py = y.getPixelForValue(toUnits(LEVELS[i]));
      ctx.beginPath();
      ctx.moveTo(a.x + a.width / 2, py);
      ctx.lineTo(b.x - b.width / 2, py);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
    for (let i = 0; i < meta.data.length; i++) {
      const el = meta.data[i];
      const isStep = i > 0 && i <= STEPS.length;
      const top = Math.min(el.y, el.base);
      let label;
      if (i === 0) { ctx.fillStyle = '#37474f'; label = fmt(toUnits(BASELINE)); }
      else if (i === meta.data.length - 1) {
        ctx.fillStyle = '#1565c0';
        label = fmt(toUnits(FINAL));
      } else {
        const d = STEPS[i - 1].delta;
        ctx.fillStyle = d <= 0 ? '#2e7d32' : '#c62828';
        label = (d <= 0 ? '−' : '+') + fmt(Math.abs(toUnits(d)),
                                           units === 'us' ? 0 : 2);
      }
      ctx.fillText(label, el.x, top - 6);
    }
    ctx.restore();
  }
};

function yTitle() {
  return units === 'us' ? 'Execution time (μs)' : 'Execution time (% of baseline)';
}

function createChart() {
  const ctx = document.getElementById('waterfallChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: LABELS,
      datasets: [{
        label: 'Execution time',
        data: barData(),
        backgroundColor: barColors(),
        borderColor: borderColors(),
        borderWidth: 1,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      layout: { padding: { top: 22 } },
      onClick: (evt, els) => { select(els.length ? els[0].index : -1); },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: {
          beginAtZero: true,
          title: { display: true, text: yTitle(), font: { size: 13 } },
          ticks: { font: { size: 11 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => {
              const i = items[0].dataIndex;
              return i === 0 ? 'Baseline'
                   : i === LABELS.length - 1 ? 'Final'
                   : STEPS[i - 1].label.join(' ');
            },
            label: item => {
              const i = item.dataIndex;
              if (i === 0) return 'Starting point: ' + fmt(toUnits(BASELINE));
              if (i === LABELS.length - 1) {
                return ['Final: ' + fmt(toUnits(FINAL)),
                        'Total saved: ' + fmt(toUnits(BASELINE - FINAL))];
              }
              const s = STEPS[i - 1];
              return ['Change: −' + fmt(Math.abs(toUnits(s.delta)),
                                        units === 'us' ? 0 : 2),
                      'Share of total speedup: ' +
                        ((Math.abs(s.delta) / (BASELINE - FINAL)) * 100).toFixed(0) + '%',
                      'Click the bar for what this change is'];
            }
          }
        }
      }
    },
    plugins: [decoratePlugin]
  });
}

const DEFAULT_INFO =
  '<span class="name">Four changes, four separate measurements.</span><br>' +
  'Click any green bar to see what that change was and what it bought. ' +
  'The two totals on the ends are absolute times; the four bars between them ' +
  'are the individually measured steps that connect them.';

function select(i) {
  selected = i;
  const box = document.getElementById('infobox');
  if (i <= 0 || i > STEPS.length) {
    if (i === LABELS.length - 1) {
      box.innerHTML =
        '<span class="name">Final: ' + FINAL + ' μs</span><br>' +
        '<span class="delta">140 μs saved, a 1.20× speedup</span> ' +
        '<span class="share">(16.5% of the baseline time)</span><br>' +
        'Two of the four changes account for 100 of the 140 μs. The other two ' +
        'together bought 40 μs — real, but a different order of effort for a ' +
        'quarter of the return.';
    } else {
      box.innerHTML = DEFAULT_INFO;
    }
    return;
  }
  const s = STEPS[i - 1];
  const share = (Math.abs(s.delta) / (BASELINE - FINAL)) * 100;
  box.innerHTML =
    '<span class="name">' + s.label.join(' ') + '</span> ' +
    '<span class="delta">−' + Math.abs(s.delta) + ' μs</span> ' +
    '<span class="share">(' + (Math.abs(s.delta) / BASELINE * 100).toFixed(1) +
    '% of baseline, ' + share.toFixed(0) + '% of the total speedup)</span><br>' +
    s.detail;
}

function update() {
  chart.data.datasets[0].data = barData();
  chart.options.scales.y.title.text = yTitle();
  chart.update();
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  select(-1);

  document.querySelectorAll('input[name="units"]').forEach(radio => {
    radio.addEventListener('change', function () {
      units = this.value;
      update();
    });
  });
});
