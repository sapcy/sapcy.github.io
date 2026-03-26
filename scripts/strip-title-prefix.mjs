#!/usr/bin/env node
/** docs/*.md( intro 제외 ) frontmatter title에서 [태그] 접두어 제거 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(fileURLToPath(new URL('..', import.meta.url)), 'docs');

function stripTitleLine(line) {
  const m = line.match(/^title:\s*"(.*)"\s*$/);
  if (!m) return line;
  let inner = m[1].replace(/\\"/g, '\u0000QUOTE\u0000');
  inner = inner.replace(/^\[[^\]]+\]\s*/, '');
  inner = inner.replace(/\u0000QUOTE\u0000/g, '\\"');
  return `title: "${inner}"`;
}

function processFile(content) {
  if (!content.startsWith('---\n')) return content;
  const endFm = content.indexOf('\n---\n', 4);
  if (endFm === -1) return content;
  const fm = content.slice(4, endFm);
  const afterFm = content.slice(endFm);
  const lines = fm.split(/\r?\n/);
  const outFm = lines
    .map((ln) => (ln.startsWith('title:') ? stripTitleLine(ln) : ln))
    .join('\n');
  return `---\n${outFm}${afterFm}`;
}

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && e.name !== 'intro.md') {
      const s = readFileSync(p, 'utf8');
      const n = processFile(s);
      if (n !== s) {
        writeFileSync(p, n);
        console.log('updated', p);
      }
    }
  }
}

walk(docs);
