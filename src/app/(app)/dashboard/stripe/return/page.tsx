"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripeConnect } from '@/hooks/useStripeConnect'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function StripeReturnPage() {
  const router = useRouter()
  const { refreshStatus } = useStripeConnect()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Wait a moment for Stripe to process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = await refreshStatus()
        
        if (result?.onboardingComplete && result?.status === 'active') {
          setStatus('success')
          setMessage('Your payment account is now active! You can start creating stores.')
        } else if (result?.status === 'pending') {
          setStatus('error')
          setMessage('Your account setup is still pending. Please complete all required information.')
        } else {
          setStatus('error')
          setMessage('There was an issue with your account setup. Please try again or contact support.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to check account status. Please try again.')
      }
    }

    checkStatus()
  }, [refreshStatus])

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/dashboard/add-store')
    } else {
      router.push('/dashboard/stripe')
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <CardTitle>Checking your account...</CardTitle>
                <CardDescription>
                  Please wait while we verify your payment setup
                </CardDescription>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-green-900">Setup Complete!</CardTitle>
                <CardDescription>
                  Your payment account is ready
                </CardDescription>
              </>
            )}
            
            {status === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                <CardTitle className="text-amber-900">Setup Incomplete</CardTitle>
                <CardDescription>
                  Additional steps required
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              {message}
            </p>
            
            {status !== 'loading' && (
              <Button onClick={handleContinue} className="w-full">
                {status === 'success' ? 'Create Your First Store' : 'Continue Setup'}
              </Button>
            )}
            
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
