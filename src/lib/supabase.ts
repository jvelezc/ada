'use client';

import { createClient } from '@supabase/supabase-js';
import { LocationData, LocationFormData } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function addLocation(data: LocationFormData) {
  try {
    const { data: location, error } = await supabase
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