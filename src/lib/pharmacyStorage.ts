/**
 * Custom Local Pharmacy Storage Service
 * Ensures manually added pharmacies are persisted in localStorage,
 * retrieved instantly, and merged with DB/catalog data across all components and agents.
 */

import type { Pharmacy } from "./types";

const LOCAL_STORAGE_KEY = "medifinder_custom_pharmacies";

export function getCustomPharmacies(): Pharmacy[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load custom pharmacies from localStorage:", err);
    return [];
  }
}

export function saveCustomPharmacy(pharmacy: Partial<Pharmacy>): Pharmacy {
  const customList = getCustomPharmacies();
  
  const id = pharmacy.id || `custom-pharma-${Date.now()}`;
  const now = new Date().toISOString();

  const newPharmacy: Pharmacy = {
    id,
    name: pharmacy.name || "Custom Community Pharmacy",
    owner_name: pharmacy.owner_name || "Registered Pharmacist",
    phone: pharmacy.phone || "+91 98400 12345",
    alt_phone: pharmacy.alt_phone || null,
    address: pharmacy.address || "Main Market Road",
    city: pharmacy.city || "Chennai",
    state: pharmacy.state || "Tamil Nadu",
    district: pharmacy.district || pharmacy.city || "Chennai",
    pincode: pharmacy.pincode || "600001",
    lat: pharmacy.lat && !isNaN(pharmacy.lat) ? pharmacy.lat : 13.0827,
    lng: pharmacy.lng && !isNaN(pharmacy.lng) ? pharmacy.lng : 80.2707,
    pharmacy_type: pharmacy.pharmacy_type || "urban",
    is_24x7: pharmacy.is_24x7 ?? false,
    open_time: pharmacy.open_time || "08:00",
    close_time: pharmacy.close_time || "22:00",
    home_delivery: pharmacy.home_delivery ?? true,
    online_payment: pharmacy.online_payment ?? true,
    services: pharmacy.services || ["Medicines", "First-Aid Supplies", "Emergency Orders"],
    rating: pharmacy.rating || 4.8,
    verified: true,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [newPharmacy, ...customList.filter(p => p.id !== id)];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    // Dispatch custom event to update all active views instantly
    window.dispatchEvent(new CustomEvent("medifinder_pharmacies_updated", { detail: newPharmacy }));
  } catch (err) {
    console.error("Failed to save custom pharmacy to localStorage:", err);
  }

  return newPharmacy;
}
