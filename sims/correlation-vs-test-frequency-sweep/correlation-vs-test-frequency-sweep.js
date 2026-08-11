// Correlation vs Test Frequency Sweep - Chart.js
// CANVAS_HEIGHT: 450
// Sweeping the test frequency and correlating at every point produces one
// sharp peak at the frequency actually present, and near zero everywhere else.

const FS = 8000;          // sampling rate, Hz
const N = 256;            // samples in the correlation window
const SWEEP_MIN = 100;
const SWEEP_MAX = 1000;
const SWEEP_POINTS = 200;

let chart;
let signalFreq = 440;
let capturedSignal = [];

// Correlate the captured signal against both a sine and a cosine at the test
// frequency, then take the magnitude. Using both components makes the result
// independent of the captured signal's phase, so the peak height is honest.
function correlationMagnitude(testFreq) {
  let inPhase = 0;
  let quadrature = 0;
  for (let n = 0; n < N; n++) {
    const t = n / FS;
    inPhase += capturedSignal[n] * Math.sin(2 * Math.PI * testFreq * t);
    quadrature += capturedSignal[n] * Math.cos(2 * Math.PI * testFreq * t);
  }
  return Math.sqrt(inPhase * inPhase + quadrature * quadrature) / (N / 2);
}

function buildCapturedSignal() {
  capturedSignal = [];
  for (let n = 0; n < N; n++) {
    capturedSignal.push(Math.sin(2 * Math.PI * signalFreq * (n / FS)));
  }
}

function sweepData() {
  const points = [];
  for (let i = 0; i < SWEEP_POINTS; i++) {
    const f = SWEEP_MIN + (SWEEP_MAX - SWEEP_MIN) * (i / (SWEEP_POINTS - 1));
    points.push({ x: f, y: correlationMagnitude(f) });
  }
  return points;
}

// Dashed marker at the true signal frequency. Drawn in afterDatasetsDraw so
// tooltips paint on top of it rather than under it.
const trueFrequencyMarker = {
  id: 'trueFrequencyMarker',
  afterDatasetsDraw(c) {
    const x = c.scales.x.getPixelForValue(signalFreq);
    const top = c.chartArea.top;
    const bottom = c.chartArea.bottom;
    const ctx = c.ctx;

    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = 'Signal is actually here';
    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#c62828';
    const w = ctx.measureText(label).width;
    // Flip the label to the other side when the marker is near the right edge.
    const flip = x + w + 16 > c.chartArea.right;
    ctx.textAlign = flip ? 'right' : 'left';
    ctx.fillText(label, flip ? x - 8 : x + 8, top + 16);
    ctx.restore();
  }
};

function createChart() {
  const ctx = document.getElementById('sweepChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Correlation magnitude',
        data: sweepData(),
        borderColor: 'rgb(21, 101, 192)',
        backgroundColor: 'rgba(21, 101, 192, 0.15)',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 8,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      interaction: { intersect: false, mode: 'nearest' },
      scales: {
        x: {
          type: 'linear',
          min: SWEEP_MIN,
          max: SWEEP_MAX,
          title: { display: true, text: 'Test frequency (Hz)', font: { size: 14 } },
          ticks: { font: { size: 12 } }
        },
        y: {
          min: 0,
          max: 1.05,
          title: { display: true, text: 'Correlation magnitude (normalized)',
                   font: { size: 14 } },
          ticks: { font: { size: 12 } }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Correlation Magnitude vs. Test Frequency',
          font: { size: 17 }
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => 'Test frequency: ' + Math.round(items[0].parsed.x) + ' Hz',
            label: item => 'Correlation: ' + item.parsed.y.toFixed(3)
          }
        }
      }
    },
    plugins: [trueFrequencyMarker]
  });
}

function updateChart() {
  buildCapturedSignal();
  chart.data.datasets[0].data = sweepData();
  chart.update();
}

document.addEventListener('DOMContentLoaded', function () {
  buildCapturedSignal();
  createChart();

  const slider = document.getElementById('sigFreq');
  const readout = document.getElementById('sigFreqValue');
  slider.addEventListener('input', function () {
    signalFreq = Number(slider.value);
    readout.textContent = signalFreq + ' Hz';
    updateChart();
  });
});
