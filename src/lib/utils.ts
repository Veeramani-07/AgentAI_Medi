export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number | null): string {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  const mo = Math.floor(day / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu and Kashmir","Ladakh","Chandigarh","Puducherry",
];

export const EQUIPMENT_TYPES: string[] = [
  "Ventilator","Oxygen Cylinder","ICU Bed","Nebulizer","Defibrillator",
  "Dialysis Machine","X-Ray Machine","Ultrasound","ECG Machine","Ambulance",
  "Blood Bag","Oxygen Concentrator","Nebulizer Mask","Wheelchair","Stretchers",
  "Glucometer","BP Monitor","Other",
];

export const MEDICINE_CATEGORIES = [
  "Antibiotic","Analgesic","Antiviral","Cardiac","Diabetic",
  "Respiratory","Gastro","Dermatology","Vitamin","First-Aid",
  "Mental Health","Women Health","General",
];

export const MEDICINE_FORMS = [
  "Tablet","Capsule","Syrup","Liquid","Injection","Inhaler","Drops",
  "Cream","Ointment","Powder","Spray","Device",
];

export function formatPrice(p: number | null | undefined): string {
  if (p == null) return "—";
  return `Rs. ${Number(p).toFixed(0)}`;
}

export function getSessionId(): string {
  const KEY = "medifinder_session";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
