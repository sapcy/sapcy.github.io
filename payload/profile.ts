import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { faBell } from '@fortawesome/free-regular-svg-icons';
import { IProfile } from '../component/profile/IProfile';
import image from '../asset/sample_tux.png';

const profile: IProfile.Payload = {
  disable: false,

  // image: 'https://resume.yowu.dev/static/image/profile_2019.png',
  image,
  name: {
    title: '최시영',
    small: '(Sapcy)',
  },
  contact: [
    {
      title: 'sychoi1644@gmail.com',
      link: 'mailto:sychoi1644@gmail.com',
      icon: faEnvelope,
    },
    {
      title: '010-5189-1644',
      icon: faPhone,
      badge: true,
    },
    {
      link: 'https://github.com/sapcy',
      icon: faGithub,
    },
  ],
  notice: {
    title: '휴대전화나 페이스북 메시지 아닌 이메일로 연락 부탁드립니다.',
    icon: faBell,
  },
};

export default profile;
