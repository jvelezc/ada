export interface LocationData {
  id?: number;
  name: string;
  address: string;
  unit?: string;
  latitude: number;
  longitude: number;
  accessibility_level?: 'high' | 'medium' | 'low';
  accessibility_status_unknown?: boolean;
  description?: string;
  has_steps?: boolean;
  has_restroom?: boolean;
  is_restroom_accessible?: boolean;
  is_dog_friendly?:boolean;
  step_status_unknown?: boolean;
  step_description?: string;
  door_width?: 'wide' | 'standard' | 'narrow';
  door_width_inches?: number;
  door_type?: 'automatic' | 'manual_easy' | 'manual_heavy';
  doorway_notes?: string;
  has_elevator?: boolean;
  has_wide_pathways?: boolean;
  floor_type?: 'smooth' | 'carpet' | 'uneven';
  interior_notes?: string;
  status?: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  submitted_at?: string;
}

export interface LocationFormData {
  name: string;
  address: string;
  unit?: string;
  latitude: number;
  longitude: number;
  accessibility_level?: 'high' | 'medium' | 'low';
  accessibility_status_unknown?: boolean;
  description?: string;
  has_steps?: boolean;
  step_status_unknown?: boolean;
  step_description?: string;
  door_width?: 'wide' | 'standard' | 'narrow';
  door_width_inches?: number;
  door_type?: 'automatic' | 'manual_easy' | 'manual_heavy';
  doorway_notes?: string;
  has_elevator?: boolean;
  has_wide_pathways?: boolean;
  floor_type?: 'smooth' | 'carpet' | 'uneven';
  interior_notes?: string;
}