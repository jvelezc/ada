import { MapboxFeature } from '@/types';

export async function searchAddress(query: string): Promise<MapboxFeature[]> {
  if (!query || query.length < 3) {
    return [];
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!mapboxToken) {
    throw new Error('Mapbox token is missing');
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
    `access_token=${mapboxToken}&` +
    'types=address,poi&' +
    'country=us,pr,as,gu,mp,vi&' +
    'limit=5'
  );

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return data.features || [];
}