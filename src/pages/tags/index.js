import React from 'react';
import Layout from '@theme/Layout';
import TagList from '@site/src/components/TagList';

const tags = ["algorithm","argocd","aws","backend","cloud","cloud-native","container","cs","docker","eks","http","intro","java","kubernetes","kyaml","opensource","security","spring","yaml"];

export default function TagsIndex() {
  return (
    <Layout title="모든 태그" description="문서·블로그 태그로 모아보기">
      <div className="container margin-vert--lg">
        <header className="margin-bottom--lg">
          <h1>태그 목록</h1>
          <p className="text--secondary">
            문서 front matter의 태그와 연결된 주제별 모음입니다. 색은 주제 구분용입니다.
          </p>
        </header>
        <TagList tags={tags} />
      </div>
    </Layout>
  );
}
