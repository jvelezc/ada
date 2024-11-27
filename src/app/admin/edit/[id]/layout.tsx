// File: src/app/admin/edit/[id]/layout.tsx


import { supabaseServer } from '@/lib/supabase-server';

export async function generateStaticParams() {
    try {
      const { data, error } = await supabaseServer
        .from('locations')
        .select('id');
  
      if (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
  
      return data.map((location) => ({
        id: location.id.toString(),
      }));
    } catch (err) {
      console.error('Unexpected error in generateStaticParams:', err);
      return [];
    }
  }

export default function EditLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
