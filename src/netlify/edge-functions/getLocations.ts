import { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  try {
    const { results } = await context.db.prepare(
      'SELECT * FROM locations ORDER BY created_at DESC'
    ).all();

    return Response.json({ data: results });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/locations',
};