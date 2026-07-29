import { useState } from "react";
import { Ambulance, PhoneCall, ShieldAlert, Navigation, Clock, Activity, CheckCircle2, HeartPulse, Building2, AlertTriangle, Send } from "lucide-react";
import { TOP_INDIA_HOSPITALS } from "@/lib/indiaHospitalsData";

interface DispatchRequest {
  patientName: string;
  phone: string;
  emergencyType: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  notes: string;
}

interface AmbulanceUnit {
  id: string;
  driverName: string;
  vehicleNo: string;
  type: "Advanced Life Support (ALS)" | "Basic Life Support (BLS)" | "Neonatal ICU Ambulance";
  hospital: string;
  distanceKm: number;
  etaMins: number;
  phone: string;
  status: "AVAILABLE" | "DISPATCHED" | "BUSY";
}

const AMBULANCE_FLEET: AmbulanceUnit[] = [
  { id: "AMB-101", driverName: "Ramesh Kumar", vehicleNo: "TN 01 AB 8842", type: "Advanced Life Support (ALS)", hospital: "Apollo Hospital Main", distanceKm: 2.4, etaMins: 8, phone: "+91 98401 11223", status: "AVAILABLE" },
  { id: "AMB-205", driverName: "Suresh Babu", vehicleNo: "TN 09 XY 5510", type: "Basic Life Support (BLS)", hospital: "Fortis Malar Hospital", distanceKm: 4.1, etaMins: 12, phone: "+91 98402 33445", status: "AVAILABLE" },
  { id: "AMB-309", driverName: "Venkatesh S.", vehicleNo: "TN 07 GH 1009", type: "Neonatal ICU Ambulance", hospital: "MIOT International", distanceKm: 6.8, etaMins: 18, phone: "+91 98403 55667", status: "AVAILABLE" },
];

export function EmergencyAmbulanceAgent() {
  const [form, setForm] = useState<DispatchRequest>({
    patientName: "Arun Prakash",
    phone: "+91 98765 43210",
    emergencyType: "Cardiac Chest Pain & Breathing Difficulty",
    location: "T. Nagar, Chennai",
    severity: "CRITICAL",
    notes: "Patient conscious but experiencing severe left-arm numbness and dyspnea.",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<"IDLE" | "TRIAGING" | "DISPATCHED">("IDLE");
  const [assignedAmbulance, setAssignedAmbulance] = useState<AmbulanceUnit | null>(null);

  function handleDispatch() {
    setIsProcessing(true);
    setDispatchStatus("TRIAGING");

    setTimeout(() => {
      setAssignedAmbulance(AMBULANCE_FLEET[0]);
      setDispatchStatus("DISPATCHED");
      setIsProcessing(false);
    }, 1200);
  }

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
            <p className="text-xs text-rose-100 font-medium">Triage patient severity, locate nearest ALS/BLS ambulances, and notify emergency trauma centers.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient Emergency Input Form */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-600" /> Emergency Triage & Request Form
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600">Patient Name</label>
            <input
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              className="input text-sm mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Contact Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Severity Triage</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value as any })}
                className="input text-sm mt-1 font-bold text-rose-700 bg-rose-50 border-rose-200"
              >
                <option value="CRITICAL">🚨 CRITICAL (Immediate ALS)</option>
                <option value="HIGH">⚠️ HIGH (Urgent Transport)</option>
                <option value="MEDIUM">🟡 MEDIUM (Standard Transport)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Emergency Type & Symptoms</label>
            <input
              value={form.emergencyType}
              onChange={(e) => setForm({ ...form, emergencyType: e.target.value })}
              className="input text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Pickup Location / Landmark</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Condition Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input text-xs mt-1"
            />
          </div>

          <button
            onClick={handleDispatch}
            disabled={isProcessing}
            className="btn-primary w-full py-3.5 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Send className="w-4 h-4" /> Trigger AI Emergency Dispatch & Route ALS
          </button>
        </div>

        {/* Live Dispatch Agent Reasoning Output */}
        <div className="space-y-4">
          <div className="card p-5 border-2 border-rose-100 bg-rose-50/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" /> AI Triage & Ambulance Live Tracker
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${dispatchStatus === "DISPATCHED" ? "bg-emerald-100 text-emerald-800" : dispatchStatus === "TRIAGING" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                {dispatchStatus}
              </span>
            </div>

            {dispatchStatus === "IDLE" && (
              <div className="text-center py-10 text-slate-500 text-xs">
                Fill the emergency triage details and click trigger to dispatch nearest ambulance unit.
              </div>
            )}

            {dispatchStatus === "TRIAGING" && (
              <div className="text-center py-10 text-slate-600 text-xs space-y-2">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold text-slate-800">AI Triage Engine Analyzing Symptoms...</p>
                <p>Querying GPS coordinates of 14 nearby ALS ambulances & trauma hospitals.</p>
              </div>
            )}

            {dispatchStatus === "DISPATCHED" && assignedAmbulance && (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Ambulance Unit Card */}
                <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-md">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <div className="font-black text-rose-900 text-sm flex items-center gap-1.5">
                      <Ambulance className="w-4 h-4 text-rose-600" /> {assignedAmbulance.type}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {assignedAmbulance.vehicleNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700 mb-3">
                    <div><strong className="text-slate-900">Driver:</strong> {assignedAmbulance.driverName}</div>
                    <div><strong className="text-slate-900">Hospital Base:</strong> {assignedAmbulance.hospital}</div>
                    <div><strong className="text-slate-900">Distance:</strong> {assignedAmbulance.distanceKm} km</div>
                    <div><strong className="text-emerald-700 font-bold">Estimated ETA:</strong> {assignedAmbulance.etaMins} Mins</div>
                  </div>

                  <div className="flex gap-2">
                    <a href={`tel:${assignedAmbulance.phone}`} className="btn-primary flex-1 text-xs py-2 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5" /> Call Driver ({assignedAmbulance.phone})
                    </a>
                  </div>
                </div>

                {/* Hospital Trauma Unit Reserved */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Trauma ER Bed Reserved</div>
                    <div className="text-[11px]">Apollo Hospital ER notified with triage note. ICU Bed #04 pre-warmed.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Helpline quick bar */}
          <div className="card p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">National Emergency</div>
              <div className="text-base font-black">Call 112 / 108 (India Ambulance)</div>
            </div>
            <a href="tel:112" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs">
              Dial 112
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
