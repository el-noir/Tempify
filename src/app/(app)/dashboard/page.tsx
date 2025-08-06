"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { fetchUserStores, fetchStoreProducts, updateStore, softDeleteStore } from "@/lib/api/store"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { StoreTable } from "@/components/dashboard/store-table"
import { ProductTable } from "@/components/dashboard/product-table"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { EditStoreDialog } from "@/components/dashboard/edit-store-dialog"

// Define Product type
interface Product {
  id: string
  storeId: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
  createdAt: string
  updatedAt: string
}

// Define Store type
interface Store {
  id: string
  ownerId: string
  planId: string
  name: string
  slug: string
  description?: string
  products: Product[]
  isActive: boolean
  extendedHours?: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

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
  const [stores, setStores] = useState<Store[]>([])
  const [storeProducts, setStoreProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [editStore, setEditStore] = useState<Store | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      const loadStores = async () => {
        setIsLoading(true)
        const fetchedStores = await fetchUserStores()
        setStores(fetchedStores || [])
        setIsLoading(false)
      }
      loadStores()
    }
  }, [status])

  // Fetch products when a store is selected
  useEffect(() => {
    if (selectedStore && activeView === "store") {
      const loadStoreProducts = async () => {
        setIsLoadingProducts(true)
        const products = await fetchStoreProducts(selectedStore)
        setStoreProducts(products)
        setIsLoadingProducts(false)
      }
      loadStoreProducts()
    }
  }, [selectedStore, activeView])

  const handleEditStore = (store: Store) => {
    setEditStore(store)
  }

  const handleUpdateStore = async (name: string, description: string) => {
    if (!editStore) return

    const payload = {
      name,
      description: description || undefined,
    }

    const result = await updateStore(editStore.id, payload)
    if (result?.success) {
      setStores(stores.map(s => s.id === editStore.id ? { ...s, ...payload } : s))
      setEditStore(null)
      toast.success("Store updated successfully!")
    } else {
      toast.error("Failed to update store")
    }
  }

  const handleDeleteStore = async (id: string) => {
    const result = await softDeleteStore(id)
    if (result?.success) {
      setStores(stores.filter(s => s.id !== id))
      if (selectedStore === id) {
        setSelectedStore(null)
        setActiveView("dashboard")
      }
      toast.success("Store deleted successfully!")
    } else {
      toast.error("Failed to delete store")
    }
  }

  const getAllProducts = () => {
    return stores.flatMap(store => store.products || [])
  }

  const getSelectedStoreName = () => {
    return stores.find(store => store.id === selectedStore)?.name || "Store"
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

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

  const renderContent = () => {
    if (activeView === "dashboard") {
      return (
        <div className="space-y-6">
          <DashboardStats stores={stores} />
          <StoreTable 
            stores={stores}
            onEditStore={handleEditStore}
            onDeleteStore={handleDeleteStore}
          />
          {/* Only show ProductTable when no specific store is selected */}
          <ProductTable 
            products={getAllProducts()}
            stores={stores}
            title="All Products"
            description="Manage your products across all stores"
          />
        </div>
      )
    }

    if (activeView === "profile") {
      return <ProfileSection session={session} username={username} />
    }

    if (activeView === "store" && selectedStore) {
      return (
        <div className="space-y-6">
          <DashboardStats stores={stores.filter(s => s.id === selectedStore)} />
          {/* Don't show StoreTable when a specific store is active */}
          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading products...</span>
            </div>
          ) : (
            <ProductTable 
              products={storeProducts}
              stores={stores}
              selectedStore={selectedStore}
              title={`${getSelectedStoreName()} Products`}
              description={`Manage products for ${getSelectedStoreName()}`}
            />
          )}
        </div>
      )
    }

    return null
  }

  const getHeaderTitle = () => {
    if (activeView === "dashboard") return "Dashboard Overview"
    if (activeView === "profile") return "Profile Settings"
    if (activeView === "store" && selectedStore) return `${getSelectedStoreName()} - Store Management`
    return "Dashboard"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider>
        <AppSidebar
          username={username}
          activeView={activeView}
          setActiveView={setActiveView}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          stores={stores}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {getHeaderTitle()}
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {renderContent()}
          </div>
        </SidebarInset>

        <EditStoreDialog
          store={editStore}
          isOpen={!!editStore}
          onClose={() => setEditStore(null)}
          onSave={handleUpdateStore}
        />
      </SidebarProvider>
    </div>
  )
}

export default Dashboard
