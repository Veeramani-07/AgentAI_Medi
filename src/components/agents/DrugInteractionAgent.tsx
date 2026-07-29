import { useState, useMemo } from "react";
import {
  ShieldAlert, Pill, AlertTriangle, CheckCircle2, XCircle, ChevronRight,
  Plus, Trash2, HeartPulse, Zap, Info,
} from "lucide-react";
import {
  DRUG_INTERACTION_RULES,
  ALLERGY_RULES,
  type DrugInteractionRule,
  type AllergyRule,
} from "@/lib/agentKnowledgeBase";

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

const QUICK_DRUG_SETS = [
  ["Warfarin", "Ibuprofen", "Amoxicillin"],
  ["Metformin", "Ibuprofen", "Insulin"],
  ["Atorvastatin", "Azithromycin"],
  ["Sildenafil", "Nitroglycerine"],
  ["Pantoprazole", "Clopidogrel"],
  ["Paracetamol", "Dolo", "Crocin"],
];

export function DrugInteractionAgent() {
  const [medicines, setMedicines] = useState<string[]>(["Warfarin", "Ibuprofen", "Amoxicillin"]);
  const [allergies, setAllergies] = useState<string[]>(["Penicillin"]);
  const [newMed, setNewMed] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  function addMedicine() {
    const trimmed = newMed.trim();
    if (trimmed && !medicines.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setMedicines([...medicines, trimmed]);
      setNewMed("");
    }
  }

  function addAllergy() {
    const trimmed = newAllergy.trim();
    if (trimmed && !allergies.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setAllergies([...allergies, trimmed]);
      setNewAllergy("");
    }
  }

  // ── Fully dynamic interaction engine: checks ALL pairs against the knowledge base ──
  const interactions = useMemo<InteractionResult[]>(() => {
    const results: InteractionResult[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const m1 = medicines[i];
        const m2 = medicines[j];
        const pairKey = [m1, m2].sort().join("|");
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);

        let matched = false;
        for (const rule of DRUG_INTERACTION_RULES) {
          const d1 = rule.pattern1.test(m1) && rule.pattern2.test(m2);
          const d2 = rule.pattern1.test(m2) && rule.pattern2.test(m1);
          if (d1 || d2) {
            results.push({
              drug1: d1 ? m1 : m2,
              drug2: d1 ? m2 : m1,
              severity: rule.severity,
              description: rule.description,
              recommendation: rule.recommendation,
            });
            matched = true;
            break;
          }
        }
        if (!matched) {
          results.push({
            drug1: m1,
            drug2: m2,
            severity: "none",
            description: `No major adverse drug-drug interactions reported between ${m1} and ${m2} in the clinical literature.`,
            recommendation: "Safe to co-administer as prescribed by your doctor. Follow standard dosage schedules.",
          });
        }
      }
    }

    if (results.length === 0 && medicines.length === 1) {
      results.push({
        drug1: medicines[0],
        drug2: "—",
        severity: "none",
        description: `Only one medicine entered (${medicines[0]}). Add at least two medicines to check interactions.`,
        recommendation: "Add more medicines from your prescription to enable pair-wise interaction checking.",
      });
    }

    return results;
  }, [medicines]);

  // ── Fully dynamic allergy engine: checks every medicine against every listed allergy ──
  const allergyResults = useMemo<AllergyResult[]>(() => {
    const results: AllergyResult[] = [];
    for (const allergen of allergies) {
      for (const medicine of medicines) {
        for (const rule of ALLERGY_RULES) {
          if (rule.allergenPattern.test(allergen) && rule.drugPattern.test(medicine)) {
            if (!results.some(r => r.drug === medicine && r.allergen === allergen)) {
              results.push({
                drug: medicine,
                allergen,
                severity: rule.severity,
                reaction: rule.reaction,
              });
            }
          }
        }
      }
    }
    return results;
  }, [medicines, allergies]);

  const severeCount   = interactions.filter(i => i.severity === "severe").length;
  const moderateCount = interactions.filter(i => i.severity === "moderate").length;
  const allergyCount  = allergyResults.filter(a => a.severity === "high").length;

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
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Drug Interaction & Allergy Safety Audit</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Enter any medicines + known allergies → instant AI safety check across all pairs
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Preset Sets ── */}
      <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
        <p className="text-xs font-black text-red-800 uppercase tracking-widest mb-2">⚡ Quick Test Sets (click to load)</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_DRUG_SETS.map((set, idx) => (
            <button
              key={idx}
              onClick={() => { setMedicines(set); setNewMed(""); }}
              className="px-3 py-1.5 rounded-xl bg-white border-2 border-red-200 text-red-900 text-xs font-bold hover:bg-red-100 transition-all shadow-sm"
            >
              {set.join(" + ")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Medicine Input ── */}
      <div className="rounded-2xl border-2 border-sky-200 bg-white p-5 shadow">
        <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Pill className="w-4 h-4 text-sky-600" /> Current & New Medicines ({medicines.length} entered)
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
          {medicines.length === 0 && <span className="text-xs text-slate-400 font-semibold">No medicines added yet</span>}
        </div>
        <div className="flex gap-2">
          <input
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMedicine()}
            placeholder="Type any medicine name and press Enter (e.g. Warfarin, Metformin, Atorvastatin)…"
            className="flex-1 rounded-xl border-2 border-sky-200 bg-sky-50/50 px-3.5 py-2.5 text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 outline-none transition-all"
          />
          <button onClick={addMedicine} className="px-4 py-2.5 rounded-xl border-2 border-sky-300 text-sky-800 font-black hover:bg-sky-50 transition-all flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
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
            placeholder="Add known allergen (e.g. Penicillin, Sulfa, NSAID, Iodine)…"
            className="flex-1 rounded-xl border-2 border-red-200 bg-red-50/50 px-3.5 py-2.5 text-sm font-semibold text-red-950 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 outline-none transition-all"
          />
          <button onClick={addAllergy} className="px-4 py-2.5 rounded-xl border-2 border-red-300 text-red-800 font-black hover:bg-red-50 transition-all flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* ── AI Safety Audit Output ── */}
      {medicines.length > 0 && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Pairs Checked", value: interactions.length, color: "from-sky-700 to-sky-500", icon: "🔍" },
              { label: "Severe Risks", value: severeCount, color: severeCount > 0 ? "from-red-700 to-red-500" : "from-slate-600 to-slate-400", icon: "🚨" },
              { label: "Moderate Risks", value: moderateCount, color: moderateCount > 0 ? "from-amber-700 to-amber-500" : "from-slate-600 to-slate-400", icon: "⚠️" },
              { label: "Allergy Alerts", value: allergyCount, color: allergyCount > 0 ? "from-rose-700 to-rose-500" : "from-slate-600 to-slate-400", icon: "💊" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${stat.color} text-center`}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black leading-none">{stat.value}</div>
                <div className="text-[11px] font-bold text-white/80 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Drug–Drug Interaction Results */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-600" /> Drug-Drug Interaction Results
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {interactions.length} pair{interactions.length !== 1 ? "s" : ""} analysed
              </span>
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
                <HeartPulse className="w-5 h-5 text-red-600" /> Allergy Conflict Alerts
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
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-red-200 text-red-950 border border-red-400">
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
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm font-black text-emerald-900">No Allergy Conflicts Detected</div>
                <p className="text-xs text-emerald-700 font-semibold">All prescribed medicines appear safe based on the listed patient allergies.</p>
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>This AI safety audit is for informational purposes only and does not replace professional pharmacist or physician advice. Always verify with a licensed healthcare provider before changing medication.</span>
          </div>
        </div>
      )}

      {medicines.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-slate-500 text-sm font-semibold">
          Add at least one medicine above to begin the AI Safety Audit →
        </div>
      )}
    </div>
  );
}
