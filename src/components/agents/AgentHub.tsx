import { useState } from "react";
import { Search, Package, FileText, ShieldAlert, Truck, Network, Sparkles, Activity } from "lucide-react";
import { MedicineSearchAgent } from "./MedicineSearchAgent";
import { InventoryManagementAgent } from "./InventoryManagementAgent";
import { PrescriptionVerificationAgent } from "./PrescriptionVerificationAgent";
import { DrugInteractionAgent } from "./DrugInteractionAgent";
import { SmartOrderFulfillmentAgent } from "./SmartOrderFulfillmentAgent";
import { MultiAgentOrchestrator } from "./MultiAgentOrchestrator";

export type AgentId = "swarm" | "search" | "inventory" | "prescription" | "interaction" | "fulfillment";

interface AgentHubProps {
  initialAgent?: AgentId;
}

const AGENTS = [
  {
    id: "swarm" as AgentId,
    name: "★ Multi-AI Swarm Engine",
    shortName: "Swarm Orchestrator",
    icon: Network,
    badge: "5-Agent Mesh",
    desc: "Coordinates all 5 pharmacy agents in a DAG execution mesh",
    gradient: "from-violet-800 to-indigo-700",
    activeBg: "linear-gradient(135deg, #5b21b6, #3730a3)",
    badgeColor: "bg-violet-100 text-violet-900 border-violet-300",
  },
  {
    id: "search" as AgentId,
    name: "1. Medicine Search & Stock",
    shortName: "Medicine Search",
    icon: Search,
    badge: "Real-Time Stock",
    desc: "Searches medicines across India, nearby stock & generic alternatives",
    gradient: "from-sky-800 to-cyan-700",
    activeBg: "linear-gradient(135deg, #0284c7, #0e7490)",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
  },
  {
    id: "inventory" as AgentId,
    name: "2. Inventory Management",
    shortName: "Stock Manager",
    icon: Package,
    badge: "Low Stock Alert",
    desc: "Tracks stock levels, detects low inventory & flags expired medicines",
    gradient: "from-teal-800 to-emerald-700",
    activeBg: "linear-gradient(135deg, #0d9488, #059669)",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
  },
  {
    id: "prescription" as AgentId,
    name: "3. Prescription Verification",
    shortName: "Rx OCR Reader",
    icon: FileText,
    badge: "OCR Engine",
    desc: "Reads uploaded prescriptions using OCR, extracts dosage & checks missing info",
    gradient: "from-indigo-800 to-blue-700",
    activeBg: "linear-gradient(135deg, #1d4ed8, #0f766e)",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  {
    id: "interaction" as AgentId,
    name: "4. Drug Interaction & Safety",
    shortName: "Safety Audit",
    icon: ShieldAlert,
    badge: "Safety Check",
    desc: "Checks drug-drug interactions & allergy triggers before dispensing",
    gradient: "from-red-900 to-rose-800",
    activeBg: "linear-gradient(135deg, #b91c1c, #7c2d12)",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
  },
  {
    id: "fulfillment" as AgentId,
    name: "5. Smart Order & Delivery",
    shortName: "Smart Fulfillment",
    icon: Truck,
    badge: "Live Dispatch",
    desc: "Routes orders to nearest pharmacy, tracks live delivery & digital billing",
    gradient: "from-emerald-900 to-green-800",
    activeBg: "linear-gradient(135deg, #047857, #0d9488)",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
];

export function AgentHub({ initialAgent = "swarm" }: AgentHubProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(initialAgent);

  const activeAgentMeta = AGENTS.find((a) => a.id === selectedAgent)!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ── Top Hub Hero Header ── */}
      <div
        className="p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #071930 0%, #0c2a52 35%, #0284c7 70%, #059669 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
          <img src="/logo3d.png" alt="MediFinder Logo" className="w-80 h-80 object-contain filter drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-50 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0284c7, #38bdf8, #10b981)" }} />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-md text-xs font-black uppercase tracking-widest text-emerald-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            MediFinder India — 5 Pharmacy Agentic AI Suite
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            Autonomous Pharmacy Agent Swarm
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-semibold max-w-2xl">
            Deploy 5 specialized pharmacy AI agents working independently or collaboratively via our Multi-Agent Swarm Orchestrator — cinematic deep navy, emerald green &amp; cloud white design.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black text-slate-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Activity className="w-4 h-4 text-emerald-400" /> 5 Active Specialized Agents
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Network className="w-4 h-4 text-sky-400" /> Dynamic Swarm DAG Engine
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Sparkles className="w-4 h-4 text-amber-300" /> Cinematic AI Platform
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-thin">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? "text-white border-transparent shadow-lg scale-[1.02]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900"
              }`}
              style={isSelected ? { background: agent.activeBg } : {}}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span>{agent.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Agent Description Bar ── */}
      <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/70 px-5 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow"
          style={{ background: activeAgentMeta.activeBg }}>
          <activeAgentMeta.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-sky-950 text-sm">{activeAgentMeta.name}</div>
          <div className="text-xs text-slate-600 font-semibold truncate">{activeAgentMeta.desc}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[11px] font-black border shrink-0 ${activeAgentMeta.badgeColor}`}>
          {activeAgentMeta.badge}
        </span>
      </div>

      {/* ── Selected Agent View ── */}
      <div className="animate-fade-in">
        {selectedAgent === "swarm" && <MultiAgentOrchestrator />}
        {selectedAgent === "search" && <MedicineSearchAgent />}
        {selectedAgent === "inventory" && <InventoryManagementAgent />}
        {selectedAgent === "prescription" && <PrescriptionVerificationAgent />}
        {selectedAgent === "interaction" && <DrugInteractionAgent />}
        {selectedAgent === "fulfillment" && <SmartOrderFulfillmentAgent />}
      </div>
    </div>
  );
}
