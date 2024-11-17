import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' }),
      };
    }

    const store = getStore('location-images');
    const key = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const { url } = await store.set(key, event.body, {
      access: 'public',
      type: 'image/jpeg', // Adjust based on actual file type
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' }),
    };
  }
};