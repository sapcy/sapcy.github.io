const skillCategories = [
  {
    category: 'Programming Languages',
    items: ['Java', 'Shell Scripting'],
  },
  {
    category: 'Frameworks & Libraries',
    items: ['Springboot', 'Spring Cloud Gateway', 'Vue.js', 'React.js', 'Next.js'],
  },
  {
    category: 'Infrastructure & Databases',
    items: ['Kubernetes', 'Docker', 'MariaDB', 'Redis', 'Nginx', 'Prometheus', 'Grafana', 'Vault', 'Harbor', 'OpenStack'],
  },
  {
    category: 'CI/CD Automation',
    items: ['Jenkins', 'ArgoCD', 'GitLab CI', 'Ansible'],
  },
  {
    category: 'Tools & IDEs',
    items: ['IDEA', 'VS Code', 'Jira', 'Slack', 'GitHub', 'GitLab', 'Bitbucket'],
  },
]

export function Skills() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        기술 스택
      </h2>
      <div className="space-y-4">
        {skillCategories.map((category) => (
          <div key={category.category}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{category.category}</h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

