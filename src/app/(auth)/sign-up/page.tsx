'use client'

import { signUpSchema } from "@/lib/validations/signUpSchema"
import { useRouter } from "next/navigation"
import type * as z from 'zod'
import { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { ApiResponse } from "@/types/ApiResponse"
import axios,{AxiosError} from 'axios'
import { toast } from "sonner"
import {Loader2} from  'lucide-react'
import {Form, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

export default function SignUpForm(){
    const [username, setUsername] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)

    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    useEffect(()=>{
        const checkUsernameUnique = async () =>{
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                    console.log("Username checking response:", response.data)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking Username")
                } finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    },[username])

    const onSubmit = async (data: z.infer <typeof signUpSchema>) =>{
        setIsCheckingUsername(true)
        try {
            console.log("Submitting sign-up data: ", {...data, password: "[HIDDEN]"})

            const response = await axios.post<ApiResponse>("/api/sign-up", data)

            console.log("Sign-up response: ", response.data)
            toast.success(response.data.message)

            router.replace(`/verify/${data.username}`)
        } catch (error) {
            console.error("Error during sign-up:", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message ?? "There was a problem with your sign-up. Please try again"

            toast.error(errorMessage)
        } finally{
            setIsSubmitting(false)
        }
    }
    return (
          <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Tempify</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" />
                  <p className="text-muted text-gray-400 text-sm">We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    )

}