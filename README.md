# Sapcy Portfolio

개인 포트폴리오 및 프로젝트 데모 사이트입니다.

## 주요 기능

- **Home**: 간단한 소개 및 GitHub 프로젝트 목록
- **이력서**: 경력, 프로젝트, 기술 스택 등 상세 이력서
- **프로젝트**: 개인 프로젝트 데모
  - WebSeal: Kubernetes Sealed Secrets Generator (SSR API 내장)

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- node-forge (RSA 암호화)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 프로젝트 구조

```
sapcy.github.io/
├── app/
│   ├── api/
│   │   └── seal/          # WebSeal API (SSR)
│   ├── projects/          # 프로젝트 페이지
│   ├── resume/            # 이력서 페이지
│   ├── layout.tsx
│   └── page.tsx           # Home
├── components/
│   ├── navigation.tsx
│   ├── projects/
│   │   ├── project-tabs.tsx
│   │   └── webseal.tsx
│   └── resume/
│       └── sections/
├── styles/
│   └── globals.css
└── package.json
```

## 배포

GitHub Pages 또는 Vercel로 배포할 수 있습니다.

```bash
# Vercel 배포
npx vercel

# 또는 GitHub Pages (정적 export 필요)
npm run build
```

## 라이선스

MIT
