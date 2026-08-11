// Linear / Square-root / Decibel Scaling Chart - Chart.js
// CANVAS_HEIGHT: 480
// One fixed spectrum under three display scalings. Which quiet components
// survive is entirely a function of the scaling choice.

// Raw power per bin. One dominant component plus several at roughly 1-5% of
// its power, and a low noise floor.
const POWER = [
  0.8, 5.0, 1.2, 1000.0, 2.1, 0.9, 1.4, 30.0,
  0.7, 1.1, 12.0, 0.6, 1.8, 45.0, 0.9, 1.3
];
const LABELS = POWER.map((_, i) => i);
const PEAK = Math.max(...POWER);
const DB_FLOOR = -60;

let chart;
let mode = 'linear';

function scaled(p) {
  if (mode === 'linear') return p;
  if (mode === 'sqrt') return Math.sqrt(p);
  // Decibels relative to the peak, floored so log(0) cannot escape.
  return Math.max(DB_FLOOR, 10 * Math.log10(p / PEAK));
}

function axisConfig() {
  if (mode === 'db') {
    return {
      min: DB_FLOOR,
      max: 2,
      title: { display: true, text: 'Decibels relative to peak (dB)', font: { size: 13 } }
    };
  }
  return {
    beginAtZero: true,
    title: {
      display: true,
      text: mode === 'linear' ? 'Power (linear)' : 'Magnitude (square root of power)',
      font: { size: 13 }
    }
  };
}

// A bar is effectively invisible if it occupies under 1.5% of the plot height.
function invisibleBins() {
  const values = POWER.map(scaled);
  let lo, hi;
  if (mode === 'db') { lo = DB_FLOOR; hi = 2; }
  else { lo = 0; hi = Math.max(...values); }
  const span = hi - lo;
  return POWER.map((_, i) => i).filter(i => (values[i] - lo) / span < 0.015);
}

const CAPTIONS = {
  linear: () =>
    'Power scaling is dominated by the single loud bin. Everything else is ' +
    'flattened against the axis — <strong>bins ' + invisibleBins().join(', ') +
    '</strong> are visually indistinguishable from zero, even though bin 13 ' +
    'carries 4.5% of the peak power.',
  sqrt: () =>
    'Taking the square root compresses the range. Bins 7, 10, and 13 are now ' +
    'visible as real components, though the smallest content is still faint. ' +
    'This is what most spectrum displays use.',
  db: () =>
    'Decibels are logarithmic, so every component gets comparable visual weight. ' +
    '<em>All sixteen bins are now readable</em>, including the noise floor near ' +
    '-30 dB. The cost is that the display no longer looks like the physical ' +
    'energy distribution.'
};

function createChart() {
  const ctx = document.getElementById('scalingChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: LABELS,
      datasets: [{
        label: 'Spectrum',
        data: POWER.map(scaled),
        // Bars anchor at zero by default, which would make negative dB values
        // hang downward from the top and render the 0 dB peak as no bar at all.
        base: barBase(),
        backgroundColor: 'rgba(21, 101, 192, 0.85)',
        borderColor: 'rgb(21, 101, 192)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 320 },
      scales: {
        x: {
          title: { display: true, text: 'Frequency bin', font: { size: 13 } },
          ticks: { font: { size: 11 } }
        },
        y: axisConfig()
      },
      plugins: {
        title: {
          display: true,
          text: 'The Same Spectrum, Three Different Scales',
          font: { size: 16 }
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => 'Bin ' + items[0].label,
            label: item => {
              const raw = POWER[item.dataIndex];
              const unit = mode === 'db' ? ' dB' : '';
              return ['Raw power: ' + raw.toFixed(1),
                      'Displayed: ' + item.parsed.y.toFixed(2) + unit];
            }
          }
        }
      }
    }
  });
}

function barBase() {
  return mode === 'db' ? DB_FLOOR : 0;
}

function update() {
  chart.data.datasets[0].data = POWER.map(scaled);
  chart.data.datasets[0].base = barBase();
  chart.options.scales.y = axisConfig();
  chart.update();
  document.getElementById('caption').innerHTML = CAPTIONS[mode]();
}

document.addEventListener('DOMContentLoaded', function () {
  createChart();
  document.getElementById('caption').innerHTML = CAPTIONS[mode]();

  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', function () {
      mode = this.value;
      update();
    });
  });
});
