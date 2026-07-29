import { useEffect, useMemo, useState } from "react";
import {
  Search, Pill, Phone, MapPin, Navigation, Filter, ChevronDown, Package,
  Stethoscope, AlertCircle, Globe, ShieldAlert, Sparkles, Loader2,
} from "lucide-react";
import { useMedicines, useInventoryByMedicine } from "@/lib/hooks";
import { MEDICINE_CATEGORIES, formatPrice, formatDistance } from "@/lib/utils";
import { StockBadge, LoadingSpinner, EmptyState, VerifiedBadge } from "./Badges";
import type { MedicineCategory } from "@/lib/types";
import { getDetailedMedicineByName } from "@/lib/medicineDetailsData";
import { fetchFDADataForDrug, type OpenFDADrugInfo } from "@/lib/onlinePharmacyApi";

const CATEGORY_ICONS: Partial<Record<MedicineCategory, typeof Pill>> = {
  Antibiotic: Stethoscope,
  Analgesic: Pill,
  Cardiac: AlertCircle,
  Diabetic: AlertCircle,
  Respiratory: Stethoscope,
  "First-Aid": Package,
};

export function MedicineSearch({ userLat, userLng }: { userLat: number | null; userLng: number | null }) {
  const { medicines, loading } = useMedicines();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MedicineCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Live openFDA API response state
  const [fdaData, setFdaData] = useState<OpenFDADrugInfo | null>(null);
  const [loadingFda, setLoadingFda] = useState(false);

  const filtered = useMemo(() => {
    let list = medicines;
    if (category !== "all") list = list.filter((m) => m.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        (m.manufacturer?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [medicines, query, category]);

  const selected = medicines.find((m) => m.id === selectedId) || null;
  const { rows: inventory, loading: invLoading } = useInventoryByMedicine(selectedId);

  // Fetch live FDA data when medicine selection changes
  useEffect(() => {
    if (selected) {
      setLoadingFda(true);
      fetchFDADataForDrug(selected.name)
        .then((data) => setFdaData(data))
        .finally(() => setLoadingFda(false));
    } else {
      setFdaData(null);
    }
  }, [selected]);

  // attach distance
  const inventoryWithDist = useMemo(() => {
    return inventory.map((inv) => ({
      ...inv,
      distance_km: userLat != null && userLng != null && inv.pharmacies
        ? haversine(userLat, userLng, inv.pharmacies.lat, inv.pharmacies.lng)
        : null,
    }));
  }, [inventory, userLat, userLng]);

  const inStock = inventoryWithDist.filter((i) => i.in_stock).sort((a, b) => {
    if (a.distance_km != null && b.distance_km != null) return a.distance_km - b.distance_km;
    return 0;
  });

  return (
    <div className="space-y-5">
      <div>
        <div className="section-eyebrow"><Pill className="w-4 h-4" /> Medicine Catalog</div>
        <h2 className="text-2xl font-bold text-ink-900 mt-1">Search medicines &amp; check stock</h2>
        <p className="text-sm text-ink-500 mt-1">Browse the catalog and see which pharmacies have each medicine in stock right now.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine name, generic, or manufacturer…"
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MedicineCategory | "all")}
            className="input appearance-none pr-10 min-w-[180px] cursor-pointer"
          >
            <option value="all">All categories</option>
            {MEDICINE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-5">
        {/* Medicine list */}
        <div className="space-y-2 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
          {loading ? <LoadingSpinner label="Loading medicines…" /> : filtered.length === 0 ? (
            <EmptyState title="No medicines found" subtitle="Try a different search or category." />
          ) : (
            filtered.map((m) => {
              const Icon = CATEGORY_ICONS[m.category] || Pill;
              const active = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    active
                      ? "border-primary-400 bg-primary-50 shadow-sm"
                      : "border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? "bg-primary-500 text-white" : "bg-ink-100 text-ink-500"
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-ink-900 truncate">{m.name}</div>
                      <div className="text-xs text-ink-500 truncate">{m.generic_name}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="chip-neutral text-[10px] py-0.5">{m.category}</span>
                        <span className="chip-neutral text-[10px] py-0.5">{m.form}</span>
                        {m.prescription_required && <span className="chip-accent text-[10px] py-0.5">Rx</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Stock detail */}
        <div className="card p-5 min-h-[400px]">
          {!selected ? (
            <EmptyState
              icon={Package}
              title="Select a medicine"
              subtitle="Pick a medicine from the list to see which pharmacies currently stock it."
            />
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-ink-100">
                <div>
                  <h3 className="text-xl font-bold text-ink-900">{selected.name}</h3>
                  <p className="text-sm text-ink-500 font-semibold">Generic Composition: {selected.generic_name}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="chip-secondary">{selected.category}</span>
                    <span className="chip-neutral">{selected.form}</span>
                    {selected.manufacturer && <span className="chip-neutral">{selected.manufacturer}</span>}
                    {selected.prescription_required
                      ? <span className="chip-accent">Prescription required</span>
                      : <span className="chip-success">Over-the-counter</span>}
                  </div>
                  {selected.description && <p className="text-sm text-ink-600 mt-3">{selected.description}</p>}

                  {/* Dynamic openFDA Online API Data Card */}
                  {loadingFda ? (
                    <div className="mt-3 p-3 rounded-xl bg-slate-100 text-xs flex items-center gap-2 text-slate-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                      <span>Fetching live openFDA API drug details...</span>
                    </div>
                  ) : fdaData ? (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-xs space-y-1.5">
                      <div className="font-bold text-sky-900 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-600" /> openFDA Online API Live Data
                      </div>
                      <div><strong className="text-slate-900">Active Ingredient:</strong> {fdaData.activeIngredient.join(", ")}</div>
                      <div><strong className="text-slate-900">Manufacturer:</strong> {fdaData.manufacturerName}</div>
                      <div><strong className="text-rose-900 font-bold">FDA Warning Summary:</strong> {fdaData.warnings[0]?.slice(0, 140)}...</div>
                    </div>
                  ) : null}

                  {/* Rich Medical Details */}
                  {(() => {
                    const extra = getDetailedMedicineByName(selected.name);
                    if (!extra) return null;
                    return (
                      <div className="mt-4 p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs space-y-2">
                        <div><strong className="text-sky-900">Primary Uses:</strong> {extra.uses.join(", ")}</div>
                        <div><strong className="text-emerald-900">Standard Dosage:</strong> {extra.standardDosage}</div>
                        <div><strong className="text-amber-900">Precautions:</strong> {extra.precautions.join("; ")}</div>
                        <div><strong className="text-emerald-800">Jan Aushadhi Generic Savings:</strong> {extra.genericAlternative.name} (Save {extra.genericAlternative.savingsPercent}%)</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-ink-800">Pharmacies with stock</h4>
                  <span className="text-xs text-ink-500">{inStock.length} in stock · {inventoryWithDist.length - inStock.length} out</span>
                </div>

                {invLoading ? <LoadingSpinner label="Checking inventory…" /> : inStock.length === 0 ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="No pharmacy currently stocks this"
                    subtitle="Try asking the AI assistant, or post an emergency request if this is urgent."
                  />
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto scrollbar-thin">
                    {inStock.map((inv) => (
                      <div key={inv.id} className="rounded-xl border border-ink-200 p-3.5 hover:border-primary-300 hover:bg-primary-50/30 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-ink-900 truncate">{inv.pharmacies?.name}</span>
                              {inv.pharmacies && <VerifiedBadge verified={inv.pharmacies.verified} />}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-ink-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {inv.pharmacies?.city}, {inv.pharmacies?.state}
                            </div>
                          </div>
                          <StockBadge inStock={inv.in_stock} quantity={inv.quantity} />
                        </div>
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          {inv.distance_km != null && (
                            <span className="chip-secondary text-[10px]"><Navigation className="w-3 h-3" /> {formatDistance(inv.distance_km)}</span>
                          )}
                          {inv.price != null && <span className="chip-neutral text-[10px]">{formatPrice(inv.price)}</span>}
                          {inv.pharmacies && (
                            <a href={`tel:${inv.pharmacies.phone}`} className="btn-primary text-xs py-1.5 px-3 ml-auto">
                              <Phone className="w-3.5 h-3.5" /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export { Filter };
