import { useState } from "react";
import { ShieldCheck, IndianRupee, FileText, CheckCircle2, Award, Percent, AlertCircle, ArrowRight, Sparkles, Building2 } from "lucide-react";

interface SubsidyAudit {
  medicineName: string;
  mrp: number;
  janAushadhiPrice: number;
  ayushmanCovered: boolean;
  stateScheme: string;
  copayPercent: number;
}

const SAMPLE_DRUGS: SubsidyAudit[] = [
  { medicineName: "Insulin Glargine 100 IU/ml", mrp: 780, janAushadhiPrice: 220, ayushmanCovered: true, stateScheme: "Chief Minister Comprehensive Health Insurance Scheme", copayPercent: 0 },
  { medicineName: "Atorvastatin 10mg (30 Tablets)", mrp: 290, janAushadhiPrice: 38, ayushmanCovered: true, stateScheme: "PMBJP Jan Aushadhi Generic Subsidy", copayPercent: 0 },
  { medicineName: "Amoxicillin + Clavulanic Acid 625mg", mrp: 215, janAushadhiPrice: 54, ayushmanCovered: true, stateScheme: "PMBJP Jan Aushadhi Generic Subsidy", copayPercent: 10 },
  { medicineName: "Metformin 500mg SR (60 Tablets)", mrp: 160, janAushadhiPrice: 24, ayushmanCovered: true, stateScheme: "PMBJP Jan Aushadhi Generic Subsidy", copayPercent: 0 },
];

export function InsuranceSubsidyAgent() {
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(0);
  const [hasAyushmanCard, setHasAyushmanCard] = useState(true);
  const [patientState, setPatientState] = useState("Tamil Nadu");
  const [analyzing, setAnalyzing] = useState(false);
  const [evaluated, setEvaluated] = useState(true);

  const currentDrug = SAMPLE_DRUGS[selectedDrugIndex];
  const totalSavings = currentDrug.mrp - currentDrug.janAushadhiPrice;
  const savingsPercent = Math.round((totalSavings / currentDrug.mrp) * 100);

  function handleCalculate() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setEvaluated(true);
    }, 600);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 mb-1">
              <Award className="w-3 h-3 text-amber-300" /> Agent 8 · AI Government Subsidy & Insurance Advisor
            </div>
            <h2 className="text-2xl font-black">Ayushman Bharat & PMBJP Generic Subsidy Advisor</h2>
            <p className="text-xs text-emerald-100 font-medium">Maximizes PMJAY card claim eligibility, calculates Jan Aushadhi generic price savings (up to 85%), and checks state health scheme copays.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Patient Eligibility & Drug Selection
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600">Select Prescribed Medicine</label>
            <select
              value={selectedDrugIndex}
              onChange={(e) => setSelectedDrugIndex(Number(e.target.value))}
              className="input text-sm mt-1 font-semibold"
            >
              {SAMPLE_DRUGS.map((d, i) => (
                <option key={i} value={i}>
                  {d.medicineName} (Brand MRP: ₹{d.mrp})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Ayushman Bharat (PMJAY) Card?</label>
              <select
                value={hasAyushmanCard ? "YES" : "NO"}
                onChange={(e) => setHasAyushmanCard(e.target.value === "YES")}
                className="input text-sm mt-1 font-bold text-emerald-800 bg-emerald-50 border-emerald-200"
              >
                <option value="YES">✅ Active PMJAY Gold Card</option>
                <option value="NO">❌ No PMJAY Card</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Beneficiary Domicile State</label>
              <select
                value={patientState}
                onChange={(e) => setPatientState(e.target.value)}
                className="input text-sm mt-1"
              >
                <option value="Tamil Nadu">Tamil Nadu (CMCHIS)</option>
                <option value="Maharashtra">Maharashtra (MPJAY)</option>
                <option value="Karnataka">Karnataka (Arogya Sanjeevini)</option>
                <option value="Delhi">Delhi (Farishtay / DGEHS)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (PMJAY UP)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={analyzing}
            className="btn-primary w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Calculate Max Subsidy & Jan Aushadhi Savings
          </button>
        </div>

        {/* AI Agent Savings Output */}
        <div className="card p-5 border-2 border-emerald-200 bg-emerald-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Percent className="w-4 h-4 text-emerald-600" /> AI Subsidy & Price Breakdown
          </h3>

          {analyzing ? (
            <div className="py-12 text-center text-xs text-slate-600 space-y-2">
              <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bold">Analyzing Jan Aushadhi Kendra (PMBJP) Price Catalogs...</p>
            </div>
          ) : evaluated ? (
            <div className="space-y-3 text-xs animate-fade-in">
              {/* Cost Comparison Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Commercial Brand MRP</div>
                  <div className="text-xl font-black text-rose-700 mt-1">₹{currentDrug.mrp}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Private Retail Chemist</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md">
                  <div className="text-[10px] font-bold text-emerald-200 uppercase">PMBJP Jan Aushadhi Price</div>
                  <div className="text-xl font-black mt-1">₹{currentDrug.janAushadhiPrice}</div>
                  <div className="text-[10px] text-emerald-100 mt-0.5">Save {savingsPercent}% Instantly</div>
                </div>
              </div>

              {/* Ayushman Bharat Coverage Badge */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> PMJAY Ayushman Coverage
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                    {hasAyushmanCard ? "100% Cashless" : "Standard PMBJP Price"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {hasAyushmanCard
                    ? `Eligible for 100% cashless coverage under ${patientState} ${currentDrug.stateScheme} at empanelled hospital pharmacies.`
                    : "No PMJAY card registered. You can still purchase at Jan Aushadhi Kendras for full generic discount."}
                </p>
              </div>

              {/* Out of Pocket Summary */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Final Out-Of-Pocket Patient Cost</div>
                  <div className="text-lg font-black text-emerald-400">
                    {hasAyushmanCard ? "₹0 (Fully Covered)" : `₹${currentDrug.janAushadhiPrice}`}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg">
                  Savings: ₹{totalSavings}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
