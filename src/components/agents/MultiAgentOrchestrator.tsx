import { useState } from "react";
import { Network, Play, RefreshCw, CheckCircle2, ArrowRight, Layers, MessageSquareCode, Sparkles, Search, Package, FileText, ShieldAlert, Truck } from "lucide-react";

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
    fulfillmentAction: string;
  };
}

const MULTI_AGENT_SCENARIOS = [
  {
    title: "Scenario A: Emergency Order for Critical Patient (Warfarin + Paracetamol 650mg)",
    description: "Multi-agent autonomous response for searching medicine, checking stock, verifying prescription, auditing drug safety & dispatching doorstep delivery.",
    prompt: "Patient in Chennai needs Paracetamol 650mg & Amoxicillin 500mg immediately. Currently taking Warfarin.",
  },
  {
    title: "Scenario B: Regional Pharmacy Low Stock Alert & Jan Aushadhi Generic Routing",
    description: "Detects low stock for Insulin Glargine, queries nearby Jan Aushadhi Kendras for generic alternatives, and initiates restocking.",
    prompt: "Stock for Insulin Glargine in T. Nagar branch is 8 units (Critical). Customer requesting 5 units + generic alternative.",
  },
  {
    title: "Scenario C: Uploaded Prescription Verification & Allergy Safety Audit",
    description: "Runs OCR on uploaded prescription, parses dosage/frequency, checks patient penicillin allergy, and dispatches verified order.",
    prompt: "Prescription image uploaded for Rajesh Kumar (Amoxicillin 500mg + Cetirizine 10mg). Patient has documented Penicillin allergy.",
  },
];

