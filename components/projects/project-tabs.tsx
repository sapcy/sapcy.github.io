'use client'

import { useState } from 'react'
import { WebSealProject } from './webseal'
import { KubeCertProject } from './kube-cert'

const tabs = [
  { id: 'webseal', label: 'WebSeal', component: WebSealProject },
  { id: 'kubecert', label: 'Kube Cert', component: KubeCertProject },
]

export function ProjectTabs() {
  const [activeTab, setActiveTab] = useState('webseal')

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || WebSealProject

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        <ActiveComponent />
      </div>
    </div>
  )
}

