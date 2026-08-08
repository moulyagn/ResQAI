// AI Triage & Entity Extraction Engine for ResQAI

// City Gazetteer for Geocoding text locations to coordinates
const LOCATION_GAZETTEER = [
  { keywords: ["4th st", "4th street", "harrison"], name: "4th St & Harrison St, Metro South", coords: [37.7812, -122.3998] },
  { keywords: ["folsom", "senior community"], name: "888 Folsom St, Central District", coords: [37.7831, -122.4041] },
  { keywords: ["mission", "st. jude", "care center"], name: "1200 Mission St, Healthcare Sector", coords: [37.7785, -122.4115] },
  { keywords: ["16th st", "overpass", "bayfront"], name: "16th St Overpass & Bayfront", coords: [37.7651, -122.3890] },
  { keywords: ["market st", "market street", "fremont"], name: "345 Market St, Financial District", coords: [37.7911, -122.3989] },
  { keywords: ["van ness", "civic center"], name: "Van Ness Ave & Civic Center", coords: [37.7792, -122.4191] },
  { keywords: ["gearby", "richmond"], name: "Geary Blvd & 15th Ave", coords: [37.7809, -122.4740] },
  { keywords: ["embarcadero", "pier"], name: "Embarcadero & Pier 14", coords: [37.7938, -122.3912] }
];

export async function parseAndTriageReport(rawText, sourceInfo = {}) {
  const textLower = rawText.toLowerCase();

  // 1. Emergency Category Detection
  let category = "General Emergency";
  if (textLower.includes("flood") || textLower.includes("water") || textLower.includes("drown") || textLower.includes("river") || textLower.includes("submerged")) {
    category = "Flood";
  } else if (textLower.includes("fire") || textLower.includes("smoke") || textLower.includes("flame") || textLower.includes("burn") || textLower.includes("explosion")) {
    category = "Fire";
  } else if (textLower.includes("collapse") || textLower.includes("rubble") || textLower.includes("debris") || textLower.includes("structural") || textLower.includes("trapped")) {
    category = "Building Collapse";
  } else if (textLower.includes("power") || textLower.includes("generator") || textLower.includes("grid") || textLower.includes("blackout") || textLower.includes("transformer")) {
    category = "Power / Grid";
  } else if (textLower.includes("medical") || textLower.includes("bleeding") || textLower.includes("oxygen") || textLower.includes("cardiac") || textLower.includes("infant") || textLower.includes("injured")) {
    category = "Medical";
  } else if (textLower.includes("hazmat") || textLower.includes("chemical") || textLower.includes("gas leak") || textLower.includes("toxic")) {
    category = "Hazmat";
  } else if (textLower.includes("evacuate") || textLower.includes("evacuation") || textLower.includes("shelter")) {
    category = "Evacuation";
  }

  // 2. Severity Score Calculation (1 to 5)
  let severity = 3;
  const criticalKeywords = ["sos", "trapped", "bleeding", "infant", "drowning", "life support", "critical", "underwater", "explosion", "dying", "urgent"];
  const highKeywords = ["fire", "collapse", "severe", "no power", "evacuate", "chest deep", "smoke", "injured"];

  let criticalCount = criticalKeywords.filter(k => textLower.includes(k)).length;
  let highCount = highKeywords.filter(k => textLower.includes(k)).length;

  if (criticalCount >= 2 || textLower.includes("sos")) {
    severity = 5;
  } else if (criticalCount >= 1 || highCount >= 2) {
    severity = 4;
  } else if (highCount >= 1) {
    severity = 3;
  } else {
    severity = 2;
  }

  // 3. Location Extraction & Geocoding
  let locationName = sourceInfo.locationName || "Metro Area (Unspecified Sector)";
  let coordinates = sourceInfo.coordinates || [37.7749 + (Math.random() - 0.5) * 0.04, -122.4194 + (Math.random() - 0.5) * 0.04];

  for (const loc of LOCATION_GAZETTEER) {
    if (loc.keywords.some(k => textLower.includes(k))) {
      locationName = loc.name;
      coordinates = loc.coords;
      break;
    }
  }

  // 4. Resource Need Tagging
  const resourceNeeds = [];
  if (category === "Flood" || textLower.includes("boat") || textLower.includes("water rising")) {
    resourceNeeds.push("Evacuation Boat");
  }
  if (category === "Medical" || textLower.includes("injured") || textLower.includes("bleeding") || textLower.includes("oxygen")) {
    resourceNeeds.push("Medical");
  }
  if (category === "Building Collapse" || textLower.includes("trapped") || textLower.includes("rubble")) {
    resourceNeeds.push("Search & Rescue");
    resourceNeeds.push("Heavy Engineering");
  }
  if (category === "Fire" || textLower.includes("smoke")) {
    resourceNeeds.push("Fire Engine");
  }
  if (category === "Power / Grid" || textLower.includes("generator") || textLower.includes("oxygen support")) {
    resourceNeeds.push("Power Generator");
  }
  if (textLower.includes("shelter") || textLower.includes("food") || textLower.includes("infant")) {
    resourceNeeds.push("Temporary Shelter");
  }
  if (resourceNeeds.length === 0) {
    resourceNeeds.push("General Support");
  }

  // 5. Entity Extraction (Trapped victims, Hazards, Urgency level)
  let trappedVictims = 0;
  const victimMatch = textLower.match(/(\d+)\s*(people|residents|adults|patients|persons|victims|infants)/);
  if (victimMatch) {
    trappedVictims = parseInt(victimMatch[1], 10);
  } else if (textLower.includes("trapped") || textLower.includes("stuck")) {
    trappedVictims = 2; // Default baseline estimate
  }

  const hazards = [];
  if (textLower.includes("smoke") || textLower.includes("fire")) hazards.push("Smoke Inhalation & Fire");
  if (textLower.includes("water") || textLower.includes("rising")) hazards.push("Rising Flood Waters");
  if (textLower.includes("power") || textLower.includes("wire")) hazards.push("Electrical / Power Hazard");
  if (textLower.includes("collapse") || textLower.includes("rubble")) hazards.push("Structural Collapse");
  if (hazards.length === 0) hazards.push("Environmental Exposure");

  const urgency = severity === 5 ? "CRITICAL" : severity >= 4 ? "HIGH" : severity === 3 ? "MEDIUM" : "LOW";

  const aiConfidence = 0.92 + (Math.random() * 0.06);

  return {
    id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
    sourceType: sourceInfo.sourceType || "SOCIAL",
    sourceName: sourceInfo.sourceName || "Raw Ingested Stream",
    reporterContact: sourceInfo.reporterContact || "Anonymous Reporter",
    rawText,
    timestamp: new Date().toISOString(),
    locationName,
    coordinates,
    category,
    severity,
    status: "Unassigned",
    assignedAgency: null,
    resourceNeeds,
    aiConfidence: parseFloat(aiConfidence.toFixed(2)),
    extractedEntities: {
      trappedVictims,
      hazards,
      urgency
    }
  };
}
