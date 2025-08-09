"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import type { User } from "next-auth"
import { Button } from "./ui/button"
import { LogOut, UserIcon, Home, Store, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import Cart from "./Cart"
const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/stores" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Store className="w-4 h-4" />
              <span>Stores</span>
            </Link>
          </div>

          {/* Cart and Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Button>

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
      
      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

export default Navbar
