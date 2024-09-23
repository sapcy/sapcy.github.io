import { IExperience } from '../component/experience/IExperience';

const experience: IExperience.Payload = {
  disable: false,
  disableTotalPeriod: false,
  list: [
    {
      title: '오케스트로(주)',
      position: 'DevOps Engineer',
      startedAt: '2019-10',
      descriptions: [
          '클라우드 전환 및 설계 컨설팅부터 구축, 운영을 위한 다양한 솔루션을 자체 개발해 제공하는 기업',
          'https://www.okestro.com/'
      ],
      skillKeywords: [
        'Kubernetes',
        'Java',
        'Spring',
        'MariaDB',
        'Jenkins',
        'Automation',
        'OpenStack',
      ],
    },
  ],
};

export default experience;
