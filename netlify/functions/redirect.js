// Netlify redirect function for short URL redirects
// This function proxies to the backend API
import config from '../../src/config/config.js';

exports.handler = async (event, context) => {
  // Extract the short code from the path
  const shortCode = event.path.replace('/.netlify/functions/redirect/', '');
  
  // Backend API URL from config
  const API_URL = config.API_URL;

  try {
    // Query backend for the original URL
    const response = await fetch(`${API_URL}/${shortCode}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        statusCode: 404,
        body: 'Short link not found',
      };
    }

    // Redirect to the original URL
    return {
      statusCode: 302,
      headers: {
        Location: data.data.original_url,
      },
      body: '',
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      statusCode: 500,
      body: 'Error processing redirect',
    };
  }
};