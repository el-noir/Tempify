'use client'

export const fetchUserStores = async () => {
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

export const fetchStoreProducts = async (storeId: string) => {
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
    const res = await fetch(`/api/store/my-stores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error updating store:', err);
    return null;
  }
}

export async function softDeleteStore(id: string) {
  try {
    const res = await fetch(`/api/store/my-stores/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error deleting store:', err);
    return null;
  }
}
