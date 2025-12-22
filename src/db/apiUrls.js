import { api } from "./supabase";
import API_URL from "./supabase";

/**
 * Get all URLs for user with pagination and search
 * @param {Object} _ - ignored (useFetch options)
 * @param {Object} params - { page, limit, search }
 */
export async function getUrls(_, { page = 1, limit = 10, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  
  const response = await api(`/api/urls?${params.toString()}`);
  return response;
}

/**
 * Get a single URL
 */
export async function getUrl({ id }) {
  const response = await api(`/api/urls/${id}`);
  return response.data;
}

/**
 * Get long URL for redirect (public)
 */
export async function getLongUrl(shortCode) {
  try {
    const response = await fetch(`${API_URL}/api/lookup/${shortCode}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching long URL:", error);
    return null;
  }
}

/**
 * Create a new short URL
 */
export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('longUrl', longUrl);
  if (customUrl) {
    formData.append('customUrl', customUrl);
  }
  if (qrcode) {
    formData.append('qrCode', qrcode, 'qr.png');
  }

  const response = await api('/api/urls', {
    method: 'POST',
    body: formData
  });

  return response.data;
}

/**
 * Delete a URL
 */
export async function deleteUrl(id) {
  const response = await api(`/api/urls/${id}`, {
    method: 'DELETE'
  });
  return response;
}