// File: src/app/admin/edit/[id]/metadata.ts

import { supabase } from '@/lib/supabase-client';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('name')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return {
        title: 'Edit Location',
      };
    }

    return {
      title: `Edit Location: ${data.name}`,
    };
  } catch (err) {
    console.error('Unexpected error in generateMetadata:', err);
    return {
      title: 'Edit Location',
    };
  }
}
