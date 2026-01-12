'use client'

import { Profile } from './sections/profile'
import { Introduce } from './sections/introduce'
import { Skills } from './sections/skills'
import { Experience } from './sections/experience'
import { Projects } from './sections/projects'
import { OpenSource } from './sections/opensource'
import { Education } from './sections/education'

export function ResumeContent() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <Profile />
        <Introduce />
        <Skills />
        <Experience />
        <Projects />
        <OpenSource />
        <Education />
        
        <footer className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Last updated: 2026-01-12</p>
        </footer>
      </div>
    </div>
  )
}

