'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, Home, ShoppingCart } from 'lucide-react'

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Cancelled</CardTitle>
          <p className="text-slate-600 mt-2">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Your cart items are still saved. You can complete your purchase anytime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
