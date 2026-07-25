import { useMemo, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import type { Pharmacy, EmergencyRequest } from "@/lib/types";
import { formatDistance } from "@/lib/utils";

// Simplified India bounding box for projection (rough lat/lng bounds)
// lat: 6.5 (south, Kanyakumari) to 37.5 (north, Kashmir)
// lng: 68.0 (west, Gujarat) to 97.5 (east, Arunachal)
const LAT_MIN = 6.5, LAT_MAX = 37.5;
const LNG_MIN = 68.0, LNG_MAX = 97.5;

// SVG viewBox dimensions
const VW = 480, VH = 540;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VW;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VH;
  return { x, y };
}

// Simplified India outline path (stylized, not geodetically perfect)
const INDIA_PATH =
  "M 196 36 L 214 30 L 232 40 L 244 36 L 252 50 L 262 48 L 270 58 L 280 56 L 286 70 L 300 78 L 308 92 L 318 100 L 326 112 L 332 120 L 340 124 L 344 134 L 338 144 L 326 148 L 320 158 L 312 166 L 308 180 L 300 188 L 290 194 L 282 204 L 274 214 L 266 228 L 254 240 L 240 254 L 224 272 L 208 290 L 196 304 L 184 316 L 174 326 L 168 336 L 160 346 L 154 356 L 150 366 L 146 376 L 152 386 L 160 396 L 168 406 L 176 416 L 180 426 L 184 436 L 188 446 L 184 456 L 176 466 L 168 476 L 158 486 L 148 496 L 140 506 L 132 516 L 124 524 L 116 530 L 108 534 L 100 536 L 92 534 L 86 528 L 82 520 L 80 510 L 82 500 L 88 490 L 96 480 L 104 470 L 110 458 L 114 446 L 116 434 L 114 422 L 108 410 L 100 398 L 92 386 L 86 374 L 82 362 L 78 350 L 74 338 L 72 326 L 74 314 L 78 302 L 84 290 L 92 278 L 100 264 L 108 250 L 116 236 L 124 222 L 130 208 L 134 194 L 136 180 L 134 166 L 128 152 L 120 140 L 110 128 L 100 118 L 92 108 L 86 96 L 84 84 L 88 72 L 96 62 L 106 54 L 118 48 L 130 44 L 142 42 L 154 44 L 166 46 L 178 44 L 186 40 Z";

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  kind: "pharmacy" | "request";
  type: string;
  urgency?: string;
  distance_km?: number | null;
}

interface IndiaMapProps {
  pharmacies: Pharmacy[];
  requests: EmergencyRequest[];
  userLat?: number | null;
  userLng?: number | null;
  selectedId?: string | null;
  onSelect?: (id: string, kind: "pharmacy" | "request") => void;
}

