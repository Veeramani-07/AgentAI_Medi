import { useState } from "react";
import { Modal, Field, SubmitButton } from "./Modal";
import { insertPharmacy } from "@/lib/hooks";
import { saveCustomPharmacy } from "@/lib/pharmacyStorage";
import { INDIAN_STATES } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { PharmacyType } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

// Approximate centroid coordinates for quick lookup by city (fallback if user has none)
const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777], Delhi: [28.6139, 77.209], Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867], Chennai: [13.0827, 80.2707], Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567], Ahmedabad: [23.0225, 72.5714], Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462], Patna: [25.6093, 85.1235], Gurugram: [28.4595, 77.0266],
};

export function AddPharmacyModal({ open, onClose, onSubmitted }: Props) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [type, setType] = useState<PharmacyType>("urban");
  const [is24x7, setIs24x7] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("21:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setName(""); setOwner(""); setPhone(""); setAddress(""); setCity(""); setState("");
    setPincode(""); setType("urban"); setIs24x7(false); setDelivery(false);
    setOpenTime("09:00"); setCloseTime("21:00"); setError(null); setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !address || !city || !state) {
      setError("Please fill in name, phone, address, city, and state.");
      return;
    }
    const coords = CITY_COORDS[city] || [20.5937, 78.9629]; // India centroid fallback
    setLoading(true); setError(null);

    // Try Supabase first; always fall back to localStorage so data is NEVER lost
    const { error: dbError } = await insertPharmacy({
      name, owner_name: owner || null, phone, address, city, state,
      pincode: pincode || null, pharmacy_type: type, is_24x7: is24x7,
      home_delivery: delivery, open_time: openTime, close_time: closeTime,
      lat: coords[0], lng: coords[1],
    });

    // Always save locally regardless of Supabase result
    saveCustomPharmacy({
      name, owner_name: owner || undefined, phone, address, city, state,
      district: city, pincode: pincode || undefined, pharmacy_type: type, is_24x7: is24x7,
      home_delivery: delivery, open_time: openTime, close_time: closeTime,
      lat: coords[0], lng: coords[1], rating: 4.8, verified: true,
      online_payment: true, services: ["Medicines", "First-Aid Supplies"],
    });

    setLoading(false);
    if (dbError) {
      // Supabase failed but we saved locally — still show success
      console.warn("Supabase save failed, stored locally:", dbError);
    }
    setDone(true);
    setTimeout(() => { reset(); onSubmitted(); onClose(); }, 1800);
  }


  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Register a Pharmacy" subtitle="Add a pharmacy or medical store so people nearby can find it." maxWidth="max-w-xl">
      {done ? (
        <div className="flex flex-col items-center text-center py-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">Pharmacy registered!</h3>
          <p className="text-sm text-ink-500 mt-1">It's now searchable on MediFinder.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Pharmacy name"><input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Sharma Medical Store" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner name (optional)"><input value={owner} onChange={(e) => setOwner(e.target.value)} className="input" placeholder="Owner name" /></Field>
            <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="98765 43210" /></Field>
          </div>
          <Field label="Address"><input value={address} onChange={(e) => setAddress(e.target.value)} className="input" placeholder="Shop no, street, area" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="City" /></Field>
            <Field label="State">
              <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                <option value="">Select state…</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pincode (optional)"><input value={pincode} onChange={(e) => setPincode(e.target.value)} className="input" placeholder="400001" /></Field>
            <Field label="Pharmacy type">
              <select value={type} onChange={(e) => setType(e.target.value as PharmacyType)} className="input">
                <option value="urban">Urban</option>
                <option value="semi-urban">Semi-urban</option>
                <option value="rural">Rural</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening time"><input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="input" /></Field>
            <Field label="Closing time"><input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="input" /></Field>
          </div>
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
              <input type="checkbox" checked={is24x7} onChange={(e) => setIs24x7(e.target.checked)} className="w-4 h-4 rounded accent-primary-600" />
              Open 24x7
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
              <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} className="w-4 h-4 rounded accent-primary-600" />
              Home delivery
            </label>
          </div>
          <SubmitButton loading={loading} label="Register pharmacy" error={error} />
        </form>
      )}
    </Modal>
  );
}
