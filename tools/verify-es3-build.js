'use strict';

var fs = require('fs');
var path = require('path');

var defaultRoot = path.resolve(__dirname, '..', 'dist', 'cjs3');
var root = path.resolve(process.argv[2] || defaultRoot);
var failures = [];
var files = 0;

function walk(dir) {
  var entries = fs.readdirSync(dir);
  var i;
  for (i = 0; i < entries.length; i += 1) {
    var full = path.join(dir, entries[i]);
    var stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (stat.isFile() && entries[i].slice(-3) === '.js') {
      files += 1;
      verify(full);
    }
  }
}

function verify(file) {
  var source = fs.readFileSync(file, 'utf8');
  var checks = [
    ['class declaration/expression', /(^|[;{}\s])class\s+[A-Za-z_$]/m],
    ['arrow function', /=>/],
    ['let declaration', /(^|[;{}\s])let\s+[A-Za-z_$]/m],
    ['const declaration', /(^|[;{}\s])const\s+[A-Za-z_$]/m]
  ];
  var i;

  for (i = 0; i < checks.length; i += 1) {
    if (checks[i][1].test(source)) {
      failures.push(path.relative(root, file) + ': ' + checks[i][0]);
    }
  }
}

walk(root);

if (!files) {
  throw new Error('No JavaScript files found under ' + root);
}

if (failures.length) {
  console.error('ES3 syntax verification failed:');
  for (var i = 0; i < failures.length; i += 1) {
    console.error('- ' + failures[i]);
  }
  process.exit(1);
}

console.log('Verified ' + files + ' emitted JavaScript files: no class, arrow, let, or const syntax found.');
