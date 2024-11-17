'use client';

import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { MapPin, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddLocationDialog from './AddLocationDialog';
import useSWR from 'swr';
import 'mapbox-gl/dist/mapbox-gl.css';

type Location = {
  id: string;
  name: string;
  address: string;
  description?: string;
  accessibility: 'full' | 'partial' | 'none' | 'unknown';
  images: string[];
  latitude: number;
  longitude: number;
  created_at: string;
};

export const accessibilityConfig = {
  full: {
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    label: 'Fully Accessible',
    description: 'Complete wheelchair access',
  },
  partial: {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    label: 'Partially Accessible',
    description: 'Limited wheelchair access',
  },
  none: {
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    label: 'Not Accessible',
    description: 'No wheelchair access',
  },
  unknown: {
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-500',
    label: 'Unknown',
    description: 'Accessibility status unknown',
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MapComponent() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 40.7527,
    longitude: -73.9772,
    zoom: 13
  });

  const { data: locations, error } = useSWR<{ data: Location[] }>('/api/locations', fetcher);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Mapbox token is not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.lngLat;
    setClickedLocation({ lat, lng });
    setShowAddLocation(true);
  };

  return (
    <>
      {mapError && (
        <Alert variant="destructive" className="absolute left-4 right-4 top-20 z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mapError}</AlertDescription>
        </Alert>
      )}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onError={(e) => setMapError('Failed to load map. Please try again later.')}
      >
        {locations?.data?.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedLocation(location);
            }}
          >
            <div className={cn(
              'group relative cursor-pointer transition-all hover:scale-110',
              accessibilityConfig[location.accessibility].bgColor,
              accessibilityConfig[location.accessibility].borderColor,
              'rounded-full p-1 border-2'
            )}>
              <MapPin className={cn(
                'h-6 w-6',
                accessibilityConfig[location.accessibility].color
              )} />
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                {location.name} - {accessibilityConfig[location.accessibility].label}
              </div>
            </div>
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            anchor="bottom"
            onClose={() => setSelectedLocation(null)}
            className="z-50 max-w-sm"
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedLocation.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
              <Badge className={cn(
                'mt-1',
                accessibilityConfig[selectedLocation.accessibility].bgColor,
                accessibilityConfig[selectedLocation.accessibility].color,
                'border',
                accessibilityConfig[selectedLocation.accessibility].borderColor
              )}>
                {accessibilityConfig[selectedLocation.accessibility].label}
              </Badge>
              <p className="mt-2 text-sm">
                {selectedLocation.description || accessibilityConfig[selectedLocation.accessibility].description}
              </p>
              {selectedLocation.images?.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {selectedLocation.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${selectedLocation.name} - Image ${index + 1}`}
                      className="h-20 w-full rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      <AddLocationDialog
        open={showAddLocation}
        onOpenChange={setShowAddLocation}
        currentLocation={clickedLocation || undefined}
      />
    </>
  );
}