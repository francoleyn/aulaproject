-- Aula App Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/oyubcaiqgzgwheflpsra/sql)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  roomnum VARCHAR(50) NOT NULL,
  floornum VARCHAR(50),
  capacity INTEGER DEFAULT 0,
  status BOOLEAN DEFAULT true,
  bldg VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  roomid INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  roomnum VARCHAR(50),
  bldg VARCHAR(100),
  date DATE NOT NULL,
  starttime TIME NOT NULL,
  endtime TIME NOT NULL,
  numberofhours INTEGER,
  status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  roomid VARCHAR(50),
  dayofweek VARCHAR(10),
  starttime TIME,
  endtime TIME,
  username VARCHAR(255),
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Equipments Table
CREATE TABLE IF NOT EXISTS equipments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Room Equipments (Junction Table)
CREATE TABLE IF NOT EXISTS roomequipments (
  id SERIAL PRIMARY KEY,
  roomid VARCHAR(50),
  equipmentid VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roomequipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for anon key - adjust for production)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for reservations" ON reservations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for schedules" ON schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for equipments" ON equipments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for roomequipments" ON roomequipments FOR ALL USING (true) WITH CHECK (true);

-- =====================
-- SAMPLE DATA
-- =====================

-- Sample Users (password is plain text for demo - hash in production!)
INSERT INTO users (username, password, firstname, lastname, email) VALUES
  ('admin', 'admin123', 'Admin', 'User', 'admin@aula.com'),
  ('juan', 'password123', 'Juan', 'Dela Cruz', 'juan@email.com'),
  ('maria', 'password123', 'Maria', 'Santos', 'maria@email.com');

-- Sample Rooms
INSERT INTO rooms (roomnum, floornum, capacity, status, bldg) VALUES
  ('101', '1st', 30, true, 'A'),
  ('102', '1st', 25, true, 'A'),
  ('201', '2nd', 40, true, 'A'),
  ('202', '2nd', 35, true, 'A'),
  ('301', '3rd', 50, true, 'B'),
  ('302', '3rd', 45, true, 'B'),
  ('401', '4th', 30, true, 'B'),
  ('LAB-1', '1st', 20, true, 'C'),
  ('LAB-2', '2nd', 20, true, 'C');

-- Sample Equipments
INSERT INTO equipments (name, description) VALUES
  ('Projector', 'LCD Projector'),
  ('Whiteboard', 'Standard whiteboard'),
  ('Air Conditioner', 'Split type AC'),
  ('Computer', 'Desktop PC'),
  ('TV', 'Smart TV 55 inch'),
  ('Microphone', 'Wireless microphone');

-- Sample Room Equipments
INSERT INTO roomequipments (roomid, equipmentid, quantity) VALUES
  ('1', '1', 1),
  ('1', '2', 2),
  ('1', '3', 1),
  ('2', '1', 1),
  ('2', '2', 1),
  ('3', '1', 1),
  ('3', '3', 2),
  ('8', '4', 20),
  ('8', '1', 1),
  ('9', '4', 20),
  ('9', '1', 1);

-- Sample Schedules
INSERT INTO schedules (roomid, dayofweek, starttime, endtime, username, status) VALUES
  ('1', 'Mon', '08:00', '10:00', 'Prof. Garcia', 'scheduled'),
  ('1', 'Mon', '10:00', '12:00', 'Prof. Santos', 'scheduled'),
  ('1', 'Tue', '09:00', '11:00', 'Prof. Reyes', 'scheduled'),
  ('2', 'Mon', '08:00', '09:00', 'Prof. Cruz', 'scheduled'),
  ('3', 'Wed', '14:00', '16:00', 'Prof. Lopez', 'scheduled'),
  ('8', 'Thur', '13:00', '16:00', 'Prof. Mendoza', 'scheduled');

-- Done!
SELECT 'Database setup complete!' AS status;
