export interface MapboxFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
    wikidata?: string;
  };
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  context?: Array<{
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }>;
  matching_text?: string;
  matching_place_name?: string;
  bbox?: [number, number, number, number]; // [west, south, east, north]
}

export interface MapboxSearchResponse {
  type: 'FeatureCollection';
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}

export interface MapboxError {
  message: string;
  code?: string;
}