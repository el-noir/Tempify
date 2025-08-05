'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, Store } from 'lucide-react'

import { Button } from '@/components/ui/button'



const AddStore = () => {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      router.push('/sign-in')
    },
  })
  const router = useRouter()
 

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-slate-600">Access denied. Please sign in.</p>
          <Button
            onClick={() => router.push('/sign-in')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div>Hello {session.user.username}</div>
    </div>
  )
}

export default AddStore