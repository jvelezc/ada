'use client';

import { createClient } from '@supabase/supabase-js';
import { LocationData, LocationFormData } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function initializeDatabase() {
  try {
    const { error: bucketError } = await supabase.storage.createBucket('locations', {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Error creating storage bucket:', bucketError);
    }

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

export async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
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
      name: data.name,
      address: data.address,
      unit: data.unit,
      latitude: data.latitude,
      longitude: data.longitude,
      accessibility_level: data.accessibility_level,
      accessibility_status_unknown: data.accessibility_status_unknown,
      description: data.description,
      has_steps: data.has_steps,
      step_status_unknown: data.step_status_unknown,
      step_description: data.step_description,
      door_width: data.door_width,
      door_width_inches: data.door_width_inches,
      door_type: data.door_type,
      doorway_notes: data.doorway_notes,
      has_elevator: data.has_elevator,
      has_wide_pathways: data.has_wide_pathways,
      floor_type: data.floor_type,
      interior_notes: data.interior_notes,
      has_accessible_parking: data.has_accessible_parking,
      parking_type: data.parking_type,
      parking_status_unknown: data.parking_status_unknown,
      has_loading_zone: data.has_loading_zone,
      parking_notes: data.parking_notes,
      has_restroom: data.has_restroom,
      restroom_unknown: data.restroom_unknown,
      is_restroom_accessible: data.is_restroom_accessible,
      restroom_status_unknown: data.restroom_status_unknown,
      restroom_notes: data.restroom_notes,
      is_dog_friendly: data.is_dog_friendly,
      dog_friendly_unknown: data.dog_friendly_unknown,
      dog_friendly_status_unknown: data.dog_friendly_status_unknown,
      dog_features: data.dog_features,
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
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}