export function IndiaMap({
  pharmacies, requests, userLat, userLng, selectedId, onSelect,
}: IndiaMapProps) {
  const [hover, setHover] = useState<MapPoint | null>(null);

  const points: MapPoint[] = useMemo(() => {
    const pharma: MapPoint[] = pharmacies.map((p) => ({
      id: p.id, lat: p.lat, lng: p.lng, name: p.name,
      kind: "pharmacy", type: p.pharmacy_type, distance_km: null,
    }));
    const reqs: MapPoint[] = requests
      .filter((r) => r.lat != null && r.lng != null && r.status === "open")
      .map((r) => ({
        id: r.id, lat: r.lat!, lng: r.lng!, name: r.item_name,
        kind: "request", type: r.request_type, urgency: r.urgency,
      }));
    return [...pharma, ...reqs];
  }, [pharmacies, requests]);

  const userPos = userLat != null && userLng != null ? project(userLat, userLng) : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto max-h-[560px] select-none"
        role="img"
        aria-label="Map of India showing pharmacy and emergency request locations"
      >
        <defs>
          <linearGradient id="indiaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8fbe8" />
            <stop offset="100%" stopColor="#effdf5" />
          </linearGradient>
          <linearGradient id="indiaStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#089a56" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid backdrop */}
        <rect x="0" y="0" width={VW} height={VH} fill="#f8fafc" />

        {/* State grid lines (decorative) */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`v${f}`} x1={VW * f} y1="0" x2={VW * f} y2={VH} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 6" />
        ))}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`h${f}`} x1="0" y1={VH * f} x2={VW} y2={VH * f} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 6" />
        ))}

        {/* India outline */}
        <path
          d={INDIA_PATH}
          fill="url(#indiaFill)"
          stroke="url(#indiaStroke)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* User location */}
        {userPos && (
          <g filter="url(#markerGlow)">
            <circle cx={userPos.x} cy={userPos.y} r="10" fill="#0ea5e9" opacity="0.25" className="animate-pulse-soft" />
            <circle cx={userPos.x} cy={userPos.y} r="5" fill="#0ea5e9" stroke="white" strokeWidth="2" />
          </g>
        )}

        {/* Request markers (pulsing red/orange for urgency) */}
        {points.filter((p) => p.kind === "request").map((p) => {
          const pos = project(p.lat, p.lng);
          const isSel = selectedId === p.id;
          const color = p.urgency === "critical" ? "#dc2626" : p.urgency === "urgent" ? "#ea580c" : "#f59e0b";
          return (
            <g
              key={`r-${p.id}`}
              transform={`translate(${pos.x} ${pos.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(p.id, "request")}
            >
              <circle r="9" fill={color} opacity="0.2" className="animate-pulse-soft" />
              <circle r={isSel ? 6 : 4.5} fill={color} stroke="white" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Pharmacy markers */}
        {points.filter((p) => p.kind === "pharmacy").map((p) => {
          const pos = project(p.lat, p.lng);
          const isSel = selectedId === p.id;
          const color = p.type === "rural" ? "#f97316" : p.type === "semi-urban" ? "#0ea5e9" : "#15bd6c";
          return (
            <g
              key={`p-${p.id}`}
              transform={`translate(${pos.x} ${pos.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(p.id, "pharmacy")}
            >
              <circle r={isSel ? 8 : 6} fill={color} opacity="0.18" />
              <circle r={isSel ? 5.5 : 4} fill={color} stroke="white" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hover && (
        <div
          className="absolute pointer-events-none z-20 bg-ink-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
          style={{
            left: `${(project(hover.lat, hover.lng).x / VW) * 100}%`,
            top: `${(project(hover.lat, hover.lng).y / VH) * 100}%`,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <div className="font-semibold flex items-center gap-1.5">
            {hover.kind === "request" ? <AlertCircleIcon /> : <MapPin className="w-3 h-3" />}
            {hover.name}
          </div>
          <div className="opacity-70 mt-0.5 capitalize">
            {hover.kind === "request" ? `Emergency · ${hover.urgency}` : `${hover.type} pharmacy`}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600">
        <LegendDot color="#15bd6c" label="Urban pharmacy" />
        <LegendDot color="#0ea5e9" label="Semi-urban" />
        <LegendDot color="#f97316" label="Rural pharmacy" />
        <LegendDot color="#dc2626" label="Critical request" pulse />
        <LegendDot color="#ea580c" label="Urgent request" pulse />
        {userPos && <LegendDot color="#0ea5e9" label="Your location" solid />}
      </div>
    </div>
  );
}

function LegendDot({ color, label, pulse, solid }: { color: string; label: string; pulse?: boolean; solid?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${pulse ? "animate-pulse-soft" : ""}`}
        style={{ backgroundColor: color, boxShadow: solid ? "0 0 0 3px rgba(14,165,233,0.25)" : undefined }}
      />
      {label}
    </span>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function formatMapDistance(km: number | null): string {
  return formatDistance(km);
}

export { Navigation };
