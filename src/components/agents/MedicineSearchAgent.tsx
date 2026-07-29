import { useState, useMemo } from "react";
import { Search, MapPin, Pill, Star, Clock, Truck, ChevronRight, AlertTriangle, CheckCircle2, Building2, IndianRupee, Zap, TrendingDown, BookOpen, ShieldAlert, Activity } from "lucide-react";
import { DETAILED_MEDICINES, getDetailedMedicineByName, type DetailedMedicine } from "@/lib/medicineDetailsData";

interface SearchResult {
  pharmacyName: string;
  city: string;
  state: string;
  distanceKm: number;
  inStock: boolean;
  quantity: number;
  pricePerUnit: number;
  is24x7: boolean;
  homeDelivery: boolean;
  rating: number;
  pharmacyType: "urban" | "rural" | "semi-urban";
}

const DEMO_RESULTS: SearchResult[] = [
  { pharmacyName: "Apollo Pharmacy", city: "Chennai", state: "Tamil Nadu", distanceKm: 1.8, inStock: true, quantity: 45, pricePerUnit: 12.50, is24x7: true, homeDelivery: true, rating: 4.8, pharmacyType: "urban" },
  { pharmacyName: "MedPlus Pharmacy", city: "Chennai", state: "Tamil Nadu", distanceKm: 3.2, inStock: true, quantity: 120, pricePerUnit: 11.80, is24x7: true, homeDelivery: true, rating: 4.6, pharmacyType: "urban" },
  { pharmacyName: "Netmeds Pharmacy", city: "Chennai", state: "Tamil Nadu", distanceKm: 4.5, inStock: true, quantity: 30, pricePerUnit: 10.50, is24x7: false, homeDelivery: true, rating: 4.4, pharmacyType: "urban" },
  { pharmacyName: "Jan Aushadhi Kendra", city: "Kanchipuram", state: "Tamil Nadu", distanceKm: 12.0, inStock: true, quantity: 200, pricePerUnit: 3.50, is24x7: false, homeDelivery: false, rating: 4.2, pharmacyType: "semi-urban" },
  { pharmacyName: "Village Health Store", city: "Sriperumbudur", state: "Tamil Nadu", distanceKm: 25.0, inStock: true, quantity: 15, pricePerUnit: 14.00, is24x7: false, homeDelivery: false, rating: 4.0, pharmacyType: "rural" },
];

