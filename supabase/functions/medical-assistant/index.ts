// MediFinder AI Assistant — agentic edge function v2
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Entity {
  type: "medicine" | "equipment" | "location" | "urgency" | "quantity";
  value: string;
  raw: string;
}

interface ReasoningStep {
  step: number;
  action: string;
  detail: string;
  result?: string;
}

interface PharmacyResult {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  district: string | null;
  address: string;
  lat: number;
  lng: number;
  distance_km: number | null;
  pharmacy_type: string;
  is_24x7: boolean;
  home_delivery: boolean;
  rating: number;
  open_time: string;
  close_time: string;
  match_reason: string;
  matched_item?: {
    kind: "medicine" | "equipment";
    name: string;
    generic_name?: string;
    in_stock: boolean;
    quantity: number;
    price: number | null;
    status?: string;
    available_count?: number;
    total_count?: number;
  };
}

interface AssistantResponse {
  intent: string;
  entities: Entity[];
  reasoning: ReasoningStep[];
  reply: string;
  pharmacies: PharmacyResult[];
  suggestions: string[];
  confidence: number;
}

const MEDICINE_KEYWORDS = [
  "medicine","tablet","capsule","syrup","injection","inhaler","cream","ointment",
  "drops","drug","pill","dose","prescription","crocin","dolo","paracetamol","ibuprofen",
  "azithromycin","amoxicillin","augmentin","insulin","metformin","aspirin","atorvastatin",
  "salbutamol","ventolin","ondansetron","pantoprazole","antibiotic","fever","pain",
  "antiseptic","ors","tetanus","remdesivir","ivermectin","hydroxychloroquine"
];

const EQUIPMENT_KEYWORDS = [
  "ventilator","oxygen","cylinder","icu","bed","nebulizer","defibrillator",
  "dialysis","x-ray","xray","ultrasound","ecg","ambulance","blood","concentrator",
  "wheelchair","stretcher","glucometer","bp monitor","mask","equipment","machine"
];

const STATE_NAMES = [
  "andhra pradesh","arunachal pradesh","assam","bihar","chhattisgarh","goa","gujarat",
  "haryana","himachal pradesh","jharkhand","karnataka","kerala","madhya pradesh",
  "maharashtra","manipur","meghalaya","mizoram","nagaland","odisha","punjab","rajasthan",
  "sikkim","tamil nadu","telangana","tripura","uttar pradesh","uttarakhand","west bengal",
  "delhi","chandigarh","jammu","kashmir","ladakh","puducherry","andaman","nicobar"
];

const MAJOR_CITIES = [
  "mumbai","delhi","bangalore","bengaluru","chennai","kolkata","hyderabad","pune",
  "ahmedabad","jaipur","lucknow","kanpur","nagpur","surat","indore","bhopal","patna",
  "vizag","visakhapatnam","vadodara","baroda","ghaziabad","gurugram","gurgaon","noida",
  "kochi","coimbatore","ludhiana","agra","varanasi","madurai","meerut","nashik","faridabad",
  "rajkot","kalyan","vasai","virar","thane","tirupati","dibrugarh","barmer","khurja",
  "nabha","kunnamkulam","ernakulam",
  "velachery","trichy","tiruchirappalli","salem","mettur","tirunelveli","palayamkottai",
  "tiruppur","avinashi","vellore","erode","ps park","thoothukudi","tuticorin","dindigul",
  "begampur","thanjavur","ramanathapuram","rameswaram","sivaganga","virudhunagar",
  "krishnagiri","namakkal","dharmapuri","nagapattinam","tiruvarur","cuddalore",
  "kanchipuram","tiruvallur","kallakurichi","karur","perambalur","ariyalur","tirupattur",
  "ranipet","tenkasi","theni","chengalpattu","nagercoil","kanyakumari","pudukkottai",
  "ooty","udhagamandalam","gudalur","mayiladuthurai","tiruvannamalai","polur","chengam",
  "kulithalai","ulundurpet","palladam",
  "udumalpet","madathukulam","dhali","angalakurichi","pollachi","kinathukadavu",
  "negamam","zamin uthukuli","anaimalai","usilampetti","melur","kumbakonam","papanasam",
  "lalgudi","manapparai","palani","oddanchatram","attur","omalur","gudiyatham","arcot",
  "nanguneri","vaniyambadi","srivilliputhur",
  "malegaon","kendrapara","bikaner","sitamarhi","gosaba","kurnool","tezpur","thirumangalam"
];

