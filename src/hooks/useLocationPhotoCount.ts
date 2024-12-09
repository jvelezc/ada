'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export function useLocationPhotoCount(locationId: number) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { count: photoCount, error: countError } = await supabase
        .from('location_photos')
        .select('*', { count: 'exact', head: true })
        .eq('location_id', locationId);

      if (countError) throw countError;
      setCount(photoCount || 0);
    } catch (err) {
      console.error('Error fetching photo count:', err);
      setError('Failed to load photo count');
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    error,
    refetch: fetchCount
  };
}