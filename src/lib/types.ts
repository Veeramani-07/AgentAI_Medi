export type PharmacyType = "rural" | "urban" | "semi-urban";

export interface Pharmacy {
  id: string;
  name: string;
  owner_name: string | null;
  phone: string;
  alt_phone: string | null;
  address: string;
  district: string | null;
  city: string;
  state: string;
  pincode: string | null;
  lat: number;
  lng: number;
  pharmacy_type: PharmacyType;
  is_24x7: boolean;
  open_time: string;
  close_time: string;
  home_delivery: boolean;
  online_payment: boolean;
  services: string[];
  rating: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export type MedicineCategory =
  | "Antibiotic" | "Analgesic" | "Antiviral" | "Cardiac" | "Diabetic"
  | "Respiratory" | "Gastro" | "Dermatology" | "Vitamin" | "First-Aid"
  | "Mental Health" | "Women Health" | "General";

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: MedicineCategory;
  form: string;
  manufacturer: string | null;
  prescription_required: boolean;
  description: string | null;
  created_at: string;
}

export interface PharmacyInventory {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  in_stock: boolean;
  quantity: number;
  price: number | null;
  batch_number: string | null;
  expiry_date: string | null;
  last_verified_at: string;
  updated_at: string;
  medicines?: Medicine;
  pharmacies?: Pharmacy;
}

export type EquipmentType =
  | "Ventilator" | "Oxygen Cylinder" | "ICU Bed" | "Nebulizer" | "Defibrillator"
  | "Dialysis Machine" | "X-Ray Machine" | "Ultrasound" | "ECG Machine" | "Ambulance"
  | "Blood Bag" | "Oxygen Concentrator" | "Nebulizer Mask" | "Wheelchair" | "Stretchers"
  | "Glucometer" | "BP Monitor" | "Other";

export type EquipmentStatus = "available" | "limited" | "out-of-stock" | "on-order";

export interface PharmacyEquipment {
  id: string;
  pharmacy_id: string;
  equipment_type: EquipmentType;
  available_count: number;
  total_count: number;
  status: EquipmentStatus;
  condition_note: string | null;
  last_verified_at: string;
  updated_at: string;
  pharmacies?: Pharmacy;
}

export type RequestType = "medicine" | "equipment";
export type Urgency = "critical" | "urgent" | "normal";
export type RequestStatus = "open" | "fulfilled" | "expired" | "cancelled";

export interface EmergencyRequest {
  id: string;
  request_type: RequestType;
  item_name: string;
  generic_name: string | null;
  quantity: number;
  urgency: Urgency;
  patient_condition: string | null;
  requester_name: string;
  requester_phone: string;
  city: string;
  state: string;
  district: string | null;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  status: RequestStatus;
  fulfilled_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReasoningStep {
  step: number;
  action: string;
  detail: string;
  result?: string;
}

export interface AssistantEntity {
  type: "medicine" | "equipment" | "location" | "urgency" | "quantity";
  value: string;
  raw: string;
}

export interface MatchedItem {
  kind: "medicine" | "equipment";
  name: string;
  generic_name?: string;
  in_stock: boolean;
  quantity: number;
  price: number | null;
  status?: string;
  available_count?: number;
  total_count?: number;
}

export interface PharmacyResult {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  district: string | null;
  address: string;
  lat: number;
  lng: number;
  distance_km: number | null;
  pharmacy_type: PharmacyType;
  is_24x7: boolean;
  home_delivery: boolean;
  rating: number;
  open_time: string;
  close_time: string;
  match_reason: string;
  matched_item?: MatchedItem;
}

export interface AssistantResponse {
  intent: string;
  entities: AssistantEntity[];
  reasoning: ReasoningStep[];
  reply: string;
  pharmacies: PharmacyResult[];
  suggestions: string[];
  confidence: number;
}
