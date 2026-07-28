import { useState } from "react";
import { Truck, CheckCircle2, MapPin, Clock, Package, ChevronRight, Phone, Building2, ShieldCheck, IndianRupee, Zap } from "lucide-react";

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

const DEMO_ORDER: OrderDetails = {
  orderId: "MED-2026-88421",
  customerName: "Priya Sundaram",
  phone: "+91 98765 43210",
  deliveryAddress: "No. 42, 3rd Cross Street, T. Nagar, Chennai - 600017",
  assignedPharmacy: "Apollo Pharmacy - T. Nagar Branch",
  pharmacyDistanceKm: 1.8,
  medicine: "Paracetamol 650mg (Pack of 15) x 2",
  quantity: 30,
  totalPrice: 250.00,
  deliveryFee: 30.00,
  finalAmount: 280.00,
  paymentStatus: "Paid via UPI",
  deliveryAgent: "Karthik R. (Dunzo Express Partner)",
  deliveryAgentPhone: "+91 91234 56789",
  estimatedDeliveryTime: "22 mins",
  statusSteps: [
    { title: "Order Placed & Verified", timestamp: "10:15 AM", completed: true, active: false },
    { title: "Assigned to Nearest Pharmacy", timestamp: "10:16 AM", completed: true, active: false },
    { title: "Packed by Pharmacist", timestamp: "10:20 AM", completed: true, active: false },
    { title: "Delivery Agent Picked Up", timestamp: "10:25 AM", completed: true, active: true },
    { title: "Delivered to Doorstep", timestamp: "Est. 10:37 AM", completed: false, active: false },
  ],
};

