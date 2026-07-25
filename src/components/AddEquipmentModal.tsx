import { useState } from "react";
import { Modal, Field, SubmitButton } from "./Modal";
import { insertEquipment } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { EQUIPMENT_TYPES } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { EquipmentType } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export function AddEquipmentModal({ open, onClose, onSubmitted }: Props) {
  const [pharmacyId, setPharmacyId] = useState("");
  const [pharmacies, setPharmacies] = useState<{ id: string; name: string; city: string }[]>([]);
  const [equipmentType, setEquipmentType] = useState<EquipmentType>("Ventilator");
  const [available, setAvailable] = useState(1);
  const [total, setTotal] = useState(1);
  const [status, setStatus] = useState("available");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function loadPharmacies() {
    if (pharmacies.length > 0) return;
    setFetching(true);
    const { data } = await supabase.from("pharmacies").select("id, name, city").order("name");
    setPharmacies(data || []);
    setFetching(false);
  }

  function reset() {
    setPharmacyId(""); setEquipmentType("Ventilator"); setAvailable(1); setTotal(1);
    setStatus("available"); setNote(""); setError(null); setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pharmacyId) { setError("Please select a pharmacy."); return; }
    if (available > total) { setError("Available count can't exceed total count."); return; }
    setLoading(true); setError(null);
    const { error } = await insertEquipment({
      pharmacy_id: pharmacyId, equipment_type: equipmentType,
      available_count: available, total_count: total, status, condition_note: note || undefined,
    });
    setLoading(false);
    if (error) { setError(error); return; }
    setDone(true);
    setTimeout(() => { reset(); onSubmitted(); onClose(); }, 1500);
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Add / Update Equipment" subtitle="Report ventilators, oxygen cylinders, ICU beds and other equipment availability at a pharmacy." maxWidth="max-w-lg">
      {done ? (
        <div className="flex flex-col items-center text-center py-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">Equipment updated!</h3>
          <p className="text-sm text-ink-500 mt-1">Availability is now live on the tracker.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" onFocus={loadPharmacies}>
          <Field label="Pharmacy">
            <select value={pharmacyId} onChange={(e) => setPharmacyId(e.target.value)} className="input">
              <option value="">{fetching ? "Loading…" : "Select a pharmacy…"}</option>
              {pharmacies.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
            </select>
          </Field>
          <Field label="Equipment type">
            <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value as EquipmentType)} className="input">
              {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Available count"><input type="number" min={0} value={available} onChange={(e) => setAvailable(Math.max(0, Number(e.target.value)))} className="input" /></Field>
            <Field label="Total count"><input type="number" min={0} value={total} onChange={(e) => setTotal(Math.max(0, Number(e.target.value)))} className="input" /></Field>
          </div>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="on-order">On order</option>
            </select>
          </Field>
          <Field label="Condition note (optional)">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input" placeholder="Functional, verified today, etc." />
          </Field>
          <SubmitButton loading={loading} label="Save equipment record" error={error} />
        </form>
      )}
    </Modal>
  );
}
