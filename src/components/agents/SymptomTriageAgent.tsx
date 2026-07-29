import { useState, useMemo } from "react";
import {
  Stethoscope, AlertTriangle, CheckCircle2, HeartPulse, Building2,
  Pill, Clock, ArrowRight, ShieldAlert, Zap, MapPin,
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

export function SymptomTriageAgent() {
  const [symptomInput, setSymptomInput] = useState("high fever body ache and headache");

  // ── Full dynamic triage: match ALL symptom keywords in the knowledge base ──
  const triageData = useMemo(() => {
    const input = symptomInput.toLowerCase().trim();

    if (!input) {
      return {
        condition: "No symptoms entered",
        urgency: "normal" as const,
        symptomSummary: "Please type your symptoms above to receive an AI triage assessment.",
        recommendedMedicines: [DETAILED_MEDICINES[0]],
        equipment: ["First Aid Kit"],
        clinicalGuidance: "Describe your specific symptoms for tailored clinical guidance.",
        emergencyAction: "Consult a qualified medical practitioner for routine assessments.",
        doctorSpecialty: "General Physician",
        matchedRule: null as null | typeof SYMPTOM_MAP[0],
      };
    }

    // Find BEST matching rule (first keyword match wins; earlier rules are more critical)
    const matchedRule = SYMPTOM_MAP.find(rule => rule.keywords.test(input)) ?? null;

    if (matchedRule) {
      const recommendedMeds = DETAILED_MEDICINES.filter(m =>
        matchedRule.medicineCategories.includes(m.category)
      ).slice(0, 6);

      return {
        condition: matchedRule.condition,
        urgency: matchedRule.urgency,
        symptomSummary: `AI matched your input ("${symptomInput}") to: ${matchedRule.condition}`,
        recommendedMedicines: recommendedMeds.length > 0 ? recommendedMeds : [DETAILED_MEDICINES[0]],
        equipment: matchedRule.equipment,
        clinicalGuidance: matchedRule.clinicalGuidance,
        emergencyAction: matchedRule.emergencyAction,
        doctorSpecialty: matchedRule.doctorSpecialty,
        matchedRule,
      };
    }

    // Generic fallback
    return {
      condition: "General Febrile / Inflammatory Syndrome",
      urgency: "normal" as const,
      symptomSummary: `Your input ("${symptomInput}") was assessed for general febrile or inflammatory symptoms.`,
      recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Analgesic" || m.category === "General").slice(0, 4),
      equipment: ["Thermometer", "First Aid Kit"],
      clinicalGuidance: "Administer Paracetamol 650mg every 4–6 hours. Maintain fluid intake and rest. Monitor temperature.",
      emergencyAction: "If fever persists beyond 3 days or exceeds 103°F, visit a physician for blood tests.",
      doctorSpecialty: "General Physician",
      matchedRule: null,
    };
  }, [symptomInput]);

  // ── Match hospitals equipped for the detected urgency ──
  const matchedHospitals = useMemo(() => {
    return TOP_INDIA_HOSPITALS.filter(h => {
      if (triageData.urgency === "critical") {
        return h.is_24x7 && h.equipmentList.some(e =>
          e.equipment_type === "ICU Bed" || e.equipment_type === "Ventilator"
        );
      }
      return h.verified;
    }).slice(0, 3);
  }, [triageData]);

  const urgencyStyles = {
    critical: { bg: "border-red-300 bg-red-50",    badge: "bg-red-600 text-white",    label: "🚨 CRITICAL EMERGENCY", text: "text-red-900" },
    urgent:   { bg: "border-amber-300 bg-amber-50", badge: "bg-amber-500 text-white",  label: "⚠️ URGENT CLINICAL CARE", text: "text-amber-900" },
    normal:   { bg: "border-sky-300 bg-sky-50",     badge: "bg-sky-600 text-white",    label: "ℹ️ ROUTINE / TRIAGE CARE", text: "text-sky-900" },
  };

  const style = urgencyStyles[triageData.urgency];

  return (
    <div className="space-y-5">
      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #4c1d95 45%, #0284c7 100%)" }}
      >
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
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">AI Symptom & Clinical Triage Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Describe any symptoms → AI matches condition, drugs, hospital equipment & specialist
            </p>
          </div>
        </div>
      </div>

      {/* ── Symptom Input Box ── */}
      <div className="rounded-2xl border-2 border-violet-200 bg-white p-5 shadow">
        <label className="block text-sm font-black text-violet-950 mb-2 uppercase tracking-wide flex items-center justify-between">
          <span>🩺 Describe Patient Symptoms or Health Concern</span>
          <span className="text-xs font-semibold text-violet-600 lowercase">Matches project database strictly</span>
        </label>
        <input
          type="text"
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder="e.g. high fever and headache, chest pain and breathlessness, blood sugar 280, stomach acidity heartburn..."
          className="w-full rounded-xl border-2 border-violet-200 bg-violet-50/50 px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-400/30 outline-none transition-all"
        />

        {/* Quick symptom pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Inputs:</span>
          {QUICK_SYMPTOMS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSymptomInput(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                symptomInput === s
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-100"
              }`}
            >
              {s.split(" ").slice(0, 2).join(" ")}…
            </button>
          ))}
        </div>
      </div>

      {/* ── AI Output Matched to Input ── */}
      <div className="space-y-5 animate-fade-in">

        {/* Triage Banner */}
        <div className={`rounded-2xl border-2 ${style.bg} p-5 shadow-sm`}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <h3 className={`text-xl font-black ${style.text} flex items-center gap-2`}>
              <HeartPulse className="w-6 h-6" /> {triageData.condition}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${style.badge}`}>
              {style.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-3">{triageData.symptomSummary}</p>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold leading-relaxed text-slate-800">
            {triageData.emergencyAction}
          </div>
        </div>

        {/* Recommended Medicines */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-violet-600" /> Matched Medicines from Project Catalog
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {triageData.recommendedMedicines.length} result{triageData.recommendedMedicines.length !== 1 ? "s" : ""}
            </span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {triageData.recommendedMedicines.map((m) => (
              <div key={m.id} className="rounded-2xl border-2 border-violet-100 bg-white p-4 shadow-sm hover:border-violet-300 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{m.name}</h4>
                    <p className="text-xs text-violet-700 font-bold">{m.genericName}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 text-[10px] font-black whitespace-nowrap">
                    ₹{m.pricePerUnit.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-2">{m.description}</p>
                <div className="p-2 rounded-xl bg-violet-50 text-[11px] font-bold text-violet-950 border border-violet-200">
                  📋 Dosage: {m.standardDosage}
                </div>
                <div className="mt-2 text-[11px] font-black text-emerald-700 flex items-center justify-between">
                  <span>Generic: {m.genericAlternative.name}</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">Save {m.genericAlternative.savingsPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Hospital Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-violet-600" /> Required Hospital Equipment
            </h4>
            <div className="flex flex-wrap gap-2">
              {triageData.equipment.map((eq, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 font-black text-xs border border-slate-300">
                  ⚙️ {eq}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-3 leading-relaxed">
              💡 {triageData.clinicalGuidance}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-sky-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black text-sky-950 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" /> Equipped Hospitals in Network
            </h4>
            <div className="space-y-2 text-xs">
              {matchedHospitals.map((h) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                  <div className="font-black text-sky-950 text-sm">{h.name}</div>
                  <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-sky-500" /> {h.city}, {h.state} · 📞 {h.phone}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 rounded-lg bg-violet-50 border border-violet-200 text-xs font-bold text-violet-900">
              🩺 Recommended Specialist: <span className="text-violet-700">{triageData.doctorSpecialty}</span>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50 p-5">
          <h3 className="text-xs font-black text-violet-900 mb-3 uppercase tracking-widest">⚙️ How This Triage Agent Works</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {["Input symptom text", "NLP keyword match against 11 condition rules", "Filter medicine catalog by category", "Identify hospital equipment", "Output triage guidance"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white text-violet-900 border-2 border-violet-200 shadow-sm">{step}</span>
                {i < 4 && <ArrowRight className="w-4 h-4 text-violet-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
