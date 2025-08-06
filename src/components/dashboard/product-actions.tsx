"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { createProduct, updateProduct, deleteProduct } from "@/lib/api/store"

interface Product {
  id: string
  storeId: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
}

interface ProductActionsProps {
  product?: Product
  storeId?: string
  onProductUpdate: () => void
}

export function ProductActions({ product, storeId, onProductUpdate }: ProductActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    quantityAvailable: product?.quantityAvailable || 0
  })

  const handleEdit = () => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl || '',
        quantityAvailable: product.quantityAvailable || 0
      })
      setIsEditOpen(true)
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      quantityAvailable: 0
    })
    setIsCreateOpen(true)
  }

  const handleSave = async () => {
    try {
      let result
      if (product) {
        // Update existing product
        result = await updateProduct(product.id, formData)
      } else if (storeId) {
        // Create new product
        result = await createProduct(storeId, formData)
      }

      if (result?.success) {
        toast.success(product ? "Product updated successfully!" : "Product created successfully!")
        setIsEditOpen(false)
        setIsCreateOpen(false)
        onProductUpdate()
      } else {
        toast.error(result?.message || "Operation failed")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleDelete = async () => {
    if (!product) return
    
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(product.id)
      if (result?.success) {
        toast.success("Product deleted successfully!")
        onProductUpdate()
      } else {
        toast.error("Failed to delete product")
      }
    }
  }

  // If this is for creating a new product
  if (!product && storeId) {
    return (
      <>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to your store.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity Available</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantityAvailable}
                  onChange={(e) => setFormData({...formData, quantityAvailable: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Create Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // If this is for an existing product
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Eye className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{product?.description || 'No description'}</p>
            </div>
            <div>
              <Label>Price</Label>
              <p className="text-sm">${product?.price.toFixed(2)}</p>
            </div>
            <div>
              <Label>Quantity Available</Label>
              <p className="text-sm">{product?.quantityAvailable || 0}</p>
            </div>
            {product?.imageUrl && (
              <div>
                <Label>Image</Label>
                <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">Quantity Available</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantityAvailable}
                onChange={(e) => setFormData({...formData, quantityAvailable: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
