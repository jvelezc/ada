'use client';

import { createClient } from '@supabase/supabase-js';
import { LocationData, LocationFormData } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'ada-accessibility'
    }
  }
});

export async function fetchLocations() {
  try {
    const { data, error } = await supabase
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

export async function initializeDatabase() {
  try {
    const { error: schemaError } = await supabase.rpc('init_database_schema');
    if (schemaError) {
      console.error('Error initializing database schema:', schemaError);
    }
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export async function addLocation(data: LocationFormData) {
  try {
    let image_urls: string[] = [];
    if (data.photos && data.photos.length > 0) {
      for (const photo of data.photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `location-photos/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('locations')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('locations')
            .getPublicUrl(filePath);
          
          image_urls.push(publicUrl);
        }
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    const submittedBy = user?.email || 'anonymous';

    const locationData = {
      ...data,
      image_urls,
      submitted_by: submittedBy,
      status: 'pending'
    };

    const { data: location, error } = await supabase
      .from('pending_locations')
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return location;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
}

export async function updateLocation(id: number, updates: Partial<LocationData>) {
  try {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}