const TN_DISTRICTS = [
  "chennai","coimbatore","madurai","tiruchirappalli","trichy","salem","tirunelveli",
  "tiruppur","vellore","erode","thoothukudi","tuticorin","dindigul","thanjavur",
  "ramanathapuram","sivaganga","virudhunagar","krishnagiri","namakkal","dharmapuri",
  "nagapattinam","tiruvarur","cuddalore","kanchipuram","tiruvallur","kallakurichi",
  "karur","perambalur","ariyalur","tirupattur","ranipet","tenkasi","theni",
  "chengalpattu","kanyakumari","pudukkottai","nilgiris","mayiladuthurai","tiruvannamalai"
];

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(query: string, target: string, threshold = 2): boolean {
  if (target.includes(query)) return true;
  if (query.length < 3) return false;
  return levenshtein(query, target) <= threshold;
}

function extractEntities(text: string): Entity[] {
  const lower = normalize(text);
  const entities: Entity[] = [];

  // Urgency detection
  if (/\b(critical|emergency|dying|life.?threatening|serious|severe|critical condition)\b/.test(lower)) {
    const m = lower.match(/dying|life.?threatening|critical condition|severe/);
    entities.push({ type: "urgency", value: m ? "critical" : "critical", raw: m?.[0] || "critical" });
  } else if (/\b(urgent|urgently|immediate|right now|asap|quickly|fast|tonight|now)\b/.test(lower)) {
    entities.push({ type: "urgency", value: "urgent", raw: "urgent" });
  } else {
    entities.push({ type: "urgency", value: "normal", raw: "default" });
  }

  // Quantity detection
  const qtyMatch = lower.match(/(\d+)\s*(tablets?|capsules?|injections?|vials?|cylinders?|units?|pieces?|strips?|bottles?|packs?|boxes?)/);
  if (qtyMatch) {
    entities.push({ type: "quantity", value: qtyMatch[1], raw: qtyMatch[0] });
  }

  // Location detection — cities (match the longest city name to avoid partial conflicts)
  let bestCity: string | null = null;
  for (const city of MAJOR_CITIES) {
    if (city === "tamil nadu cities") continue;
    if (lower.includes(city) && (bestCity === null || city.length > bestCity.length)) {
      bestCity = city;
    }
  }
  if (bestCity) {
    entities.push({ type: "location", value: bestCity, raw: bestCity });
  }
  // Tamil Nadu district names
  if (!bestCity) {
    for (const d of TN_DISTRICTS) {
      if (lower.includes(d)) {
        entities.push({ type: "location", value: d, raw: d });
        break;
      }
    }
  }
  // States
  if (!bestCity) {
    for (const state of STATE_NAMES) {
      if (lower.includes(state)) {
        entities.push({ type: "location", value: state, raw: state });
        break;
      }
    }
  }

  // Equipment detection (check first — some terms like "oxygen" can be both)
  for (const kw of EQUIPMENT_KEYWORDS) {
    if (lower.includes(kw)) {
      entities.push({ type: "equipment", value: kw, raw: kw });
      break;
    }
  }

  // Medicine detection — keyword match
  for (const kw of MEDICINE_KEYWORDS) {
    if (lower.includes(kw)) {
      if (!entities.some(e => e.type === "medicine")) {
        entities.push({ type: "medicine", value: kw, raw: kw });
      }
      break;
    }
  }

  return entities;
}

