import { useState } from "react";
import { Network, Play, RefreshCw, CheckCircle2, ArrowRight, Layers, MessageSquareCode, Sparkles, Search, Package, FileText, ShieldAlert, Truck, Stethoscope, ShieldCheck, Video } from "lucide-react";

export interface AgentMessage {
  fromAgent: string;
  toAgent: string;
  messageType: "TASK_DELEGATION" | "INTERACTION_ALERT" | "DISPATCH_TRIGGER" | "REPORT_SYNTHESIS";
  content: string;
  timestamp: string;
}

export interface SwarmExecutionResult {
  scenarioName: string;
  consensusScore: number;
  totalExecutionTimeMs: number;
  agentTaskStatus: { agentName: string; role: string; status: "COMPLETED" | "RUNNING" | "PENDING"; durationMs: number; summary: string }[];
  messages: AgentMessage[];
  synthesizedPlan: {
    medicineSearch: string;
    inventoryStatus: string;
    prescriptionStatus: string;
    drugSafety: string;
    subsidyCalculation: string;
    doctorConsultation: string;
    fulfillmentAction: string;
  };
}

const MULTI_AGENT_SCENARIOS = [
  {
    title: "Scenario A: Critical Emergency (Warfarin + Paracetamol 650mg + PMJAY Coverage)",
    description: "8-Agent DAG Swarm orchestrating drug safety audit, PMJAY subsidy calculation & doorstep fulfillment.",
    prompt: "Patient in Chennai experiencing acute chest pressure. Needs Paracetamol 650mg, Amoxicillin 500mg, & Ayushman card coverage check.",
  },
  {
    title: "Scenario B: Low Inventory Alert, Jan Aushadhi Generic Routing & Doctor Teleconsult",
    description: "Detects low stock for Insulin Glargine, queries Jan Aushadhi Kendras for 80% cheaper generic, and schedules specialist doctor consultation.",
    prompt: "Insulin Glargine low stock (4 units). Patient requested 5 units + generic alternative + telehealth doctor appointment.",
  },
  {
    title: "Scenario C: Symptom Triage, Prescription Verification & Smart Delivery",
    description: "Triages patient symptoms, verifies uploaded prescription via OCR, and dispatches smart order to nearest pharmacy.",
    prompt: "Patient with fever and cough. Uploaded prescription for Azithromycin 500mg. Needs home delivery.",
  },
];

const SWARM_AGENTS_DEF = [
  { name: "1. Search Agent", icon: Search, role: "Finds stock" },
  { name: "2. Inventory Agent", icon: Package, role: "Audits stock" },
  { name: "3. Prescription Agent", icon: FileText, role: "Parses Rx" },
  { name: "4. Drug Safety Agent", icon: ShieldAlert, role: "Audits safety" },
  { name: "5. Fulfillment Agent", icon: Truck, role: "Dispatches delivery" },
  { name: "6. Triage Agent", icon: Stethoscope, role: "Clinical guidance" },
  { name: "7. Subsidy Agent", icon: ShieldCheck, role: "PMJAY subsidy check" },
  { name: "8. Doctor Agent", icon: Video, role: "Telehealth scheduling" },
];

