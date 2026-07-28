import { useState } from "react";
import { FileText, Upload, CheckCircle2, AlertTriangle, ClipboardList, ChevronRight, Pill, Clock, User, Hash, Zap } from "lucide-react";

interface ExtractedMedicine {
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  verified: boolean;
  warning: string | null;
}

interface PrescriptionResult {
  doctorName: string;
  doctorReg: string;
  patientName: string;
  patientAge: number;
  date: string;
  diagnosis: string;
  medicines: ExtractedMedicine[];
  overallStatus: "valid" | "incomplete" | "flagged";
  issues: string[];
}

const DEMO_RESULT: PrescriptionResult = {
  doctorName: "Dr. Arun Sharma",
  doctorReg: "MCI-2014-TN-28451",
  patientName: "Rajesh Kumar",
  patientAge: 45,
  date: "2026-07-28",
  diagnosis: "Upper Respiratory Tract Infection with mild fever",
  medicines: [
    { name: "Amoxicillin 500mg", genericName: "Amoxicillin", dosage: "500mg", frequency: "1 tablet twice daily", duration: "5 days", quantity: 10, verified: true, warning: null },
    { name: "Paracetamol 650mg", genericName: "Paracetamol", dosage: "650mg", frequency: "1 tablet thrice daily (after meals)", duration: "3 days", quantity: 9, verified: true, warning: null },
    { name: "Cetirizine 10mg", genericName: "Cetirizine", dosage: "10mg", frequency: "1 tablet at night", duration: "5 days", quantity: 5, verified: true, warning: null },
    { name: "Cough Syrup", genericName: "Dextromethorphan", dosage: "10ml", frequency: "2 tsp thrice daily", duration: "5 days", quantity: 1, verified: false, warning: "Brand name missing. Confirm with doctor." },
  ],
  overallStatus: "incomplete",
  issues: [
    "Medicine #4 (Cough Syrup) does not specify a brand name or exact formulation.",
    "Doctor's signature area is partially obscured — verify with clinic.",
  ],
};

export function PrescriptionVerificationAgent() {
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionResult | null>(null);

  function handleUpload() {
    setLoading(true);
    setUploaded(true);
    setTimeout(() => { setResult(DEMO_RESULT); setLoading(false); }, 1800);
  }

  const statusConfig = {
    valid: {
      bg: "border-emerald-300 bg-emerald-50",
      text: "text-emerald-900",
      label: "✔ Valid Prescription",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
    incomplete: {
      bg: "border-amber-300 bg-amber-50",
      text: "text-amber-900",
      label: "⚠ Incomplete — Review Needed",
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    },
    flagged: {
      bg: "border-red-300 bg-red-50",
      text: "text-red-900",
      label: "🚨 Flagged — Issues Found",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    },
  };

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #1d4ed8 55%, #0f766e 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #0f766e)" }}>
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/40 text-sky-200 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 3 — OCR Rx Scan
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Prescription Verification Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              OCR-powered prescription reading — extracts medicines, dosage &amp; duration automatically
            </p>
          </div>
        </div>
      </div>

      {/* ── Upload Section ── */}
      <div className="rounded-2xl border-2 border-sky-200 bg-white p-6 shadow">
        <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-3">📄 Upload Prescription Image</h3>
        <div className="border-2 border-dashed border-sky-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-all bg-sky-50/60">
          <Upload className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <p className="text-sm font-black text-sky-900 mb-1">Drag &amp; drop or click to upload</p>
          <p className="text-xs text-slate-500 font-semibold mb-4">Supports JPG, PNG, PDF — max 10MB</p>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-7 py-3 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0284c7 50%, #0f766e 100%)" }}
          >
            {loading ? "Processing with OCR…" : uploaded ? "Re-Upload &amp; Scan" : "Upload &amp; Scan Prescription"}
          </button>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="rounded-2xl border-2 border-sky-100 bg-white p-10 text-center animate-pulse shadow">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #0f766e)" }}>
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <p className="text-base font-black text-sky-800">Running OCR extraction on prescription image…</p>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Detecting medicine names, dosages, frequency &amp; duration</p>
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <>
          {/* Overall Status Banner */}
          {(() => {
            const sc = statusConfig[result.overallStatus];
            return (
              <div className={`rounded-2xl border-2 ${sc.bg} p-4 flex items-center gap-3 shadow-sm`}>
                {sc.icon}
                <div>
                  <div className={`text-base font-black ${sc.text}`}>{sc.label}</div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{result.issues.length} issue(s) detected — review below</p>
                </div>
              </div>
            );
          })()}

          {/* Doctor & Patient Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-sky-100 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-sky-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Doctor Information
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Name", value: result.doctorName },
                  { label: "Registration", value: result.doctorReg },
                  { label: "Date", value: result.date },
                ].map((row, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 font-semibold text-xs">{row.label}:</span>
                    <span className="font-black text-sky-950 text-xs text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-violet-100 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-violet-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Patient Information
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Name", value: result.patientName },
                  { label: "Age", value: `${result.patientAge} years` },
                  { label: "Diagnosis", value: result.diagnosis },
                ].map((row, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 font-semibold text-xs shrink-0">{row.label}:</span>
                    <span className="font-black text-violet-950 text-xs text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extracted Medicines */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-sky-950 flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-600" /> Extracted Medicines ({result.medicines.length})
            </h3>
            {result.medicines.map((med, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${
                  med.verified ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #1d4ed8, #0284c7)" }}>
                      {i + 1}
                    </span>
                    <h4 className="font-black text-slate-900 text-base">{med.name}</h4>
                    {med.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                        <AlertTriangle className="w-3 h-3" /> Needs Review
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-3">Generic: <span className="text-slate-800 font-black">{med.genericName}</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: "Dosage", value: med.dosage, icon: <Hash className="w-3 h-3" /> },
                    { label: "Frequency", value: med.frequency, icon: <Clock className="w-3 h-3" /> },
                    { label: "Duration", value: med.duration, icon: <Clock className="w-3 h-3" /> },
                    { label: "Quantity", value: `${med.quantity} units`, icon: <Pill className="w-3 h-3" /> },
                  ].map((cell, j) => (
                    <div key={j} className="p-2.5 rounded-xl bg-white border-2 border-slate-100 shadow-sm">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-1">
                        {cell.icon} {cell.label}
                      </div>
                      <div className="font-black text-slate-800 leading-tight">{cell.value}</div>
                    </div>
                  ))}
                </div>
                {med.warning && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-100 border-2 border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" /> {med.warning}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Issues Detected */}
          {result.issues.length > 0 && (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
              <h3 className="text-sm font-black text-amber-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Issues Detected ({result.issues.length})
              </h3>
              <ul className="space-y-2">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-xs text-amber-900 flex items-start gap-2 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-300 text-amber-900 flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process Flow */}
          <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-5">
            <h3 className="text-xs font-black text-sky-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {["Upload prescription image", "Run OCR text extraction", "Extract medicines & dosage", "Validate completeness", "Flag issues for review"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white text-sky-900 border-2 border-sky-200 shadow-sm">{step}</span>
                  {i < 4 && <ChevronRight className="w-4 h-4 text-sky-300" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
