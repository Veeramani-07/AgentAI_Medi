import { Sparkles, MapPin, Stethoscope, HeartPulse, Building2, Truck, ArrowRight, ShieldCheck, Activity, Search, Package, FileText, ShieldAlert, Ambulance, Video, FlaskConical } from "lucide-react";
import { IndiaMap } from "./IndiaMap";
import type { Pharmacy, EmergencyRequest } from "@/lib/types";

interface HeroProps {
  pharmacies: Pharmacy[];
  requests: EmergencyRequest[];
  userLat: number | null;
  userLng: number | null;
  onUseLocation: () => void;
  hasLocation: boolean;
  onAskAssistant: () => void;
  onViewRequests: () => void;
  onNearby: () => void;
  onAgents?: () => void;
  onSelectMapPoint: (id: string, kind: "pharmacy" | "request") => void;
  selectedId: string | null;
}

const HERO_AGENTS_SHOWCASE = [
  { id: "search", name: "1. Medicine Search & Stock", icon: Search, desc: "Real-time stock search across 2,000+ pharmacies & generic alternatives", color: "from-sky-500 to-cyan-600" },
  { id: "inventory", name: "2. Inventory Management", icon: Package, desc: "Stock level tracking, low stock alerts & expiry monitoring", color: "from-teal-500 to-emerald-600" },
  { id: "prescription", name: "3. Prescription Verification", icon: FileText, desc: "OCR Rx reader extracting doctor details, medicines & dosage", color: "from-indigo-500 to-blue-600" },
  { id: "interaction", name: "4. Drug Interaction & Safety", icon: ShieldAlert, desc: "Safety audit for drug-drug conflicts, side effects & allergies", color: "from-rose-600 to-red-700" },
  { id: "fulfillment", name: "5. Smart Order & Delivery", icon: Truck, desc: "Instant courier routing, live dispatch & digital invoice billing", color: "from-emerald-600 to-green-700" },
  { id: "triage", name: "6. Symptom & Clinical Triage", icon: Stethoscope, desc: "Matches patient symptoms directly to recommended medicines & hospitals", color: "from-purple-600 to-violet-700" },
  { id: "ambulance", name: "7. Emergency ALS Ambulance", icon: Ambulance, desc: "Triage severity, route nearest ALS/BLS ambulances & ER beds", color: "from-red-600 to-rose-700" },
  { id: "insurance", name: "8. Ayushman & PMBJP Subsidy", icon: ShieldCheck, desc: "Calculates PMJAY claims & Jan Aushadhi generic savings up to 85%", color: "from-teal-600 to-emerald-700" },
  { id: "doctor", name: "9. Telehealth Doctor Consultation", icon: Video, desc: "Matches certified specialist doctors & generates e-prescriptions", color: "from-indigo-600 to-purple-700" },
  { id: "clinical", name: "10. Rare Drug & Clinical Trial", icon: FlaskConical, desc: "CDSCO Form 12B import clearance & active clinical trial centers", color: "from-purple-700 to-indigo-800" },
];

export function Hero({
  pharmacies, requests, userLat, userLng, onUseLocation, hasLocation,
  onAskAssistant, onViewRequests, onNearby, onAgents, onSelectMapPoint, selectedId,
}: HeroProps) {
  const openRequests = requests.filter((r) => r.status === "open").length;
  const criticalRequests = requests.filter((r) => r.status === "open" && r.urgency === "critical").length;
  const ruralCount = pharmacies.filter((p) => p.pharmacy_type === "rural").length;
  const statesCovered = new Set(pharmacies.map((p) => p.state)).size;

  return (
    <div className="relative hero-cinema text-white py-14 lg:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 items-center">
          
          {/* Left: copy + CTAs */}
          <div className="animate-slide-up space-y-6">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Activity className="w-3.5 h-3.5 text-emerald-300" /> 10 Autonomous AI Agents Mesh · India
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
              Autonomous 10-Agent AI Medical Platform,{" "}
              <span className="bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                Real-Time &amp; Dynamic.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl font-semibold">
              Find medicines, emergency ambulances, Ayushman Bharat subsidies &amp; specialist doctors instantly. Powered by 10 specialized Agentic AIs for urban centers and rural healthcare networks across India.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3.5">
              {onAgents && (
                <button
                  onClick={onAgents}
                  className="btn text-base px-6 py-3.5 rounded-2xl font-bold text-white shadow-glow-blue transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5"
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 50%, #15803d 100%)',
                    boxShadow: '0 8px 32px rgba(29,78,216,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  Launch 10 Agentic AIs
                </button>
              )}

              <button
                onClick={onAskAssistant}
                className="btn-secondary text-base px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Stethoscope className="w-5 h-5 text-sky-300" />
                AI Health Assistant
              </button>

              <button
                onClick={onViewRequests}
                className="btn-secondary text-base px-5 py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border-rose-400/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <HeartPulse className="w-5 h-5 text-rose-400" />
                {openRequests} Emergency Needs
              </button>
            </div>

            {/* Mini stats bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <HeroStat icon={Building2} value={pharmacies.length} label="Pharmacies" />
              <HeroStat icon={ShieldCheck} value={statesCovered} label="States Live" />
              <HeroStat icon={Truck} value={ruralCount} label="Rural Stores" />
              <HeroStat icon={HeartPulse} value={criticalRequests} label="Critical Alerts" />
            </div>
          </div>

          {/* Right: Interactive Live Map */}
          <div className="animate-fade-in">
            <div className="card-glass p-5 rounded-3xl shadow-cinematic border border-white/15 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Live India Health Network
                  </h3>
                  <p className="text-xs text-slate-300/80">Real-time sync across registered pharmacies &amp; dispatches</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                  {pharmacies.length} Active Nodes
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 shadow-inner">
                <IndiaMap
                  pharmacies={pharmacies}
                  requests={requests}
                  userLat={userLat}
                  userLng={userLng}
                  selectedId={selectedId}
                  onSelect={onSelectMapPoint}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 10 Agentic AI Showcase Grid on Homepage */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Autonomous AI Suite
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Explore All 10 Agentic AI Systems</h2>
            </div>
            {onAgents && (
              <button
                onClick={onAgents}
                className="btn-secondary text-xs px-4 py-2 bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-xl font-bold flex items-center gap-1.5"
              >
                Open Agent Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {HERO_AGENTS_SHOWCASE.map((ag) => {
              const Icon = ag.icon;
              return (
                <button
                  key={ag.id}
                  onClick={onAgents}
                  className="p-4 text-left rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-md group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ag.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-white text-xs sm:text-sm leading-tight">{ag.name}</h3>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed line-clamp-3 font-medium">{ag.desc}</p>
                  </div>
                  <div className="mt-3 text-[11px] font-bold text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Run Agent <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, value, label }: {
  icon: typeof Building2; value: number; label: string;
}) {
  return (
    <div className="p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-emerald-500/30 flex items-center justify-center shrink-0 border border-white/15">
        <Icon className="w-4.5 h-4.5 text-sky-200" />
      </div>
      <div className="leading-tight">
        <div className="text-lg font-black text-white tabular-nums">{value}</div>
        <div className="text-[11px] font-medium text-slate-300">{label}</div>
      </div>
    </div>
  );
}
