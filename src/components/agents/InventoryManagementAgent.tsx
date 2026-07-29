import { useState, useMemo } from "react";
import { Package, AlertTriangle, Clock, Trash2, RefreshCw, TrendingDown, CheckCircle2, XCircle, ChevronRight, BarChart3, Zap, Search } from "lucide-react";

interface InventoryItem {
  medicineName: string;
  genericName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  pricePerUnit: number;
  batchNumber: string;
  expiryDate: string;
  lastSaleDate: string;
  dailySalesRate: number;
  status: "healthy" | "low" | "critical" | "expired" | "expiring-soon";
}

const DEMO_INVENTORY: InventoryItem[] = [
  { medicineName: "Paracetamol 650mg", genericName: "Paracetamol", category: "Analgesic", currentStock: 450, minThreshold: 100, maxCapacity: 1000, pricePerUnit: 12.50, batchNumber: "BT-2026-0451", expiryDate: "2027-06-15", lastSaleDate: "2026-07-28", dailySalesRate: 25, status: "healthy" },
  { medicineName: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotic", currentStock: 35, minThreshold: 50, maxCapacity: 500, pricePerUnit: 18.00, batchNumber: "BT-2026-0223", expiryDate: "2026-12-01", lastSaleDate: "2026-07-28", dailySalesRate: 12, status: "low" },
  { medicineName: "Insulin Glargine", genericName: "Insulin", category: "Diabetic", currentStock: 8, minThreshold: 20, maxCapacity: 100, pricePerUnit: 850.00, batchNumber: "BT-2026-0109", expiryDate: "2026-09-30", lastSaleDate: "2026-07-27", dailySalesRate: 3, status: "critical" },
  { medicineName: "Azithromycin 250mg", genericName: "Azithromycin", category: "Antibiotic", currentStock: 60, minThreshold: 30, maxCapacity: 400, pricePerUnit: 65.00, batchNumber: "BT-2025-1102", expiryDate: "2026-08-05", lastSaleDate: "2026-07-25", dailySalesRate: 5, status: "expiring-soon" },
  { medicineName: "Cetrizine 10mg", genericName: "Cetirizine", category: "Antihistamine", currentStock: 0, minThreshold: 40, maxCapacity: 600, pricePerUnit: 8.00, batchNumber: "BT-2025-0788", expiryDate: "2026-01-10", lastSaleDate: "2026-07-20", dailySalesRate: 8, status: "expired" },
  { medicineName: "Metformin 500mg", genericName: "Metformin", category: "Diabetic", currentStock: 220, minThreshold: 80, maxCapacity: 500, pricePerUnit: 5.50, batchNumber: "BT-2026-0334", expiryDate: "2027-11-20", lastSaleDate: "2026-07-28", dailySalesRate: 15, status: "healthy" },
  { medicineName: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastro", currentStock: 18, minThreshold: 25, maxCapacity: 300, pricePerUnit: 22.00, batchNumber: "BT-2026-0556", expiryDate: "2027-03-01", lastSaleDate: "2026-07-28", dailySalesRate: 7, status: "low" },
  { medicineName: "Atorvastatin 10mg", genericName: "Atorvastatin", category: "Cardiac", currentStock: 95, minThreshold: 40, maxCapacity: 400, pricePerUnit: 35.00, batchNumber: "BT-2026-0672", expiryDate: "2028-01-15", lastSaleDate: "2026-07-27", dailySalesRate: 6, status: "healthy" },
];

const STATUS_STYLES: Record<string, { bg: string; badge: string; label: string; bar: string; icon: typeof CheckCircle2 }> = {
  "healthy":       { bg: "border-emerald-200 bg-emerald-50/60",      badge: "bg-emerald-100 text-emerald-900 border border-emerald-300",     label: "✔ Healthy Stock", bar: "bg-emerald-500", icon: CheckCircle2 },
  "low":           { bg: "border-amber-200 bg-amber-50/60",           badge: "bg-amber-100 text-amber-900 border border-amber-300",           label: "⚠ Low Stock",     bar: "bg-amber-500",   icon: TrendingDown },
  "critical":      { bg: "border-red-300 bg-red-50/60",               badge: "bg-red-100 text-red-900 border border-red-300",                 label: "🚨 Critical",     bar: "bg-red-500",     icon: AlertTriangle },
  "expired":       { bg: "border-slate-300 bg-slate-100/60",          badge: "bg-slate-200 text-slate-800 border border-slate-400",           label: "✖ Expired",       bar: "bg-slate-400",   icon: XCircle },
  "expiring-soon": { bg: "border-orange-200 bg-orange-50/60",         badge: "bg-orange-100 text-orange-900 border border-orange-300",        label: "⏰ Expiring Soon", bar: "bg-orange-500",  icon: Clock },
};

export function InventoryManagementAgent() {
  const [inventory] = useState<InventoryItem[]>(DEMO_INVENTORY);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [executed, setExecuted] = useState(true);
  const [loading, setLoading] = useState(false);

  function runAudit() {
    setLoading(true);
    setTimeout(() => { setExecuted(true); setLoading(false); }, 1400);
  }

  const filtered = useMemo(() => {
    return inventory.filter((i) => {
      const matchFilter = filter === "all" || i.status === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || i.medicineName.toLowerCase().includes(q) || i.genericName.toLowerCase().includes(q) || i.batchNumber.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [inventory, filter, searchQuery]);
  const healthyCount = inventory.filter((i) => i.status === "healthy").length;
  const lowCount = inventory.filter((i) => i.status === "low" || i.status === "critical").length;
  const expiredCount = inventory.filter((i) => i.status === "expired" || i.status === "expiring-soon").length;
  const totalValue = inventory.reduce((s, i) => s + i.currentStock * i.pricePerUnit, 0);

  const FILTERS = [
    { key: "all", label: "All", color: "bg-sky-600 text-white border-sky-600" },
    { key: "healthy", label: "Healthy", color: "bg-emerald-600 text-white border-emerald-600" },
    { key: "low", label: "Low Stock", color: "bg-amber-500 text-white border-amber-500" },
    { key: "critical", label: "Critical", color: "bg-red-600 text-white border-red-600" },
    { key: "expiring-soon", label: "Expiring", color: "bg-orange-500 text-white border-orange-500" },
    { key: "expired", label: "Expired", color: "bg-slate-500 text-white border-slate-500" },
  ];

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #0c2a52 40%, #0d9488 80%, #059669 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0d9488, transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}>
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 2 — Stock Audit
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Inventory Management Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Track stock levels, detect low inventory, flag expired medicines &amp; send restocking alerts
            </p>
          </div>
        </div>
      </div>

      {/* ── Run Audit ── */}
      <div className="rounded-2xl border-2 border-teal-200 bg-white p-5 shadow">
        <button
          onClick={runAudit}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #0d9488 0%, #0284c7 50%, #059669 100%)" }}
        >
          {loading ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Running Inventory Audit…</>
          ) : (
            <><BarChart3 className="w-5 h-5" /> {executed ? "Re-Run" : "Execute"} Inventory Audit</>
          )}
        </button>
      </div>

      {executed && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Medicines", value: inventory.length, color: "from-sky-700 to-sky-500", icon: "💊" },
              { label: "Healthy Stock", value: healthyCount, color: "from-emerald-700 to-emerald-500", icon: "✅" },
              { label: "Low / Critical", value: lowCount, color: "from-amber-700 to-amber-500", icon: "⚠️" },
              { label: "Expired / Expiring", value: expiredCount, color: "from-red-700 to-red-500", icon: "🚫" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${stat.color} text-center`}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black leading-none">{stat.value}</div>
                <div className="text-[11px] font-bold text-white/80 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Inventory Value */}
          <div className="rounded-2xl border-2 border-sky-200 bg-white p-4 flex items-center justify-between shadow">
            <div>
              <div className="text-xs font-black text-sky-700 uppercase tracking-widest">Total Inventory Value</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Based on current stock × unit price</div>
            </div>
            <div className="text-2xl font-black text-sky-900">
              ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by medicine name, generic composition, or batch number..."
                className="w-full rounded-xl border-2 border-teal-200 bg-teal-50/40 pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-400/30 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 whitespace-nowrap transition-all ${
                    filter === f.key ? f.color : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-800"
                  }`}
                >
                  {f.label} {f.key !== "all" && `(${inventory.filter((i) => i.status === f.key).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Cards */}
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const style = STATUS_STYLES[item.status];
              const Icon = style.icon;
              const daysLeft = Math.max(0, Math.round((new Date(item.expiryDate).getTime() - Date.now()) / 86400000));
              const daysStock = item.dailySalesRate > 0 ? Math.round(item.currentStock / item.dailySalesRate) : 999;
              const stockPercent = Math.round((item.currentStock / item.maxCapacity) * 100);

              return (
                <div key={i} className={`rounded-2xl border-2 ${style.bg} p-4 shadow-sm hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-black text-slate-900 text-base">{item.medicineName}</h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${style.badge}`}>
                          <Icon className="w-3 h-3" /> {style.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">
                        {item.genericName} · {item.category} · <span className="font-mono">{item.batchNumber}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-slate-900">{item.currentStock}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">of {item.maxCapacity} units</div>
                    </div>
                  </div>

                  {/* Stock Bar */}
                  <div className="mt-3 w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${style.bar}`}
                      style={{ width: `${Math.min(stockPercent, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-500">
                    <span>0</span>
                    <span>{stockPercent}% filled</span>
                    <span>{item.maxCapacity}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-white border border-slate-200 p-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Price</div>
                      <div className="font-black text-slate-800 mt-0.5">₹{item.pricePerUnit}</div>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Daily Sales</div>
                      <div className="font-black text-slate-800 mt-0.5">{item.dailySalesRate}/day</div>
                    </div>
                    <div className={`rounded-lg bg-white border p-2 ${daysStock <= 3 ? "border-red-300" : "border-slate-200"}`}>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Stock Days</div>
                      <div className={`font-black mt-0.5 ${daysStock <= 3 ? "text-red-700" : "text-slate-800"}`}>{daysStock} days</div>
                    </div>
                    <div className={`rounded-lg bg-white border p-2 ${daysLeft <= 30 ? "border-red-300" : "border-slate-200"}`}>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Expiry</div>
                      <div className={`font-black mt-0.5 text-[11px] ${daysLeft <= 30 ? "text-red-700" : "text-slate-800"}`}>{item.expiryDate} ({daysLeft}d)</div>
                    </div>
                  </div>

                  {(item.status === "low" || item.status === "critical") && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-100 border-2 border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                      {item.status === "critical" ? "🚨 CRITICAL: Reorder immediately!" : "⚠ Low stock detected. Schedule restocking."} Only {daysStock} days of supply remaining.
                    </div>
                  )}
                  {item.status === "expired" && (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-100 border-2 border-red-300 text-xs font-bold text-red-900 flex items-center gap-2">
                      <Trash2 className="w-4 h-4 shrink-0 text-red-700" />
                      ✖ EXPIRED: Remove from shelf. Batch {item.batchNumber} expired on {item.expiryDate}.
                    </div>
                  )}
                  {item.status === "expiring-soon" && (
                    <div className="mt-3 p-2.5 rounded-xl bg-orange-100 border-2 border-orange-300 text-xs font-bold text-orange-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-orange-700" />
                      ⏰ Expiring in {daysLeft} days. Prioritize sales or return to distributor.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Process Flow */}
          <div className="rounded-2xl border-2 border-teal-100 bg-teal-50 p-5">
            <h3 className="text-xs font-black text-teal-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {["Track stock levels", "Update after each sale", "Detect low stock", "Flag expired medicines", "Send restocking alerts"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white text-teal-900 border-2 border-teal-200 shadow-sm">{step}</span>
                  {i < 4 && <ChevronRight className="w-4 h-4 text-teal-300" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
