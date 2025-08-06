"use client"

import { Store, User, TrendingUp, Plus } from 'lucide-react'
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface Store {
  id: string
  name: string
  products?: any[]
  isActive: boolean
}

interface AppSidebarProps {
  username: string
  activeView: string
  setActiveView: (view: string) => void
  selectedStore: string | null
  setSelectedStore: (storeId: string | null) => void
  stores: Store[]
}

export function AppSidebar({
  username,
  activeView,
  setActiveView,
  selectedStore,
  setSelectedStore,
  stores
}: AppSidebarProps) {
  const router = useRouter()

  const handleStoreClick = (storeId: string) => {
    setSelectedStore(storeId)
    setActiveView("store") // Set view to store when a store is selected
  }

  return (
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
                <SidebarMenuButton 
                  onClick={() => {
                    setActiveView("dashboard")
                    setSelectedStore(null)
                  }} 
                  isActive={activeView === "dashboard"}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => {
                    setActiveView("profile")
                    setSelectedStore(null)
                  }} 
                  isActive={activeView === "profile"}
                >
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
              {stores.map((store) => (
                <SidebarMenuItem key={store.id}>
                  <SidebarMenuButton
                    onClick={() => handleStoreClick(store.id)}
                    isActive={selectedStore === store.id && activeView === "store"}
                  >
                    <Store className="h-4 w-4" />
                    <span>{store.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {store.products?.length || 0}
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
  )
}
