import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Redirect} from '@docusaurus/router';

/**
 * sapcy.github.io 에서는 /projects 로 노출됩니다. 기존 링크 호환용으로
 * /projects → /project 로 통일합니다.
 */
export default function ProjectsAliasPage() {
  const to = useBaseUrl('/project');
  return <Redirect to={to} />;
}
