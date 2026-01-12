const projects = [
  {
    title: '건강보험공단 클라우드 표준 플랫폼 구축',
    period: '2025-08 ~ 2025-12',
    company: '오케스트로(주)',
    highlights: [
      '건강보험공단의 클라우드 표준 플랫폼을 구축하는 프로젝트이며, DevOps 엔지니어로 참여',
      '각각 다른 업무 시스템의 개발 소스를 SVN에서 Git으로 전환하여 플랫폼을 이용한 CI/CD 파이프라인 설계',
      'WEB, WAS, DB 상용/공개 솔루션별 Helm chart 템플릿 작성',
    ],
    tech: 'K8s, OpenStack, ArgoCD, Jenkins, Nexus, Harbor',
  },
  {
    title: '미래에셋증권 CI/CD 플랫폼 구축',
    period: '2025-01 ~ 2025-08',
    company: '오케스트로(주)',
    highlights: [
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
    highlights: [
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
    highlights: [
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
    highlights: [
      '하나금융티아이 내부 직원 및 관계사를 위한 클라우드 포털 시스템을 구축하는 프로젝트에 플랫폼 엔지니어를 담당',
      'OpenStack 기반 가상머신에 K8s 클러스터를 구축',
      'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발',
      'Jenkins로 개발 소스 빌드/배포 파이프라인 구축',
    ],
    tech: 'Spring Boot, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
  },
  {
    title: '전자정부 클라우드 플랫폼 (1, 2차)',
    period: '2020-01 ~ 2021-04',
    company: '오케스트로(주)',
    highlights: [
      '행정안전부 주관하에 인프라, 서비스, 개발프레임워크 등을 서비스 형태로 제공하는 클라우드 플랫폼 포털 풀스택 개발 담당',
      'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발',
      '계정 별로 Connection pool 생성하여 메모리 사용량 및 요청 속도 20%이상 개선',
      'Agile 개발 프로세스 수행 경험',
    ],
    tech: 'Spring Boot, Spring Security, Spring Cloud Config, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
  },
]

export function Projects() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        프로젝트
      </h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <span className="text-sm text-gray-500">{project.period}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{project.company}</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
            {project.tech && (
              <p className="mt-3 text-xs text-gray-500">
                <span className="font-medium">기술스택:</span> {project.tech}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

