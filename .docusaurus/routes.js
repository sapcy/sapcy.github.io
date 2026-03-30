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
    path: '/docs',
    component: ComponentCreator('/docs', '769'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'c6c'),
        routes: [
          {
            path: '/docs/tags',
            component: ComponentCreator('/docs/tags', 'fce'),
            exact: true
          },
          {
            path: '/docs/tags/algorithm',
            component: ComponentCreator('/docs/tags/algorithm', '34f'),
            exact: true
          },
          {
            path: '/docs/tags/argocd',
            component: ComponentCreator('/docs/tags/argocd', 'e5d'),
            exact: true
          },
          {
            path: '/docs/tags/aws',
            component: ComponentCreator('/docs/tags/aws', 'e55'),
            exact: true
          },
          {
            path: '/docs/tags/backend',
            component: ComponentCreator('/docs/tags/backend', 'd24'),
            exact: true
          },
          {
            path: '/docs/tags/cloud',
            component: ComponentCreator('/docs/tags/cloud', 'ed2'),
            exact: true
          },
          {
            path: '/docs/tags/cloud-native',
            component: ComponentCreator('/docs/tags/cloud-native', '723'),
            exact: true
          },
          {
            path: '/docs/tags/container',
            component: ComponentCreator('/docs/tags/container', '1bb'),
            exact: true
          },
          {
            path: '/docs/tags/cs',
            component: ComponentCreator('/docs/tags/cs', 'd6c'),
            exact: true
          },
          {
            path: '/docs/tags/docker',
            component: ComponentCreator('/docs/tags/docker', '0d0'),
            exact: true
          },
          {
            path: '/docs/tags/eks',
            component: ComponentCreator('/docs/tags/eks', '62a'),
            exact: true
          },
          {
            path: '/docs/tags/http',
            component: ComponentCreator('/docs/tags/http', 'aa0'),
            exact: true
          },
          {
            path: '/docs/tags/intro',
            component: ComponentCreator('/docs/tags/intro', '3af'),
            exact: true
          },
          {
            path: '/docs/tags/java',
            component: ComponentCreator('/docs/tags/java', '908'),
            exact: true
          },
          {
            path: '/docs/tags/kubernetes',
            component: ComponentCreator('/docs/tags/kubernetes', 'a8b'),
            exact: true
          },
          {
            path: '/docs/tags/kyaml',
            component: ComponentCreator('/docs/tags/kyaml', 'f31'),
            exact: true
          },
          {
            path: '/docs/tags/opensource',
            component: ComponentCreator('/docs/tags/opensource', '228'),
            exact: true
          },
          {
            path: '/docs/tags/security',
            component: ComponentCreator('/docs/tags/security', '056'),
            exact: true
          },
          {
            path: '/docs/tags/spring',
            component: ComponentCreator('/docs/tags/spring', '401'),
            exact: true
          },
          {
            path: '/docs/tags/yaml',
            component: ComponentCreator('/docs/tags/yaml', '4ba'),
            exact: true
          },
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'e5b'),
            routes: [
              {
                path: '/docs/backend/coding/boj-13458-exam-supervisor',
                component: ComponentCreator('/docs/backend/coding/boj-13458-exam-supervisor', 'd4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/boj-14501-resignation',
                component: ComponentCreator('/docs/backend/coding/boj-14501-resignation', '231'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/boj-14502-laboratory',
                component: ComponentCreator('/docs/backend/coding/boj-14502-laboratory', 'a33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/boj-14888-insert-operators',
                component: ComponentCreator('/docs/backend/coding/boj-14888-insert-operators', '47a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/pccp-1-lonely-alphabet',
                component: ComponentCreator('/docs/backend/coding/pccp-1-lonely-alphabet', '707'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/pccp-2-sports-day',
                component: ComponentCreator('/docs/backend/coding/pccp-2-sports-day', 'b11'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/pccp-3-genetics-law',
                component: ComponentCreator('/docs/backend/coding/pccp-3-genetics-law', '345'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/coding/pccp-4-operating-system',
                component: ComponentCreator('/docs/backend/coding/pccp-4-operating-system', '8f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/arrays',
                component: ComponentCreator('/docs/backend/java/arrays', '4e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/conditionals-and-loops',
                component: ComponentCreator('/docs/backend/java/conditionals-and-loops', '2ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/java-introduction',
                component: ComponentCreator('/docs/backend/java/java-introduction', '1c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/jit-compiler',
                component: ComponentCreator('/docs/backend/java/jit-compiler', 'fa7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/jvm',
                component: ComponentCreator('/docs/backend/java/jvm', '17e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/operators',
                component: ComponentCreator('/docs/backend/java/operators', '03f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/java/variables',
                component: ComponentCreator('/docs/backend/java/variables', 'c9b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/backend/spring/ioc-container-intro',
                component: ComponentCreator('/docs/backend/spring/ioc-container-intro', '09b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud-native/envoy/architecture-overview',
                component: ComponentCreator('/docs/cloud-native/envoy/architecture-overview', 'b45'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud-native/envoy/cluster-manager',
                component: ComponentCreator('/docs/cloud-native/envoy/cluster-manager', '41f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud-native/envoy/grpc-communication',
                component: ComponentCreator('/docs/cloud-native/envoy/grpc-communication', '85d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud-native/envoy/threading-model',
                component: ComponentCreator('/docs/cloud-native/envoy/threading-model', '844'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/aws/argocd-external-eks',
                component: ComponentCreator('/docs/cloud/aws/argocd-external-eks', '0d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/aws/aws-cloud-concepts',
                component: ComponentCreator('/docs/cloud/aws/aws-cloud-concepts', '540'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/aws/eks-cost-overview',
                component: ComponentCreator('/docs/cloud/aws/eks-cost-overview', '2fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/concept-containerd-cri',
                component: ComponentCreator('/docs/cloud/kubernetes/concept-containerd-cri', 'dc3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/concept-kube-controller-manager',
                component: ComponentCreator('/docs/cloud/kubernetes/concept-kube-controller-manager', '7c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/concept-kube-scheduler',
                component: ComponentCreator('/docs/cloud/kubernetes/concept-kube-scheduler', '81b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/concept-kubernetes-overview',
                component: ComponentCreator('/docs/cloud/kubernetes/concept-kubernetes-overview', 'f24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/concept-pod',
                component: ComponentCreator('/docs/cloud/kubernetes/concept-pod', '88e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/k3s-x86-orbstack-apple-silicon',
                component: ComponentCreator('/docs/cloud/kubernetes/k3s-x86-orbstack-apple-silicon', '055'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/k8s-api-tls-external-request',
                component: ComponentCreator('/docs/cloud/kubernetes/k8s-api-tls-external-request', '2bd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/kubectl-top-vs-free-memory',
                component: ComponentCreator('/docs/cloud/kubernetes/kubectl-top-vs-free-memory', '98d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/kyaml-kubernetes-yaml',
                component: ComponentCreator('/docs/cloud/kubernetes/kyaml-kubernetes-yaml', '244'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-calico-cni',
                component: ComponentCreator('/docs/cloud/kubernetes/network-calico-cni', '2cd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-cilium-cni',
                component: ComponentCreator('/docs/cloud/kubernetes/network-cilium-cni', 'b3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-cilium-components',
                component: ComponentCreator('/docs/cloud/kubernetes/network-cilium-components', '390'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-cilium-pod-to-pod',
                component: ComponentCreator('/docs/cloud/kubernetes/network-cilium-pod-to-pod', '619'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-coredns-multiple-dns',
                component: ComponentCreator('/docs/cloud/kubernetes/network-coredns-multiple-dns', '3a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-kernel-tuning',
                component: ComponentCreator('/docs/cloud/kubernetes/network-kernel-tuning', '090'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/network-router-vs-gateway',
                component: ComponentCreator('/docs/cloud/kubernetes/network-router-vs-gateway', 'ef3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/kubernetes/sealed-secrets-gitops',
                component: ComponentCreator('/docs/cloud/kubernetes/sealed-secrets-gitops', '5b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/containerd-shim',
                component: ComponentCreator('/docs/container/containerd-shim', '728'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/docker-container-creation-flow',
                component: ComponentCreator('/docs/container/docker-container-creation-flow', '922'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/docker-cri-oci-runc-stack',
                component: ComponentCreator('/docs/container/docker-cri-oci-runc-stack', '7af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/docker-vs-containerd-daemon',
                component: ComponentCreator('/docs/container/docker-vs-containerd-daemon', '575'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/oci-spec',
                component: ComponentCreator('/docs/container/oci-spec', 'd61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/container/runc',
                component: ComponentCreator('/docs/container/runc', 'bfb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cs/http-cache-headers',
                component: ComponentCreator('/docs/cs/http-cache-headers', 'edc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cs/ssh-server-hardening',
                component: ComponentCreator('/docs/cs/ssh-server-hardening', 'cab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/jenkins-core-architecture',
                component: ComponentCreator('/docs/opensource/jenkins-core-architecture', '18b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/loki-overview',
                component: ComponentCreator('/docs/opensource/loki-overview', '312'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/mimir-architecture',
                component: ComponentCreator('/docs/opensource/mimir-architecture', '393'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/opentelemetry-lgtm-architecture',
                component: ComponentCreator('/docs/opensource/opentelemetry-lgtm-architecture', '115'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/oss-documentation-template',
                component: ComponentCreator('/docs/opensource/oss-documentation-template', 'b9f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/tempo-architecture',
                component: ComponentCreator('/docs/opensource/tempo-architecture', 'd2b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/tempo-overview',
                component: ComponentCreator('/docs/opensource/tempo-overview', '12f'),
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
