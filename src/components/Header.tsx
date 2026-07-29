import { Plus, MapPin, Menu, X, LogOut, Activity } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTab: (id: string) => void;
  onAddPharmacy: () => void;
  hasLocation: boolean;
  locationName?: string | null;
  onOpenLocationModal: () => void;
  onSignOut: () => void;
}

const TABS = [
  { id: "home",       label: "Home" },
  { id: "agents",     label: "🤖 10 Agentic AIs" },
  { id: "nearby",     label: "Nearby Finder" },
  { id: "assistant",  label: "AI Chat Assistant" },
];

export function Header({
  activeTab,
  onTab,
  onAddPharmacy,
  hasLocation,
  locationName,
  onOpenLocationModal,
  onSignOut,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100/80" style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(224,242,254,0.97) 50%, rgba(240,253,244,0.96) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: '0 4px 25px rgba(2,132,199,0.1), 0 1px 0 rgba(56,189,248,0.15)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <button onClick={() => onTab("home")} className="flex items-center gap-3 group shrink-0">
            {/* 3D Logo Image */}
            <div className="relative">
              <img
                src="/logo3d.png"
                alt="MediFinder Logo"
                className="app-logo-img"
              />
              {/* Live indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary-500 border-2 border-white animate-pulse" />
            </div>

            {/* Brand Text */}
            <div className="text-left hidden sm:block">
              <div className="font-black text-lg leading-none tracking-tight text-gradient-blue-green">
                MediFinder
              </div>
              <div className="text-[10px] font-bold tracking-widest text-ink-400 uppercase leading-none mt-0.5 flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-secondary-500" />
                India · AI Powered
              </div>
            </div>
          </button>

          {/* ── Desktop Nav Tabs ── */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all relative ${
                  activeTab === t.id
                    ? "text-primary-800 bg-primary-50 font-bold"
                    : "text-ink-500 hover:text-primary-700 hover:bg-primary-50/70"
                }`}
              >
                {t.label}
                {/* Active underline */}
                {activeTab === t.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500" />
                )}
              </button>
            ))}
          </nav>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLocationModal}
              className={`hidden sm:inline-flex btn-secondary text-xs px-3 py-2 gap-1.5 max-w-[200px] truncate ${
                hasLocation
                  ? "border-secondary-300 bg-secondary-50 text-secondary-700 font-bold"
                  : "text-ink-600"
              }`}
              title={locationName || "Set Location"}
            >
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${hasLocation ? "text-secondary-600" : ""}`} />
              <span className="truncate">{locationName ? locationName : "Set Location"}</span>
            </button>

            <button
              onClick={onAddPharmacy}
              className="hidden sm:inline-flex btn-primary text-xs px-3 py-2 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pharmacy
            </button>

            <button
              onClick={onSignOut}
              title="Sign Out"
              className="btn-ghost p-2 text-ink-500 hover:text-error-600 rounded-xl hidden sm:inline-flex"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="xl:hidden p-2 rounded-xl text-ink-600 hover:bg-primary-50 hover:text-primary-800 transition-all"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        {open && (
          <div className="xl:hidden pb-4 animate-slide-down border-t border-primary-100/60 pt-3">
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { onTab(t.id); setOpen(false); }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                    activeTab === t.id
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-ink-600 hover:bg-primary-50 hover:text-primary-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { onOpenLocationModal(); setOpen(false); }}
                className="btn-secondary flex-1 text-xs py-2 truncate"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{locationName || "Set Location"}</span>
              </button>
              <button
                onClick={() => { onAddPharmacy(); setOpen(false); }}
                className="btn-primary flex-1 text-xs py-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add Pharmacy
              </button>
              <button onClick={onSignOut} className="btn-ghost px-3 py-2 text-error-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
