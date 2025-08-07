'use client'

import type { Store, Product } from '@/types/Store'

export const fetchUserStores = async (): Promise<Store[]> => {
  try {
    const res = await fetch('/api/store/my-stores', {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    const data = await res.json();
    return data.stores || [];
  } catch (err) {
    console.error('Error fetching user stores:', err);
    return [];
  }
}

export const fetchStoreProducts = async (storeId: string): Promise<Product[]> => {
  try {
    const res = await fetch(`/api/store/${storeId}/products`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('Error fetching store products:', err);
    return [];
  }
}

export const createProduct = async (storeId: string, productData: {
  name: string
  description?: string
  price: number
  imageUrl?: string
  quantityAvailable?: number
}) => {
  try {
    const res = await fetch(`/api/product/create/${storeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating product:', err);
    return null;
  }
}

export const createStore = async (storeData: {
  name: string
  description?: string
  slug: string
}) => {
  try {
    const res = await fetch('/api/store/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(storeData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating store:', err);
    return null;
  }
}

export const updateProduct = async (productId: string, productData: {
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  quantityAvailable?: number
}) => {
  try {
    const res = await fetch(`/api/product/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error updating product:', err);
    return null;
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    const res = await fetch(`/api/product/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error deleting product:', err);
    return null;
  }
}

export const fetchProduct = async (productId: string) => {
  try {
    const res = await fetch(`/api/product/${productId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export async function updateStore(id: string, payload: { name?: string; description?: string }) {
  try {
    console.log('Updating store with ID:', id);
    const res = await fetch(`/api/store/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('Update response:', data);
    return data;
  } catch (err) {
    console.error('Error updating store:', err);
    return null;
  }
}

export async function softDeleteStore(id: string) {
  try {
    console.log('Deleting store with ID:', id);
    const res = await fetch(`/api/store/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    console.log('Delete response:', data);
    return data;
  } catch (err) {
    console.error('Error deleting store:', err);
    return null;
  }
}
