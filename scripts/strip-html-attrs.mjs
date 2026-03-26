#!/usr/bin/env node
/** docs/*.md( intro 제외 ) 본문에서 React SSG 오류를 일으키는 인라인 style / data-ke-* 제거 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(fileURLToPath(new URL('..', import.meta.url)), 'docs');

function strip(htmlish) {
  return htmlish
    // MDX/JSX: <br>는 자기닫힘 <br /> 필요 (<br />는 그대로)
    .replace(/<br>/gi, '<br />')
    // MDX가 { } 를 표현식으로 읽음 - 스프링 "${...}" 플레이스홀더 등
    .replace(/"\$\{\.\.\.\}"/g, '"$\\{...\\}"')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\sdata-ke-[a-zA-Z0-9_-]+="[^"]*"/gi, '')
    .replace(/\sdata-ke-[a-zA-Z0-9_-]+='[^']*'/gi, '');
}

function walk(dir) {
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && e.name !== 'intro.md') {
      let s = readFileSync(p, 'utf8');
      const out = strip(s);
      if (out !== s) {
        writeFileSync(p, out);
        console.log('stripped', p);
      }
    }
  }
}

walk(docs);
