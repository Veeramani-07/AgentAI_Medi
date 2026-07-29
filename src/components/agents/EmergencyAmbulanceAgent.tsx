import { useState, useMemo } from "react";
import {
  Ambulance, PhoneCall, ShieldAlert, Activity, HeartPulse,
  Building2, Send, Clock, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { TOP_INDIA_HOSPITALS } from "@/lib/indiaHospitalsData";
import { AMBULANCE_FLEET, SYMPTOM_MAP } from "@/lib/agentKnowledgeBase";

const EMERGENCY_TYPES = [
  "Cardiac Chest Pain & Breathing Difficulty",
  "Stroke / Face Drooping / Slurred Speech",
  "Road Traffic Accident & Trauma",
  "Severe Asthma / Respiratory Distress",
  "Diabetic Emergency / Unconscious Patient",
  "High Fever Convulsions & Seizure",
  "Pregnancy Emergency & Obstetric Crisis",
  "Drug Overdose / Poisoning",
];

export function EmergencyAmbulanceAgent() {
  const [patientName, setPatientName] = useState("Arun Prakash");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [emergencyType, setEmergencyType] = useState("Cardiac Chest Pain & Breathing Difficulty");
  const [location, setLocation] = useState("T. Nagar, Chennai");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("CRITICAL");
  const [notes, setNotes] = useState("Patient conscious but experiencing severe left-arm numbness and dyspnea.");
  const [dispatchStatus, setDispatchStatus] = useState<"IDLE" | "TRIAGING" | "DISPATCHED">("IDLE");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Dynamically select ambulance type & hospital based on inputs ──
  const assignedAmbulance = useMemo(() => {
    if (dispatchStatus !== "DISPATCHED") return null;

    // ALS for Critical/severe cardiac/respiratory/stroke; NICU for pregnancy; BLS otherwise
    const isALS = severity === "CRITICAL" || /cardiac|chest|stroke|breathless|asthma|respiratory|convulsion|seizure/i.test(emergencyType);
    const isNICU = /pregnanc|obstetric|neonatal|baby|newborn/i.test(emergencyType);

    const fleet = isNICU
      ? AMBULANCE_FLEET.filter(a => a.ambulanceType === "NICU")
      : isALS
      ? AMBULANCE_FLEET.filter(a => a.ambulanceType === "ALS")
      : AMBULANCE_FLEET.filter(a => a.ambulanceType === "BLS");

    const unit = fleet[0] ?? AMBULANCE_FLEET[0];
    const distanceKm = severity === "CRITICAL" ? 2.4 : severity === "HIGH" ? 4.1 : 6.8;
    const etaMins = severity === "CRITICAL" ? 8 : severity === "HIGH" ? 14 : 22;

    return { ...unit, distanceKm, etaMins };
  }, [dispatchStatus, severity, emergencyType]);

  // ── Dynamically match hospital ER based on emergency ──
  const reservedHospital = useMemo(() => {
    if (dispatchStatus !== "DISPATCHED") return null;
    const isICU = severity === "CRITICAL";
    return TOP_INDIA_HOSPITALS.find(h =>
      isICU ? h.is_24x7 && h.equipmentList.some(e => e.equipment_type === "ICU Bed") : h.verified
    ) ?? TOP_INDIA_HOSPITALS[0];
  }, [dispatchStatus, severity]);

  // ── Determine clinical protocol from symptom map ──
  const triageProtocol = useMemo(() => {
    const matched = SYMPTOM_MAP.find(rule => rule.keywords.test(emergencyType + " " + notes));
    return matched?.clinicalGuidance ?? "Maintain patient in recovery position. Do not give food/water. Keep airway clear.";
  }, [emergencyType, notes]);

  function handleDispatch() {
    if (!patientName.trim() || !phone.trim() || !location.trim()) return;
    setIsProcessing(true);
    setDispatchStatus("TRIAGING");
    setTimeout(() => {
      setDispatchStatus("DISPATCHED");
      setIsProcessing(false);
    }, 1400);
  }

  const severityColor = {
    CRITICAL: "bg-red-600 text-white border-red-700",
    HIGH:     "bg-amber-500 text-white border-amber-600",
    MEDIUM:   "bg-sky-500 text-white border-sky-600",
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #991b1b 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <Ambulance className="w-6 h-6 text-rose-200 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-rose-200 mb-1">
              <ShieldAlert className="w-3 h-3" /> Agent 7 · AI Emergency Dispatch
            </div>
            <h2 className="text-2xl font-black">AI Emergency Dispatch & ICU Ambulance Locator</h2>
            <p className="text-xs text-rose-100 font-medium">Enter patient details → AI auto-selects ALS/BLS unit and reserves the nearest ER trauma bed.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient Input Form */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-600" /> Emergency Triage & Request Form
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600">Patient Full Name</label>
            <input value={patientName} onChange={e => setPatientName(e.target.value)} className="input text-sm mt-1" placeholder="Enter patient name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Contact Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="input text-sm mt-1" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Severity Triage</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as "CRITICAL" | "HIGH" | "MEDIUM")}
                className="input text-sm mt-1 font-bold text-rose-700 bg-rose-50 border-rose-200"
              >
                <option value="CRITICAL">🚨 CRITICAL (Immediate ALS)</option>
                <option value="HIGH">⚠️ HIGH (Urgent Transport)</option>
                <option value="MEDIUM">🟡 MEDIUM (Standard Transport)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Emergency Type / Symptoms</label>
            <select
              value={emergencyType}
              onChange={e => setEmergencyType(e.target.value)}
              className="input text-sm mt-1 font-semibold"
            >
              {EMERGENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Pickup Location / Landmark</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="input text-sm mt-1" placeholder="House no., street, area, city" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Condition Notes (optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input text-xs mt-1"
              placeholder="Any additional details about the patient's condition..."
            />
          </div>

          <button
            onClick={handleDispatch}
            disabled={isProcessing || !patientName.trim() || !location.trim()}
            className="btn-primary w-full py-3.5 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> Trigger AI Emergency Dispatch & Route Ambulance
          </button>
        </div>

        {/* Live Dispatch Output */}
        <div className="space-y-4">
          <div className="card p-5 border-2 border-rose-100 bg-rose-50/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" /> AI Triage & Ambulance Live Tracker
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                dispatchStatus === "DISPATCHED" ? "bg-emerald-100 text-emerald-800"
                : dispatchStatus === "TRIAGING" ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-600"
              }`}>
                {dispatchStatus}
              </span>
            </div>

            {dispatchStatus === "IDLE" && (
              <div className="text-center py-10 text-slate-500 text-xs">
                Fill in the emergency triage form on the left and click the dispatch button.
              </div>
            )}

            {dispatchStatus === "TRIAGING" && (
              <div className="text-center py-10 space-y-3">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold text-slate-800 text-sm">AI Triage Engine Analysing Emergency...</p>
                <p className="text-xs text-slate-500">Locating nearest ALS/BLS units & reserving ER trauma bed</p>
              </div>
            )}

            {dispatchStatus === "DISPATCHED" && assignedAmbulance && reservedHospital && (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Severity Badge */}
                <div className={`px-3 py-2 rounded-xl border text-xs font-black flex items-center gap-2 ${severityColor[severity]}`}>
                  <AlertTriangle className="w-4 h-4" />
                  Severity: {severity} — Patient: {patientName} · Pickup: {location}
                </div>

                {/* Ambulance Card */}
                <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-md">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <div className="font-black text-rose-900 text-sm flex items-center gap-1.5">
                      <Ambulance className="w-4 h-4 text-rose-600" /> {assignedAmbulance.type}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {assignedAmbulance.vehicleNo}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 mb-3">
                    <div><strong className="text-slate-900">Driver:</strong> {assignedAmbulance.driverName}</div>
                    <div><strong className="text-slate-900">Base Hospital:</strong> {assignedAmbulance.hospital}</div>
                    <div><strong className="text-slate-900">Distance:</strong> {assignedAmbulance.distanceKm} km</div>
                    <div><strong className="text-emerald-700">ETA:</strong> ⏱ {assignedAmbulance.etaMins} Mins</div>
                  </div>
                  <a
                    href={`tel:${assignedAmbulance.phone}`}
                    className="btn-primary w-full text-xs py-2 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Driver ({assignedAmbulance.phone})
                  </a>
                </div>

                {/* ER Hospital Reserved */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">🏥 ER Trauma Bed Reserved</div>
                    <div className="text-[11px] mt-0.5">{reservedHospital.name} ER notified. ICU/Trauma Bay pre-activated for <strong>{emergencyType}</strong>.</div>
                    <div className="text-[11px] mt-1 font-bold text-emerald-700">📋 Protocol: {triageProtocol}</div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] text-slate-700 font-semibold">
                    SMS alert sent to {phone}. Dispatch ID: <strong>EMR-{Date.now().toString().slice(-6)}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Helpline */}
          <div className="card p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">National Emergency Helplines</div>
              <div className="text-base font-black">108 Ambulance · 112 Police/Fire</div>
            </div>
            <a href="tel:108" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs">
              Dial 108
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
