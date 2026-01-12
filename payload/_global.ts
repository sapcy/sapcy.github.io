import favicon from '../asset/favicon_globe.png';
import { IGlobal } from '../component/common/IGlobal';

const title = 'Resume - 최시영';
const description = 'This is a simple web resume.';

export const _global: IGlobal.Payload = {
  favicon,
  headTitle: title,
  seo: {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: '/preview.jpg',
          width: 800,
          height: 600,
          alt: 'OpenGraph Image Sample',
        },
      ],
      type: 'profile',
      profile: {
        firstName: 'Lorem',
        lastName: 'ipsum',
        username: 'lorem',
        gender: 'male',
      },
    },
  },
};
