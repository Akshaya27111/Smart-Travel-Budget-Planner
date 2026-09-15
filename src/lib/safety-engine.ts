import { SafetyCheckResult, SafetyAdvisory } from "@/types";

interface SafetyParams {
  destination: string;
  stops?: string[];
  travelers?: number;
  hasNightTransit?: boolean;
}

export function evaluateTripSafety(params: SafetyParams): SafetyCheckResult {
  const city = params.destination?.trim() || "Selected Destination";
  const travelers = params.travelers || 1;
  const isSolo = travelers === 1;

  const advisories: SafetyAdvisory[] = [];

  // 1. Late-Night Transit Warning
  advisories.push({
    id: "adv-night-transit",
    level: "warning",
    title: "Late-Night Transit Window (After 10:30 PM)",
    message:
      `Metro lines and regular state bus services in ${city} generally cease operations between 10:30 PM and 11:00 PM. Routes scheduled past this hour face reduced public transit options.`,
    suggestedAction:
      "Pre-book verified app-based rides (Ola/Uber) or airport pre-paid taxis with GPS live-tracking rather than hailing unmetered street autos or walking alone through unfamiliar alleys.",
    estimatedExtraCost: 180,
    appliesTo: "Night return to hotel / late dinner hops",
  });

  // 2. Solo Traveler Precaution
  if (isSolo) {
    advisories.push({
      id: "adv-solo-traveler",
      level: "info",
      title: "Solo Traveler Neighborhood Advisory",
      message:
        `For solo travelers visiting ${city}, select accommodations with 24/7 front desk security in well-lit, vibrant commercial corridors rather than remote secluded perimeters.`,
      suggestedAction:
        "Share your live WhatsApp trip location with a trusted friend and keep power bank charged for GPS navigation.",
      estimatedExtraCost: 0,
      appliesTo: "Accommodation check-in & transit",
    });
  }

  // 3. Daylight Sightseeing Window
  advisories.push({
    id: "adv-daylight",
    level: "info",
    title: "Optimal Sightseeing Hours",
    message:
      `Major heritage monuments, public gardens, and cultural museums in ${city} have entry gates closing between 5:00 PM and 6:00 PM.`,
    suggestedAction:
      "Schedule outdoor photography, botanical parks, and historical palace visits between 9:00 AM and 4:30 PM, reserving evening hours for vibrant bazaars and cafes.",
    appliesTo: "Daytime sightseeing hops",
  });

  // Emergency Numbers
  const emergencyContacts = [
    { service: "National Emergency Unified Response", number: "112" },
    { service: "Women Helpline (All India)", number: "1091" },
    { service: "Indian Railway Security & Medical", number: "139" },
    { service: "Emergency Ambulance & Medical Response", number: "108" },
  ];

  // City-specific safe neighborhood tips
  const safeNeighborhoodTips = [
    "Opt for registered homestays or 3+ star hotels along main arterial roads.",
    "Always verify driver and vehicle registration number before boarding cabs at railway stations.",
    "Keep emergency offline maps (Google Maps / Citymapper) downloaded on your smartphone.",
  ];

  return {
    safetyRating: 8.9,
    nightTravelFlag: true,
    advisories,
    emergencyContacts,
    safeNeighborhoodTips,
  };
}
