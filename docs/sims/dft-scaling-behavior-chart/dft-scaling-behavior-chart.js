// DFT Scaling Behavior Chart - Chart.js
// CANVAS_HEIGHT: 470
// N-squared against N across the sizes this course actually uses. At N = 512
// the DFT needs 262,144 operations — the number the rest of the book exists
// to shrink.

const N_MIN = 8;
const N_MAX = 1024;
const N_STEP = 8;
const COURSE_N = 512;

let chart;
let markerN = COURSE_N;

function seriesData(fn) {
  const points = [];
  for (let n = N_MIN; n <= N_MAX; n += N_STEP) {
    points.push({ x: n, y: fn(n) });
  }
  return points;
}

// Fixed annotation at the course's standard FFT size, plus the movable marker.
// Drawn in afterDatasetsDraw so tooltips render on top rather than under.
const markerPlugin = {
  id: 'markerPlugin',
  afterDatasetsDraw(c) {
    const ctx = c.ctx;
    const top = c.chartArea.top;
    const bottom = c.chartArea.bottom;

    // Course-size annotation
    const xc = c.scales.x.getPixelForValue(COURSE_N);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#9e9e9e';
    ctx.beginPath();
    ctx.moveTo(xc, top);
    ctx.lineTo(xc, bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '11px Arial';
    ctx.fillStyle = '#616161';
    ctx.textAlign = 'right';
    ctx.fillText('N = 512: 262,144 DFT operations', xc - 6, top + 13);
    ctx.fillText('the number this course exists to shrink', xc - 6, top + 26);
    ctx.restore();

    // Movable marker
    const xm = c.scales.x.getPixelForValue(markerN);
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(xm, top);
    ctx.lineTo(xm, bottom);
    ctx.stroke();
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(xm, top);
    ctx.lineTo(xm - 5, top - 8);
    ctx.lineTo(xm + 5, top - 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
};

function yScaleConfig(useLog) {
  return useLog
    ? {
        type: 'logarithmic',
        title: { display: true, text: 'Operation count (log scale)', font: { size: 13 } },
        ticks: { font: { size: 11 } }
      }
    : {
        type: 'linear',
        beginAtZero: true,
        title: { display: true, text: 'Operation count', font: { size: 13 } },
        ticks: {
          font: { size: 11 },
          callback: v => v.toLocaleString('en-US')
        }
      };
}

function createChart() {
  const ctx = document.getElementById('scalingChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'DFT (N²)',
          data: seriesData(n => n * n),
          borderColor: 'rgb(230, 81, 0)',
          backgroundColor: 'rgba(230, 81, 0, 0.12)',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 8,
          fill: false
        },
        {
          label: 'Hypothetical linear algorithm (N)',
          data: seriesData(n => n),
          borderColor: 'rgb(21, 101, 192)',
          backgroundColor: 'rgba(21, 101, 192, 0.12)',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 8,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      interaction: { intersect: false, mode: 'nearest' },
      layout: { padding: { top: 10 } },
      scales: {
        x: {
          type: 'linear',
          min: N_MIN,
          max: N_MAX,
          title: { display: true, text: 'N (number of samples)', font: { size: 13 } },
          ticks: { font: { size: 11 } }
        },
        y: yScaleConfig(false)
      },
      plugins: {
        title: {
          display: true,
          text: 'Operation Count vs. N: Quadratic vs. Linear Growth',
          font: { size: 16 }
        },
        legend: { position: 'top', labels: { font: { size: 12 } } },
        tooltip: {
          callbacks: {
            title: items => 'N = ' + Math.round(items[0].parsed.x),
            label: item => item.dataset.label + ': ' +
                   Math.round(item.parsed.y).toLocaleString('en-US') + ' operations'
          }
        }
      }
    },
    plugins: [markerPlugin]
  });
}

function updateReadout() {
  const quad = markerN * markerN;
  const lin = markerN;
  document.getElementById('readout').innerHTML =
    'At N = ' + markerN.toLocaleString('en-US') + ': ' +
    'the DFT needs <span class="dft">' + quad.toLocaleString('en-US') +
    '</span> operations, a linear algorithm would need <span class="lin">' +
    lin.toLocaleString('en-US') + '</span>. ' +
    'The quadratic curve costs <span class="ratio">' +
    Math.round(quad / lin).toLocaleString('en-US') + '×</span> more — and that ' +
    'multiplier is itself equal to N, so it grows every time you lengthen the window.';
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  updateReadout();

  const marker = document.getElementById('markerN');
  const markerLabel = document.getElementById('markerValue');
  marker.addEventListener('input', function () {
    markerN = Number(marker.value);
    markerLabel.textContent = markerN.toLocaleString('en-US');
    updateReadout();
    chart.update('none');
  });

  document.getElementById('logScale').addEventListener('change', function (e) {
    chart.options.scales.y = yScaleConfig(e.target.checked);
    chart.update();
  });
});
