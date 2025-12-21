import { UAParser } from "ua-parser-js";
import { api } from "./supabase";
import API_URL from "./supabase";

/**
 * Get clicks for multiple URLs
 */
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) return [];
  
  const response = await api('/api/clicks/multiple', {
    method: 'POST',
    body: JSON.stringify({ urlIds })
  });

  return response.data;
}

/**
 * Get clicks for a single URL
 */
export async function getClicksForUrl(url_id) {
  const response = await api(`/api/clicks/${url_id}`);
  return response.data;
}

const parser = new UAParser();

/**
 * Store click and redirect
 */
export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.device?.type || "desktop";

    // Get location data
    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    // Record the click
    await fetch(`${API_URL}/api/clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urlId: id,
        city: city,
        country: country,
        device: device
      })
    });

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
    // Still redirect even if click tracking fails
    window.location.href = originalUrl;
  }
};