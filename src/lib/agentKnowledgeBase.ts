/**
 * Shared AI knowledge base for all dynamic agent computations.
 * All agents 4–10 reference this file to produce output matched exactly to user input.
 */

// ─────────────────────────────────────────────
// DRUG INTERACTION KNOWLEDGE BASE (Agent 4)
// ─────────────────────────────────────────────
export interface DrugInteractionRule {
  pattern1: RegExp;
  pattern2: RegExp;
  drug1Label: string;
  drug2Label: string;
  severity: "severe" | "moderate" | "mild" | "none";
  description: string;
  recommendation: string;
}

export const DRUG_INTERACTION_RULES: DrugInteractionRule[] = [
  {
    pattern1: /warfarin|coumadin|sintrom/i,
    pattern2: /ibuprofen|aspirin|combiflam|diclofenac|naproxen|brufen|volini|voveran/i,
    drug1Label: "Warfarin (Anticoagulant)",
    drug2Label: "NSAID / Ibuprofen",
    severity: "severe",
    description: "NSAIDs significantly potentiate anticoagulant effect of Warfarin, causing high risk of GI haemorrhage and internal bleeding.",
    recommendation: "Strictly contraindicated. Switch to Paracetamol 650mg (Dolo) as a safe pain-relief alternative.",
  },
  {
    pattern1: /warfarin|coumadin/i,
    pattern2: /ciprofloxacin|cipro|levofloxacin|azithromycin|clarithromycin/i,
    drug1Label: "Warfarin",
    drug2Label: "Fluoroquinolone / Macrolide Antibiotic",
    severity: "severe",
    description: "Broad-spectrum antibiotics inhibit gut flora that synthesizes Vitamin K, causing INR to surge unpredictably.",
    recommendation: "Monitor INR every 2 days during antibiotic course. Adjust Warfarin dose as directed by physician.",
  },
  {
    pattern1: /metformin|glycomet|glucophage|obimet/i,
    pattern2: /ibuprofen|combiflam|diclofenac|naproxen/i,
    drug1Label: "Metformin (Anti-diabetic)",
    drug2Label: "NSAID Analgesic",
    severity: "moderate",
    description: "NSAIDs reduce renal perfusion, impair Metformin clearance, and elevate risk of lactic acidosis in diabetic patients.",
    recommendation: "Use Paracetamol for pain. Monitor creatinine levels if NSAID use is unavoidable.",
  },
  {
    pattern1: /atorvastatin|atorva|lipitor|rosuvastatin|rosuvas|crestor/i,
    pattern2: /azithromycin|azithral|claribid|clarithromycin|erythromycin/i,
    drug1Label: "Statin (Atorvastatin / Rosuvastatin)",
    drug2Label: "Macrolide Antibiotic",
    severity: "moderate",
    description: "Macrolides inhibit CYP3A4 enzyme, significantly elevating statin plasma levels and risk of rhabdomyolysis (muscle damage).",
    recommendation: "Temporarily hold statin for the 3–5 day antibiotic course, then resume.",
  },
  {
    pattern1: /amlodipine|amlong|novasc|nifedipine|felodipine/i,
    pattern2: /azithromycin|clarithromycin|erythromycin/i,
    drug1Label: "Calcium Channel Blocker (Amlodipine)",
    drug2Label: "Macrolide Antibiotic",
    severity: "moderate",
    description: "Macrolides prolong the QT interval when combined with CCBs, potentially causing fatal cardiac arrhythmia.",
    recommendation: "Use Amoxicillin or Doxycycline as a safer antibiotic alternative during cardiac medication.",
  },
  {
    pattern1: /metformin|glycomet/i,
    pattern2: /alcohol|ethanol/i,
    drug1Label: "Metformin",
    drug2Label: "Alcohol",
    severity: "severe",
    description: "Alcohol combined with Metformin significantly increases the risk of fatal lactic acidosis by impairing lactate metabolism.",
    recommendation: "Absolute contraindication. Strictly avoid all alcohol during Metformin therapy.",
  },
  {
    pattern1: /pantoprazole|pan 40|pantocid|omeprazole|omez|rabeprazole|razo/i,
    pattern2: /clopidogrel|plavix|clopilet/i,
    drug1Label: "Proton Pump Inhibitor (PPI)",
    drug2Label: "Clopidogrel (Antiplatelet)",
    severity: "moderate",
    description: "PPIs (especially Omeprazole) significantly reduce the antiplatelet efficacy of Clopidogrel by blocking CYP2C19 activation.",
    recommendation: "Switch to Pantoprazole (lower CYP2C19 inhibition) or use H2-blocker Famotidine as an alternative.",
  },
  {
    pattern1: /paracetamol|dolo|crocin|p-500|pacimol|calpol/i,
    pattern2: /paracetamol|dolo|crocin|p-500|pacimol|calpol/i,
    drug1Label: "Paracetamol (Product A)",
    drug2Label: "Paracetamol (Product B)",
    severity: "severe",
    description: "Duplicate Paracetamol from two branded products can exceed 4g/day maximum dose, causing acute hepatotoxic liver failure.",
    recommendation: "Never take two Paracetamol-containing products simultaneously. Choose one product at correct dose.",
  },
  {
    pattern1: /insulin|novomix|lantus|basaglar|humalog|novorapid/i,
    pattern2: /metformin|glycomet|glucophage/i,
    drug1Label: "Insulin",
    drug2Label: "Metformin",
    severity: "mild",
    description: "Combination is widely used in Type 2 Diabetes management but requires calibrated blood glucose monitoring to avoid hypoglycemia.",
    recommendation: "Standard co-therapy — monitor blood glucose fasting/post-meal. Report symptoms of hypoglycemia (sweating, tremors) immediately.",
  },
  {
    pattern1: /lisinopril|ramipril|enalapril|cardace|olmesartan|telmisartan|losartan/i,
    pattern2: /potassium|spironolactone|eplerenone|triamterene/i,
    drug1Label: "ACE Inhibitor / ARB (Antihypertensive)",
    drug2Label: "Potassium / Potassium-Sparing Diuretic",
    severity: "severe",
    description: "Concurrent use causes dangerous hyperkalemia (elevated serum potassium) which can trigger fatal cardiac arrhythmia.",
    recommendation: "Monitor serum electrolytes every 4 weeks. Avoid combined use unless closely supervised by a cardiologist.",
  },
  {
    pattern1: /doxycycline|vibramycin|tetracycline/i,
    pattern2: /antacid|gelusil|digene|calcium|iron|milk|dairy/i,
    drug1Label: "Doxycycline / Tetracycline (Antibiotic)",
    drug2Label: "Antacid / Calcium / Dairy",
    severity: "moderate",
    description: "Calcium and magnesium ions in antacids chelate Doxycycline molecules, reducing antibiotic bioavailability by up to 70%.",
    recommendation: "Take Doxycycline 2 hours BEFORE or 4 hours AFTER any antacid, dairy, or calcium supplements.",
  },
  {
    pattern1: /sildenafil|viagra|tadalafil|cialis|vardenafil|levitra|manforce/i,
    pattern2: /nitrate|nitroglycerine|isosorbide|sorbitrate|nitrocontin/i,
    drug1Label: "PDE5 Inhibitor (Sildenafil / Tadalafil)",
    drug2Label: "Nitrate (Cardiac Drug)",
    severity: "severe",
    description: "PDE5 inhibitors potentiate vasodilatory effect of nitrates causing profound, potentially fatal hypotension.",
    recommendation: "Absolute contraindication. These drugs should never be combined under any clinical circumstance.",
  },
];

