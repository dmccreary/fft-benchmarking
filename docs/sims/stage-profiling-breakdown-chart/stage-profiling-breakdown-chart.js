// Stage Profiling Breakdown Chart - Chart.js
// CANVAS_HEIGHT: 470
// Measured share of one pipeline cycle. Compute dominates, and it is not close
// — which decides where optimization effort should go.

const STAGES = [
  {
    name: 'Capture', pct: 1, color: 'rgb(21, 101, 192)',
    verdict: 'minor',
    note: 'Reading a buffer that DMA already filled costs almost nothing. ' +
          'Optimizing this could save at most 1% of frame time — it is not ' +
          'where the effort belongs.'
  },
  {
    name: 'Compute', pct: 66, color: 'rgb(230, 81, 0)',
    verdict: 'bottleneck',
    note: 'The FFT itself. Two thirds of every frame. Even a modest speedup here ' +
          'frees more time than eliminating capture and draw entirely. This is ' +
          'the clear bottleneck, and it is what the rest of this course optimizes.'
  },
  {
    name: 'Draw', pct: 33, color: 'rgb(46, 125, 50)',
    verdict: 'secondary',
    note: 'Pushing 1024 bytes over SPI to the OLED. Substantial, and worth ' +
          'revisiting after compute — but halving it would save 16% of frame ' +
          'time against compute\'s 33% for the same effort.'
  }
];

let chart;
let view = 'bar';

// Callout on the compute segment. afterDatasetsDraw so tooltips stay on top.
const calloutPlugin = {
  id: 'calloutPlugin',
  afterDatasetsDraw(c) {
    if (view !== 'bar') return;
    const meta = c.getDatasetMeta(1);   // the Compute dataset
    if (!meta || !meta.data[0]) return;
    const el = meta.data[0];
    // For a horizontal stacked bar, base is the segment's left edge and x its
    // right edge — the midpoint is what the arrow should point at.
    const x = (el.base + el.x) / 2;
    const y = el.y - el.height / 2;

    const ctx = c.ctx;
    ctx.save();
    ctx.strokeStyle = '#c62828';
    ctx.fillStyle = '#c62828';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x - 6, y - 13);
    ctx.lineTo(x + 6, y - 13);
    ctx.closePath();
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px Arial';
    ctx.fillText('The clear bottleneck', x, y - 40);
    ctx.font = '12px Arial';
    ctx.fillText('this is what the next module optimizes', x, y - 25);
    ctx.restore();
  }
};

function showInfo(i) {
  const s = STAGES[i];
  const cls = s.verdict === 'bottleneck' ? 'bottleneck'
            : s.verdict === 'minor' ? 'minor' : '';
  document.getElementById('infobox').innerHTML =
    '<span class="name">' + s.name + '</span> — this stage takes ' +
    '<span class="' + cls + '">' + s.pct + '%</span> of total frame time.<br>' +
    s.note;
}

function barConfig() {
  return {
    type: 'bar',
    data: {
      labels: ['One pipeline cycle'],
      datasets: STAGES.map(s => ({
        label: s.name + ' (' + s.pct + '%)',
        data: [s.pct],
        backgroundColor: s.color,
        borderWidth: 0
      }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 56 } },
      scales: {
        x: {
          stacked: true, min: 0, max: 100,
          title: { display: true, text: 'Percent of frame time', font: { size: 13 } },
          ticks: { callback: v => v + '%', font: { size: 11 } }
        },
        y: { stacked: true, ticks: { font: { size: 12 } } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 } } },
        tooltip: {
          callbacks: { label: item => item.dataset.label.replace(' (', ': ').replace(')', ' of frame time') }
        }
      },
      onClick: (e, els) => { if (els.length) showInfo(els[0].datasetIndex); }
    },
    plugins: [calloutPlugin]
  };
}

function pieConfig() {
  return {
    type: 'pie',
    data: {
      labels: STAGES.map(s => s.name),
      datasets: [{
        data: STAGES.map(s => s.pct),
        backgroundColor: STAGES.map(s => s.color),
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 13 } } },
        tooltip: { callbacks: { label: item => item.label + ': ' + item.parsed + '% of frame time' } }
      },
      onClick: (e, els) => { if (els.length) showInfo(els[0].index); }
    }
  };
}

function build() {
  if (chart) chart.destroy();
  const ctx = document.getElementById('stageChart').getContext('2d');
  chart = new Chart(ctx, view === 'bar' ? barConfig() : pieConfig());
}

document.addEventListener('DOMContentLoaded', function () {
  build();
  showInfo(1);
  document.querySelectorAll('input[name="view"]').forEach(r => {
    r.addEventListener('change', function () { view = this.value; build(); });
  });
});
