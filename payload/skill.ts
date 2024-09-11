import { ISkill } from '../component/skill/ISkill';

const programmingLanguages: ISkill.Skill = {
  category: 'Programming Languages',
  items: [
    {
      title: 'Java',
    },
    {
      title: 'C++',
    },
    {
      title: 'Golang',
    },
    {
      title: 'Shell Scripting',
    },
  ],
};

const frameworkLibraries: ISkill.Skill = {
  category: 'Frameworks & Libraries',
  items: [
    {
      title: 'Springboot',
    },
    {
      title: 'Spring Cloud Gateway',
    },
    {
      title: 'Vue.js',
    },
    {
      title: 'React.js',
    },
    {
      title: 'Next.js',
    },
  ],
};

const infrastructure: ISkill.Skill = {
  category: 'Infrastructure & Databases\n',
  items: [
    {
      title: 'Kubernetes',
    },
    {
      title: 'Docker',
    },
    {
      title: 'MariaDB',
    },
    {
      title: 'Redis',
    },
    {
      title: 'Nginx',
    },
    {
      title: 'Prometheus',
    },
    {
      title: 'Grafana',
    },
    {
      title: 'Vault',
    },
    {
      title: 'Harbor',
    },
    {
      title: 'OpenStack',
    },
    {
      title: 'AWS',
    },
  ],
};

const automation: ISkill.Skill = {
  category: 'CI|CD Automation',
  items: [
    {
      title: 'Jenkins',
    },
    {
      title: 'ArgoCD',
    },
    {
      title: 'Jenkins',
    },
    {
      title: 'GitLab CI',
    },
    {
      title: 'Ansible',
    },
  ],
};

const toolsIde: ISkill.Skill = {
  category: 'Tools & IDEs',
  items: [
    {
      title: 'IDEA',
    },
    {
      title: 'VS Code',
    },
    {
      title: 'Vim',
    },
    {
      title: 'Jira',
    },
    {
      title: 'Slack',
    },
    {
      title: 'Github',
    },
    {
      title: 'Gitlab',
    },
    {
      title: 'Bitbucket',
    },
  ],
};

const skill: ISkill.Payload = {
  disable: false,
  skills: [programmingLanguages, frameworkLibraries, infrastructure, automation, toolsIde],
  tooltip: '1: 기초 수준\n2: 취미 개발 수준\n3: Production 개발 가능 수준',
};

export default skill;
