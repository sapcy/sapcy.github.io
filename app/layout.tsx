import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Sapcy - DevOps Engineer',
    template: '%s | Sapcy',
  },
  description: 'DevOps Engineer Portfolio - 최시영 (Sapcy)',
  openGraph: {
    title: 'Sapcy - DevOps Engineer',
    description: 'DevOps Engineer Portfolio',
    type: 'profile',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}

