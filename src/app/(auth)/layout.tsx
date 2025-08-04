import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
      {children}
      <Toaster />
    </div>
  )
}
