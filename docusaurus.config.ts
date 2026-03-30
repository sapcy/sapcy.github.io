import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sapcy',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // .md → Markdown, .mdx → MDX (티스토리 스크랩 문서에 `<`, `{` 등이 있어 detect 필요)
  markdown: {
    mermaid: true,
    format: 'detect',
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/blog',
        indexBlog: false,
        searchBarShortcutHint: true,
        searchBarPosition: 'left',
      },
    ],
  ],
  // Set the production url of your site here
  url: 'https://sapcy.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sapcy', // Usually your GitHub org/user name.
  projectName: 'playbook', // Usually your repo name.
  deploymentBranch: 'gh-pages', // The branch of your docs repo that you are publishing to GitHub pages
  trailingSlash: false, // GitHub Pages adds a trailing slash to Docusaurus URLs by default

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // 한국어만 지원 (다국어 UI·경로 제거)
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
    localeConfigs: {
      ko: {
        label: '한국어',
        htmlLang: 'ko',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          /** 기존 /docs/* → /blog/* (문서 플러그인 경로) */
          routeBasePath: 'blog',
          sidebarPath: './sidebars.ts',
          // docs/tags.yml — 태그 라벨·설명
          tags: 'tags.yml',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        /** blog 폴더가 비어 있고 문서를 /blog 아래에 두기 위해 비활성화 */
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        /** 예전 북마크 /docs/* → /blog/* */
        createRedirects(existingPath: string) {
          if (existingPath === '/blog' || existingPath.startsWith('/blog/')) {
            return [existingPath.replace(/^\/blog/, '/docs')];
          }
          return undefined;
        },
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    // 마지막에 두어 resolve.fallback(crypto 등)이 다른 플러그인에 덮이지 않게 함
    './plugins/transpile-sapcy-packages.js',
  ],

  themeConfig: {
      // Mermaid theme for light/dark mode
      mermaid: {
        theme: {
          light: 'neutral',
          dark: 'dark',
        },
        options: {
          themeVariables: {
            darkMode: true,
            primaryColor: '#2C3038',
            primaryTextColor: '#ECEEF4',
            primaryBorderColor: '#9AA0AD',
            lineColor: '#9AA0AD',
            secondaryColor: '#22262D',
            tertiaryColor: '#1B1F25',
            noteBkgColor: '#22262D',
            noteTextColor: '#B4BAC8',
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      // Enable hideable sidebar for focus reading mode
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      /** 오른쪽 목차에 h2~h4까지 포함 → TOC 단계별 스타일 3단계 활용 */
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Devlog',
        logo: {
          alt: 'Playbook 로고',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/blog',
            position: 'left',
            label: '블로그',
          },
          {to: '/project', label: '프로젝트', position: 'left'},
          {to: '/blog/tags', label: '태그', position: 'left'},
          {
            to: '/info',
            /* 화면에는 CSS로 아이콘만 표시; 빈 라벨은 Joi 거부 → zero-width space */
            label: '\u200b',
            position: 'right',
            className: 'header-info-link',
            'aria-label': '정보',
          },
          {
            href: 'https://github.com/sapcy/sapcy.github.io',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '블로그',
            items: [
              {
                label: '글 목록',
                to: '/blog',
              },
              {
                label: '태그',
                to: '/blog/tags',
              },
            ],
          },
          {
            title: '커뮤니티',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/sapcy/sapcy.github.io',
              },
            ],
          },
          {
            title: '더보기',
            items: [
              {
                label: '정보',
                to: '/info',
              },
              {
                label: '프로젝트',
                to: '/project',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Playbook. Docusaurus로 제작되었습니다.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        /** 언어 미지정 펜스 기본값 (Prism) */
        defaultLanguage: 'text',
        /** 기본 번들에 없을 수 있는 언어 로드 (문서에 맞춤) */
        /** prismjs/components/prism-<이름>.js 가 있어야 함 (xml 없음 → 마크업은 markup) */
        additionalLanguages: [
          'java',
          'kotlin',
          'groovy',
          /* go: prism-react-renderer 기본 번들에 포함 — additional에 넣으면 prism-go 이중 로드·webpack 오류 가능 */
          'properties',
          'yaml',
          'bash',
          'http',
          'diff',
          'sql',
          'cpp',
        ],
      },
  } satisfies Preset.ThemeConfig,
};

export default config;
