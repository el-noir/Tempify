import type React from "react"
import "./globals.css"
import AuthProvider from "../context/AuthProvider"
import { CartProvider } from "@/contexts/CartContext"

export const metadata = {
  title: "Tempify",
  description: "Your Ecommerce Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
