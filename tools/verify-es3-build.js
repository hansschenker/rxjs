'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist', 'cjs3');
const failures = [];
let files = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files += 1;
      verify(full);
    }
  }
}

function verify(file) {
  const source = fs.readFileSync(file, 'utf8');
  const checks = [
    ['class declaration/expression', /(^|[;{}\s])class\s+[A-Za-z_$]/m],
    ['arrow function', /=>/],
    ['let declaration', /(^|[;{}\s])let\s+[A-Za-z_$]/m],
    ['const declaration', /(^|[;{}\s])const\s+[A-Za-z_$]/m],
  ];

  for (const [label, pattern] of checks) {
    if (pattern.test(source)) {
      failures.push(`${path.relative(root, file)}: ${label}`);
    }
  }
}

walk(root);

if (!files) {
  throw new Error(`No JavaScript files found under ${root}`);
}

if (failures.length) {
  console.error('ES3 syntax verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${files} emitted JavaScript files: no class, arrow, let, or const syntax found.`);