function detectIntent(entities: Entity[], text: string): string {
  const hasMedicine = entities.some(e => e.type === "medicine");
  const hasEquipment = entities.some(e => e.type === "equipment");
  const lower = normalize(text);

  if (/request|need urgent|post request|someone needs|help find for|emergency request/.test(lower)) {
    return "create_request";
  }
  if (hasEquipment && !hasMedicine) return "find_equipment";
  if (hasMedicine && !hasEquipment) return "find_medicine";
  if (hasMedicine && hasEquipment) return "find_medicine"; // prioritize medicine
  if (/nearest|nearby|near me|closest|find pharmacy|pharmacies in|locate/.test(lower)) return "find_pharmacy";
  if (/available|availability|stock|in stock|have .*\?/.test(lower)) return "check_availability";
  return "find_pharmacy";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const query: string = (body.query || "").trim();
    const userLat: number | null = body.lat ?? null;
    const userLng: number | null = body.lng ?? null;
    const sessionId: string = body.session_id || crypto.randomUUID();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const reasoning: ReasoningStep[] = [];
    let stepNum = 1;
    const pushStep = (action: string, detail: string, result?: string) => {
      reasoning.push({ step: stepNum++, action, detail, result });
    };

    // STEP 1: Parse and extract entities
    const entities = extractEntities(query);
    const intent = detectIntent(entities, query);
    pushStep(
      "Parse query",
      `Analyzed user input: "${query}". Extracted ${entities.length} entities.`,
      `Intent: ${intent}; Entities: ${entities.map(e => `${e.type}=${e.value}`).join(", ") || "none"}`
    );

    // Handle create_request intent separately
    if (intent === "create_request") {
      pushStep("Route to request board", "Detected this is an emergency request. Directing user to post a request.", "Redirecting to request form.");
      const reply = `I understand this is an urgent request. Please post it on the Emergency Request Board so nearby pharmacies and volunteers can respond. ${
        entities.find(e => e.type === "location") ? `I've detected the location as ${entities.find(e => e.type === "location")?.value}.` : "Include your city and state for better reach."
      } Tap "Post Emergency Request" below to add it.`;
      const response: AssistantResponse = {
        intent,
        entities,
        reasoning,
        reply,
        pharmacies: [],
        suggestions: ["Post Emergency Request", "Search pharmacies near me"],
        confidence: 0.85,
      };
      await logAssistant(supabase, sessionId, query, intent, entities, reasoning, reply);
      return jsonResponse(response);
    }

    // STEP 2: Resolve location
    let locationFilter: { place?: string; state?: string } = {};
    const locEntity = entities.find(e => e.type === "location");
    if (locEntity) {
      const v = locEntity.value;
      if (STATE_NAMES.includes(v)) locationFilter.state = v;
      else {
        // Search across city AND district columns (TN district names live in district)
        locationFilter.place = v === "bengaluru" ? "Bengaluru" : capitalizeWords(v);
      }
      pushStep(
        "Resolve location",
        `Detected location: ${locEntity.value}. Will filter pharmacies by city or district matching this region.`,
        locationFilter.place ? `Place: ${locationFilter.place}` : `State: ${locationFilter.state}`
      );
    } else if (userLat != null && userLng != null) {
      pushStep(
        "Use device location",
        "No city mentioned. Using provided GPS coordinates to compute proximity.",
        `lat=${userLat.toFixed(4)}, lng=${userLng.toFixed(4)}`
      );
    } else {
      pushStep(
        "No location given",
        "Will search across all pharmacies and rank by stock relevance. Recommend asking for city for proximity.",
        "National search."
      );
    }

    // STEP 3: Identify the medicine or equipment term
    const medEntity = entities.find(e => e.type === "medicine");
    const equipEntity = entities.find(e => e.type === "equipment");
    const searchTerm = medEntity?.value || equipEntity?.value || null;
    const searchKind: "medicine" | "equipment" | null = medEntity ? "medicine" : equipEntity ? "equipment" : null;

    if (searchTerm) {
      pushStep(
        `Identify ${searchKind}`,
        `User is looking for "${searchTerm}". Will match against medicine/equipment catalog using fuzzy search.`,
        `Search term: ${searchTerm}`
      );
    }

    // STEP 4: Query pharmacies — search city OR district OR state so district-name
    // queries (e.g. "pharmacy in Tiruvarur") resolve correctly.
    let pharmacyQuery = supabase.from("pharmacies").select("*");
    if (locationFilter.place) {
      const p = locationFilter.place;
      pharmacyQuery = pharmacyQuery.or(
        `city.ilike.%${p}%,district.ilike.%${p}%`
      );
    } else if (locationFilter.state) {
      pharmacyQuery = pharmacyQuery.ilike("state", `%${capitalizeWords(locationFilter.state)}%`);
    }
    const { data: pharmaciesRaw, error: pErr } = await pharmacyQuery.order("rating", { ascending: false });
    if (pErr) throw new Error(`Pharmacy query failed: ${pErr.message}`);
    let pharmacies: any[] = pharmaciesRaw || [];
    pushStep(
      "Fetch pharmacies",
      locationFilter.place || locationFilter.state
        ? `Queried pharmacies matching ${locationFilter.place || locationFilter.state} (city or district).`
        : "Queried all pharmacies in directory.",
      `Found ${pharmacies.length} pharmacies.`
    );

    // If location filtered to zero, fall back to all (rural outreach)
    if (pharmacies.length === 0 && (locationFilter.place || locationFilter.state)) {
      const { data: all } = await supabase.from("pharmacies").select("*").order("rating", { ascending: false });
      pharmacies = all || [];
      pushStep(
        "Expand search radius",
        "No pharmacies found in specified location. Expanding to national search to ensure rural coverage.",
        `Expanded to ${pharmacies.length} pharmacies.`
      );
    }

    // STEP 5: Match medicine/equipment inventory
    let matchedMedicine: any = null;
    let matchedEquipmentType: string | null = null;
    let inventoryMap: Record<string, any> = {};
    let equipmentMap: Record<string, any> = {};

    if (searchKind === "medicine" && searchTerm) {
      // Find best matching medicine in catalog (fuzzy)
      const { data: meds } = await supabase.from("medicines").select("*");
      const lowerTerm = searchTerm.toLowerCase();
      let best = null as any;
      let bestScore = Infinity;
      for (const m of meds || []) {
        const name = m.name.toLowerCase();
        const generic = m.generic_name.toLowerCase();
        if (name.includes(lowerTerm) || generic.includes(lowerTerm)) {
          best = m; bestScore = 0; break;
        }
        const d1 = levenshtein(lowerTerm, name.split(" ")[0]);
        const d2 = levenshtein(lowerTerm, generic.split(" ")[0]);
        const d = Math.min(d1, d2);
        if (d < bestScore && d <= 3) { bestScore = d; best = m; }
      }
      if (best) {
        matchedMedicine = best;
        pushStep(
          "Match medicine",
          `Best catalog match: "${best.name}" (generic: ${best.generic_name}, category: ${best.category}).`,
          `medicine_id=${best.id}`
        );
        const { data: inv } = await supabase
          .from("pharmacy_inventory")
          .select("*, medicines(*)")
          .eq("medicine_id", best.id)
          .eq("in_stock", true);
        for (const i of inv || []) {
          inventoryMap[i.pharmacy_id] = i;
        }
        pushStep(
          "Check stock",
          `Pulled inventory for ${best.name} across matching pharmacies.`,
          `${(inv || []).length} in-stock records found.`
        );
      } else {
        pushStep("Match medicine", `No close match for "${searchTerm}" in the medicine catalog. Will return nearest pharmacies instead.`, "No medicine match.");
      }
    }

    if (searchKind === "equipment" && searchTerm) {
      // Map search term to a canonical equipment_type
      const equipTypes = [
        "Ventilator","Oxygen Cylinder","ICU Bed","Nebulizer","Defibrillator",
        "Dialysis Machine","X-Ray Machine","Ultrasound","ECG Machine","Ambulance",
        "Blood Bag","Oxygen Concentrator","Nebulizer Mask","Wheelchair","Stretchers",
        "Glucometer","BP Monitor","Other"
      ];
      let best = null as string | null;
      let bestScore = Infinity;
      const lowerTerm = searchTerm.toLowerCase();
      for (const et of equipTypes) {
        const l = et.toLowerCase();
        if (l.includes(lowerTerm) || lowerTerm.includes(l)) { best = et; bestScore = 0; break; }
        const d = levenshtein(lowerTerm, l.split(" ")[0]);
        if (d < bestScore && d <= 3) { bestScore = d; best = et; }
      }
      if (best) {
        matchedEquipmentType = best;
        pushStep(
          "Match equipment",
          `Mapped "${searchTerm}" to equipment type "${best}".`,
          `equipment_type=${best}`
        );
        const { data: eqs } = await supabase
          .from("pharmacy_equipment")
          .select("*")
          .eq("equipment_type", best)
          .neq("status", "out-of-stock");
        for (const e of eqs || []) {
          equipmentMap[e.pharmacy_id] = e;
        }
        pushStep(
          "Check availability",
          `Pulled ${best} availability across matching pharmacies.`,
          `${(eqs || []).length} available records found.`
        );
      } else {
        pushStep("Match equipment", `No close match for "${searchTerm}". Will return nearest pharmacies instead.`, "No equipment match.");
      }
    }

    // STEP 5b: Rural/outreach expansion — if we matched an item but none of the
    // location-filtered pharmacies have it in stock, pull in-stock pharmacies from
    // the full dataset so help is reachable even outside the requested city.
    const localHasStock =
      (matchedMedicine && Object.keys(inventoryMap).length > 0) ||
      (matchedEquipmentType && Object.keys(equipmentMap).length > 0);
    if ((matchedMedicine || matchedEquipmentType) && !localHasStock) {
      pushStep(
        "Expand for availability",
        `No in-stock ${matchedMedicine ? "medicine" : "equipment"} found within ${locationFilter.place || locationFilter.state || "the area"}. Searching nationally for pharmacies that have it, to maximize reach.`,
        "National stock scan."
      );
      if (matchedMedicine) {
        const { data: invAll } = await supabase
          .from("pharmacy_inventory")
          .select("*, pharmacies(*)")
          .eq("medicine_id", matchedMedicine.id)
          .eq("in_stock", true);
        for (const i of invAll || []) {
          inventoryMap[i.pharmacy_id] = i;
          if (!pharmacies.find((p: any) => p.id === i.pharmacy_id) && i.pharmacies) {
            pharmacies.push(i.pharmacies);
          }
        }
        pushStep("Merge national stock", `Merged ${(invAll || []).length} in-stock records from other regions.`, `${pharmacies.length} total pharmacies now.`);
      } else if (matchedEquipmentType) {
        const { data: eqAll } = await supabase
          .from("pharmacy_equipment")
          .select("*, pharmacies(*)")
          .eq("equipment_type", matchedEquipmentType)
          .neq("status", "out-of-stock");
        for (const e of eqAll || []) {
          equipmentMap[e.pharmacy_id] = e;
          if (!pharmacies.find((p: any) => p.id === e.pharmacy_id) && e.pharmacies) {
            pharmacies.push(e.pharmacies);
          }
        }
        pushStep("Merge national stock", `Merged ${(eqAll || []).length} available records from other regions.`, `${pharmacies.length} total pharmacies now.`);
      }
    }

    // STEP 6: Rank pharmacies
    const results: PharmacyResult[] = pharmacies.map((p: any) => {
      const dist = userLat != null && userLng != null
        ? haversineKm(userLat, userLng, p.lat, p.lng)
        : null;

      let matched_item: PharmacyResult["matched_item"] | undefined;
      let matchReason = "Nearby pharmacy in your area.";

      if (matchedMedicine && inventoryMap[p.id]) {
        const inv = inventoryMap[p.id];
        matched_item = {
          kind: "medicine",
          name: matchedMedicine.name,
          generic_name: matchedMedicine.generic_name,
          in_stock: inv.in_stock,
          quantity: inv.quantity,
          price: inv.price,
        };
        matchReason = `Has ${matchedMedicine.name} in stock (${inv.quantity} units${inv.price ? `, Rs.${inv.price}` : ""}).`;
      } else if (matchedMedicine) {
        matchReason = `No stock record for ${matchedMedicine.name} — call to confirm.`;
      }

      if (matchedEquipmentType && equipmentMap[p.id]) {
        const eq = equipmentMap[p.id];
        matched_item = {
          kind: "equipment",
          name: matchedEquipmentType,
          in_stock: eq.status !== "out-of-stock",
          quantity: eq.available_count,
          status: eq.status,
          available_count: eq.available_count,
          total_count: eq.total_count,
        };
        matchReason = `${matchedEquipmentType}: ${eq.available_count}/${eq.total_count} available (${eq.status}).`;
      } else if (matchedEquipmentType) {
        matchReason = `No ${matchedEquipmentType} record — call to confirm.`;
      }

      if (!matchedMedicine && !matchedEquipmentType) {
        matchReason = p.is_24x7
          ? "Open 24x7 — good for emergencies."
          : p.home_delivery
          ? "Offers home delivery."
          : `Rated ${p.rating}/5 pharmacy in ${p.city}.`;
      }

      return {
        id: p.id,
        name: p.name,
        phone: p.phone,
        city: p.city,
        state: p.state,
        district: p.district,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        distance_km: dist,
        pharmacy_type: p.pharmacy_type,
        is_24x7: p.is_24x7,
        home_delivery: p.home_delivery,
        rating: p.rating,
        open_time: p.open_time,
        close_time: p.close_time,
        match_reason: matchReason,
        matched_item,
      };
    });

    // Sort: in-stock matches first, then by distance/rating, rural get a small boost for outreach
    results.sort((a, b) => {
      const aHasStock = a.matched_item?.in_stock ? 1 : 0;
      const bHasStock = b.matched_item?.in_stock ? 1 : 0;
      if (aHasStock !== bHasStock) return bHasStock - aHasStock;
      if (a.distance_km != null && b.distance_km != null) return a.distance_km - b.distance_km;
      // Rural boost: prioritize rural/semi-urban so rural users get surfaced
      const ruralRank = (t: string) => (t === "rural" ? 0 : t === "semi-urban" ? 1 : 2);
      const ar = ruralRank(a.pharmacy_type);
      const br = ruralRank(b.pharmacy_type);
      if (ar !== br) return ar - br;
      return b.rating - a.rating;
    });

    const top = results.slice(0, 8);
    pushStep(
      "Rank results",
      `Ranked ${results.length} pharmacies by stock availability, proximity, and rural outreach. Returning top ${top.length}.`,
      `${top.length} recommendations prepared.`
    );

    // STEP 7: Compose natural-language reply
    const reply = composeReply(intent, top, searchTerm, searchKind, matchedMedicine, matchedEquipmentType, entities, locEntity);
    pushStep("Compose reply", "Generated human-readable recommendation summary.", "Reply ready.");

    const suggestions = generateSuggestions(intent, searchTerm, locEntity);
    const confidence = computeConfidence(entities, top, matchedMedicine, matchedEquipmentType);

    const response: AssistantResponse = {
      intent,
      entities,
      reasoning,
      reply,
      pharmacies: top,
      suggestions,
      confidence,
    };

    await logAssistant(supabase, sessionId, query, intent, entities, reasoning, reply);
    return jsonResponse(response);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Assistant failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function logAssistant(supabase: any, sessionId: string, query: string, intent: string, entities: Entity[], reasoning: ReasoningStep[], reply: string) {
  try {
    await supabase.from("assistant_logs").insert({
      session_id: sessionId,
      user_query: query,
      intent,
      extracted_entities: entities,
      reasoning_steps: reasoning,
      reply,
    });
  } catch {
    // best-effort logging
  }
}

function capitalizeWords(s: string): string {
  return s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function composeReply(
  intent: string,
  results: PharmacyResult[],
  searchTerm: string | null,
  searchKind: "medicine" | "equipment" | null,
  matchedMedicine: any,
  matchedEquipmentType: string | null,
  entities: Entity[],
  locEntity?: Entity
): string {
  if (results.length === 0) {
    return `I couldn't find any matching pharmacies${
      locEntity ? ` near ${locEntity.value}` : ""
    }. I recommend posting an emergency request on the Request Board so nearby volunteers and suppliers can respond. You can also try a broader city or state name.`;
  }

  const inStock = results.filter(r => r.matched_item?.in_stock);
  const parts: string[] = [];
  const locPhrase = locEntity ? ` near ${locEntity.value}` : "";

  if (searchKind === "medicine" && matchedMedicine) {
    if (inStock.length > 0) {
      parts.push(`I found ${inStock.length} pharmacy${inStock.length === 1 ? "" : "ies"} with **${matchedMedicine.name}** (${matchedMedicine.generic_name}) in stock${locPhrase}.`);
      const outOfArea = results.length - inStock.length;
      if (outOfArea > 0 && locEntity) {
        parts.push(`Some came from outside ${locEntity.value} to make sure you get help — distance is shown for each.`);
      }
    } else {
      parts.push(`I matched **${matchedMedicine.name}** (${matchedMedicine.generic_name}), but no pharmacy currently reports it in stock. I've listed the closest pharmacies below — please call ahead to confirm availability. If this is urgent, post an emergency request.`);
    }
  } else if (searchKind === "equipment" && matchedEquipmentType) {
    if (inStock.length > 0) {
      parts.push(`${inStock.length} location${inStock.length === 1 ? "" : "s"} have **${matchedEquipmentType}** available${locPhrase}.`);
    } else {
      parts.push(`No pharmacy currently reports **${matchedEquipmentType}** as available. I've listed the nearest pharmacies below — call to confirm. If this is life-critical, please post an emergency request immediately.`);
    }
  } else {
    parts.push(`Here are the ${results.length} best pharmacies${locPhrase ? ` near ${locEntity!.value}` : " I recommend"}.`);
  }

  // Highlight top 2
  const top2 = (inStock.length > 0 ? inStock : results).slice(0, 2);
  if (top2.length > 0) {
    parts.push("");
    parts.push("**Top picks:**");
    top2.forEach((r, i) => {
      const distStr = r.distance_km != null ? ` • ${r.distance_km.toFixed(1)} km away` : "";
      const ruralTag = r.pharmacy_type === "rural" ? " • Rural pharmacy" : "";
      parts.push(`${i + 1}. **${r.name}**, ${r.city}${distStr}${ruralTag} — ${r.match_reason} Call: ${r.phone}`);
    });
  }

  const ruralCount = results.filter(r => r.pharmacy_type === "rural").length;
  if (ruralCount > 0) {
    parts.push("");
    parts.push(`Includes ${ruralCount} rural pharmac${ruralCount === 1 ? "y" : "ies"} to support underserved areas.`);
  }

  const urgency = entities.find(e => e.type === "urgency");
  if (urgency && (urgency.value === "critical" || urgency.value === "urgent")) {
    parts.push("");
    parts.push("This looks urgent. If stock isn't reachable nearby, post an Emergency Request so the community can respond fast.");
  }

  return parts.join("\n");
}

function generateSuggestions(intent: string, searchTerm: string | null, locEntity?: Entity): string[] {
  const base = [
    searchTerm ? `Is ${searchTerm} available near me?` : "Find medicines near me",
    "Show ventilator availability",
    "Oxygen cylinder in my city",
    "Post emergency request",
  ];
  if (locEntity) {
    base.push(`Pharmacies in ${capitalizeWords(locEntity.value)}`);
  }
  base.push("24x7 pharmacies near me");
  return base.slice(0, 5);
}

function computeConfidence(entities: Entity[], results: PharmacyResult[], med: any, equip: string | null): number {
  let c = 0.5;
  if (entities.length > 0) c += 0.1;
  if (entities.some(e => e.type === "location")) c += 0.1;
  if (entities.some(e => e.type === "medicine" || e.type === "equipment")) c += 0.1;
  if (med || equip) c += 0.1;
  if (results.some(r => r.matched_item?.in_stock)) c += 0.1;
  return Math.min(c, 0.97);
}
