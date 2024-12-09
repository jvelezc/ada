import { supabaseServer } from './supabase-server';
import { PendingLocation } from '@/types';

export async function approveLocation(pendingLocation: PendingLocation) {
  try {
    // Remove the id and status to let the database generate a new id
    const {
      id: _,
      status: __,
      created_at: ___,
      updated_at: ____,
      ...locationData
    } = pendingLocation;

    // Insert into approved locations
    const { data: approvedLocation, error: insertError } = await supabaseServer
      .from('locations')
      .insert([{
        ...locationData,
        status: 'approved',
        moderated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting approved location:', insertError);
      throw new Error('Failed to create approved location');
    }

    // Delete from pending locations
    const { error: deleteError } = await supabaseServer
      .from('pending_locations')
      .delete()
      .eq('id', pendingLocation.id);

    if (deleteError) {
      console.error('Error deleting pending location:', deleteError);
      // Try to rollback the approved location
      await supabaseServer
        .from('locations')
        .delete()
        .eq('id', approvedLocation.id);
      throw new Error('Failed to remove pending location');
    }

    return approvedLocation;
  } catch (error) {
    console.error('Error in approveLocation:', error);
    throw error;
  }
}

export async function rejectLocation(id: number, reason: string) {
  try {
    const { error } = await supabaseServer
      .from('pending_locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting location:', error);
      throw new Error('Failed to reject location');
    }

    return true;
  } catch (error) {
    console.error('Error in rejectLocation:', error);
    throw error;
  }
}