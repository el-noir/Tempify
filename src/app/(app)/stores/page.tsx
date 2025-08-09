'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Store, Package, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from '@/components/Pagination'
import SearchAndFilter from '@/components/SearchAndFilter'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  productCount: number
  totalValue: number
  plan: {
    title: string
    durationHours: number
  }
  owner: {
    username: string
    name: string
  }
  expiresAt: string
  createdAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface StoresData {
  stores: Store[]
  pagination: Pagination
}

export default function StoresPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [data, setData] = useState<StoresData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')

  const currentPage = parseInt(searchParams.get('page') || '1')

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search,
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/public-store?${params}`)
      const result = await response.json()

      if (!result.success) {
        setError(result.message)
        return
      }

      setData(result)
    } catch (err) {
      setError('Failed to load stores')
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [currentPage, search, sortBy, sortOrder])

  const updateSearchParams = (updates: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    // Reset to page 1 when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      newSearchParams.set('page', '1')
    }

    router.push(`/stores?${newSearchParams.toString()}`)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateSearchParams({ search: value })
  }

  const handleSort = (field: string, order: string) => {
    setSortBy(field)
    setSortOrder(order)
    updateSearchParams({ sortBy: field, sortOrder: order })
  }

  const handleApplyFilters = () => {
    // No additional filters for stores page
  }

  const handleClearFilters = () => {
    setSearch('')
    setSortBy('createdAt')
    setSortOrder('desc')
    updateSearchParams({ search: '', sortBy: 'createdAt', sortOrder: 'desc' })
  }

  const goToPage = (page: number) => {
    updateSearchParams({ page: page.toString() })
  }

  const handleStoreClick = (store: Store) => {
    router.push(`/store/${store.slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Stores</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { stores, pagination } = data

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover Stores</h1>
          <p className="text-slate-600">Find amazing products from our community of sellers</p>
        </div>

        {/* Search and Filter Bar */}
        <SearchAndFilter
          search={search}
          onSearchChange={handleSearch}
          minPrice=""
          onMinPriceChange={() => {}}
          maxPrice=""
          onMaxPriceChange={() => {}}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          viewMode="grid"
          onViewModeChange={() => {}}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          className="mb-6"
          showPriceFilter={false}
          showViewToggle={false}
        />

        {/* Stores Count */}
        <div className="mb-4">
          <p className="text-slate-600">
            Showing {stores.length} of {pagination.totalCount} stores
          </p>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-2">No stores found</p>
              <p className="text-slate-500">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} onClick={() => handleStoreClick(store)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
          className="mt-8"
        />
      </div>
    </div>
  )
}

interface StoreCardProps {
  store: Store
  onClick: () => void
}

function StoreCard({ store, onClick }: StoreCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {store.name}
            </h3>
            <p className="text-slate-600 text-sm">by @{store.owner.username}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {store.plan.title}
          </Badge>
        </div>

        {store.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {store.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Package className="w-4 h-4" />
            <span>{store.productCount} products</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(store.totalValue)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(store.createdAt)}</span>
          </div>
          <span>Expires {formatDate(store.expiresAt)}</span>
        </div>
      </div>
    </Card>
  )
}
