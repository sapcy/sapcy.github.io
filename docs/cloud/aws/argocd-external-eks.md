---
format: md
title: "ArgoCD에서 External EKS 클러스터 연동 방법"
description: "더보기1. EKS 클러스터가 존재하여야 함.2. EKS에서 ClusterRole, Role 등의 권한을 생성, 부여할 Cluster-admin 계정이 존재해야 함. 1. 개요Argo CD는 여러 Kubernetes 클러스터를 GitOps 방식으로 관리할 수 있다.하지만 Amazon EKS는 일반적인 kubeconfig 인증 방식과 다르게 다음과 같은 특징을"
tags:
  - cloud
  - aws
  - kubernetes
  - argocd
  - eks

---

더보기

**< 사전 준비사항 >**  
1. EKS 클러스터가 존재하여야 함.

2. EKS에서 ClusterRole, Role 등의 권한을 생성, 부여할 Cluster-admin 계정이 존재해야 함.

## **1\. 개요**

Argo CD는 여러 Kubernetes 클러스터를 GitOps 방식으로 관리할 수 있다.

하지만 **Amazon EKS** 는 일반적인 kubeconfig 인증 방식과 다르게 다음과 같은 특징을 가진다.

*   인증은 **AWS IAM / STS 기반**
*   Kubernetes API 접근 토큰은 **짧은 TTL(약 15분)**
*   token + endpoint를 고정값으로 저장하는 방식은 **운영에 부적합**

특히 이번 구성처럼 Argo CD는 **사설 Kubernetes** 에 설치되어 있고 배포 대상은 **다른 AWS Account의 EKS** 인 경우, **IRSA를 사용할 수 없기 때문에** Argo CD 공식 문서에서 권장하는 **exec 기반 인증 방식** 이 가장 적합하다.

* * *

## **2\. Declarative Cluster Registration 개념**

Argo CD는 클러스터를 다음 방식으로 등록할 수 있다.

*   CLI (argocd cluster add)
*   UI
*   **Kubernetes Secret (Declarative)**

운영/자동화 관점에서 가장 권장되는 방식은

👉 **Secret을 GitOps로 관리하는 Declarative 방식**

### **Argo CD가 클러스터로 인식하는 조건**

*   argocd.argoproj.io/secret-type: cluster 라벨이 붙은 Secret
*   ArgoCD 서버가 이를 감지해 **관리 대상 클러스터 목록에 자동 등록**

* * *

## **3\. EKS에서 STS 기반 인증이 필요한 이유**

### **EKS 인증 흐름 요약**

1.  IAM Credential(AccessKey 또는 Role)
2.  STS AssumeRole
3.  aws eks get-token 형식의 **임시 Bearer Token 발급**
4.  Kubernetes API 호출

👉 이 토큰은 **짧은 TTL** 을 가지므로

**Argo CD는 매 API 호출 시점마다 토큰을 동적으로 생성** 해야 한다.

이를 위해 Argo CD는 execProviderConfig를 제공한다.

* * *

## **4\. Cross-account EKS 접근 구조**

이번 시나리오는 다음과 같은 구조다.

*   Argo CD: 사설 Kubernetes (AWS 외부)
*   EKS: 별도 AWS Account
*   인증 방식: **IAM User 또는 Role → AssumeRole**

더보기

\[Argo CD AWS Credentials\]

        ↓ sts:AssumeRole

\[EKS Account IAM Role\]

        ↓

\[EKS Kubernetes API\]

* * *

## **5\. 실습**

### 5.1. 사용자

#### 5.1.1. eks-access 이름의 사용자를 생성 및 Credential 발급

```bash
aws iam create-user --user-name eks-access
aws iam create-access-key --user-name eks-access
```

#### 5.1.2. Policy 생성 및 부여

`eks-access-min.json` 예시:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EKSDescribe",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster"
      ],
      "Resource": "arn:aws:eks:${AWS_REGION}:${ACCOUNT_ID}:cluster/${CLUSTER_NAME}"
    }
  ]
}
```

```bash
aws iam put-user-policy \
  --user-name eks-access \
  --policy-name eks-access-min \
  --policy-document file://eks-access-min.json