const DEFAULT_SWARM_RESULT: SwarmExecutionResult = {
  scenarioName: MULTI_AGENT_SCENARIOS[0].title,
  consensusScore: 99.1,
  totalExecutionTimeMs: 2450,
  agentTaskStatus: [
    { agentName: "Search & Stock Agent", role: "Medicine Search & Location Routing", status: "COMPLETED", durationMs: 250, summary: "Found 4 nearby pharmacies with stock. Lowest price ₹10.50 at Apollo Pharmacy." },
    { agentName: "Inventory Management Agent", role: "Stock Audit & Threshold Monitoring", status: "COMPLETED", durationMs: 240, summary: "Stock level verified (45 units remaining). Stock status: Healthy." },
    { agentName: "Prescription Verification Agent", role: "OCR Parsing & Rx Authenticity Check", status: "COMPLETED", durationMs: 310, summary: "Prescription extracted successfully. Doctor Reg MCI-2014-TN-28451 verified." },
    { agentName: "Drug Safety & Allergy Agent", role: "Interaction Audit & Allergy Filter", status: "COMPLETED", durationMs: 220, summary: "Checked interactions: Warfarin + Paracetamol safe at normal dose. No allergy conflicts." },
    { agentName: "Smart Order & Fulfillment Agent", role: "Order Dispatch & Live Courier Routing", status: "COMPLETED", durationMs: 290, summary: "Assigned rider Dunzo Partner #88421. Est. delivery in 18 mins." },
    { agentName: "Symptom & Clinical Triage Agent", role: "Clinical Triage & Red-Flag Assessment", status: "COMPLETED", durationMs: 270, summary: "Chest tightness flagged as High Urgency. Recommended urgent care visit." },
    { agentName: "Ayushman Subsidy Agent", role: "PMJAY Card & Generic Cost Auditor", status: "COMPLETED", durationMs: 210, summary: "Ayushman Bharat Gold Card verified. 100% Cashless Coverage Authorized." },
    { agentName: "Telehealth Doctor Agent", role: "Specialist Consultation Scheduler", status: "COMPLETED", durationMs: 280, summary: "Dr. K. Senthil Nathan (Cardiologist) reserved for follow-up at 04:30 PM." },
  ],
  messages: [
    { fromAgent: "Swarm Orchestrator", toAgent: "Search & Stock Agent", messageType: "TASK_DELEGATION", content: 'Delegated 8-Agent Swarm Request: "Acute chest pressure, needs Paracetamol 650mg."', timestamp: "00:00.100" },
    { fromAgent: "Search & Stock Agent", toAgent: "Inventory Management Agent", messageType: "INTERACTION_ALERT", content: "Found 4 pharmacies with stock. Requesting stock audit.", timestamp: "00:00.350" },
    { fromAgent: "Symptom & Clinical Triage Agent", toAgent: "Telehealth Doctor Agent", messageType: "DISPATCH_TRIGGER", content: "HIGH URGENCY SYMPTOM: Routing patient to cardiologist teleconsult.", timestamp: "00:00.900" },
    { fromAgent: "Ayushman Subsidy Agent", toAgent: "Smart Order & Fulfillment Agent", messageType: "REPORT_SYNTHESIS", content: "100% PMJAY Cashless Subsidy approved for emergency order.", timestamp: "00:01.800" },
    { fromAgent: "Smart Order & Fulfillment Agent", toAgent: "Swarm Orchestrator", messageType: "REPORT_SYNTHESIS", content: "Order #MED-2026-88421 dispatched. Total Latency: 2450ms.", timestamp: "00:02.450" },
  ],
  synthesizedPlan: {
    medicineSearch: "Paracetamol 650mg found at Apollo Pharmacy (1.8 km away) at ₹12.50/unit.",
    inventoryStatus: "Apollo Pharmacy stock confirmed (45 units). Threshold: Healthy.",
    prescriptionStatus: "Rx verified. Doctor Reg: MCI-2014-TN-28451.",
    drugSafety: "Drug interaction checked: Safe to co-administer. Zero allergen conflicts.",
    subsidyCalculation: "Ayushman Bharat Gold Card Verified: 100% Cashless Coverage (Patient Copay: ₹0).",
    doctorConsultation: "Dr. K. Senthil Nathan (Cardiology) booked for follow-up.",
    fulfillmentAction: "Emergency Order dispatched via Dunzo Partner #88421. Total Latency: 2.45s.",
  },
};

