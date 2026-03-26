#!/usr/bin/env node
// docs 폴더의 md에서 코드 펜스에 언어가 없으면 내용·경로로 추론해 삽입 (재실행 시 기존 언어 유지)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '..', 'docs');

/**
 * @param {string} code
 * @param {string} relPath docs 기준 상대 경로
 */
function inferLang(code, relPath) {
  const raw = code.replace(/\r\n/g, '\n');
  const c = raw.trim();
  const lines = raw.split('\n');
  const firstNonEmpty = lines.find((l) => l.trim())?.trim() ?? '';

  if (!c) return 'text';

  // IAM JSON 정책·AssumeRole 문서 (주석 줄이 있어도 본문이 JSON)
  if (
    /"Version"\s*:\s*"2012-10-17"/.test(c) &&
    (/"Statement"/.test(c) || /"Principal"/.test(c))
  ) {
    return 'json';
  }

  // Spring / Maven XML
  if (c.startsWith('<?xml') || /<beans[\s>]/.test(c) || /<bean[\s>]/.test(c)) return 'markup';

  // Kubernetes / YAML
  if (/^apiVersion:\s*[^\s#]/m.test(raw) && /^kind:\s/m.test(raw)) return 'yaml';
  if (/^apiVersion:\s/m.test(raw) && /(^|\n)kind:\s/m.test(raw)) return 'yaml';

  // JSON (IAM policy 등)
  if (/^\s*[\[{]/.test(firstNonEmpty)) {
    if (/"(Version|Sid|Effect|Statement|Action|Resource)"/.test(c)) return 'json';
    try {
      JSON.parse(c);
      return 'json';
    } catch {
      /* fallthrough */
    }
  }

  // Shell / AWS CLI
  if (
    /^(aws|kubectl|helm|curl|wget|cd|export|source)\s/m.test(raw) ||
    /\\\s*$/m.test(raw) ||
    /^#\!/.test(firstNonEmpty) ||
    (/^#\S/m.test(firstNonEmpty) && /aws|eks|iam|kubectl/.test(c))
  ) {
    return 'bash';
  }

  // HTTP
  if (/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+\//m.test(c) || /^HTTP\/\d/m.test(c))
    return 'http';

  // Java
  if (
    /import\s+java\./.test(c) ||
    /public\s+class\s+\w+/.test(c) ||
    /public\s+static\s+void\s+main/.test(c) ||
    /\bclass\s+\w+\s*\{/.test(c) ||
    /\bSystem\.(out|in|err)\b/.test(c) ||
    /\bnew\s+(String|StringBuilder|ArrayList|HashMap|LinkedList|Queue|Stack)\b/.test(c)
  ) {
    return 'java';
  }

  // 숫자 그리드 (백준 예제 입력 등)
  const dataLines = lines.filter((l) => l.trim());
  if (
    dataLines.length > 0 &&
    dataLines.every((l) => /^[\d\s\t]+$/.test(l))
  ) {
    return 'text';
  }

  // 경로 기본값
  if (relPath.includes('backend/java') || relPath.includes('backend/coding')) return 'java';
  if (relPath.includes('backend/spring')) {
    if (firstNonEmpty.includes('=') && !firstNonEmpty.includes('<') && !firstNonEmpty.startsWith('#'))
      return 'properties';
    if (/<\?xml|<beans/.test(firstNonEmpty)) return 'xml';
    return 'java';
  }
  if (relPath.includes('cloud/aws') || relPath.includes('cloud/kubernetes')) {
    if (firstNonEmpty.startsWith('{')) return 'json';
    if (firstNonEmpty.startsWith('apiVersion:')) return 'yaml';
    return 'bash';
  }
  if (relPath.includes('cs/')) return 'text';

  return 'text';
}

function processMarkdown(content, relPath) {
  let out = '';
  let i = 0;
  while (i < content.length) {
    const tick = content.indexOf('```', i);
    if (tick === -1) {
      out += content.slice(i);
      break;
    }
    out += content.slice(i, tick);
    const afterTicks = tick + 3;
    const rest = content.slice(afterTicks);
    /** 언어(선택) + 첫 줄바꿈 - ``` 또는 ```java 등 */
    const header = rest.match(/^([a-zA-Z0-9][\w+-]*)?\r?\n/);
    if (!header) {
      out += '```';
      i = afterTicks;
      continue;
    }
    const lang = header[1] ?? '';
    const headerLen = header[0].length;
    const bodyStart = afterTicks + headerLen;
    const close = content.indexOf('```', bodyStart);
    if (close === -1) {
      out += content.slice(tick);
      break;
    }
    const body = content.slice(bodyStart, close);
    const inferred = lang || inferLang(body, relPath);
    out += '```' + inferred + '\n' + body + '```';
    i = close + 3;
  }
  return out;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(docsDir)) {
  const rel = path.relative(docsDir, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const next = processMarkdown(raw, rel);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    changed++;
    console.log(rel);
  }
}
console.log('done, updated', changed, 'files');
