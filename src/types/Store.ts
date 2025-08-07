import { Types } from 'mongoose'

export interface Product {
  id: string
  _id?: string | Types.ObjectId
  storeId: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
  createdAt: string
  updatedAt: string
}

export interface StorePlan {
  _id: string | Types.ObjectId
  title: string
  durationHours: number
  basePrice: number
  discountPercentage?: number
  finalPrice: number
  commissionPercentage: number
}

export interface Store {
  id: string
  _id?: string | Types.ObjectId
  ownerId: string | Types.ObjectId
  planId: string | Types.ObjectId | StorePlan
  name: string
  slug: string
  description?: string
  products: (string | Types.ObjectId | Product)[]
  isActive: boolean
  extendedHours?: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface StoreResponse {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  planId: StorePlan
  name: string
  slug: string
  description?: string
  products: Types.ObjectId[]
  isActive: boolean
  extendedHours?: number
  expiresAt: string
  createdAt: string
  updatedAt: string
  __v: number
}