export interface AllergyRule {
  allergenPattern: RegExp;
  drugPattern: RegExp;
  allergenLabel: string;
  drugLabel: string;
  severity: "high" | "moderate" | "low";
  reaction: string;
}

export const ALLERGY_RULES: AllergyRule[] = [
  {
    allergenPattern: /penicillin|amoxicillin|beta-lactam/i,
    drugPattern: /amoxicillin|augmentin|amoxyclav|ampicillin|cloxacillin|cephalexin|cefixime|monocef|cefix/i,
    allergenLabel: "Penicillin / Beta-Lactam",
    drugLabel: "Beta-Lactam Antibiotic",
    severity: "high",
    reaction: "Severe anaphylaxis, urticaria and angioedema risk. All beta-lactam antibiotics (penicillins & cephalosporins) are strictly contraindicated.",
  },
  {
    allergenPattern: /sulfa|sulfonamide|sulfur drug/i,
    drugPattern: /bactrim|septran|cotrimoxazole|sulfamethoxazole|trimethoprim|tmp-smx/i,
    allergenLabel: "Sulfonamide",
    drugLabel: "Sulfa Antibiotic (Bactrim/Septran)",
    severity: "high",
    reaction: "Stevens-Johnson Syndrome (SJS) and toxic epidermal necrolysis (TEN) risk. Strictly avoid all sulfa antibiotics.",
  },
  {
    allergenPattern: /nsaid|ibuprofen|aspirin|diclofenac/i,
    drugPattern: /ibuprofen|combiflam|diclofenac|naproxen|brufen|volini|voveran|aspirin|ecosprin/i,
    allergenLabel: "NSAID / Aspirin Hypersensitivity",
    drugLabel: "NSAID Analgesic",
    severity: "high",
    reaction: "Aspirin-exacerbated respiratory disease (AERD), severe bronchospasm, urticaria and anaphylaxis in NSAID-sensitive patients.",
  },
  {
    allergenPattern: /codeine|opioid|tramadol|morphine/i,
    drugPattern: /codeine|tramadol|ultracet|morphine|fentanyl|oxycodone|buprenorphine/i,
    allergenLabel: "Opioid / Narcotic",
    drugLabel: "Opioid Analgesic",
    severity: "moderate",
    reaction: "Opioid-induced histamine release causing pruritus, urticaria, and in severe cases anaphylactoid reactions.",
  },
  {
    allergenPattern: /contrast|iodine/i,
    drugPattern: /povidone|betadine|providone iodine|iodine/i,
    allergenLabel: "Iodine / Contrast Dye",
    drugLabel: "Iodine-containing Antiseptic / Product",
    severity: "moderate",
    reaction: "Contact dermatitis, urticaria and in rare cases systemic hypersensitivity from topical iodine exposure.",
  },
];

