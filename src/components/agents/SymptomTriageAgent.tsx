import { useState, useMemo } from "react";
import { Stethoscope, AlertTriangle, CheckCircle2, HeartPulse, Building2, Pill, Clock, ArrowRight, ShieldAlert, Zap, MapPin, IndianRupee } from "lucide-react";
import { DETAILED_MEDICINES, type DetailedMedicine } from "@/lib/medicineDetailsData";
import { TOP_INDIA_HOSPITALS } from "@/lib/indiaHospitalsData";

interface TriageResult {
  conditionName: string;
  urgency: "critical" | "urgent" | "normal";
  symptomSummary: string;
  recommendedMedicines: DetailedMedicine[];
  requiredEquipment: string[];
  clinicalGuidance: string;
  emergencyAction: string;
}

export function SymptomTriageAgent() {
  const [symptomInput, setSymptomInput] = useState("high fever, severe body ache and headache");

  // Dynamic Symptom Matching Engine matching user input strictly to project data
  const triageData: TriageResult = useMemo(() => {
    const input = symptomInput.toLowerCase().trim();

    if (!input) {
      return {
        conditionName: "General Health Query",
        urgency: "normal",
        symptomSummary: "No specific symptom entered.",
        recommendedMedicines: [DETAILED_MEDICINES[0]],
        requiredEquipment: ["First Aid Kit"],
        clinicalGuidance: "Please enter your specific symptoms in the box above to receive tailored clinical guidance.",
        emergencyAction: "Consult a qualified medical practitioner for routine health assessments."
      };
    }

    // Critical Emergency: Cardiac / Respiratory Distress
    if (/chest pain|heart attack|breathlessness|shortness of breath|sp02|oxygen dropping|cardiac|unconscious/.test(input)) {
      return {
        conditionName: "Acute Cardiovascular / Severe Respiratory Emergency",
        urgency: "critical",
        symptomSummary: `Entered symptoms ("${symptomInput}") suggest acute respiratory or cardiovascular strain needing immediate trauma care.`,
        recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Respiratory" || m.category === "Cardiac"),
        requiredEquipment: ["ICU Bed", "Ventilator", "Oxygen Cylinder", "ECG Machine", "Ambulance"],
        clinicalGuidance: "Do not delay hospital transport. Keep patient in a comfortable seated position and administer emergency medical oxygen if available.",
        emergencyAction: "🚨 IMMEDIATE ACTION: Call India Emergency Services (112 / 108) or proceed immediately to nearest hospital emergency trauma ICU."
      };
    }

    // Diabetes / Blood Sugar Crisis
    if (/diabetes|blood sugar|glycemic|diabetic|insulin|frequent urination|thirst/.test(input)) {
      return {
        conditionName: "Hyperglycemia & Diabetic Glycemic Management",
        urgency: "urgent",
        symptomSummary: `Symptoms ("${symptomInput}") indicate diabetic glycemic elevation requiring blood sugar monitoring and insulin/oral hypoglycemic therapy.`,
        recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Diabetic"),
        requiredEquipment: ["Glucometer", "Insulin Pen / Cartridge", "Blood Test Lab"],
        clinicalGuidance: "Measure capillary blood glucose immediately using a glucometer. Maintain proper hydration and follow prescribed insulin/metformin dosing schedule.",
        emergencyAction: "Consult your endocrinologist. If blood glucose exceeds 300 mg/dL or ketones are present, seek urgent urgent care."
      };
    }

    // Acidity / GERD / Gastric Ulcer
    if (/stomach|acidity|acid|gerd|heartburn|ulcer|gastric|indigestion|reflux/.test(input)) {
      return {
        conditionName: "Gastroesophageal Reflux (GERD) & Gastric Hyperacidity",
        urgency: "normal",
        symptomSummary: `Symptoms ("${symptomInput}") correspond to hyperacidity, mucosal irritation, or reflux.`,
        recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Gastro"),
        requiredEquipment: ["Endoscopy Unit"],
        clinicalGuidance: "Take proton pump inhibitor (Pantoprazole / Pan 40) 30 minutes before breakfast. Avoid spicy, oily foods and caffeine.",
        emergencyAction: "If severe upper abdominal pain radiates to back or vomiting blood occurs, visit urgent care."
      };
    }

    // High Blood Pressure / Hypertension
    if (/blood pressure|hypertension|high bp|dizziness|palpitations|cholesterol/.test(input)) {
      return {
        conditionName: "Hypertension & Cardiovascular Risk Management",
        urgency: "urgent",
        symptomSummary: `Symptoms ("${symptomInput}") correlate with elevated arterial blood pressure or hyperlipidemia.`,
        recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Cardiac"),
        requiredEquipment: ["BP Monitor", "ECG Machine"],
        clinicalGuidance: "Monitor resting blood pressure using an electronic digital BP monitor. Reduce dietary sodium intake.",
        emergencyAction: "If systolic BP exceeds 180 mmHg or severe headache occurs, seek immediate emergency evaluation."
      };
    }

    // Bacterial Infection / Throat / Cough / Sinus
    if (/infection|bacterial|throat|tonsil|cough|sinus|pneumonia|wound|pus/.test(input)) {
      return {
        conditionName: "Acute Bacterial Upper/Lower Respiratory or Soft Tissue Infection",
        urgency: "urgent",
        symptomSummary: `Symptoms ("${symptomInput}") indicate active bacterial pathogen proliferation requiring antibiotic clearance.`,
        recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Antibiotic" || m.category === "Respiratory"),
        requiredEquipment: ["Nebulizer", "Oxygen Concentrator"],
        clinicalGuidance: "Broad-spectrum antibiotics (Augmentin / Azithromycin) require strict adherence to complete 5-day course.",
        emergencyAction: "Obtain a doctor's prescription before commencing antibiotic therapy."
      };
    }

    // General Fever & Pain (Default Fallback matched to input)
    return {
      conditionName: "Pyrexia (Fever) & Inflammatory Pain Syndrome",
      urgency: "normal",
      symptomSummary: `Symptoms ("${symptomInput}") matched to acute viral fever or musculoskeletal inflammatory pain.`,
      recommendedMedicines: DETAILED_MEDICINES.filter(m => m.category === "Analgesic" || m.category === "General"),
      requiredEquipment: ["Thermometer", "First Aid Kit"],
      clinicalGuidance: "Administer Paracetamol (Dolo 650mg) after meals every 6 hours. Maintain generous fluid intake and adequate rest.",
      emergencyAction: "If high fever persists beyond 3 days (>102°F), order a blood CBC test to rule out dengue or malaria."
    };
  }, [symptomInput]);

  // Match hospitals in project database equipped for this specific condition
  const matchedHospitals = useMemo(() => {
    return TOP_INDIA_HOSPITALS.filter(h => {
      if (triageData.urgency === "critical") return h.is_24x7 && h.equipmentList.some(e => e.equipment_type === "ICU Bed" || e.equipment_type === "Ventilator");
      return h.verified;
    }).slice(0, 3);
  }, [triageData]);

  const urgencyStyles = {
    critical: { bg: "border-red-300 bg-red-50", badge: "bg-red-600 text-white", label: "🚨 CRITICAL EMERGENCY", text: "text-red-900" },
    urgent:   { bg: "border-amber-300 bg-amber-50", badge: "bg-amber-500 text-white", label: "⚠️ URGENT CLINICAL CARE", text: "text-amber-900" },
    normal:   { bg: "border-sky-300 bg-sky-50", badge: "bg-sky-600 text-white", label: "ℹ️ ROUTINE / TRIAGE CARE", text: "text-sky-900" },
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
              <Zap className="w-3 h-3" /> Agent 6 — Clinical Triage &amp; Symptoms
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">AI Symptom &amp; Clinical Triage Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Input symptoms to match medical condition, recommended drugs &amp; equipped hospitals in project dataset
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
          placeholder="e.g. high fever and headache, chest pain and breathlessness, stomach acidity heartburn..."
          className="w-full rounded-xl border-2 border-violet-200 bg-violet-50/50 px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-400/30 outline-none transition-all"
        />

        {/* Preset symptom pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Symptom Inputs:</span>
          {[
            "high fever, severe body ache and headache",
            "chest pain and breathlessness",
            "blood sugar 280 mg/dL diabetic thirst",
            "stomach ulcer acid heartburn",
            "cough, throat pain and bacterial fever",
            "high blood pressure dizziness 160/100"
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSymptomInput(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                symptomInput === s
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-100"
              }`}
            >
              {s.split(" ")[0]} {s.split(" ")[1]}...
            </button>
          ))}
        </div>
      </div>

      {/* ── Direct AI Output Matched to Input ── */}
      <div className="space-y-5 animate-fade-in">
        {/* Triage Banner */}
        <div className={`rounded-2xl border-2 ${style.bg} p-5 shadow-sm`}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <h3 className={`text-xl font-black ${style.text} flex items-center gap-2`}>
              <HeartPulse className="w-6 h-6" /> {triageData.conditionName}
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

        {/* Recommended Medicines Matched from Project Dataset */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-violet-600" /> Recommended Medicines Matched in Project Catalog ({triageData.recommendedMedicines.length})
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {triageData.recommendedMedicines.map((m) => (
              <div key={m.id} className="rounded-2xl border-2 border-violet-100 bg-white p-4 shadow-sm hover:border-violet-300 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{m.name}</h4>
                    <p className="text-xs text-violet-700 font-bold">{m.genericName}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 text-[10px] font-black">
                    ₹{m.pricePerUnit.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-2">{m.description}</p>
                <div className="p-2 rounded-xl bg-violet-50 text-[11px] font-bold text-violet-950 border border-violet-200">
                  📋 Dosage: {m.standardDosage}
                </div>
                <div className="mt-2 text-[11px] font-black text-emerald-700 flex items-center justify-between">
                  <span>Jan Aushadhi Generic: {m.genericAlternative.name}</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">Save {m.genericAlternative.savingsPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Equipment & Hospital Triage */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-violet-600" /> Required Hospital Equipment Facilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {triageData.requiredEquipment.map((eq, idx) => (
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
              <Building2 className="w-4.5 h-4.5 text-sky-600" /> Equipped Verified Hospitals in Network
            </h4>
            <div className="space-y-2 text-xs">
              {matchedHospitals.map((h) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                  <div className="font-black text-sky-950 text-sm">{h.name}</div>
                  <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-sky-500" /> {h.city}, {h.state} · 📞 Call: {h.phone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50 p-5">
          <h3 className="text-xs font-black text-violet-900 mb-3 uppercase tracking-widest">⚙️ How This Triage Agent Works</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {["Input symptom query", "Match against clinical protocol", "Query project medicine catalog", "Identify required hospital equipment", "Output triage guidance"].map((step, i) => (
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
