// Pre-loaded realistic disaster scenarios for ResQAI demonstration

export const SCENARIOS = {
  HURRICANE_VANCE: {
    id: "HURRICANE_VANCE",
    name: "Hurricane Vance — Metro Coastal Strike",
    description: "Category 4 storm surge causing heavy urban flooding, downed grid lines, trapped victims, and structural damage across Metro Area.",
    center: [37.7749, -122.4194],
    initialReports: [
      {
        id: "REP-1001",
        sourceType: "SMS",
        sourceName: "Citizen Emergency SMS (911)",
        reporterContact: "+1 (555) 019-2834",
        rawText: "SOS! Water rising rapidly inside our living room on 4th Street near Harrison! 3 adults and 1 infant trapped on roof. Need evacuation boat urgently!",
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        locationName: "4th St & Harrison St, Metro South",
        coordinates: [37.7812, -122.3998],
        category: "Flood",
        severity: 5,
        status: "In Progress",
        assignedAgency: "Coast Guard Rescue",
        resourceNeeds: ["Evacuation Boat", "Medical", "Shelter"],
        extractedEntities: {
          trappedVictims: 4,
          hazards: ["Rising flood waters", "Hypothermia risk"],
          urgency: "CRITICAL"
        },
        clusterId: "CLS-901"
      },
      {
        id: "REP-1002",
        sourceType: "SOCIAL",
        sourceName: "@bay_watcher (X/Twitter)",
        reporterContact: "twitter.com/bay_watcher",
        rawText: "Heavy flooding at 4th and Harrison! Multiple families stuck on top of flooded SUVs. Water is chest-deep and moving fast! #HurricaneVance #Emergency",
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        locationName: "4th St & Harrison St, Metro South",
        coordinates: [37.7818, -122.3992],
        category: "Flood",
        severity: 5,
        status: "In Progress",
        assignedAgency: "Coast Guard Rescue",
        resourceNeeds: ["Evacuation Boat", "Search & Rescue"],
        extractedEntities: {
          trappedVictims: 8,
          hazards: ["Fast moving chest-deep currents"],
          urgency: "CRITICAL"
        },
        clusterId: "CLS-901"
      },
      {
        id: "REP-1003",
        sourceType: "FORM",
        sourceName: "Official Intake Form",
        reporterContact: "fire.station12@metro.gov",
        rawText: "High voltage transformer spark caused partial roof fire at Senior Community Center on Folsom St. Sprinklers active, heavy smoke reported. Elderly residents being evacuated to parking lot.",
        timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        locationName: "888 Folsom St, Central District",
        coordinates: [37.7831, -122.4041],
        category: "Fire",
        severity: 4,
        status: "Dispatched",
        assignedAgency: "Fire Brigade Alpha",
        resourceNeeds: ["Fire Engine", "Medical", "Temporary Shelter"],
        extractedEntities: {
          trappedVictims: 45,
          hazards: ["Heavy smoke inhalation", "Electrical fire"],
          urgency: "HIGH"
        },
        clusterId: "CLS-902"
      },
      {
        id: "REP-1004",
        sourceType: "SMS",
        sourceName: "Citizen SMS Dispatch",
        reporterContact: "+1 (555) 044-8891",
        rawText: "Power grid failure at St. Jude Care Center. Emergency generator failed! 12 patients on oxygen support require immediate power backup or transport!",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        locationName: "1200 Mission St, Healthcare Sector",
        coordinates: [37.7785, -122.4115],
        category: "Medical",
        severity: 5,
        status: "Unassigned",
        assignedAgency: null,
        resourceNeeds: ["Power Generator", "Ambulance Fleet", "Medical"],
        extractedEntities: {
          trappedVictims: 12,
          hazards: ["Life-support oxygen loss"],
          urgency: "CRITICAL"
        },
        clusterId: "CLS-903"
      },
      {
        id: "REP-1005",
        sourceType: "SOCIAL",
        sourceName: "@metro_grid_watch",
        reporterContact: "twitter.com/metro_grid_watch",
        rawText: "Major power lines down near 12th & Mission. Darkness and medical equipment failures reported at local clinic. Needs backup generators stat!",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        locationName: "Mission St & 12th St",
        coordinates: [37.7779, -122.4121],
        category: "Power / Grid",
        severity: 4,
        status: "Unassigned",
        assignedAgency: null,
        resourceNeeds: ["Power Generator", "Hazmat Containment"],
        extractedEntities: {
          trappedVictims: 0,
          hazards: ["Live downed high-voltage wires"],
          urgency: "HIGH"
        },
        clusterId: "CLS-903"
      },
      {
        id: "REP-1006",
        sourceType: "FORM",
        sourceName: "Civil Defense Warden",
        reporterContact: "warden.sector4@civildefense.org",
        rawText: "Bridge structural damage on 16th Street overpass due to barge collision in storm surge. Structural collapse risk high. Road blocked in both directions.",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        locationName: "16th St Overpass & Bayfront",
        coordinates: [37.7651, -122.3890],
        category: "Building Collapse",
        severity: 4,
        status: "Dispatched",
        assignedAgency: "Police Dept & Heavy Engineering",
        resourceNeeds: ["Heavy Engineering", "Police Barricades"],
        extractedEntities: {
          trappedVictims: 0,
          hazards: ["Structural collapse threat", "Traffic gridlock"],
          urgency: "HIGH"
        },
        clusterId: "CLS-904"
      }
    ]
  },
  EARTHQUAKE_GRID_FAIL: {
    id: "EARTHQUAKE_GRID_FAIL",
    name: "Downtown 6.8 Earthquake & Grid Crisis",
    description: "Major seismic event causing unreinforced masonry collapse, main water line ruptures, gas leaks, and multi-district fires.",
    center: [37.7850, -122.4080],
    initialReports: [
      {
        id: "REP-2001",
        sourceType: "SMS",
        sourceName: "Emergency 911 Text",
        reporterContact: "+1 (555) 911-3049",
        rawText: "Building collapse at 345 Market St! Historic brick facade collapsed onto sidewalk. 5 people trapped under rubble in parking structure below!",
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        locationName: "345 Market St, Financial District",
        coordinates: [37.7911, -122.3989],
        category: "Building Collapse",
        severity: 5,
        status: "Unassigned",
        assignedAgency: null,
        resourceNeeds: ["Heavy Rescue", "Medical", "Search K9"],
        extractedEntities: {
          trappedVictims: 5,
          hazards: ["Rubble collapse", "Gas leak smell"],
          urgency: "CRITICAL"
        },
        clusterId: "CLS-905"
      },
      {
        id: "REP-2002",
        sourceType: "SOCIAL",
        sourceName: "@sf_quake_alert",
        reporterContact: "twitter.com/sf_quake_alert",
        rawText: "Gas leak and secondary fire reported at Market & Fremont after facade collapse! Fire spreading quickly near high-rise entrance!",
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        locationName: "Market St & Fremont St",
        coordinates: [37.7905, -122.3978],
        category: "Fire",
        severity: 5,
        status: "Unassigned",
        assignedAgency: null,
        resourceNeeds: ["Fire Engine", "Hazmat Containment"],
        extractedEntities: {
          trappedVictims: 2,
          hazards: ["Ruptured gas main fire"],
          urgency: "CRITICAL"
        },
        clusterId: "CLS-905"
      }
    ]
  }
};
