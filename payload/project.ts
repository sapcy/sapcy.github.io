import { IProject } from '../component/project/IProject';

const project: IProject.Payload = {
  disable: false,
  list: [
    {
      title: '건강보험공단 클라우드 표준 플랫폼 구축',
      startedAt: '2025-08',
      endedAt: '2025-12',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
              '건강보험공단의 클라우드 표준 플랫폼을 구축하는 프로젝트이며, DevOps 엔지니어로 참여',
          weight: 'MEDIUM',
        },
        {
          content: '각각 다른 업무 시스템의 개발 소스를 SVN에서 Git으로 전환하여 플랫폼을 이용한 CI/CD 파이프라인 설계',
        },
        {
          content: 'WEB, WAS, DB 상용/공개 솔루션별 Helm chart 템플릿 작성',
        },
        {
          content: '기술스택',
          descriptions: [
            {
              content:
                  'K8s, OpenStack, ArgoCD, Jenkins, Nexus, Harbor'
            },
          ],
        },
      ],
    },
    {
      title: '미래에셋증권 CI/CD 플랫폼 구축',
      startedAt: '2025-01',
      endedAt: '2025-08',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
              '미래에셋증권의 업무 및 프레임워크 영역 빌드/배포를 통합하여 제공하는 CI/CD 플랫폼을 구축하는 프로젝트이며, DevOps 엔지니어로 참여',
          weight: 'MEDIUM',
        },
        {
          content: '각각 다른 업무 시스템의 AS-IS 파이프라인 구성(Gitlab CI/CD, Argo workflow, Nexus)에서 ' +
              'CI/CD 플랫폼(애플리케이션, Jenkins, Gitlab, Nexus, ArgoCD 등) 구성으로 전환',
        },
        {
          content: 'Harbor, Nexus, Gitlab 데이터 마이그레이션'
        },
        {
          content: '프라이빗 클라우드(Openshift)에서 빌드하고 ECS로 배포하는 하이브리드 클라우드 CI/CD 설계'
        },
      ],
    },
    {
      title: '24년 클라우드 네이티브 전환 상세설계 사업(2차)',
      startedAt: '2024-06',
      endedAt: '2024-11',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
            'NIA 주관 하에 기존 레거시 시스템에 대한 클라우드네이티브 전환 방안 상세설계 TA로 참여',
          weight: 'MEDIUM',
        },
        {
          content: 'MSA 아키텍처 설계',
          descriptions: [{ content: '이벤트스토밍 과정을 통해 이벤트 기준 마이크로서비스 분류' }],
        },
        {
          content:
            'DevSecOps, Message Broker, Service Mesh, Telemetry 등 영역별로 대상 시스템에 적합한 OSS 분석 & 선별',
        },
        {
          content:
            '대상 시스템 사용량 및 용도 기준으로 K8s 클러스터 노드, 내부 Namespace, Pod 등 자원들의 구성, 용량 설계',
        },
        { content: 'TO-BE 설계 기준에 적합한 CSP 서비스 분석 및 선정' },
      ],
    },
    {
      title: 'PaaS Viola 개발',
      startedAt: '2024-04',
      endedAt: '2024-05',
      where: '오케스트로(주)',
      descriptions: [
        {
          content: '사내 PaaS 솔루션 Viola의 서비스 메시 파트 개발 리딩',
          weight: 'MEDIUM',
        },
        { content: 'K8s API를 이용한 Istio 기반 서비스 메시 API 서버 개발' },
        { content: 'Kiali를 이용한 서비스 메시 대시보드 개발' },
        { content: 'cluster-api를 이용해 클러스터 생성 시 Istio 구성 배포 자동화 Helm chart 및 스크립트 개발' },
      ],
    },
    {
      title: '하나은행 프로젝트 ONE',
      startedAt: '2023-07',
      endedAt: '2024-04',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
            '하나은행 ICT 인프라 구축 프로젝트에 클라우드 자원(IaaS) 및 클라우드 네이티브(PaaS) 자원에 대한 통합 관리 플랫폼(CMP) 구축을 담당',
          weight: 'MEDIUM',
        },
        {
          content:
            'VMware 기반 가상머신에 K8s 클러스터를 구축하여 CMP 솔루션 및 오픈소스 기반 Outer 아키텍처 구성',
        },
        {
          content: 'Gitlab CI 및 Nexus3를 이용한 개발/운영 클러스터 배포 파이프라인 구축',
          descriptions: [
            { content: '라이브러리 다운로드 영역에 캐싱을 적용하여 빌드 시간 감소 (2분 -> 30초)' },
          ],
        },
        {
          content:
            'ArgoCD, Gitlab을 이용하여 인프라 코드(Shell script, Helm chart, Manifests)를 Git으로 관리/배포하는 GitOps 구성',
        },
        {
          content: 'Prometheus, Grafana를 이용해 모니터링 시스템 구축',
          descriptions: [{ content: '클러스터 통합 대시보드 커스텀 개발' }],
        },
        { content: 'Fluent-bit로 클러스터 통합 로그 시스템 구축' },
        { content: 'Maxscale을 사용하여 MariaDB 3대에 대한 R/W Split 및 Auto failover 환경 구성' },
        {
          content: 'DR 시스템 구축',
          descriptions: [
            { content: '초기 설계시 RTO가 2시간이었으나 자동화 스크립트를 통해 30분 내로 단축' },
          ],
        },
        {
          content:
            '오프라인 환경에서 K8s 버전 업그레이드(v1.23.7 -> v1.28.4) 및 클러스터 IP 대역 변경 작업 수행',
        },
        {
          content: '솔루션 배포 Helm chart 고도화',
          descriptions: [
            {
              content:
                '공통된 부분을 묶어 Library Chart로 구성하여 Value 수정 작업에 대한 효율성 확보',
            },
          ],
        },
      ],
    },
    {
      title: 'Hanacloudia 포털 고도화',
      startedAt: '2022-06',
      endedAt: '2023-02',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
            '하나금융티아이 내부 직원 및 관계사를 위한 클라우드 포털 시스템을 구축하는 프로젝트에 플랫폼 엔지니어를 담당',
          weight: 'MEDIUM',
        },
        {
          content: '기술스택',
          descriptions: [
            {
              content:
                'Spring Boot, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
            },
          ],
        },
        {
          content:
            'OpenStack 기반 가상머신에 K8s 클러스터를 구축하여 CMP 솔루션 및 오픈소스 기반 Outer 아키텍처 구성',
        },
        // {
        //   content: 'Octavia LB를 통해 Terminated HTTPS 모드 설정 후 포털 인증서 적용',
        //   descriptions: [
        //     { content: 'barbican에 인증서 등록 후 포털 LB에 매핑' },
        //   ],
        // },
        {
          content:
            'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발 (Network, Volume 파트)',
          // descriptions: [
          //   { content: '최초 설계시 자원에 대한 CRUD 방식을 동기 방식에서 Websocket을 이용한 비동기 방식으로 전환하여 UX 개선' },
          // ],
        },
        {
          content:
            '웹서버로부터 받는 static 소스들이 버전 패치 이후에도 사용자 브라우저에 캐싱되어 남아있는 이슈 해결',
          descriptions: [
            {
              content:
                '업데이트가 필요한 static 파일 요청시 Header에 ETag 값을 부여하여 패치나 만료 시간 이후로 파일을 갱신하도록 설정',
            },
          ],
        },
        {
          content: '플랫폼 시스템 아키텍처 설계',
          descriptions: [
            { content: '클러스터 CRI, CNI, CSI 분석/검증' },
            { content: '백업/DR 방안' },
          ],
        },
        {
          content: '운영/검증/DR K8s 클러스터 구축 및 검증',
          descriptions: [
            { content: '무중단 배포' },
            { content: 'VM Hard shutdown 복구 자동화 테스트' },
          ],
        },
        { content: 'Jenkins로 개발 소스 빌드/배포 파이프라인 구축' },
      ],
    },
    {
      title: '드림마크원 공공 클라우드',
      startedAt: '2021-09',
      endedAt: '2022-05',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
            '드림마크원의 공공 클라우드 포털 시스템 구축 프로젝트에서 플랫폼 엔지니어를 담당',
          weight: 'MEDIUM',
        },
        { content: '플랫폼 시스템 아키텍처 설계' },
        { content: 'OpenStack 기반 운영/DR/개발 플랫폼 환경 구축' },
        {
          content: 'CCE, CVE 보안취약점 조치 과정 개선',
          descriptions: [
            {
              content: 'VM 54대에 모두 수동으로 작업해야하는 문제를 Ansible로 자동화하여 시간 단축',
            },
          ],
        },
        {
          content: '폐쇄망 SCM Manager에 인터넷망 개발 레포 git 미러링 ⇒ Jenkins 빌드/배포 자동화',
        },
      ],
    },
    {
      title: '전자정부 클라우드 플랫폼 (1, 2차)',
      startedAt: '2020-01',
      endedAt: '2021-04',
      where: '오케스트로(주)',
      descriptions: [
        {
          content:
            '행정안전부 주관하에 인프라, 서비스, 개발프레임워크 등을 서비스 형태로 제공하는 클라우드 플랫폼 포털 풀스택 개발 담당',
          weight: 'MEDIUM',
        },
        {
          content: '기술스택',
          descriptions: [
            {
              content:
                'Spring Boot, Spring Security, Spring Cloud Config, JPA, RabbitMQ, Redis, MariaDB, Keycloak, Vault, K8s, Docker, OpenStack',
            },
          ],
        },
        { content: '플랫폼 관리자 포털 특정 도메인 개발 및 기존로직 개선 (IaaS 콘솔, 공통)' },
        { content: '개발환경 VM에 미들웨어 MariaDB, RabbitMQ, Vault, Keycloak 구성' },
        { content: 'KVM을 이용하여 IaaS 서비스용 VM 커스텀 이미지 생성' },
        {
          content:
            'Openstack4j 라이브러리를 이용한 Openstack 콘솔 API 서버 및 화면 개발 (네트워크, 라우터, 유동IP, 볼륨, 볼륨 스냅샷)',
        },
        { content: '계정 별로 Connection pool 생성하여 메모리 사용량 및 요청 속도 20%이상 개선' },
        {
          content:
            '카테고리 조회 및 수정 기능에 대해 list를 순회하는 방식에서 HashMap 방식으로 변경 후 로직 속도 70% 증가',
        },
        { content: '약 500건의 기능 단위 테스트 수행' },
        {
          content: 'Agile 개발 프로세스 수행 경험',
          descriptions: [{ content: '1~3차로 나눠 6주 단위로 개발 후 고객 피드백 사항 반영' }],
        },
      ],
    },
  ],
};

export default project;
