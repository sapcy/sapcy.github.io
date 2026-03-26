#!/usr/bin/env node
/**
 * 닫는 ** 직후 공백 없이 한글·영문·숫자가 오면 공백 삽입 (MDX 볼드 인식용).
 * 볼드 안에 * 문자가 있으면 건너뛰지 않고 * 없는 구간만 매칭.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '..', 'docs');

// 닫는 ** 바로 뒤: 한글·영문·숫자 (괄호 제외 - **…**( 같은 패턴은 제외)
const BOLD_THEN_CHAR = /\*\*([^*\n]+?)\*\*([가-힣ㄱ-ㅎa-zA-Z0-9])/g;

function fixLine(line) {
  return line.replace(BOLD_THEN_CHAR, (m, inner, after) => {
    const t = inner.trim();
    if (!t) return m;
    // inner 앞뒤 공백은 볼드 안에 두지 않음 (열린 `**` 직후 공백으로 잘못 매칭된 경우 제거)
    return `**${t}** ${after}`;
  });
}

function fixMarkdown(text) {
  const lines = text.split('\n');
  let inFence = false;
  const out = [];
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    out.push(fixLine(line));
  }
  return out.join('\n');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && /\.(md|mdx)$/.test(e.name)) {
      const raw = fs.readFileSync(p, 'utf8');
      const next = fixMarkdown(raw);
      if (next !== raw) {
        fs.writeFileSync(p, next, 'utf8');
        console.log('updated:', path.relative(docsDir, p));
      }
    }
  }
}

walk(docsDir);
console.log('done');
