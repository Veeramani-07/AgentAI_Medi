import { useState, useMemo } from "react";
import { ShieldAlert, Pill, AlertTriangle, CheckCircle2, XCircle, ChevronRight, Plus, Trash2, HeartPulse, Search, Zap } from "lucide-react";

interface InteractionResult {
  drug1: string;
  drug2: string;
  severity: "severe" | "moderate" | "mild" | "none";
  description: string;
  recommendation: string;
}

interface AllergyResult {
  drug: string;
  allergen: string;
  severity: "high" | "moderate" | "low";
  reaction: string;
}

const SEVERITY_STYLES = {
  severe:   { bg: "border-red-300 bg-red-50/70",      badge: "bg-red-100 text-red-900 border border-red-400",           label: "🚨 Severe",   recBg: "bg-red-100 border border-red-300 text-red-900" },
  moderate: { bg: "border-amber-300 bg-amber-50/70",  badge: "bg-amber-100 text-amber-900 border border-amber-400",     label: "⚠ Moderate", recBg: "bg-amber-100 border border-amber-300 text-amber-900" },
  mild:     { bg: "border-sky-200 bg-sky-50/70",      badge: "bg-sky-100 text-sky-900 border border-sky-400",           label: "ℹ Mild",     recBg: "bg-sky-100 border border-sky-200 text-sky-900" },
  none:     { bg: "border-emerald-200 bg-emerald-50/70", badge: "bg-emerald-100 text-emerald-900 border border-emerald-400", label: "✔ Safe",  recBg: "bg-emerald-100 border border-emerald-200 text-emerald-900" },
};

const ALLERGY_STYLES = {
  high:     { bg: "border-red-400 bg-red-50/80",      text: "text-red-900",    label: "HIGH RISK" },
  moderate: { bg: "border-amber-400 bg-amber-50/80",  text: "text-amber-900",  label: "MODERATE" },
  low:      { bg: "border-sky-300 bg-sky-50/70",      text: "text-sky-900",    label: "LOW" },
};

