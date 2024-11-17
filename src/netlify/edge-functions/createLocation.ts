import { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  try {
    const { location } = await request.json();

    const result = await context.db.prepare(`
      INSERT INTO locations (
        name, address, description, accessibility, 
        images, latitude, longitude, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      location.name,
      location.address,
      location.description,
      location.accessibility,
      JSON.stringify(location.images),
      location.lat,
      location.lng,
      new Date().toISOString()
    ).run();

    return Response.json({ data: result });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/locations',
};