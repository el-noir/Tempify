"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { signIn, useSession } from "next-auth/react"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signInSchema } from "@/lib/validations/signInSchema"
import { useState, useEffect } from "react"
import { Loader2, Lock } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status, update } = useSession()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User already authenticated, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [status, session, router])

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true)
    try {
      console.log("Attempting sign in...")
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })

      console.log("Sign in result:", result)
      if (result?.error) {
        console.log("Sign in error:", result.error)
        if (result.error === "CredentialsSignin") {
          toast.error("Incorrect username or password")
        } else {
          toast.error(result.error)
        }
      } else if (result?.ok) {
        console.log("Sign in successful, updating session...")
        toast.success("Login successful! Redirecting...")
        // Force session update and wait for it
        await update()
        // Wait a bit longer to ensure cookies are set
        setTimeout(async () => {
          console.log("Attempting redirect to dashboard...")
          // Try multiple redirect strategies
          try {
            // First try: Next.js router
            router.push("/dashboard")
            // Fallback: Hard redirect after a short delay
            setTimeout(() => {
              if (window.location.pathname !== "/dashboard") {
                console.log("Router redirect failed, using window.location")
                window.location.href = "/dashboard"
              }
            }, 1000)
          } catch (error) {
            console.error("Router redirect failed:", error)
            window.location.href = "/dashboard"
          }
        }, 1500)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if checking authentication status
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render form if already authenticated
  if (status === "authenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue your secret conversations</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email/Username</FormLabel>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
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
                      disabled={isLoading}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-slate-600">
              Not a member yet?{" "}
              <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
