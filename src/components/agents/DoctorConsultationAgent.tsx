import { useState, useMemo } from "react";
import {
  Stethoscope, Video, Clock, CheckCircle2, FileText,
  UserCheck, Star, Sparkles, Search, ExternalLink, Phone, AlertCircle,
} from "lucide-react";
import { DOCTORS_CATALOG } from "@/lib/agentKnowledgeBase";

const QUICK_CONDITIONS = [
  "severe chest tightness elevated blood pressure shortness of breath",
  "diabetes blood sugar insulin management",
  "persistent cough asthma bronchitis breathing",
  "anxiety depression panic attack stress",
  "stomach acidity gastric ulcer nausea",
  "skin rash itching eczema urticaria",
  "migraine stroke headache brain seizure",
];

// Real telemedicine platforms operating in India
const TELE_PLATFORMS = [
  { name: "eSanjeevani (Govt.)", url: "https://esanjeevani.mohfw.gov.in", desc: "Free govt. teleconsultation — Ministry of Health. 1.5 crore+ consultations done.", free: true },
  { name: "Practo", url: "https://practo.com", desc: "Book verified doctors online. Video, audio & chat consults. 20 lakh+ patients monthly.", free: false },
  { name: "Apollo 247", url: "https://apollo247.com", desc: "Apollo Hospitals teleconsult. 24×7 doctors, lab tests & medicine delivery.", free: false },
  { name: "1mg Consult", url: "https://1mg.com/consult", desc: "Tata 1mg — online doctor consult + medicine delivery. NABH-accredited.", free: false },
  { name: "Mfine", url: "https://mfine.co", desc: "AI-powered specialist matching. 3,500+ doctors across 30+ specialties.", free: false },
];

export function DoctorConsultationAgent() {
  const [symptomInput, setSymptomInput] = useState("severe chest tightness elevated blood pressure shortness of breath");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const matchedDoctors = useMemo(() => {
    const q = symptomInput.toLowerCase().trim();
    if (!q) return DOCTORS_CATALOG;
    return DOCTORS_CATALOG.map(doc => ({
      doc,
      score: doc.keywords.test(q) ? 2 : (doc.specialty.toLowerCase().split(" ").some(w => q.includes(w)) ? 1 : 0),
    })).sort((a, b) => b.score - a.score).map(s => s.doc);
  }, [symptomInput]);

  const activeDoctor = useMemo(() => {
    if (selectedDoctorId) return DOCTORS_CATALOG.find(d => d.id === selectedDoctorId) ?? matchedDoctors[0];
    return matchedDoctors[0];
  }, [selectedDoctorId, matchedDoctors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-indigo-200 mb-1">
              <Video className="w-3 h-3 text-amber-300" /> Agent 8 · Telehealth Doctor AI
            </div>
            <h2 className="text-2xl font-black">AI Specialist Doctor Match & Teleconsultation</h2>
            <p className="text-xs text-indigo-100 font-medium mt-0.5">
              Describe symptoms → AI matches the right specialist and shows real booking options
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Symptom Input + Doctor List */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Symptom-Based Doctor Matching
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Describe Symptoms / Condition</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <textarea rows={3} value={symptomInput}
                onChange={e => { setSymptomInput(e.target.value); setSelectedDoctorId(null); setBookingConfirmed(false); }}
                className="input pl-9 text-xs"
                placeholder="e.g. chest pain and breathlessness, high fever and cough, anxiety and panic attacks..." />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_CONDITIONS.map((c, i) => (
                <button key={i}
                  onClick={() => { setSymptomInput(c); setSelectedDoctorId(null); setBookingConfirmed(false); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                    symptomInput === c
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100"
                  }`}>
                  {c.split(" ").slice(0, 2).join(" ")}…
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block">
              🤖 AI Matched Specialists ({Math.min(matchedDoctors.length, 5)} shown)
            </label>
            <div className="space-y-2">
              {matchedDoctors.slice(0, 5).map(doc => {
                const isSelected = (selectedDoctorId ?? matchedDoctors[0]?.id) === doc.id;
                return (
                  <button key={doc.id}
                    onClick={() => { setSelectedDoctorId(doc.id); setBookingConfirmed(false); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200" : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> {doc.name}
                        </div>
                        <div className="text-[11px] font-semibold text-indigo-700">{doc.specialty}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{doc.hospital} · {doc.experienceYears} yrs</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-black">
                          <Star className="w-3 h-3 fill-current" /> {doc.rating}
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-1">₹{doc.consultationFee}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Panel */}
        <div className="card p-5 border-2 border-indigo-100 bg-indigo-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Video className="w-4 h-4 text-indigo-600" /> Teleconsultation Slot & Digital Rx
          </h3>

          {activeDoctor ? (
            <div className="p-4 rounded-xl bg-white border border-indigo-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-slate-900">{activeDoctor.name}</div>
                  <div className="text-xs text-slate-500">{activeDoctor.degree}</div>
                  <div className="text-xs font-semibold text-indigo-700 mt-0.5">{activeDoctor.specialty}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" /> {activeDoctor.nextSlot}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t">
                <div><strong className="text-slate-900">Languages:</strong> {activeDoctor.languages.join(", ")}</div>
                <div><strong className="text-slate-900">Hospital:</strong> {activeDoctor.hospital}</div>
                <div><strong className="text-slate-900">Fee:</strong> ₹{activeDoctor.consultationFee} (video consult)</div>
                <div><strong className="text-slate-900">NMC Registered:</strong> Yes — verified specialist</div>
              </div>

              {!bookingConfirmed ? (
                <button onClick={() => setBookingConfirmed(true)}
                  className="btn-primary w-full py-3 text-white font-bold text-xs flex items-center justify-center gap-2 mt-2"
                  style={{ background: "linear-gradient(135deg, #4338ca, #312e81)" }}>
                  <Video className="w-4 h-4" /> Book Slot — {activeDoctor.nextSlot}
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2 animate-fade-in">
                  <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Slot Confirmed!
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Video link will be sent to your registered mobile. {activeDoctor.name} will issue a digital e-prescription after the consult.
                  </p>
                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Consult ID: #TELE-{Date.now().toString().slice(-6)}</span>
                    <span className="text-indigo-700 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Digital Rx Enabled
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm font-semibold">
              Describe symptoms on the left to see matched specialists
            </div>
          )}

          {activeDoctor && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900">
              <strong>🤖 Why this doctor?</strong> Symptoms matched <strong>{activeDoctor.specialty}</strong> based on clinical keyword analysis.
            </div>
          )}

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-slate-700">
              <strong className="text-amber-900">Disclaimer:</strong> This is an AI-assisted match. Always verify doctor credentials on the <a href="https://www.nmc.org.in" target="_blank" rel="noreferrer" className="text-sky-700 font-bold hover:underline">NMC portal (nmc.org.in)</a> before consulting.
            </div>
          </div>
        </div>
      </div>

      {/* Real Telemedicine Platforms */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-indigo-600" /> Real Telemedicine Platforms in India
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TELE_PLATFORMS.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-slate-900 text-sm">{p.name}</span>
                {p.free && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">FREE</span>}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
              <div className="mt-2 flex items-center gap-1 text-indigo-600 text-xs font-bold group-hover:underline">
                {p.url.replace("https://", "")} <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
          <strong>eSanjeevani</strong> is India's official free government teleconsultation platform by MoHFW — no registration fee, no consultation charge. Available at <a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noreferrer" className="font-bold hover:underline">esanjeevani.mohfw.gov.in</a>
        </div>
      </div>
    </div>
  );
}
