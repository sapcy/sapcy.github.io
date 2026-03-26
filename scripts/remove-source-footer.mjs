#!/usr/bin/env node
/** docs/*.md( intro 제외 ) 하단 --- + **출처:** … 블록 제거 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(fileURLToPath(new URL('..', import.meta.url)), 'docs');
const footer =
  /\r?\n---\r?\n\r?\n\*\*출처:\*\* \[Sapcy 기술 블로그\]\([^\)]+\) · \[글 링크\]\([^\)]+\)\s*$/;

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && e.name !== 'intro.md') {
      const s = readFileSync(p, 'utf8');
      const n = s.replace(footer, '');
      if (n !== s) {
        writeFileSync(p, n.replace(/\r?\n+$/, '\n'));
        console.log('removed footer:', p);
      }
    }
  }
}

walk(docs);
