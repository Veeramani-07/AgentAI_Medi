import { useState } from "react";
import { Search, Globe, FlaskConical, AlertCircle, FileCheck, ExternalLink, ShieldAlert, Sparkles, Building2, CheckCircle2 } from "lucide-react";

interface RareDrug {
  id: string;
  name: string;
  indication: string;
  rarityCategory: "Orphan Drug" | "Specialized Import (Form 12B)" | "Clinical Trial Access";
  availabilityStatus: "IMPORT_AVAILABLE" | "TRIAL_RECRUITING" | "LIMITED_STOCK";
  importingHub: string;
  estimatedLeadTimeDays: number;
  trialLocations: string[];
  approxCostINR: number;
}

const RARE_DRUGS_CATALOG: RareDrug[] = [
  { id: "RARE-01", name: "Eculizumab 300mg (Soliris)", indication: "Paroxysmal Nocturnal Hemoglobinuria (PNH)", rarityCategory: "Orphan Drug", availabilityStatus: "IMPORT_AVAILABLE", importingHub: "Apollo Global Rare Drug Cell, Mumbai", estimatedLeadTimeDays: 5, trialLocations: ["AIIMS New Delhi", "CMC Vellore"], approxCostINR: 145000 },
  { id: "RARE-02", name: "Nusinersen (Spinraza 12mg)", indication: "Spinal Muscular Atrophy (SMA Type 1/2)", rarityCategory: "Specialized Import (Form 12B)", availabilityStatus: "TRIAL_RECRUITING", importingHub: "CDSCO Approved Import Cell, Bengaluru", estimatedLeadTimeDays: 7, trialLocations: ["NIMHANS Bengaluru", "PGIMER Chandigarh"], approxCostINR: 280000 },
  { id: "RARE-03", name: "Pirfenidone 200mg (Idiopathic Pulmonary Fibrosis)", indication: "Advanced Idiopathic Pulmonary Fibrosis", rarityCategory: "Clinical Trial Access", availabilityStatus: "LIMITED_STOCK", importingHub: "Jan Aushadhi Rare Cell, Hyderabad", estimatedLeadTimeDays: 2, trialLocations: ["Tata Memorial Hospital Mumbai"], approxCostINR: 1200 },
];

export function ClinicalTrialMedicineAgent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDrug, setSelectedDrug] = useState<RareDrug>(RARE_DRUGS_CATALOG[0]);
  const [requestImportSubmitted, setRequestImportSubmitted] = useState(false);

  const filteredDrugs = RARE_DRUGS_CATALOG.filter((d) => {
    const matchesCat = selectedCategory === "all" || d.rarityCategory === selectedCategory;
    const matchesSearch = !searchQuery.trim() || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.indication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #311b92 0%, #4527a0 50%, #512da8 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-widest text-purple-200 mb-1">
              <Globe className="w-3 h-3 text-amber-300" /> Agent 10 · Rare Medicine & Clinical Trial Finder
            </div>
            <h2 className="text-2xl font-black">Orphan Drug Import & Clinical Trial Access Locator</h2>
            <p className="text-xs text-purple-100 font-medium">Locates rare orphan medicines, manages CDSCO Form 12B import permits, and connects patients to active clinical trials in India.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Rare Drug Search & Catalog */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-600" /> Search Rare & Orphan Drug Catalog
          </h3>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rare drug name, condition, or indication..."
                className="input pl-9 text-xs"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input text-xs w-40 font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="Orphan Drug">Orphan Drug</option>
              <option value="Specialized Import (Form 12B)">Specialized Import</option>
              <option value="Clinical Trial Access">Clinical Trial</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filteredDrugs.map((drug) => {
              const isSelected = selectedDrug.id === drug.id;
              return (
                <button
                  key={drug.id}
                  onClick={() => {
                    setSelectedDrug(drug);
                    setRequestImportSubmitted(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm"
                      : "bg-white border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{drug.name}</div>
                      <div className="text-[11px] text-purple-700 font-semibold">{drug.indication}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                      {drug.rarityCategory}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drug Import & Clinical Trial Detail */}
        <div className="card p-5 border-2 border-purple-100 bg-purple-50/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FileCheck className="w-4 h-4 text-purple-600" /> CDSCO Import Permit & Trial Access Info
          </h3>

          <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-3">
            <div>
              <div className="text-sm font-black text-slate-900">{selectedDrug.name}</div>
              <div className="text-xs text-purple-700 font-semibold">Indication: {selectedDrug.indication}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 border-t pt-2">
              <div><strong className="text-slate-900">Importing Hub:</strong> {selectedDrug.importingHub}</div>
              <div><strong className="text-slate-900">Lead Time:</strong> ~{selectedDrug.estimatedLeadTimeDays} Days</div>
              <div><strong className="text-slate-900">Approx Cost:</strong> ₹{selectedDrug.approxCostINR.toLocaleString("en-IN")}</div>
              <div><strong className="text-slate-900">CDSCO Permit:</strong> Form 12B Required</div>
            </div>

            <div className="p-3 rounded-lg bg-purple-50 text-purple-900 text-xs">
              <strong className="font-bold block mb-1">Active Clinical Trial Hospital Centers:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {selectedDrug.trialLocations.map((loc, i) => (
                  <li key={i}>{loc}</li>
                ))}
              </ul>
            </div>

            {!requestImportSubmitted ? (
              <button
                onClick={() => setRequestImportSubmitted(true)}
                className="btn-primary w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Initiate CDSCO Import Assistance Request
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Import Request Logged!
                </div>
                <p className="text-[11px] text-emerald-800">
                  Our regulatory desk will contact your treating physician to submit CDSCO Form 12B import permit documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
