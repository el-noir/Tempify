'use client'

import axios from 'axios'

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