/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const ROOT_DIR = process.cwd();
const INPUT_DIR = path.join(ROOT_DIR, '/docs/en/preview');
const OUTPUT_DIR = path.join(ROOT_DIR, 'pdf');

const getPaths = (dir, initData = []) => {
  fs.readdirSync(dir).forEach((f) => {
    const d = path.join(dir, f);
    const stat = fs.statSync(d);
    if (stat.isDirectory()) {
      getPaths(d, initData);
    }
    if (stat.isFile() && f.endsWith(".mdx")) {
      initData.push(d.replace(/\.mdx/ ,'').replace(INPUT_DIR, ''));
    }
  });
  return initData;
};

async function generatePdf() {
  const browser = await puppeteer.launch({
    browser: 'chrome',
    headless: false,
  });
  const page = await browser.newPage();
  const paths = getPaths(INPUT_DIR);
  for (const p of paths) {
    const url = `https://kubeblocks.io/docs/preview${p}`;
    console.log(`url: ${url}\n`);
    await page.goto(url, {
      // waitUntil: 'networkidle2',
    });
    await page.pdf({
      path: path.join(OUTPUT_DIR, `${p.replace(/^\//, '').replace(/\//g, '.')}.pdf`),
      printBackground: true,
    });
  }
  await browser.close();
}

if(!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
} else {
  fs.readdirSync(OUTPUT_DIR).forEach((pdf) => {
    fs.rmSync(path.join(OUTPUT_DIR, pdf))
  })
}
generatePdf()