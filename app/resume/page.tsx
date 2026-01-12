import { Metadata } from 'next'
import { ResumeContent } from '@/components/resume/resume-content'

export const metadata: Metadata = {
  title: '이력서',
  description: 'DevOps Engineer 최시영의 이력서',
}

export default function ResumePage() {
  return <ResumeContent />
}

