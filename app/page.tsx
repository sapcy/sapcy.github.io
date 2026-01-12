import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const githubProjects = [
  {
    name: 'sapcy.github.io',
    description: '개인 포트폴리오 & 이력서 웹사이트',
    url: 'https://github.com/sapcy/sapcy.github.io',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'webseal',
    description: 'Kubernetes Sealed Secrets 생성 웹 도구',
    url: 'https://github.com/sapcy/webseal',
    tags: ['Go', 'Next.js', 'Kubernetes'],
    demo: '/projects/webseal',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold">
              S
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                최시영 <span className="text-gray-400 text-2xl">(Sapcy)</span>
              </h1>
              <p className="text-xl text-blue-600 font-medium mb-4">DevOps Engineer</p>
              <p className="text-gray-600 max-w-xl">
                개발과 인프라에 대한 이해를 갖춘 DevOps 엔지니어로서 
                복잡한 시스템을 최적화하고 자동화하여 원활한 배포와 운영 효율성을 보장합니다.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                <a
                  href="https://github.com/sapcy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                  GitHub
                </a>
                <a
                  href="mailto:sychoi1644@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/resume"
              className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                이력서 보기
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600 text-sm">
                경력, 프로젝트, 기술 스택 등 상세한 이력서를 확인하세요.
              </p>
            </Link>
            <Link
              href="/projects"
              className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                프로젝트
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600 text-sm">
                개인 프로젝트와 데모를 확인하세요.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* GitHub Projects */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">GitHub Projects</h2>
          <div className="grid gap-4">
            {githubProjects.map((project) => (
              <div
                key={project.name}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.demo && (
                      <Link
                        href={project.demo}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Demo
                      </Link>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          © 2026 Sapcy. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

