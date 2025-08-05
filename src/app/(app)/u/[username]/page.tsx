'use client'

import React,{useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LinkIcon, Copy } from 'lucide-react'
import { useSession } from "next-auth/react"
import {toast} from 'sonner'
import { Input } from '@/components/ui/input'

function Profile() {
      const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      console.log("Dashboard - User not authenticated, redirecting to sign-in")
      router.push("/sign-in")
    },
  })
  const router = useRouter()
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  useEffect(() => {
    console.log("Dashboard - Session status:", status)
    console.log("Dashboard - Session data:", session)
  }, [session, status])

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-slate-600">Access denied. Please sign in.</p>
          <Button onClick={() => router.push("/sign-in")} className="bg-indigo-600 hover:bg-indigo-700">
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  const { username } = session.user
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

     return (
        <div className="space-y-6">
          {/* Success Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">🎉 Authentication Successful!</h3>
                  <p className="text-slate-600 mb-3">You are now logged in and ready to use the platform.</p>
                  <details className="mt-3">
                    <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                      View session details
                    </summary>
                    <pre className="mt-2 text-xs bg-slate-50 p-3 rounded-lg overflow-auto text-slate-700">
                      {JSON.stringify(session.user, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile URL Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Unique Profile Link</h3>
                  <p className="text-slate-600 mb-4">Share this link to let others find your profile.</p>
                  <div className="flex items-center space-x-3">
                    <Input type="text" value={profileUrl} disabled className="flex-1 bg-slate-50" />
                    <Button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-700">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
}

export default Profile