import type React from 'react'
import './global.css'
import AuthProvider from '../context/AuthProvider'

export const metadata = {
  title: "Tempify",
  description: "Your Ecommerse"
}

export default function RootLayout({
  children
}: {children: React.ReactNode})
{
  return (
    <html lang='en'>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}