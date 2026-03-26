import React from 'react';
import Layout from '@theme/Layout';
import {ProjectTabs} from '../components/projects/ProjectTabs';
import styles from './project.module.css';

export default function ProjectPage() {
  return (
    <Layout
      title="프로젝트"
      description="개인 프로젝트 및 데모 - WebSeal, Kube Cert"
      wrapperClassName="project-page-wrapper">
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>프로젝트</h1>
          <div className="sapcy-tools-scope">
            <ProjectTabs />
          </div>
        </div>
      </div>
    </Layout>
  );
}