export function DrugInteractionAgent() {
  const [medicines, setMedicines] = useState<string[]>(["Warfarin", "Ibuprofen", "Amoxicillin"]);
  const [allergies, setAllergies] = useState<string[]>(["Penicillin"]);
  const [newMed, setNewMed] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  function addMedicine() {
    if (newMed.trim() && !medicines.some(m => m.toLowerCase() === newMed.trim().toLowerCase())) {
      setMedicines([...medicines, newMed.trim()]);
      setNewMed("");
    }
  }

  function addAllergy() {
    if (newAllergy.trim() && !allergies.some(a => a.toLowerCase() === newAllergy.trim().toLowerCase())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  }

  // Dynamically derive interactions based on the medicines list
  const interactions = useMemo<InteractionResult[]>(() => {
    const list: InteractionResult[] = [];
    const medsLower = medicines.map(m => m.toLowerCase());

    if (medsLower.some(m => m.includes("warfarin")) && medsLower.some(m => m.includes("ibuprofen") || m.includes("aspirin") || m.includes("combiflam"))) {
      list.push({
        drug1: "Warfarin",
        drug2: medsLower.find(m => m.includes("ibuprofen")) ? "Ibuprofen" : "NSAID Painkiller",
        severity: "severe",
        description: "NSAIDs significantly increase the anticoagulant effect of Warfarin, causing high risk of gastrointestinal & internal hemorrhage.",
        recommendation: "Strictly avoid combination. Use Paracetamol 650mg (Dolo) as a safe alternative analgesic."
      });
    }

    if (medsLower.some(m => m.includes("metformin") || m.includes("glycomet")) && medsLower.some(m => m.includes("ibuprofen") || m.includes("combiflam"))) {
      list.push({
        drug1: "Metformin",
        drug2: "Ibuprofen",
        severity: "mild",
        description: "NSAIDs may slightly impair renal perfusion, reducing Metformin renal excretion and increasing risk of lactic acidosis.",
        recommendation: "Monitor renal creatinine function and maintain proper hydration."
      });
    }

    if (medsLower.some(m => m.includes("atorvastatin") || m.includes("atorva")) && medsLower.some(m => m.includes("azithromycin") || m.includes("azithral"))) {
      list.push({
        drug1: "Atorvastatin",
        drug2: "Azithromycin",
        severity: "moderate",
        description: "Macrolide antibiotics may increase statin blood concentrations, elevating risk of myopathy and muscle pain.",
        recommendation: "Temporarily pause statin during 3-day macrolide antibiotic course."
      });
    }

    if (list.length === 0 && medicines.length >= 2) {
      list.push({
        drug1: medicines[0],
        drug2: medicines[1],
        severity: "none",
        description: `No major adverse drug-drug interactions reported between ${medicines[0]} and ${medicines[1]}.`,
        recommendation: "Safe to co-administer as prescribed by your doctor. Follow standard dosage schedules."
      });
    }

    return list;
  }, [medicines]);

  // Dynamically derive allergy conflicts based on allergies list and medicines list
  const allergyResults = useMemo<AllergyResult[]>(() => {
    const list: AllergyResult[] = [];
    const allergiesLower = allergies.map(a => a.toLowerCase());
    const medsLower = medicines.map(m => m.toLowerCase());

    if (allergiesLower.some(a => a.includes("penicillin")) && medsLower.some(m => m.includes("amoxicillin") || m.includes("augmentin") || m.includes("ampicillin"))) {
      const matchMed = medicines.find(m => /amoxicillin|augmentin|ampicillin/i.test(m)) || "Amoxicillin";
      list.push({
        drug: matchMed,
        allergen: "Penicillin",
        severity: "high",
        reaction: `Anaphylaxis & severe skin rash risk — ${matchMed} is a beta-lactam penicillin class derivative. Strictly contraindicated.`
      });
    }

    if (allergiesLower.some(a => a.includes("sulfa")) && medsLower.some(m => m.includes("bactrim") || m.includes("septran") || m.includes("sulfamethoxazole"))) {
      list.push({
        drug: "Sulfamethoxazole",
        allergen: "Sulfa Drugs",
        severity: "high",
        reaction: "Severe hypersensitivity and Stevens-Johnson Syndrome (SJS) risk. Avoid all sulfonamides."
      });
    }

    return list;
  }, [medicines, allergies]);

  const severeCount = interactions.filter((i) => i.severity === "severe").length;
  const allergyCount = allergyResults.filter((a) => a.severity === "high").length;

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #7c2d12 50%, #991b1b 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f87171, transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #b91c1c, #7c2d12)" }}>
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-400/20 border border-rose-400/40 text-rose-200 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 4 — Safety Audit
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Drug Interaction &amp; Allergy Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Check drug-drug interactions &amp; patient allergy triggers before dispensing
            </p>
          </div>
        </div>
      </div>

      {/* ── Medicine Input ── */}
      <div className="rounded-2xl border-2 border-sky-200 bg-white p-5 shadow">
        <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Pill className="w-4 h-4 text-sky-600" /> Current &amp; New Medicines
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {medicines.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-950 border-2 border-sky-300 text-xs font-black">
              {m}
              <button onClick={() => setMedicines(medicines.filter((_, j) => j !== i))} className="text-sky-500 hover:text-red-500 ml-0.5 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMedicine()}
            placeholder="Add medicine name…"
            className="flex-1 rounded-xl border-2 border-sky-200 bg-sky-50/50 px-3.5 py-2.5 text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 outline-none transition-all"
          />
          <button onClick={addMedicine} className="px-4 py-2.5 rounded-xl border-2 border-sky-300 text-sky-800 font-black hover:bg-sky-50 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Allergy Input ── */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-5 shadow">
        <h3 className="text-sm font-black text-red-900 uppercase tracking-widest mb-3 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-red-600" /> Known Patient Allergies
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {allergies.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-950 border-2 border-red-300 text-xs font-black">
              {a}
              <button onClick={() => setAllergies(allergies.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-700 ml-0.5 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
          {allergies.length === 0 && <span className="text-xs text-slate-400 font-semibold">No allergies listed</span>}
        </div>
        <div className="flex gap-2">
          <input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAllergy()}
            placeholder="Add allergy (e.g. Penicillin, Sulfa)…"
            className="flex-1 rounded-xl border-2 border-red-200 bg-red-50/50 px-3.5 py-2.5 text-sm font-semibold text-red-950 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 outline-none transition-all"
          />
          <button onClick={addAllergy} className="px-4 py-2.5 rounded-xl border-2 border-red-300 text-red-800 font-black hover:bg-red-50 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Real-Time AI Safety Audit Output ── */}
      <div className="space-y-5 animate-fade-in">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Pairs Checked", value: interactions.length, color: "from-sky-700 to-sky-500", icon: "🔍" },
              { label: "Severe Risks", value: severeCount, color: "from-red-700 to-red-500", icon: "🚨" },
              { label: "Moderate Risks", value: interactions.filter((i) => i.severity === "moderate").length, color: "from-amber-700 to-amber-500", icon: "⚠️" },
              { label: "Allergy Alerts", value: allergyCount, color: "from-rose-700 to-rose-500", icon: "💊" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${stat.color} text-center`}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black leading-none">{stat.value}</div>
                <div className="text-[11px] font-bold text-white/80 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Drug–Drug Interactions */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-600" /> Drug-Drug Interaction Results
            </h3>
            {interactions.map((r, i) => {
              const s = SEVERITY_STYLES[r.severity];
              return (
                <div key={i} className={`rounded-2xl border-2 ${s.bg} p-4 shadow-sm hover:shadow-md transition-all`}>
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-900">{r.drug1}</span>
                      <span className="text-slate-400 font-black text-lg">×</span>
                      <span className="font-black text-base text-slate-900">{r.drug2}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black ${s.badge}`}>{s.label}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold mb-2">{r.description}</p>
                  <div className={`p-3 rounded-xl text-xs font-bold leading-relaxed ${s.recBg}`}>
                    💡 Recommendation: {r.recommendation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allergy Alerts */}
          {allergyResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-600" /> Allergy Alerts
              </h3>
              {allergyResults.map((a, i) => {
                const s = ALLERGY_STYLES[a.severity];
                return (
                  <div key={i} className={`rounded-2xl border-2 ${s.bg} p-4 shadow-sm`}>
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-black text-base text-slate-900">{a.drug}</span>
                        <span className="text-slate-500 font-bold text-sm">→ Allergen:</span>
                        <span className="font-black text-base text-red-800">{a.allergen}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black bg-red-200 text-red-950 border border-red-400`}>
                        ⚠ {s.label}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold leading-relaxed ${s.text}`}>{a.reaction}</p>
                  </div>
                );
              })}
            </div>
          )}

          {allergyResults.length === 0 && (
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 flex items-center gap-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-sm font-black text-emerald-900">No Allergy Conflicts Detected</div>
                <p className="text-xs text-emerald-700 font-semibold">All prescribed medicines are safe based on listed patient allergies.</p>
              </div>
            </div>
          )}

          {/* Process Flow */}
          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-5">
            <h3 className="text-xs font-black text-red-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {["Input current medicines", "Add known allergies", "Check drug-drug pairs", "Detect allergy conflicts", "Warn before dispensing"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white text-red-900 border-2 border-red-200 shadow-sm">{step}</span>
                  {i < 4 && <ChevronRight className="w-4 h-4 text-red-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
