import React from 'react';
import Link from '@docusaurus/Link';
import styles from './TagList.module.css';

/**
 * Sapcy 블로그·문서 front matter 태그용 (/tags/:slug 페이지와 연동)
 * @param {string[]} tags
 * @param {boolean} [showCount=false]
 * @param {Record<string, number>} [counts] — showCount일 때 태그별 개수
 * @param {string} [className]
 */
function tagHref(tag) {
  const slug = encodeURIComponent(String(tag).trim());
  return `/tags/${slug}`;
}

function fallbackColor(tag) {
  let h = 0;
  const s = String(tag);
  for (let i = 0; i < s.length; i += 1) {
    h = s.charCodeAt(i) + ((h << 5) - h);
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 48% 40%)`;
}

function getTagColor(tag) {
  const key = String(tag).toLowerCase().trim();
  /** @type {Record<string, string>} — docs/tags.yml·fix-generate-tags 기준 */
  const colorMap = {
    /* 영역 */
    cloud: '#38BDF8',
    'cloud-native': '#06B6D4',
    aws: '#FF9900',
    eks: '#D97706',
    kubernetes: '#326CE5',
    argocd: '#EF7B4D',
    container: '#0D9488',
    docker: '#2496ED',

    cs: '#6366F1',
    http: '#0EA5E9',
    security: '#E11D48',

    yaml: '#CB171E',
    kyaml: '#A855F7',

    java: '#E76F00',
    spring: '#6DB33F',
    backend: '#8B5CF6',
    algorithm: '#DB2777',

    opensource: '#14B8A6',
    intro: '#64748B',

    /* 확장 (문서에 추가될 때 대비) */
    envoy: '#BA0C2F',
    networking: '#7C3AED',
    observability: '#0D9488',
    prometheus: '#E6522C',
    grafana: '#F46800',
  };

  return colorMap[key] || fallbackColor(tag);
}

export default function TagList({
  tags,
  showCount = false,
  counts = {},
  className = '',
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.tagList} ${className}`.trim()}>
      {tags.map((tag) => {
        const bg = getTagColor(tag);
        const c = counts[tag];
        return (
          <Link
            key={tag}
            to={tagHref(tag)}
            className={styles.tagLink}
            style={{backgroundColor: bg}}
            title={`#${tag} 태그 문서 보기`}>
            #{tag}
            {showCount && c != null && (
              <span className={styles.tagCount}>({c})</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