// ─────────────────────────────────────────────
// SYMPTOM → CONDITION MAP (Agent 6 & 9)
// ─────────────────────────────────────────────
export interface SymptomConditionMap {
  keywords: RegExp;
  condition: string;
  urgency: "critical" | "urgent" | "normal";
  medicineCategories: string[];
  equipment: string[];
  clinicalGuidance: string;
  emergencyAction: string;
  doctorSpecialty: string;
}

export const SYMPTOM_MAP: SymptomConditionMap[] = [
  {
    keywords: /chest pain|heart attack|cardiac arrest|left arm|arm pain|jaw pain|myocardial|angina|palpitation/i,
    condition: "Acute Coronary Syndrome / Cardiac Emergency",
    urgency: "critical",
    medicineCategories: ["Cardiac"],
    equipment: ["ICU Bed", "ECG Machine", "Defibrillator", "Oxygen Cylinder", "Ambulance"],
    clinicalGuidance: "Administer 325mg Aspirin immediately (chew, do not swallow). Keep patient still and calm. Avoid food or water.",
    emergencyAction: "🚨 CALL 108 NOW. Nearest CATH LAB hospital required immediately.",
    doctorSpecialty: "Cardiologist",
  },
  {
    keywords: /breathless|shortness of breath|dyspnea|sp02|oxygen|asthma attack|wheezing|cannot breathe|suffocating/i,
    condition: "Acute Respiratory Distress / Bronchospasm",
    urgency: "critical",
    medicineCategories: ["Respiratory"],
    equipment: ["Oxygen Cylinder", "Nebulizer", "Ventilator", "Pulse Oximeter"],
    clinicalGuidance: "Administer Salbutamol (Asthalin) nebulization immediately. Sit patient upright. Begin supplemental O₂ if SpO₂ below 94%.",
    emergencyAction: "🚨 Call 108. Proceed to nearest hospital with ventilator support.",
    doctorSpecialty: "Pulmonologist",
  },
  {
    keywords: /stroke|paralysis|face drooping|slurred speech|sudden weakness|arm weak|numb face|brain/i,
    condition: "Acute Ischaemic / Haemorrhagic Stroke",
    urgency: "critical",
    medicineCategories: ["Cardiac"],
    equipment: ["CT Scanner", "ICU Bed", "Ventilator", "Ambulance"],
    clinicalGuidance: "FAST test: Face drooping, Arm weakness, Speech slurred, Time to call 108. Lay flat, do not give food.",
    emergencyAction: "🚨 IMMEDIATE — Thrombolysis window is 3.5 hours. Call 108 now.",
    doctorSpecialty: "Neurologist",
  },
  {
    keywords: /diabetes|blood sugar|sugar high|hyperglycemia|diabetic|insulin|frequent urination|sweet urine|ketone/i,
    condition: "Hyperglycaemia / Diabetic Glycaemic Crisis",
    urgency: "urgent",
    medicineCategories: ["Diabetic"],
    equipment: ["Glucometer", "Insulin Pen", "Blood Lab"],
    clinicalGuidance: "Check blood glucose using glucometer immediately. If >300 mg/dL, administer rapid insulin as prescribed. Hydrate with water.",
    emergencyAction: "If unconscious or blood glucose >400 mg/dL, call 108 for IV dextrose or insulin management.",
    doctorSpecialty: "Endocrinologist",
  },
  {
    keywords: /low sugar|hypoglycemia|sugar low|dizzy|shaking|trembling|fainting|sweating heavily|unconscious/i,
    condition: "Hypoglycaemia (Low Blood Sugar Emergency)",
    urgency: "critical",
    medicineCategories: ["Diabetic"],
    equipment: ["Glucometer", "IV Dextrose", "Ambulance"],
    clinicalGuidance: "Give 15g fast-acting sugar immediately (glucose tablet, juice, 3 teaspoons sugar). Recheck glucose after 15 minutes.",
    emergencyAction: "🚨 If unconscious — Do NOT give oral sugar. Call 108 for IV Dextrose 25% infusion.",
    doctorSpecialty: "Endocrinologist",
  },
  {
    keywords: /stomach|acidity|acid reflux|gerd|heartburn|gastric|indigestion|ulcer|gastritis|burping/i,
    condition: "GERD / Gastric Hyperacidity & Peptic Ulcer",
    urgency: "normal",
    medicineCategories: ["Gastro"],
    equipment: ["Endoscopy Unit"],
    clinicalGuidance: "Take Pantoprazole (Pan 40) 30 minutes before meals. Avoid spicy food, carbonated drinks, caffeine, and lying down after meals.",
    emergencyAction: "If vomiting blood or severe black stools occur, visit emergency gastroenterology immediately.",
    doctorSpecialty: "Gastroenterologist",
  },
  {
    keywords: /blood pressure|hypertension|high bp|170|180|190|200|pulse high|headache and bp/i,
    condition: "Hypertensive Emergency / Elevated Blood Pressure",
    urgency: "urgent",
    medicineCategories: ["Cardiac"],
    equipment: ["BP Monitor", "ECG Machine"],
    clinicalGuidance: "Rest quietly in a calm environment. Take prescribed antihypertensive (Amlodipine/Telma). Avoid salt, caffeine, and stress.",
    emergencyAction: "If systolic BP >180 mmHg with severe headache or chest pain, proceed immediately to emergency.",
    doctorSpecialty: "Cardiologist",
  },
  {
    keywords: /fever|temperature|pyrexia|chills|body ache|headache|viral|flu|dengue|malaria|typhoid/i,
    condition: "Pyrexia / Viral Fever & Systemic Febrile Illness",
    urgency: "normal",
    medicineCategories: ["Analgesic", "General"],
    equipment: ["Thermometer", "Blood Lab"],
    clinicalGuidance: "Paracetamol 650mg (Dolo) every 4–6 hours after meals. Maintain 2–3L fluid intake daily. Complete rest.",
    emergencyAction: "If fever persists >3 days or exceeds 104°F, get CBC + Dengue NS1/Malaria blood tests.",
    doctorSpecialty: "General Physician",
  },
  {
    keywords: /cough|sore throat|tonsil|throat pain|infection|bacterial|pneumonia|sinusitis|cold/i,
    condition: "Acute Bacterial Upper Respiratory Tract Infection",
    urgency: "urgent",
    medicineCategories: ["Antibiotic", "Respiratory"],
    equipment: ["Nebulizer", "Oxygen Concentrator", "Pulse Oximeter"],
    clinicalGuidance: "Broad-spectrum antibiotics require a doctor's prescription. Complete full 5-day antibiotic course without stopping early.",
    emergencyAction: "If SpO₂ drops below 92% or breathing becomes laboured, seek immediate hospital care.",
    doctorSpecialty: "Pulmonologist",
  },
  {
    keywords: /skin rash|allergy|itching|hives|urticaria|eczema|psoriasis|dermatitis|acne/i,
    condition: "Allergic Skin Reaction / Dermatological Disorder",
    urgency: "normal",
    medicineCategories: ["Dermatology"],
    equipment: ["First Aid Kit"],
    clinicalGuidance: "Apply Hydrocortisone cream topically. Oral Cetirizine (10mg) for urticaria. Identify and avoid allergen trigger.",
    emergencyAction: "If swelling affects throat or face (anaphylaxis), call 108 and administer Adrenaline 0.3mg IM if available.",
    doctorSpecialty: "Dermatologist",
  },
  {
    keywords: /anxiety|depression|mental|stress|panic attack|insomnia|sleep|psych|bipolar/i,
    condition: "Mental Health & Psychiatric Wellness Concern",
    urgency: "normal",
    medicineCategories: ["Mental Health"],
    equipment: ["First Aid Kit"],
    clinicalGuidance: "Avoid self-medicating with psychiatric drugs. Consult a psychiatrist or clinical psychologist for proper diagnosis and management.",
    emergencyAction: "For acute suicidal ideation, call iCall helpline: 9152987821 or nearest district hospital psychiatric wing.",
    doctorSpecialty: "Psychiatrist",
  },
];