export function MedicineSearchAgent() {
  const [query, setQuery] = useState("Dolo 650");
  const [showGenerics, setShowGenerics] = useState(true);

  // Directly derive matched medicine from dataset or query
  const activeMedicine: DetailedMedicine | null = useMemo(() => {
    if (!query.trim()) return DETAILED_MEDICINES[0];
    return getDetailedMedicineByName(query);
  }, [query]);

  // Derive search results dynamically based on selected medicine
  const results: SearchResult[] = useMemo(() => {
    if (!activeMedicine) return [];
    const basePrice = activeMedicine.pricePerUnit;
    return DEMO_RESULTS.map((r, idx) => ({
      ...r,
      pricePerUnit: idx === 3 ? activeMedicine.genericAlternative.avgPrice : Math.max(2, basePrice + (idx - 1) * 1.2),
      quantity: idx === 0 ? 45 : idx === 1 ? 120 : idx === 2 ? 30 : idx === 3 ? 200 : 15,
    }));
  }, [activeMedicine]);

  const totalStock = results.reduce((s, r) => s + r.quantity, 0);
  const avgPrice = results.length ? results.reduce((s, r) => s + r.pricePerUnit, 0) / results.length : 0;
  const cheapest = results.length ? Math.min(...results.map((r) => r.pricePerUnit)) : 0;

  const typeColor: Record<string, string> = {
    urban: "bg-sky-900/60 text-sky-200 border border-sky-500/40",
    "semi-urban": "bg-violet-900/60 text-violet-200 border border-violet-500/40",
    rural: "bg-amber-900/60 text-amber-200 border border-amber-500/40",
  };

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #0c2a52 40%, #0284c7 80%, #10b981 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #0284c7, #10b981)" }}>
            <Search className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 1 — Live Search &amp; AI Details
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Medicine Search &amp; Medical Details</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Real-time pharmacy stock, generic savings &amp; complete pharmacological information
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Input Box ── */}
      <div className="rounded-2xl border-2 border-sky-200/80 shadow-lg bg-white p-5">
        <label className="block text-sm font-black text-sky-900 mb-2 uppercase tracking-wide flex items-center justify-between">
          <span>🔍 Search Any Medicine or Generic Compound</span>
          <span className="text-xs font-semibold text-sky-600 lowercase">Showing direct AI output in real-time</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sky-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine name (e.g., Dolo 650, Augmentin 625, Azithromycin, Metformin, Pantocid 40)..."
            className="w-full rounded-xl border-2 border-sky-200 bg-sky-50/50 pl-10 pr-4 py-3 text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 outline-none transition-all"
          />
        </div>

        {/* Quick medicine pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-500 mr-1">Popular searches:</span>
          {DETAILED_MEDICINES.slice(0, 6).map((m) => (
            <button
              key={m.id}
              onClick={() => setQuery(m.name)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                query.toLowerCase().includes(m.name.toLowerCase())
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── AI Output (Displayed Directly) ── */}
      {!activeMedicine ? (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-black text-amber-950">No matching medicine found for "{query}"</h3>
          <p className="text-xs text-amber-800 font-semibold mt-1">
            No medicine entry in the project database matches your search term. Try clicking one of the popular search pills above or type a valid medicine name.
          </p>
        </div>
      ) : (
      <div className="space-y-5 animate-fade-in">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Pharmacies Found", value: results.length, color: "from-sky-700 to-sky-500", icon: "🏪" },
            { label: "Total Units Available", value: totalStock, color: "from-emerald-700 to-emerald-500", icon: "📦" },
            { label: "Lowest Price", value: `₹${cheapest.toFixed(2)}`, color: "from-violet-700 to-violet-500", icon: "💰" },
            { label: "Avg. Price", value: `₹${avgPrice.toFixed(2)}`, color: "from-amber-700 to-amber-500", icon: "📊" },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${stat.color} text-center`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black leading-none">{stat.value}</div>
              <div className="text-[11px] font-bold text-white/80 mt-1 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── AI Detailed Medicine Information Card ── */}
        <div className="rounded-3xl border-2 border-sky-300 bg-white shadow-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-full pointer-events-none opacity-60" />
          
          <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-sky-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-950 border border-sky-300 text-xs font-black">
                  {activeMedicine.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black">
                  {activeMedicine.form}
                </span>
                {activeMedicine.prescriptionRequired ? (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black">
                    Rx Required
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black">
                    OTC (Over-The-Counter)
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{activeMedicine.name}</h3>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                Generic Composition: <span className="text-sky-800 font-extrabold">{activeMedicine.genericName}</span> · Manufacturer: <span className="text-slate-800 font-extrabold">{activeMedicine.manufacturer}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-emerald-700 flex items-center justify-end gap-0.5">
                <IndianRupee className="w-5 h-5" />{activeMedicine.pricePerUnit.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 font-bold">Standard Market Unit Price</div>
            </div>
          </div>

          <p className="text-sm text-slate-700 font-medium leading-relaxed my-4 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-150">
            💡 <strong>Overview:</strong> {activeMedicine.description}
          </p>

          {/* Grid of detailed specifications */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Primary Uses & Indications */}
            <div className="rounded-2xl border-2 border-sky-100 bg-white p-4 shadow-sm">
              <h4 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600" /> Primary Therapeutic Uses &amp; Indications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeMedicine.uses.map((use, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-black border border-sky-200">
                    ✔ {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Standard Dosage & Administration */}
            <div className="rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-sm">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Recommended Dosage &amp; Frequency
              </h4>
              <p className="text-xs font-bold text-slate-800 leading-relaxed bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                {activeMedicine.standardDosage}
              </p>
            </div>

            {/* Mechanism of Action */}
            <div className="rounded-2xl border-2 border-indigo-100 bg-white p-4 shadow-sm">
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Mechanism of Action (How it works)
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {activeMedicine.mechanismOfAction}
              </p>
            </div>

            {/* Precautions & Warnings */}
            <div className="rounded-2xl border-2 border-amber-100 bg-white p-4 shadow-sm">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Precautions &amp; Warnings
              </h4>
              <ul className="space-y-1 text-xs font-semibold text-amber-950">
                {activeMedicine.precautions.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage & Side Effects Row */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[10px] block mb-1">⚠️ Common Side Effects:</span>
              <span className="text-slate-700 font-semibold">{activeMedicine.sideEffects.join(", ")}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[10px] block mb-1">📦 Storage Requirements:</span>
              <span className="text-slate-700 font-semibold">{activeMedicine.storageInfo}</span>
            </div>
          </div>
        </div>

        {/* Nearby Pharmacy List with Live Stock */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-sky-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" /> Nearby Pharmacies stocking {activeMedicine.name}
          </h3>
          {results.map((r, i) => (
            <div key={i} className="rounded-2xl border-2 border-sky-100 bg-white shadow hover:shadow-lg hover:border-sky-300 transition-all duration-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-black text-sky-950 text-base">{r.pharmacyName}</h4>
                    {r.is24x7 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black">
                        <Clock className="w-3 h-3" /> 24×7
                      </span>
                    )}
                    {r.homeDelivery && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-black">
                        <Truck className="w-3 h-3" /> Delivery
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black capitalize ${typeColor[r.pharmacyType]}`}>
                      {r.pharmacyType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {r.city}, {r.state}
                    <span className="ml-1 text-sky-700 font-black">{r.distanceKm} km away</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-sky-800 flex items-center gap-0.5 justify-end">
                    <IndianRupee className="w-4 h-4" />{r.pricePerUnit.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">per unit</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-sky-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {r.quantity} units in stock
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r.rating}
                  </span>
                </div>
                <button className="text-sky-600 font-black hover:text-sky-800 flex items-center gap-0.5 transition-colors">
                  View Stock Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generic Alternatives & Jan Aushadhi Savings */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow p-5">
          <button onClick={() => setShowGenerics(!showGenerics)} className="w-full flex items-center justify-between">
            <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" /> Jan Aushadhi Generic Alternative &amp; Price Savings
            </h3>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showGenerics ? "rotate-90" : ""}`} />
          </button>
          {showGenerics && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                <div>
                  <div className="font-black text-sm text-emerald-950">{activeMedicine.genericAlternative.name}</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">
                    {activeMedicine.genericAlternative.genericName} · {activeMedicine.genericAlternative.manufacturer}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-base text-emerald-900">₹{activeMedicine.genericAlternative.avgPrice.toFixed(2)}</div>
                  <div className="text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-400 rounded-full px-2.5 py-0.5 mt-0.5">
                    Save {activeMedicine.genericAlternative.savingsPercent}%
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-900/10 border border-emerald-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 font-semibold">
                  Jan Aushadhi generic medicines are government-subsidized bioequivalent formulas costing up to <strong>{activeMedicine.genericAlternative.savingsPercent}% less</strong> than branded alternatives ({activeMedicine.name}).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Process Flow */}
        <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-5">
          <h3 className="text-xs font-black text-sky-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {["Input search query", "Identify medicine catalog entry", "Retrieve stock & pharmacy distances", "Extract full medical specifications", "List bioequivalent Jan Aushadhi generics"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white text-sky-900 border-2 border-sky-200 shadow-sm">{step}</span>
                {i < 4 && <ChevronRight className="w-4 h-4 text-sky-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

