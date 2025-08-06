"use client"

import { User, LinkIcon, Copy } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface ProfileSectionProps {
  session: any
  username: string
}

export function ProfileSection({ session, username }: ProfileSectionProps) {
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

  return (
    <div className="space-y-6">
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
