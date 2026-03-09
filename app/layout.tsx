import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Hindi Christian Fellowship of Greater Boston',
  description: 'Hindi Christian Fellowship of Greater Boston website',
  generator: 'HCF',
  icons: {
    icon: [
      {
        url: 'final_logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'final_logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'final_logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: 'final_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
