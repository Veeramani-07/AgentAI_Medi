import { useState } from "react";
import { Search, MapPin, Pill, Star, Clock, Truck, ChevronRight, AlertTriangle, CheckCircle2, Building2, IndianRupee, Zap, TrendingDown } from "lucide-react";

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

interface GenericAlternative {
  name: string;
  genericName: string;
  manufacturer: string;
  avgPrice: number;
  savingsPercent: number;
}

const DEMO_RESULTS: SearchResult[] = [
  { pharmacyName: "Apollo Pharmacy", city: "Chennai", state: "Tamil Nadu", distanceKm: 1.8, inStock: true, quantity: 45, pricePerUnit: 12.50, is24x7: true, homeDelivery: true, rating: 4.8, pharmacyType: "urban" },
  { pharmacyName: "MedPlus", city: "Chennai", state: "Tamil Nadu", distanceKm: 3.2, inStock: true, quantity: 120, pricePerUnit: 11.80, is24x7: true, homeDelivery: true, rating: 4.6, pharmacyType: "urban" },
  { pharmacyName: "Netmeds Pharmacy", city: "Chennai", state: "Tamil Nadu", distanceKm: 4.5, inStock: true, quantity: 30, pricePerUnit: 10.50, is24x7: false, homeDelivery: true, rating: 4.4, pharmacyType: "urban" },
  { pharmacyName: "Jan Aushadhi Kendra", city: "Kanchipuram", state: "Tamil Nadu", distanceKm: 12.0, inStock: true, quantity: 200, pricePerUnit: 3.50, is24x7: false, homeDelivery: false, rating: 4.2, pharmacyType: "semi-urban" },
  { pharmacyName: "Village Health Store", city: "Sriperumbudur", state: "Tamil Nadu", distanceKm: 25.0, inStock: true, quantity: 15, pricePerUnit: 14.00, is24x7: false, homeDelivery: false, rating: 4.0, pharmacyType: "rural" },
];

const DEMO_GENERICS: GenericAlternative[] = [
  { name: "Crocin Advance", genericName: "Paracetamol 650mg", manufacturer: "GSK Pharma", avgPrice: 12.50, savingsPercent: 0 },
  { name: "Dolo 650", genericName: "Paracetamol 650mg", manufacturer: "Micro Labs", avgPrice: 11.80, savingsPercent: 6 },
  { name: "P-650 (Generic)", genericName: "Paracetamol 650mg", manufacturer: "Cipla", avgPrice: 3.50, savingsPercent: 72 },
  { name: "Pacimol 650", genericName: "Paracetamol 650mg", manufacturer: "Ipca Labs", avgPrice: 4.20, savingsPercent: 66 },
];

export function MedicineSearchAgent() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [generics, setGenerics] = useState<GenericAlternative[]>([]);
  const [showGenerics, setShowGenerics] = useState(false);

  function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setResults(DEMO_RESULTS);
      setGenerics(DEMO_GENERICS);
      setSearched(true);
      setLoading(false);
    }, 1200);
  }

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
              <Zap className="w-3 h-3" /> Agent 1 — Live Search
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Medicine Search &amp; Availability</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Real-time stock, price &amp; distance — across every pharmacy in India
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Input ── */}
      <div className="rounded-2xl border-2 border-sky-200/80 shadow-lg bg-white p-5">
        <label className="block text-sm font-black text-sky-900 mb-2 uppercase tracking-wide">
          🔍 Search Medicine Name
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sky-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Paracetamol 650mg, Amoxicillin 500mg, Insulin..."
              className="w-full rounded-xl border-2 border-sky-200 bg-sky-50/50 pl-10 pr-4 py-3 text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-7 py-3 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #10b981 100%)" }}
          >
            {loading ? "Searching…" : "Search Now"}
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="rounded-2xl border-2 border-sky-100 bg-white p-10 text-center animate-pulse shadow">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0284c7, #10b981)" }}>
            <Search className="w-7 h-7 text-white" />
          </div>
          <p className="text-base font-black text-sky-800">Scanning pharmacies across India…</p>
          <p className="text-sm text-slate-500 mt-1 font-medium">Querying live network for <span className="text-sky-700 font-extrabold">"{query}"</span></p>
        </div>
      )}

      {/* ── Results ── */}
      {searched && !loading && (
        <>
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

          {/* Pharmacy List */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-sky-950 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" /> Nearby Pharmacies with Stock
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
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Generic Alternatives */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow p-5">
            <button onClick={() => setShowGenerics(!showGenerics)} className="w-full flex items-center justify-between">
              <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-600" /> Generic Alternatives &amp; Price Comparison
              </h3>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showGenerics ? "rotate-90" : ""}`} />
            </button>
            {showGenerics && (
              <div className="mt-4 space-y-2.5">
                {generics.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div>
                      <div className="font-black text-sm text-emerald-950">{g.name}</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">{g.genericName} · {g.manufacturer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-emerald-900">₹{g.avgPrice.toFixed(2)}</div>
                      {g.savingsPercent > 0 && (
                        <div className="text-[11px] font-black text-emerald-600 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0.5 mt-0.5">
                          Save {g.savingsPercent}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-xl bg-emerald-900/10 border border-emerald-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 font-semibold">
                    Jan Aushadhi generic medicines are government-subsidized and cost up to <strong>72% less</strong> than branded equivalents. Always verify with your pharmacist.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Process Flow */}
          <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-5">
            <h3 className="text-xs font-black text-sky-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {["User enters medicine name", "Agent queries all pharmacies", "Filters by stock & distance", "Shows price comparison", "Lists generic alternatives"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white text-sky-900 border-2 border-sky-200 shadow-sm">{step}</span>
                  {i < 4 && <ChevronRight className="w-4 h-4 text-sky-300" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
