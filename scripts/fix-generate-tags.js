const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 태그 수집 함수
function collectTags() {
  const tags = new Set();
  const docsDir = path.join(__dirname, '..', 'docs');

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const {data} = matter(content);

        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag) => tags.add(tag));
        }
      }
    });
  }

  scanDirectory(docsDir);
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

// 태그 페이지 생성
function generateTagPages() {
  const tags = collectTags();
  const tagsDir = path.join(__dirname, '..', 'src', 'pages', 'tags');
  const tagsJson = JSON.stringify(tags);

  if (!fs.existsSync(tagsDir)) {
    fs.mkdirSync(tagsDir, {recursive: true});
  }

  tags.forEach((tag) => {
    const fileName = `${tag}.js`;
    const filePath = path.join(tagsDir, fileName);
    const otherTags = tags.filter((t) => t !== tag);

    const content = `import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import TagList from '@site/src/components/TagList';

const tag = ${JSON.stringify(tag)};

export default function TagPage() {
  return (
    <Layout title={\`#\${tag} 태그\`} description={\`\${tag} 태그가 달린 문서를 주제별로 모았습니다.\`}>
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
          <TagList tags={${JSON.stringify(otherTags)}} />
        </section>
      </div>
    </Layout>
  );
}
`;

    fs.writeFileSync(filePath, content);
    console.log(`Generated: ${fileName}`);
  });

  const indexContent = `import React from 'react';
import Layout from '@theme/Layout';
import TagList from '@site/src/components/TagList';

const tags = ${tagsJson};

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
`;

  fs.writeFileSync(path.join(tagsDir, 'index.js'), indexContent);
  console.log('Generated: tags/index.js');

  console.log(`✅ ${tags.length}개의 태그 페이지 생성 완료!`);
}

generateTagPages();
