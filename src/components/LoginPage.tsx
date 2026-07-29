import { useState } from "react";
import { User, Lock, Check, Shield, Activity, Sparkles, ArrowRight, Pill, HeartPulse, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginPageProps {
  onNavigateRegister: () => void;
}

export function LoginPage({ onNavigateRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">

      {/* ── Full-Screen Background Image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/login_bg.png')",
          background: "linear-gradient(135deg, #071930 0%, #0c2a52 30%, #0284c7 65%, #38bdf8 90%, #059669 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login_bg.png')" }}
        />
      </div>

      {/* ── Dark overlay to dim background ── */}
      <div className="absolute inset-0 bg-slate-950/55 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.85) 100%)"
        }}
      />

      {/* ── Left side floating pills / stats panel ── */}
      <div className="absolute top-8 left-6 bottom-8 hidden xl:flex flex-col justify-between pointer-events-none w-64 gap-4">
        {/* Panel 1 */}
        <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Live Health Network</span>
          </div>
          {[
            { label: "Pharmacies Live", value: "12,000+", color: "text-sky-300" },
            { label: "States Covered", value: "28 States", color: "text-emerald-300" },
            { label: "Medicines Tracked", value: "50,000+", color: "text-amber-300" },
            { label: "Orders Fulfilled", value: "2.4M+", color: "text-violet-300" },
          ].map((s, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-white/8 last:border-0">
              <span className="text-[11px] font-semibold text-white/60">{s.label}</span>
              <span className={`text-xs font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Panel 2 — Agents */}
        <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-4 shadow-2xl space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">5 Pharmacy Agents</span>
          </div>
          {[
            "Medicine Search & Stock",
            "Inventory Management",
            "Prescription Verification",
            "Drug Interaction Safety",
            "Smart Order Dispatch",
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-white/70 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              {a}
            </div>
          ))}
        </div>

        {/* Panel 3 — Badge */}
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/30 backdrop-blur-xl p-4 shadow-2xl text-center">
          <Pill className="w-8 h-8 text-cyan-300 mx-auto mb-2 animate-bounce" />
          <div className="text-xs font-black text-cyan-200 uppercase tracking-widest">Jan Aushadhi</div>
          <div className="text-[10px] text-cyan-400/80 font-semibold mt-0.5">Govt. Generic Medicine Network</div>
          <div className="mt-2 text-lg font-black text-white">72% Off</div>
          <div className="text-[10px] text-cyan-300 font-semibold">vs Branded Medicines</div>
        </div>
      </div>

      {/* ── Right side floating panel ── */}
      <div className="absolute top-8 right-6 bottom-8 hidden xl:flex flex-col justify-between pointer-events-none w-64 gap-4">
        {/* Emergency alerts */}
        <div className="rounded-2xl border border-rose-400/25 bg-rose-950/25 backdrop-blur-xl p-4 shadow-2xl space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">Emergency Alerts</span>
          </div>
          {[
            { city: "Mumbai", item: "Insulin shortage", level: "🔴 Critical" },
            { city: "Delhi", item: "Oxygen cylinders", level: "🟡 Low" },
            { city: "Chennai", item: "ICU beds", level: "🔴 Critical" },
            { city: "Bangalore", item: "Ventilators", level: "🟢 Available" },
          ].map((a, i) => (
            <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/8 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/80">{a.city}</span>
                <span className="text-[9px] font-black text-white/60">{a.level}</span>
              </div>
              <div className="text-[10px] text-rose-300 font-semibold">{a.item}</div>
            </div>
          ))}
        </div>

        {/* AI Features */}
        <div className="rounded-2xl border border-violet-400/25 bg-violet-950/25 backdrop-blur-xl p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-300">AI Features</span>
          </div>
          {[
            { label: "OCR Rx Reading", active: true },
            { label: "Drug Safety Audit", active: true },
            { label: "Live Stock Sync", active: true },
            { label: "Smart Routing", active: true },
            { label: "Digital Billing", active: true },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <span className="text-[11px] text-white/70 font-semibold">{f.label}</span>
              <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-4 shadow-2xl text-center">
          <Shield className="w-8 h-8 text-sky-300 mx-auto mb-2" />
          <div className="text-xs font-black text-sky-200 uppercase tracking-widest">Secure Access</div>
          <div className="text-[10px] text-sky-400/80 font-semibold mt-0.5 leading-tight">
            End-to-End Encrypted<br />HIPAA Compliant Platform
          </div>
        </div>
      </div>

      {/* ── Central Login Card ── */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Card glow ring */}
        <div className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.4), rgba(16,185,129,0.2), rgba(139,92,246,0.3))" }} />

        <div
          className="relative rounded-3xl p-8 shadow-2xl overflow-hidden"
          style={{
            background: "rgba(2, 12, 30, 0.65)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1.5px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Inner ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(16,185,129,0.4), transparent)" }} />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />

          {/* ── Logo & App Name ── */}
          <div className="flex flex-col items-center mb-7 relative z-10">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.5), rgba(16,185,129,0.4))", border: "1.5px solid rgba(56,189,248,0.4)" }}>
              <img
                src="/logo3d.png"
                alt="MediFinder India Logo"
                className="w-14 h-14 object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white text-center leading-tight">
              MediFinder India
            </h1>
            <p className="text-[11px] text-sky-300/90 font-black uppercase tracking-[0.2em] mt-1 text-center">
              AI-Powered Pharmacy Intelligence Platform
            </p>

            {/* Status pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              System Online — 5 Agents Active
            </div>
          </div>

          {/* ── Section Label ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Secure Staff Access</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ── Login Form ── */}
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-sky-300/80 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="staff@pharmacy.in"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(56,189,248,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.border = "1.5px solid rgba(56,189,248,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.border = "1.5px solid rgba(56,189,248,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-sky-300/80 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(56,189,248,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.border = "1.5px solid rgba(56,189,248,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.border = "1.5px solid rgba(56,189,248,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  rememberMe
                    ? "border-sky-400 bg-sky-500/30"
                    : "border-white/20 bg-white/5"
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 text-sky-300" />}
              </button>
              <span className="text-xs font-bold text-white/60">Remember Me on This Device</span>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-200 bg-rose-500/20 border border-rose-400/40">
                ⚠ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2.5 shadow-xl"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #0284c7, #059669)"
                  : "linear-gradient(135deg, #0284c7 0%, #0ea5e9 40%, #10b981 100%)",
                boxShadow: "0 8px 32px rgba(2,132,199,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  ACCESS AI PLATFORM
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">New to MediFinder?</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* ── Register Link ── */}
          <button
            onClick={onNavigateRegister}
            className="mt-4 w-full py-3 rounded-xl text-sm font-black text-sky-300 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: "rgba(56,189,248,0.08)",
              border: "1.5px solid rgba(56,189,248,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Register Your Pharmacy Now
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Bottom border glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), rgba(56,189,248,0.5), transparent)" }} />
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-[10px] text-white/30 font-semibold mt-4 uppercase tracking-widest">
          🔒 256-bit encrypted · HIPAA compliant · Powered by MediFinder India
        </p>
      </div>
    </div>
  );
}
