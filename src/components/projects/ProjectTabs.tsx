import React, {useState} from 'react';
import clsx from 'clsx';
import {WebSealProject} from './WebSealProject';
import {KubeCertProject} from './KubeCertProject';
import styles from '../../pages/project.module.css';

const tabs = [
  {id: 'webseal' as const, label: 'WebSeal', Component: WebSealProject},
  {id: 'kubecert' as const, label: 'Kube Cert', Component: KubeCertProject},
];

export function ProjectTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>(
    'webseal',
  );

  const ActiveComponent =
    tabs.find((t) => t.id === activeTab)?.Component ?? WebSealProject;

  return (
    <div className={styles.tabsWrap}>
      <div className={styles.tabsNav} role="tablist" aria-label="프로젝트 탭">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={clsx(
              styles.tabBtn,
              activeTab === tab.id && styles.tabBtnActive,
            )}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className={clsx('animate-fadeIn', styles.tabPanel)} role="tabpanel">
        <ActiveComponent />
      </div>
    </div>
  );
}
