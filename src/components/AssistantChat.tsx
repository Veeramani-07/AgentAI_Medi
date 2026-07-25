import { useRef, useState, useEffect } from "react";
import {
  Send, Sparkles, Bot, User, Brain, ChevronRight, Loader2,
  MessageSquareText, RotateCcw, MapPin, Stethoscope, HeartPulse,
} from "lucide-react";
import { askAssistant } from "@/lib/assistant";
import type { AssistantResponse, PharmacyResult } from "@/lib/types";
import { ConfidenceBar } from "./Badges";
import { PharmacyResultCard } from "./PharmacyCard";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: AssistantResponse;
  error?: boolean;
}

interface AssistantChatProps {
  userLat: number | null;
  userLng: number | null;
  onUseLocation: () => void;
  hasLocation: boolean;
  onPharmacyFocus?: (p: PharmacyResult) => void;
}

const QUICK_PROMPTS = [
  "I need Dolo 650 urgently in Mumbai",
  "Where is a ventilator available?",
  "Oxygen cylinder near Delhi",
  "Find insulin for my child in Hyderabad",
  "24x7 pharmacy near me",
  "Augmentin 625 availability",
];

export function AssistantChat({ userLat, userLng, onUseLocation, hasLocation, onPharmacyFocus }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await askAssistant(trimmed, userLat, userLng);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: res.reply,
        response: res,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        error: true,
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-[640px] bg-white rounded-2xl border border-ink-200/70 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-green">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-ink-900 flex items-center gap-2">
              MediFinder AI
              <span className="chip-success text-[10px] py-0.5">online</span>
            </h3>
            <p className="text-xs text-ink-500">Agentic assistant · searches live pharmacy data</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} className="btn-ghost px-2.5 py-2 text-xs" title="Start over">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4 bg-ink-50/40">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 shadow-glow-green animate-bounce-subtle">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-lg font-bold text-ink-800">How can I help you find medicine?</h4>
            <p className="text-sm text-ink-500 mt-1.5 max-w-sm">
              Ask in plain words. I search live pharmacy stocks and equipment across India, and prioritize rural stores so help reaches where it's needed most.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 justify-center max-w-md">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="chip-neutral hover:chip-primary transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
            {!hasLocation && (
              <button onClick={onUseLocation} className="btn-secondary mt-5 text-xs">
                <MapPin className="w-4 h-4" /> Share my location for distance
              </button>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            showReasoning={!!showReasoning[msg.id]}
            onToggleReasoning={() => setShowReasoning((s) => ({ ...s, [msg.id]: !s[msg.id] }))}
            onPharmacyFocus={onPharmacyFocus}
            onSuggestionClick={send}
          />
        ))}

        {loading && <TypingBubble />}
      </div>

      {/* Input */}
      <div className="border-t border-ink-100 p-3 bg-white">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            placeholder="Ask: 'I need Paracetamol in Pune' or 'ventilator near Delhi'…"
            rows={1}
            className="input resize-none flex-1 max-h-28 min-h-[44px]"
            disabled={loading}
          />
          <button type="submit" className="btn-primary h-[44px] px-4" disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="text-[11px] text-ink-400 mt-2 px-1">
          AI searches live data. Always confirm stock by calling the pharmacy before visiting.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({
  msg, showReasoning, onToggleReasoning, onPharmacyFocus, onSuggestionClick,
}: {
  msg: ChatMessage;
  showReasoning: boolean;
  onToggleReasoning: () => void;
  onPharmacyFocus?: (p: PharmacyResult) => void;
  onSuggestionClick: (text: string) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isUser ? "bg-secondary-100 text-secondary-600" : "bg-gradient-to-br from-primary-500 to-secondary-500 text-white"
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-secondary-600 text-white rounded-tr-md"
            : msg.error
            ? "bg-error-50 text-error-700 border border-error-100 rounded-tl-md"
            : "bg-white border border-ink-200 text-ink-800 rounded-tl-md shadow-sm"
        }`}>
          {formatBold(msg.text)}
        </div>

        {/* Reasoning trace toggle */}
        {msg.response && msg.response.reasoning.length > 0 && (
          <div className="w-full">
            <button
              onClick={onToggleReasoning}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-primary-600 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              {showReasoning ? "Hide" : "Show"} AI reasoning ({msg.response.reasoning.length} steps)
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showReasoning ? "rotate-90" : ""}`} />
            </button>
            {showReasoning && (
              <div className="mt-2 rounded-xl border border-ink-200 bg-ink-50/60 p-3 animate-slide-down">
                <div className="mb-2.5">
                  <ConfidenceBar value={msg.response.confidence} />
                </div>
                <ol className="space-y-2">
                  {msg.response.reasoning.map((step) => (
                    <li key={step.step} className="flex gap-2.5 text-xs">
                      <span className="font-mono font-bold text-primary-600 shrink-0">{step.step}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-ink-700">{step.action}</div>
                        <div className="text-ink-500 mt-0.5">{step.detail}</div>
                        {step.result && (
                          <div className="mt-1 font-mono text-[11px] text-ink-400 bg-white rounded px-2 py-1 border border-ink-100">
                            {step.result}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
                {msg.response.entities.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-ink-200 flex flex-wrap gap-1.5">
                    {msg.response.entities.map((e, i) => (
                      <span key={i} className="chip-neutral text-[10px] py-0.5">
                        <span className="opacity-60">{e.type}:</span> {e.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pharmacy results */}
        {msg.response?.pharmacies && msg.response.pharmacies.length > 0 && (
          <div className="w-full space-y-2 mt-1">
            {msg.response.pharmacies.slice(0, 4).map((p) => (
              <PharmacyResultCard key={p.id} pharmacy={p} onFocus={onPharmacyFocus} compact />
            ))}
            {msg.response.pharmacies.length > 4 && (
              <p className="text-xs text-ink-400 px-1">+ {msg.response.pharmacies.length - 4} more in results below</p>
            )}
          </div>
        )}

        {/* Suggestions */}
        {msg.response?.suggestions && msg.response.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {msg.response.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestionClick(s)}
                className="chip-primary hover:bg-primary-200 transition-colors cursor-pointer text-[11px]"
              >
                <MessageSquareText className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0">
        <HeartPulse className="w-4 h-4 text-white animate-pulse" />
      </div>
      <div className="bg-white border border-ink-200 rounded-2xl rounded-tl-md px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing" style={{ animationDelay: "200ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );
}

// Render **bold** segments in plain text
function formatBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
