import { useState, useMemo } from "react";
import {
  ShieldCheck, IndianRupee, FileText, Award,
  Percent, Sparkles, Search, ExternalLink, Users, AlertCircle, Phone,
} from "lucide-react";
import { SUBSIDY_CATALOG, type SubsidyCatalogEntry } from "@/lib/agentKnowledgeBase";
import { INDIAN_STATES } from "@/lib/utils";

const STATE_SCHEME_MAP: Record<string, string> = {
  "Tamil Nadu":    "Chief Minister Comprehensive Health Insurance (CMCHIS) — ₹5L cover",
  "Maharashtra":   "Mahatma Jyotirao Phule Jan Arogya Yojana (MPJAY) — ₹5L cover",
  "Karnataka":     "Arogya Sanjeevini Yojana — ₹5L cover",
  "Delhi":         "Farishtay Scheme / DGEHS — ₹5L cover",
  "Uttar Pradesh": "Mukhyamantri Jan Arogya Yojana (UP-PMJAY) — ₹5L cover",
  "West Bengal":   "Swasthya Sathi Scheme — ₹5L cover",
  "Andhra Pradesh":"YSR Aarogyasri Health Scheme — ₹5L cover",
  "Rajasthan":     "Mukhyamantri Chiranjeevi Swasthya Bima Yojana — ₹25L cover",
  "Madhya Pradesh":"Mukhyamantri Swasthya Seva Guarantee Yojana — ₹5L cover",
  "Bihar":         "Bihar State Health Society PMJAY — ₹5L cover",
  "Gujarat":       "MA Yojana (Mukhyamantri Amrutum) — ₹5L cover",
  "Punjab":        "Sarbat Sehat Bima Yojana — ₹5L cover",
  "Telangana":     "Telangana State PMJAY / Aarogyasri — ₹5L cover",
  "Kerala":        "Karunya Arogya Suraksha Padhathi (KASP) — ₹5L cover",
  "Himachal Pradesh": "Him Care Scheme — ₹5L cover",
  "Jharkhand":     "Mukhyamantri Swasthya Bima Yojana — ₹5L cover",
  "Odisha":        "Biju Swasthya Kalyan Yojana (BSKY) — ₹5L cover (women ₹10L)",
  "Assam":         "Atal Amrit Abhiyan — ₹2L cover",
  "Chhattisgarh":  "Dr. Khubchand Baghel Swasthya Sahayata Yojana — ₹5L cover",
};

// Real Jan Aushadhi medicine prices (PMBJP 2024 price list)
const QUICK_DRUGS = ["Insulin", "Metformin", "Atorvastatin", "Amoxicillin", "Pantoprazole", "Azithromycin", "Amlodipine", "Cancer"];

