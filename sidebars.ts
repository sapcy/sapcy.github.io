import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Docs 사이드바 - 최상위 메뉴 아래 2단계(필요 시 3단계) 카테고리로 분류.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '시작하기',
      key: 'intro',
    },
    {
      type: 'category',
      label: '클라우드',
      key: 'cloud',
      items: [
        {
          type: 'category',
          label: 'AWS',
          key: 'aws',
          items: [
            {
              type: 'category',
              label: 'EKS',
              key: 'aws-cluster',
              items: [
                'cloud/aws/eks-cost-overview',
                'cloud/aws/argocd-external-eks',
              ],
            },
            {
              type: 'category',
              label: '개념',
              key: 'aws-foundation',
              items: ['cloud/aws/aws-cloud-concepts'],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '쿠버네티스',
      key: 'kubernetes',
      items: [
        {
          type: 'category',
          label: '개념',
          key: 'k8s-concepts',
          items: [
            'kubernetes/concept-kubernetes-overview',
            'kubernetes/concept-pod',
            'kubernetes/concept-kube-scheduler',
            'kubernetes/concept-kube-controller-manager',
            'kubernetes/concept-containerd-cri',
            'kubernetes/kubelet-pleg',
            {
              type: 'doc',
              id: 'kubernetes/kubernetes-logging-architecture',
              label: 'Kubernetes 로깅 아키텍처',
            },
          ],
        },
        {
          type: 'category',
          label: '운영·실습',
          key: 'k8s-ops',
          items: [
            'kubernetes/kyaml-kubernetes-yaml',
            'kubernetes/k8s-api-tls-external-request',
            'kubernetes/kubectl-top-vs-free-memory',
            'kubernetes/k3s-x86-orbstack-apple-silicon',
            'kubernetes/sealed-secrets-gitops',
            'kubernetes/pod-container-status-unknown',
          ],
        },
        {
          type: 'category',
          label: '네트워크',
          key: 'k8s-network',
          items: [
            'kubernetes/network-calico-cni',
            'kubernetes/network-cilium-cni',
            'kubernetes/network-cilium-components',
            'kubernetes/network-cilium-pod-to-pod',
            'kubernetes/network-coredns-multiple-dns',
            'kubernetes/network-kernel-tuning',
            'kubernetes/network-router-vs-gateway',
            {
              type: 'category',
              label: 'Envoy',
              key: 'k8s-network-envoy',
              items: [
                'cloud-native/envoy/architecture-overview',
                'cloud-native/envoy/grpc-communication',
                'cloud-native/envoy/threading-model',
                'cloud-native/envoy/cluster-manager',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CS',
      key: 'cs',
      items: [
        {
          type: 'category',
          label: '웹',
          key: 'cs-web',
          items: ['cs/http-cache-headers'],
        },
        {
          type: 'category',
          label: '보안',
          key: 'cs-security',
          items: ['cs/ssh-server-hardening'],
        },
      ],
    },
    {
      type: 'category',
      label: '컨테이너',
      key: 'container',
      items: [
        {
          type: 'category',
          label: 'OCI·런타임',
          key: 'container-runtime',
          items: [
            'container/oci-spec',
            'container/runc',
            'container/containerd-shim',
          ],
        },
        {
          type: 'category',
          label: 'Docker',
          key: 'container-docker',
          items: [
            'container/docker-vs-containerd-daemon',
            'container/docker-cri-oci-runc-stack',
            'container/docker-container-creation-flow',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CI | CD',
      key: 'cicd',
      items: [
        {
          type: 'doc',
          id: 'opensource/jenkins-core-architecture',
          label: 'Jenkins - 코어·확장·인프라 구조 개요',
        },
        'cicd/jenkins-inbound-agent-websocket',
        'cicd/game-jenkins-job-separation',
        'cicd/game-build-deploy-cicd-overview',
      ],
    },
    {
      type: 'category',
      label: '오픈소스',
      key: 'opensource',
      items: [
        {
          type: 'doc',
          id: 'opensource/oss-documentation-template',
          label: '오픈소스 문서화 체크리스트',
          key: 'oss-documentation-template',
        },
        {
          type: 'category',
          label: 'Observability',
          key: 'oss-observability',
          items: [
            'opensource/loki-overview',
            'opensource/tempo-overview',
            'opensource/tempo-architecture',
            'opensource/mimir-architecture',
            'opensource/opentelemetry-lgtm-architecture',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '백엔드',
      key: 'backend',
      items: [
        {
          type: 'category',
          label: '코딩',
          key: 'coding',
          items: [
            {
              type: 'category',
              label: '백준 (BOJ)',
              key: 'coding-boj',
              items: [
                'backend/coding/boj-14502-laboratory',
                'backend/coding/boj-14888-insert-operators',
                'backend/coding/boj-14501-resignation',
                'backend/coding/boj-13458-exam-supervisor',
              ],
            },
            {
              type: 'category',
              label: 'PCCP',
              key: 'coding-pccp',
              items: [
                'backend/coding/pccp-4-operating-system',
                'backend/coding/pccp-3-genetics-law',
                'backend/coding/pccp-2-sports-day',
                'backend/coding/pccp-1-lonely-alphabet',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Java',
          key: 'java',
          items: [
            'backend/java/arrays',
            'backend/java/conditionals-and-loops',
            'backend/java/operators',
            'backend/java/variables',
            'backend/java/jit-compiler',
            'backend/java/jvm',
            'backend/java/java-introduction',
          ],
        },
        {
          type: 'category',
          label: 'Spring',
          key: 'spring',
          items: ['backend/spring/ioc-container-intro'],
        },
      ],
    },
  ],
};

export default sidebars;
