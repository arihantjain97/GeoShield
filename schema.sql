/* 
Represents every asset tracked in the system. 
Used by:
	•	Devices List page
	•	Device count (Dashboard)
	•	Dashboard side panel (device details)
*/

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('VEHICLE', 'PERSONNEL', 'CONTAINER', 'ASSET')),
    status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Inactive',
    phone_number TEXT UNIQUE NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW()
);

/* 
Holds live device signal & battery info.
Used by:
Device detail sidebar in Dashboard view
*/

CREATE TABLE device_status (
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    signal_strength TEXT,
    network_type TEXT,
    battery_level TEXT,
    connectivity_status TEXT CHECK (connectivity_status IN ('CONNECTED_DATA', 'DISCONNECTED')),
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (device_id)
);

/* 
Represents the last known location (area) of a device..
Used by:
	•	Map markers
	•	Geofence verification logic
	•	Device movement simulation
*/

CREATE TABLE device_location (
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    area_type TEXT CHECK (area_type IN ('CIRCLE')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    radius DOUBLE PRECISION,
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (device_id)
);

/* 
User-defined geofence areas (both circle and polygon).
*/
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    active BOOLEAN DEFAULT TRUE,
    geofence_type TEXT CHECK (geofence_type IN ('CIRCLE', 'POLYGON')) NOT NULL
);

/* 
Extra table for circular geofences (center + radius).
*/
CREATE TABLE geofence_circle (
    geofence_id UUID PRIMARY KEY REFERENCES geofences(id) ON DELETE CASCADE,
    center_latitude DOUBLE PRECISION,
    center_longitude DOUBLE PRECISION,
    radius DOUBLE PRECISION
);

/* 
Stores each vertex of polygon geofences.
Used by:
	•	Geofence creation modal
	•	Map overlay for geofences
*/
CREATE TABLE geofence_polygon (
    id SERIAL PRIMARY KEY,
    geofence_id UUID REFERENCES geofences(id) ON DELETE CASCADE,
    point_order INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);