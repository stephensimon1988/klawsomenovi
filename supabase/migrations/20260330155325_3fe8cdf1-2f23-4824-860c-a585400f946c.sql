-- Clear existing seed data
DELETE FROM availability_slots;
DELETE FROM bookings;
DELETE FROM appointment_types;

-- Insert actual appointment types from Acuity
INSERT INTO appointment_types (id, name, description, duration_minutes, price, is_active) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Photography Rental For 1 Hour', 'Rent our facility for a photography session (1 hour - $49)', 60, 49.00, true),
  ('a1000001-0000-0000-0000-000000000002', 'Klawsome! Private Party', 'Includes 325 Klaw Machine Tokens, Exclusive Private Space, Tables and Seating, Ability to Bring Own Food.', 60, 250.00, true),
  ('a1000001-0000-0000-0000-000000000003', 'Klawsome! Semi-Private Party (Paris Baguette Table)', 'Includes 325 Klaw Machine Tokens, Table for 1 hour at Paris Baguette (Must Purchase Food from Paris Baguette, Contact us for more details at (248) 938-4093 or email events@klawsomenovi.com before booking)', 60, 250.00, true);

-- Photography Rental: Closed Monday, Tue-Sun 10:00am-11:00am
INSERT INTO availability_slots (appointment_type_id, day_of_week, start_time, end_time, is_active) VALUES
  ('a1000001-0000-0000-0000-000000000001', 0, '10:00:00', '11:00:00', true),
  ('a1000001-0000-0000-0000-000000000001', 2, '10:00:00', '11:00:00', true),
  ('a1000001-0000-0000-0000-000000000001', 3, '10:00:00', '11:00:00', true),
  ('a1000001-0000-0000-0000-000000000001', 4, '10:00:00', '11:00:00', true),
  ('a1000001-0000-0000-0000-000000000001', 5, '10:00:00', '11:00:00', true),
  ('a1000001-0000-0000-0000-000000000001', 6, '10:00:00', '11:00:00', true);

-- Klawsome! Private Party: All days 2:30pm-6:00pm
INSERT INTO availability_slots (appointment_type_id, day_of_week, start_time, end_time, is_active) VALUES
  ('a1000001-0000-0000-0000-000000000002', 0, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 1, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 2, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 3, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 4, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 5, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000002', 6, '14:30:00', '18:00:00', true);

-- Klawsome! Semi-Private Party: All days 2:30pm-6:00pm
INSERT INTO availability_slots (appointment_type_id, day_of_week, start_time, end_time, is_active) VALUES
  ('a1000001-0000-0000-0000-000000000003', 0, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 1, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 2, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 3, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 4, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 5, '14:30:00', '18:00:00', true),
  ('a1000001-0000-0000-0000-000000000003', 6, '14:30:00', '18:00:00', true);