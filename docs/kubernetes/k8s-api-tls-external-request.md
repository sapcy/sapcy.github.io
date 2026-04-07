---
format: md
title: "외부 서버에서 k8s 클러스터로 API 요청시 인증서 문제 해결"
description: "클러스터 API 요청시 인증서 문제 해결 경험을 공유합니다. 문제 발생 클러스터 접근용 외부 서버에서 kube-config를 세팅해두고 context를 변경하여 2개의 k8s 클러스터 중 원하는 클러스터의 API 서버로 요청할 수 있게 설정하였습니다. kube-config 파일은 아래의 형태와 같습니다. apiVersion: v1 clusters: - cl"
tags:
  - cloud
  - kubernetes

---

클러스터 API 요청시 인증서 문제 해결 경험을 공유합니다.

### 문제 발생

클러스터 접근용 외부 서버에서 kube-config를 세팅해두고 context를 변경하여 2개의 k8s 클러스터 중 원하는 클러스터의 API 서버로 요청할 수 있게 설정하였습니다. 

kube-config 파일은 아래의 형태와 같습니다.

```yaml
apiVersion: v1
clusters:
  - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0
        server: https://10.10.100.100:26443
        ...
  - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0
        server: https://10.10.200.200:26443
        ...
```

**클러스터 구성**

*   1번 클러스터:  
    \- 10.10.100.100: LB vIP  
    \- master가 단일 구성
*   2번 클러스터:  
    \- 10.10.200.200: LB vIP  
    \- master가 3중화 구성

**외부 서버에서 CLI 테스트 결과**

1번 클러스터는 정상적으로 get, set image deployment, rollout restart 등 kubectl로 명령어가 잘 실행되었습니다.

2번 클러스터는 테스트 3번중 1번은 성공하고 2번은 에러가 발생하였습니다.

> Error saying “Unable to connect to the server: x509: certificate signed by unknown authority”

위 에러문구에 따르면 인증서를 서명한 CA를 k8s api 서버에서 알 수 없어 신뢰하지 못하기 때문에 발생한 것으로 보입니다.

### 해결

원인은 제가 세팅한 **certificate-authority-data** 값에 있었습니다.

일반적으로 넣는 k8s root CA인 /etc/kubernetes/pki/ca.crt이 아니라 kube-apiserver-1번이 떠있는 마스터 1번 서버의 /etc/kubernetes/pki/apiserver.crt  의 값이었습니다.

apiserver.crt를 넣은 판단은 ca.crt파일의 CN이 kubernetes이므로 ca.crt 값을 넣는다면 API서버 요청 때 도메인을 https://kubernetes:26443 의 형태로 호출해야하는데, 이렇게 되면 클러스터 2개 모두 도메인을 kubernetes를 넣어줘야하므로 /etc/hosts 파일의 내용을 계속 변경해야한다고 생각했습니다.

결국 에러는 로드밸런스로 간 요청이 kube-apiserver-1번이 아닌 2, 3번으로 들어갈 때마다 발생한 것이었습니다.

그리고 새롭게 알게된 것이 **apiserver.crt 내용은 k8s-master 서버마다 다르다** 는 것이었습니다. apiserver.crt으로 세팅 판단의 근거 중 하나가 apiserver.crt 내용이 마스터 3개 모두 동일하다는 전제였는데, 에러 발생 후 비교해보니 달랐습니다.

그래서 kube config 파일의 certificate-authority-data 값을 다음과 같이 수정하였습니다.

```yaml
apiVersion: v1
clusters:
  - cluster:
        insecure-skip-tls-verify: true
        server: https://10.10.100.100:26443
        ...
  - cluster:
        insecure-skip-tls-verify: true
        server: https://10.10.200.200:26443
        ...
```

```bash
insecure-skip-tls-verify: true
```

위와 같이 insecure-skip-tls-verify: true 옵션을 통해 CN에 등록되지 않은 도메인 이름으로도 API 요청이 되도록 해결하였습니다.
