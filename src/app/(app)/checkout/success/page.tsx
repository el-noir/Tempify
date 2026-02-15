'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, Package } from 'lucide-react'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<{
    sessionId: string;
    status: string;
    total: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would verify the session with Stripe
      // and fetch order details from your database
      setOrderDetails({
        sessionId,
        status: 'completed',
        total: '$0.00' // This would come from your database
      })
    }
    setLoading(false)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <p className="text-slate-600 mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {orderDetails && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Order ID:</span> {orderDetails.sessionId}</p>
                <p><span className="font-medium">Status:</span> {orderDetails.status}</p>
                <p><span className="font-medium">Total:</span> {orderDetails.total}</p>
              </div>
            </div>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              You will receive an email confirmation shortly with your order details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/stores" className="flex-1">
                <Button className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Browse Stores
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
