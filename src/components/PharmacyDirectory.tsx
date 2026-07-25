import { useMemo, useState } from "react";
import { Search, ChevronDown, MapPin, Navigation, Plus, Building2 } from "lucide-react";
import { usePharmacies, useEquipment } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { PharmacyDirectoryCard } from "./PharmacyCard";
import { PharmacyTypeBadge } from "./Badges";
import { LoadingSpinner, EmptyState } from "./Badges";
import { INDIAN_STATES } from "@/lib/utils";
import type { PharmacyType } from "@/lib/types";
import { useEffect } from "react";

export function PharmacyDirectory({ userLat, userLng, onAdd }: {
  userLat: number | null; userLng: number | null; onAdd: () => void;
}) {
  const { pharmacies, loading } = usePharmacies(userLat, userLng);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PharmacyType | "all">("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [only24x7, setOnly24x7] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [invCounts, setInvCounts] = useState<Record<string, number>>({});
  const [eqCounts, setEqCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const [{ data: inv }, { data: eq }] = await Promise.all([
        supabase.from("pharmacy_inventory").select("pharmacy_id"),
        supabase.from("pharmacy_equipment").select("pharmacy_id"),
      ]);
      const invMap: Record<string, number> = {};
      for (const r of inv || []) invMap[r.pharmacy_id] = (invMap[r.pharmacy_id] || 0) + 1;
      const eqMap: Record<string, number> = {};
      for (const r of eq || []) eqMap[r.pharmacy_id] = (eqMap[r.pharmacy_id] || 0) + 1;
      setInvCounts(invMap);
      setEqCounts(eqMap);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = pharmacies;
    if (typeFilter !== "all") list = list.filter((p) => p.pharmacy_type === typeFilter);
    if (stateFilter !== "all") list = list.filter((p) => p.state === stateFilter);
    if (only24x7) list = list.filter((p) => p.is_24x7);
    if (onlyDelivery) list = list.filter((p) => p.home_delivery);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (a.distance_km != null && b.distance_km != null) return a.distance_km - b.distance_km;
      return b.rating - a.rating;
    });
  }, [pharmacies, typeFilter, stateFilter, only24x7, onlyDelivery, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="section-eyebrow"><Building2 className="w-4 h-4" /> Pharmacy Directory</div>
          <h2 className="text-2xl font-bold text-ink-900 mt-1">{pharmacies.length} pharmacies across India</h2>
          <p className="text-sm text-ink-500 mt-1">Filter by location, type, or services. Call ahead to confirm stock.</p>
        </div>
        <button onClick={onAdd} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Add Pharmacy</button>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, city, or address…" className="input pl-10" />
          </div>
          <div className="relative">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as PharmacyType | "all")} className="input appearance-none pr-10 min-w-[150px] cursor-pointer">
              <option value="all">All types</option>
              <option value="urban">Urban</option>
              <option value="semi-urban">Semi-urban</option>
              <option value="rural">Rural</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="input appearance-none pr-10 min-w-[160px] cursor-pointer">
              <option value="all">All states</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <ToggleChip active={only24x7} onClick={() => setOnly24x7((v) => !v)}>Open 24x7</ToggleChip>
          <ToggleChip active={onlyDelivery} onClick={() => setOnlyDelivery((v) => !v)}>Home delivery</ToggleChip>
          {userLat != null && <span className="chip-secondary"><Navigation className="w-3 h-3" /> Sorted by distance</span>}
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading pharmacies…" /> : filtered.length === 0 ? (
        <EmptyState icon={MapPin} title="No pharmacies match" subtitle="Try clearing filters or searching a different city." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PharmacyDirectoryCard
              key={p.id}
              pharmacy={p}
              inventoryCount={invCounts[p.id]}
              equipmentCount={eqCounts[p.id]}
            />
          ))}
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
