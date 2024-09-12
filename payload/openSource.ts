import { IOpenSource } from '../component/openSource/IOpenSource';

const openSource: IOpenSource.Payload = {
  disable: false,
  list: [
    {
      title: 'Bitnami containers',
      descriptions: [
        {
          content: 'Bitnami의 argocd 도커 이미지 내 git 버전 차이로 인한 이슈 제기 후 해결',
        },
        {
          content:
            '원인: bitnami/argo-cd:2.6.7-debian-11-r8 컨테이너 베이스 이미지(debian-11-r8)에 설치된 git은 2.30.2 버전이었으나, ' +
            "ArgoCD repository 설정에서 \"Force basic auth\" 옵션은 repo-server 소스 코드에서 사용하는 git 명령어의 '--config-env'이며 git 2.31.0 버전부터 옵션을 제공하므로 에러 발생",
        },
        {
          content:
            '결과: ArgoCD의 \"Force basic auth\" 옵션 없이 기능 구현하여 문제는 해결되었으며. Base 이미지의 git 버전 이슈는 추후 debian 이미지 업데이트를 통해 해결되었음을 확인.',
        },
        {
          content: 'https://github.com/bitnami/containers/issues/34541',
          href: 'https://github.com/bitnami/containers/issues/34541',
        },
      ],
    },
  ],
};

export default openSource;
