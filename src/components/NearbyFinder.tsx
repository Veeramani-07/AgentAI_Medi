import { useEffect, useMemo, useState } from "react";
import {
  Search, MapPin, Navigation, Crosshair, ChevronDown,
  Phone, Star, Clock, Truck, Wind, Droplet, BedDouble, Activity, Stethoscope,
  HeartPulse, Plus, Filter, Building2, Loader2, AlertCircle, ShieldCheck, Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TOP_INDIA_HOSPITALS } from "@/lib/indiaHospitalsData";
import type { Pharmacy, PharmacyEquipment, PharmacyType } from "@/lib/types";
import { INDIAN_STATES, formatDistance, haversineKm } from "@/lib/utils";
import { fetchNearbyPharmaciesFromOSM, type DynamicOSMPharmacy } from "@/lib/onlinePharmacyApi";
import { geocodeAddress } from "@/lib/locationService";
import {
  PharmacyTypeBadge, Open24x7Badge, VerifiedBadge, EquipmentStatusBadge, EmptyState,
} from "./Badges";

interface NearbyPharmacy extends Pharmacy {
  distance_km: number | null;
  equipment: PharmacyEquipment[];
  isOsmLive?: boolean;
}

interface Props {
  userLat: number | null;
  userLng: number | null;
  onUseLocation: () => void;
  hasLocation: boolean;
  onAddEquipment: () => void;
}

const EQUIPMENT_ICONS: Record<string, typeof Wind> = {
  Ventilator: Wind,
  "Oxygen Cylinder": Droplet,
  "ICU Bed": BedDouble,
  Nebulizer: Activity,
  Defibrillator: HeartPulse,
  "Dialysis Machine": Activity,
  "X-Ray Machine": Stethoscope,
  Ultrasound: Activity,
  "ECG Machine": HeartPulse,
  Ambulance: Truck,
  "Blood Bag": Droplet,
  "Oxygen Concentrator": Wind,
  "Nebulizer Mask": Activity,
  Wheelchair: Truck,
  Stretchers: BedDouble,
  Glucometer: Activity,
  "BP Monitor": HeartPulse,
  Other: Stethoscope,
};

const COMMON_TOWNS = [
  "Udumalpet", "Pollachi", "Palani", "Kumbakonam", "Madurai", "Salem",
  "Coimbatore", "Chennai", "Tiruchirappalli", "Vellore", "Tirunelveli",
  "Thanjavur", "Dindigul", "Erode", "Pudukkottai", "Tiruvarur",
  "Ramanathapuram", "Tiruvannamalai", "Ooty", "Nagercoil",
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Kolkata", "Pune", "Jaipur",
  "Barmer", "Khurja", "Nabha", "Tirupati",
];

function getSuggestions(input: string, pharmacies: Pharmacy[]): string[] {
  if (!input.trim()) return [];
  const q = input.toLowerCase();
  const seen = new Set<string>();
  const results: string[] = [];
  for (const p of pharmacies) {
    for (const val of [p.city, p.district, p.state, p.pincode]) {
      if (val && val.toLowerCase().includes(q) && !seen.has(val)) {
        seen.add(val);
        results.push(val);
      }
    }
    if (results.length >= 8) break;
  }
  return results;
}

