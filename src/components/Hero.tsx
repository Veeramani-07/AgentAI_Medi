import { Sparkles, MapPin, Stethoscope, HeartPulse, Building2, Truck, ArrowRight, ShieldCheck, Activity } from "lucide-react";
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
              <Activity className="w-3.5 h-3.5 text-emerald-300" /> Multi-AI Agentic Health Mesh · India
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
              Medical Care &amp; Pharmacy Swarm,{" "}
              <span className="bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                Cinematic &amp; AI-Driven.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl font-semibold">
              Find medicines, oxygen, ICU beds &amp; emergency care instantly. Powered by 5 specialized Pharmacy Agentic AIs, designed for both urban centers and rural healthcare networks across India.
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
                  Launch 5 Pharmacy AIs
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

              {!hasLocation && (
                <button
                  onClick={onUseLocation}
                  className="btn-secondary text-base px-5 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border-emerald-400/30 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-emerald-300" />
                  Share My Location
                </button>
              )}
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

        {/* 3 Key Feature Cards Below */}
        <div className="mt-14 grid sm:grid-cols-3 gap-5">
          <FeatureCard
            icon={Stethoscope}
            title="3D Multi-AI Orchestrator"
            desc="Unified DAG mesh routing diagnostic triage, drug interaction, logistics, and emergency dispatch seamlessly."
            onClick={onAgents || onAskAssistant}
          />
          <FeatureCard
            icon={HeartPulse}
            title="ICU & Oxygen Inventory"
            desc="Live tracking for ventilators, oxygen cylinders, blood banks, and ICU beds with instant reserve triggers."
            onClick={onNearby}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Rural & Teleconsult First"
            desc="Multilingual support in Hindi, Marathi, Tamil & Bengali, boosting underserved rural clinic access."
            onClick={onNearby}
          />
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

function FeatureCard({ icon: Icon, title, desc, onClick }: {
  icon: typeof Building2; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 text-left rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-all duration-300 backdrop-blur-md group relative overflow-hidden"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 via-teal-500/20 to-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20">
        <Icon className="w-6 h-6 text-emerald-300" />
      </div>
      <h3 className="font-bold text-white text-base flex items-center justify-between">
        {title}
        <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1.5 transition-transform" />
      </h3>
      <p className="text-xs sm:text-sm text-slate-200/80 mt-2 leading-relaxed">{desc}</p>
    </button>
  );
}
