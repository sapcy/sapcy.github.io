import { IIntroduce } from '../component/introduce/IIntroduce';
import { lastestUpdatedAt } from '../package.json';

const introduce: IIntroduce.Payload = {
  disable: false,

  contents: [
    'DevOps 엔지니어와 웹 서비스 백엔드 개발자로서의 경험이 있습니다.' +
      'Java, Spring, MariaDB, Redis, Vue.js 등을 사용하여 프로덕션 서비스를 설계, 개발하였고, ' +
      'OpenStack 기반 Private Cloud 환경에서 가상머신에 Kubernetes 클러스터를 구축 및 유지보수한 경험이 있습니다. ' +
      '효율적이고 안정성이 높은 아키텍처를 위해 언제나 고민하고 있습니다.',

    '오픈소스 프로젝트에 관심이 많고, 다양한 방법으로 기여를 하려고 노력하고 있습니다. ' +
      '이외에도 개인 프로젝트나 개발 커뮤니티 활동 등을 통해 다양한 개발 경험을 즐기고 있습니다. ',

    '서비스 개발이란 결국 개발과 비즈니스와의 커뮤니케이션이 가장 중요하다고 생각하고 있습니다. ' +
      '능동적이고 적극적인 커뮤니케이션으로 문제 해결과 비즈니스 발전을 위해 뛰어듭니다. ' +
      '이러한 점을 바탕으로 더 좋은 개발자로서 성장하기 위해 더 치열하게 학습하고, 경험하고, 노력하고 있습니다.',
  ],
  sign: 'Sapcy',
  // sign: packageJson.author.name,
  // latestUpdated: '2024-09-02',
  latestUpdated: lastestUpdatedAt,
};

export default introduce;
