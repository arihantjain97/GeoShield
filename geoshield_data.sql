INSERT INTO devices (id, name, type, status, phone_number, last_updated)
VALUES ('dd1b85cd-09c1-4e05-8947-1a63b91e1168', 'Armored Truck #1', 'VEHICLE', 'Active', '65912345678', '2025-05-27T01:27:44.697230');

INSERT INTO devices (id, name, type, status, phone_number, last_updated)
VALUES ('bb048418-d7cd-499c-b692-c9cc732cecea', 'Armored Truck #2', 'VEHICLE', 'Active', '65912345679', '2025-05-27T01:28:44.697493');

INSERT INTO devices (id, name, type, status, phone_number, last_updated)
VALUES ('41220c2d-5372-4b61-b586-7ac34411b294', 'Guard #1 Mobile', 'PERSONNEL', 'Active', '65912345680', '2025-05-27T01:29:44.697800');

INSERT INTO devices (id, name, type, status, phone_number, last_updated)
VALUES ('1ff968d1-8143-482a-8bde-8a369904569f', 'High-Value Container', 'CONTAINER', 'Active', '65912345681', '2025-05-27T01:30:44.697964');

INSERT INTO devices (id, name, type, status, phone_number, last_updated)
VALUES ('ae569016-b37e-4dc8-b92f-14223abd5e8d', 'Backup Tracker', 'ASSET', 'Inactive', '65912345682', '2025-05-27T01:29:44.698008');

INSERT INTO device_status (device_id, signal_strength, network_type, battery_level, connectivity_status, last_updated)
VALUES ('dd1b85cd-09c1-4e05-8947-1a63b91e1168', '-90 dBm', '5G', '61%', 'DISCONNECTED', '2025-05-27T01:27:44.697230');

INSERT INTO device_status (device_id, signal_strength, network_type, battery_level, connectivity_status, last_updated)
VALUES ('bb048418-d7cd-499c-b692-c9cc732cecea', 'N/A', '5G', '98%', 'DISCONNECTED', '2025-05-27T01:28:44.697493');

INSERT INTO device_status (device_id, signal_strength, network_type, battery_level, connectivity_status, last_updated)
VALUES ('41220c2d-5372-4b61-b586-7ac34411b294', '-90 dBm', 'Unknown', '68%', 'CONNECTED_DATA', '2025-05-27T01:29:44.697800');

INSERT INTO device_status (device_id, signal_strength, network_type, battery_level, connectivity_status, last_updated)
VALUES ('1ff968d1-8143-482a-8bde-8a369904569f', '-70 dBm', '5G', '93%', 'CONNECTED_DATA', '2025-05-27T01:30:44.697964');

INSERT INTO device_status (device_id, signal_strength, network_type, battery_level, connectivity_status, last_updated)
VALUES ('ae569016-b37e-4dc8-b92f-14223abd5e8d', 'N/A', '4G', '75%', 'DISCONNECTED', '2025-05-27T01:29:44.698008');

INSERT INTO device_location (device_id, area_type, latitude, longitude, radius, last_updated)
VALUES ('dd1b85cd-09c1-4e05-8947-1a63b91e1168', 'CIRCLE', 1.352083, 103.848488, 800, '2025-05-27T01:27:44.697230');

INSERT INTO device_location (device_id, area_type, latitude, longitude, radius, last_updated)
VALUES ('bb048418-d7cd-499c-b692-c9cc732cecea', 'CIRCLE', 1.360219, 103.845654, 800, '2025-05-27T01:28:44.697493');

INSERT INTO device_location (device_id, area_type, latitude, longitude, radius, last_updated)
VALUES ('41220c2d-5372-4b61-b586-7ac34411b294', 'CIRCLE', 1.293159, 103.84197, 800, '2025-05-27T01:29:44.697800');

INSERT INTO device_location (device_id, area_type, latitude, longitude, radius, last_updated)
VALUES ('1ff968d1-8143-482a-8bde-8a369904569f', 'CIRCLE', 1.300542, 103.802143, 800, '2025-05-27T01:30:44.697964');

INSERT INTO device_location (device_id, area_type, latitude, longitude, radius, last_updated)
VALUES ('ae569016-b37e-4dc8-b92f-14223abd5e8d', 'CIRCLE', 1.320243, 103.819839, 800, '2025-05-27T01:29:44.698008');