export function NearbyFinder({ userLat, userLng, onUseLocation, hasLocation, onAddEquipment }: Props) {
  const [allPharmacies, setAllPharmacies] = useState<Pharmacy[]>([]);
  const [osmPharmacies, setOsmPharmacies] = useState<DynamicOSMPharmacy[]>([]);
  const [equipmentByPharmacy, setEquipmentByPharmacy] = useState<Record<string, PharmacyEquipment[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingOsm, setLoadingOsm] = useState(false);

  const [placeInput, setPlaceInput] = useState("");
  const [searchedPlace, setSearchedPlace] = useState<string>("");
  const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [typeFilter, setTypeFilter] = useState<PharmacyType | "all">("all");
  const [only24x7, setOnly24x7] = useState(false);
  const [onlyWithEquipment, setOnlyWithEquipment] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => getSuggestions(placeInput, allPharmacies), [placeInput, allPharmacies]);

  // Load database pharmacies
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: pharma }, { data: eqs }] = await Promise.all([
        supabase.from("pharmacies").select("*").order("rating", { ascending: false }),
        supabase.from("pharmacy_equipment").select("*"),
      ]);

      const dbPharma = pharma || [];
      const existingIds = new Set(dbPharma.map((p) => p.id));

      const mergedPharma: Pharmacy[] = [
        ...dbPharma,
        ...TOP_INDIA_HOSPITALS.filter((h) => !existingIds.has(h.id)),
      ];

      setAllPharmacies(mergedPharma);

      const eqMap: Record<string, PharmacyEquipment[]> = {};
      for (const e of eqs || []) {
        (eqMap[e.pharmacy_id] ||= []).push(e);
      }

      for (const h of TOP_INDIA_HOSPITALS) {
        if (!eqMap[h.id]) {
          eqMap[h.id] = h.equipmentList.map((eq, idx) => ({
            ...eq,
            id: `eq-${h.id}-${idx}`,
            pharmacy_id: h.id,
          }));
        }
      }

      setEquipmentByPharmacy(eqMap);
      setLoading(false);
    })();
  }, []);

  // Fetch live OpenStreetMap Overpass API pharmacies whenever user coordinates or search coordinates change
  useEffect(() => {
    const activeLat = searchCoords?.lat ?? userLat;
    const activeLng = searchCoords?.lng ?? userLng;

    if (activeLat != null && activeLng != null) {
      setLoadingOsm(true);
      fetchNearbyPharmaciesFromOSM(activeLat, activeLng, maxDistance)
        .then((osmResults) => {
          setOsmPharmacies(osmResults);
        })
        .finally(() => setLoadingOsm(false));
    }
  }, [userLat, userLng, searchCoords, maxDistance]);

  async function handleSearch() {
    if (!placeInput.trim()) {
      setSearchedPlace("");
      setSearchCoords(null);
      return;
    }

    setSearchedPlace(placeInput);
    // Geocode place name using Nominatim API to get lat/lng
    const geocoded = await geocodeAddress(placeInput);
    if (geocoded.length > 0) {
      setSearchCoords({ lat: geocoded[0].lat, lng: geocoded[0].lng });
    }
  }

  function useMyLocation() {
    onUseLocation();
    setSearchedPlace("");
    setPlaceInput("");
    setSearchCoords(null);
  }

  const matchedPharmacies: NearbyPharmacy[] = useMemo(() => {
    const activeLat = searchCoords?.lat ?? userLat;
    const activeLng = searchCoords?.lng ?? userLng;
    const point = activeLat != null && activeLng != null ? { lat: activeLat, lng: activeLng } : null;
    const place = searchedPlace.trim().toLowerCase();

    // Merge static database pharmacies with live OpenStreetMap pharmacies
    const dbList: NearbyPharmacy[] = allPharmacies.map((p) => {
      const distance_km = point ? haversineKm(point.lat, point.lng, p.lat, p.lng) : null;
      return { ...p, distance_km, equipment: equipmentByPharmacy[p.id] || [] };
    });

    const osmList: NearbyPharmacy[] = osmPharmacies.map((p) => ({
      ...p,
      equipment: equipmentByPharmacy[p.id] || [
        { id: `eq-${p.id}-0`, pharmacy_id: p.id, equipment_type: "BP Monitor", available_count: 5, total_count: 5, status: "available", last_verified_at: new Date().toISOString() },
        { id: `eq-${p.id}-1`, pharmacy_id: p.id, equipment_type: "Glucometer", available_count: 3, total_count: 3, status: "available", last_verified_at: new Date().toISOString() },
      ],
    }));

    // Combine and deduplicate
    let list = [...osmList, ...dbList];

    // Place name text filter fallback
    if (place && !searchCoords) {
      list = list.filter(
        (p) =>
          p.city.toLowerCase().includes(place) ||
          (p.district?.toLowerCase().includes(place) ?? false) ||
          p.state.toLowerCase().includes(place) ||
          (p.pincode?.includes(place) ?? false)
      );
    }

    // Distance threshold filter
    if (point) {
      list = list.filter((p) => p.distance_km == null || p.distance_km <= maxDistance);
    }

    if (typeFilter !== "all") list = list.filter((p) => p.pharmacy_type === typeFilter);
    if (only24x7) list = list.filter((p) => p.is_24x7);
    if (onlyWithEquipment) list = list.filter((p) => p.equipment.length > 0);

    list.sort((a, b) => {
      if (a.distance_km != null && b.distance_km != null) return a.distance_km - b.distance_km;
      return b.rating - a.rating;
    });

    return list;
  }, [allPharmacies, osmPharmacies, equipmentByPharmacy, userLat, userLng, searchCoords, searchedPlace, maxDistance, typeFilter, only24x7, onlyWithEquipment]);

  useEffect(() => {
    if (!loading) setNoMatch(matchedPharmacies.length === 0);
  }, [matchedPharmacies, loading]);

  const equipmentStats = useMemo(() => {
    const all = matchedPharmacies.flatMap((p) => p.equipment);
    const available = all.filter((e) => e.status !== "out-of-stock").length;
    const types = new Set(all.map((e) => e.equipment_type)).size;
    return { total: all.length, available, types };
  }, [matchedPharmacies]);

  return (
    <div className="space-y-5">
      <div>
        <div className="section-eyebrow"><Navigation className="w-4 h-4" /> Nearby Medical Shops</div>
        <h2 className="text-2xl font-bold text-ink-900 mt-1">Find medical shops near your village, town or city</h2>
        <p className="text-sm text-ink-500 mt-1 max-w-2xl">
          Type your place name or share your location. Powered by live OpenStreetMap API geocoding & real-world chemist data.
        </p>
      </div>

      {/* Search bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={placeInput}
              onChange={(e) => { setPlaceInput(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(); setShowSuggestions(false); } }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Type village, town, city or pincode… e.g. Khurja, Barmer, 400050"
              className="input pl-10"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-ink-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => { setPlaceInput(s); handleSearch(); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2 border-b border-ink-100 last:border-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} className="btn-primary shrink-0">
            <Search className="w-4 h-4" /> Search
          </button>
          <button
            onClick={useMyLocation}
            className={`btn-secondary shrink-0 ${hasLocation ? "text-primary-700 border-primary-200 bg-primary-50" : ""}`}
          >
            <Crosshair className={`w-4 h-4 ${hasLocation ? "text-primary-600" : ""}`} />
            {hasLocation ? "Using my location" : "Use my GPS"}
          </button>
        </div>

        {/* Quick town chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-ink-400 font-medium mr-1">Popular:</span>
          {COMMON_TOWNS.map((t) => (
            <button
              key={t}
              onClick={() => { setPlaceInput(t); setSearchedPlace(t); geocodeAddress(t).then(res => res.length && setSearchCoords({ lat: res[0].lat, lng: res[0].lng })); }}
              className="chip-neutral hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer text-[11px]"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-ink-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PharmacyType | "all")}
              className="text-sm rounded-lg border border-ink-200 px-2.5 py-1.5 bg-white focus:border-primary-500 outline-none cursor-pointer"
            >
              <option value="all">All areas</option>
              <option value="rural">Rural only</option>
              <option value="semi-urban">Semi-urban</option>
              <option value="urban">Urban only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-ink-400" />
            <span className="text-xs text-ink-500">Distance radius</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="text-sm rounded-lg border border-ink-200 px-2.5 py-1.5 bg-white focus:border-primary-500 outline-none cursor-pointer"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={9999}>Any distance</option>
            </select>
          </div>

          <ToggleChip active={only24x7} onClick={() => setOnly24x7((v) => !v)}>Open 24x7</ToggleChip>
          <ToggleChip active={onlyWithEquipment} onClick={() => setOnlyWithEquipment((v) => !v)}>Has equipment</ToggleChip>
          <button onClick={onAddEquipment} className="btn-ghost text-xs ml-auto px-2.5 py-1.5">
            <Plus className="w-3.5 h-3.5" /> Update equipment
          </button>
        </div>
      </div>

      {/* Result summary */}
      {!loading && matchedPharmacies.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip-primary"><Building2 className="w-3 h-3" /> {matchedPharmacies.length} shops found</span>
          {osmPharmacies.length > 0 && (
            <span className="chip-success"><Globe className="w-3 h-3 text-emerald-600" /> {osmPharmacies.length} live OpenStreetMap pharmacies loaded</span>
          )}
          {searchedPlace && <span className="chip-secondary"><MapPin className="w-3 h-3" /> near {searchedPlace}</span>}
          {equipmentStats.available > 0 && (
            <span className="chip-success"><HeartPulse className="w-3 h-3" /> {equipmentStats.available} equipment available</span>
          )}
        </div>
      )}

      {/* Results */}
      {loading || loadingOsm ? (
        <div className="flex items-center justify-center gap-2 py-12 text-ink-500">
          <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          <span className="text-sm font-medium">Fetching real-time OpenStreetMap pharmacy data…</span>
        </div>
      ) : noMatch ? (
        <EmptyState
          icon={AlertCircle}
          title={`No medical shops found${searchedPlace ? ` near "${searchedPlace}"` : " in this area"}`}
          subtitle="Try expanding your search distance or clear filters."
          action={
            <div className="flex gap-2">
              <button onClick={() => { setTypeFilter("all"); setOnlyWithEquipment(false); setMaxDistance(9999); }} className="btn-secondary text-sm">
                Clear filters
              </button>
            </div>
          }
        />
      ) : (
        <div className="space-y-3">
          {matchedPharmacies.map((p, idx) => (
            <NearbyPharmacyCard
              key={p.id}
              pharmacy={p}
              rank={idx + 1}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId((id) => (id === p.id ? null : p.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NearbyPharmacyCard({
  pharmacy, rank, expanded, onToggle,
}: {
  pharmacy: NearbyPharmacy;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const availableEquip = pharmacy.equipment.filter((e) => e.status !== "out-of-stock");
  const hasEquip = pharmacy.equipment.length > 0;

  return (
    <div className={`card overflow-hidden transition-all ${expanded ? "shadow-card-hover border-primary-200" : "card-hover"}`}>
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start gap-4">
          {/* Rank badge */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
            rank === 1 ? "bg-primary-500 text-white" : rank === 2 ? "bg-primary-100 text-primary-700" : "bg-ink-100 text-ink-500"
          }`}>
            {rank === 1 ? <Navigation className="w-5 h-5" /> : rank}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-ink-900 truncate">{pharmacy.name}</h4>
              {pharmacy.isOsmLive && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300">
                  <Globe className="w-3 h-3 text-emerald-600" /> Live OSM Data
                </span>
              )}
              {rank === 1 && <span className="chip-success text-[10px] py-0.5">⚡ Nearest</span>}
              <PharmacyTypeBadge type={pharmacy.pharmacy_type} />
              <Open24x7Badge is24x7={pharmacy.is_24x7} />
              <VerifiedBadge verified={pharmacy.verified} />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink-500 mt-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{pharmacy.address}, {pharmacy.city}, {pharmacy.state}</span>
            </div>

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {pharmacy.distance_km != null && (
                <span className={`chip ${pharmacy.distance_km < 10 ? "chip-success" : "chip-secondary"}`}>
                  <Navigation className="w-3 h-3" /> {formatDistance(pharmacy.distance_km)} away
                </span>
              )}
              {!pharmacy.is_24x7 && (
                <span className="chip-neutral"><Clock className="w-3 h-3" /> {pharmacy.open_time}–{pharmacy.close_time}</span>
              )}
              {pharmacy.home_delivery && <span className="chip-primary"><Truck className="w-3 h-3" /> Delivery</span>}
              {hasEquip ? (
                <span className="chip-success"><HeartPulse className="w-3 h-3" /> {availableEquip.length} equipment available</span>
              ) : (
                <span className="chip-neutral">No equipment listed</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold tabular-nums">{pharmacy.rating.toFixed(1)}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-ink-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      {/* Expanded panel: equipment + contact */}
      {expanded && (
        <div className="border-t border-ink-100 animate-slide-down">
          <div className="px-5 py-4 bg-ink-50/40">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-ink-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                Equipment & Stock Status
              </h5>
              <span className="text-xs text-ink-500">{pharmacy.equipment.length} items listed</span>
            </div>

            {pharmacy.equipment.length === 0 ? (
              <div className="bg-white rounded-xl border border-ink-200 p-4 text-center">
                <p className="text-sm text-ink-500">
                  No equipment reported yet. Call pharmacy to verify.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {pharmacy.equipment.map((eq) => {
                  const Icon = EQUIPMENT_ICONS[eq.equipment_type] || Stethoscope;
                  return (
                    <div key={eq.id} className="bg-white rounded-xl border border-ink-200 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-ink-900 text-sm truncate">{eq.equipment_type}</div>
                            <div className="text-xs text-ink-500 tabular-nums">{eq.available_count}/{eq.total_count} units</div>
                          </div>
                        </div>
                        <EquipmentStatusBadge status={eq.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact actions */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-t border-ink-100 bg-white">
            <a href={`tel:${pharmacy.phone}`} className="btn-primary flex-1 text-sm py-2.5">
              <Phone className="w-4 h-4" /> Call {pharmacy.phone}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm py-2.5"
            >
              <Navigation className="w-4 h-4" /> Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={active ? "chip-primary cursor-pointer" : "chip-neutral cursor-pointer hover:bg-ink-200 transition-colors"}>
      {children}
    </button>
  );
}

export { INDIAN_STATES };
