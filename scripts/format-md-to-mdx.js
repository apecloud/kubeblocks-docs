/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

function readForder(dir) {
  fs.readdirSync(dir).forEach((item) => {
    const childPath = path.join(dir, item);
    const stat = fs.statSync(childPath);
    if (stat.isDirectory()) {
      readForder(childPath);
    }
    if (stat.isFile() && childPath.endsWith('md')) {
      fs.renameSync(childPath, childPath + 'x');
    }
  });
}

readForder(path.join(ROOT_DIR, 'docs'));
