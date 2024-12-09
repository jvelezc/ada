-- Drop existing tables
DROP TABLE IF EXISTS public.location_photos CASCADE;
DROP TABLE IF EXISTS public.pending_locations CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;

-- Create locations table
CREATE TABLE public.locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    unit TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    status moderation_status DEFAULT 'approved',
    submitted_by TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMPTZ,
    moderated_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Create pending_locations table
CREATE TABLE public.pending_locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    unit TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    status moderation_status DEFAULT 'pending',
    submitted_by TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMPTZ,
    moderated_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Create location_photos table
CREATE TABLE public.location_photos (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_location
        FOREIGN KEY (location_id)
        REFERENCES public.locations(id)
        ON DELETE CASCADE
);