import { useState } from "react";
import { MapPin, Navigation, Search, X, Loader2, Check, AlertCircle, Compass, Globe } from "lucide-react";
import {
  getBrowserLocation,
  reverseGeocode,
  geocodeAddress,
  getIPLocation,
  type GeocodedLocation,
} from "@/lib/locationService";
import { Modal } from "./Modal";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  currentLocationName: string | null;
  onLocationSelect: (location: GeocodedLocation) => void;
}

const POPULAR_CITIES = [
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Delhi NCR", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Udumalpet", state: "Tamil Nadu", lat: 10.584, lng: 77.2464 },
  { name: "Barmer", state: "Rajasthan", lat: 25.7532, lng: 71.4181 },
];

export function LocationModal({ open, onClose, currentLocationName, onLocationSelect }: LocationModalProps) {
  const [query, setQuery] = useState("");
  const [loadingGps, setLoadingGps] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAutoDetectGps() {
    setLoadingGps(true);
    setErrorMsg(null);
    try {
      const coords = await getBrowserLocation();
      const geocoded = await reverseGeocode(coords.lat, coords.lng);
      onLocationSelect(geocoded);
      onClose();
    } catch (err: any) {
      console.warn("GPS failed, trying IP fallback:", err);
      try {
        const ipLoc = await getIPLocation();
        onLocationSelect(ipLoc);
        onClose();
      } catch {
        setErrorMsg("Unable to access browser location. Please type your city name below.");
      }
    } finally {
      setLoadingGps(false);
    }
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setErrorMsg(null);
    try {
      const results = await geocodeAddress(query);
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMsg(`No locations found for "${query}". Try typing a major city or district name.`);
      }
    } catch {
      setErrorMsg("Failed to search location. Please check your internet connection.");
    } finally {
      setSearching(false);
    }
  }

  function handleSelectCity(c: (typeof POPULAR_CITIES)[0]) {
    const loc: GeocodedLocation = {
      lat: c.lat,
      lng: c.lng,
      displayName: `${c.name}, ${c.state}`,
      city: c.name,
      state: c.state,
    };
    onLocationSelect(loc);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Set Your Location">
      <div className="space-y-5 p-1">
        {/* Active location indicator */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">Active Search Center</div>
            <div className="text-sm font-black text-slate-900 truncate">
              {currentLocationName || "Location Not Set (Default: All India)"}
            </div>
          </div>
        </div>

        {/* Detect GPS Button */}
        <button
          onClick={handleAutoDetectGps}
          disabled={loadingGps}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer"
        >
          {loadingGps ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Detecting GPS Location via OpenStreetMap...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" /> Use Current Device GPS / Auto-Detect
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs text-slate-400 font-semibold uppercase tracking-widest absolute">
            Or Search City / Village
          </span>
        </div>

        {/* Live Search Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Type village, city or pincode... e.g., Udumalpet, 642126"
                className="input pl-10 text-sm"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={handleSearch} disabled={searching} className="btn-primary text-xs shrink-0 px-4">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </button>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search results list */}
          {searchResults.length > 0 && (
            <div className="rounded-xl border border-sky-200 bg-white shadow-md overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onLocationSelect(res);
                    onClose();
                  }}
                  className="w-full text-left p-3 hover:bg-sky-50 transition-colors flex items-center gap-2.5"
                >
                  <Compass className="w-4 h-4 text-sky-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">{res.displayName}</div>
                    <div className="text-[11px] text-slate-500">
                      Coordinates: {res.lat.toFixed(4)}, {res.lng.toFixed(4)}
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-emerald-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Popular Cities */}
        <div>
          <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-600" /> Popular Indian Cities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700 hover:text-sky-900 text-xs font-semibold transition-all cursor-pointer"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
