import React, { useState } from 'react'
import { Search, Filter, Grid, List, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SearchAndFilterProps {
  search: string
  onSearchChange: (value: string) => void
  minPrice: string
  onMinPriceChange: (value: string) => void
  maxPrice: string
  onMaxPriceChange: (value: string) => void
  sortBy: string
  sortOrder: string
  onSortChange: (field: string, order: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onApplyFilters: () => void
  onClearFilters: () => void
  className?: string
  showViewToggle?: boolean
  showPriceFilter?: boolean
  showSort?: boolean
}

export default function SearchAndFilter({
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  onApplyFilters,
  onClearFilters,
  className = "",
  showViewToggle = true,
  showPriceFilter = true,
  showSort = true
}: SearchAndFilterProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)

  const hasActiveFilters = search || minPrice || maxPrice || sortBy !== 'createdAt' || sortOrder !== 'desc'

  const handleApplyFilters = () => {
    onMinPriceChange(localMinPrice)
    onMaxPriceChange(localMaxPrice)
    onApplyFilters()
  }

  const handleClearFilters = () => {
    onSearchChange('')
    onMinPriceChange('')
    onMaxPriceChange('')
    setLocalMinPrice('')
    setLocalMaxPrice('')
    onSortChange('createdAt', 'desc')
    onClearFilters()
  }

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    onSortChange(field, order)
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Price Filter */}
          {showPriceFilter && (
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Min price"
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-24"
              />
              <span className="text-slate-500">-</span>
              <Input
                placeholder="Max price"
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleApplyFilters} size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
            </div>
          )}

          {/* Sort */}
          {showSort && (
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* View Mode Toggle */}
          {showViewToggle && (
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="text-xs">
                Search: "{search}"
              </Badge>
            )}
            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="text-xs">
                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              </Badge>
            )}
            {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
              <Badge variant="secondary" className="text-xs">
                Sort: {sortBy} ({sortOrder})
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
