import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye } from 'lucide-react'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
  createdAt: string
  storeId?: string
  storeName?: string
  storeSlug?: string
}

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
  showActions?: boolean
  onViewDetails?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  className?: string
}

export default function ProductCard({ 
  product, 
  viewMode = 'grid', 
  showActions = true,
  onViewDetails,
  onAddToCart,
  className = ""
}: ProductCardProps) {
  const isOutOfStock = product.quantityAvailable !== undefined && product.quantityAvailable <= 0

  if (viewMode === 'list') {
    return (
      <Card className={`flex flex-col sm:flex-row ${className}`}>
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none flex items-center justify-center">
              <span className="text-slate-400 text-sm">No image</span>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{product.name}</h3>
              {product.storeName && (
                <p className="text-sm text-slate-500 mb-1">by {product.storeName}</p>
              )}
              {product.description && (
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center gap-2 mb-2">
                {product.quantityAvailable !== undefined && (
                  <Badge variant={isOutOfStock ? "secondary" : "default"} className="text-xs">
                    {isOutOfStock ? 'Out of Stock' : `${product.quantityAvailable} available`}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-col sm:text-right gap-3 sm:gap-2">
              <p className="text-xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </p>
              {showActions && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {onViewDetails && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(product)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  )}
                  {onAddToCart && !isOutOfStock && (
                    <Button 
                      size="sm"
                      onClick={() => onAddToCart(product)}
                      disabled={isOutOfStock}
                      className="w-full sm:w-auto"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-square relative group">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400">No image</span>
          </div>
        )}
        
        {/* Overlay with actions */}
        {showActions && (onViewDetails || onAddToCart) && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex flex-col sm:flex-row gap-2">
              {onViewDetails && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onViewDetails(product)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              )}
              {onAddToCart && !isOutOfStock && (
                <Button 
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
        {product.storeName && (
          <p className="text-sm text-slate-500 mb-1">by {product.storeName}</p>
        )}
        {product.description && (
          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          {product.quantityAvailable !== undefined && (
            <Badge variant={isOutOfStock ? "secondary" : "default"} className="text-xs">
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
