import {
  Phone, MapPin, Star, Clock, Truck, CreditCard, Navigation, Heart,
} from "lucide-react";
import type { PharmacyWithDistance } from "@/lib/hooks";
import type { PharmacyResult, MatchedItem } from "@/lib/types";
import {
  PharmacyTypeBadge, Open24x7Badge, VerifiedBadge, StockBadge, EquipmentStatusBadge,
} from "./Badges";
import { formatDistance, formatPrice } from "@/lib/utils";

interface PharmacyResultCardProps {
  pharmacy: PharmacyResult;
  onFocus?: (p: PharmacyResult) => void;
  compact?: boolean;
}

export function PharmacyResultCard({ pharmacy, onFocus, compact }: PharmacyResultCardProps) {
  return (
    <div
      className={`card-hover p-4 cursor-pointer group ${compact ? "" : "p-5"}`}
      onClick={() => onFocus?.(pharmacy)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-ink-900 truncate">{pharmacy.name}</h4>
            <PharmacyTypeBadge type={pharmacy.pharmacy_type} />
            <Open24x7Badge is24x7={pharmacy.is_24x7} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-500 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pharmacy.address}, {pharmacy.city}, {pharmacy.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold tabular-nums">{pharmacy.rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-sm text-ink-600 mt-2.5 bg-primary-50/60 border border-primary-100/70 rounded-lg px-3 py-2">
        <span className="font-semibold text-primary-700">Match: </span>
        {pharmacy.match_reason}
      </p>

      {pharmacy.matched_item && <MatchedItemRow item={pharmacy.matched_item} />}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {pharmacy.distance_km != null && (
          <span className="chip-secondary">
            <Navigation className="w-3 h-3" /> {formatDistance(pharmacy.distance_km)} away
          </span>
        )}
        {!pharmacy.is_24x7 && (
          <span className="chip-neutral"><Clock className="w-3 h-3" /> {pharmacy.open_time}–{pharmacy.close_time}</span>
        )}
        {pharmacy.home_delivery && <span className="chip-primary"><Truck className="w-3 h-3" /> Delivery</span>}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-100">
        <a
          href={`tel:${pharmacy.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="btn-primary flex-1 text-sm py-2"
        >
          <Phone className="w-4 h-4" /> Call {pharmacy.phone}
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-secondary text-sm py-2"
        >
          <Navigation className="w-4 h-4" /> Directions
        </a>
      </div>
    </div>
  );
}

function MatchedItemRow({ item }: { item: MatchedItem }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2 bg-ink-50 rounded-lg px-3 py-2">
      <div className="min-w-0">
        <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
          {item.kind === "medicine" ? "Medicine" : "Equipment"}
        </div>
        <div className="text-sm font-bold text-ink-800 truncate">
          {item.name}
          {item.generic_name && <span className="font-normal text-ink-500"> · {item.generic_name}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.kind === "medicine" ? (
          <StockBadge inStock={item.in_stock} quantity={item.quantity} />
        ) : (
          <EquipmentStatusBadge status={(item.status as import("@/lib/types").EquipmentStatus) || "available"} />
        )}
        {item.price != null && <span className="text-sm font-bold text-ink-700">{formatPrice(item.price)}</span>}
      </div>
    </div>
  );
}

interface PharmacyDirectoryCardProps {
  pharmacy: PharmacyWithDistance;
  inventoryCount?: number;
  equipmentCount?: number;
}

export function PharmacyDirectoryCard({ pharmacy, inventoryCount, equipmentCount }: PharmacyDirectoryCardProps) {
  return (
    <div className="card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-ink-900">{pharmacy.name}</h4>
            <PharmacyTypeBadge type={pharmacy.pharmacy_type} />
            <Open24x7Badge is24x7={pharmacy.is_24x7} />
            <VerifiedBadge verified={pharmacy.verified} />
          </div>
          {pharmacy.owner_name && (
            <p className="text-xs text-ink-500 mt-0.5">Owner: {pharmacy.owner_name}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold tabular-nums">{pharmacy.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-sm text-ink-600 mt-2">
        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-ink-400" />
        <span>{pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.pincode}</span>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {pharmacy.distance_km != null && (
          <span className="chip-secondary"><Navigation className="w-3 h-3" /> {formatDistance(pharmacy.distance_km)}</span>
        )}
        {!pharmacy.is_24x7 && (
          <span className="chip-neutral"><Clock className="w-3 h-3" /> {pharmacy.open_time}–{pharmacy.close_time}</span>
        )}
        {pharmacy.home_delivery && <span className="chip-primary"><Truck className="w-3 h-3" /> Home delivery</span>}
        {pharmacy.online_payment && <span className="chip-neutral"><CreditCard className="w-3 h-3" /> Online pay</span>}
        {pharmacy.services.map((s) => (
          <span key={s} className="chip-neutral">{s}</span>
        ))}
      </div>

      {(inventoryCount != null || equipmentCount != null) && (
        <div className="flex items-center gap-4 mt-3 text-xs text-ink-500">
          {inventoryCount != null && <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-primary-500" /> {inventoryCount} medicines stocked</span>}
          {equipmentCount != null && <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-secondary-500" /> {equipmentCount} equipment types</span>}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink-100">
        <a href={`tel:${pharmacy.phone}`} className="btn-primary flex-1 text-sm py-2">
          <Phone className="w-4 h-4" /> Call {pharmacy.phone}
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary text-sm py-2"
        >
          <Navigation className="w-4 h-4" /> Directions
        </a>
      </div>
    </div>
  );
}
