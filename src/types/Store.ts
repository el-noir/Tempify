export interface StoreClient {
  id: string
  ownerId: string
  planId: string
  name: string
  slug: string
  description?: string
  products: string[]
  isActive: boolean
  extendedHours?: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}