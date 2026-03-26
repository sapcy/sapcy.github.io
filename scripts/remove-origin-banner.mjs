#!/usr/bin/env node
/** docs/*.md( intro 제외 ) 상단 :::info 원문 … ::: 블록 일괄 제거 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(fileURLToPath(new URL('..', import.meta.url)), 'docs');
const block =
  /:::info 원문\r?\n\r?\n이 문서는 \[티스토리 Sapcy 기술 블로그\]\([^)]+\)의 \[해당 글\]\([^)]+\)에서 가져왔습니다\.\r?\n\r?\n:::\r?\n\r?\n/gs;

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && e.name !== 'intro.md') {
      const s = readFileSync(p, 'utf8');
      const n = s.replace(block, '');
      if (n !== s) {
        writeFileSync(p, n);
        console.log('removed banner:', p);
      }
    }
  }
}

walk(docs);
