import { IPresentation } from '../component/presentation/IPresentation';

const presentation: IPresentation.Payload = {
  disable: false,

  list: [
    {
      title: 'Kafka 분석',
      subTitle: 'kafka의 구성 및 동작 원리를 사내 그룹 스터디를 통해 분석하였음.',
      at: '2023-09',
      descriptions: [
        {
          content: 'Slideshare:',
          postHref: 'https://www.slideshare.net/Sapcy/kafka-261412533',
        },
      ],
    },
    {
      title: '사내 인터뷰',
      subTitle: '회사 블로그 업무 관련 인터뷰 참여.',
      at: '2020-11',
      descriptions: [
        {
          content: 'Link:',
          postHref: 'https://blog.naver.com/okestro/222135040560',
        },
      ],
    },
  ],
};

export default presentation;
