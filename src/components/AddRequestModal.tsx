import { useState } from "react";
import { Modal, Field, SubmitButton } from "./Modal";
import { insertRequest } from "@/lib/hooks";
import { INDIAN_STATES, EQUIPMENT_TYPES } from "@/lib/utils";
import { CheckCircle2, Package, Stethoscope } from "lucide-react";
import type { RequestType, Urgency } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export function AddRequestModal({ open, onClose, onSubmitted }: Props) {
  const [type, setType] = useState<RequestType>("medicine");
  const [itemName, setItemName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState<Urgency>("urgent");
  const [condition, setCondition] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setType("medicine"); setItemName(""); setGenericName(""); setQuantity(1);
    setUrgency("urgent"); setCondition(""); setName(""); setPhone("");
    setCity(""); setState(""); setNotes(""); setError(null); setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemName || !name || !phone || !city || !state) {
      setError("Please fill in item name, your name, phone, city, and state.");
      return;
    }
    setLoading(true); setError(null);
    const { error } = await insertRequest({
      request_type: type, item_name: itemName, generic_name: genericName || null,
      quantity, urgency, patient_condition: condition || null,
      requester_name: name, requester_phone: phone, city, state, notes: notes || null,
    });
    setLoading(false);
    if (error) { setError(error); return; }
    setDone(true);
    setTimeout(() => { reset(); onSubmitted(); onClose(); }, 1500);
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Post Emergency Request" subtitle="Your request appears on the public board so pharmacies and volunteers can respond." maxWidth="max-w-xl">
      {done ? (
        <div className="flex flex-col items-center text-center py-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">Request posted!</h3>
          <p className="text-sm text-ink-500 mt-1">It's now visible on the Emergency Request Board.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {/* Type toggle */}
          <div>
            <label className="label">What do you need?</label>
            <div className="grid grid-cols-2 gap-2">
              <TypeButton active={type === "medicine"} onClick={() => setType("medicine")} icon={Package} label="Medicine" />
              <TypeButton active={type === "equipment"} onClick={() => setType("equipment")} icon={Stethoscope} label="Equipment" />
            </div>
          </div>

          {type === "equipment" ? (
            <Field label="Equipment type">
              <select value={itemName} onChange={(e) => setItemName(e.target.value)} className="input">
                <option value="">Select equipment…</option>
                {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          ) : (
            <>
              <Field label="Medicine name" hint="Brand or common name, e.g. Dolo 650">
                <input value={itemName} onChange={(e) => setItemName(e.target.value)} className="input" placeholder="Dolo 650" />
              </Field>
              <Field label="Generic name (optional)">
                <input value={genericName} onChange={(e) => setGenericName(e.target.value)} className="input" placeholder="Paracetamol" />
              </Field>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity">
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="input" />
            </Field>
            <Field label="Urgency">
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)} className="input">
                <option value="critical">Critical — life threatening</option>
                <option value="urgent">Urgent — needed today</option>
                <option value="normal">Normal — within a few days</option>
              </select>
            </Field>
          </div>

          <Field label="Patient condition (optional)" hint="Helps pharmacies prioritize and prepare">
            <input value={condition} onChange={(e) => setCondition(e.target.value)} className="input" placeholder="Fever 102F, elderly patient" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Your name"><input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Full name" /></Field>
            <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="98765 43210" /></Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="Mumbai" /></Field>
            <Field label="State">
              <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                <option value="">Select state…</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Additional notes (optional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input" placeholder="Delivery preference, timing, etc." />
          </Field>

          <SubmitButton loading={loading} label="Post request" error={error} />
        </form>
      )}
    </Modal>
  );
}

function TypeButton({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: typeof Package; label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
        active ? "border-primary-400 bg-primary-50 text-primary-700" : "border-ink-200 text-ink-600 hover:border-ink-300"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}
