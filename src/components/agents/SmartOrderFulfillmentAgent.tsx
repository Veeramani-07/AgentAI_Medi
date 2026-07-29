import { useState } from "react";
import { Truck, CheckCircle2, MapPin, Clock, Package, ChevronRight, Phone, Building2, ShieldCheck, IndianRupee, Zap, Sparkles } from "lucide-react";

interface OrderStep {
  title: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  assignedPharmacy: string;
  pharmacyDistanceKm: number;
  medicine: string;
  quantity: number;
  totalPrice: number;
  deliveryFee: number;
  finalAmount: number;
  paymentStatus: "Paid via UPI" | "Cash on Delivery" | "Pending";
  deliveryAgent: string;
  deliveryAgentPhone: string;
  estimatedDeliveryTime: string;
  statusSteps: OrderStep[];
}

export function SmartOrderFulfillmentAgent() {
  const [customerName, setCustomerName] = useState("Priya Sundaram");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [medName, setMedName] = useState("Paracetamol 650mg");
  const [qty, setQty] = useState(2);
  const [unitPrice, setUnitPrice] = useState(120);
  const [address, setAddress] = useState("T. Nagar, Chennai");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  function handleCreateOrder() {
    setLoading(true);

    setTimeout(() => {
      const orderNum = Math.floor(10000 + Math.random() * 90000);
      const subtotal = qty * unitPrice;
      const fee = subtotal > 500 ? 0 : 35;
      const total = subtotal + fee;
      const dist = Math.round((1.2 + Math.random() * 3.5) * 10) / 10;
      const eta = Math.round(15 + dist * 4);

      setOrder({
        orderId: `MED-2026-${orderNum}`,
        customerName,
        phone,
        deliveryAddress: address,
        assignedPharmacy: `Apollo Pharmacy - ${address.split(",")[0]} Branch`,
        pharmacyDistanceKm: dist,
        medicine: `${medName} (Qty: ${qty})`,
        quantity: qty,
        totalPrice: subtotal,
        deliveryFee: fee,
        finalAmount: total,
        paymentStatus: paymentMethod === "UPI" ? "Paid via UPI" : "Cash on Delivery",
        deliveryAgent: "Karthik R. (Dunzo Express Rider #884)",
        deliveryAgentPhone: "+91 91234 56789",
        estimatedDeliveryTime: `${eta} mins`,
        statusSteps: [
          { title: "Order Placed & Verified", timestamp: "Just now", completed: true, active: false },
          { title: "Assigned to Nearest Pharmacy", timestamp: "Just now", completed: true, active: false },
          { title: "Packed by Pharmacist", timestamp: "In progress", completed: true, active: true },
          { title: "Delivery Agent Picked Up", timestamp: `Est. ${eta - 8} mins`, completed: false, active: false },
          { title: "Delivered to Doorstep", timestamp: `Est. ${eta} mins`, completed: false, active: false },
        ],
      });
      setLoading(false);
    }, 800);
  }

  const inputCls = "w-full rounded-xl border-2 border-emerald-200 bg-emerald-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/30 outline-none transition-all";

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #047857 50%, #0d9488 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #047857, #0d9488)" }}>
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Zap className="w-3 h-3" /> Agent 5 — Order Dispatch
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Smart Order &amp; Fulfillment Agent</h2>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              Routes order to nearest pharmacy, assigns express rider &amp; tracks live delivery ETA dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* ── Dynamic Order Input ── */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow space-y-4">
        <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Enter Custom Order Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Customer Name</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Medicine Name</label>
            <input value={medName} onChange={(e) => setMedName(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Quantity</label>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Unit Price (₹)</label>
              <input type="number" min={10} value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 mb-1 block">Delivery Address / Landmark</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Payment Option</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className={inputCls}>
              <option value="UPI">Paid via UPI / Netbanking</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #047857 0%, #0d9488 100%)" }}
        >
          {loading ? "Routing to Nearest Pharmacy..." : "Route & Dispatch Order Dynamically"}
        </button>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="rounded-2xl border-2 border-emerald-100 bg-white p-10 text-center animate-pulse shadow">
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-emerald-600 text-white">
            <Truck className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-base font-black text-emerald-900">Locating nearest pharmacy &amp; assigning express rider...</p>
        </div>
      )}

      {/* ── Order Receipt & Live Tracking ── */}
      {order && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Order Header Card */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-emerald-950 text-base">{order.orderId}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                Customer: <strong className="text-slate-900">{order.customerName}</strong> ({order.phone})
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">Total Amount</div>
              <div className="text-2xl font-black text-emerald-900">₹{order.finalAmount.toFixed(2)}</div>
              <div className="text-[11px] text-emerald-700 font-bold">Est. Delivery in {order.estimatedDeliveryTime}</div>
            </div>
          </div>

          {/* Delivery & Rider Details */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Assigned Pharmacy
              </h4>
              <div className="font-black text-slate-900 text-sm">{order.assignedPharmacy}</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" /> {order.pharmacyDistanceKm} km away from delivery address
              </div>
            </div>
            <div className="rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Assigned Delivery Partner
              </h4>
              <div className="font-black text-slate-900 text-sm">{order.deliveryAgent}</div>
              <a href={`tel:${order.deliveryAgentPhone}`} className="text-xs text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
                <Phone className="w-3 h-3" /> Call Rider ({order.deliveryAgentPhone})
              </a>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Live Dispatch Timeline</h3>
            <div className="space-y-3">
              {order.statusSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    step.active ? "bg-amber-500 text-white animate-pulse" : step.completed ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {step.completed ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-black ${step.active ? "text-amber-900" : step.completed ? "text-slate-900" : "text-slate-400"}`}>
                      {step.title}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{step.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
