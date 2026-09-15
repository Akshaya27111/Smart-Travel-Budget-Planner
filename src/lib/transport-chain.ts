import { TransportHop, TransportChain, TransportMode, ModeOption } from "@/types";

interface BuildChainParams {
  stops: string[];
  travelers: number;
  hotelName?: string;
  defaultModes?: Record<string, TransportMode>;
}

/**
 * Deterministic distance calculator between two named stops
 */
function estimateDistanceKm(from: string, to: string, index: number): number {
  if (from.toLowerCase().includes("hotel") || to.toLowerCase().includes("hotel")) {
    return 5.5 + (index % 3) * 1.5; // 5.5km - 8.5km from/to hotel
  }
  // Intra-city hop between adjacent attractions
  const base = 3.2 + ((from.length + to.length) % 5) * 1.1;
  return Math.round(base * 10) / 10;
}

/**
 * Calculates mode options for a given hop and group size
 */
export function calculateHopOptions(
  from: string,
  to: string,
  distanceKm: number,
  travelers: number
): ModeOption[] {
  const t = Math.max(1, travelers);

  // 1. Walk
  const walkDuration = Math.round(distanceKm * 13);
  const walkOption: ModeOption = {
    mode: "Walk",
    cost: 0,
    durationMins: walkDuration,
    recommended: distanceKm <= 1.2,
    savingsNote: distanceKm <= 1.2 ? "Zero cost & healthy short stroll" : undefined,
  };

  // 2. Metro (₹25 - ₹45 per person)
  const metroPerPerson = distanceKm <= 4 ? 25 : distanceKm <= 9 ? 35 : 50;
  const metroTotal = metroPerPerson * t;
  const metroDuration = Math.round(distanceKm * 3.5 + 8); // fast transit + 8m station walk
  const metroOption: ModeOption = {
    mode: "Metro",
    cost: metroTotal,
    durationMins: metroDuration,
    recommended: t <= 2 && distanceKm >= 3,
    savingsNote: t <= 2 ? `₹${metroPerPerson}/person (Traffic-free)` : undefined,
  };

  // 3. Local Bus (₹15 - ₹25 per person)
  const busPerPerson = distanceKm <= 5 ? 15 : 25;
  const busTotal = busPerPerson * t;
  const busDuration = Math.round(distanceKm * 5.5 + 10);
  const busOption: ModeOption = {
    mode: "Bus",
    cost: busTotal,
    durationMins: busDuration,
    savingsNote: `₹${busPerPerson}/person (Cheapest public option)`,
  };

  // 4. Bike Taxi / Rapido (1 rider per bike)
  const singleBikeCost = Math.round(25 + distanceKm * 12);
  const bikeTotal = singleBikeCost * t;
  const bikeDuration = Math.round(distanceKm * 3.2);
  const bikeOption: ModeOption = {
    mode: "Bike",
    cost: bikeTotal,
    durationMins: bikeDuration,
    recommended: t === 1,
    savingsNote: t === 1 ? "Fastest single-rider commute in traffic" : `${t} bikes needed`,
  };

  // 5. Auto Rickshaw (up to 3 people per auto)
  const autosNeeded = Math.ceil(t / 3);
  const singleAutoCost = Math.round(35 + distanceKm * 16);
  const autoTotal = singleAutoCost * autosNeeded;
  const autoDuration = Math.round(distanceKm * 4.0);
  const autoOption: ModeOption = {
    mode: "Auto",
    cost: autoTotal,
    durationMins: autoDuration,
    recommended: t === 2 || t === 3,
    savingsNote: autosNeeded > 1 ? `${autosNeeded} autos needed (₹${singleAutoCost} each)` : "Direct door-to-door",
  };

  // 6. Cab / Taxi (seats up to 4, 1.5x for 5-6 SUV, or 2 cabs)
  const cabsNeeded = Math.ceil(t / 4);
  const singleCabCost = Math.round(110 + distanceKm * 24);
  const cabTotal = singleCabCost * cabsNeeded;
  const cabDuration = Math.round(distanceKm * 3.8);
  const cabPerPerson = Math.round(cabTotal / t);

  const isCabBestValueForGroup = t >= 4 && cabTotal < autoTotal;
  const cabOption: ModeOption = {
    mode: "Cab",
    cost: cabTotal,
    durationMins: cabDuration,
    recommended: isCabBestValueForGroup || (t >= 3 && distanceKm > 8),
    savingsNote: isCabBestValueForGroup
      ? `Best for group! ₹${cabPerPerson}/person (AC & shared comfort)`
      : `₹${cabPerPerson}/person`,
  };

  return [metroOption, busOption, autoOption, bikeOption, cabOption, walkOption];
}

