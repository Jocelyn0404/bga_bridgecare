import './globals.css'
import { AppProvider } from './context/AppContext'

export const metadata = {
  title: 'Medical Onboarding Form',
  description: 'Multi-step medical onboarding form with elderly support and blockchain data access',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
} 