'use client'

import { verifySchema } from '@/lib/validations/verifySchema';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import axios, {AxiosError} from 'axios'
import { toast } from 'sonner';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';

function VerifyAccount() {
    const router = useRouter()
     const params = useParams();
    const username = typeof params.username === 'string' ? params.username : '';

    
      const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
       
      });

      const onSubmit = async (data: z.infer<typeof verifySchema>) =>{
        try {
         const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success(response.data.message)

            router.replace('/sign-in')
        } catch (error) {
               console.error('Error while verifying:', error);
            
                  const axiosError = error as AxiosError<ApiResponse>;
           toast.error(
          axiosError.response?.data.message ?? 'An error occurred. Please try again.'
         );

        }
      }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount