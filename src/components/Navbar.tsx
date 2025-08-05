"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import type { User } from "next-auth"
import { Button } from "./ui/button"
import { LogOut, UserIcon, Home } from "lucide-react"
import { useRouter } from "next/navigation"
const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Tempify</span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* User Info */}
<Link
  href={`/u/${user?.username || ""}`}
  className="hidden md:flex items-center space-x-3 hover:underline"
>
  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
    <UserIcon className="w-4 h-4 text-indigo-600" />
  </div>
  <div className="text-sm">
    <p className="text-slate-900 font-medium">
      Welcome, {user?.username || user?.email}
    </p>
  </div>
</Link>

                {/* Mobile User Info */}
                  <Link href={`/u/${user?.username || ""}`} className="md:hidden">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
               <UserIcon className="w-4 h-4 text-indigo-600" />
                </div>
                </Link>
              
                {/* Logout Button */}
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 bg-transparent"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
