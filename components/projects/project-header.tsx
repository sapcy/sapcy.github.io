'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

interface ProjectHeaderProps {
  title: string
  description: string
  githubUrl: string
}

export function ProjectHeader({ title, description, githubUrl }: ProjectHeaderProps) {
  return (
    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-100 transition-colors"
          title="GitHub Repository"
        >
          <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
        </a>
      </div>
    </div>
  )
}

