const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for server-side
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Extract the short code from the path
  const shortCode = event.path.replace('/.netlify/functions/redirect/', '');

  // Query Supabase for the original URL
  const { data, error } = await supabase
    .from('url_short')
    .select('original_url')
    .or(`short_url.eq.${shortCode},custom_url.eq.${shortCode}`)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: 'Short link not found',
    };
  }

  // Redirect to the original URL
  return {
    statusCode: 302,
    headers: {
      Location: data.original_url,
    },
    body: '',
  };
}; 