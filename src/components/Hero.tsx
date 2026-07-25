import { Sparkles, MapPin, Stethoscope, HeartPulse, Building2, Truck, ArrowRight, ShieldCheck } from "lucide-react";
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
  onSelectMapPoint: (id: string, kind: "pharmacy" | "request") => void;
  selectedId: string | null;
}

export function Hero({
  pharmacies, requests, userLat, userLng, onUseLocation, hasLocation,
  onAskAssistant, onViewRequests, onNearby, onSelectMapPoint, selectedId,
}: HeroProps) {
  const openRequests = requests.filter((r) => r.status === "open").length;
  const criticalRequests = requests.filter((r) => r.status === "open" && r.urgency === "critical").length;
  const ruralCount = pharmacies.filter((p) => p.pharmacy_type === "rural").length;
  const statesCovered = new Set(pharmacies.map((p) => p.state)).size;

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-radial-fade" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 items-center">
          {/* Left: copy + CTAs */}
          <div className="animate-slide-up">
            <div className="section-eyebrow">
              <Sparkles className="w-4 h-4" /> Agentic AI · Live across India
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-ink-900 leading-[1.1] text-balance">
              Find medicines &amp; nearby pharmacies,
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> powered by AI.</span>
            </h1>
            <p className="mt-4 text-lg text-ink-600 max-w-xl leading-relaxed">
              Ask in plain language. I search live pharmacy stock and equipment — ventilators, oxygen, ICU beds — across cities and villages, and prioritize rural stores so help reaches everyone.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onAskAssistant} className="btn-primary text-base px-5 py-3 shadow-glow-green">
                <Sparkles className="w-5 h-5" /> Ask the AI Assistant
              </button>
              <button onClick={onViewRequests} className="btn-secondary text-base px-5 py-3">
                <HeartPulse className="w-5 h-5" /> {openRequests} open requests
              </button>
              {!hasLocation && (
                <button onClick={onUseLocation} className="btn-ghost text-base px-5 py-3">
                  <MapPin className="w-5 h-5" /> Share my location
                </button>
              )}
            </div>

            {/* Mini stats */}
            <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <HeroStat icon={Building2} value={pharmacies.length} label="Pharmacies" tone="primary" />
              <HeroStat icon={ShieldCheck} value={statesCovered} label="States covered" tone="secondary" />
              <HeroStat icon={Truck} value={ruralCount} label="Rural stores" tone="accent" />
              <HeroStat icon={HeartPulse} value={criticalRequests} label="Critical needs" tone="error" />
            </div>
          </div>

          {/* Right: interactive map */}
          <div className="animate-fade-in">
            <div className="card p-5 shadow-card-hover">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-ink-900">Live network map</h3>
                  <p className="text-xs text-ink-500">Pharmacies &amp; active emergency requests across India</p>
                </div>
                <span className="chip-primary"><MapPin className="w-3 h-3" /> {pharmacies.length} pins</span>
              </div>
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

        {/* Feature strip */}
        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          <FeatureCard
            icon={Stethoscope}
            title="Agentic AI Assistant"
            desc="Ask in Hindi or English. It parses intent, searches live stock, and explains its reasoning step-by-step."
            onClick={onAskAssistant}
          />
          <FeatureCard
            icon={HeartPulse}
            title="Equipment Tracker"
            desc="Live availability of ventilators, oxygen cylinders, ICU beds, nebulizers and more — anyone can update it."
            onClick={onNearby}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Rural-first by design"
            desc="Rural and semi-urban pharmacies are boosted in results so underserved areas aren't left behind."
            onClick={onNearby}
          />
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, value, label, tone }: {
  icon: typeof Building2; value: number; label: string; tone: "primary" | "secondary" | "accent" | "error";
}) {
  const tones = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    accent: "text-accent-600 bg-accent-50",
    error: "text-error-600 bg-error-50",
  };
  return (
    <div className="card p-3.5 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="leading-tight">
        <div className="text-xl font-bold text-ink-900 tabular-nums">{value}</div>
        <div className="text-xs text-ink-500">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, onClick }: {
  icon: typeof Building2; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="card-hover p-5 text-left group">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5.5 h-5.5 text-primary-700" />
      </div>
      <h3 className="font-bold text-ink-900 flex items-center gap-1.5">
        {title}
        <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
      </h3>
      <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{desc}</p>
    </button>
  );
}
