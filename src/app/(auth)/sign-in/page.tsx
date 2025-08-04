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
import { Loader2 } from "lucide-react"

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
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render form if already authenticated
  if (status === "authenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Back to True Feedback</h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} disabled={isLoading} />
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
                  <Input type="password" {...field} disabled={isLoading} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
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
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
