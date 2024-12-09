import { supabaseServer } from './supabase-server';
import { LocationFormData } from '@/types';



export async function fetchPendingLocationById(id: string) {
  try {
    const { data: location, error } = await supabaseServer
      .from('pending_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!location) throw new Error('Pending location not found');

    return location;
  } catch (error) {
    console.error('Error fetching pending location:', error);
    throw error;
  }
}

export async function approvePendingLocation(id: string) {
  try {
    // Get the pending location data
    const { data: pendingLocation, error: fetchError } = await supabaseServer
      .from('pending_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !pendingLocation) {
      throw new Error('Pending location not found');
    }

    // Remove the id to let the database generate a new one
    const { id: _, ...locationData } = pendingLocation;

    // Insert into approved locations
    const { error: insertError } = await supabaseServer
      .from('locations')
      .insert([{
        ...locationData,
        status: 'approved',
        moderated_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error approving location:', insertError);
      throw new Error('Failed to approve location');
    }

    // Delete from pending locations
    const { error: deleteError } = await supabaseServer
      .from('pending_locations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting pending location:', deleteError);
      throw new Error('Failed to remove pending location');
    }

    return true;
  } catch (error) {
    console.error('Error in approvePendingLocation:', error);
    throw error;
  }
}

export async function rejectPendingLocation(id: string, reason: string) {
  try {
    const { error } = await supabaseServer
      .from('pending_locations')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        moderated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in rejectPendingLocation:', error);
    throw error;
  }
}