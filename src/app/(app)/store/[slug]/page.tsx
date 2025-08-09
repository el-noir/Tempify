'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination'
import SearchAndFilter from '@/components/SearchAndFilter'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
  createdAt: string
}

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  plan: {
    title: string
    durationHours: number
  }
  owner: {
    username: string
    name: string
  }
  expiresAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface StoreData {
  store: Store
  products: Product[]
  pagination: Pagination
}

export default function PublicStorePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string

  const [data, setData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Search and filter state
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')

  const currentPage = parseInt(searchParams.get('page') || '1')

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search,
        sortBy,
        sortOrder,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice })
      })

      const response = await fetch(`/api/public-store/${slug}?${params}`)
      const result = await response.json()

      if (!result.success) {
        setError(result.message)
        return
      }

      setData(result)
    } catch (err) {
      setError('Failed to load store data')
      console.error('Error fetching store data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoreData()
  }, [slug, currentPage, search, minPrice, maxPrice, sortBy, sortOrder])

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

    router.push(`/store/${slug}?${newSearchParams.toString()}`)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateSearchParams({ search: value })
  }

  const handlePriceFilter = () => {
    updateSearchParams({ minPrice, maxPrice })
  }

  const handleSort = (field: string, order: string) => {
    setSortBy(field)
    setSortOrder(order)
    updateSearchParams({ sortBy: field, sortOrder: order })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  const handleApplyFilters = () => {
    updateSearchParams({ minPrice, maxPrice })
  }

  const handleClearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('createdAt')
    setSortOrder('desc')
    updateSearchParams({ search: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortOrder: 'desc' })
  }

  const goToPage = (page: number) => {
    updateSearchParams({ page: page.toString() })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Store Not Found</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { store, products, pagination } = data

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Store Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{store.name}</h1>
              <p className="text-slate-600 mt-1">by @{store.owner.username}</p>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {store.plan.title}
            </Badge>
          </div>
          {store.description && (
            <p className="text-slate-700 text-base sm:text-lg">{store.description}</p>
          )}
        </div>

        {/* Search and Filter Bar */}
        <SearchAndFilter
          search={search}
          onSearchChange={handleSearch}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          className="mb-6"
        />

        {/* Products Count */}
        <div className="mb-4">
          <p className="text-slate-600 text-sm sm:text-base">
            Showing {products.length} of {pagination.totalCount} products
          </p>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <p className="text-slate-600 text-base sm:text-lg">No products found</p>
              <p className="text-slate-500 text-sm sm:text-base">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
          className="mt-6 sm:mt-8"
        />
      </div>
    </div>
  )
}