export function InsuranceSubsidyAgent() {
  const [searchQuery, setSearchQuery] = useState("Insulin");
  const [hasAyushmanCard, setHasAyushmanCard] = useState(true);
  const [patientState, setPatientState] = useState("Tamil Nadu");
  const [quantity, setQuantity] = useState(1);

  const matchedEntry: SubsidyCatalogEntry | null = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return null;
    return SUBSIDY_CATALOG.find(e => e.keywords.test(q)) ?? null;
  }, [searchQuery]);

  const stateScheme = STATE_SCHEME_MAP[patientState] ?? "State Health Insurance Scheme — ₹5L cover";
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 mb-1">
              <Award className="w-3 h-3 text-amber-300" /> Agent 7 · Ayushman Bharat & PMBJP Subsidy Advisor
            </div>
            <h2 className="text-2xl font-black">Ayushman Bharat & Jan Aushadhi Subsidy Calculator</h2>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              Type any medicine → instant PMJAY coverage check, Jan Aushadhi price, and out-of-pocket cost
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Patient & Medicine Details
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Search Prescribed Medicine</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Insulin, Metformin, Atorvastatin, Cancer drug…"
                className="input pl-9 text-sm font-semibold"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_DRUGS.map(drug => (
                <button key={drug} onClick={() => setSearchQuery(drug)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                    searchQuery.toLowerCase() === drug.toLowerCase()
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                  }`}>
                  {drug}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Quantity / Strips</label>
            <input type="number" min={1} max={120} value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input text-sm font-semibold w-28" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">PMJAY Card Status</label>
              <select value={hasAyushmanCard ? "YES" : "NO"}
                onChange={e => setHasAyushmanCard(e.target.value === "YES")}
                className="input text-sm font-bold text-emerald-800 bg-emerald-50 border-emerald-200">
                <option value="YES">✅ Active PMJAY Card</option>
                <option value="NO">❌ No PMJAY Card</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">State</label>
              <select value={patientState} onChange={e => setPatientState(e.target.value)} className="input text-sm">
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="card p-5 border-2 border-emerald-200 bg-emerald-50/30 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Percent className="w-4 h-4 text-emerald-600" /> Subsidy & Price Breakdown
          </h3>

          {!matchedEntry ? (
            <div className="py-12 text-center text-slate-500 text-sm font-semibold">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Type a medicine name to see instant subsidy calculation
            </div>
          ) : (
            <div className="space-y-3 text-xs animate-fade-in">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="font-black text-slate-900 text-sm">{matchedEntry.medicineName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Qty: {quantity} unit{quantity !== 1 ? "s" : ""}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Brand MRP</div>
                  <div className="text-2xl font-black text-rose-700 mt-1">₹{brandTotal.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-slate-500">@ ₹{matchedEntry.mrp}/unit</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md">
                  <div className="text-[10px] font-bold text-emerald-200 uppercase">Jan Aushadhi Price</div>
                  <div className="text-2xl font-black mt-1">₹{jaTotal.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-emerald-100">Save {savingsPct}% · ₹{savings.toLocaleString("en-IN")} saved</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> PMJAY Coverage
                  </span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    matchedEntry.ayushmanCovered && hasAyushmanCard ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {matchedEntry.ayushmanCovered && hasAyushmanCard ? "100% Cashless" : matchedEntry.ayushmanCovered ? "Eligible — No Card" : "Not Covered"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {hasAyushmanCard && matchedEntry.ayushmanCovered
                    ? `✅ Cashless at empanelled hospitals under ${stateScheme}.`
                    : !matchedEntry.ayushmanCovered
                    ? "⚠ Not under PMJAY outpatient. Buy at Jan Aushadhi Kendra for maximum savings."
                    : "💳 Get PMJAY card at nearest CSC or govt. hospital with Aadhaar + ration card."}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px]">
                <strong>Your State Scheme:</strong> {stateScheme}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Final Out-of-Pocket</div>
                  <div className={`text-xl font-black ${outOfPocket === 0 ? "text-emerald-400" : "text-amber-300"}`}>
                    {outOfPocket === 0 ? "₹0 — Fully Covered!" : `₹${outOfPocket.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg">
                  Saved ₹{savings.toLocaleString("en-IN")} ({savingsPct}%)
                </span>
              </div>

              <div className="text-[10px] text-slate-500 leading-relaxed">{matchedEntry.coverageNote}</div>
            </div>
          )}
        </div>
      </div>

      {/* PMJAY Eligibility + How to Apply */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" /> Who Qualifies for PMJAY?
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { label: "Rural — SECC 2011 Deprivation", desc: "No pucca house, manual scavenger, bonded labour, SC/ST household, landless agricultural labourer, or no adult male member aged 16–59" },
              { label: "Urban — Occupational Category", desc: "Rag pickers, beggars, domestic workers, street vendors, construction workers, sanitation workers, home-based workers, washermen, security guards" },
              { label: "Coverage", desc: "₹5 lakh per family per year — secondary & tertiary inpatient care at any empanelled public or private hospital across India" },
              { label: "Portability", desc: "100% portable — use Ayushman card at any empanelled hospital in any state, not just your home state. No premium, no co-pay." },
              { label: "Family Size", desc: "No cap on family size. All members of an eligible family are covered under the same ₹5 lakh annual limit." },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="font-bold text-emerald-900">{item.label}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> How to Apply — Official Links
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { step: "Check Eligibility", desc: "Enter mobile or ration card number to verify if your family is listed in SECC 2011.", url: "https://beneficiary.nha.gov.in", label: "beneficiary.nha.gov.in" },
              { step: "Get Ayushman Card", desc: "Visit nearest CSC, govt. hospital, or Ayushman Mitra with Aadhaar + ration card. Free of cost.", url: "https://pmjay.gov.in", label: "pmjay.gov.in" },
              { step: "Find Empanelled Hospitals", desc: "Search PMJAY-empanelled hospitals near you — 27,000+ hospitals across India.", url: "https://hospitals.pmjay.gov.in", label: "hospitals.pmjay.gov.in" },
              { step: "Jan Aushadhi Store Locator", desc: "Find nearest PMBJK store for generic medicines at 50–90% lower prices — 10,000+ stores.", url: "https://janaushadhi.gov.in/StoreLocator.aspx", label: "janaushadhi.gov.in/StoreLocator" },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                <div className="font-bold text-sky-900 mb-0.5">Step {i + 1} — {item.step}</div>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                <a href={item.url} target="_blank" rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-sky-700 font-bold hover:underline">
                  {item.label} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
              <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900">PMJAY Helpline — 24×7 Toll-Free</div>
                <div className="text-slate-700 mt-0.5">
                  <strong>14555</strong> &nbsp;|&nbsp; <strong>1800-111-565</strong><br />
                  For eligibility queries, card issues, grievances & hospital empanelment.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-slate-700 leading-relaxed">
                <strong className="text-rose-800">Note:</strong> PMJAY covers only inpatient hospitalisation. OPD medicines & outpatient visits are NOT covered — use Jan Aushadhi Kendras for those.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
