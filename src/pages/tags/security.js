import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import TagList from '@site/src/components/TagList';

const tag = "security";

export default function TagPage() {
  return (
    <Layout title={`#${tag} 태그`} description={`${tag} 태그가 달린 문서를 주제별로 모았습니다.`}>
      <div className="container margin-vert--lg">
        <header className="margin-bottom--lg">
          <h1>#{tag}</h1>
          <p className="text--secondary">
            <code>{tag}</code> 태그가 포함된 문서는{' '}
            <Link to="/docs/tags">문서 태그 허브</Link>에서도 필터할 수 있습니다.
          </p>
        </header>
        <section>
          <h2 className="h4">다른 태그</h2>
          <TagList tags={["algorithm","argocd","aws","backend","cloud","cloud-native","container","cs","docker","eks","http","intro","java","kubernetes","kyaml","opensource","spring","yaml"]} />
        </section>
      </div>
    </Layout>
  );
}
