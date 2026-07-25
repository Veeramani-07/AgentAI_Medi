import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LoginPage } from "@/components/LoginPage";
import { RegisterPage } from "@/components/RegisterPage";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AssistantChat } from "@/components/AssistantChat";
import { MedicineSearch } from "@/components/MedicineSearch";
import { EquipmentTracker } from "@/components/EquipmentTracker";
import { RequestBoard } from "@/components/RequestBoard";
import { PharmacyDirectory } from "@/components/PharmacyDirectory";
import { NearbyFinder } from "@/components/NearbyFinder";
import { AddRequestModal } from "@/components/AddRequestModal";
import { AddPharmacyModal } from "@/components/AddPharmacyModal";
import { AddEquipmentModal } from "@/components/AddEquipmentModal";
import { supabase } from "@/lib/supabase";
import type { Pharmacy, EmergencyRequest, PharmacyResult } from "@/lib/types";
import { MapPin, AlertCircle } from "lucide-react";

type Tab = "home" | "nearby" | "assistant" | "medicines" | "equipment" | "requests" | "pharmacies";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [authPage, setAuthPage] = useState<"login" | "register">("login");
  const [tab, setTab] = useState<Tab>("home");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [focusedPharmacy, setFocusedPharmacy] = useState<PharmacyResult | null>(null);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [showAddPharmacy, setShowAddPharmacy] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);

  const hasLocation = userLat != null && userLng != null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Load pharmacies + requests for the map and home stats
  useEffect(() => {
    (async () => {
      const [{ data: pharma }, { data: reqs }] = await Promise.all([
        supabase.from("pharmacies").select("*").order("rating", { ascending: false }),
        supabase.from("emergency_requests").select("*").order("created_at", { ascending: false }),
      ]);
      setPharmacies(pharma || []);
      setRequests(reqs || []);
    })();
  }, []);

  if (session === undefined) return null;

  if (!session) {
    return authPage === "login"
      ? <LoginPage onNavigateRegister={() => setAuthPage("register")} />
      : <RegisterPage onNavigateLogin={() => setAuthPage("login")} />;
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported on this device.");
      return;
    }
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      (err) => {
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can still search by city name."
            : "Couldn't get your location. Try again or search by city."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function refreshRequests() {
    supabase.from("emergency_requests").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRequests(data || []));
  }

  function handleMapSelect(id: string, kind: "pharmacy" | "request") {
    if (!id) return;
    setSelectedMapId(id);
    if (kind === "request") setTab("requests");
    else setTab("nearby");
  }

  function handlePharmacyFocus(p: PharmacyResult) {
    setFocusedPharmacy(p);
    setTab("nearby");
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Header
        activeTab={tab}
        onTab={(t) => setTab(t as Tab)}
        onAddPharmacy={() => setShowAddPharmacy(true)}
        hasLocation={hasLocation}
        onUseLocation={requestLocation}
        onSignOut={() => supabase.auth.signOut()}
      />

      {locationError && (
        <div className="bg-warning-50 border-b border-warning-100 text-warning-700 text-sm px-4 py-2.5 flex items-center gap-2 max-w-7xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      <main>
        {tab === "home" && (
          <Hero
            pharmacies={pharmacies}
            requests={requests}
            userLat={userLat}
            userLng={userLng}
            onUseLocation={requestLocation}
            hasLocation={hasLocation}
            onAskAssistant={() => setTab("assistant")}
            onViewRequests={() => setTab("requests")}
            onNearby={() => setTab("nearby")}
            onSelectMapPoint={handleMapSelect}
            selectedId={selectedMapId}
          />
        )}

        {tab === "nearby" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <NearbyFinder
              userLat={userLat}
              userLng={userLng}
              onUseLocation={requestLocation}
              hasLocation={hasLocation}
              onAddEquipment={() => setShowAddEquipment(true)}
            />
          </section>
        )}

        {tab === "assistant" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-6">
              <div className="space-y-4">
                <div>
                  <div className="section-eyebrow"><MapPin className="w-4 h-4" /> Agentic Assistant</div>
                  <h2 className="text-2xl font-bold text-ink-900 mt-1">Talk to MediFinder AI</h2>
                  <p className="text-sm text-ink-500 mt-1 max-w-lg">
                    Describe what you need and where. The assistant reasons through your request, searches live pharmacy data, and recommends the best options — explaining every step.
                  </p>
                </div>
                <AssistantChat
                  userLat={userLat}
                  userLng={userLng}
                  onUseLocation={requestLocation}
                  hasLocation={hasLocation}
                  onPharmacyFocus={handlePharmacyFocus}
                />
              </div>
              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-bold text-ink-900">How it works</h3>
                  <ol className="mt-3 space-y-3 text-sm text-ink-600">
                    <Step n={1} title="You ask in plain words">"I need Dolo 650 urgently in Mumbai" — Hindi or English, any phrasing.</Step>
                    <Step n={2} title="AI parses intent & entities">It detects the medicine, location, and urgency from your sentence.</Step>
                    <Step n={3} title="Searches live pharmacy data">Queries the real-time inventory and equipment tables.</Step>
                    <Step n={4} title="Ranks & explains">Surfaces in-stock pharmacies nearby, boosts rural stores, shows its reasoning.</Step>
                  </ol>
                </div>
                <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
                  <h3 className="font-bold text-ink-900">Try these</h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    <li className="flex gap-2"><span className="text-primary-600">•</span> "Ventilator availability in Delhi"</li>
                    <li className="flex gap-2"><span className="text-primary-600">•</span> "Insulin for my child in Hyderabad"</li>
                    <li className="flex gap-2"><span className="text-primary-600">•</span> "Oxygen cylinder urgent Jaipur"</li>
                    <li className="flex gap-2"><span className="text-primary-600">•</span> "24x7 pharmacy near me"</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "medicines" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <MedicineSearch userLat={userLat} userLng={userLng} />
          </section>
        )}

        {tab === "equipment" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <EquipmentTracker onAdd={() => setShowAddEquipment(true)} />
          </section>
        )}

        {tab === "requests" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <RequestBoard onAdd={() => setShowAddRequest(true)} />
          </section>
        )}

        {tab === "pharmacies" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <PharmacyDirectory
              userLat={userLat}
              userLng={userLng}
              onAdd={() => setShowAddPharmacy(true)}
            />
          </section>
        )}
      </main>

      <Footer onAddPharmacy={() => setShowAddPharmacy(true)} onAddRequest={() => setShowAddRequest(true)} />

      {/* Modals */}
      <AddRequestModal open={showAddRequest} onClose={() => setShowAddRequest(false)} onSubmitted={refreshRequests} />
      <AddPharmacyModal open={showAddPharmacy} onClose={() => setShowAddPharmacy(false)} onSubmitted={() => window.location.reload()} />
      <AddEquipmentModal open={showAddEquipment} onClose={() => setShowAddEquipment(false)} onSubmitted={() => setTab("equipment")} />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
      <div>
        <div className="font-semibold text-ink-800">{title}</div>
        <div className="text-ink-500 mt-0.5">{children}</div>
      </div>
    </li>
  );
}

function Footer({ onAddPharmacy, onAddRequest }: { onAddPharmacy: () => void; onAddRequest: () => void }) {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white leading-none">MediFinder India</div>
                <div className="text-[10px] font-semibold text-primary-400 leading-none mt-0.5">AI-powered medicine access</div>
              </div>
            </div>
            <p className="text-sm text-ink-400 mt-4 max-w-xs leading-relaxed">
              A community platform connecting patients, pharmacies, and volunteers across India — built to serve rural and urban areas equally.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Contribute</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onAddPharmacy} className="hover:text-primary-400 transition-colors">Register a pharmacy</button></li>
              <li><button onClick={onAddRequest} className="hover:text-primary-400 transition-colors">Post an emergency request</button></li>
              <li className="text-ink-500">Update equipment availability</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Important</h4>
            <p className="text-xs text-ink-400 leading-relaxed">
              MediFinder is a discovery and coordination tool, not a medical service. Always confirm stock by calling the pharmacy before visiting. In a life-threatening emergency, call 112 (India's emergency number) or go to your nearest hospital.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-800 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>For demonstration and community use. Verify all medical information with a licensed professional.</span>
          <span>Built with Supabase · Vite · React</span>
        </div>
      </div>
    </footer>
  );
}
