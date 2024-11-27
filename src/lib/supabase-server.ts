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
    const { data, error } = await supabaseServer
      .from('locations')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

// Function to fetch a single location by ID
export async function fetchLocationById(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw new Error('Failed to fetch location');
  }
}

// Function to update a location by ID
export async function updateLocationById(id: string, data: LocationFormData) {
  try {
    const { error } = await supabaseServer
      .from('locations')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error('Failed to update location');
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
