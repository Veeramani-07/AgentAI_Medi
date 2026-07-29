import { useState, useMemo } from "react";
import {
  Search, Globe, FlaskConical, FileCheck,
  Sparkles, CheckCircle2, Clock, IndianRupee, AlertCircle,
} from "lucide-react";
import { RARE_DRUGS_CATALOG, type RareDrugEntry } from "@/lib/agentKnowledgeBase";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Orphan Drug", label: "Orphan Drug" },
  { value: "Specialized Import (Form 12B)", label: "Specialized Import" },
  { value: "Clinical Trial Access", label: "Clinical Trial" },
];

const STATUS_STYLES: Record<string, { bg: string; label: string; color: string }> = {
  IMPORT_AVAILABLE: { bg: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "✅ Import Available",  color: "text-emerald-700" },
  TRIAL_RECRUITING: { bg: "bg-indigo-100 text-indigo-800 border-indigo-300",   label: "🔬 Trial Recruiting",  color: "text-indigo-700"  },
  LIMITED_STOCK:    { bg: "bg-amber-100 text-amber-800 border-amber-300",       label: "⚠️ Limited Stock",    color: "text-amber-700"   },
};

export function ClinicalTrialMedicineAgent() {
  const [searchQuery, setSearchQuery]               = useState("");
  const [selectedCategory, setSelectedCategory]     = useState("all");
  const [selectedDrug, setSelectedDrug]             = useState<RareDrugEntry>(RARE_DRUGS_CATALOG[0]);
  const [patientName, setPatientName]               = useState("");
  const [doctorName, setDoctorName]                 = useState("");
  const [requestSubmitted, setRequestSubmitted]     = useState(false);

  // ── Fully dynamic filter: match any text to drug name, indication, or keywords ──
  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RARE_DRUGS_CATALOG.filter(d => {
      const catMatch = selectedCategory === "all" || d.rarityCategory === selectedCategory;
      const textMatch = !q ||
        d.name.toLowerCase().includes(q) ||
        d.indication.toLowerCase().includes(q) ||
        d.keywords.test(q);
      return catMatch && textMatch;
    });
  }, [searchQuery, selectedCategory]);

  const statusStyle = STATUS_STYLES[selectedDrug.availabilityStatus] ?? STATUS_STYLES.LIMITED_STOCK;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(135deg, #311b92 0%, #4527a0 50%, #512da8 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-purple-200 mb-1">
              <Globe className="w-3 h-3 text-amber-300" /> Agent 10 · Rare Medicine & Clinical Trial Finder
            </div>
            <h2 className="text-2xl font-black">Orphan Drug Import & Clinical Trial Access Locator</h2>
            <p className="text-xs text-purple-100 font-medium">
              Search rare disease name or drug → AI finds orphan drugs, CDSCO Form 12B permits, and active trial centers
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Search Panel */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-600" /> Search Rare & Orphan Drug Catalog
          </h3>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setRequestSubmitted(false); }}
                placeholder="Search rare drug, disease name, or indication (e.g. leukemia, pulmonary fibrosis, SMA, cancer)..."
                className="input pl-9 text-xs"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="input text-xs w-40 font-semibold"
            >
              {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Quick Search Pills */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1.5">Quick Searches:</p>
            <div className="flex flex-wrap gap-1.5">
              {["Leukemia", "Spinraza SMA", "Pulmonary Fibrosis", "Eculizumab PNH", "Immunotherapy", "Pompe"].map(term => (
                <button
                  key={term}
                  onClick={() => { setSearchQuery(term); setRequestSubmitted(false); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          {filteredDrugs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-semibold">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              No drugs found for "{searchQuery}". Try a different disease name or category.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredDrugs.map(drug => {
                const isSelected = selectedDrug.id === drug.id;
                const st = STATUS_STYLES[drug.availabilityStatus];
                return (
                  <button
                    key={drug.id}
                    onClick={() => { setSelectedDrug(drug); setRequestSubmitted(false); }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm"
                        : "bg-white border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{drug.name}</div>
                        <div className="text-[11px] text-purple-700 font-semibold">{drug.indication}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{drug.rarityCategory}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold whitespace-nowrap ${st.bg}`}>
                        {st.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail & Request Panel */}
        <div className="card p-5 border-2 border-purple-100 bg-purple-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FileCheck className="w-4 h-4 text-purple-600" /> CDSCO Import Permit & Trial Access Details
          </h3>

          <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-4">
            {/* Drug Header */}
            <div>
              <div className="text-sm font-black text-slate-900">{selectedDrug.name}</div>
              <div className="text-xs text-purple-700 font-semibold">Indication: {selectedDrug.indication}</div>
              <div className="mt-1.5">
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-black ${statusStyle.bg}`}>
                  {statusStyle.label}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 border-t pt-3">
              <div>
                <strong className="text-slate-900 block">Import Hub</strong>
                <span className="text-slate-600">{selectedDrug.importingHub}</span>
              </div>
              <div>
                <strong className="text-slate-900 block">Lead Time</strong>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> ~{selectedDrug.estimatedLeadTimeDays} Days
                </span>
              </div>
              <div>
                <strong className="text-slate-900 block">Approx Cost</strong>
                <span className="flex items-center gap-1 font-black text-rose-700">
                  <IndianRupee className="w-3 h-3" /> {selectedDrug.approxCostINR.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <strong className="text-slate-900 block">CDSCO Permit</strong>
                <span className="text-amber-700 font-bold">Form 12B Required</span>
              </div>
            </div>

            {/* Trial Locations */}
            <div className="p-3 rounded-lg bg-purple-50 text-purple-900 text-xs">
              <strong className="font-bold block mb-1">Active Clinical Trial Centers:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {selectedDrug.trialLocations.map((loc, i) => <li key={i}>{loc}</li>)}
              </ul>
            </div>

            {/* Import Request Form */}
            {!requestSubmitted ? (
              <div className="space-y-3 border-t pt-3">
                <p className="text-xs font-bold text-slate-700">Initiate CDSCO Import Assistance</p>
                <input
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Patient full name"
                  className="input text-xs"
                />
                <input
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  placeholder="Treating physician name & hospital"
                  className="input text-xs"
                />
                <button
                  onClick={() => { if (patientName.trim()) setRequestSubmitted(true); }}
                  disabled={!patientName.trim()}
                  className="btn-primary w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Submit CDSCO Import Assistance Request
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1 animate-fade-in border-t pt-3">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Import Request Logged!
                </div>
                <p className="text-[11px] text-emerald-800">
                  Request for <strong>{selectedDrug.name}</strong> on behalf of <strong>{patientName}</strong> has been logged.
                  Our regulatory desk will contact <strong>{doctorName || "your treating physician"}</strong> to submit CDSCO Form 12B.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold">
                  Request ID: CDSCO-{Date.now().toString().slice(-6)} · Est. Lead Time: {selectedDrug.estimatedLeadTimeDays} days
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
