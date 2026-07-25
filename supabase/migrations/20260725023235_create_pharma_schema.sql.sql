/*
# MediFinder India — Core Schema (retry, fixes typo)

## Purpose
A public, no-sign-in platform for India that lets anyone find nearby medicines,
check pharmacy equipment availability (ventilators, oxygen, ICU beds, etc.),
and post emergency requests. Built to serve rural and urban users equally.

## New Tables
1. `pharmacies` — Pharmacy/medical store directory with geo-location, hours, type.
2. `medicines` — Master catalog of medicines (brand + generic, category, form).
3. `pharmacy_inventory` — Per-pharmacy stock of each medicine.
4. `pharmacy_equipment` — Per-pharmacy availability of medical equipment.
5. `emergency_requests` — Public board of urgent medicine/equipment requests.
6. `assistant_logs` — Stores AI assistant reasoning + replies.

## Security
- Single-tenant, no auth: ALL policies use `TO anon, authenticated` with
  `USING (true)` / `WITH CHECK (true)` — data is intentionally public/shared.
- RLS enabled on every table.
*/

-- 1. PHARMACIES
CREATE TABLE IF NOT EXISTS pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_name text,
  phone text NOT NULL,
  alt_phone text,
  address text NOT NULL,
  district text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text,
  lat numeric(9,6) NOT NULL,
  lng numeric(9,6) NOT NULL,
  pharmacy_type text NOT NULL DEFAULT 'urban'
    CHECK (pharmacy_type IN ('rural','urban','semi-urban')),
  is_24x7 boolean NOT NULL DEFAULT false,
  open_time text DEFAULT '09:00',
  close_time text DEFAULT '21:00',
  home_delivery boolean NOT NULL DEFAULT false,
  online_payment boolean NOT NULL DEFAULT false,
  services text[] DEFAULT '{}',
  rating numeric(2,1) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pharmacies" ON pharmacies;
CREATE POLICY "public_read_pharmacies" ON pharmacies FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_pharmacies" ON pharmacies;
CREATE POLICY "public_insert_pharmacies" ON pharmacies FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_pharmacies" ON pharmacies;
CREATE POLICY "public_update_pharmacies" ON pharmacies FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_pharmacies" ON pharmacies;
CREATE POLICY "public_delete_pharmacies" ON pharmacies FOR DELETE TO anon, authenticated USING (true);

-- 2. MEDICINES
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text NOT NULL,
  category text NOT NULL DEFAULT 'General'
    CHECK (category IN ('Antibiotic','Analgesic','Antiviral','Cardiac','Diabetic',
                       'Respiratory','Gastro','Dermatology','Vitamin','First-Aid',
                       'Mental Health','Women Health','General')),
  form text NOT NULL DEFAULT 'Tablet'
    CHECK (form IN ('Tablet','Capsule','Syrup','Injection','Inhaler','Drops',
                    'Cream','Ointment','Powder','Spray','Device')),
  manufacturer text,
  prescription_required boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_medicines" ON medicines;
CREATE POLICY "public_read_medicines" ON medicines FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_medicines" ON medicines;
CREATE POLICY "public_insert_medicines" ON medicines FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_medicines" ON medicines;
CREATE POLICY "public_update_medicines" ON medicines FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_medicines" ON medicines;
CREATE POLICY "public_delete_medicines" ON medicines FOR DELETE TO anon, authenticated USING (true);

-- 3. PHARMACY INVENTORY
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  in_stock boolean NOT NULL DEFAULT true,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price numeric(8,2),
  batch_number text,
  expiry_date date,
  last_verified_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (pharmacy_id, medicine_id)
);
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_inventory" ON pharmacy_inventory;
CREATE POLICY "public_read_inventory" ON pharmacy_inventory FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_inventory" ON pharmacy_inventory;
CREATE POLICY "public_insert_inventory" ON pharmacy_inventory FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_inventory" ON pharmacy_inventory;
CREATE POLICY "public_update_inventory" ON pharmacy_inventory FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_inventory" ON pharmacy_inventory;
CREATE POLICY "public_delete_inventory" ON pharmacy_inventory FOR DELETE TO anon, authenticated USING (true);

