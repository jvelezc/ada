'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Plus } from 'lucide-react';
import AccessibilityLegend from '@/components/AccessibilityLegend';
import AddLocationDialog from '@/components/AddLocationDialog';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full animate-pulse bg-gray-200"></div>
  ),
});

export default function Home() {
  const [showAddLocation, setShowAddLocation] = useState(false);

  return (
    <main className="relative h-screen w-full">
      <div className="absolute left-4 right-4 top-4 z-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for places..."
            className="pl-8"
          />
        </div>
        <Button onClick={() => setShowAddLocation(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>
      
      <Map />
      
      <AccessibilityLegend className="absolute bottom-4 right-4 z-10" />
      <AddLocationDialog 
        open={showAddLocation} 
        onOpenChange={setShowAddLocation}
      />
    </main>
  );
}