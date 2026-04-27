import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/info',
    component: ComponentCreator('/info', '6e1'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/project',
    component: ComponentCreator('/project', 'ea5'),
    exact: true
  },
  {
    path: '/projects',
    component: ComponentCreator('/projects', '21b'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/tags',
    component: ComponentCreator('/tags', 'f94'),
    exact: true
  },
  {
    path: '/tags/algorithm',
    component: ComponentCreator('/tags/algorithm', 'c69'),
    exact: true
  },
  {
    path: '/tags/argocd',
    component: ComponentCreator('/tags/argocd', '763'),
    exact: true
  },
  {
    path: '/tags/aws',
    component: ComponentCreator('/tags/aws', '80a'),
    exact: true
  },
  {
    path: '/tags/backend',
    component: ComponentCreator('/tags/backend', '91e'),
    exact: true
  },
  {
    path: '/tags/cloud',
    component: ComponentCreator('/tags/cloud', '7db'),
    exact: true
  },
  {
    path: '/tags/cloud-native',
    component: ComponentCreator('/tags/cloud-native', '815'),
    exact: true
  },
  {
    path: '/tags/container',
    component: ComponentCreator('/tags/container', '8ba'),
    exact: true
  },
  {
    path: '/tags/cs',
    component: ComponentCreator('/tags/cs', '949'),
    exact: true
  },
  {
    path: '/tags/docker',
    component: ComponentCreator('/tags/docker', 'f12'),
    exact: true
  },
  {
    path: '/tags/eks',
    component: ComponentCreator('/tags/eks', '965'),
    exact: true
  },
  {
    path: '/tags/http',
    component: ComponentCreator('/tags/http', 'f11'),
    exact: true
  },
  {
    path: '/tags/intro',
    component: ComponentCreator('/tags/intro', 'ad5'),
    exact: true
  },
  {
    path: '/tags/java',
    component: ComponentCreator('/tags/java', 'c70'),
    exact: true
  },
  {
    path: '/tags/kubernetes',
    component: ComponentCreator('/tags/kubernetes', 'f52'),
    exact: true
  },
  {
    path: '/tags/kyaml',
    component: ComponentCreator('/tags/kyaml', '9a7'),
    exact: true
  },
  {
    path: '/tags/opensource',
    component: ComponentCreator('/tags/opensource', '77d'),
    exact: true
  },
  {
    path: '/tags/security',
    component: ComponentCreator('/tags/security', 'f63'),
    exact: true
  },
  {
    path: '/tags/spring',
    component: ComponentCreator('/tags/spring', '4d1'),
    exact: true
  },
  {
    path: '/tags/yaml',
    component: ComponentCreator('/tags/yaml', 'dfd'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '4d1'),
    routes: [
      {
        path: '/blog',
        component: ComponentCreator('/blog', '88c'),
        routes: [
          {
            path: '/blog/tags',
            component: ComponentCreator('/blog/tags', 'c79'),
            exact: true
          },
          {
            path: '/blog/tags/algorithm',
            component: ComponentCreator('/blog/tags/algorithm', 'd99'),
            exact: true
          },
          {
            path: '/blog/tags/argocd',
            component: ComponentCreator('/blog/tags/argocd', 'f6a'),
            exact: true
          },
          {
            path: '/blog/tags/aws',
            component: ComponentCreator('/blog/tags/aws', 'fd3'),
            exact: true
          },
          {
            path: '/blog/tags/backend',
            component: ComponentCreator('/blog/tags/backend', '664'),
            exact: true
          },
          {
            path: '/blog/tags/cicd',
            component: ComponentCreator('/blog/tags/cicd', 'be8'),
            exact: true
          },
          {
            path: '/blog/tags/cloud',
            component: ComponentCreator('/blog/tags/cloud', 'b13'),
            exact: true
          },
          {
            path: '/blog/tags/cloud-native',
            component: ComponentCreator('/blog/tags/cloud-native', 'c05'),
            exact: true
          },
          {
            path: '/blog/tags/container',
            component: ComponentCreator('/blog/tags/container', 'f10'),
            exact: true
          },
          {
            path: '/blog/tags/cs',
            component: ComponentCreator('/blog/tags/cs', '86e'),
            exact: true
          },
          {
            path: '/blog/tags/docker',
            component: ComponentCreator('/blog/tags/docker', '4f5'),
            exact: true
          },
          {
            path: '/blog/tags/eks',
            component: ComponentCreator('/blog/tags/eks', '3af'),
            exact: true
          },
          {
            path: '/blog/tags/http',
            component: ComponentCreator('/blog/tags/http', '6b7'),
            exact: true
          },
          {
            path: '/blog/tags/intro',
            component: ComponentCreator('/blog/tags/intro', '727'),
            exact: true
          },
          {
            path: '/blog/tags/java',
            component: ComponentCreator('/blog/tags/java', '673'),
            exact: true
          },
          {
            path: '/blog/tags/jenkins',
            component: ComponentCreator('/blog/tags/jenkins', 'bac'),
            exact: true
          },
          {
            path: '/blog/tags/kubernetes',
            component: ComponentCreator('/blog/tags/kubernetes', 'efc'),
            exact: true
          },
          {
            path: '/blog/tags/kyaml',
            component: ComponentCreator('/blog/tags/kyaml', '95f'),
            exact: true
          },
          {
            path: '/blog/tags/logging',
            component: ComponentCreator('/blog/tags/logging', '627'),
            exact: true
          },
          {
            path: '/blog/tags/opensource',
            component: ComponentCreator('/blog/tags/opensource', '1de'),
            exact: true
          },
          {
            path: '/blog/tags/security',
            component: ComponentCreator('/blog/tags/security', '71d'),
            exact: true
          },
          {
            path: '/blog/tags/spring',
            component: ComponentCreator('/blog/tags/spring', '184'),
            exact: true
          },
          {
            path: '/blog/tags/yaml',
            component: ComponentCreator('/blog/tags/yaml', 'b87'),
            exact: true
          },
          {
            path: '/blog',
            component: ComponentCreator('/blog', '134'),
            routes: [
              {
                path: '/blog',
                component: ComponentCreator('/blog', 'a08'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/boj-13458-exam-supervisor',
                component: ComponentCreator('/blog/backend/coding/boj-13458-exam-supervisor', 'a24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/boj-14501-resignation',
                component: ComponentCreator('/blog/backend/coding/boj-14501-resignation', '3d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/boj-14502-laboratory',
                component: ComponentCreator('/blog/backend/coding/boj-14502-laboratory', 'd10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/boj-14888-insert-operators',
                component: ComponentCreator('/blog/backend/coding/boj-14888-insert-operators', 'cb3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/pccp-1-lonely-alphabet',
                component: ComponentCreator('/blog/backend/coding/pccp-1-lonely-alphabet', 'da0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/pccp-2-sports-day',
                component: ComponentCreator('/blog/backend/coding/pccp-2-sports-day', '13a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/pccp-3-genetics-law',
                component: ComponentCreator('/blog/backend/coding/pccp-3-genetics-law', '7d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/coding/pccp-4-operating-system',
                component: ComponentCreator('/blog/backend/coding/pccp-4-operating-system', 'c4b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/arrays',
                component: ComponentCreator('/blog/backend/java/arrays', '6f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/conditionals-and-loops',
                component: ComponentCreator('/blog/backend/java/conditionals-and-loops', 'ce7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/java-introduction',
                component: ComponentCreator('/blog/backend/java/java-introduction', '4ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/jit-compiler',
                component: ComponentCreator('/blog/backend/java/jit-compiler', '989'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/jvm',
                component: ComponentCreator('/blog/backend/java/jvm', '617'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/operators',
                component: ComponentCreator('/blog/backend/java/operators', '567'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/java/variables',
                component: ComponentCreator('/blog/backend/java/variables', '123'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/backend/spring/ioc-container-intro',
                component: ComponentCreator('/blog/backend/spring/ioc-container-intro', '5fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cicd/game-build-deploy-cicd-overview',
                component: ComponentCreator('/blog/cicd/game-build-deploy-cicd-overview', '204'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cicd/game-jenkins-job-separation',
                component: ComponentCreator('/blog/cicd/game-jenkins-job-separation', 'c19'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cicd/jenkins-inbound-agent-websocket',
                component: ComponentCreator('/blog/cicd/jenkins-inbound-agent-websocket', '2df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud-native/envoy/architecture-overview',
                component: ComponentCreator('/blog/cloud-native/envoy/architecture-overview', 'c6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud-native/envoy/cluster-manager',
                component: ComponentCreator('/blog/cloud-native/envoy/cluster-manager', 'fd2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud-native/envoy/grpc-communication',
                component: ComponentCreator('/blog/cloud-native/envoy/grpc-communication', 'f6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud-native/envoy/threading-model',
                component: ComponentCreator('/blog/cloud-native/envoy/threading-model', '390'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud/aws/argocd-external-eks',
                component: ComponentCreator('/blog/cloud/aws/argocd-external-eks', '4f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud/aws/aws-cloud-concepts',
                component: ComponentCreator('/blog/cloud/aws/aws-cloud-concepts', 'd79'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cloud/aws/eks-cost-overview',
                component: ComponentCreator('/blog/cloud/aws/eks-cost-overview', '49c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/containerd-shim',
                component: ComponentCreator('/blog/container/containerd-shim', '13b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/docker-container-creation-flow',
                component: ComponentCreator('/blog/container/docker-container-creation-flow', '2b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/docker-cri-oci-runc-stack',
                component: ComponentCreator('/blog/container/docker-cri-oci-runc-stack', 'a6a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/docker-vs-containerd-daemon',
                component: ComponentCreator('/blog/container/docker-vs-containerd-daemon', 'cd7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/oci-spec',
                component: ComponentCreator('/blog/container/oci-spec', 'e3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/container/runc',
                component: ComponentCreator('/blog/container/runc', '418'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cs/http-cache-headers',
                component: ComponentCreator('/blog/cs/http-cache-headers', '661'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/cs/ssh-server-hardening',
                component: ComponentCreator('/blog/cs/ssh-server-hardening', '97c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/concept-containerd-cri',
                component: ComponentCreator('/blog/kubernetes/concept-containerd-cri', '73a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/concept-kube-controller-manager',
                component: ComponentCreator('/blog/kubernetes/concept-kube-controller-manager', 'df9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/concept-kube-scheduler',
                component: ComponentCreator('/blog/kubernetes/concept-kube-scheduler', 'cb0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/concept-kubernetes-overview',
                component: ComponentCreator('/blog/kubernetes/concept-kubernetes-overview', '05b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/concept-pod',
                component: ComponentCreator('/blog/kubernetes/concept-pod', 'e5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/k3s-x86-orbstack-apple-silicon',
                component: ComponentCreator('/blog/kubernetes/k3s-x86-orbstack-apple-silicon', 'f9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/k8s-api-tls-external-request',
                component: ComponentCreator('/blog/kubernetes/k8s-api-tls-external-request', '2a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/kubectl-top-vs-free-memory',
                component: ComponentCreator('/blog/kubernetes/kubectl-top-vs-free-memory', 'f5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/kubernetes-logging-architecture',
                component: ComponentCreator('/blog/kubernetes/kubernetes-logging-architecture', 'f45'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/kyaml-kubernetes-yaml',
                component: ComponentCreator('/blog/kubernetes/kyaml-kubernetes-yaml', 'a90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-calico-cni',
                component: ComponentCreator('/blog/kubernetes/network-calico-cni', '587'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-cilium-cni',
                component: ComponentCreator('/blog/kubernetes/network-cilium-cni', 'e04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-cilium-components',
                component: ComponentCreator('/blog/kubernetes/network-cilium-components', '543'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-cilium-pod-to-pod',
                component: ComponentCreator('/blog/kubernetes/network-cilium-pod-to-pod', '918'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-coredns-multiple-dns',
                component: ComponentCreator('/blog/kubernetes/network-coredns-multiple-dns', '938'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-kernel-tuning',
                component: ComponentCreator('/blog/kubernetes/network-kernel-tuning', '831'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/network-router-vs-gateway',
                component: ComponentCreator('/blog/kubernetes/network-router-vs-gateway', 'efa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/kubernetes/sealed-secrets-gitops',
                component: ComponentCreator('/blog/kubernetes/sealed-secrets-gitops', 'f68'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/jenkins-core-architecture',
                component: ComponentCreator('/blog/opensource/jenkins-core-architecture', '457'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/loki-overview',
                component: ComponentCreator('/blog/opensource/loki-overview', 'e69'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/mimir-architecture',
                component: ComponentCreator('/blog/opensource/mimir-architecture', 'e03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/opentelemetry-lgtm-architecture',
                component: ComponentCreator('/blog/opensource/opentelemetry-lgtm-architecture', '078'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/oss-documentation-template',
                component: ComponentCreator('/blog/opensource/oss-documentation-template', '45e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/tempo-architecture',
                component: ComponentCreator('/blog/opensource/tempo-architecture', '4d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/opensource/tempo-overview',
                component: ComponentCreator('/blog/opensource/tempo-overview', '868'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
