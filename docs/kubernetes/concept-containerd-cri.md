---
title: Containerd와 CRI - 컨테이너 생성 과정
description: CRI 플러그인 아키텍처, kubelet·CRI·containerd 흐름, containerd shim Create 코드
tags:
  - cloud
  - kubernetes
---

# Containerd와 CRI - 컨테이너 생성 과정

## CRI Plugin 아키텍처

[![architecture](https://github.com/containerd/containerd/raw/main/docs/cri/architecture.png)](https://github.com/containerd/containerd/blob/main/docs/cri/architecture.png)

<https://github.com/containerd/containerd/blob/main/docs/cri/architecture.md>

- CRI Plugin은 containerd를 사용하여 전체 컨테이너 라이프사이클과 모든 컨테이너 이미지를 관리한다.

### kubelet이 Pod를 생성하는 경우 어떻게 동작할까?

1. Kubelet이 CRI 런타임 서비스 API를 통해 cri 플러그인을 호출하여 Pod A를 생성
2. cri는 Pod A의 네트워크 네임스페이스를 생성한 후 CNI를 사용하여 구성
3. cri는 containerd를 내부적으로 사용하여 pause 컨테이너(sandbox 컨테이너)를 생성 및 시작하며, pause 컨테이너를 Pod A의 cgroup 및 namespace안에 넣음.
4. Kubelet은 애플리케이션 컨테이너 이미지를 pull 하기 위해 image service API를 통해 cri plugin을 호출함.
5. 만약 이미지가 해당 노드에 없으면 containerd를 통해 이미지를 pull 함.
6. Kubelet은 이전 과정에서 pull 된 이미지 기반 애플리케이션 컨테이너를 생성 및 시작하기 위해 runtime service API를 통해 cri plugin을 호출함.
7. cri는 마지막으로 containerd를 내부적으로 사용하여 애플리케이션 컨테이너 A를 생성하고, 이를 해당 Pod의 cgroup 및 namespace 안에 넣은 다음, Pod A의 새 애플리케이션 컨테이너 A를 시작함.
8. Pod A와 이에 해당되는 애플리케이션 컨테이너 A가 생성되고 실행됨.

## containerd-shim code 분석

`containerd/core/runtime/v2/shim.go:560`

```go
func (s *shimTask) Create(ctx context.Context, opts runtime.CreateOpts) (runtime.Task, error) {
	topts := opts.TaskOptions
	if topts == nil || topts.GetValue() == nil {
		topts = opts.RuntimeOptions
	}
	request := &task.CreateTaskRequest{
		ID:         s.ID(),
		Bundle:     s.Bundle(),
		Stdin:      opts.IO.Stdin,
		Stdout:     opts.IO.Stdout,
		Stderr:     opts.IO.Stderr,
		Terminal:   opts.IO.Terminal,
		Checkpoint: opts.Checkpoint,
		Options:    typeurl.MarshalProto(topts),
	}
	for _, m := range opts.Rootfs {
		request.Rootfs = append(request.Rootfs, &types.Mount{
			Type:    m.Type,
			Source:  m.Source,
			Target:  m.Target,
			Options: m.Options,
		})
	}

	_, err := s.task.Create(ctx, request)
	if err != nil {
		return nil, errgrpc.ToNative(err)
	}

	return s, nil
}
```
