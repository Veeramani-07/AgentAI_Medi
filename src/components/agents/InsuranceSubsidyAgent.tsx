import { useState, useMemo } from "react";
import {
  ShieldCheck, IndianRupee, FileText, CheckCircle2,
  Award, Percent, ArrowRight, Sparkles, Search,
} from "lucide-react";
import { SUBSIDY_CATALOG, type SubsidyCatalogEntry } from "@/lib/agentKnowledgeBase";
import { INDIAN_STATES } from "@/lib/utils";

const STATE_SCHEME_MAP: Record<string, string> = {
  "Tamil Nadu":       "Chief Minister Comprehensive Health Insurance (CMCHIS)",
  "Maharashtra":      "Mahatma Jyotirao Phule Jan Arogya Yojana (MPJAY)",
  "Karnataka":        "Arogya Sanjeevini Yojana",
  "Delhi":            "Farishtay Scheme / DGEHS",
  "Uttar Pradesh":    "Mukhyamantri Jan Arogya Yojana (UP-PMJAY)",
  "West Bengal":      "Swasthya Sathi Scheme",
  "Andhra Pradesh":   "YSR Aarogyasri Health Scheme",
  "Rajasthan":        "Mukhyamantri Chiranjeevi Swasthya Bima Yojana",
  "Madhya Pradesh":   "Mukhyamantri Swasthya Seva Guarantee Yojana",
  "Bihar":            "Bihar State Health Society PMJAY",
  "Gujarat":          "MA Yojana (Mukhyamantri Amrutum)",
  "Punjab":           "Sarbat Sehat Bima Yojana",
  "Telangana":        "Telangana State PMJAY / Aarogyasri",
  "Kerala":           "Karunya Arogya Suraksha Padhathi (KASP)",
};

