import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import Script from 'next/script'
import MessengerChat from '@/components/MessengerChat' // 1. შემოვიტანეთ ღილაკი

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <LanguageProvider>
          {children}
          {/* 2. ჩავსვით ღილაკი აქ, რომ მუდმივად ჩანდეს */}
          <MessengerChat />
        </LanguageProvider>

        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  )
}