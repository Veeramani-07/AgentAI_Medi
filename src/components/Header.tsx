import { Plus, MapPin, Stethoscope, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTab: (id: string) => void;
  onAddPharmacy: () => void;
  hasLocation: boolean;
  onUseLocation: () => void;
  onSignOut: () => void;
}

const TABS = [
  { id: "home", label: "Home" },
  { id: "nearby", label: "Nearby" },
  { id: "assistant", label: "AI Assistant" },
  { id: "medicines", label: "Medicines" },
  { id: "equipment", label: "Equipment" },
  { id: "requests", label: "Emergency Board" },
  { id: "pharmacies", label: "Pharmacies" },
];

export function Header({ activeTab, onTab, onAddPharmacy, hasLocation, onUseLocation, onSignOut }: HeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-ink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onTab("home")} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-green group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-ink-900 leading-none">MediFinder</div>
              <div className="text-[10px] font-semibold text-primary-600 leading-none mt-0.5">India · AI-powered</div>
            </div>
          </button>

          {/* Desktop tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onUseLocation}
              className={`hidden sm:inline-flex btn-secondary text-xs px-3 ${hasLocation ? "text-primary-700 border-primary-200 bg-primary-50" : ""}`}
            >
              <MapPin className={`w-4 h-4 ${hasLocation ? "text-primary-600" : ""}`} />
              {hasLocation ? "Location on" : "Use location"}
            </button>
            <button onClick={onAddPharmacy} className="btn-primary text-xs px-3 hidden sm:inline-flex">
              <Plus className="w-4 h-4" /> Add Pharmacy
            </button>
            <button onClick={onSignOut} className="btn-secondary text-xs px-3 hidden sm:inline-flex" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen((o) => !o)} className="lg:hidden btn-ghost p-2" aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <div className="grid grid-cols-2 gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { onTab(t.id); setOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all ${
                    activeTab === t.id ? "bg-primary-50 text-primary-700" : "text-ink-600 hover:bg-ink-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { onUseLocation(); setOpen(false); }} className="btn-secondary flex-1 text-xs">
                <MapPin className="w-4 h-4" /> {hasLocation ? "Location on" : "Use location"}
              </button>
              <button onClick={() => { onAddPharmacy(); setOpen(false); }} className="btn-primary flex-1 text-xs">
                <Plus className="w-4 h-4" /> Add Pharmacy
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
