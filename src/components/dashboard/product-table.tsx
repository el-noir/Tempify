"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Package } from 'lucide-react'
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./product-actions"

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

interface Store {
  id: string
  name: string
}

interface ProductTableProps {
  products: Product[]
  stores: Store[]
  selectedStore?: string | null
  title?: string
  description?: string
}

export function ProductTable({ 
  products, 
  stores, 
  selectedStore, 
  title = "All Products",
  description = "Manage your products across all stores"
}: ProductTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product =>
    product &&
    product.name &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedStore || product.storeId === selectedStore)
  )

  const getStoreName = (storeId: string) => {
    return stores.find(store => store.id === storeId)?.name || 'Unknown'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <ProductActions 
            storeId={selectedStore || undefined}
            onProductUpdate={() => window.location.reload()}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                {!selectedStore && <TableHead>Store</TableHead>}
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const productPrice = typeof product.price === 'number'
                    ? `$${product.price.toFixed(2)}`
                    : '$0.00'
                  
                  const quantityAvailable = typeof product.quantityAvailable === 'number'
                    ? product.quantityAvailable
                    : 0

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          src=""
                          alt={product.name || "Product image"}
                          width={64}
                          height={64}
                          className="aspect-square rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name || "Unnamed Product"}
                      </TableCell>
                      {!selectedStore && (
                        <TableCell>{getStoreName(product.storeId)}</TableCell>
                      )}
                      <TableCell>{productPrice}</TableCell>
                      <TableCell>{quantityAvailable}</TableCell>
                      <TableCell>
                        <Badge variant={quantityAvailable > 0 ? "default" : "secondary"}>
                          {quantityAvailable > 0 ? "active" : "inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ProductActions 
                          product={product} 
                          onProductUpdate={() => window.location.reload()} // You can make this more elegant with proper state management
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={selectedStore ? 6 : 7} className="text-center py-8">
                    {searchTerm ? (
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No products match your search criteria</p>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm('')}
                          className="text-indigo-600"
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No products found</p>
                        <Button 
                          onClick={() => router.push('/dashboard/add-product')}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first product
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
