import { useMemo, useState } from "react";
import {
  Wind, HeartPulse, BedDouble, Stethoscope, Truck, Droplet, Activity,
  Search, ChevronDown, Filter, Plus, Phone, MapPin,
} from "lucide-react";
import { useEquipment } from "@/lib/hooks";
import { EQUIPMENT_TYPES } from "@/lib/utils";
import { EquipmentStatusBadge, PharmacyTypeBadge, EmptyState, LoadingSpinner } from "./Badges";
import type { EquipmentType } from "@/lib/types";

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

export function EquipmentTracker({ onAdd }: { onAdd: () => void }) {
  const [filter, setFilter] = useState<EquipmentType | "all">("all");
  const [query, setQuery] = useState("");
  const { rows, loading } = useEquipment(filter);

  const stats = useMemo(() => {
    const total = rows.length;
    const available = rows.filter((r) => r.status === "available").length;
    const limited = rows.filter((r) => r.status === "limited").length;
    const out = rows.filter((r) => r.status === "out-of-stock").length;
    return { total, available, limited, out };
  }, [rows]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      r.equipment_type.toLowerCase().includes(q) ||
      r.pharmacies?.name?.toLowerCase().includes(q) ||
      r.pharmacies?.city?.toLowerCase().includes(q) ||
      r.pharmacies?.state?.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const r of filtered) {
      const arr = map.get(r.equipment_type) || [];
      arr.push(r);
      map.set(r.equipment_type, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Header + stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="section-eyebrow"><HeartPulse className="w-4 h-4" /> Live Equipment Tracker</div>
          <h2 className="text-2xl font-bold text-ink-900 mt-1">Medical equipment availability</h2>
          <p className="text-sm text-ink-500 mt-1">Real-time stock of ventilators, oxygen, ICU beds and more across India.</p>
        </div>
        <button onClick={onAdd} className="btn-accent shrink-0">
          <Plus className="w-4 h-4" /> Add / Update Equipment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox icon={Activity} label="Total records" value={stats.total} tone="primary" />
        <StatBox icon={Droplet} label="Available" value={stats.available} tone="success" />
        <StatBox icon={Filter} label="Limited" value={stats.limited} tone="warning" />
        <StatBox icon={Wind} label="Out of stock" value={stats.out} tone="error" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by equipment, pharmacy, city…"
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as EquipmentType | "all")}
            className="input appearance-none pr-10 min-w-[200px] cursor-pointer"
          >
            <option value="all">All equipment types</option>
            {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading equipment data…" /> : grouped.length === 0 ? (
        <EmptyState title="No equipment found" subtitle="Try a different filter or add a new equipment record." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([type, items]) => {
            const Icon = EQUIPMENT_ICONS[type] || Stethoscope;
            return (
              <div key={type} className="card overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-secondary-50 to-primary-50 border-b border-ink-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Icon className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900">{type}</h3>
                      <p className="text-xs text-ink-500">{items.length} location{items.length === 1 ? "" : "s"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {items.filter((i) => i.status === "available").length > 0 && (
                      <span className="chip-success text-[10px]">{items.filter((i) => i.status === "available").length} available</span>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-ink-100">
                  {items.map((item) => (
                    <div key={item.id} className="px-5 py-4 hover:bg-ink-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-ink-900 truncate">{item.pharmacies?.name}</h4>
                            {item.pharmacies && <PharmacyTypeBadge type={item.pharmacies.pharmacy_type} />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-ink-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {item.pharmacies?.city}, {item.pharmacies?.state}
                          </div>
                        </div>
                        <EquipmentStatusBadge status={item.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-2.5 text-sm">
                        <span className="text-ink-600">
                          <span className="font-bold text-ink-900 tabular-nums">{item.available_count}</span>
                          <span className="text-ink-400"> / {item.total_count} available</span>
                        </span>
                        <div className="flex-1 max-w-[160px] h-2 rounded-full bg-ink-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.status === "available" ? "bg-success-500" :
                              item.status === "limited" ? "bg-warning-500" :
                              item.status === "out-of-stock" ? "bg-error-400" : "bg-secondary-400"
                            }`}
                            style={{ width: `${item.total_count > 0 ? (item.available_count / item.total_count) * 100 : 0}%` }}
                          />
                        </div>
                        {item.pharmacies && (
                          <a href={`tel:${item.pharmacies.phone}`} className="btn-ghost px-2 py-1 text-xs">
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>
                        )}
                      </div>
                      {item.condition_note && (
                        <p className="text-xs text-ink-500 mt-2 italic">{item.condition_note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, tone }: {
  icon: typeof Wind; label: string; value: number; tone: "primary" | "success" | "warning" | "error";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-700 border-primary-100",
    success: "bg-success-50 text-success-700 border-success-100",
    warning: "bg-warning-50 text-warning-700 border-warning-100",
    error: "bg-error-50 text-error-700 border-error-100",
  };
  return (
    <div className={`rounded-xl border p-3.5 ${tones[tone]}`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}
