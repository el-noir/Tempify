"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Loader2,
  Copy,
  User,
  LinkIcon,
  Store,
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Link,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

// Mock data for stores and products
const mockStores = [
  {
    id: "1",
    name: "Tech Store",
    description: "Electronics and gadgets",
    status: "active",
    products: 24,
    revenue: "$12,450",
  },
  {
    id: "2",
    name: "Fashion Hub",
    description: "Clothing and accessories",
    status: "active",
    products: 18,
    revenue: "$8,320",
  },
  {
    id: "3",
    name: "Home & Garden",
    description: "Home improvement items",
    status: "draft",
    products: 12,
    revenue: "$5,680",
  },
]

const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    store: "Tech Store",
    price: "$99.99",
    stock: 45,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "2",
    name: "Smart Watch",
    store: "Tech Store",
    price: "$299.99",
    stock: 23,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "3",
    name: "Designer T-Shirt",
    store: "Fashion Hub",
    price: "$49.99",
    stock: 67,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "4",
    name: "Garden Tools Set",
    store: "Home & Garden",
    price: "$79.99",
    stock: 12,
    status: "draft",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    store: "Tech Store",
    price: "$149.99",
    stock: 31,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
]

function Dashboard() {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      console.log("Dashboard - User not authenticated, redirecting to sign-in")
      router.push("/sign-in")
    },
  })
  const router = useRouter()
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  useEffect(() => {
    console.log("Dashboard - Session status:", status)
    console.log("Dashboard - Session data:", session)




  }, [session, status])

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-slate-600">Access denied. Please sign in.</p>
          <Button onClick={() => router.push("/sign-in")} className="bg-indigo-600 hover:bg-indigo-700">
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  const { username } = session.user
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

  const renderDashboardContent = () => {
    if (activeView === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStores.length}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProducts.length}</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$26,450</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+8 from yesterday</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Manage your products across all stores</CardDescription>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="max-w-sm" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="aspect-square rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.store}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeView === "profile") {
      return (
        <div className="space-y-6">
          {/* Success Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">🎉 Authentication Successful!</h3>
                  <p className="text-slate-600 mb-3">You are now logged in and ready to use the platform.</p>
                  <details className="mt-3">
                    <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                      View session details
                    </summary>
                    <pre className="mt-2 text-xs bg-slate-50 p-3 rounded-lg overflow-auto text-slate-700">
                      {JSON.stringify(session.user, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile URL Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Unique Profile Link</h3>
                  <p className="text-slate-600 mb-4">Share this link to let others find your profile.</p>
                  <div className="flex items-center space-x-3">
                    <Input type="text" value={profileUrl} disabled className="flex-1 bg-slate-50" />
                    <Button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-700">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider>
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
              <p className="text-sm text-slate-600">Welcome back, {username}!</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView("dashboard")} isActive={activeView === "dashboard"}>
                      <TrendingUp className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView("profile")} isActive={activeView === "profile"}>
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Your Stores</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mockStores.map((store) => (
                    <SidebarMenuItem key={store.id}>
                      <SidebarMenuButton
                        onClick={() => setSelectedStore(store.id)}
                        isActive={selectedStore === store.id}
                      >
                        <Store className="h-4 w-4" />
                        <span>{store.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {store.products}
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => router.push('/dashboard/add-store')}>
                      <Plus className="h-4 w-4" />
                      <span>Add Store</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {activeView === "dashboard" ? "Dashboard Overview" : "Profile Settings"}
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{renderDashboardContent()}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default Dashboard