```

#### 5.1.3. EKS Access Entry 생성 및 확인

```bash
aws eks create-access-entry \
  --cluster-name ${CLUSTER_NAME} \
  --region ${AWS_REGION} \
  --principal-arn arn:aws:iam::${ACCOUNT_ID}:user/eks-access \
  --type STANDARD
```

```bash
aws eks describe-access-entry \
  --cluster-name ${CLUSTER_NAME} \
  --region ${AWS_REGION} \
  --principal-arn arn:aws:iam::${ACCOUNT_ID}:user/eks-access
```

### 5.2. EKS 클러스터 권한 생성 및 그룹 매핑

#### 5.2.1. Discovery(Read-only)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: argocd-discovery-read
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["get","list","watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: argocd-discovery-read-binding
subjects:
- kind: Group
  name: argocd:discovery-read
roleRef:
  kind: ClusterRole
  name: argocd-discovery-read
  apiGroup: rbac.authorization.k8s.io
```

**EKS Cluster-admin 권한 계정으로 생성**

#### 5.2.2. Namespace Deploy 권한

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: argocd-deployer
  namespace: ${NAMESPACE}
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: argocd-deployer-binding
  namespace: ${NAMESPACE}
subjects:
- kind: Group
  name: argocd:deployer
roleRef:
  kind: Role
  name: argocd-deployer
  apiGroup: rbac.authorization.k8s.io
```

**EKS Cluster-admin 권한 계정으로 생성**

### 5.3. ArgoCD

#### 5.3.1. AssumeRole

`trust-argocd.json` 예시:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::${ACCOUNT_ID}:user/eks-access" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Role 생성

```bash
aws iam create-role \
  --role-name ArgocdEKSRole \
  --assume-role-policy-document file://trust-argocd.json
```

#### 5.3.2. ArgocdEKSRole을 Access Entry에 추가

```bash
aws eks create-access-entry \
  --cluster-name ${CLUSTER_NAME} \
  --region ${AWS_REGION} \
  --principal-arn arn:aws:iam::${ACCOUNT_ID}:role/ArgocdEKSRole \
  --type STANDARD \
  --kubernetes-groups '["argocd:discovery-read","argocd:deployer"]'
```

#### 5.3.3. ArgoCD 클러스터 등록 및 sts 연동용 secret 생성

**\*ArgoCD가 설치된 클러스터에 Secret 생성**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cluster-test-eks
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: cluster
type: Opaque
stringData:
  name: test-eks
  server: https://<EKS_ENDPOINT>
  config: |
    {
      "execProviderConfig": {
        "command": "argocd-k8s-auth",
        "args": [
          "aws",
          "--cluster-name", "${CLUSTER_NAME}",
          "--role-arn", "arn:aws:iam::${ACCOUNT_ID}:role/ArgocdEKSRole"
        ],
        "apiVersion": "client.authentication.k8s.io/v1beta1",
        "env": {
          "AWS_REGION": "${AWS_REGION}",
          "AWS_ACCESS_KEY_ID": "<BASE_CRED_ACCESS_KEY>",
          "AWS_SECRET_ACCESS_KEY": "<BASE_CRED_SECRET_KEY>"
        }
      },
      "tlsClientConfig": {
        "insecure": false,
        "caData": "<BASE64_CA_DATA>"
      }
    }
```

![](https://blog.kakaocdn.net/dna/cDC5wZ/dJMcagKROXj/AAAAAAAAAAAAAAAAAAAAAIl5y3yVYq2A5U4GaqZstNG_FQN9qW1VDJcEH3wJohtl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=eCgj5kUG4ZR3MUq%2B6w4OnPn0mwY%3D)

Settings > Cluster 클러스터 등록 성공

### 5.4. ArgoCD 애플리케이션 배포

```yaml
apiVersion: v1
items:
- apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: nginx
    namespace: default
  spec:
    destination:
      namespace: ${NAMESPACE}
      server: https://${EKS_ENDPOINT}
    project: default
    source:
      directory:
        jsonnet: {}
        recurse: true
      path: .
      repoURL: http://${GIT_REPO_URL}
      targetRevision: main
    syncPolicy:
      automated:
        enabled: true
kind: List
metadata:
  resourceVersion: ""
```