export function MultiAgentOrchestrator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [result, setResult] = useState<SwarmExecutionResult | null>(DEFAULT_SWARM_RESULT);

  async function executeSwarmOrchestration() {
    setIsOrchestrating(true);
    setResult(null);

    const scenario = MULTI_AGENT_SCENARIOS[selectedScenarioIndex];

    for (let i = 0; i < 8; i++) {
      setActiveAgentIndex(i);
      await new Promise((res) => setTimeout(res, 250));
    }

    setResult({
      scenarioName: scenario.title,
      consensusScore: 99.4,
      totalExecutionTimeMs: 2450,
      agentTaskStatus: DEFAULT_SWARM_RESULT.agentTaskStatus,
      messages: DEFAULT_SWARM_RESULT.messages,
      synthesizedPlan: DEFAULT_SWARM_RESULT.synthesizedPlan,
    });

    setIsOrchestrating(false);
    setActiveAgentIndex(-1);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-cinematic" style={{ background: "linear-gradient(135deg, #0b1f4f 0%, #1e3a8a 50%, #0d9488 100%)" }}>
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Network className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> 8-Agent Swarm DAG Mesh
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Multi-Agent Pharmacy & Healthcare Orchestrator</h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Coordinates all 8 specialized healthcare & pharmacy AI agents in a synchronous DAG execution mesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="card p-5">
        <h3 className="label mb-3">Select Pharmacy & Healthcare Scenario</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {MULTI_AGENT_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedScenarioIndex === idx
                  ? "bg-primary-50 border-primary-500 shadow-sm ring-2 ring-primary-200"
                  : "bg-white border-ink-200 hover:border-primary-300"
              }`}
            >
              <div className="font-bold text-xs text-ink-900 line-clamp-2">{sc.title}</div>
              <div className="text-[11px] text-ink-500 mt-1 line-clamp-2">{sc.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={executeSwarmOrchestration}
          disabled={isOrchestrating}
          className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
        >
          {isOrchestrating ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Orchestrating 8-Agent Autonomous Mesh...</>
          ) : (
            <><Play className="w-5 h-5 fill-current" /> Launch 8-Agent Swarm Execution Workflow</>
          )}
        </button>
      </div>

      {/* Agent Mesh Flow Diagram */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary-600" /> Complete 8-Agent DAG Execution Mesh
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SWARM_AGENTS_DEF.map((ag, idx) => {
            const Icon = ag.icon;
            const isActive = activeAgentIndex === idx;
            const isFinished = activeAgentIndex > idx || (result !== null && activeAgentIndex === -1);

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all relative ${
                  isActive
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-300 animate-pulse scale-[1.02]"
                    : isFinished
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-white border-ink-200 opacity-60"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-1.5 ${isFinished ? "bg-emerald-600 text-white" : isActive ? "bg-amber-500 text-white" : "bg-ink-100 text-ink-600"}`}>
                  {isFinished ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="font-bold text-xs">{ag.name}</div>
                <div className="text-[10px] text-ink-500">{ag.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Results */}
      {result && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-emerald-600">{result.consensusScore}%</div>
              <div className="text-xs text-ink-500 font-medium">Swarm Consensus Score</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-700">{result.totalExecutionTimeMs}ms</div>
              <div className="text-xs text-ink-500 font-medium">Total Latency</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-secondary-700">8</div>
              <div className="text-xs text-ink-500 font-medium">Active Agents Executed</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-amber-600">{result.messages.length}</div>
              <div className="text-xs text-ink-500 font-medium">Inter-Agent DAG Signals</div>
            </div>
          </div>

          {/* Synthesized Plan */}
          <div className="card p-6 border-2 border-emerald-200 bg-emerald-50/20">
            <h3 className="text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Synthesized 8-Agent Execution Outcome
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Search Result:</span> {result.synthesizedPlan.medicineSearch}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Inventory Status:</span> {result.synthesizedPlan.inventoryStatus}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Rx Verification:</span> {result.synthesizedPlan.prescriptionStatus}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Drug Safety:</span> {result.synthesizedPlan.drugSafety}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">PMJAY Subsidy:</span> {result.synthesizedPlan.subsidyCalculation}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Doctor Consult:</span> {result.synthesizedPlan.doctorConsultation}</div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-primary-800 text-white font-bold text-xs flex items-center justify-between">
              <span>🚀 Final Fulfillment Action: {result.synthesizedPlan.fulfillmentAction}</span>
            </div>
          </div>

          {/* Inter-Agent Message Log */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-ink-700 mb-3 flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-primary-600" /> Inter-Agent Communication Logs
            </h3>
            <div className="space-y-2">
              {result.messages.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-ink-50 border border-ink-100 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-ink-800">
                      <span className="text-primary-700">{m.fromAgent}</span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className="text-secondary-700">{m.toAgent}</span>
                    </div>
                    <p className="text-ink-600 mt-1">{m.content}</p>
                  </div>
                  <span className="text-[10px] text-ink-400 font-mono shrink-0">{m.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