export function SmartOrderFulfillmentAgent() {
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [medName, setMedName] = useState("Paracetamol 650mg");
  const [qty, setQty] = useState(2);
  const [address, setAddress] = useState("T. Nagar, Chennai");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");

  function handleCreateOrder() {
    setLoading(true);
    setTimeout(() => {
      setOrder({
        ...DEMO_ORDER,
        medicine: `${medName} (Qty: ${qty})`,
        deliveryAddress: address,
        paymentStatus: paymentMethod === "UPI" ? "Paid via UPI" : "Cash on Delivery",
      });
      setOrderCreated(true);
      setLoading(false);
    }, 1600);
  }

  const inputCls = "w-full rounded-xl border-2 border-sky-200 bg-sky-50/50 px-3.5 py-2.5 text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 outline-none transition-all";

  return (
    <div className="space-y-5">

      {/* ── Agent Header ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #071930 0%, #047857 50%, #0d9488 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }} />
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
              Automates order routing to nearest stocked pharmacy, live delivery tracking &amp; digital billing
            </p>
          </div>
        </div>
      </div>

      {/* ── Place Order Form ── */}
      <div className="rounded-2xl border-2 border-sky-200 bg-white p-6 shadow">
        <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-sky-600" /> Dispatch New Medicine Order
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black text-sky-800 uppercase tracking-wide mb-1.5">Medicine Required</label>
            <input value={medName} onChange={(e) => setMedName(e.target.value)} className={inputCls} placeholder="e.g. Paracetamol 650mg" />
          </div>
          <div>
            <label className="block text-xs font-black text-sky-800 uppercase tracking-wide mb-1.5">Quantity (Strips / Units)</label>
            <input type="number" min="1" max="20" value={qty} onChange={(e) => setQty(Number(e.target.value))} className={inputCls} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-black text-sky-800 uppercase tracking-wide mb-1.5">Delivery Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} placeholder="Enter delivery location / area" />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-black text-sky-800 uppercase tracking-wide mb-2">Payment Method</label>
          <div className="flex gap-4">
            {([["UPI", "📱 UPI (GPay / PhonePe / Paytm)"], ["COD", "💵 Cash on Delivery"]] as const).map(([val, label]) => (
              <label key={val} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${paymentMethod === val ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"}`}>
                <input type="radio" name="pay" checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} className="accent-sky-600" />
                {label}
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #047857 0%, #0d9488 50%, #0284c7 100%)" }}
        >
          {loading ? (
            <><Clock className="w-5 h-5 animate-spin" /> Routing Order to Nearest Stocked Pharmacy…</>
          ) : (
            <><Truck className="w-5 h-5" /> {orderCreated ? "Place Another Order" : "Place & Route Order"}</>
          )}
        </button>
      </div>

      {/* ── Order Results ── */}
      {order && !loading && (
        <>
          {/* Order Header */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5 shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border-2 border-emerald-300 text-xs font-black">
                    Order #{order.orderId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border-2 ${order.paymentStatus === "Paid via UPI" ? "bg-sky-100 text-sky-950 border-sky-300" : "bg-amber-100 text-amber-950 border-amber-300"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-2">{order.medicine}</h3>
                <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" /> {order.deliveryAddress}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-sky-900 flex items-center gap-1 justify-end">
                  <IndianRupee className="w-5 h-5" />{order.finalAmount.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">
                  Est. Delivery in <span className="text-emerald-700 font-black">{order.estimatedDeliveryTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacy & Rider Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-sky-200 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-sky-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Assigned Fulfillment Pharmacy
              </h4>
              <div className="font-black text-sky-950 text-sm mb-1">{order.assignedPharmacy}</div>
              <div className="text-xs text-slate-600 font-semibold">Distance: <span className="font-black text-sky-800">{order.pharmacyDistanceKm} km away</span></div>
              <div className="text-xs text-emerald-700 font-black flex items-center gap-1 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified In-Stock Partner
              </div>
            </div>
            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-4 shadow-sm">
              <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Delivery Agent
              </h4>
              <div className="font-black text-emerald-950 text-sm mb-1">{order.deliveryAgent}</div>
              <div className="text-xs text-sky-700 font-black flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5" /> {order.deliveryAgentPhone}
              </div>
              <div className="text-xs text-slate-500 font-semibold">Status: On the way with your package 🚴</div>
            </div>
          </div>

          {/* Live Timeline Tracker */}
          <div className="rounded-2xl border-2 border-sky-100 bg-white p-6 shadow">
            <h3 className="text-base font-black text-sky-950 mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" /> Live Order Tracking Timeline
            </h3>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {order.statusSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                    step.completed
                      ? "bg-emerald-600 text-white shadow-md"
                      : step.active
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow-md"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-sm font-black ${step.active ? "text-amber-800" : step.completed ? "text-slate-900" : "text-slate-400"}`}>
                        {step.title}
                      </span>
                      <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{step.timestamp}</span>
                    </div>
                    {step.active && (
                      <div className="mt-1 text-[11px] font-black text-amber-700 animate-pulse">● In Progress…</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Invoice */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5 shadow">
            <h3 className="text-sm font-black text-emerald-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <IndianRupee className="w-4 h-4" /> Digital Invoice Breakdown
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Medicine Subtotal", value: `₹${order.totalPrice.toFixed(2)}`, sub: false },
                { label: "Fulfillment & Delivery Fee", value: `₹${order.deliveryFee.toFixed(2)}`, sub: false },
                { label: "GST & Healthcare Cess", value: "Included", sub: false },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">{row.label}:</span>
                  <span className="font-black text-slate-800">{row.value}</span>
                </div>
              ))}
              <div className="border-t-2 border-emerald-200 pt-3 flex justify-between items-center">
                <span className="font-black text-emerald-950 text-base">Total Amount Paid:</span>
                <span className="font-black text-sky-800 text-xl">₹{order.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-5">
            <h3 className="text-xs font-black text-emerald-900 mb-3 uppercase tracking-widest">⚙️ How This Agent Works</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {["Receive customer order", "Route to nearest stocked pharmacy", "Assign delivery partner", "Track order live", "Process digital invoice"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white text-emerald-900 border-2 border-emerald-200 shadow-sm">{step}</span>
                  {i < 4 && <ChevronRight className="w-4 h-4 text-emerald-300" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
