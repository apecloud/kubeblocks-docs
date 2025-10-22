/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const apiRefDir = path.join(
  ROOT_DIR,
  'docs/en/preview/user_docs/references/api-reference',
);
const files = fs
  .readdirSync(apiRefDir)
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => path.join(apiRefDir, file));

files
  .filter((file) => fs.existsSync(file)) // check exists
  .forEach((file) => {
    console.log(file);
    const content = String(fs.readFileSync(file))
      .replace(/<h3([^>]*)>/g, (match, attr) => '<h3' + attr + '>\n')
      .replace(/<\/h3>/g, '\n</h3>')
      .replace(
        /<pre><code([^>]*)>/g,
        (match, attr) => '<pre>\n<code' + attr + '>\n',
      )
      .replace(
         /<code>(.*?)\s*<\/code>/g,
         (match, content) => '<code>' + content.replace(/\*/g, '&ast;') + '</code>',
       )
      .replace(/<\/code><\/pre>/g, '</code>\n</pre>')
      .replace(/<p>/g, '\n<p>\n')
      .replace(/<\/p>/g, '\n</p>')
      .replace(/<li>/g, '<li>\n')
      .replace(/<\/li>/g, '\n</li>')
      .replace(/<tr>/g, '<tr>\n')
      .replace(/<\/tr>/g, '\n</tr>')
      .replace(/<td>/g, '<td>\n')
      .replace(/<\/td>/g, '\n</td>')
      .replace(
        /<persistentVolumeClaimName>/g,
        '&lt;persistentVolumeClaimName&gt;',
      )
      .replace(/<ordinal>/g, '&lt;ordinal&gt;');
    fs.writeFileSync(file, content);
  });