export function InsuranceSubsidyAgent() {
  const [searchQuery, setSearchQuery]       = useState("Insulin");
  const [hasAyushmanCard, setHasAyushmanCard] = useState(true);
  const [patientState, setPatientState]     = useState("Tamil Nadu");
  const [quantity, setQuantity]             = useState(1);

  // ── Dynamically match the subsidy catalog to user's medicine search ──
  const matchedEntry: SubsidyCatalogEntry | null = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return null;
    return SUBSIDY_CATALOG.find(e => e.keywords.test(q)) ?? null;
  }, [searchQuery]);

  const allMatches: SubsidyCatalogEntry[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUBSIDY_CATALOG;
    return SUBSIDY_CATALOG.filter(e => e.keywords.test(q) || e.medicineName.toLowerCase().includes(q));
  }, [searchQuery]);

  const stateScheme = STATE_SCHEME_MAP[patientState] ?? "State Health Insurance Scheme";
  const brandTotal  = matchedEntry ? matchedEntry.mrp * quantity : 0;
  const jaTotal     = matchedEntry ? matchedEntry.janAushadhiPrice * quantity : 0;
  const savings     = brandTotal - jaTotal;
  const savingsPct  = brandTotal > 0 ? Math.round((savings / brandTotal) * 100) : 0;
  const outOfPocket = hasAyushmanCard && matchedEntry?.ayushmanCovered ? 0 : jaTotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 mb-1">
              <Award className="w-3 h-3 text-amber-300" /> Agent 8 · AI Government Subsidy & Insurance Advisor
            </div>
            <h2 className="text-2xl font-black">Ayushman Bharat & PMBJP Subsidy Advisor</h2>
            <p className="text-xs text-emerald-100 font-medium">
              Type any medicine → AI instantly calculates PMJAY coverage, Jan Aushadhi savings, and out-of-pocket cost
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Patient Eligibility & Drug Input
          </h3>

          {/* Medicine Search */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Search Prescribed Medicine</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type medicine name (e.g. Insulin, Metformin, Atorvastatin, Pantoprazole, Cancer drug…)"
                className="input pl-9 text-sm font-semibold"
              />
            </div>
            {/* Quick medicine chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Insulin", "Metformin", "Atorvastatin", "Amoxicillin", "Pantoprazole", "Cancer"].map(drug => (
                <button
                  key={drug}
                  onClick={() => setSearchQuery(drug)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                    searchQuery.toLowerCase() === drug.toLowerCase()
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {drug}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Quantity / Strips / Units</label>
            <input
              type="number"
              min={1}
              max={120}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input text-sm font-semibold w-28"
            />
          </div>

          {/* PMJAY Card & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Ayushman Bharat (PMJAY) Card?</label>
              <select
                value={hasAyushmanCard ? "YES" : "NO"}
                onChange={e => setHasAyushmanCard(e.target.value === "YES")}
                className="input text-sm font-bold text-emerald-800 bg-emerald-50 border-emerald-200"
              >
                <option value="YES">✅ Active PMJAY Gold Card</option>
                <option value="NO">❌ No PMJAY Card</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Beneficiary State</label>
              <select
                value={patientState}
                onChange={e => setPatientState(e.target.value)}
                className="input text-sm"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Catalog matches */}
          {allMatches.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">All matching drugs in catalog:</p>
              <div className="space-y-1">
                {allMatches.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(e.medicineName.split(" ")[0])}
                    className="w-full text-left px-3 py-2 rounded-xl border text-xs font-bold bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex items-center justify-between"
                  >
                    <span>{e.medicineName}</span>
                    <span className="text-emerald-700">MRP ₹{e.mrp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="card p-5 border-2 border-emerald-200 bg-emerald-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Percent className="w-4 h-4 text-emerald-600" /> AI Subsidy & Price Breakdown
          </h3>

          {!matchedEntry ? (
            <div className="py-12 text-center text-slate-500 text-sm font-semibold">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Type a medicine name above to see instant subsidy calculation →
            </div>
          ) : (
            <div className="space-y-3 text-xs animate-fade-in">
              {/* Medicine name */}
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="font-black text-slate-900 text-sm">{matchedEntry.medicineName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Quantity: {quantity} unit{quantity !== 1 ? "s" : ""}</div>
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Brand MRP (Total)</div>
                  <div className="text-2xl font-black text-rose-700 mt-1">₹{brandTotal.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">@ ₹{matchedEntry.mrp} per unit</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md">
                  <div className="text-[10px] font-bold text-emerald-200 uppercase">Jan Aushadhi Price (Total)</div>
                  <div className="text-2xl font-black mt-1">₹{jaTotal.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-emerald-100 mt-0.5">Save {savingsPct}% → ₹{savings.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* PMJAY Coverage */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> PMJAY Ayushman Coverage
                  </span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    matchedEntry.ayushmanCovered && hasAyushmanCard
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {matchedEntry.ayushmanCovered && hasAyushmanCard ? "100% Cashless" : matchedEntry.ayushmanCovered ? "Eligible (No Card)" : "Not Covered"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {hasAyushmanCard && matchedEntry.ayushmanCovered
                    ? `✅ Eligible for 100% cashless coverage under ${stateScheme} at empanelled hospitals.`
                    : !matchedEntry.ayushmanCovered
                    ? "⚠ This drug is not covered under PMJAY outpatient package. Purchase at Jan Aushadhi Kendra for maximum savings."
                    : "💳 Register a PMJAY card at your nearest Jan Aushadhi Kendra or Common Service Centre to unlock free coverage."}
                </p>
              </div>

              {/* State Scheme */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px]">
                <strong>State Scheme ({patientState}):</strong> {stateScheme}
              </div>

              {/* Out of pocket */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Final Out-Of-Pocket Cost</div>
                  <div className={`text-xl font-black ${outOfPocket === 0 ? "text-emerald-400" : "text-amber-300"}`}>
                    {outOfPocket === 0 ? "₹0 — Fully Covered!" : `₹${outOfPocket.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg">
                  Total Savings: ₹{savings.toLocaleString("en-IN")} ({savingsPct}%)
                </span>
              </div>

              <div className="text-[10px] text-slate-500 leading-relaxed">
                {matchedEntry.coverageNote}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
