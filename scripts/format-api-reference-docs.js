/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");

const ROOT_DIR = process.cwd();
const files = [
  `${ROOT_DIR}/docs/zh/release-0_9/user_docs/developer/api-reference/add-on.mdx`,
  `${ROOT_DIR}/docs/zh/release-0_9/user_docs/developer/api-reference/backup.mdx`,
  `${ROOT_DIR}/docs/zh/release-0_9/user_docs/developer/api-reference/cluster.mdx`,
]

files
.filter(file => fs.existsSync(file)) // check exists
.forEach(file => {
  console.log(file)
  const content = String(fs.readFileSync(file))
    .replace(/<h3([^>]*)>/g, (match, attr) => '<h3' + attr + '>\n')
    .replace(/<\/h3>/g, '\n</h3>')
    .replace(/<pre><code([^>]*)>/g, (match, attr) => '<pre>\n<code' + attr + '>\n')
    .replace(/<\/code><\/pre>/g, '</code>\n</pre>')
    .replace(/<code>(.*?)\s*<\/code>/g, (match, content) => '`' + content + '`')
    .replace(/<p>/g, '\n<p>\n')
    .replace(/<\/p>/g, '\n</p>')
    .replace(/<li>/g, '<li>\n')
    .replace(/<\/li>/g, '\n</li>')
    .replace(/<tr>/g, '<tr>\n')
    .replace(/<\/tr>/g, '\n</tr>')
    .replace(/<td>/g, '<td>\n')
    .replace(/<\/td>/g, '\n</td>');
  fs.writeFileSync(file, content);
})
