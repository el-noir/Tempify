'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, Users, Zap, ArrowRight, Star, ShoppingCart } from 'lucide-react'
import ProductCard, { Product } from '@/components/ProductCard'
import SearchAndFilter from '@/components/SearchAndFilter'
import Pagination from '@/components/Pagination'
import { useCart } from '@/contexts/CartContext'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchParams, setSearchParams] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { addItem } = useCart()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: searchParams.page.toString(),
        limit: pagination.limit.toString(),
        search: searchParams.search,
        sortBy: searchParams.sortBy,
        sortOrder: searchParams.sortOrder
      })
      
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice)
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice)

      const response = await fetch(`/api/public-products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const handleSearchChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }))
  }

  const handleMinPriceChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      minPrice: value,
      page: 1
    }))
  }

  const handleMaxPriceChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      maxPrice: value,
      page: 1
    }))
  }

  const handleSortChange = (field: string, order: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: order as 'asc' | 'desc',
      page: 1
    }))
  }

  const handleApplyFilters = () => {
    // Filters are already applied via individual handlers
  }

  const handleClearFilters = () => {
    setSearchParams({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1
    })
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page
    }))
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  const handleViewDetails = (product: Product) => {
    // Navigate to product detail page or store
    if (product.storeSlug) {
      window.open(`/store/${product.storeSlug}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-indigo-100">
              Shop from thousands of unique stores and find exactly what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/stores">
                <Button size="lg" variant="secondary" className="text-indigo-600 hover:text-indigo-700 w-full sm:w-auto">
                  <Store className="w-5 h-5 mr-2" />
                  Browse Stores
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto">
                  Create Your Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-6 sm:mb-8">
            <SearchAndFilter
              search={searchParams.search}
              onSearchChange={handleSearchChange}
              minPrice={searchParams.minPrice}
              onMinPriceChange={handleMinPriceChange}
              maxPrice={searchParams.maxPrice}
              onMaxPriceChange={handleMaxPriceChange}
              sortBy={searchParams.sortBy}
              sortOrder={searchParams.sortOrder}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              showPriceFilter={true}
              showViewToggle={true}
            />
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="text-slate-600 text-sm sm:text-base">
              {loading ? (
                'Loading products...'
              ) : (
                `Showing ${products.length} of ${pagination.totalCount} products`
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-slate-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2" />
                    <div className="h-3 bg-slate-200 rounded mb-2" />
                    <div className="h-6 bg-slate-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "space-y-4"
            }>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  showActions={true}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600 mb-4 text-sm sm:text-base">
                Try adjusting your search criteria or browse our stores.
              </p>
              <Link href="/stores">
                <Button variant="outline">
                  <Store className="w-4 h-4 mr-2" />
                  Browse Stores
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Want to Sell Your Products?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8">
              Create your own store and start selling to customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                  <Store className="w-4 h-4 mr-2" />
                  Create Your Store
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Stores
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