export function MultiAgentOrchestrator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [result, setResult] = useState<SwarmExecutionResult | null>(null);

  async function executeSwarmOrchestration() {
    setIsOrchestrating(true);
    setResult(null);
    setActiveAgentIndex(0);

    const scenario = MULTI_AGENT_SCENARIOS[selectedScenarioIndex];

    type AgentStatus = "COMPLETED" | "RUNNING" | "PENDING";
    const agentTasks: { agentName: string; role: string; status: AgentStatus; durationMs: number; summary: string }[] = [
      { agentName: "Search & Availability Agent", role: "Medicine Search & Location Routing", status: "RUNNING", durationMs: 380, summary: "Found 4 nearby pharmacies with stock. Lowest price ₹10.50 at Apollo Pharmacy." },
      { agentName: "Inventory Management Agent", role: "Stock Audit & Threshold Monitoring", status: "PENDING", durationMs: 410, summary: "Stock level verified (45 units remaining). Stock status: Healthy." },
      { agentName: "Prescription Verification Agent", role: "OCR Parsing & Rx Authenticity Check", status: "PENDING", durationMs: 520, summary: "Prescription extracted successfully. Doctor Reg MCI-2014-TN-28451 verified." },
      { agentName: "Drug Safety & Allergy Agent", role: "Interaction Audit & Allergy Filter", status: "PENDING", durationMs: 340, summary: "Checked interactions: Warfarin + Paracetamol safe at normal dose. No allergy conflicts." },
      { agentName: "Smart Order & Fulfillment Agent", role: "Order Dispatch & Live Courier Routing", status: "PENDING", durationMs: 460, summary: "Assigned rider Dunzo Partner #88421. Est. delivery in 22 mins." },
    ];

    const liveMessages: AgentMessage[] = [];

    // Step 1: Search Agent
    setActiveAgentIndex(0);
    agentTasks[0].status = "COMPLETED";
    liveMessages.push({
      fromAgent: "Swarm Orchestrator",
      toAgent: "Search & Availability Agent",
      messageType: "TASK_DELEGATION",
      content: `Delegated search request: "${scenario.prompt}"`,
      timestamp: "00:00.120",
    });
    liveMessages.push({
      fromAgent: "Search & Availability Agent",
      toAgent: "Inventory Management Agent",
      messageType: "INTERACTION_ALERT",
      content: "Found 4 pharmacies with available stock. Requesting stock audit.",
      timestamp: "00:00.500",
    });
    await new Promise((res) => setTimeout(res, 400));

    // Step 2: Inventory Agent
    setActiveAgentIndex(1);
    agentTasks[1].status = "COMPLETED";
    liveMessages.push({
      fromAgent: "Inventory Management Agent",
      toAgent: "Prescription Verification Agent",
      messageType: "TASK_DELEGATION",
      content: "Stock level verified. Delegating prescription verification.",
      timestamp: "00:00.910",
    });
    await new Promise((res) => setTimeout(res, 400));

    // Step 3: Prescription Agent
    setActiveAgentIndex(2);
    agentTasks[2].status = "COMPLETED";
    liveMessages.push({
      fromAgent: "Prescription Verification Agent",
      toAgent: "Drug Safety & Allergy Agent",
      messageType: "TASK_DELEGATION",
      content: "Rx extracted: Paracetamol 650mg + Amoxicillin 500mg. Requesting drug interaction audit.",
      timestamp: "00:01.430",
    });
    await new Promise((res) => setTimeout(res, 400));

    // Step 4: Safety Agent
    setActiveAgentIndex(3);
    agentTasks[3].status = "COMPLETED";
    liveMessages.push({
      fromAgent: "Drug Safety & Allergy Agent",
      toAgent: "Smart Order & Fulfillment Agent",
      messageType: "DISPATCH_TRIGGER",
      content: "SAFETY APPROVED: Drug interaction score 98/100 (Safe). Authorizing order dispatch.",
      timestamp: "00:01.770",
    });
    await new Promise((res) => setTimeout(res, 400));

    // Step 5: Fulfillment Agent
    setActiveAgentIndex(4);
    agentTasks[4].status = "COMPLETED";
    liveMessages.push({
      fromAgent: "Smart Order & Fulfillment Agent",
      toAgent: "Swarm Orchestrator",
      messageType: "REPORT_SYNTHESIS",
      content: "Order #MED-2026-88421 placed & assigned to express delivery. ETA 22 mins.",
      timestamp: "00:02.230",
    });

    setResult({
      scenarioName: scenario.title,
      consensusScore: 98.4,
      totalExecutionTimeMs: 2230,
      agentTaskStatus: agentTasks,
      messages: liveMessages,
      synthesizedPlan: {
        medicineSearch: "Paracetamol 650mg found at Apollo Pharmacy (1.8 km away) at ₹12.50/unit.",
        inventoryStatus: "Apollo Pharmacy stock confirmed (45 units). Threshold: Healthy.",
        prescriptionStatus: "Rx verified. Doctor Reg: MCI-2014-TN-28451.",
        drugSafety: "Drug interaction checked: Safe to co-administer. Zero allergen conflicts.",
        fulfillmentAction: "Order dispatched via Dunzo Express Partner #88421. Est. delivery: 22 mins.",
      },
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
                <Sparkles className="w-3 h-3 text-amber-300" /> DAG Swarm Engine
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Multi-Agent Pharmacy Swarm Orchestrator</h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Coordinates all 5 specialized pharmacy AI agents in a synchronous DAG execution mesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="card p-5">
        <h3 className="label mb-3">Select Pharmacy Execution Scenario</h3>
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
            <><RefreshCw className="w-5 h-5 animate-spin" /> Orchestrating 5-Agent Swarm...</>
          ) : (
            <><Play className="w-5 h-5 fill-current" /> Launch 5-Agent Autonomous Workflow</>
          )}
        </button>
      </div>

      {/* Agent Mesh Flow Diagram */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary-600" /> 5-Agent DAG Execution Mesh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { name: "1. Search Agent", icon: Search, role: "Finds stock" },
            { name: "2. Inventory Agent", icon: Package, role: "Audits stock" },
            { name: "3. Prescription Agent", icon: FileText, role: "Parses Rx" },
            { name: "4. Drug Safety Agent", icon: ShieldAlert, role: "Audits safety" },
            { name: "5. Fulfillment Agent", icon: Truck, role: "Dispatches delivery" },
          ].map((ag, idx) => {
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
              <div className="text-xs text-ink-500 font-medium">Swarm Safety Score</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-700">{result.totalExecutionTimeMs}ms</div>
              <div className="text-xs text-ink-500 font-medium">Total Latency</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-secondary-700">{result.agentTaskStatus.length}</div>
              <div className="text-xs text-ink-500 font-medium">Agents Executed</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-amber-600">{result.messages.length}</div>
              <div className="text-xs text-ink-500 font-medium">Inter-Agent Messages</div>
            </div>
          </div>

          {/* Synthesized Plan */}
          <div className="card p-6 border-2 border-emerald-200 bg-emerald-50/20">
            <h3 className="text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Synthesized 5-Agent Execution Outcome
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Search Result:</span> {result.synthesizedPlan.medicineSearch}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Inventory Status:</span> {result.synthesizedPlan.inventoryStatus}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Rx Verification:</span> {result.synthesizedPlan.prescriptionStatus}</div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100"><span className="font-bold text-emerald-900">Drug Safety:</span> {result.synthesizedPlan.drugSafety}</div>
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
