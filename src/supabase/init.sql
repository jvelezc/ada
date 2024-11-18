-- Drop existing objects safely
DROP FUNCTION IF EXISTS init_database_schema() CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS pending_locations CASCADE;
DROP TYPE IF EXISTS accessibility_level CASCADE;
DROP TYPE IF EXISTS moderation_status CASCADE;
DROP TYPE IF EXISTS door_width CASCADE;
DROP TYPE IF EXISTS door_type CASCADE;
DROP TYPE IF EXISTS floor_type CASCADE;
DROP TYPE IF EXISTS parking_type CASCADE;

-- Create enum types
CREATE TYPE accessibility_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE door_width AS ENUM ('wide', 'standard', 'narrow');
CREATE TYPE door_type AS ENUM ('automatic', 'manual_easy', 'manual_heavy');
CREATE TYPE floor_type AS ENUM ('smooth', 'carpet', 'uneven');
CREATE TYPE parking_type AS ENUM ('dedicated', 'street', 'none');

-- Create the pending_locations table for community submissions
CREATE TABLE IF NOT EXISTS pending_locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(512) NOT NULL,
    unit VARCHAR(50),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- Accessibility details
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    
    -- Entrance details
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    
    -- Doorway details
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    
    -- Interior details
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    
    -- Parking details
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    
    -- Restroom details
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    
    -- Service animal details
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    
    -- Media
    image_urls TEXT[],
    
    -- Moderation
    status moderation_status DEFAULT 'pending',
    submitted_by TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMPTZ,
    moderated_by TEXT,
    rejection_reason TEXT,
    
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Create the approved locations table
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(512) NOT NULL,
    unit VARCHAR(50),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- Accessibility details
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    
    -- Entrance details
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    
    -- Doorway details
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    
    -- Interior details
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    
    -- Parking details
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    
    -- Restroom details
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    
    -- Service animal details
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    
    -- Media
    image_urls TEXT[],
    
    -- Status and timestamps
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

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize database schema
CREATE OR REPLACE FUNCTION init_database_schema()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Add sample data if locations table is empty
    IF NOT EXISTS (SELECT 1 FROM locations LIMIT 1) THEN
        INSERT INTO locations (
            name,
            address,
            latitude,
            longitude,
            accessibility_level,
            description,
            has_steps,
            door_width,
            door_width_inches,
            door_type,
            floor_type,
            has_elevator,
            has_wide_pathways,
            status,
            moderated_at,
            moderated_by
        ) VALUES
        ('Central Park Visitor Center', '14 E 60th St, New York, NY 10022', 40.7829, -73.9654, 'high', 
         'Fully accessible visitor center with ramps and automatic doors', 
         false, 'wide', 36, 'automatic', 'smooth', true, true, true, 'approved', NOW(), 'system'),
        ('Metropolitan Museum', '1000 5th Ave, New York, NY 10028', 40.7794, -73.9632, 'medium', 
         'Accessible through side entrance with assistance', 
         true, 'standard', 32, 'manual_easy', 'smooth', true, true, false, 'approved', NOW(), 'system'),
        ('Bryant Park', '42nd St &, 6th Ave, New York, NY 10018', 40.7536, -73.9832, 'high', 
         'Level pathways throughout with accessible facilities', 
         false, 'wide', 42, 'automatic', 'smooth', true, true, true, 'approved', NOW(), 'system');
    END IF;
END;
$$;