/**
 * Builds an intra-city transport chain from a sequence of selected places.
 * Default flow: Hotel -> Stop 1 -> Stop 2 -> ... -> Hotel
 */
export function buildTransportChain({
  stops,
  travelers,
  hotelName = "Hotel Stay",
  defaultModes = {},
}: BuildChainParams): TransportChain {
  const t = Math.max(1, travelers);

  // If no custom stops are provided, provide an inspiring default 3-stop itinerary
  const validStops = stops && stops.length > 0 ? stops : ["Central Landmark", "Heritage Market"];

  // Ensure loop begins and ends at Hotel
  const fullRoute = [hotelName, ...validStops, hotelName];

  const hops: TransportHop[] = [];
  let totalCost = 0;
  let totalDistanceKm = 0;

  for (let i = 0; i < fullRoute.length - 1; i++) {
    const from = fullRoute[i];
    const to = fullRoute[i + 1];
    const hopId = `hop-${i}-${from.slice(0, 4)}-${to.slice(0, 4)}`;
    const distanceKm = estimateDistanceKm(from, to, i);
    totalDistanceKm += distanceKm;

    const options = calculateHopOptions(from, to, distanceKm, t);

    // Pick recommended or user-chosen mode
    const defaultMode = defaultModes[hopId];
    let selectedMode: TransportMode = defaultMode || "Auto";

    if (!defaultMode) {
      const rec = options.find((o) => o.recommended);
      if (rec) {
        selectedMode = rec.mode;
      } else if (t >= 4) {
        selectedMode = "Cab";
      } else if (t === 1) {
        selectedMode = "Bike";
      } else {
        selectedMode = "Auto";
      }
    }

    const chosenOption = options.find((o) => o.mode === selectedMode) || options[0];
    totalCost += chosenOption.cost;

    hops.push({
      id: hopId,
      from,
      to,
      distanceKm,
      selectedMode,
      options,
    });
  }

  // Calculate Group Advice & Potential Savings
  let groupAdvice: string | undefined;
  let groupSavings: number | undefined;

  if (t >= 4) {
    // Compare Cabs vs Multiple Autos
    const totalAutoCost = hops.reduce((sum, h) => {
      const autoOpt = h.options.find((o) => o.mode === "Auto");
      return sum + (autoOpt ? autoOpt.cost : 0);
    }, 0);

    const totalCabCost = hops.reduce((sum, h) => {
      const cabOpt = h.options.find((o) => o.mode === "Cab");
      return sum + (cabOpt ? cabOpt.cost : 0);
    }, 0);

    if (totalCabCost < totalAutoCost) {
      groupSavings = totalAutoCost - totalCabCost;
      groupAdvice = `👥 For ${t} travelers, taking 1 shared Cab (₹${Math.round(
        totalCabCost / t
      )}/person) is ₹${groupSavings} cheaper than booking 2 separate Autos!`;
    }
  } else if (t === 2) {
    // Compare Metro vs Cab
    const totalCabCost = hops.reduce((sum, h) => {
      const cabOpt = h.options.find((o) => o.mode === "Cab");
      return sum + (cabOpt ? cabOpt.cost : 0);
    }, 0);
    const totalMetroCost = hops.reduce((sum, h) => {
      const metroOpt = h.options.find((o) => o.mode === "Metro");
      return sum + (metroOpt ? metroOpt.cost : 0);
    }, 0);
    const metroDiff = totalCabCost - totalMetroCost;
    if (metroDiff > 200) {
      groupAdvice = `💡 Using Metro for longer hops saves ₹${metroDiff} compared to cabs while bypassing traffic jams.`;
    }
  }

  return {
    hops,
    totalCost,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    groupAdvice,
    groupSavings,
  };
}
