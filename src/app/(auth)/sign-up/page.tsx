"use client"
import { signUpSchema } from "@/lib/validations/signUpSchema"
import { useRouter } from "next/navigation"
import type * as z from "zod"
import { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ApiResponse } from "@/types/ApiResponse"
import axios, { type AxiosError } from "axios"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignUpForm() {
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
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
          console.log("Username checking response:", response.data)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking Username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      console.log("Submitting sign-up data: ", { ...data, password: "[HIDDEN]" })
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      console.log("Sign-up response: ", response.data)
      toast.success(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.error("Error during sign-up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage =
        axiosError.response?.data.message ?? "There was a problem with your sign-up. Please try again"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Join Tempify</h1>
            <p className="text-slate-600">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Username</FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {isCheckingUsername && (
                      <div className="flex items-center mt-2">
                        <Loader2 className="animate-spin h-4 w-4 mr-2 text-indigo-600" />
                        <span className="text-sm text-slate-600">Checking availability...</span>
                      </div>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm mt-2 ${
                          usernameMessage === "Username is unique" ? "text-green-600" : "text-red-600"
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
                    <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-sm text-slate-500 mt-1">We will send you a verification code</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl"
                disabled={isSubmitting}
              >
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

          <div className="text-center mt-6">
            <p className="text-slate-600">
              Already a member?{" "}
              <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
