#!/usr/bin/env node
/**
 * tech-is-my-life.tistory.com 공개 글 → docs/ 마이그레이션 (HTML → Markdown)
 * 실행: node scripts/scrape-tistory.mjs
 */
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const BASE = 'https://tech-is-my-life.tistory.com';

/** 티스토리 "전체 글" 검색 기준 22개 (2026.03 기준) */
const POST_IDS = [
  25, 24, 23, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 7, 6, 5, 4, 3, 2,
];

const CATEGORY_TO_DIR = {
  '클라우드/Kubernetes': 'cloud/kubernetes',
  '클라우드/AWS': 'cloud/aws',
  CS지식: 'cs',
  코딩: 'coding',
  'BackEnd/Java': 'backend/java',
  'BackEnd/Spring': 'backend/spring',
  '카테고리 없음': 'backend/java',
};

function mapCategory(label) {
  if (!label || label === 'misc') return 'backend/java';
  return CATEGORY_TO_DIR[label] ?? 'misc';
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});
turndown.use(gfm);

function escYaml(s) {
  return String(s)
    .replace(/\r?\n/g, ' ')
    .replace(/"/g, '\\"')
    .trim()
    .slice(0, 200);
}

/** 티스토리 제목 접두어 [AWS], [Java], [백준] 등 제거 */
function stripTitleCategoryPrefix(raw) {
  const t = String(raw).trim();
  const stripped = t.replace(/^\[[^\]]+\]\s*/, '').trim();
  return stripped || t;
}

/** React SSG에서 문자열 style 속성으로 깨지는 경우 제거 */
function sanitizeTistoryHtml(html) {
  return html
    .replace(/<br>/gi, '<br />')
    .replace(/"\$\{\.\.\.\}"/g, '"$\\{...\\}"')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\sdata-ke-[a-zA-Z0-9_-]+="[^"]*"/gi, '')
    .replace(/\sdata-ke-[a-zA-Z0-9_-]+='[^']*'/gi, '');
}

async function scrapeOne(id) {
  const url = `${BASE}/${id}`;
  const res = await fetch(url, {
    headers: {'User-Agent': 'sapcy-blog-migration/1.0 (Docusaurus docs import)'},
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const catMatch = html.match(/"categoryLabel":"([^"]*)"/);
  const categoryLabel = catMatch?.[1] ?? 'misc';
  const dirRel = mapCategory(categoryLabel);
  const $ = cheerio.load(html);
  let inner = $('.tt_article_useless_p_margin.contents_style').html();
  if (!inner) inner = $('.contents_style').first().html() ?? '';
  if (!inner) throw new Error('No article body');
  inner = sanitizeTistoryHtml(inner);
  const title = stripTitleCategoryPrefix(
    $('meta[property="og:title"]').attr('content')?.trim() || `Post ${id}`,
  );
  const description = $('meta[property="og:description"]').attr('content') ?? '';
  const md = turndown.turndown(inner);
  const body = `---
format: md
title: "${escYaml(title)}"
description: "${escYaml(description)}"
---

${md}
`;
  const outDir = join(DOCS, dirRel);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `post-${id}.md`);
  writeFileSync(outPath, body, 'utf8');
  console.log('OK', id, '→', join(dirRel, `post-${id}.md`), `(${categoryLabel})`);
}

async function main() {
  for (const id of POST_IDS) {
    try {
      await scrapeOne(id);
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error('FAIL', id, e.message);
    }
  }
}

main();
