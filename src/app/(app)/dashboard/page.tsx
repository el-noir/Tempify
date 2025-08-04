"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Dashboard() {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      console.log("Dashboard - User not authenticated, redirecting to sign-in")
      router.push("/sign-in")
    },
  })

  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard - Session status:", status)
    console.log("Dashboard - Session data:", session)
  }, [session, status])

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Access denied. Please sign in.</p>
          <Button onClick={() => router.push("/sign-in")}>Go to Sign In</Button>
        </div>
      </div>
    )
  }

  const { username } = session.user
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {username}!</p>

      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-green-800">🎉 Authentication successful! You are now logged in.</p>
        <p className="text-sm text-green-600 mt-2">Session: {JSON.stringify(session.user, null, 2)}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 p-2 mr-2 bg-gray-100 border rounded"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
