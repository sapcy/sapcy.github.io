---
format: md
title: "SSH 서버 하드닝 - 9가지 설정"
description: "루트 로그인 금지·키 인증·포트 변경·속도 제한·화이트리스트·암호 스위트·로깅·fail2ban·2FA까지, 운영 서버에 적용할 때의 주의점과 함께 정리합니다."
tags:
  - cs
  - security
---


---

### 들어가기 전에

- 설정은 **`/etc/ssh/sshd_config`**(또는 `sshd_config.d/*.conf`)에서 하고, 변경 후 **`sshd -t`** 로 문법 검사, **`systemctl restart sshd`** 전에 **별도 세션**을 열어 두는 습관이 안전합니다.
- 배포판·OpenSSH 버전에 따라 옵션 이름이 다를 수 있습니다(예: `ChallengeResponseAuthentication` 대신 **`KbdInteractiveAuthentication`**). 적용 전 `man sshd_config`를 확인하세요.

---

## 1. root 직접 로그인 끄기

자동화 공격의 상당수는 **`root` 계정**을 노립니다. SSH로 root를 직접 열어 두면, 한 계정만 뚫리면 전체 시스템 권한으로 이어지고, **감사 추적**도 어렵습니다.

**설정 예:**

```text
# /etc/ssh/sshd_config
PermitRootLogin no
```

일반 사용자 + `sudo`로 운영하고, 자동화 때문에 root가 꼭 필요하면 **`prohibit-password`**(키만 허용) 정도로 제한하는 선택지는 있으나, 가능하면 **비-root + sudo**가 낫습니다.

**주의:** `PermitRootLogin no` 적용 전에, 대상 사용자로 **키·sudo가 정상인지** 반드시 확인하세요. 새벽에 VPS에 자신을 잠그는 실수는 흔합니다.

---

## 2. 키 인증만 쓰고 패스워드 로그인 끄기

패스워드는 무차별·사전·재사용 자격 증명에 노출되기 쉽습니다. **공개키 인증**으로 넘어가면 “맞추기” 자체가 사실상 불가능에 가깝습니다.

**서버 설정 예:**

```text
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
KbdInteractiveAuthentication no
UsePAM yes
```

**클라이언트에서 키 생성(Ed25519 권장):**

```bash
ssh-keygen -t ed25519 -a 100 -C "your_email@example.com"
```

**서버에 공개키 등록:**

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

**다른 터미널에서 로그인 테스트:**

```bash
ssh -i ~/.ssh/id_ed25519 user@server
```

**`PasswordAuthentication no` 는 위가 완전히 성공한 뒤에** 적용하세요.

운영 관점에서는 업무용·개인용·CI용으로 **키를 분리**하고, CI 키는 **강제 명령(forced command)** 등으로 권한을 최소화하는 편이 좋습니다.

---

## 3. SSH 포트를 22가 아닌 값으로 옮기기

“난독화만으로는 보안이 아니다”는 말은 맞지만, **스캔 트래픽·잡음 로그인 시도**를 줄이는 데는 효과가 큽니다. 원문에서는 22번 포트 대비 **월 수만 건 → 십여 건 수준**으로 떨어졌다는 식의 체감이 나옵니다(환경마다 다름).

```text
Port 2849
```

**방화벽도 같이 맞춥니다(UFW 예시):**

```bash
sudo ufw allow 2849/tcp
sudo ufw delete allow 22/tcp
sudo ufw enable
```

포트 변경 직후에는 **기존 SSH 세션을 유지한 채** 새 포트로 접속이 되는지 확인하는 것이 안전합니다.

---

## 4. 인증 시도·세션 속도 제한

무차별 대입을 “시간을 들여야만 가능한 수준”으로 늦춥니다.

```text
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 30
MaxStartups 10:30:60
```

`MaxStartups` 형식은 “동시 미인증 연결 허용·거부 시작 비율·최대 거부”에 대한 OpenSSH의 튜닝 값입니다. 트래픽이 많은 배스천은 값을 조정해 볼 수 있습니다.

---

## 5. SSH를 쓸 그룹·사용자만 허용

```text
AllowGroups sshusers admins
```

```bash
sudo groupadd sshusers
sudo usermod -aG sshusers alice
```

역할별로 그룹을 나누고, 필요하면 **`DenyUsers`** 로 문제 계정만 차단하는 식으로 운영할 수 있습니다.

---

## 6. 쓰지 않는 기능은 기본으로 끄기

```text
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no
GatewayPorts no
IgnoreRhosts yes
HostbasedAuthentication no
```

특정 사용자만 터널이 필요하면 **`Match`** 블록으로 예외를 좁게 엽니다.

```text
Match User developer
    AllowTcpForwarding yes
    PermitOpen localhost:5432 localhost:3306
```

**기본은 잠그고, 예외만 허용**하는 패턴이 유지보수에 유리합니다.

---

## 7. 최신 암호 알고리즘 위주로 정리

오래된 OpenSSH 기본값에는 **취약하거나 비권장**인 알고리즘이 남아 있는 경우가 있습니다. 배포판 권장 템플릿을 따르되, 예시는 다음과 같이 **현대적 스위트**로 좁힐 수 있습니다.

```text
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512
PubkeyAcceptedAlgorithms ssh-ed25519,rsa-sha2-512
```

호스트 키를 **ed25519**로 다시 만들 경우, 클라이언트는 **한 번** 호스트 키 변경 경고를 볼 수 있습니다(정상적인 절차).

```bash
sudo rm /etc/ssh/ssh_host_dsa_key*
sudo ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
```

---

## 8. 로그를 진짜 보안 장비처럼 쓰기

```text
LogLevel VERBOSE
```

- Debian/Ubuntu 계열: `/var/log/auth.log`
- RHEL 계열: `/var/log/secure`

**fail2ban**으로 반복 실패 IP를 자동 차단하는 구성은 사실상 표에 가깝습니다. SSH 포트를 옮겼다면 **jail 설정의 포트**도 같이 맞춥니다.

```text
[sshd]
enabled = true
port = 2849
maxretry = 3
bantime = 3600
```

---

## 9. 공개키 + 2단계(OTP)까지 요구하기

인터넷에 직접 노출된 프로덕션·배스천에는 **키 + TOTP** 조합이 강합니다.

**sshd 예시(관리자 그룹만):**

```text
Match Group admins
    AuthenticationMethods publickey,keyboard-interactive
```

PAM 쪽에서 `libpam-google-authenticator` 등을 붙이는 방식이 흔합니다. **서비스 계정·자동화 계정**은 2FA를 걸지 않도록 **Match**로 분리하는 것이 중요합니다.

---

### 한 번에 적용해 보고 싶을 때의 최소 예시

아래는 “골격”일 뿐이며, 환경에 맞게 조정해야 합니다.

```text
Port 2849
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
AllowGroups sshusers admins
MaxAuthTries 3
LogLevel VERBOSE
X11Forwarding no
AllowTcpForwarding no
```

---

### 마무리

SSH 하드닝의 목표는 **완벽한 밀폐**가 아니라, 공격자 입장에서 **비용 대비 이득이 나지 않게 만드는 것**에 가깝습니다. 오늘 한 가지, 내일 한 가지씩이라도 적용해 두면 설정이 겹겹이 쌓이면서 위험 표면이 줄어듭니다.

---

### 참고·출처

- [9 SSH Hardening Tricks That Stopped 50,000 Attack Attempts on My Server](https://medium.com/stackademic/9-ssh-hardening-tricks-that-stopped-50-000-attack-attempts-on-my-server-6499b7b756bf)