-- 4. PHARMACY EQUIPMENT
CREATE TABLE IF NOT EXISTS pharmacy_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  equipment_type text NOT NULL
    CHECK (equipment_type IN ('Ventilator','Oxygen Cylinder','ICU Bed','Nebulizer',
             'Defibrillator','Dialysis Machine','X-Ray Machine','Ultrasound',
             'ECG Machine','Ambulance','Blood Bag','Oxygen Concentrator',
             'Nebulizer Mask','Wheelchair','Stretchers','Glucometer','BP Monitor','Other')),
  available_count integer NOT NULL DEFAULT 0 CHECK (available_count >= 0),
  total_count integer NOT NULL DEFAULT 0 CHECK (total_count >= 0),
  status text NOT NULL DEFAULT 'available'
    CHECK (status IN ('available','limited','out-of-stock','on-order')),
  condition_note text,
  last_verified_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (pharmacy_id, equipment_type)
);
ALTER TABLE pharmacy_equipment ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_equipment" ON pharmacy_equipment;
CREATE POLICY "public_read_equipment" ON pharmacy_equipment FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_equipment" ON pharmacy_equipment;
CREATE POLICY "public_insert_equipment" ON pharmacy_equipment FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_equipment" ON pharmacy_equipment;
CREATE POLICY "public_update_equipment" ON pharmacy_equipment FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_equipment" ON pharmacy_equipment;
CREATE POLICY "public_delete_equipment" ON pharmacy_equipment FOR DELETE TO anon, authenticated USING (true);

-- 5. EMERGENCY REQUESTS
CREATE TABLE IF NOT EXISTS emergency_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('medicine','equipment')),
  item_name text NOT NULL,
  generic_name text,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  urgency text NOT NULL DEFAULT 'urgent'
    CHECK (urgency IN ('critical','urgent','normal')),
  patient_condition text,
  requester_name text NOT NULL,
  requester_phone text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  district text,
  pincode text,
  lat numeric(9,6),
  lng numeric(9,6),
  notes text,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','fulfilled','expired','cancelled')),
  fulfilled_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_requests" ON emergency_requests;
CREATE POLICY "public_read_requests" ON emergency_requests FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_requests" ON emergency_requests;
CREATE POLICY "public_insert_requests" ON emergency_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_requests" ON emergency_requests;
CREATE POLICY "public_update_requests" ON emergency_requests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_requests" ON emergency_requests;
CREATE POLICY "public_delete_requests" ON emergency_requests FOR DELETE TO anon, authenticated USING (true);

-- 6. ASSISTANT LOGS
CREATE TABLE IF NOT EXISTS assistant_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_query text NOT NULL,
  intent text,
  extracted_entities jsonb,
  reasoning_steps jsonb,
  reply text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE assistant_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_assistant_logs" ON assistant_logs;
CREATE POLICY "public_read_assistant_logs" ON assistant_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_assistant_logs" ON assistant_logs;
CREATE POLICY "public_insert_assistant_logs" ON assistant_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_assistant_logs" ON assistant_logs;
CREATE POLICY "public_update_assistant_logs" ON assistant_logs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_assistant_logs" ON assistant_logs;
CREATE POLICY "public_delete_assistant_logs" ON assistant_logs FOR DELETE TO anon, authenticated USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_pharmacies_state_city ON pharmacies(state, city);
CREATE INDEX IF NOT EXISTS idx_pharmacies_type ON pharmacies(pharmacy_type);
CREATE INDEX IF NOT EXISTS idx_pharmacies_coords ON pharmacies(lat, lng);
CREATE INDEX IF NOT EXISTS idx_medicines_name_lower ON medicines (lower(name));
CREATE INDEX IF NOT EXISTS idx_medicines_generic_lower ON medicines (lower(generic_name));
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_inventory_pharmacy ON pharmacy_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_medicine ON pharmacy_inventory(medicine_id);
CREATE INDEX IF NOT EXISTS idx_inventory_in_stock ON pharmacy_inventory(in_stock);
CREATE INDEX IF NOT EXISTS idx_equipment_pharmacy ON pharmacy_equipment(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON pharmacy_equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON pharmacy_equipment(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON emergency_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON emergency_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_requests_location ON emergency_requests(state, city);
CREATE INDEX IF NOT EXISTS idx_logs_session ON assistant_logs(session_id);
