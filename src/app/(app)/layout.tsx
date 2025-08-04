import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  )
}
