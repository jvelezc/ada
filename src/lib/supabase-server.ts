import { createClient } from '@supabase/supabase-js';
import { LocationFormData, ApprovedLocation, PendingLocation } from '@/types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables');
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public',
  },
});

export async function fetchLocations(): Promise<ApprovedLocation[]> {
  try {
    const { data: locations, error } = await supabaseServer
      .from('locations')
      .select(`
        *,
        location_photos (
          id,
          url,
          storage_path
        )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    // Define the type for `location_photos`
    type LocationPhoto = {
      id: number;
      url: string;
      storage_path: string;
    };

    // Map the locations with proper type annotations
    return (
      locations?.map((location) => ({
        ...location,
        photos: (location.location_photos as LocationPhoto[])?.map((photo) => photo.url) || [],
      })) || []
    );
  } catch (error) {
    console.error('Error in fetchLocations:', error);
    throw error;
  }
}


export async function fetchLocationById(id: string): Promise<ApprovedLocation> {
  try {
    const { data: location, error } = await supabaseServer
      .from('locations')
      .select(`
        *,
        location_photos (
          id,
          url,
          storage_path
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!location) throw new Error('Location not found');

    // Define the type for location_photos
    type LocationPhoto = {
      id: number;
      url: string;
      storage_path: string;
    };

    return {
      ...location,
      photos: (location.location_photos as LocationPhoto[])?.map((photo) => photo.url) || [],
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}


export async function updateLocationById(id: string, data: LocationFormData): Promise<boolean> {
  try {
    // Remove any properties that shouldn't be in the update
    const { photos, location_photos, ...updateData } = data as any;

    const { error } = await supabaseServer
      .from('locations')
      .update(updateData)
      .eq('id', id)
      .eq('status', 'approved');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

export async function addLocation(data: LocationFormData): Promise<PendingLocation> {
  try {
    const { data: location, error } = await supabaseServer
      .from('pending_locations')
      .insert([{
        ...data,
        status: 'pending',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return location;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    // Create pending_locations table if it doesn't exist
    const { error: tableError } = await supabaseServer.rpc('init_database_schema');
    
    if (tableError) {
      console.error('Error initializing database schema:', tableError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}