#!/usr/bin/env node
/**
 * docs 폴더의 md 파일 front matter에 tags 추가 (한 번 실행용)
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '..', 'docs');

/** @param {string} relPath docs 기준 상대 경로 */
function tagsFor(relPath) {
  if (relPath === 'intro.md') return ['intro'];
  if (relPath.startsWith('cloud/aws/')) {
    const t = ['cloud', 'aws'];
    if (relPath.includes('argocd-external-eks')) t.push('kubernetes', 'argocd', 'eks');
    if (relPath.includes('eks-cost-overview')) t.push('eks');
    return t;
  }
  if (relPath.startsWith('cloud/kubernetes/')) {
    const t = ['cloud', 'kubernetes'];
    if (relPath.includes('kyaml-kubernetes-yaml')) t.push('yaml', 'kyaml');
    return t;
  }
  if (relPath.startsWith('cs/')) {
    if (relPath.includes('http-cache')) return ['cs', 'http'];
    return ['cs', 'security'];
  }
  if (relPath.startsWith('backend/coding/')) return ['backend', 'algorithm'];
  if (relPath.startsWith('backend/java/')) return ['backend', 'java'];
  if (relPath.startsWith('backend/spring/')) return ['backend', 'spring'];
  if (relPath.startsWith('container/')) return ['container', 'cs'];
  if (relPath.startsWith('opensource/')) return ['opensource'];
  if (relPath.startsWith('cloud-native/')) return ['cloud-native', 'kubernetes'];
  return [];
}

function walk(dir, base = docsDir) {
  const out = [];
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, base));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function injectTags(content, tags) {
  const yamlTags = tags.map((t) => `  - ${t}`).join('\n');
  const block = `tags:\n${yamlTags}\n`;
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return content;
  let fm = m[1];
  if (/\ntags:\s*\n(?:  - .+\n)+/.test(fm)) {
    fm = fm.replace(/\ntags:\s*\n(?:  - .+\n)+/, '\n' + block);
  } else if (/\ntags:/.test(fm)) {
    fm = fm.replace(/\ntags:[\s\S]*?(?=\n[a-zA-Z_]+:|\n*$)/m, '\n' + block.trimEnd());
  } else {
    fm = fm.trimEnd() + '\n' + block;
  }
  return `---\n${fm}\n---` + content.slice(m[0].length);
}

for (const file of walk(docsDir)) {
  const rel = path.relative(docsDir, file).replace(/\\/g, '/');
  const tags = tagsFor(rel);
  if (tags.length === 0) continue;
  const raw = fs.readFileSync(file, 'utf8');
  const next = injectTags(raw, tags);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    console.log(rel, '→', tags.join(', '));
  }
}
