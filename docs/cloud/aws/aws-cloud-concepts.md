---
format: md
title: "개념 정리"
description: "1. AWS란? AWS(Amazon Web Services)는 컴퓨팅 성능, 스토리지, 데이터베이스, 분석 및 머신러닝을 포함한 광범위한 서비스를 제공하는 클라우드 컴퓨팅 플랫폼입니다. 클라우드 컴퓨팅이란? 클라우드 컴퓨팅은 인터넷을 통해 서버, 스토리지, 데이터베이스, 네트워킹, 소프트웨어, 분석, 인텔리전스 등의 컴퓨팅 서비스를 활용하는 기술입니다. 이"
tags:
  - cloud
  - aws

---

### 1\. AWS란?

**AWS(Amazon Web Services)는 컴퓨팅 성능, 스토리지, 데이터베이스, 분석 및 머신러닝을 포함한 광범위한 서비스를 제공하는 클라우드 컴퓨팅 플랫폼입니다.**

> **클라우드 컴퓨팅이란?**  
> 클라우드 컴퓨팅은 인터넷을 통해 서버, 스토리지, 데이터베이스, 네트워킹, 소프트웨어, 분석, 인텔리전스 등의 컴퓨팅 서비스를 활용하는 기술입니다. 이를 통해 서버를 굳이 사지 않아도 성능이 좋은 컴퓨터를 사용할 수 있고, 일반적으로 사용한 클라우드 서비스에 대해서만 요금을 지불하므로 운영 비용을 낮추고 인프라를 보다 효율적으로 운영할 수 있습니다. 

![](https://blog.kakaocdn.net/dna/dsVikf/btr4w5v69Y0/AAAAAAAAAAAAAAAAAAAAACAxAdUf_xJ8vECuHF-c2_ezi1r4cBh7ZIsgILBWbQv7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=jFkr%2BhlTO4zNujIQP8wOvIpvi6I%3D)

전 세계 IaaS 시장 점유율 (https://www.wpoven.com/blog/aws-market-share/)

AWS는 2022년 기준 전세계 클라우드 시장에서 가장 높은 점유율인 34%를 차지하고 있습니다. 

### 2\. EC2

![](https://blog.kakaocdn.net/dna/B9ZJt/btr4tLFQyZZ/AAAAAAAAAAAAAAAAAAAAACb8RRn_NAb82kqCtLGG9GIdfPsP6OEG9n-cNJV_JMyC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=Ga4Hjhh5z1KaXtqsAn3uscUPCMI%3D)

**EC2는 클라우드 서버 인스턴스(가상머신)이며, AWS의 대표적인 IaaS 서비스입니다.**

AWS EC2는 Elastic Compute Cloud의 약자입니다. AWS에서는 서비스의 명칭을 정할 때, 풀네임에서 같은 알파벳으로 시작되는 단어를 묶어 숫자로 표현합니다. (다른 예. S3: Simple Strorage Service)

Elastic의 의미는 "**_크기 조정이 가능하다_**"입니다. 이는 컴퓨팅 서비스를 사용자가 원하는대로 크기를 선택하여 사용할 수 있음을 의미합니다.

### 3\. Region

**AWS가 전세계에서 데이터 센터를 클러스터링하는 물리적 위치를 리전이라 합니다.**

**그리고 데이터 센터들의 각 논리적 그룹을 가용 영역이라고 합니다.**

각 리전은 지리적 영역내에서 격리되며 최소 3개의 가용영역으로 구성됩니다.

> **가용 영역(Availability Zone)**  
> AZ(가용 영역)는 하나 이상의 개별 데이터 센터로 구성됩니다. AZ를 사용함으로써 높은 가용성, 내결함성 및 확장성을 갖춘 프로덕션 애플리케이션 및 데이터베이스를 운영할 수 있습니다.  
> AZ간의 모든 트래픽은 암호화되며, 서로 100km(60마일) 이내의 거리에 위치합니다.

### 4\. VPC

**VPC (Virtual Private Cloud)는 논리적으로 할당된 가상의 네트워크 공간입니다.**

VPC는 다음과 같은 특성을 가집니다.

*   논리적으로 격리된 사용자 전용 가상 네트워크
*   복수의 AZ에 걸친 상태로 생성이 가능
*   물리적으로는 각자 다른 위치지만 논리적으로는 같은 네트워크

아래의 그림은 VPC가 없을 때의 네트워크 구성입니다.

![](https://blog.kakaocdn.net/dna/J9nWW/btr4xKeI3lW/AAAAAAAAAAAAAAAAAAAAALE45sCsrD8cHTK1lzzbksrnQ4ARLs2qSU1wYiUCsfOg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=BBxGd0kFm8aQ7qMh4QRhssLtekA%3D)

VPC가 없는 구성

VPC가 없다면 EC2 인스턴스들의 네트워크 구성이 상당히 복잡해질 수 있고, 네트워크 추가와 삭제시 각 인스턴스 간의 의존성 때문에 작업이 어려워질 수 있습니다.

다음의 그림은 VPC가 있을 때의 네트워크 구성입니다.

![](https://blog.kakaocdn.net/dna/9ISgC/btr4G8lCZea/AAAAAAAAAAAAAAAAAAAAAADNcRfpKlKjn8fYDiyFDNEhWgt7DXC5fvPTjr-1ufcp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=LCl3noDEMRYoufntlsL6eBDBCCg%3D)

VPC가 있으면 사용자의 EC2 인스턴스를 논리적인 네트워크 그룹으로 묶어 독립된 공간으로 만들 수 있습니다.

#### 4-1. Subnet

서브넷은 VPC의 IP 주소 범위입니다. 

VPC는 단일 AZ에 위치하며 public, private 중 하나로 설정이 가능합니다. private으로 설정할 경우 NAT 게이트웨이나 라우터 없이는 외부에서 접속하거나 외부로 요청이 나갈 수 없습니다.

서브넷에는 CIDR 블록 형태로 IP가 할당됩니다.

#### 4-2. ACL

ACL은 서브넷의 설정을 위한 방화벽입니다.

#### 4-3. 보안그룹

연결된 리소스의 아웃바운드, 인바운드 규칙을 설정하여 트래픽을 제어합니다.

예를 들어 보안 그룹을 EC2 인스턴스와 연결하면 인스턴스에 대한 아웃바운드, 인바운드 트래픽을 제어할 수 있습니다.

VPC에서 보안 그룹을 생성하면 해당 VPC 리소스에만 연결할 수 있습니다.

### Reference.

[https://aws.amazon.com/ko/about-aws/global-infrastructure/regions\_az/](https://aws.amazon.com/ko/about-aws/global-infrastructure/regions_az/)

[https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098](https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098)
