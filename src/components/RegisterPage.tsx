import { useState } from "react";
import { User, Lock, Check, Shield, Activity, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RegisterPageProps {
  onNavigateLogin: () => void;
}

export function RegisterPage({ onNavigateLogin }: RegisterPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 text-white font-sans">
        {/* ── Background Image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login_bg.png')" }}
        />
        <div className="absolute inset-0 bg-slate-950/65 pointer-events-none" />

        <div
          className="relative z-10 p-8 max-w-sm w-full text-center rounded-3xl overflow-hidden"
          style={{
            background: "rgba(2, 12, 30, 0.7)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1.5px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-cyan-300" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Verification Sent</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-semibold">
            Activation link dispatched to <strong className="text-cyan-300">{email}</strong>. Click it to register your node.
          </p>
          <button
            onClick={onNavigateLogin}
            className="w-full py-3.5 mt-6 rounded-xl border-2 border-cyan-300 bg-cyan-500/30 text-cyan-100 font-black tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            RETURN TO ACCESS PLATFORM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">

      {/* ── Full-Screen Background Image (Same as Login Page) ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login_bg.png')" }}
      />

      {/* ── Dark overlay to dim background ── */}
      <div className="absolute inset-0 bg-slate-950/55 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.85) 100%)"
        }}
      />

      {/* ── Central Register Card ── */}
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

          {/* ── Logo & App Name ── */}
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.5), rgba(16,185,129,0.4))", border: "1.5px solid rgba(56,189,248,0.4)" }}>
              <img
                src="/logo3d.png"
                alt="MediFinder India Logo"
                className="w-12 h-12 object-contain filter drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white text-center leading-tight">
              Register Pharmacy Node
            </h1>
            <p className="text-[10px] text-sky-300/90 font-black uppercase tracking-[0.2em] mt-1 text-center">
              MediFinder Healthcare Network
            </p>
          </div>

          {/* ── Section Label ── */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Staff Registration</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ── Register Form ── */}
          <form onSubmit={handleRegister} className="space-y-4 relative z-10">
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
                Choose Access Password
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

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-sky-300/80 mb-1.5">
                Confirm Access Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70 pointer-events-none" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold text-center">
                ⚠ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2.5 shadow-xl"
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
                  Creating Node…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  CREATE NODE ACCOUNT
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ── Link back to Login ── */}
          <div className="mt-5 text-center">
            <button
              onClick={onNavigateLogin}
              className="font-bold text-sky-300 hover:text-sky-200 uppercase tracking-wider text-xs underline underline-offset-4"
            >
              ALREADY REGISTERED? SIGN IN HERE
            </button>
          </div>

          {/* Bottom border glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), rgba(56,189,248,0.5), transparent)" }} />
        </div>
      </div>
    </div>
  );
}
