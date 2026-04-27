---
format: md
title: "Apple Silicon에서 OrbStack으로 x86 K3s 클러스터 올리기"
description: "OrbStack으로 amd64 Ubuntu VM을 만든 뒤 Docker·K3s를 설치하고, 에이전트 조인·외부 kubeconfig 접근까지 정리한 실습 노트입니다."
tags:
  - cloud
  - kubernetes
---

M1/M2/M3 맥에서 **x86(amd64) 환경**이 필요할 때 OrbStack으로 가벼운 리눅스 VM을 띄운 뒤, 그 안에 **K3s**를 올리는 흐름을 정리했습니다. 원문 아이디어는 Medium 글·OrbStack·k3s 설치 경험을 참고했습니다.

---

### 1. 가상 머신 준비 (OrbStack)

먼저 [OrbStack](https://orbstack.dev/)을 설치합니다.

```bash
brew install orbstack
```

CLI로 **amd64 Ubuntu 22.04** 이미지를 만듭니다.

```bash
orb create -a amd64 ubuntu:jammy ubuntu
```

GUI에서 같은 작업을 해도 됩니다. VM에 SSH로 들어가려면:

```bash
ssh ubuntu@orb
```

호스트 이름은 `orb create`에서 지정한 이름(예: `ubuntu`)에 맞춥니다.

---

### 2. Docker 설치

VM 안에서 Docker 공식 문서의 [Ubuntu 저장소 설치](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) 절차를 따르거나, 아래처럼 진행할 수 있습니다. 먼저 `gpg`가 필요합니다.

```bash
sudo apt update
sudo apt install -y gpg

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker "$USER"
newgrp docker
```

동작 확인:

```bash
docker run --rm hello-world
```

이미지가 **amd64**로 받아지는지 확인하면, 이후 K3s도 같은 아키텍처 맞춤으로 쓸 수 있습니다.

---

### 3. K3s 설치 (경량 옵션)

컨테이너 런타임이 준비되었으면 K3s를 설치합니다. 예시는 **Traefik·local-storage·metrics-server·ServiceLB**를 끄고, **Docker를 런타임으로 쓰는** 형태입니다(`--docker`).

```bash
curl -sfL https://get.k3s.io | sh -s - \
  --disable traefik \
  --disable local-storage \
  --disable servicelb \
  --write-kubeconfig-mode 644 \
  --write-kubeconfig ~/.kube/config \
  --docker
```

:::tip K3s 런타임 참고

K3s 최신 버전에서는 **containerd** 사용이 기본이며, `--docker`는 점진적으로 제거·비권장되는 방향입니다. 재현이 필요하면 문서 작성 시점의 K3s 릴리스 노트를 확인하세요.

:::

같은 취지의 스크립트로 [addozhang의 setupk3s.sh (gist)](https://gist.github.com/addozhang/92905325746b7858e3d06117d6b9d0b8#file-setupk3s-sh)를 쓸 수도 있습니다.

```bash
./setupk3s.sh --docker --mini
```

`--mini`는 선택 구성요소를 최대한 끄는 옵션으로 이해하면 됩니다.

클러스터 확인:

```bash
kubectl version
kubectl get po -A
kubectl get no -o wide
```

노드 정보에서 **컨테이너 런타임으로 Docker**가 잡히는지 볼 수 있습니다.

더 이상 VM이 필요 없으면 호스트에서:

```bash
orb delete ubuntu
```

(VM 이름은 생성 시 지정한 이름으로 바꿉니다.)

---

### 4. 에이전트 노드 조인

**서버(마스터) 노드**에서 토큰을 만듭니다.

```bash
k3s token create
```

**에이전트** 쪽에서 `K3S_URL`과 `K3S_TOKEN`을 넣어 설치합니다. IP와 토큰은 환경에 맞게 교체합니다.

```bash
curl -sfL https://get.k3s.io | \
  K3S_URL=https://198.19.249.104:6443 \
  K3S_TOKEN='K1058e5facdbcded9de1134ce06508ac0fec91e5ad889ce41a0fbd514c231bd2cd3::eokiox.uyeogpban8zjia16' \
  sh -
```

(위 IP·토큰은 예시이므로 실제 값으로 바꿉니다.)

---

### 5. 클러스터 API를 밖에서 쓰기 (advertise-address / TLS SAN)

예를 들어 제어 플레인이 **공인 IP `13.209.245.101`**로 보이게 하고 싶다면, 서버 노드에서 **`/etc/systemd/system/k3s.service`**의 `ExecStart`에 **광고 주소**와 **TLS SAN**을 넣습니다.

```bash
# /etc/systemd/system/k3s.service (예시)

ExecStart=/usr/local/bin/k3s \
    server \
    --advertise-address=13.209.245.101 \
    --tls-san=13.209.245.101 \
    ...
```

적용:

```bash
sudo k3s kubectl -n kube-system delete secret/k3s-serving
sudo mv /var/lib/rancher/k3s/server/tls/dynamic-cert.json /tmp/dynamic-cert.json

sudo systemctl daemon-reload
sudo systemctl restart k3s
```

갱신된 kubeconfig는 보통 **`/etc/rancher/k3s/k3s.yaml`**에 있습니다. 이 내용을 로컬로 복사해 `server`를 공인 IP로 맞추면, **노드 밖에서 API 서버**에 접속할 수 있습니다.

```yaml
# 예시 kubeconfig (일부)
apiVersion: v1
clusters:
  - cluster:
      certificate-authority-data: <BASE64>
      server: https://13.209.245.101:6443
    name: default
contexts:
  - context:
      cluster: default
      user: default
    name: default
current-context: default
kind: Config
users:
  - name: default
    user:
      client-certificate-data: <BASE64>
      client-key-data: <BASE64>
```

방화벽·보안 그룹에서 **6443** 접근이 열려 있어야 하고, 실제 운영에서는 IP·인증서 전략을 환경에 맞게 조정해야 합니다. 비슷한 흐름은 [외부에서 k3s API 접근](https://jaehong21.com/ko/posts/k3s/02-access-outside/) 같은 글과 함께 보면 이해에 도움이 됩니다.

---

### 참고

- [Set up an x86 K3s cluster on Apple Silicon with OrbStack (Medium / addozhang)](https://addozhang.medium.com/set-up-an-x86-k3s-cluster-on-apple-silicon-with-orbstack-9ea4e6f84461)
- [Install K3s with Cilium (single-node, Debian) - armand.nz](https://www.armand.nz/notes/k3s/Install%20K3s%20with%20Cilium%20single-node%20cluster%20on%20Debian)
- [k3s - 외부 접근 정리 (jaehong21.com)](https://jaehong21.com/ko/posts/k3s/02-access-outside/)

---

*OrbStack·K3s·Docker 버전에 따라 명령 옵션 이름이 바뀔 수 있으니, 설치 전 공식 문서를 한 번 더 확인하는 것을 권장합니다.*
