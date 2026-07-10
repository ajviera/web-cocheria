const fs = require('fs');
const path = require('path');

const MIN_COVERAGE = 100;
const summaryPath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error('No coverage summary found. Run: npm run test:coverage first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
const metrics = ['statements', 'branches', 'functions', 'lines'];
let failed = false;

for (const [file, data] of Object.entries(summary)) {
  if (file === 'total') continue;
  for (const metric of metrics) {
    const pct = data[metric]?.pct ?? 100;
    if (pct < MIN_COVERAGE) {
      console.error(`FAIL  ${metric.padEnd(12)} ${pct.toFixed(1).padStart(5)}%  ${file}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error(`\nSome files are below the ${MIN_COVERAGE}% coverage threshold.`);
  process.exit(1);
} else {
  console.log(`All files meet the ${MIN_COVERAGE}% coverage threshold.`);
}
