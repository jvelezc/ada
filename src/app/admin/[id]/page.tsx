// page.tsx
import { supabase } from '@/lib/supabase';
import EditLocationClient from './EditLocationClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('pending_locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error?.message || 'Location not found'}</p>
      </div>
    );
  }

  // Pass data to the client component
  return <EditLocationClient initialData={data} />;
}
