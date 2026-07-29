import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type {
  Pharmacy,
  PharmacyEquipment,
  PharmacyInventory,
  EmergencyRequest,
  Medicine,
  EquipmentType,
} from "./types";
import { TOP_INDIA_HOSPITALS, TOP_INDIA_EMERGENCY_REQUESTS } from "./indiaHospitalsData";
import { haversineKm } from "./utils";
import { getCustomPharmacies } from "./pharmacyStorage";

export interface PharmacyWithDistance extends Pharmacy {
  distance_km: number | null;
}

export function usePharmacies(userLat: number | null, userLng: number | null) {
  const [pharmacies, setPharmacies] = useState<PharmacyWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildList = useCallback(async () => {
    setLoading(true);
    const { data, error: dbErr } = await supabase
      .from("pharmacies")
      .select("*")
      .order("rating", { ascending: false });

    const dbPharmacies = data || [];
    const customPharmacies = getCustomPharmacies();
    const existingIds = new Set(dbPharmacies.map((p) => p.id));

    const merged: Pharmacy[] = [
      ...customPharmacies.filter((c) => !existingIds.has(c.id)),
      ...dbPharmacies,
      ...TOP_INDIA_HOSPITALS.filter((h) => !existingIds.has(h.id)),
    ];

    if (dbErr) setError(dbErr.message);
    setPharmacies(
      merged.map((p) => ({
        ...p,
        distance_km: userLat != null && userLng != null ? haversineKm(userLat, userLng, p.lat, p.lng) : null,
      }))
    );
    setLoading(false);
  }, [userLat, userLng]);

  useEffect(() => {
    buildList();
    // Re-fetch whenever a new pharmacy is saved locally
    const handler = () => buildList();
    window.addEventListener("medifinder_pharmacies_updated", handler);
    return () => window.removeEventListener("medifinder_pharmacies_updated", handler);
  }, [buildList]);

  return { pharmacies, loading, error };
}

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("medicines").select("*").order("name");
      if (active) {
        setMedicines(data || []);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { medicines, loading };
}

export function useInventoryByMedicine(medicineId: string | null) {
  const [rows, setRows] = useState<PharmacyInventory[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!medicineId) { setRows([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("pharmacy_inventory")
      .select("*, pharmacies(*)")
      .eq("medicine_id", medicineId)
      .order("in_stock", { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, [medicineId]);

  useEffect(() => { refetch(); }, [refetch]);
  return { rows, loading, refetch };
}

export function useEquipment(equipmentType?: EquipmentType | "all") {
  const [rows, setRows] = useState<PharmacyEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      let q = supabase.from("pharmacy_equipment").select("*, pharmacies(*)");
      if (equipmentType && equipmentType !== "all") q = q.eq("equipment_type", equipmentType);
      const { data } = await q.order("status", { ascending: true });

      const dbRows = data || [];
      const existingIds = new Set(dbRows.map((r) => r.id));

      const catalogEquipment: PharmacyEquipment[] = [];
      for (const h of TOP_INDIA_HOSPITALS) {
        for (let i = 0; i < h.equipmentList.length; i++) {
          const item = h.equipmentList[i];
          if (!equipmentType || equipmentType === "all" || item.equipment_type === equipmentType) {
            const eqId = `eq-${h.id}-${i}`;
            if (!existingIds.has(eqId)) {
              catalogEquipment.push({
                ...item,
                id: eqId,
                pharmacy_id: h.id,
                pharmacies: h,
              });
            }
          }
        }
      }

      if (active) {
        setRows([...dbRows, ...catalogEquipment]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [equipmentType]);

  return { rows, loading };
}

export function useRequests() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("emergency_requests")
      .select("*")
      .order("created_at", { ascending: false });

    const dbReqs = data || [];
    const existingIds = new Set(dbReqs.map((r) => r.id));
    const merged = [
      ...dbReqs,
      ...TOP_INDIA_EMERGENCY_REQUESTS.filter((r) => !existingIds.has(r.id)),
    ];

    setRequests(merged);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { requests, loading, refetch };
}

export async function insertPharmacy(input: Partial<Pharmacy>): Promise<{ error: string | null }> {
  const { error } = await supabase.from("pharmacies").insert({
    name: input.name,
    owner_name: input.owner_name ?? null,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    district: input.district ?? null,
    pincode: input.pincode ?? null,
    lat: input.lat ?? 0,
    lng: input.lng ?? 0,
    pharmacy_type: input.pharmacy_type ?? "urban",
    is_24x7: input.is_24x7 ?? false,
    open_time: input.open_time ?? "09:00",
    close_time: input.close_time ?? "21:00",
    home_delivery: input.home_delivery ?? false,
    online_payment: input.online_payment ?? false,
    services: input.services ?? [],
  });
  return { error: error?.message ?? null };
}

export async function insertEquipment(input: {
  pharmacy_id: string;
  equipment_type: EquipmentType;
  available_count: number;
  total_count: number;
  status: string;
  condition_note?: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("pharmacy_equipment").upsert({
    pharmacy_id: input.pharmacy_id,
    equipment_type: input.equipment_type,
    available_count: input.available_count,
    total_count: input.total_count,
    status: input.status,
    condition_note: input.condition_note ?? null,
    last_verified_at: new Date().toISOString(),
  }, { onConflict: "pharmacy_id,equipment_type" });
  return { error: error?.message ?? null };
}

export async function insertRequest(input: Partial<EmergencyRequest>): Promise<{ error: string | null }> {
  const { error } = await supabase.from("emergency_requests").insert({
    request_type: input.request_type,
    item_name: input.item_name,
    generic_name: input.generic_name ?? null,
    quantity: input.quantity ?? 1,
    urgency: input.urgency ?? "urgent",
    patient_condition: input.patient_condition ?? null,
    requester_name: input.requester_name,
    requester_phone: input.requester_phone,
    city: input.city,
    state: input.state,
    district: input.district ?? null,
    pincode: input.pincode ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    notes: input.notes ?? null,
  });
  return { error: error?.message ?? null };
}

export async function updateRequestStatus(id: string, status: EmergencyRequest["status"]): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("emergency_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}
