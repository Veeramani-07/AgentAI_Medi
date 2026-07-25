import type { LucideIcon } from "lucide-react";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, MinusCircle,
  PackageSearch, XCircle, Loader2,
} from "lucide-react";
import type { EquipmentStatus, PharmacyType, RequestStatus, Urgency } from "@/lib/types";

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  const map: Record<EquipmentStatus, { icon: LucideIcon; cls: string; label: string }> = {
    available: { icon: CheckCircle2, cls: "chip-success", label: "Available" },
    limited: { icon: AlertTriangle, cls: "chip-warning", label: "Limited" },
    "out-of-stock": { icon: XCircle, cls: "chip-error", label: "Out of Stock" },
    "on-order": { icon: Clock, cls: "chip-secondary", label: "On Order" },
  };
  const { icon: Icon, cls, label } = map[status];
  return <span className={cls}><Icon className="w-3 h-3" />{label}</span>;
}

export function PharmacyTypeBadge({ type }: { type: PharmacyType }) {
  const map: Record<PharmacyType, { cls: string; label: string }> = {
    rural: { cls: "chip-accent", label: "Rural" },
    "semi-urban": { cls: "chip-secondary", label: "Semi-Urban" },
    urban: { cls: "chip-primary", label: "Urban" },
  };
  const { cls, label } = map[type];
  return <span className={cls}>{label}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const map: Record<Urgency, { cls: string; label: string }> = {
    critical: { cls: "chip-error", label: "Critical" },
    urgent: { cls: "chip-warning", label: "Urgent" },
    normal: { cls: "chip-secondary", label: "Normal" },
  };
  const { cls, label } = map[urgency];
  return <span className={cls}>{label}</span>;
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { cls: string; label: string }> = {
    open: { cls: "chip-warning", label: "Open" },
    fulfilled: { cls: "chip-success", label: "Fulfilled" },
    expired: { cls: "chip-neutral", label: "Expired" },
    cancelled: { cls: "chip-neutral", label: "Cancelled" },
  };
  const { cls, label } = map[status];
  return <span className={cls}>{label}</span>;
}

export function StockBadge({ inStock, quantity }: { inStock: boolean; quantity?: number }) {
  if (inStock) return <span className="chip-success"><CheckCircle2 className="w-3 h-3" />In Stock{quantity ? ` · ${quantity}` : ""}</span>;
  return <span className="chip-error"><XCircle className="w-3 h-3" />Out of Stock</span>;
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return <span className="chip-secondary"><CheckCircle2 className="w-3 h-3" />Verified</span>;
}

export function Open24x7Badge({ is24x7 }: { is24x7: boolean }) {
  if (!is24x7) return null;
  return <span className="chip-primary"><Clock className="w-3 h-3" />24x7</span>;
}

export function EmptyState({
  icon: Icon = PackageSearch, title, subtitle, action,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-ink-400" />
      </div>
      <h3 className="text-lg font-bold text-ink-800">{title}</h3>
      {subtitle && <p className="text-sm text-ink-500 mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-ink-500">
      <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="card p-5 shimmer-bg h-32 rounded-2xl" />;
}

export function StatPill({ icon: Icon, label, value, tone = "primary" }: {
  icon: LucideIcon; label: string; value: string | number; tone?: "primary" | "secondary" | "accent";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-700 border-primary-100",
    secondary: "bg-secondary-50 text-secondary-700 border-secondary-100",
    accent: "bg-accent-50 text-accent-700 border-accent-100",
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${tones[tone]}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div className="leading-tight">
        <div className="text-xs font-medium opacity-70">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = pct >= 80 ? "bg-success-500" : pct >= 60 ? "bg-warning-500" : "bg-error-500";
  return (
    <div className="flex items-center gap-2">
      <Activity className="w-3.5 h-3.5 text-ink-400" />
      <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink-500 tabular-nums">{pct}%</span>
    </div>
  );
}

export function MinusCircleX() { return <MinusCircle />; }
