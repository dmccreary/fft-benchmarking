// Benchmark Results Chart - Chart.js
// CANVAS_HEIGHT: 470
// The same three implementations under two statistics. The ranking survives;
// what "B is fastest" means does not.

const IMPLS = ['A', 'B', 'C'];
const MEAN = [410, 395, 430];
const STDDEV = [35, 60, 12];
const BEST = [380, 340, 415];

let chart;
let stat = 'mean';

// Error bars for the mean view. afterDatasetsDraw so tooltips stay on top.
const errorBarPlugin = {
  id: 'errorBarPlugin',
  afterDatasetsDraw(c) {
    if (stat !== 'mean') return;
    const meta = c.getDatasetMeta(0);
    const y = c.scales.y;
    const ctx = c.ctx;
    ctx.save();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    meta.data.forEach((bar, i) => {
      const hi = y.getPixelForValue(MEAN[i] + STDDEV[i]);
      const lo = y.getPixelForValue(MEAN[i] - STDDEV[i]);
      const cap = Math.min(bar.width * 0.28, 16);
      ctx.beginPath();
      ctx.moveTo(bar.x, hi); ctx.lineTo(bar.x, lo);
      ctx.moveTo(bar.x - cap, hi); ctx.lineTo(bar.x + cap, hi);
      ctx.moveTo(bar.x - cap, lo); ctx.lineTo(bar.x + cap, lo);
      ctx.stroke();
    });
    ctx.restore();
  }
};

const CALLOUTS = {
  mean: 'B has the <strong>lowest mean</strong> but by far the <strong>widest ' +
        'spread</strong> — its error bar reaches higher than C\'s entire bar. ' +
        'B is fast on average and inconsistent. C is slowest on average but you ' +
        'can predict what it will do.',
  best: 'B is <em>also fastest at its best</em> — the ranking did not change. ' +
        'But notice how differently "B is best" reads once you know why: ' +
        'best-of-N reports the run that escaped interference, and it says ' +
        'nothing at all about the spread you saw in the other view.'
};

function datasetFor(kind) {
  return kind === 'mean'
    ? {
        label: 'Mean execution time ± 1 std dev',
        data: MEAN,
        backgroundColor: 'rgba(21, 101, 192, 0.85)',
        borderColor: 'rgb(21, 101, 192)', borderWidth: 1
      }
    : {
        label: 'Best of N (minimum sample)',
        data: BEST,
        backgroundColor: 'rgba(46, 125, 50, 0.85)',
        borderColor: 'rgb(46, 125, 50)', borderWidth: 1
      };
}

function createChart() {
  const ctx = document.getElementById('benchChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: IMPLS, datasets: [datasetFor(stat)] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 280 },
      scales: {
        x: { title: { display: true, text: 'Implementation', font: { size: 13 } } },
        // A common axis across both views, so switching statistic does not
        // silently rescale and exaggerate the difference.
        y: {
          min: 300, max: 500,
          title: { display: true, text: 'Execution time (µs)', font: { size: 13 } }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: item => stat === 'mean'
              ? ['Mean: ' + MEAN[item.dataIndex] + ' µs',
                 'Std dev: ± ' + STDDEV[item.dataIndex] + ' µs',
                 'Range: ' + (MEAN[item.dataIndex] - STDDEV[item.dataIndex]) +
                 ' to ' + (MEAN[item.dataIndex] + STDDEV[item.dataIndex]) + ' µs']
              : ['Best of N: ' + BEST[item.dataIndex] + ' µs']
          }
        }
      }
    },
    plugins: [errorBarPlugin]
  });
}

function update() {
  chart.data.datasets[0] = datasetFor(stat);
  chart.update();
  document.getElementById('callout').innerHTML = CALLOUTS[stat];
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  document.getElementById('callout').innerHTML = CALLOUTS[stat];
  document.querySelectorAll('input[name="stat"]').forEach(r => {
    r.addEventListener('change', function () { stat = this.value; update(); });
  });
});
