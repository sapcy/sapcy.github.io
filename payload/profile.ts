import { faEnvelope, faPhone, faBlog } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { faBell } from '@fortawesome/free-regular-svg-icons';
import { IProfile } from '../component/profile/IProfile';
import image from '../asset/profile_main.jpeg';

const profile: IProfile.Payload = {
  disable: false,
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
    {
      link: 'https://tech-is-my-life.tistory.com',
      icon: faBlog,
    },
  ],
  notice: {
    title: '휴대전화나 이메일로 연락 부탁드립니다.',
    icon: faBell,
  },
};

export default profile;
