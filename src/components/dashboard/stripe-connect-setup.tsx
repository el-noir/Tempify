"use client"

import { useState, useEffect } from 'react'
import { useStripeConnect } from '@/hooks/useStripeConnect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface StripeConnectSetupProps {
  onStatusChange?: (status: any) => void
}

export function StripeConnectSetup({ onStatusChange }: StripeConnectSetupProps) {
  const { status, loading, error, createAccount, createOnboardingLink, refreshStatus } = useStripeConnect()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (status && onStatusChange) {
      onStatusChange(status)
    }
  }, [status, onStatusChange])

  const handleSetupStripe = async () => {
    setIsProcessing(true)
    try {
      // Create account if it doesn't exist
      if (!status?.accountId) {
        await createAccount('US')
      }

      // Create onboarding link
      const returnUrl = `${window.location.origin}/dashboard/stripe/return`
      const refreshUrl = `${window.location.origin}/dashboard/stripe/refresh`
      
      const { url } = await createOnboardingLink(returnUrl, refreshUrl)
      
      // Redirect to Stripe onboarding
      window.location.href = url
    } catch (err) {
      console.error('Error setting up Stripe:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = () => {
    if (!status) return null

    switch (status.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Active</Badge>
      case 'pending':
        return <Badge variant="secondary">⏳ Pending</Badge>
      case 'restricted':
        return <Badge variant="destructive">⚠️ Restricted</Badge>
      case 'rejected':
        return <Badge variant="destructive">❌ Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusMessage = () => {
    if (!status) {
      return "Set up your payment account to start receiving payments from your stores."
    }

    switch (status.status) {
      case 'active':
        return "Your payment account is active and ready to receive payments!"
      case 'pending':
        return "Your payment account setup is in progress. Complete the onboarding process to activate it."
      case 'restricted':
        return "Your payment account has restrictions. Please complete the required information."
      case 'rejected':
        return "Your payment account was rejected. Please contact support for assistance."
      default:
        return "Unknown account status. Please refresh to check again."
    }
  }

  const canCreateStores = status?.onboardingComplete && status?.status === 'active'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Payment Setup</CardTitle>
            {getStatusBadge()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Connect your Stripe account to receive payments from your stores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          {canCreateStores ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">
              {canCreateStores ? "Ready to create stores!" : "Payment setup required"}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {status?.accountId && (
          <div className="text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
            Account ID: {status.accountId}
          </div>
        )}

        <div className="flex gap-2">
          {!canCreateStores && (
            <Button 
              onClick={handleSetupStripe}
              disabled={isProcessing || loading}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {status?.accountId ? 'Complete Setup' : 'Setup Payments'}
                </>
              )}
            </Button>
          )}
          
          {status?.accountId && (
            <Button 
              variant="outline"
              onClick={handleSetupStripe}
              disabled={isProcessing || loading}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Account
            </Button>
          )}
        </div>

        {!canCreateStores && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to complete payment setup before you can create stores. This ensures you can receive payments from your customers.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
