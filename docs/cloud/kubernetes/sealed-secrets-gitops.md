---
format: md
title: "Sealed Secrets - GitOps로 Secret 안전하게 관리하기"
description: "kubeseal·클러스터 컨트롤러·Git 저장소·RSA 암복호화 흐름 - Bitnami Sealed Secrets"
tags:
  - cloud
  - kubernetes
---

민감한 값은 Git에 평문 `Secret`으로 올리지 않고, **클러스터 공개키로 암호화한 SealedSecret**만 올린 뒤, 클러스터 안 **sealed-secrets 컨트롤러**가 개인키로 복호화해 일반 `Secret`을 만들어 주는 패턴입니다. ([Bitnami Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets))

---

### 흐름 (개요)

```mermaid
flowchart TD
    A[개발자 로컬] -->|kubectl create secret| B[Secret YAML]
    B -->|kubeseal CLI| C[공개키로 암호화]
    C --> D[SealedSecret.yaml]
    D -->|Git Push| E[Git Repository]
    E -->|GitOps / kubectl apply| F[Kubernetes Cluster]

    subgraph Cluster
        F --> G[sealed-secrets-controller]
        G -->|Private Key 복호화| H[Secret 생성]
        H --> I[애플리케이션 Pod]
    end
```

---

### 시퀀스 (암호화·마운트)

```mermaid
sequenceDiagram
    participant Dev as kubeseal (Public Key)
    participant Git as Git Repository
    participant K8s as SealedSecrets Controller
    participant App as Application Pod

    Dev->>Git: SealedSecret.yaml Push
    Git->>K8s: apply
    K8s->>K8s: PrivateKey로 Decrypt
    K8s->>K8s: Secret 객체 생성
    K8s->>App: Secret Mount / Env
```

---

### 참고

- [sealed-secrets (GitHub)](https://github.com/bitnami-labs/sealed-secrets)
- 클러스터마다 **SealedSecret은 해당 클러스터에서만** 복호화되도록 키가 묶이므로, 환경(dev/stage/prod)별로 별도 seal이 필요합니다.
