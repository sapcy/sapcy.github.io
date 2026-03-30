import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type TopicSize = 'full' | 'wide';

const topics: Array<{
  title: string;
  description: string;
  href: string;
  icon: string;
  iconBg: string;
  tags?: string[];
  size: TopicSize;
  accent?: boolean;
}> = [
  {
    title: 'Blog',
    description: '블로그 포스트 목록. 최신 글과 시리즈를 확인하세요.',
    href: '/blog',
    icon: '📝',
    iconBg: '#EDE7F6',
    tags: ['Posts', 'Series'],
    size: 'full',
    accent: true,
  },
  {
    title: 'Tags',
    description: '태그별로 글을 찾아보세요.',
    href: '/blog/tags',
    icon: '🏷️',
    iconBg: '#E8F5E9',
    size: 'wide',
  },
  {
    title: 'Archive',
    description: '과거 포스트 아카이브',
    href: '/blog',
    icon: '📁',
    iconBg: '#FFEBEE',
    size: 'wide',
  },
];

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            {siteConfig.title}
          </div>
          <h1 className={styles.heroTitle}>
            {siteConfig.title}{' '}
            <span className={styles.heroTitleAccent}>Blog</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline ?? '블로그와 문서를 한곳에서'}
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.btnPrimary} to="/blog">
              Start Reading
              <span>→</span>
            </Link>
            <Link className={styles.btnSecondary} to="/blog">
              Explore Blog
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImageWrapper}>
            <img
              src={useBaseUrl('/img/undraw_docusaurus_mountain.svg')}
              alt="Blog"
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
            <div className={styles.heroOverlay}>
              <div className={styles.heroOverlayLabel}>Latest</div>
              <div className={styles.heroOverlayCode}>
                npm run start
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type TopicCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
  iconBg: string;
  tags?: string[];
  size: TopicSize;
  accent?: boolean;
};

function TopicCard({
  title,
  description,
  href,
  icon,
  iconBg,
  tags,
  size,
  accent,
}: TopicCardProps) {
  const sizeClass = {
    full: styles.bentoFull,
    wide: styles.bentoWide,
  }[size];

  return (
    <Link
      to={href}
      className={`${styles.bentoCard} ${sizeClass} ${accent ? styles.bentoAccent : ''}`}
    >
      <div
        className={styles.bentoIcon}
        style={{
          background: accent ? 'rgba(255,255,255,0.15)' : iconBg,
        }}
      >
        {icon}
      </div>
      <h3 className={styles.bentoCardTitle}>{title}</h3>
      <p className={styles.bentoDescription}>{description}</p>
      {tags != null && tags.length > 0 && (
        <div className={styles.bentoTags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.bentoTag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <span className={styles.bentoLink}>Browse →</span>
    </Link>
  );
}

function TopicsSection() {
  return (
    <section className={styles.topics}>
      <div className={styles.topicsInner}>
        <div className={styles.topicsHeader}>
          <div>
            <h2 className={styles.topicsTitle}>
              Core Knowledge Domains
            </h2>
            <p className={styles.topicsSubtitle}>
              블로그와 문서의 핵심 영역
            </p>
          </div>
          <Link className={styles.viewAll} to="/blog">
            View all modules ↗
          </Link>
        </div>
        <div className={styles.bentoGrid}>
          {topics.map((topic) => (
            <TopicCard key={topic.title} {...topic} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaInner}>
        <h2 className={styles.ctaTitle}>
          Ready to read?
        </h2>
        <p className={styles.ctaSubtitle}>
          블로그에서 더 많은 글을 만나보세요.
        </p>
        <div className={styles.ctaButtons}>
          <Link className={styles.btnPrimary} to="/blog">
            Go to Blog
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline ?? '블로그와 문서를 한곳에서'}
    >
      <HeroSection />
      <TopicsSection />
      <CTASection />
    </Layout>
  );
}
