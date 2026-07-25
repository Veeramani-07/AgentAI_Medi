import { useMemo, useState } from "react";
import {
  AlertTriangle, Plus, Phone, MapPin, Clock, Package, Stethoscope,
  Filter, ChevronDown, CheckCircle2, XCircle, Heart,
} from "lucide-react";
import { useRequests, updateRequestStatus } from "@/lib/hooks";
import { UrgencyBadge, RequestStatusBadge, EmptyState, LoadingSpinner } from "./Badges";
import { timeAgo, INDIAN_STATES } from "@/lib/utils";
import type { EmergencyRequest, RequestStatus } from "@/lib/types";

export function RequestBoard({ onAdd }: { onAdd: () => void }) {
  const { requests, loading, refetch } = useRequests();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "medicine" | "equipment">("all");

  const filtered = useMemo(() => {
    return requests.filter((r) =>
      (statusFilter === "all" || r.status === statusFilter) &&
      (typeFilter === "all" || r.request_type === typeFilter)
    );
  }, [requests, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const open = requests.filter((r) => r.status === "open").length;
    const critical = requests.filter((r) => r.status === "open" && r.urgency === "critical").length;
    const fulfilled = requests.filter((r) => r.status === "fulfilled").length;
    return { open, critical, fulfilled };
  }, [requests]);

  async function mark(id: string, status: RequestStatus) {
    await updateRequestStatus(id, status);
    refetch();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="section-eyebrow text-accent-600"><AlertTriangle className="w-4 h-4" /> Emergency Request Board</div>
          <h2 className="text-2xl font-bold text-ink-900 mt-1">Community help requests</h2>
          <p className="text-sm text-ink-500 mt-1">Post urgent needs for medicines or equipment. Pharmacies and volunteers across India can respond.</p>
        </div>
        <button onClick={onAdd} className="btn-accent shrink-0">
          <Plus className="w-4 h-4" /> Post Emergency Request
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-warning-100 bg-warning-50 p-3.5 text-warning-700">
          <Clock className="w-5 h-5 mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{stats.open}</div>
          <div className="text-xs font-medium opacity-80">Open requests</div>
        </div>
        <div className="rounded-xl border border-error-100 bg-error-50 p-3.5 text-error-700">
          <AlertTriangle className="w-5 h-5 mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{stats.critical}</div>
          <div className="text-xs font-medium opacity-80">Critical</div>
        </div>
        <div className="rounded-xl border border-success-100 bg-success-50 p-3.5 text-success-700">
          <Heart className="w-5 h-5 mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{stats.fulfilled}</div>
          <div className="text-xs font-medium opacity-80">Fulfilled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "all")}
            className="input appearance-none pl-10 pr-10 cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "medicine" | "equipment")}
            className="input appearance-none pr-10 min-w-[180px] cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="medicine">Medicine</option>
            <option value="equipment">Equipment</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading requests…" /> : filtered.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No requests here"
          subtitle="When someone posts an emergency need, it will appear here."
          action={<button onClick={onAdd} className="btn-accent"><Plus className="w-4 h-4" /> Post the first request</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((r) => <RequestCard key={r.id} req={r} onMark={mark} />)}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, onMark }: { req: EmergencyRequest; onMark: (id: string, s: RequestStatus) => void }) {
  const Icon = req.request_type === "medicine" ? Package : Stethoscope;
  return (
    <div className={`card-hover p-5 ${req.urgency === "critical" && req.status === "open" ? "ring-2 ring-error-200" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            req.request_type === "medicine" ? "bg-primary-100 text-primary-600" : "bg-secondary-100 text-secondary-600"
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-ink-900 truncate">{req.item_name}</h4>
            <p className="text-xs text-ink-500 mt-0.5">
              {req.request_type === "medicine" ? "Medicine" : "Equipment"} · Qty {req.quantity}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <UrgencyBadge urgency={req.urgency} />
          <RequestStatusBadge status={req.status} />
        </div>
      </div>

      {req.patient_condition && (
        <p className="text-sm text-ink-700 mt-3 bg-ink-50 rounded-lg px-3 py-2">
          <span className="font-semibold text-ink-500">Condition: </span>{req.patient_condition}
        </p>
      )}

      <div className="flex items-center gap-3 mt-3 text-sm">
        <span className="font-medium text-ink-700">{req.requester_name}</span>
        <span className="text-ink-300">·</span>
        <span className="flex items-center gap-1 text-ink-500"><MapPin className="w-3.5 h-3.5" /> {req.city}, {req.state}</span>
        <span className="text-ink-300">·</span>
        <span className="flex items-center gap-1 text-ink-400"><Clock className="w-3.5 h-3.5" /> {timeAgo(req.created_at)}</span>
      </div>

      {req.notes && <p className="text-xs text-ink-500 mt-2 italic">{req.notes}</p>}

      {req.status === "open" && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink-100">
          <a href={`tel:${req.requester_phone}`} className="btn-primary flex-1 text-sm py-2">
            <Phone className="w-4 h-4" /> Call {req.requester_phone}
          </a>
          <button onClick={() => onMark(req.id, "fulfilled")} className="btn-secondary text-sm py-2" title="Mark as fulfilled">
            <CheckCircle2 className="w-4 h-4 text-success-600" /> Fulfill
          </button>
          <button onClick={() => onMark(req.id, "cancelled")} className="btn-ghost text-sm py-2" title="Cancel">
            <XCircle className="w-4 h-4 text-error-500" />
          </button>
        </div>
      )}
    </div>
  );
}

export { INDIAN_STATES };