// ─────────────────────────────────────────────
// INSURANCE & SUBSIDY CATALOG (Agent 8)
// ─────────────────────────────────────────────
export interface SubsidyCatalogEntry {
  keywords: RegExp;
  medicineName: string;
  mrp: number;
  janAushadhiPrice: number;
  ayushmanCovered: boolean;
  coverageNote: string;
}

export const SUBSIDY_CATALOG: SubsidyCatalogEntry[] = [
  {
    keywords: /insulin|glargine|lantus|novomix|basaglar|humalog|novorapid/i,
    medicineName: "Insulin (Glargine / Rapid / Mixed)",
    mrp: 780, janAushadhiPrice: 130, ayushmanCovered: true,
    coverageNote: "Fully covered under PMJAY essential diabetes package at empanelled hospitals.",
  },
  {
    keywords: /atorvastatin|atorva|lipitor|statin/i,
    medicineName: "Atorvastatin 10mg (30 Tablets)",
    mrp: 290, janAushadhiPrice: 38, ayushmanCovered: true,
    coverageNote: "Generic available at all Jan Aushadhi Kendras. PMJAY covers surgical cardiac interventions.",
  },
  {
    keywords: /amoxicillin|augmentin|amoxyclav|clavam/i,
    medicineName: "Amoxicillin + Clavulanic Acid 625mg",
    mrp: 215, janAushadhiPrice: 54, ayushmanCovered: true,
    coverageNote: "Generic covered under PMBJP Jan Aushadhi scheme. 10% co-pay applicable.",
  },
  {
    keywords: /metformin|glycomet|glucophage|obimet/i,
    medicineName: "Metformin 500mg SR (60 Tablets)",
    mrp: 160, janAushadhiPrice: 24, ayushmanCovered: true,
    coverageNote: "Jan Aushadhi generic saves up to 85%. Available nationwide at PMBJP stores.",
  },
  {
    keywords: /pantoprazole|pan 40|pantocid|protonix/i,
    medicineName: "Pantoprazole 40mg (15 Tablets)",
    mrp: 87, janAushadhiPrice: 12, ayushmanCovered: false,
    coverageNote: "Available at Jan Aushadhi stores at ₹12. Not covered under PMJAY for outpatient use.",
  },
  {
    keywords: /dolo|paracetamol|crocin|calpol|p-500/i,
    medicineName: "Paracetamol 650mg (10 Tablets)",
    mrp: 30, janAushadhiPrice: 3, ayushmanCovered: false,
    coverageNote: "Inexpensive — Jan Aushadhi Kendra price saves 90%. OTC drug not under PMJAY outpatient.",
  },
  {
    keywords: /azithromycin|azithral|zithromax/i,
    medicineName: "Azithromycin 500mg (3 Tablets)",
    mrp: 98, janAushadhiPrice: 18, ayushmanCovered: true,
    coverageNote: "Jan Aushadhi generic saves 82%. Covered under PMJAY in-hospital antibiotic package.",
  },
  {
    keywords: /amlodipine|amlong|norvasc|novasc|stamlo/i,
    medicineName: "Amlodipine 5mg (30 Tablets)",
    mrp: 95, janAushadhiPrice: 14, ayushmanCovered: true,
    coverageNote: "Covered under PMJAY cardiac intervention package. Jan Aushadhi available widely.",
  },
  {
    keywords: /omeprazole|omez|losec|prilosec/i,
    medicineName: "Omeprazole 20mg (10 Capsules)",
    mrp: 56, janAushadhiPrice: 8, ayushmanCovered: false,
    coverageNote: "Jan Aushadhi generic saves 86%. Not covered under PMJAY for routine gastric use.",
  },
  {
    keywords: /chemotherapy|cancer|oncology|trastuzumab|rituximab|bevacizumab/i,
    medicineName: "Oncology Biologics (Cancer Therapy)",
    mrp: 85000, janAushadhiPrice: 0, ayushmanCovered: true,
    coverageNote: "PMJAY covers oncology surgeries and chemotherapy up to ₹5 lakh per family per year at empanelled cancer hospitals.",
  },
];

// ─────────────────────────────────────────────
// AMBULANCE FLEET DATA (Agent 7)
// ─────────────────────────────────────────────
export interface AmbulanceUnit {
  id: string;
  driverName: string;
  vehicleNo: string;
  type: string;
  ambulanceType: "ALS" | "BLS" | "NICU";
  hospital: string;
  baseCity: string;
  phone: string;
}

export const AMBULANCE_FLEET: AmbulanceUnit[] = [
  { id: "AMB-101", driverName: "Ramesh Kumar",   vehicleNo: "TN 01 AB 8842", type: "Advanced Life Support (ALS)",    ambulanceType: "ALS",  hospital: "Apollo Hospital Chennai",     baseCity: "Chennai",   phone: "+91 98401 11223" },
  { id: "AMB-102", driverName: "Suresh Babu",    vehicleNo: "TN 09 XY 5510", type: "Basic Life Support (BLS)",       ambulanceType: "BLS",  hospital: "Fortis Malar Hospital",        baseCity: "Chennai",   phone: "+91 98402 33445" },
  { id: "AMB-103", driverName: "Venkatesh S.",   vehicleNo: "TN 07 GH 1009", type: "Neonatal ICU Ambulance (NICU)",  ambulanceType: "NICU", hospital: "MIOT International",           baseCity: "Chennai",   phone: "+91 98403 55667" },
  { id: "AMB-201", driverName: "Arvind Sharma",  vehicleNo: "DL 04 CZ 1120", type: "Advanced Life Support (ALS)",    ambulanceType: "ALS",  hospital: "AIIMS Trauma Centre Delhi",    baseCity: "Delhi",     phone: "+91 98110 22334" },
  { id: "AMB-202", driverName: "Pradeep Singh",  vehicleNo: "DL 07 AA 3391", type: "Basic Life Support (BLS)",       ambulanceType: "BLS",  hospital: "Safdarjung Hospital Delhi",    baseCity: "Delhi",     phone: "+91 98110 55678" },
  { id: "AMB-301", driverName: "Ravi Gowda",     vehicleNo: "KA 05 MN 7781", type: "Advanced Life Support (ALS)",    ambulanceType: "ALS",  hospital: "Manipal Hospital Bengaluru",   baseCity: "Bengaluru", phone: "+91 99800 44321" },
  { id: "AMB-401", driverName: "Santosh Patil",  vehicleNo: "MH 12 DE 4490", type: "Advanced Life Support (ALS)",    ambulanceType: "ALS",  hospital: "Kokilaben Dhirubhai Ambani",   baseCity: "Mumbai",    phone: "+91 98201 33456" },
  { id: "AMB-501", driverName: "Deepak Reddy",   vehicleNo: "TS 09 GH 6621", type: "Basic Life Support (BLS)",       ambulanceType: "BLS",  hospital: "KIMS Hospital Hyderabad",      baseCity: "Hyderabad", phone: "+91 98480 22178" },
];

// ─────────────────────────────────────────────
// DOCTORS CATALOG (Agent 9)
// ─────────────────────────────────────────────
export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  experienceYears: number;
  rating: number;
  hospital: string;
  consultationFee: number;
  nextSlot: string;
  languages: string[];
  keywords: RegExp;
}

export const DOCTORS_CATALOG: DoctorProfile[] = [
  {
    id: "DOC-101", name: "Dr. K. Senthil Nathan", specialty: "Interventional Cardiologist",
    degree: "MD, DM (Cardiology) — AIIMS New Delhi", experienceYears: 18, rating: 4.9,
    hospital: "Apollo Hospitals, Chennai", consultationFee: 500, nextSlot: "Today at 04:30 PM",
    languages: ["English", "Tamil", "Hindi"],
    keywords: /heart|chest pain|cardiac|blood pressure|hypertension|palpitation|ecg|angioplasty|cath/i,
  },
  {
    id: "DOC-102", name: "Dr. Ananya Roy", specialty: "Pulmonologist & Respiratory Specialist",
    degree: "MD (Pulmonary Medicine) — PGI Chandigarh", experienceYears: 12, rating: 4.8,
    hospital: "Fortis Healthcare, Bengaluru", consultationFee: 450, nextSlot: "Today at 05:15 PM",
    languages: ["English", "Bengali", "Hindi"],
    keywords: /cough|breathing|asthma|bronchitis|pneumonia|lung|sputum|respiratory|inhaler|shortness/i,
  },
  {
    id: "DOC-103", name: "Dr. Rajesh Varma", specialty: "Endocrinologist & Diabetes Specialist",
    degree: "MD, DNB (Endocrinology) — CMC Vellore", experienceYears: 15, rating: 4.9,
    hospital: "Max Super Speciality, New Delhi", consultationFee: 600, nextSlot: "Tomorrow at 10:00 AM",
    languages: ["English", "Hindi", "Punjabi"],
    keywords: /diabetes|blood sugar|insulin|thyroid|hormone|endocrine|hba1c|glucose|weight gain|metformin/i,
  },
  {
    id: "DOC-104", name: "Dr. Priya Sundaram", specialty: "Gastroenterologist",
    degree: "DM (Gastroenterology) — JIPMER Puducherry", experienceYears: 10, rating: 4.7,
    hospital: "MIOT International, Chennai", consultationFee: 500, nextSlot: "Tomorrow at 12:00 PM",
    languages: ["English", "Tamil"],
    keywords: /stomach|acidity|gerd|gastric|ibs|ulcer|liver|hepatitis|nausea|constipation|diarrhea|bowel/i,
  },
  {
    id: "DOC-105", name: "Dr. Arun Mehta", specialty: "Neurologist",
    degree: "DM (Neurology) — NIMHANS Bengaluru", experienceYears: 14, rating: 4.8,
    hospital: "Kokilaben Hospital, Mumbai", consultationFee: 700, nextSlot: "Tomorrow at 11:30 AM",
    languages: ["English", "Hindi", "Marathi"],
    keywords: /stroke|paralysis|migraine|headache|seizure|epilepsy|brain|nerve|tremor|parkinson|dementia|alzheimer/i,
  },
  {
    id: "DOC-106", name: "Dr. Shalini Kapoor", specialty: "Dermatologist",
    degree: "MD (Dermatology) — MAMC New Delhi", experienceYears: 9, rating: 4.6,
    hospital: "Artemis Hospital, Gurugram", consultationFee: 400, nextSlot: "Today at 06:00 PM",
    languages: ["English", "Hindi"],
    keywords: /skin|rash|acne|eczema|psoriasis|itching|allergy|urticaria|hair loss|fungal|ringworm|dermatitis/i,
  },
  {
    id: "DOC-107", name: "Dr. Vivek Nair", specialty: "Psychiatrist & Mental Health",
    degree: "MD (Psychiatry) — NIMHANS Bengaluru", experienceYears: 11, rating: 4.8,
    hospital: "NIMHANS Bengaluru", consultationFee: 350, nextSlot: "Tomorrow at 02:00 PM",
    languages: ["English", "Malayalam", "Hindi"],
    keywords: /anxiety|depression|stress|mental|panic|insomnia|sleep|bipolar|schizophrenia|ptsd|ocd|phobia/i,
  },
  {
    id: "DOC-108", name: "Dr. Geeta Krishnamurthy", specialty: "General Physician",
    degree: "MBBS, MD (General Medicine) — Mysore University", experienceYears: 20, rating: 4.7,
    hospital: "Manipal Hospital, Bengaluru", consultationFee: 300, nextSlot: "Today at 03:00 PM",
    languages: ["English", "Kannada", "Tamil", "Hindi"],
    keywords: /fever|flu|cold|general|viral|infection|tired|fatigue|weakness|body ache|any/i,
  },
];

// ─────────────────────────────────────────────
// RARE DRUGS & CLINICAL TRIALS CATALOG (Agent 10)
// ─────────────────────────────────────────────
export interface RareDrugEntry {
  id: string;
  name: string;
  indication: string;
  rarityCategory: "Orphan Drug" | "Specialized Import (Form 12B)" | "Clinical Trial Access";
  availabilityStatus: "IMPORT_AVAILABLE" | "TRIAL_RECRUITING" | "LIMITED_STOCK";
  importingHub: string;
  estimatedLeadTimeDays: number;
  trialLocations: string[];
  approxCostINR: number;
  keywords: RegExp;
}

export const RARE_DRUGS_CATALOG: RareDrugEntry[] = [
  {
    id: "RARE-01", name: "Eculizumab 300mg (Soliris)",
    indication: "Paroxysmal Nocturnal Hemoglobinuria (PNH)",
    rarityCategory: "Orphan Drug", availabilityStatus: "IMPORT_AVAILABLE",
    importingHub: "Apollo Global Rare Drug Cell, Mumbai",
    estimatedLeadTimeDays: 5, approxCostINR: 145000,
    trialLocations: ["AIIMS New Delhi", "CMC Vellore"],
    keywords: /eculizumab|soliris|pnh|hemoglobinuria|complement/i,
  },
  {
    id: "RARE-02", name: "Nusinersen 12mg (Spinraza)",
    indication: "Spinal Muscular Atrophy (SMA Type 1 / 2)",
    rarityCategory: "Specialized Import (Form 12B)", availabilityStatus: "TRIAL_RECRUITING",
    importingHub: "CDSCO Approved Import Cell, Bengaluru",
    estimatedLeadTimeDays: 7, approxCostINR: 280000,
    trialLocations: ["NIMHANS Bengaluru", "PGIMER Chandigarh"],
    keywords: /nusinersen|spinraza|sma|spinal muscular atrophy|motor neuron/i,
  },
  {
    id: "RARE-03", name: "Pirfenidone 200mg (Esbriet)",
    indication: "Idiopathic Pulmonary Fibrosis (IPF)",
    rarityCategory: "Clinical Trial Access", availabilityStatus: "LIMITED_STOCK",
    importingHub: "Jan Aushadhi Rare Cell, Hyderabad",
    estimatedLeadTimeDays: 2, approxCostINR: 1200,
    trialLocations: ["Tata Memorial Hospital Mumbai", "AIIMS Delhi"],
    keywords: /pirfenidone|esbriet|pulmonary fibrosis|ipf|lung fibrosis/i,
  },
  {
    id: "RARE-04", name: "Imatinib 400mg (Gleevec)",
    indication: "Chronic Myeloid Leukaemia (CML) / GIST",
    rarityCategory: "Specialized Import (Form 12B)", availabilityStatus: "IMPORT_AVAILABLE",
    importingHub: "Tata Memorial Hospital Rare Drug Dept, Mumbai",
    estimatedLeadTimeDays: 3, approxCostINR: 2800,
    trialLocations: ["Tata Memorial Mumbai", "AIIMS New Delhi", "Kidwai Memorial Bengaluru"],
    keywords: /imatinib|gleevec|cml|leukemia|leukaemia|gist|bcr-abl|cancer/i,
  },
  {
    id: "RARE-05", name: "Nivolumab 100mg (Opdivo)",
    indication: "Advanced Non-Small Cell Lung Cancer / Melanoma (Immunotherapy)",
    rarityCategory: "Orphan Drug", availabilityStatus: "IMPORT_AVAILABLE",
    importingHub: "Apollo Cancer Centre, Hyderabad",
    estimatedLeadTimeDays: 4, approxCostINR: 72000,
    trialLocations: ["Tata Memorial Mumbai", "Apollo Cancer Chennai", "AIIMS Delhi"],
    keywords: /nivolumab|opdivo|immunotherapy|checkpoint|pd-1|lung cancer|melanoma|nsclc/i,
  },
  {
    id: "RARE-06", name: "Enzyme Replacement Therapy (ERT) — Alglucosidase",
    indication: "Pompe Disease (Glycogen Storage Disease Type II)",
    rarityCategory: "Orphan Drug", availabilityStatus: "TRIAL_RECRUITING",
    importingHub: "Sanofi Rare Disease Cell, Gurgaon",
    estimatedLeadTimeDays: 10, approxCostINR: 350000,
    trialLocations: ["CMC Vellore", "SGPGI Lucknow"],
    keywords: /pompe|glycogen storage|alglucosidase|myozyme|acid maltase|ert/i,
  },
];
