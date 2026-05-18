import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {StaticIacTool} from '../../sapcy-shims/web-static-iac';
import {ProjectHeader} from './ProjectHeader';

export function StaticIacProject() {
  const {siteConfig} = useDocusaurusContext();
  const apiBaseUrl =
    (siteConfig.customFields?.staticIacApiUrl as string | undefined) ?? '';

  return (
    <div>
      <ProjectHeader
        title="StaticIac - IaC Security Static Analysis"
        description="Terraform, Kubernetes, Dockerfile 등 인프라 코드(IaC)에 대한 보안·컴플라이언스 misconfiguration을 Checkov로 정적 분석합니다. 텍스트 입력 또는 파일 업로드 후 AWS 백엔드에서 스캔하고 결과를 다운로드할 수 있습니다."
        githubUrl="https://github.com/sapcy/web-static-iac"
      />
      <StaticIacTool apiBaseUrl={apiBaseUrl} />
    </div>
  );
}
