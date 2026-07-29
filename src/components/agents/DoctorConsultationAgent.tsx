import { useState } from "react";
import { Stethoscope, Video, Calendar, Clock, CheckCircle2, FileText, UserCheck, Star, Sparkles, MessageSquare } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  experienceYears: number;
  rating: number;
  hospital: string;
  consultationFee: number;
  nextSlot: string;
  languages: string[];
}

const DOCTORS: Doctor[] = [
  { id: "DOC-101", name: "Dr. K. Senthil Nathan", specialty: "Cardiologist & General Physician", degree: "MD, DM (Cardiology) - AIIMS", experienceYears: 18, rating: 4.9, hospital: "Apollo Hospitals, Chennai", consultationFee: 500, nextSlot: "Today at 04:30 PM", languages: ["English", "Tamil", "Hindi"] },
  { id: "DOC-102", name: "Dr. Ananya Roy", specialty: "Pulmonologist & Respiratory Specialist", degree: "MD (Pulmonary Medicine)", experienceYears: 12, rating: 4.8, hospital: "Fortis Healthcare, Bengaluru", consultationFee: 450, nextSlot: "Today at 05:15 PM", languages: ["English", "Bengali", "Hindi"] },
  { id: "DOC-103", name: "Dr. Rajesh Varma", specialty: "Endocrinologist & Diabetes Specialist", degree: "MD, DNB (Endocrinology)", experienceYears: 15, rating: 4.9, hospital: "Max Super Speciality, New Delhi", consultationFee: 600, nextSlot: "Tomorrow at 10:00 AM", languages: ["English", "Hindi", "Punjabi"] },
];

export function DoctorConsultationAgent() {
  const [symptomInput, setSymptomInput] = useState("Severe chest tightness, elevated blood pressure & shortness of breath");
  const [selectedDoctorId, setSelectedDoctorId] = useState("DOC-101");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const activeDoctor = DOCTORS.find((d) => d.id === selectedDoctorId)!;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-indigo-200 mb-1">
              <Video className="w-3 h-3 text-amber-300" /> Agent 9 · Telehealth Doctor AI
            </div>
            <h2 className="text-2xl font-black">AI Specialist Doctor Match & Teleconsultation</h2>
            <p className="text-xs text-indigo-100 font-medium">Matches patient symptoms to board-certified specialists across India, books instant tele-consultation slots & issues verified e-prescriptions.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Symptom Input & AI Doctor Matcher */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Symptom-Based AI Doctor Matching
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600">Describe Patient Symptoms / Conditions</label>
            <textarea
              rows={3}
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              className="input text-xs mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block">AI Recommended Certified Specialists</label>
            <div className="space-y-2.5">
              {DOCTORS.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setBookingConfirmed(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-sm"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> {doc.name}
                        </div>
                        <div className="text-[11px] font-semibold text-indigo-700">{doc.specialty}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{doc.hospital} · {doc.experienceYears} yrs exp.</div>
                      </div>
                      <div className="text-right">
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

        {/* Doctor Slot Booking & Digital e-Prescription */}
        <div className="card p-5 border-2 border-indigo-100 bg-indigo-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Video className="w-4 h-4 text-indigo-600" /> Telehealth Video Slot & Digital Rx
          </h3>

          <div className="p-4 rounded-xl bg-white border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900">{activeDoctor.name}</div>
                <div className="text-xs text-slate-500">{activeDoctor.degree}</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                <Clock className="w-3 h-3" /> {activeDoctor.nextSlot}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t">
              <div><strong className="text-slate-900">Languages:</strong> {activeDoctor.languages.join(", ")}</div>
              <div><strong className="text-slate-900">Mode:</strong> HD Encrypted Video Call + Digital Rx</div>
            </div>

            {!bookingConfirmed ? (
              <button
                onClick={() => setBookingConfirmed(true)}
                className="btn-primary w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Video className="w-4 h-4" /> Book Instant Consultation ({activeDoctor.nextSlot})
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 animate-fade-in">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Video Slot Confirmed!
                </div>
                <p className="text-[11px] text-emerald-800">
                  Video link sent to your registered mobile number. Doctor will issue digital e-prescription directly to your MediFinder cart.
                </p>
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-bold">
                  <span>Consultation ID: #TELE-2026-9901</span>
                  <span className="text-indigo-700 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Digital Rx Enabled
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
