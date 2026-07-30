import { useState, useMemo } from "react";
import {
  Stethoscope, AlertTriangle, HeartPulse, Building2,
  Pill, Phone, MapPin, ShieldAlert, Zap,
} from "lucide-react";
import { DETAILED_MEDICINES } from "@/lib/medicineDetailsData";
import { TOP_INDIA_HOSPITALS } from "@/lib/indiaHospitalsData";
import { SYMPTOM_MAP } from "@/lib/agentKnowledgeBase";

const QUICK_SYMPTOMS = [
  "high fever body ache and headache",
  "chest pain and breathlessness",
  "blood sugar 280 mg/dL diabetic thirst",
  "stomach ulcer acid heartburn",
  "cough throat pain bacterial fever",
  "high blood pressure dizziness 160/100",
  "skin rash itching urticaria allergy",
  "anxiety depression panic attack insomnia",
  "low sugar hypoglycemia shaking sweating",
  "stroke face drooping slurred speech",
];

// Real India emergency helplines
const EMERGENCY_CONTACTS = [
  { label: "National Emergency", number: "112", desc: "Police, Fire, Ambulance — 24×7" },
  { label: "Ambulance (108)", number: "108", desc: "Free govt. ambulance across all states" },
  { label: "AIIMS Delhi Emergency", number: "011-26588500", desc: "Level 1 Trauma Centre" },
  { label: "Poison Control (AIIMS)", number: "1800-116-117", desc: "Toll-free, 24×7" },
  { label: "Mental Health (iCall)", number: "9152987821", desc: "Mon–Sat, 8 AM–10 PM" },
];

export function SymptomTriageAgent() {
  const [symptomInput, setSymptomInput] = useState("high fever body ache and headache");

  const triageData = useMemo(() => {
    const input = symptomInput.toLowerCase().trim();
    if (!input) return null;

    const matchedRule = SYMPTOM_MAP.find(rule => rule.keywords.test(input)) ?? null;

    if (matchedRule) {
      const meds = DETAILED_MEDICINES.filter(m =>
        matchedRule.medicineCategories.includes(m.category)
      ).slice(0, 4);
      return {
        condition: matchedRule.condition,
        urgency: matchedRule.urgency,
        medicines: meds.length > 0 ? meds : DETAILED_MEDICINES.slice(0, 2),
        equipment: matchedRule.equipment,
        clinicalGuidance: matchedRule.clinicalGuidance,
        emergencyAction: matchedRule.emergencyAction,
        doctorSpecialty: matchedRule.doctorSpecialty,
      };
    }

    return {
      condition: "General Febrile / Inflammatory Syndrome",
      urgency: "normal" as const,
      medicines: DETAILED_MEDICINES.filter(m => m.category === "Analgesic" || m.category === "General").slice(0, 3),
      equipment: ["Thermometer", "First Aid Kit"],
      clinicalGuidance: "Administer Paracetamol 650mg every 4–6 hours. Maintain fluid intake and rest. Monitor temperature.",
      emergencyAction: "If fever persists beyond 3 days or exceeds 103°F, visit a physician for CBC blood test.",
      doctorSpecialty: "General Physician",
    };
  }, [symptomInput]);

  const matchedHospitals = useMemo(() => {
    if (!triageData) return [];
    return TOP_INDIA_HOSPITALS.filter(h => {
      if (triageData.urgency === "critical") {
        return h.is_24x7 && h.equipmentList.some(e =>
          e.equipment_type === "ICU Bed" || e.equipment_type === "Ventilator"
        );
      }
      return h.verified;
    }).slice(0, 3);
  }, [triageData]);

  const urgencyStyle = {
    critical: { border: "border-red-300 bg-red-50",    badge: "bg-red-600 text-white",   label: "🚨 CRITICAL EMERGENCY",    text: "text-red-900" },
    urgent:   { border: "border-amber-300 bg-amber-50", badge: "bg-amber-500 text-white", label: "⚠️ URGENT CARE NEEDED",    text: "text-amber-900" },
    normal:   { border: "border-sky-200 bg-sky-50",     badge: "bg-sky-600 text-white",   label: "ℹ️ ROUTINE / TRIAGE CARE", text: "text-sky-900" },
  };

  const style = triageData ? urgencyStyle[triageData.urgency] : urgencyStyle.normal;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #4c1d95 45%, #0284c7 100%)" }}>
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0284c7)" }}>
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-400/20 border border-violet-400/40 text-violet-200 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 6 — Clinical Triage & Symptoms
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">AI Symptom & Clinical Triage Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Describe symptoms → AI matches condition, medicines, hospital equipment & specialist
            </p>
          </div>
        </div>
      </div>

      {/* Symptom Input */}
      <div className="card p-5">
        <label className="block text-sm font-black text-slate-800 mb-2">🩺 Describe Patient Symptoms</label>
        <input
          type="text"
          value={symptomInput}
          onChange={e => setSymptomInput(e.target.value)}
          placeholder="e.g. chest pain and breathlessness, blood sugar 280, high fever headache..."
          className="input font-semibold"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QUICK_SYMPTOMS.map((s, i) => (
            <button key={i} onClick={() => setSymptomInput(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                symptomInput === s
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-100"
              }`}>
              {s.split(" ").slice(0, 2).join(" ")}…
            </button>
          ))}
        </div>
      </div>

      {triageData && (
        <div className="space-y-4 animate-fade-in">

          {/* Triage Result Banner */}
          <div className={`rounded-2xl border-2 ${style.border} p-5`}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <h3 className={`text-lg font-black ${style.text} flex items-center gap-2`}>
                <HeartPulse className="w-5 h-5" /> {triageData.condition}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${style.badge}`}>
                {style.label}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed mb-2">
              {triageData.emergencyAction}
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              💡 <strong>Clinical Guidance:</strong> {triageData.clinicalGuidance}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Medicines */}
            <div className="card p-4 space-y-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Pill className="w-4 h-4 text-violet-600" /> Recommended Medicines
              </h4>
              {triageData.medicines.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">{m.name}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">₹{m.pricePerUnit.toFixed(0)}</span>
                  </div>
                  <div className="text-[11px] text-violet-700 font-semibold">{m.genericName}</div>
                  <div className="text-[11px] text-slate-600 mt-1">📋 {m.standardDosage}</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    Generic: {m.genericAlternative.name} — Save {m.genericAlternative.savingsPercent}%
                  </div>
                </div>
              ))}
            </div>

            {/* Equipment + Hospitals */}
            <div className="space-y-3">
              <div className="card p-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-violet-600" /> Required Equipment
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {triageData.equipment.map((eq, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                      ⚙️ {eq}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs font-bold text-violet-800 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200">
                  🩺 Refer to: {triageData.doctorSpecialty}
                </div>
              </div>

              <div className="card p-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" /> Equipped Hospitals
                </h4>
                <div className="space-y-2">
                  {matchedHospitals.map(h => (
                    <div key={h.id} className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                      <div className="font-black text-sky-950 text-xs">{h.name}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-500" /> {h.city}, {h.state}
                        <span className="mx-1">·</span>
                        <Phone className="w-3 h-3 text-sky-500" /> {h.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real Emergency Contacts */}
          <div className="card p-4">
            <h4 className="text-xs font-black text-red-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" /> India Emergency Helplines (Real)
            </h4>
            <div className="grid sm:grid-cols-3 gap-2">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <a key={i} href={`tel:${c.number}`}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
                  <div className="font-black text-red-900 text-sm">{c.number}</div>
                  <div className="font-bold text-red-800 text-xs">{c.label}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{c.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
