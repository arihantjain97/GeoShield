-- Devices registered in the system
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('VEHICLE', 'PERSONNEL', 'CONTAINER', 'ASSET')),
    status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Inactive',
    phone_number TEXT UNIQUE NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Last known location of each device (circular area)
CREATE TABLE device_location (
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    area_type TEXT CHECK (area_type IN ('CIRCLE')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    radius DOUBLE PRECISION,
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (device_id)
);

-- Signal and connectivity status per device
CREATE TABLE device_status (
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    signal_strength TEXT,
    network_type TEXT,
    battery_level TEXT,
    connectivity_status TEXT CHECK (connectivity_status IN ('CONNECTED_DATA', 'DISCONNECTED')),
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (device_id)
);

-- User-defined geofences
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    active BOOLEAN DEFAULT TRUE,
    geofence_type TEXT CHECK (geofence_type IN ('CIRCLE', 'POLYGON')) NOT NULL
);

-- Geofence as a circle
CREATE TABLE geofence_circle (
    geofence_id UUID PRIMARY KEY REFERENCES geofences(id) ON DELETE CASCADE,
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL
);

-- Geofence as a polygon
CREATE TABLE geofence_polygon (
    id SERIAL PRIMARY KEY,
    geofence_id UUID REFERENCES geofences(id) ON DELETE CASCADE,
    point_order INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

-- Cell sectors (individual ECIs), each representing a unique sector of a gNodeB
CREATE TABLE cell_sectors (
    eci TEXT PRIMARY KEY,
    gnodeb_id TEXT NOT NULL,
    sector_id INTEGER NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    coverage_radius DOUBLE PRECISION NOT NULL,
    operator TEXT,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE (gnodeb_id, sector_id)
);

-- Mapping of geofences to cell sectors (ECIs)
CREATE TABLE geofence_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    geofence_id UUID REFERENCES geofences(id) ON DELETE CASCADE,
    eci TEXT REFERENCES cell_sectors(eci) ON DELETE CASCADE,
    validity TEXT CHECK (validity IN ('FULL', 'PARTIAL', 'NONE')) NOT NULL,
    checked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE device_geofences (
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  geofence_id UUID REFERENCES geofences(id) ON DELETE CASCADE,
  PRIMARY KEY (device_id, geofence_id)
);