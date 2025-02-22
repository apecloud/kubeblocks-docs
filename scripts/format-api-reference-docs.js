/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");

const ROOT_DIR = process.cwd();
const files = [
  `${ROOT_DIR}/docs/en/preview/developer_docs/api-reference/add-on.md`,
  `${ROOT_DIR}/docs/en/preview/developer_docs/api-reference/backup.md`,
  `${ROOT_DIR}/docs/en/preview/developer_docs/api-reference/cluster.md`,
]

files.forEach(file => {
  const content = String(fs.readFileSync(file))
    .replace(/<h3([^>]*)>/g, (match, attr) => '<h3' + attr + '>\n')
    .replace(/<\/h3>/g, '\n</h3>')
    .replace(/<pre><code([^>]*)>/g, (match, attr) => '<pre>\n<code' + attr + '>\n')
    .replace(/<\/code><\/pre>/g, '</code>\n</pre>')
    .replace(/<code>(.*?)\s*<\/code>/g, (match, content) => '`' + content + '`')
    .replace(/<p>/g, '<p>\n')
    .replace(/<\/p>/g, '\n</p>')
    .replace(/<li>/g, '<li>\n')
    .replace(/<\/li>/g, '\n</li>')
    .replace(/<tr>/g, '<tr>\n')
    .replace(/<\/tr>/g, '\n</tr>')
    .replace(/<td>/g, '<td>\n')
    .replace(/<\/td>/g, '\n</td>');
  fs.writeFileSync(file, content);
})
