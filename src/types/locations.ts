// Base location properties shared between all location types
interface BaseLocation {
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
  has_accessible_parking?: boolean;
  parking_type?: 'dedicated' | 'street' | 'none';
  parking_status_unknown?: boolean;
  has_loading_zone?: boolean;
  parking_notes?: string;
  has_restroom?: boolean;
  restroom_unknown?: boolean;
  is_restroom_accessible?: boolean;
  restroom_status_unknown?: boolean;
  restroom_notes?: string;
  is_dog_friendly?: boolean;
  dog_friendly_unknown?: boolean;
  dog_friendly_status_unknown?: boolean;
  dog_features?: string;
}

// Metadata fields added by the system
interface LocationMetadata {
  id?: number;
  submitted_by?: string;
  submitted_at?: string;
  moderated_at?: string;
  moderated_by?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

// Approved location with photos
export interface ApprovedLocation extends BaseLocation, LocationMetadata {
  id: number;
  status: 'approved';
  photos: string[];
  location_photos?: Array<{
    id: number;
    url: string;
    storage_path: string;
  }>;
}

// Pending location without photos
export interface PendingLocation extends BaseLocation, LocationMetadata {
  id: number;
  status: 'pending';
}

// Type guards
export function isApprovedLocation(location: LocationData): location is ApprovedLocation {
  return location.status === 'approved';
}

export function isPendingLocation(location: LocationData): location is PendingLocation {
  return location.status === 'pending';
}

// Union type for all location types
export type LocationData = ApprovedLocation | PendingLocation;

// Form data for creating/updating locations
export type LocationFormData = BaseLocation;

export type { BaseLocation };