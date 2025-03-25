import { IIntroduce } from '../component/introduce/IIntroduce';
import { lastestUpdatedAt } from '../package.json';

const introduce: IIntroduce.Payload = {
  disable: false,

  contents: [
    '저는 개발과 인프라에 대한 이해를 갖춘 DevOps 엔지니어로서 복잡한 시스템을 최적화하고 자동화하여 원활한 배포와 운영 효율성을 보장합니다.' +
    'OpenStack 기반 Private Cloud 환경에서 가상머신에 Kubernetes 클러스터를 구축한 경험이 있으며, ' +
    '프로덕션 웹 서비스를 개발한 경험이 있습니다. ' +
    '효율적이고 안정성이 높은 아키텍처를 위해 언제나 고민하고 있습니다.',

    '그리고 개인 프로젝트나 개발 커뮤니티 활동 등을 통해 다양한 개발 경험을 즐기고 있습니다. ',

    '저는 개발과 비즈니스 간 커뮤니케이션이 가장 중요하다고 생각하고 있어 능동적이고 적극적인 커뮤니케이션으로 문제 해결을 하고 있습니다. ' +
    '이러한 점을 바탕으로 더 좋은 엔지니어로서 성장하기 위해 치열하게 학습하고, 경험하고, 노력하고 있습니다.',
  ],
  sign: 'Sapcy',
  // sign: packageJson.author.name,
  // latestUpdated: '2024-09-02',
  latestUpdated: lastestUpdatedAt,
};

export default introduce;
