"use client"

import { StripeConnectSetup } from '@/components/dashboard/stripe-connect-setup'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function StripeSetupPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Payment Setup</h1>
          <p className="text-slate-600">Configure your payment account to start selling</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <StripeConnectSetup />
        
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>
              Understanding the payment process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Complete Stripe onboarding</p>
                  <p className="text-sm text-slate-600">
                    Provide your business information and bank account details
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Create your stores</p>
                  <p className="text-sm text-slate-600">
                    Once approved, you can create stores and add products
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Receive payments</p>
                  <p className="text-sm text-slate-600">
                    Customers pay through Stripe, and you receive the amount minus platform commission
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Commission:</strong> A small percentage is deducted from each sale as a platform fee. 
                The exact percentage depends on your store plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
