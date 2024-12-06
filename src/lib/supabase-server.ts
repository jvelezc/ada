import { createClient } from '@supabase/supabase-js';
import { LocationFormData } from '@/types';

// Server-side Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables');
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public',
  },
});

// Function to add a new location
export async function addLocation(data: LocationFormData) {
  try {
    const { data: location, error } = await supabaseServer
      .from('pending_locations')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return location;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
}

// Function to fetch all approved locations
export async function fetchLocations() {
  try {
    const { data: approvedLocations, error } = await supabaseServer
      .from('locations')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return approvedLocations || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

// Function to fetch a single location by ID
export async function fetchLocationById(id: string) {
  try {
    // First try to find in approved locations
    const { data: approvedLocation, error: approvedError } = await supabaseServer
      .from('locations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (approvedError) throw approvedError;

    // If not found in approved locations, try pending locations
    if (!approvedLocation) {
      const { data: pendingLocation, error: pendingError } = await supabaseServer
        .from('pending_locations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (pendingError) throw pendingError;
      return pendingLocation;
    }

    return approvedLocation;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}

// Function to update a location by ID
export async function updateLocationById(id: string, data: LocationFormData) {
  try {
    // First try to update in approved locations
    const { error: approvedUpdateError } = await supabaseServer
      .from('locations')
      .update(data)
      .eq('id', id);

    if (approvedUpdateError) {
      // If not found in approved locations, try pending locations
      const { error: pendingUpdateError } = await supabaseServer
        .from('pending_locations')
        .update(data)
        .eq('id', id);

      if (pendingUpdateError) throw pendingUpdateError;
    }
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

// Function to initialize the database schema (optional)
export async function initializeDatabase() {
  try {
    const { error: schemaError } = await supabaseServer.rpc('init_database_schema');
    if (schemaError) {
      console.error('Error initializing database schema:', schemaError);
    }
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
