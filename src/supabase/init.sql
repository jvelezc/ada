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

-- Create base table function
CREATE OR REPLACE FUNCTION create_locations_table(table_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(512) NOT NULL,
            unit VARCHAR(50),
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
            image_urls TEXT[],
            status moderation_status DEFAULT %L,
            submitted_by TEXT,
            submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            moderated_at TIMESTAMPTZ,
            moderated_by TEXT,
            rejection_reason TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT %I_valid_latitude CHECK (latitude BETWEEN -90 AND 90),
            CONSTRAINT %I_valid_longitude CHECK (longitude BETWEEN -180 AND 180)
        )',
        table_name,
        CASE 
            WHEN table_name = 'locations' THEN 'approved'::moderation_status
            ELSE 'pending'::moderation_status
        END,
        table_name,
        table_name
    );
END;
$$;

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create both tables
SELECT create_locations_table('locations');
SELECT create_locations_table('pending_locations');

-- Create triggers for both tables
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pending_locations_updated_at
    BEFORE UPDATE ON pending_locations
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
            has_accessible_parking,
            parking_type,
            has_restroom,
            is_restroom_accessible,
            is_dog_friendly,
            status,
            submitted_by,
            submitted_at
        ) VALUES (
            'Central Park Visitor Center',
            '14 E 60th St, New York, NY 10022',
            40.7829,
            -73.9654,
            'high',
            'Fully accessible visitor center with ramps and automatic doors',
            false,
            'wide',
            36,
            'automatic',
            'smooth',
            true,
            true,
            true,
            'dedicated',
            true,
            true,
            true,
            'approved',
            'system',
            NOW()
        ), (
            'Metropolitan Museum',
            '1000 5th Ave, New York, NY 10028',
            40.7794,
            -73.9632,
            'medium',
            'Accessible through side entrance with assistance',
            true,
            'standard',
            32,
            'manual_easy',
            'smooth',
            true,
            true,
            true,
            'street',
            true,
            true,
            true,
            'approved',
            'system',
            NOW()
        ), (
            'Bryant Park',
            '42nd St &, 6th Ave, New York, NY 10018',
            40.7536,
            -73.9832,
            'high',
            'Level pathways throughout with accessible facilities',
            false,
            'wide',
            42,
            'automatic',
            'smooth',
            true,
            true,
            true,
            'dedicated',
            true,
            true,
            true,
            'approved',
            'system',
            NOW()
        );
    END IF;
END;
$$;