import { Metadata } from 'next'
import { ProjectTabs } from '@/components/projects/project-tabs'

export const metadata: Metadata = {
  title: '프로젝트',
  description: '개인 프로젝트 및 데모',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">프로젝트</h1>
        <ProjectTabs />
      </div>
    </div>
  )
}

