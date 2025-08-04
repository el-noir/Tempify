"use client"
import { verifySchema } from "@/lib/validations/verifySchema"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import axios, { type AxiosError } from "axios"
import { toast } from "sonner"
import type { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shield } from "lucide-react"

function VerifyAccount() {
  const router = useRouter()
  const params = useParams()
  const username = typeof params.username === "string" ? params.username : ""

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      })
      toast.success(response.data.message)
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error while verifying:", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Account</h1>
            <p className="text-slate-600">Enter the verification code sent to your email</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Verification Code</FormLabel>
                    <Input
                      {...field}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-center text-lg tracking-widest"
                      placeholder="Enter code"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl"
              >
                Verify Account
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount
