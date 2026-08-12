// 512-Point FFT Time on RP2350 @ 150 MHz - Chart.js
// CANVAS_HEIGHT: 420
// Data source: docs/appendices/benchmark-comparison/index.md — all three
// numbers are on the same board and clock (RP2350 @ 150 MHz), so this is
// an apples-to-apples comparison, unlike the other RP2040/Cortex-M4/Cortex-M7
// entries in that appendix.

const LABELS = [
  ['Our V9', '(combined optimizations)'],
  ['pschatzmann C++', '(bare-metal)'],
  ['micropython-fourier', '(Peter Hinch, MicroPython asm)']
];
const TIMES_MS = [0.6217, 1.10, 3.14];
const DETAILS = [
  'Measured directly: 621.7 µs mean, best-of-15 trials. Real-input FFT + specialized trivial-twiddle stages + branchless bit-reversal + hand-encoded VFMA.',
  '≈ 1.10 ms — scaled from a measured 91.78 µs, N=64 float FFT (C++, bare-metal) using the FFT’s O(N·log₂N) cost.',
  '≈ 3.14 ms — scaled from a measured 6.97 ms, 1024-point forward FFT (MicroPython inline assembler) using the FFT’s O(N·log₂N) cost.'
];
const MEASURED = [true, false, false];

let chart;

const valueLabelPlugin = {
  id: 'valueLabelPlugin',
  afterDatasetsDraw(c) {
    const meta = c.getDatasetMeta(0);
    const ctx = c.ctx;
    ctx.save();
    ctx.font = '600 12px Arial';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'middle';
    meta.data.forEach((bar, i) => {
      const text = TIMES_MS[i].toFixed(2) + ' ms';
      ctx.textAlign = 'left';
      ctx.fillText(text, bar.x + 8, bar.y);
    });
    ctx.restore();
  }
};

function createChart() {
  const ctx = document.getElementById('fftChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: LABELS,
      datasets: [{
        data: TIMES_MS,
        backgroundColor: MEASURED.map(m => m
          ? 'rgba(46, 125, 50, 0.85)'
          : 'rgba(97, 130, 180, 0.75)'),
        borderColor: MEASURED.map(m => m ? 'rgb(46, 125, 50)' : 'rgb(69, 90, 100)'),
        borderWidth: 1,
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      layout: { padding: { right: 55 } },
      scales: {
        x: {
          beginAtZero: true,
          max: 3.6,
          title: { display: true, text: 'Execution time (ms) — lower is faster', font: { size: 13 } }
        },
        y: {
          ticks: { font: { size: 12 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => Array.isArray(LABELS[items[0].dataIndex])
              ? LABELS[items[0].dataIndex].join(' ')
              : LABELS[items[0].dataIndex],
            label: item => DETAILS[item.dataIndex]
          }
        }
      }
    },
    plugins: [valueLabelPlugin]
  });
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  document.getElementById('callout').innerHTML =
    '<strong>Same board, same clock:</strong> all three bars are RP2350 @ 150 MHz ' +
    '(Raspberry Pi Pico 2), so bar length is directly comparable.' +
    '<span class="scaled-note">Our V9 is a direct 512-point measurement. The other two bars ' +
    'are scaled from smaller published benchmarks (N=64 and N=1024) to an equivalent ' +
    '512-point time using the FFT’s O(N·log₂N) cost — hover a bar for the source figure.</span>';
});
