import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No location data provided' }),
      };
    }

    const { location } = JSON.parse(event.body);

    const { data, error } = await supabase
      .from('locations')
      .insert([
        {
          name: location.name,
          address: location.address,
          description: location.description,
          accessibility: location.accessibility,
          images: location.images,
          latitude: location.lat,
          longitude: location.lng,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' }),
    };
  }
};