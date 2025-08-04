import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
    ]
}

export async function middleware(request:NextRequest) {

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token": "next-auth.session-token",
    })

    const url = request.nextUrl
    const {pathname} = url

  console.log("Middleware - Path:", pathname)
  console.log("Middleware - Token exists:", !!token)
  console.log(
    "Middleware - Cookies:",
    request.cookies.getAll().map((c) => c.name),
  )

  if(pathname.startsWith("/api/auth")){
    return NextResponse.next()
  }
  
  const publicRoutes = ["/"]
  const isPublicRoute = publicRoutes.includes(pathname)

  const authRoutes = ["/sign-in", "/sign-up", "/verify"]
   const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

     const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

      if (token) {
    console.log("User is authenticated")
      
       
          if (isAuthRoute || pathname === "/") {
      console.log("Redirecting authenticated user to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

        if (isProtectedRoute) {
      console.log("Allowing access to protected route")
      return NextResponse.next()
    }
}

    if(!token) {
         console.log("User is not authenticated")

             if (isProtectedRoute) {
      console.log("Redirecting unauthenticated user to sign-in")
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
        if (isPublicRoute || isAuthRoute) {
          console.log("Allowing access to public/auth route")
          return NextResponse.next()
        }

    }
     console.log("Default: allowing request to continue")
     return NextResponse.next()
}
