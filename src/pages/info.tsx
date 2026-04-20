import {useEffect} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './info.module.css';

const IconEnvelope = () => (
  <svg
    className={styles.icon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    aria-hidden>
    <path
      fill="currentColor"
      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
    />
  </svg>
);

const IconPhone = () => (
  <svg
    className={styles.icon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    aria-hidden>
    <path
      fill="currentColor"
      d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
    />
  </svg>
);

const IconGithub = () => (
  <svg
    className={styles.icon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
    aria-hidden>
    <path
      fill="currentColor"
      d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"
    />
  </svg>
);

const IconBlog = () => (
  <svg
    className={styles.icon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    aria-hidden>
    <path
      fill="currentColor"
      d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144L0 368c0 79.5 64.5 144 144 144s144-64.5 144-144-64.5-144-144-144l-16 0 0 96 16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48l0-224z"
    />
  </svg>
);

const techStack: {title: string; items: string[]}[] = [
  {title: 'Programming Languages', items: ['Java', 'Go']},
  {
    title: 'Frameworks & Libraries',
    items: [
      'Springboot',
      'Vue.js',
      'React.js',
      'Next.js',
    ],
  },
  {
    title: 'Infrastructure & Databases',
    items: [
      'Kubernetes',
      'Docker',
      'MariaDB',
      'Prometheus',
      'Grafana',
      'Harbor',
      'OpenStack',
    ],
  },
  {
    title: 'CI/CD Automation',
    items: ['Jenkins', 'ArgoCD', 'Ansible'],
  },
  {
    title: 'Tools & IDEs',
    items: ['Jira', 'Slack', 'GitHub', 'GitLab', 'Bitbucket', 'Cursor'],
  },
];

const careerTags = [
  'Kubernetes',
  'Java',
  'Spring',
  'MariaDB',
  'Jenkins',
  'Automation',
  'OpenStack',
];

type Project = {
  title: string;
  period: string;
  company: string;
  bullets: string[];
  techStack?: string;
};

const projects: Project[] = [
  {
    title: '설치 자동화 도구 개발',
    period: '2026-03 ~ 2026-04',
    company: '오케스트로(주)',
    bullets: [
      'Golang Bubbletea로 구현하는 TUI 기반 OpenStack, K8s 설치 자동화 도구 개발 프로젝트를 주도',
      '기반 지식이 부족하더라도 표준화 및 가이드 라인을 제시하여 쉽고 안정적인 설치 경험을 제공'
    ],
    techStack: 'Go, K8s, OpenStack, Ceph',
  },
  {
    title: '건강보험공단 클라우드 표준 플랫폼 구축',
    period: '2025-08 ~ 2025-12',
    company: '오케스트로(주)',
    bullets: [
      '건강보험공단의 클라우드 표준 플랫폼을 구축하는 프로젝트이며, 파이프라인 기술지원 엔지니어로 참여',
      '각각 다른 업무 시스템의 개발 소스를 SVN에서 Git으로 전환하여 플랫폼을 이용한 CI/CD 파이프라인 설계',
      'WEB, WAS, DB 상용/공개 솔루션별 Helm chart 템플릿 작성',
    ],
    techStack: 'K8s, OpenStack, ArgoCD, Jenkins, Nexus, Harbor',
  },
  {
    title: '미래에셋증권 CI/CD 플랫폼 구축',
    period: '2025-01 ~ 2025-08',
    company: '오케스트로(주)',
    bullets: [
      '미래에셋증권의 업무 및 프레임워크 영역 빌드/배포를 통합하여 제공하는 CI/CD 플랫폼을 구축하는 프로젝트',
      '각각 다른 업무 시스템의 AS-IS 파이프라인 구성에서 CI/CD 플랫폼 구성으로 전환',
      'Harbor, Nexus, Gitlab 데이터 마이그레이션',
      '프라이빗 클라우드(Openshift)에서 빌드하고 ECS로 배포하는 하이브리드 클라우드 CI/CD 설계',
    ],
  },
  {
    title: '24년 클라우드 네이티브 전환 상세설계 사업(2차)',
    period: '2024-06 ~ 2024-11',
    company: '오케스트로(주)',
    bullets: [
      'NIA 주관 하에 기존 레거시 시스템에 대한 클라우드네이티브 전환 방안 상세설계 TA로 참여',
      'MSA 아키텍처 설계 - 이벤트스토밍 과정을 통해 이벤트 기준 마이크로서비스 분류',
      'DevSecOps, Message Broker, Service Mesh, Telemetry 등 영역별로 대상 시스템에 적합한 OSS 분석 & 선별',
      'K8s 클러스터 노드, 내부 Namespace, Pod 등 자원들의 구성, 용량 설계',
    ],
  },
  {
    title: '하나은행 프로젝트 ONE',
    period: '2023-07 ~ 2024-04',
    company: '오케스트로(주)',
    bullets: [
      '하나은행 ICT 인프라 구축 프로젝트에 클라우드 자원(IaaS) 및 클라우드 네이티브(PaaS) 자원에 대한 통합 관리 플랫폼(CMP) 구축을 담당',
      'VMware 기반 가상머신에 K8s 클러스터를 구축하여 CMP 솔루션 및 오픈소스 기반 Outer 아키텍처 구성',
      'Gitlab CI 및 Nexus3를 이용한 개발/운영 클러스터 배포 파이프라인 구축',
      'ArgoCD, Gitlab을 이용하여 인프라 코드를 Git으로 관리/배포하는 GitOps 구성',
      'Prometheus, Grafana를 이용해 모니터링 시스템 구축',
      'DR 시스템 구축 - 초기 설계시 RTO가 2시간이었으나 자동화 스크립트를 통해 30분 내로 단축',
    ],
  },
  {
    title: 'Hanacloudia 포털 고도화',
    period: '2022-06 ~ 2023-02',
    company: '오케스트로(주)',
    bullets: [
      '하나금융티아이 내부 직원 및 관계사를 위한 클라우드 포털 시스템을 구축하는 프로젝트에 플랫폼 엔지니어를 담당',
      'OpenStack 기반 가상머신에 K8s 클러스터를 구축',
      'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발',
      'Jenkins로 개발 소스 빌드/배포 파이프라인 구축',
    ],
    techStack:
      'Spring Boot, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
  },
  {
    title: '전자정부 클라우드 플랫폼 (1, 2차)',
    period: '2020-01 ~ 2021-04',
    company: '오케스트로(주)',
    bullets: [
      '행정안전부 주관하에 인프라, 서비스, 개발프레임워크 등을 서비스 형태로 제공하는 클라우드 플랫폼 포털 풀스택 개발 담당',
      'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발',
      '계정 별로 Connection pool 생성하여 메모리 사용량 및 요청 속도 20%이상 개선',
      'Agile 개발 프로세스 수행 경험',
    ],
    techStack:
      'Spring Boot, Spring Security, Spring Cloud Config, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
  },
];

function BulletList({items}: {items: string[]}) {
  return (
    <ul className={styles.bulletList}>
      {items.map((line) => (
        <li key={line.slice(0, 48)}>
          <span className={styles.bullet} aria-hidden>
            •
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InfoPage() {
  const profileSrc = useBaseUrl('/img/profile_main.jpeg');
  const lastUpdated = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.add('resume-info-print-scope');
    return () => el.classList.remove('resume-info-print-scope');
  }, []);

  return (
    <Layout
      title="Devlog"
      description="DevOps Engineer 최시영의 이력서"
      wrapperClassName="resume-page-wrapper">
      <Head>
        <meta property="og:title" content="Sapcy - DevOps Engineer" />
        <meta property="og:description" content="DevOps Engineer Portfolio" />
        <meta property="og:type" content="profile" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.resumePage} id="resume-document-root">
        <div className={styles.resumeInner}>
          <div className={styles.pdfToolbar}>
            <button
              type="button"
              className={styles.pdfButton}
              onClick={() => window.print()}>
              PDF 저장
            </button>
          </div>
          <div className={styles.resumeContainer}>
            {/* Hero */}
            <section className={styles.hero}>
              <div className={styles.profileWrap}>
                <img
                  src={profileSrc}
                  alt="프로필 사진"
                  width={144}
                  height={176}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className={styles.heroText}>
                <h1 className={styles.name}>
                  최시영{' '}
                  <span className={styles.nameSuffix}>(Sapcy)</span>
                </h1>
                <p className={styles.role}>DevOps Engineer</p>
                <div className={styles.contactRow}>
                  <a
                    className={styles.contactLink}
                    href="mailto:sychoi1644@gmail.com">
                    <IconEnvelope />
                    sychoi1644@gmail.com
                  </a>
                  <span className={styles.contactSpan}>
                    <IconPhone />
                    010-5189-1644
                  </span>
                  <a
                    className={styles.contactLink}
                    href="https://github.com/sapcy"
                    target="_blank"
                    rel="noopener noreferrer">
                    <IconGithub />
                    GitHub
                  </a>
                  <a
                    className={styles.contactLink}
                    href="https://tech-is-my-life.tistory.com"
                    target="_blank"
                    rel="noopener noreferrer">
                    <IconBlog />
                    Blog
                  </a>
                </div>
              </div>
            </section>

            {/* 소개 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>소개</h2>
              <div className={styles.introBody}>
                <p>
                  저는 개발과 인프라에 대한 이해를 갖춘 DevOps 엔지니어로서 복잡한
                  시스템을 최적화하고 자동화하여 원활한 배포와 운영 효율성을
                  보장합니다. OpenStack 기반 Private Cloud 환경에서 가상머신에
                  Kubernetes 클러스터를 구축한 경험이 있으며, 효율적이고 안정성이
                  높은 아키텍처를 위해 언제나 고민하고 있습니다.
                </p>
                <p>
                  그리고 개인 프로젝트나 개발 커뮤니티 활동 등을 통해 다양한 개발
                  경험을 즐기고 있습니다.
                </p>
                <p>
                  저는 업무에서 커뮤니케이션이 가장 중요하다고 생각하고 있어
                  능동적이고 적극적인 커뮤니케이션으로 문제 해결을 하고 있습니다.
                  이러한 점을 바탕으로 더 좋은 엔지니어로서 성장하기 위해 치열하게
                  학습하고, 경험하고, 노력하고 있습니다.
                </p>
              </div>
              <p className={styles.signature}>- Sapcy</p>
            </section>

            {/* 기술 스택 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>기술 스택</h2>
              <div className={styles.techBlock}>
                {techStack.map((group) => (
                  <div key={group.title}>
                    <h3 className={styles.techGroupTitle}>{group.title}</h3>
                    <div className={styles.tagRow}>
                      {group.items.map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 경력 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>경력</h2>
              <p className={styles.totalExp}>총 경력: 6년 3개월</p>
              <div className={styles.card}>
                <div className={styles.companyTitleRow}>
                  <h3 className={styles.cardTitle}>오케스트로(주)</h3>
                </div>
                <p className={styles.roleLine}>DevOps Engineer</p>
                <p className={styles.periodLine}>2019-10 ~ 현재</p>
                <p className={styles.companyDesc}>
                  클라우드 전환 및 설계 컨설팅부터 구축, 운영을 위한 다양한
                  솔루션을 자체 개발해 제공하는 기업
                  <a
                    className={styles.inlineLink}
                    href="https://www.okestro.com/"
                    target="_blank"
                    rel="noopener noreferrer">
                    →
                  </a>
                </p>
                <div className={styles.tagRow}>
                  {careerTags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 프로젝트 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>프로젝트</h2>
              <div className={styles.stackGap}>
                {projects.map((p) => (
                  <div key={p.title} className={styles.card}>
                    <div
                      className={`${styles.cardHeader} ${styles.rowBetween}`}>
                      <h3 className={styles.cardTitle}>{p.title}</h3>
                      <span className={styles.cardDate}>{p.period}</span>
                    </div>
                    <p className={styles.companyName}>{p.company}</p>
                    <BulletList items={p.bullets} />
                    {p.techStack ? (
                      <p className={styles.techFootnote}>
                        <strong>기술스택:</strong> {p.techStack}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* 오픈소스 기여 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>오픈소스 기여</h2>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Bitnami containers</h3>
                <ul className={styles.bulletList}>
                  <li>
                    <span className={styles.bullet} aria-hidden>
                      •
                    </span>
                    <span>
                      Bitnami의 argocd 도커 이미지 내 git 버전 차이로 인한 이슈
                      제기 후 해결
                    </span>
                  </li>
                  <li>
                    <span className={styles.bullet} aria-hidden>
                      •
                    </span>
                    <span>
                      원인: bitnami/argo-cd:2.6.7-debian-11-r8 컨테이너 베이스
                      이미지에 설치된 git은 2.30.2 버전이었으나, ArgoCD repository
                      설정에서 &quot;Force basic auth&quot; 옵션은 git 2.31.0
                      버전부터 제공하는 &apos;--config-env&apos; 옵션을 사용하므로
                      에러 발생
                    </span>
                  </li>
                  <li>
                    <span className={styles.bullet} aria-hidden>
                      •
                    </span>
                    <span>
                      결과: ArgoCD의 &quot;Force basic auth&quot; 옵션 없이 기능
                      구현하여 문제는 해결됨
                    </span>
                  </li>
                </ul>
                <a
                  className={styles.osLink}
                  href="https://github.com/bitnami/containers/issues/34541"
                  target="_blank"
                  rel="noopener noreferrer">
                  https://github.com/bitnami/containers/issues/34541 →
                </a>
              </div>
            </section>

            {/* 학력 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>학력</h2>
              <div className={styles.eduNote}>
                <p>학력 정보는 이력서 요청시 제공</p>
              </div>
            </section>

            <footer className={styles.pageFooter}>
              <p>Last updated: {lastUpdated}</p>
            </footer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
