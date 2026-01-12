const experiences = [
  {
    company: '오케스트로(주)',
    position: 'DevOps Engineer',
    startDate: '2019-10',
    endDate: '현재',
    description: '클라우드 전환 및 설계 컨설팅부터 구축, 운영을 위한 다양한 솔루션을 자체 개발해 제공하는 기업',
    url: 'https://www.okestro.com/',
    skills: ['Kubernetes', 'Java', 'Spring', 'MariaDB', 'Jenkins', 'Automation', 'OpenStack'],
  },
]

export function Experience() {
  const calculateTotalPeriod = () => {
    const start = new Date('2019-10-01')
    const now = new Date()
    const years = now.getFullYear() - start.getFullYear()
    const months = now.getMonth() - start.getMonth()
    const totalMonths = years * 12 + months
    const y = Math.floor(totalMonths / 12)
    const m = totalMonths % 12
    return `${y}년 ${m}개월`
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-1 pb-2 border-b border-gray-200">
        경력
      </h2>
      <p className="text-sm text-gray-500 mb-4">총 경력: {calculateTotalPeriod()}</p>
      
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.company} className="border-l-2 border-blue-500 pl-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.company}</h3>
                <p className="text-blue-600 font-medium">{exp.position}</p>
              </div>
              <span className="text-sm text-gray-500">
                {exp.startDate} ~ {exp.endDate}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {exp.description}
              {exp.url && (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  →
                </a>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

