"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function StripeRefreshPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect back to setup page after a short delay
    const timer = setTimeout(() => {
      router.push('/dashboard/stripe')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <CardTitle>Refreshing Setup</CardTitle>
            <CardDescription>
              Redirecting you back to continue the setup process
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              If you need to make changes to your account information, you'll be able to continue where you left off.
            </p>
            
            <Button 
              onClick={() => router.push('/dashboard/stripe')}
              className="w-full"
            >
              Continue Now
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
