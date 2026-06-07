-- ============================================================================
-- Weather Intelligence Platform Database Schema
-- ============================================================================

-- Drop existing table
DROP TABLE IF EXISTS weather_records CASCADE;

-- Drop existing trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- Main Table
-- ============================================================================

CREATE TABLE weather_records (
    id BIGSERIAL PRIMARY KEY,

    -- Original user input
    location_input TEXT NOT NULL,

    -- Normalized location from geocoding/weather API
    normalized_location TEXT NOT NULL,

    country VARCHAR(100),

    region VARCHAR(100),

    latitude DECIMAL(9,6) NOT NULL,

    longitude DECIMAL(9,6) NOT NULL,

    -- User requested date range
    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    -- Weather snapshot

    temperature_c DECIMAL(5,2) NOT NULL,

    feels_like_c DECIMAL(5,2),

    condition VARCHAR(100) NOT NULL,

    humidity INTEGER,

    wind_kph DECIMAL(6,2),

    pressure_mb DECIMAL(7,2),

    visibility_km DECIMAL(7,2),

    icon_url TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================================
    -- Constraints
    -- ========================================================================

    CONSTRAINT chk_latitude
        CHECK (latitude BETWEEN -90 AND 90),

    CONSTRAINT chk_longitude
        CHECK (longitude BETWEEN -180 AND 180),

    CONSTRAINT chk_date_range
        CHECK (start_date <= end_date),

    CONSTRAINT chk_humidity
        CHECK (humidity BETWEEN 0 AND 100)
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_weather_records_location
ON weather_records(normalized_location);

CREATE INDEX idx_weather_records_created_at
ON weather_records(created_at DESC);

CREATE INDEX idx_weather_records_date_range
ON weather_records(start_date, end_date);

-- ============================================================================
-- Updated At Trigger Function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- ============================================================================
-- Trigger
-- ============================================================================

CREATE TRIGGER trg_weather_records_updated_at
BEFORE UPDATE
ON weather_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();