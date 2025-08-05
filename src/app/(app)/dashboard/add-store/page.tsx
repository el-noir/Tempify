'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { Loader2, Store } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { createStoreSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'

interface StorePlan {
  _id: string
  title: string
  durationHours: number
  commissionPercentage: number
}

interface ApiResponse<T> {
  success: boolean
  message: string
  plans?: T
  store?: T
  errors?: Record<string, string[]>
}

const AddStore = () => {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      router.push('/sign-in')
    },
  })
  const router = useRouter()
  const [plans, setPlans] = useState<StorePlan[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameMessage, setNameMessage] = useState('')
  const [isCheckingName, setIsCheckingName] = useState(false)

  const form = useForm<z.infer<typeof createStoreSchema>>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      description: '',
      planId: '',
      expiresInHours: 0,
    },
  })

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get<ApiResponse<StorePlan[]>>('/api/store-plans/get')
        if (response.data.success) {
          setPlans(response.data.plans || [])
        } else {
          toast.error(response.data.message || 'Failed to fetch plans')
        }
      } catch (err) {
        const error = err as AxiosError<ApiResponse<null>>
        toast.error(error.response?.data.message || 'Failed to fetch plans')
      }
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    const checkNameUnique = async () => {
      const name = form.watch('name')
      if (name) {
        setIsCheckingName(true)
        setNameMessage('')
        try {
          const response = await axios.get<ApiResponse<null>>(`/api/store/check-title-unique?name=${encodeURIComponent(name)}`)
          setNameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse<null>>
          setNameMessage(axiosError.response?.data.message ?? 'Error checking name')
        } finally {
          setIsCheckingName(false)
        }
      } else {
        setNameMessage('')
        setIsCheckingName(false)
      }
    }
    const timer = setTimeout(checkNameUnique, 500) // Debounce for better UX
    return () => clearTimeout(timer)
  }, [form.watch('name')])

  const onSubmit = async (data: z.infer<typeof createStoreSchema>) => {
    if (nameMessage !== 'Name is unique') {
      toast.error('Please choose a unique store name')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse<{ _id: string; name: string; slug: string; expiresAt: string }>>(
        '/api/store/create',
        data
      )
      if (response.data.success) {
        toast.success(response.data.message || 'Store created successfully!')
        router.push(`/stores/${response.data.store?.slug}`)
      } else {
        toast.error(response.data.message || 'Failed to create store')
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>
      const errorMessage = error.response?.data.message || 'An unexpected error occurred'
      if (error.response?.data.errors) {
        Object.values(error.response.data.errors).forEach((errors) => {
          errors.forEach((msg) => toast.error(msg))
        })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-semibold text-slate-900">Create Your Store</h1>
          <p className="mt-2 text-slate-600">
            Welcome, {session.user.username}! Let's set up your new storefront.
          </p>
        </motion.div>

        {/* Plan Selection */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-slate-900">Choose a Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 && (
              <p className="text-sm text-slate-500">No plans available at the moment.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan._id}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors
                    ${form.watch('planId') === plan._id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}
                  onClick={() => form.setValue('planId', plan._id, { shouldValidate: true, shouldDirty: true })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                      <p className="text-sm text-slate-600">{plan.durationHours} hours duration</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {plan.commissionPercentage}% commission
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {form.formState.errors.planId && (
              <p className="text-red-600 mt-2 text-sm">{form.formState.errors.planId.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Store Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-slate-900">Store Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Store Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="mt-1 bg-white border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            placeholder="Enter your store name"
                          />
                          {isCheckingName && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-indigo-600" />
                          )}
                        </div>
                      </FormControl>
                      {nameMessage && (
                        <p
                          className={`text-sm mt-1 ${
                            nameMessage === 'Name is unique' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {nameMessage}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="mt-1 bg-white border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                          placeholder="Describe your store (optional)"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresInHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Additional Hours (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          className="mt-1 bg-white border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                          placeholder="Extend plan duration in hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || nameMessage !== 'Name is unique'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <><Store className="h-4 w-4 mr-2" /> Create Store</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddStore
