import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────
const RINGS = [
  { id: 0, cls: "Faculty", designation: "The Council", color: "#E5E4E2", prefix: "0", rank: "—", slots: 1 },
  { id: 1, cls: "G-Class", designation: "The Surveyor", color: "#FFFFFF", prefix: "G", rank: "Ensign Spark", slots: 10 },
  { id: 2, cls: "F-Class", designation: "The Pilot", color: "#FF4500", prefix: "F", rank: "Pilot Spark", slots: 10 },
  { id: 3, cls: "E-Class", designation: "The Chief", color: "#FF00FF", prefix: "E", rank: "Chief Spark", slots: 10 },
  { id: 4, cls: "D-Class", designation: "The Operator", color: "#00FFFF", prefix: "D", rank: "Master Chief Spark", slots: 10 },
  { id: 5, cls: "C-Class", designation: "The Commander", color: "#7F00FF", prefix: "C", rank: "Commander Spark", slots: 10 },
  { id: 6, cls: "B-Class", designation: "The Captain", color: "#39FF14", prefix: "B", rank: "Captain Spark", slots: 10 },
  { id: 7, cls: "A-Class", designation: "The Admiral", color: "#FFD700", prefix: "A", rank: "Admiral Spark", slots: 10 },
  { id: 8, cls: "S-Class", designation: "The Entity", color: "#888888", prefix: "S", slots: 1 },
];

const GRADES = ["S", "A", "B", "C", "D", "F", "—"];
const GRADE_COLORS = { S: "#FFD700", A: "#39FF14", B: "#00FFFF", C: "#FF4500", D: "#FF00FF", F: "#FF2222", "—": "#444" };
const STATUSES = ["ACTIVE", "TESTING", "PROBATION", "DECOMMISSIONED", "VACANT"];
const STATUS_COLORS = { ACTIVE: "#39FF14", TESTING: "#00FFFF", PROBATION: "#FF4500", DECOMMISSIONED: "#FF2222", VACANT: "#333" };

const BUILD_KILL_TEMPLATE = {
  buildNotes: "", buildTime: "", killSwitch: "", freeViability: "", verdict: "", tested: false, testDate: "",
};

const DEFAULT_FLEET = [
  { id: "0-00", ring: 0, codeName: "THE COUNCIL", tool: "The Bridge", workSolution: "Administration", body: "/// ARCHIVE: SEALED.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-01", ring: 1, codeName: "ENSIGN SPARK", tool: "Identity", workSolution: "Identity Protocol", body: '"The Operator." The psychological OS.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-02", ring: 1, codeName: "THE SCOUT", tool: "Smartphone", workSolution: "Sensor Array", body: '"The Eyes." Weaponize your environment.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-03", ring: 1, codeName: "THE ORACLE", tool: "Gemini", workSolution: "AI Strategist", body: '"The Brain." Turn AI into a Senior Strategist.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-04", ring: 1, codeName: "THE RELAY", tool: "Gmail", workSolution: "Command Line", body: '"The Uplink." Initial connection.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-05", ring: 1, codeName: "THE TRAP", tool: "Google Forms", workSolution: "Signal Capture", body: '"The Hook." Capture attention.', grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-06", ring: 1, codeName: "THE OUTPOST", tool: "Google Voice", workSolution: "Territory Control", body: '"The Base." The Captain\'s Red Phone.', grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-07", ring: 1, codeName: "THE ANALYST", tool: "NotebookLM", workSolution: "Deep Dive Protocol", body: '"The Filter." Signal from noise.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-08", ring: 1, codeName: "THE ARCHIVE", tool: "Google Drive", workSolution: "Asset Vault", body: '"The Memory." Storing critical intel.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-09", ring: 1, codeName: "THE TELESCOPE", tool: "YouTube", workSolution: "Search Protocol", body: '"The Horizon." Long-range forecasting.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "G-10", ring: 1, codeName: "THE SPARK", tool: "Google Keep", workSolution: "Idea Capacitor", body: '"The Ignition." Raw energy.', grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-01", ring: 2, codeName: "PILOT SPARK", tool: "Identity", workSolution: "Revenue Command", body: '"Punch it." First revenue.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-02", ring: 2, codeName: "THE CARRIER", tool: "F-Class Ship", workSolution: "Heavy Logistics", body: "The heavy lifter for cargo.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-03", ring: 2, codeName: "THE SIGNAL", tool: "Shopify", workSolution: "Transaction Engine", body: "The core transaction engine.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-04", ring: 2, codeName: "THE FOUNDRY", tool: "Printful", workSolution: "On-Demand Mfg", body: "Just-in-time manufacturing.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-05", ring: 2, codeName: "THE VAULT", tool: "Stripe", workSolution: "Payment Processing", body: "Capital bridge and security.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-06", ring: 2, codeName: "THE PULSE", tool: "Klaviyo", workSolution: "Retention Engine", body: "Direct retention communication.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-07", ring: 2, codeName: "THE PROOF", tool: "Loox", workSolution: "Social Proof", body: "Social proof gravity.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-08", ring: 2, codeName: "THE SMS", tool: "PostScript", workSolution: "Mobile Messaging", body: "High-speed mobile frequency.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-09", ring: 2, codeName: "THE MARKET", tool: "TikTok Shop", workSolution: "Social Commerce", body: "Social bazaar commerce.", grade: "B", status: "TESTING", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "F-10", ring: 2, codeName: "THE CARGO", tool: "Kanban", workSolution: "Flow Management", body: "Visual flow and logistics.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-01", ring: 3, codeName: "CHIEF SPARK", tool: "Identity", workSolution: "The Voice", body: '"We are live." Signal at maximum.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-02", ring: 3, codeName: "THE RUNNER", tool: "E-Class Shuttle", workSolution: "Blockade Runner", body: '"Solar Sails." Fast. Hard to catch.', grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-03", ring: 3, codeName: "THE SCRIBE", tool: "Ghostwriter", workSolution: "Content Engine", body: '"Nuance & Tone."', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-04", ring: 3, codeName: "THE RADAR", tool: "Perplexity", workSolution: "Research Engine", body: '"The Source." Stop Googling.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-05", ring: 3, codeName: "THE MIC", tool: "Oasis", workSolution: "Voice Capture", body: '"The Input." Speak your truth.', grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-06", ring: 3, codeName: "THE ALCHEMY", tool: "Castmagic", workSolution: "Content Multiplier", body: '"The Multiplier." 1 to 10.', grade: "B", status: "TESTING", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-07", ring: 3, codeName: "THE PRESS", tool: "Beehiiv", workSolution: "Newsletter Engine", body: '"The Platform." Own your audience.', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-08", ring: 3, codeName: "THE CUTTER", tool: "Opus Clip", workSolution: "Clip Engine", body: '"The Viral Engine."', grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-09", ring: 3, codeName: "THE LENS", tool: "Midjourney", workSolution: "Visual Generator", body: '"The Illustrator." Text to World.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "E-10", ring: 3, codeName: "THE ASSET", tool: "IP Portfolio", workSolution: "Copyright Vault", body: '"The Copyright."', grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-01", ring: 4, codeName: "MASTER CHIEF SPARK", tool: "Identity", workSolution: "Systems Command", body: '"Systems green."', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-02", ring: 4, codeName: "THE DREADNOUGHT", tool: "D-Class Engine", workSolution: "Data Fortress", body: "High-load data fortress.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-03", ring: 4, codeName: "THE SYNAPSE", tool: "Make.com", workSolution: "Automation Engine", body: "The Titan's nervous system.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-04", ring: 4, codeName: "THE BRIDGE", tool: "Zapier", workSolution: "Integration Hub", body: "Universal tool integration.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-05", ring: 4, codeName: "THE MATRIX", tool: "Airtable", workSolution: "Relational Database", body: "The Radar of active operations.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-06", ring: 4, codeName: "THE RECORDER", tool: "Fireflies.AI", workSolution: "Meeting Intel", body: "Perfect meeting recall.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-07", ring: 4, codeName: "THE FOCUS", tool: "Flow Desktop", workSolution: "Signal Management", body: "Signal-to-noise management.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-08", ring: 4, codeName: "THE COMMS", tool: "Slack", workSolution: "Team Comms", body: "Internal crew coordination.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-09", ring: 4, codeName: "THE INTAKE", tool: "Tally", workSolution: "Data Collection", body: "Elegant data collection.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "D-10", ring: 4, codeName: "THE CHRONOS", tool: "Clockify", workSolution: "Time Auditing", body: "Time-spend auditing.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-01", ring: 5, codeName: "COMMANDER SPARK", tool: "Identity", workSolution: "Build Command", body: '"I\'ll build it myself."', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-02", ring: 5, codeName: "THE FRIGATE", tool: "C-Class Foundry", workSolution: "Fabrication Deck", body: "Agile fabrication deck.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-03", ring: 5, codeName: "THE ARCHITECT", tool: "Cursor", workSolution: "Code Engine", body: "AI-native code engineering.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-04", ring: 5, codeName: "THE CLOUD LAB", tool: "Replit", workSolution: "Cloud Dev", body: "Instant infrastructure.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-05", ring: 5, codeName: "THE INTERFACE", tool: "v0.dev", workSolution: "UI Generator", body: "Generative UI development.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-06", ring: 5, codeName: "THE CANVAS", tool: "Framer", workSolution: "Web Constructor", body: "High-fidelity web construction.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-07", ring: 5, codeName: "THE LEDGER", tool: "GitHub", workSolution: "Version Control", body: "Version control and IP history.", grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-08", ring: 5, codeName: "THE MEMORY", tool: "Pinecone", workSolution: "Vector Storage", body: "Long-term vector storage.", grade: "B", status: "TESTING", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-09", ring: 5, codeName: "THE STEEL", tool: "Python", workSolution: "Core Language", body: "The core build material.", grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "C-10", ring: 5, codeName: "THE CONNECTION", tool: "API Uplink", workSolution: "System Handshake", body: "Handshakes between worlds.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-01", ring: 6, codeName: "CAPTAIN SPARK", tool: "Identity", workSolution: "Scale Command", body: '"Make it so." The Spark Gap.', grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-02", ring: 6, codeName: "THE SUPERCARRIER", tool: "B-Class Carrier", workSolution: "Planetary Logistics", body: "Planetary scale vessel.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-03", ring: 6, codeName: "THE NETWORK", tool: "Meta Ads", workSolution: "Social Targeting", body: "Social targeting engines.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-04", ring: 6, codeName: "THE SEARCH", tool: "Google Ads", workSolution: "Intent Capture", body: "Intent-based capture.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-05", ring: 6, codeName: "THE VIRAL", tool: "TikTok Ads", workSolution: "Discovery Engine", body: "High-speed discovery.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-06", ring: 6, codeName: "THE TRUTH", tool: "Triple Whale", workSolution: "Attribution Dashboard", body: "Marketing attribution.", grade: "B", status: "TESTING", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-07", ring: 6, codeName: "THE STUDIO", tool: "Creative OS", workSolution: "Design Management", body: "Iterative design management.", grade: "C", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-08", ring: 6, codeName: "THE HOOK", tool: "The Offer", workSolution: "Value Engineering", body: "Unbeatable value engineering.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-09", ring: 6, codeName: "THE FUNNEL", tool: "Landing Page", workSolution: "Conversion Arch", body: "High-conversion sales.", grade: "B", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "B-10", ring: 6, codeName: "THE FUEL", tool: "The Budget", workSolution: "Financial Strategy", body: "Financial deployment.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-01", ring: 7, codeName: "THE TITAN", tool: "The Ship", workSolution: "Convergence Vessel", body: "All systems in one.", grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-02", ring: 7, codeName: "THE GPT", tool: "Custom GPTs", workSolution: "Specialized Agents", body: "Specialized AI agents.", grade: "A", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-03", ring: 7, codeName: "THE PROJECT", tool: "Claude Projects", workSolution: "Context Engine", body: "Deep context engineering.", grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-04", ring: 7, codeName: "THE LENS", tool: "Midjourney", workSolution: "World Builder", body: "Visual world-building.", grade: "S", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-05", ring: 7, codeName: "THE DIRECTOR", tool: "Runway", workSolution: "Video Generator", body: "AI video generation.", grade: "B", status: "TESTING", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-06", ring: 7, codeName: "THE BLACK BOX", tool: "[CLASSIFIED]", workSolution: "God-Mode", body: "Final integration layer.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-07", ring: 7, codeName: "[VACANT]", tool: "—", workSolution: "—", body: "Awaiting assignment.", grade: "—", status: "VACANT", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-08", ring: 7, codeName: "[VACANT]", tool: "—", workSolution: "—", body: "Awaiting assignment.", grade: "—", status: "VACANT", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-09", ring: 7, codeName: "[VACANT]", tool: "—", workSolution: "—", body: "Awaiting assignment.", grade: "—", status: "VACANT", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "A-10", ring: 7, codeName: "[VACANT]", tool: "—", workSolution: "—", body: "Awaiting assignment.", grade: "—", status: "VACANT", buildKill: { ...BUILD_KILL_TEMPLATE } },
  { id: "S-00", ring: 8, codeName: "THE ENTITY", tool: "[CLASSIFIED]", workSolution: "[CLASSIFIED]", body: "/// BEYOND THE EVENT HORIZON.", grade: "—", status: "ACTIVE", buildKill: { ...BUILD_KILL_TEMPLATE } },
];

const DEFAULT_RECRUITS = [
  { tool: "Recraft V3", category: "Visual", killSwitch: "No Commercial License on Free", suggestedRing: 3 },
  { tool: "Relume", category: "Architecture", killSwitch: "1-Page Limit", suggestedRing: 5 },
  { tool: "Napkin.ai", category: "Visual", killSwitch: "No SVG / Watermark", suggestedRing: 3 },
  { tool: "Bolt.new", category: "Code", killSwitch: "Token/Rate Limits", suggestedRing: 5 },
  { tool: "Suno", category: "Audio", killSwitch: "Audio Upload Lock", suggestedRing: 3 },
  { tool: "Kling 3.0", category: "Video", killSwitch: "5-Second Duration Cap", suggestedRing: 3 },
];

// ─── STORAGE (localStorage for production) ──────────────────────────
const storage = {
  get(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// ─── AUTH: Simple hash for captain password ─────────────────────────
// Change this hash to set your own password. Default: "makeitso"
// To generate: open browser console, run: btoa("yourpassword")
const CAPTAIN_HASH = "bWFrZWl0c28="; // base64 of "makeitso"

function checkPassword(input) {
  try { return btoa(input) === CAPTAIN_HASH; } catch { return false; }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
export default function FleetCommand() {
  const [fleet, setFleet] = useState(() => storage.get("n88n-fleet") || DEFAULT_FLEET);
  const [recruits, setRecruits] = useState(() => storage.get("n88n-recruits") || DEFAULT_RECRUITS);
  const [view, setView] = useState("overview");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedRing, setSelectedRing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showRecruit, setShowRecruit] = useState(false);
  const [newRecruit, setNewRecruit] = useState({ tool: "", category: "", killSwitch: "", suggestedRing: 1 });
  const [toast, setToast] = useState(null);
  const [swapMode, setSwapMode] = useState(false);
  const [swapSource, setSwapSource] = useState(null);

  // ─── CAPTAIN MODE AUTH ──────────────────────────────────────────
  const [isCaptain, setIsCaptain] = useState(() => {
    return storage.get("n88n-captain-auth") === true;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Check URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("captain") === "1" || params.get("mode") === "command") {
      if (!isCaptain) setShowLogin(true);
    }
  }, []);

  const handleLogin = () => {
    if (checkPassword(loginInput)) {
      setIsCaptain(true);
      storage.set("n88n-captain-auth", true);
      setShowLogin(false);
      setLoginInput("");
      setLoginError(false);
      showToastMsg("/// COMMAND MODE ACTIVATED. Welcome, Captain.");
    } else {
      setLoginError(true);
      setLoginInput("");
    }
  };

  const handleLogout = () => {
    setIsCaptain(false);
    storage.set("n88n-captain-auth", false);
    setSelectedCard(null);
    setEditMode(false);
    setSwapMode(false);
    showToastMsg("Command mode deactivated.");
  };

  // ─── PERSISTENCE ───────────────────────────────────────────────
  const save = useCallback((f, r) => {
    storage.set("n88n-fleet", f);
    storage.set("n88n-recruits", r);
  }, []);

  const showToastMsg = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const updateCard = (id, updates) => {
    if (!isCaptain) return;
    const nf = fleet.map(c => c.id === id ? { ...c, ...updates } : c);
    setFleet(nf);
    save(nf, recruits);
    if (selectedCard?.id === id) setSelectedCard({ ...selectedCard, ...updates });
  };

  const updateBuildKill = (id, updates) => {
    if (!isCaptain) return;
    const nf = fleet.map(c => c.id === id ? { ...c, buildKill: { ...c.buildKill, ...updates } } : c);
    setFleet(nf);
    save(nf, recruits);
    if (selectedCard?.id === id) setSelectedCard({ ...selectedCard, buildKill: { ...selectedCard.buildKill, ...updates } });
  };

  const onboardRecruit = (recruit, targetSlot) => {
    if (!isCaptain) return;
    const nf = fleet.map(c => c.id === targetSlot ? {
      ...c, tool: recruit.tool,
      codeName: recruit.tool.toUpperCase().replace(/[^A-Z0-9 ]/g, ""),
      workSolution: recruit.category,
      body: `Recruited from bench. Kill switch: ${recruit.killSwitch}`,
      status: "TESTING", grade: "—",
      buildKill: { ...BUILD_KILL_TEMPLATE, killSwitch: recruit.killSwitch }
    } : c);
    const nr = recruits.filter(r => r.tool !== recruit.tool);
    setFleet(nf); setRecruits(nr); save(nf, nr);
    showToastMsg(`${recruit.tool} onboarded to ${targetSlot}`);
  };

  const decommission = (id) => {
    if (!isCaptain) return;
    const card = fleet.find(c => c.id === id);
    if (!card || card.status === "VACANT") return;
    const nr = [...recruits, { tool: card.tool, category: card.workSolution, killSwitch: card.buildKill?.killSwitch || "", suggestedRing: card.ring }];
    const nf = fleet.map(c => c.id === id ? {
      ...c, codeName: "[VACANT]", tool: "—", workSolution: "—", body: "Awaiting assignment.",
      grade: "—", status: "VACANT", buildKill: { ...BUILD_KILL_TEMPLATE }
    } : c);
    setFleet(nf); setRecruits(nr); save(nf, nr);
    setSelectedCard(null);
    showToastMsg(`${card.tool} moved to bench`);
  };

  const swapCards = (id1, id2) => {
    if (!isCaptain) return;
    const c1 = fleet.find(c => c.id === id1);
    const c2 = fleet.find(c => c.id === id2);
    if (!c1 || !c2) return;
    const nf = fleet.map(c => {
      if (c.id === id1) return { ...c, codeName: c2.codeName, tool: c2.tool, workSolution: c2.workSolution, body: c2.body, grade: c2.grade, status: c2.status, buildKill: c2.buildKill };
      if (c.id === id2) return { ...c, codeName: c1.codeName, tool: c1.tool, workSolution: c1.workSolution, body: c1.body, grade: c1.grade, status: c1.status, buildKill: c1.buildKill };
      return c;
    });
    setFleet(nf); save(nf, recruits);
    setSwapMode(false); setSwapSource(null);
    showToastMsg(`Swapped ${c1.tool} \u2194 ${c2.tool}`);
  };

  const addRecruitToBench = () => {
    if (!isCaptain || !newRecruit.tool.trim()) return;
    const nr = [...recruits, { ...newRecruit }];
    setRecruits(nr); save(fleet, nr);
    setNewRecruit({ tool: "", category: "", killSwitch: "", suggestedRing: 1 });
    setShowRecruit(false);
    showToastMsg(`${newRecruit.tool} added to recruit bench`);
  };

  const removeFromBench = (tool) => {
    if (!isCaptain) return;
    const nr = recruits.filter(r => r.tool !== tool);
    setRecruits(nr); save(fleet, nr);
    showToastMsg(`${tool} removed from bench`);
  };

  const resetAll = () => {
    if (!isCaptain) return;
    setFleet(DEFAULT_FLEET); setRecruits(DEFAULT_RECRUITS);
    save(DEFAULT_FLEET, DEFAULT_RECRUITS);
    setSelectedCard(null);
    showToastMsg("Fleet reset to default manifest");
  };

  // ─── HELPERS ───────────────────────────────────────────────────
  const getRingCards = (ringId) => fleet.filter(c => c.ring === ringId);
  const getRingInfo = (ringId) => RINGS.find(r => r.id === ringId);

  const stats = {
    active: fleet.filter(c => c.status === "ACTIVE").length,
    testing: fleet.filter(c => c.status === "TESTING").length,
    vacant: fleet.filter(c => c.status === "VACANT").length,
    probation: fleet.filter(c => c.status === "PROBATION").length,
    decom: fleet.filter(c => c.status === "DECOMMISSIONED").length,
    gradeS: fleet.filter(c => c.grade === "S").length,
    gradeA: fleet.filter(c => c.grade === "A").length,
    bench: recruits.length,
  };

  // ─── STYLES ────────────────────────────────────────────────────
  const btnBase = { borderRadius: 3, cursor: "pointer", fontSize: 10, fontFamily: "inherit", letterSpacing: 1 };
  const inputBase = { background: "#161B22", border: "1px solid #30363D", borderRadius: 3, padding: "6px 10px", color: "#E6EDF3", fontSize: 11, fontFamily: "inherit", outline: "none" };
  const inputSmall = { ...inputBase, fontSize: 10 };
  const labelStyle = { display: "flex", flexDirection: "column", gap: 4 };
  const labelText = { fontSize: 9, color: "#8B949E" };

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div style={{ background: "#0A0E14", color: "#C9D1D9", minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0E14; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
        input, textarea, select { font-family: 'JetBrains Mono', monospace; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes scanline { 0% { background-position: 0 -100vh; } 100% { background-position: 0 100vh; } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 8px #39FF1430; } 50% { box-shadow: 0 0 20px #39FF1460; } }
      `}</style>

      {/* ─── LOGIN MODAL ────────────────────────────────────────── */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 6, padding: 32, width: 360, animation: "slideIn 0.2s ease" }}>
            <div style={{ fontSize: 10, color: "#484F58", letterSpacing: 3, marginBottom: 4 }}>N88N COMMAND</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#E6EDF3", marginBottom: 4 }}>/// AUTHORIZATION REQUIRED</div>
            <div style={{ fontSize: 10, color: "#8B949E", marginBottom: 20 }}>Enter command passphrase to unlock edit mode.</div>
            <input
              type="password"
              value={loginInput}
              onChange={e => { setLoginInput(e.target.value); setLoginError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Passphrase..."
              autoFocus
              style={{ ...inputBase, width: "100%", marginBottom: 12, borderColor: loginError ? "#FF2222" : "#30363D" }}
            />
            {loginError && <div style={{ fontSize: 9, color: "#FF2222", marginBottom: 8 }}>/// ACCESS DENIED. Invalid passphrase.</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleLogin} style={{ ...btnBase, flex: 1, background: "#39FF1420", border: "1px solid #39FF14", color: "#39FF14", padding: "8px 16px" }}>AUTHENTICATE</button>
              <button onClick={() => { setShowLogin(false); setLoginInput(""); setLoginError(false); }} style={{ ...btnBase, background: "transparent", border: "1px solid #30363D", color: "#8B949E", padding: "8px 16px" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ──────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, background: "#161B22", border: "1px solid #39FF14", color: "#39FF14", padding: "12px 20px", borderRadius: 4, zIndex: 9999, fontSize: 12, animation: "slideIn 0.3s ease", boxShadow: "0 0 20px rgba(57,255,20,0.15)" }}>
          {toast}
        </div>
      )}

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background: "#0D1117", borderBottom: "1px solid #21262D", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#484F58", letterSpacing: 3, marginBottom: 2 }}>
            N88N COMMAND {isCaptain && <span style={{ color: "#FFD700", marginLeft: 8 }}>\u26A1 CAPTAIN MODE</span>}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#E6EDF3", letterSpacing: 1 }}>/// FLEET COMMAND DASHBOARD</div>
          <div style={{ fontSize: 10, color: "#484F58", marginTop: 2 }}>
            v4.1 CANONICAL MANIFEST | {fleet.length} SLOTS | {stats.active} ACTIVE
            {!isCaptain && <span style={{ color: "#8B949E", marginLeft: 8 }}>| VIEW ONLY</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["overview", "FLEET"], ["bench", "BENCH"], ["protocol", "BUILD & KILL"]].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setSelectedCard(null); setSelectedRing(null); }} style={{
              ...btnBase, background: view === v ? "#21262D" : "transparent",
              border: `1px solid ${view === v ? "#58A6FF" : "#30363D"}`,
              color: view === v ? "#58A6FF" : "#8B949E", padding: "6px 14px",
              fontWeight: view === v ? 600 : 400
            }}>{label}</button>
          ))}
          {isCaptain ? (
            <>
              <button onClick={resetAll} style={{ ...btnBase, background: "transparent", border: "1px solid #30363D", color: "#484F58", padding: "6px 14px" }}>RESET</button>
              <button onClick={handleLogout} style={{ ...btnBase, background: "transparent", border: "1px solid #FF450040", color: "#FF4500", padding: "6px 14px" }}>LOCK</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ ...btnBase, background: "transparent", border: "1px solid #FFD70040", color: "#FFD700", padding: "6px 14px" }}>\u26A1 COMMAND</button>
          )}
        </div>
      </div>

      {/* ─── STATS BAR ──────────────────────────────────────────── */}
      <div style={{ background: "#0D1117", borderBottom: "1px solid #21262D", padding: "10px 24px", display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          ["ACTIVE", stats.active, "#39FF14"], ["TESTING", stats.testing, "#00FFFF"], ["PROBATION", stats.probation, "#FF4500"],
          ["VACANT", stats.vacant, "#484F58"], ["DECOM", stats.decom, "#FF2222"],
          ["S-GRADE", stats.gradeS, "#FFD700"], ["A-GRADE", stats.gradeA, "#39FF14"], ["BENCH", stats.bench, "#58A6FF"]
        ].map(([label, val, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}40` }} />
            <span style={{ fontSize: 10, color: "#8B949E" }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <div style={{ padding: 24, overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>

        {/* ═══ FLEET OVERVIEW ═══ */}
        {view === "overview" && !selectedCard && (
          <div>
            {swapMode && <div style={{ background: "#1C1200", border: "1px solid #FFD700", borderRadius: 4, padding: "10px 16px", marginBottom: 16, fontSize: 11, color: "#FFD700", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>/// SWAP MODE: Select target slot for {swapSource}</span>
              <button onClick={() => { setSwapMode(false); setSwapSource(null); }} style={{ ...btnBase, background: "#30363D", border: "none", color: "#C9D1D9", padding: "4px 10px" }}>CANCEL</button>
            </div>}

            {RINGS.map(ring => (
              <div key={ring.id} style={{ marginBottom: 20 }}>
                <div onClick={() => setSelectedRing(selectedRing === ring.id ? null : ring.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", background: "#161B22", borderRadius: 4, border: `1px solid ${selectedRing === ring.id ? ring.color + "80" : "#21262D"}`, marginBottom: 8, transition: "all 0.2s" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: ring.color, boxShadow: `0 0 8px ${ring.color}40` }} />
                  <span style={{ fontSize: 10, color: "#484F58", width: 50 }}>RING {ring.id}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: ring.color }}>{ring.cls}</span>
                  <span style={{ fontSize: 10, color: "#8B949E" }}>{ring.designation}</span>
                  <span style={{ fontSize: 10, color: "#484F58", marginLeft: "auto" }}>{ring.rank}</span>
                  <span style={{ fontSize: 10, color: "#484F58" }}>{getRingCards(ring.id).filter(c => c.status !== "VACANT").length}/{ring.slots}</span>
                </div>
                {(selectedRing === ring.id || selectedRing === null) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, paddingLeft: 4 }}>
                    {getRingCards(ring.id).map(card => (
                      <div key={card.id}
                        onClick={() => {
                          if (swapMode && swapSource !== card.id) { swapCards(swapSource, card.id); return; }
                          setSelectedCard(card); setEditMode(false);
                        }}
                        style={{
                          background: "#161B22", border: `1px solid ${card.status === "VACANT" ? "#21262D" : ring.color + "30"}`,
                          borderRadius: 4, padding: "10px 12px", cursor: "pointer",
                          opacity: card.status === "VACANT" ? 0.5 : card.status === "DECOMMISSIONED" ? 0.4 : 1,
                          transition: "all 0.15s", borderLeft: `3px solid ${card.status === "VACANT" ? "#21262D" : ring.color}`
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1C2128"}
                        onMouseLeave={e => e.currentTarget.style.background = "#161B22"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 9, color: "#484F58", fontWeight: 600 }}>{card.id}</span>
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            {card.buildKill?.tested && <span style={{ fontSize: 8, color: "#00FFFF", background: "#00FFFF15", padding: "1px 4px", borderRadius: 2 }}>TESTED</span>}
                            <span style={{ fontSize: 10, fontWeight: 700, color: GRADE_COLORS[card.grade] || "#444" }}>{card.grade}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#E6EDF3", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.codeName}</div>
                        <div style={{ fontSize: 9, color: ring.color, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.tool}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 8, color: "#8B949E" }}>{card.workSolution}</span>
                          <span style={{ fontSize: 8, color: STATUS_COLORS[card.status], fontWeight: 500 }}>{card.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══ CARD DETAIL ═══ */}
        {selectedCard && view === "overview" && (() => {
          const card = fleet.find(c => c.id === selectedCard.id) || selectedCard;
          const ring = getRingInfo(card.ring);
          return (
            <div style={{ animation: "slideIn 0.2s ease" }}>
              <button onClick={() => { setSelectedCard(null); setEditMode(false); }} style={{ ...btnBase, background: "transparent", border: "1px solid #30363D", color: "#8B949E", padding: "6px 14px", marginBottom: 16 }}>\u2190 BACK TO FLEET</button>

              <div style={{ background: "#161B22", border: `1px solid ${ring.color}40`, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ borderBottom: `2px solid ${ring.color}30`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#484F58", letterSpacing: 2, marginBottom: 4 }}>RING {card.ring} / {ring.cls} / {ring.designation}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#E6EDF3" }}>{card.id}: {card.codeName}</div>
                    <div style={{ fontSize: 13, color: ring.color, marginTop: 4 }}>{card.tool} \u2014 {card.workSolution}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: GRADE_COLORS[card.grade], lineHeight: 1 }}>{card.grade}</div>
                    <div style={{ fontSize: 9, color: STATUS_COLORS[card.status], marginTop: 4, fontWeight: 600 }}>{card.status}</div>
                  </div>
                </div>

                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 16, fontStyle: "italic" }}>{card.body}</div>

                  {/* Captain-only actions */}
                  {isCaptain && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                      <button onClick={() => setEditMode(!editMode)} style={{ ...btnBase, background: "#21262D", border: "1px solid #30363D", color: "#58A6FF", padding: "6px 14px" }}>{editMode ? "CLOSE EDITOR" : "EDIT"}</button>
                      <button onClick={() => { setSwapMode(true); setSwapSource(card.id); setSelectedCard(null); }} style={{ ...btnBase, background: "#21262D", border: "1px solid #30363D", color: "#FFD700", padding: "6px 14px" }}>SWAP / PROMOTE</button>
                      {card.status !== "VACANT" && <button onClick={() => decommission(card.id)} style={{ ...btnBase, background: "#21262D", border: "1px solid #FF222240", color: "#FF2222", padding: "6px 14px" }}>DECOMMISSION</button>}
                    </div>
                  )}

                  {/* Edit Panel (Captain only) */}
                  {editMode && isCaptain && (
                    <div style={{ background: "#0D1117", borderRadius: 4, padding: 16, marginBottom: 20, border: "1px solid #21262D" }}>
                      <div style={{ fontSize: 10, color: "#484F58", letterSpacing: 2, marginBottom: 12 }}>/// EDIT CARD</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {[["codeName", "CODE NAME"], ["tool", "TOOL"], ["workSolution", "WORK SOLUTION"]].map(([key, label]) => (
                          <label key={key} style={labelStyle}>
                            <span style={labelText}>{label}</span>
                            <input value={card[key]} onChange={e => updateCard(card.id, { [key]: e.target.value })} style={inputBase} />
                          </label>
                        ))}
                        <label style={labelStyle}>
                          <span style={labelText}>GRADE</span>
                          <select value={card.grade} onChange={e => updateCard(card.id, { grade: e.target.value })}
                            style={{ ...inputBase, color: GRADE_COLORS[card.grade] }}>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </label>
                        <label style={labelStyle}>
                          <span style={labelText}>STATUS</span>
                          <select value={card.status} onChange={e => updateCard(card.id, { status: e.target.value })}
                            style={{ ...inputBase, color: STATUS_COLORS[card.status] }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </label>
                      </div>
                      <label style={{ ...labelStyle, marginTop: 12 }}>
                        <span style={labelText}>BODY TEXT</span>
                        <textarea value={card.body} onChange={e => updateCard(card.id, { body: e.target.value })} rows={2} style={{ ...inputBase, resize: "vertical" }} />
                      </label>
                    </div>
                  )}

                  {/* BUILD & KILL Protocol (read-only for visitors, editable for captain) */}
                  <div style={{ background: "#0D1117", borderRadius: 4, padding: 16, border: "1px solid #21262D" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#FF4500", letterSpacing: 2, fontWeight: 600 }}>/// BUILD & KILL FIELD TEST</div>
                      {isCaptain && (
                        <button onClick={() => updateBuildKill(card.id, { tested: !card.buildKill?.tested, testDate: new Date().toISOString().slice(0, 10) })}
                          style={{ ...btnBase, fontSize: 9, background: card.buildKill?.tested ? "#39FF1420" : "#21262D",
                            border: `1px solid ${card.buildKill?.tested ? "#39FF14" : "#30363D"}`,
                            color: card.buildKill?.tested ? "#39FF14" : "#8B949E", padding: "4px 12px" }}>
                          {card.buildKill?.tested ? `TESTED ${card.buildKill.testDate}` : "MARK AS TESTED"}
                        </button>
                      )}
                      {!isCaptain && card.buildKill?.tested && (
                        <span style={{ fontSize: 9, color: "#39FF14" }}>TESTED {card.buildKill.testDate}</span>
                      )}
                    </div>

                    {isCaptain ? (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <label style={labelStyle}>
                            <span style={labelText}>BUILD NOTES</span>
                            <textarea value={card.buildKill?.buildNotes || ""} onChange={e => updateBuildKill(card.id, { buildNotes: e.target.value })} rows={3} placeholder="What did you build?" style={{ ...inputSmall, resize: "vertical" }} />
                          </label>
                          <label style={labelStyle}>
                            <span style={{ ...labelText, color: "#FF2222" }}>KILL SWITCH</span>
                            <textarea value={card.buildKill?.killSwitch || ""} onChange={e => updateBuildKill(card.id, { killSwitch: e.target.value })} rows={3} placeholder="Where did the free tier break?" style={{ ...inputSmall, resize: "vertical" }} />
                          </label>
                          <label style={labelStyle}>
                            <span style={{ ...labelText, color: "#FFD700" }}>FREE TIER VIABILITY</span>
                            <select value={card.buildKill?.freeViability || ""} onChange={e => updateBuildKill(card.id, { freeViability: e.target.value })} style={inputSmall}>
                              <option value="">Select...</option>
                              <option value="HIGH">HIGH \u2014 Fully usable free</option>
                              <option value="MEDIUM">MEDIUM \u2014 Demo/limited</option>
                              <option value="LOW">LOW \u2014 Must upgrade</option>
                              <option value="NONE">NONE \u2014 Unusable free</option>
                            </select>
                          </label>
                          <label style={labelStyle}>
                            <span style={labelText}>BUILD TIME</span>
                            <input value={card.buildKill?.buildTime || ""} onChange={e => updateBuildKill(card.id, { buildTime: e.target.value })} placeholder="e.g. 15 mins" style={inputSmall} />
                          </label>
                        </div>
                        <label style={{ ...labelStyle, marginTop: 12 }}>
                          <span style={labelText}>ADMIRAL'S VERDICT</span>
                          <textarea value={card.buildKill?.verdict || ""} onChange={e => updateBuildKill(card.id, { verdict: e.target.value })} rows={2} placeholder="Keep, upgrade, or kill?" style={{ ...inputSmall, resize: "vertical" }} />
                        </label>
                      </>
                    ) : (
                      /* Visitor: read-only Build & Kill data */
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[
                          ["BUILD NOTES", card.buildKill?.buildNotes, "#8B949E"],
                          ["KILL SWITCH", card.buildKill?.killSwitch, "#FF2222"],
                          ["FREE VIABILITY", card.buildKill?.freeViability || "—", "#FFD700"],
                          ["BUILD TIME", card.buildKill?.buildTime || "—", "#8B949E"],
                        ].map(([label, val, color]) => (
                          <div key={label}>
                            <div style={{ fontSize: 9, color, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 10, color: "#C9D1D9" }}>{val || "—"}</div>
                          </div>
                        ))}
                        {card.buildKill?.verdict && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: 9, color: "#8B949E", letterSpacing: 1, marginBottom: 4 }}>ADMIRAL'S VERDICT</div>
                            <div style={{ fontSize: 10, color: "#C9D1D9" }}>{card.buildKill.verdict}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ BENCH VIEW ═══ */}
        {view === "bench" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#E6EDF3" }}>/// RECRUIT BENCH</div>
                <div style={{ fontSize: 10, color: "#8B949E", marginTop: 2 }}>{recruits.length} solutions awaiting deployment</div>
              </div>
              {isCaptain && (
                <button onClick={() => setShowRecruit(!showRecruit)}
                  style={{ ...btnBase, background: "#21262D", border: "1px solid #58A6FF", color: "#58A6FF", padding: "8px 16px" }}>
                  + NEW RECRUIT
                </button>
              )}
            </div>

            {showRecruit && isCaptain && (
              <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 4, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "#484F58", letterSpacing: 2, marginBottom: 12 }}>/// ADD RECRUIT</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: 12, alignItems: "end" }}>
                  <label style={labelStyle}>
                    <span style={labelText}>TOOL NAME</span>
                    <input value={newRecruit.tool} onChange={e => setNewRecruit({ ...newRecruit, tool: e.target.value })} placeholder="e.g. Figma" style={{ ...inputBase, background: "#0D1117" }} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelText}>CATEGORY</span>
                    <input value={newRecruit.category} onChange={e => setNewRecruit({ ...newRecruit, category: e.target.value })} placeholder="Visual, Code..." style={{ ...inputBase, background: "#0D1117" }} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelText}>KILL SWITCH</span>
                    <input value={newRecruit.killSwitch} onChange={e => setNewRecruit({ ...newRecruit, killSwitch: e.target.value })} placeholder="Free tier limit" style={{ ...inputBase, background: "#0D1117" }} />
                  </label>
                  <button onClick={addRecruitToBench} style={{ ...btnBase, background: "#39FF1420", border: "1px solid #39FF14", color: "#39FF14", padding: "6px 14px", height: 32 }}>ADD</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
              {recruits.map((r, i) => {
                const targetRing = getRingInfo(r.suggestedRing);
                const vacantSlots = fleet.filter(c => c.ring === r.suggestedRing && c.status === "VACANT");
                return (
                  <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 4, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: targetRing?.color || "#444", boxShadow: `0 0 8px ${targetRing?.color || "#444"}40` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#E6EDF3" }}>{r.tool}</div>
                      <div style={{ fontSize: 9, color: "#8B949E" }}>{r.category} | Ring {r.suggestedRing} ({targetRing?.cls})</div>
                    </div>
                    <div style={{ fontSize: 9, color: "#FF4500", maxWidth: 200, textAlign: "right" }}>{r.killSwitch}</div>
                    {isCaptain && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {vacantSlots.length > 0 ? (
                          <select onChange={e => { if (e.target.value) onboardRecruit(r, e.target.value); }}
                            style={{ ...inputSmall, background: "#0D1117", borderColor: "#39FF14", color: "#39FF14", padding: "4px 8px", fontSize: 9 }}>
                            <option value="">DEPLOY TO...</option>
                            {vacantSlots.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                          </select>
                        ) : (
                          <span style={{ fontSize: 9, color: "#FF4500" }}>NO SLOTS</span>
                        )}
                        <button onClick={() => removeFromBench(r.tool)} style={{ ...btnBase, background: "transparent", border: "1px solid #FF222240", color: "#FF2222", padding: "4px 8px", fontSize: 9 }}>X</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {recruits.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#484F58", fontSize: 11 }}>/// BENCH CLEAR</div>}
            </div>
          </div>
        )}

        {/* ═══ BUILD & KILL PROTOCOL VIEW ═══ */}
        {view === "protocol" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FF4500", marginBottom: 4 }}>/// BUILD & KILL FIELD TEST PROTOCOL</div>
            <div style={{ fontSize: 10, color: "#8B949E", marginBottom: 20 }}>Push until the system breaks. Do not pay. Find the Kill Switch.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "TOTAL TESTED", value: fleet.filter(c => c.buildKill?.tested).length, color: "#00FFFF", total: fleet.length },
                { label: "HIGH VIABILITY", value: fleet.filter(c => c.buildKill?.freeViability === "HIGH").length, color: "#39FF14" },
                { label: "MUST UPGRADE", value: fleet.filter(c => c.buildKill?.freeViability === "LOW" || c.buildKill?.freeViability === "NONE").length, color: "#FF2222" },
                { label: "NEEDS TESTING", value: fleet.filter(c => !c.buildKill?.tested && c.status !== "VACANT").length, color: "#FFD700" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 4, padding: "14px 16px" }}>
                  <div style={{ fontSize: 9, color: "#484F58", letterSpacing: 2, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}{s.total ? <span style={{ fontSize: 12, color: "#484F58" }}>/{s.total}</span> : null}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: "#E6EDF3", marginBottom: 12 }}>UNTESTED FLEET</div>
            <div style={{ display: "grid", gap: 6 }}>
              {fleet.filter(c => !c.buildKill?.tested && c.status !== "VACANT" && c.tool !== "Identity" && c.tool !== "—").map(card => {
                const ring = getRingInfo(card.ring);
                return (
                  <div key={card.id} onClick={() => { setView("overview"); setSelectedCard(card); }}
                    style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 4, padding: "8px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = ring.color + "40"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#21262D"}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ring.color }} />
                    <span style={{ fontSize: 10, color: "#484F58", width: 40 }}>{card.id}</span>
                    <span style={{ fontSize: 11, color: "#E6EDF3", fontWeight: 500, flex: 1 }}>{card.tool}</span>
                    <span style={{ fontSize: 9, color: "#8B949E" }}>{card.workSolution}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: GRADE_COLORS[card.grade] }}>{card.grade}</span>
                  </div>
                );
              })}
            </div>

            {fleet.filter(c => c.buildKill?.tested).length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#39FF14", marginTop: 24, marginBottom: 12 }}>TESTED & CLEARED</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {fleet.filter(c => c.buildKill?.tested).map(card => {
                    const ring = getRingInfo(card.ring);
                    const viabColor = { HIGH: "#39FF14", MEDIUM: "#FFD700", LOW: "#FF4500", NONE: "#FF2222" }[card.buildKill?.freeViability] || "#484F58";
                    return (
                      <div key={card.id} onClick={() => { setView("overview"); setSelectedCard(card); }}
                        style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 4, padding: "8px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#39FF1440"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#21262D"}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: ring.color }} />
                        <span style={{ fontSize: 10, color: "#484F58", width: 40 }}>{card.id}</span>
                        <span style={{ fontSize: 11, color: "#E6EDF3", fontWeight: 500, flex: 1 }}>{card.tool}</span>
                        <span style={{ fontSize: 9, color: viabColor, fontWeight: 600 }}>{card.buildKill?.freeViability || "—"}</span>
                        <span style={{ fontSize: 9, color: "#484F58" }}>{card.buildKill?.testDate}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: GRADE_COLORS[card.grade] }}>{card.grade}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0D1117", borderTop: "1px solid #21262D", padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#484F58" }}>/// THE SPARK. THE BRIDGE. THE SYSTEM.</span>
        <span style={{ fontSize: 9, color: "#484F58" }}>N88N COMMAND \u00A9 2026 | n88n.academy</span>
      </div>
    </div>
  );
}
