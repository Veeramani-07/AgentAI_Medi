/**
 * Location Service using browser Geolocation, OpenStreetMap Nominatim Geocoding API,
 * and IP-based fallback to handle location detection and address lookups across India.
 */

export interface GeocodedLocation {
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  state: string;
  district?: string;
  pincode?: string;
}

/**
 * High-accuracy position request wrapped in a Promise with timeout fallback.
 */
export function getBrowserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/**
 * Convert lat/lng to human-readable address name using OpenStreetMap Nominatim Reverse Geocoding API.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MediFinderIndiaApp/1.0",
      },
    });

    if (!res.ok) throw new Error("Reverse geocoding request failed");
    const data = await res.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      "Unknown Location";
    const state = address.state || "India";
    const district = address.state_district || address.county || "";
    const pincode = address.postcode || "";
    const displayName = data.display_name
      ? data.display_name.split(",").slice(0, 3).join(", ")
      : `${city}, ${state}`;

    return {
      lat,
      lng,
      displayName,
      city,
      state,
      district,
      pincode,
    };
  } catch (err) {
    console.warn("Reverse geocode failed, using generic coordinate string:", err);
    return {
      lat,
      lng,
      displayName: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      city: "Current Location",
      state: "India",
    };
  }
}

/**
 * Convert city, town, village or pincode text query to lat/lng coordinates using OpenStreetMap Nominatim Search API.
 */
export async function geocodeAddress(query: string): Promise<GeocodedLocation[]> {
  if (!query.trim()) return [];

  try {
    // Append India to ensure Indian locations are prioritized
    const q = query.toLowerCase().includes("india") ? query : `${query}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      q
    )}&limit=5&countrycodes=in&accept-language=en`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "MediFinderIndiaApp/1.0",
      },
    });

    if (!res.ok) throw new Error("Geocoding request failed");
    const results = await res.json();

    return results.map((item: any) => {
      const parts = item.display_name.split(",").map((s: string) => s.trim());
      const city = parts[0] || query;
      const state = parts.find((p: string) =>
        ["Tamil Nadu", "Maharashtra", "Karnataka", "Delhi", "Telangana", "Uttar Pradesh", "West Bengal", "Gujarat", "Kerala", "Rajasthan", "Punjab", "Haryana", "Bihar", "Madhya Pradesh", "Andhra Pradesh"].some(st => p.includes(st))
      ) || parts[parts.length - 2] || "India";

      return {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: parts.slice(0, 3).join(", "),
        city,
        state,
      };
    });
  } catch (err) {
    console.error("Geocode address error:", err);
    return [];
  }
}

/**
 * IP-based location fallback when browser Geolocation fails or is blocked.
 */
export async function getIPLocation(): Promise<GeocodedLocation> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("IP location lookup failed");
    const data = await res.json();

    return {
      lat: data.latitude || 20.5937,
      lng: data.longitude || 78.9629,
      displayName: `${data.city || "New Delhi"}, ${data.region || "Delhi"}`,
      city: data.city || "New Delhi",
      state: data.region || "Delhi",
      pincode: data.postal || "",
    };
  } catch {
    // Default to New Delhi center fallback
    return {
      lat: 28.6139,
      lng: 77.209,
      displayName: "New Delhi, Delhi",
      city: "New Delhi",
      state: "Delhi",
    };
  }
}
