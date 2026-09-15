import {
  TransportComparisonOption,
  TransportComparisonResult,
  IntercityTransportMode,
} from "@/types";

interface CompareParams {
  origin?: string;
  destination?: string;
  travelers: number;
}

/**
 * Deterministic distance heuristic between cities in kilometers
 */
function getIntercityDistanceKm(origin: string = "", destination: string = ""): number {
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();

  if ((o.includes("mumbai") && d.includes("goa")) || (o.includes("goa") && d.includes("mumbai"))) {
    return 590;
  }
  if ((o.includes("bangalore") && d.includes("goa")) || (o.includes("goa") && d.includes("bangalore"))) {
    return 560;
  }
  if ((o.includes("delhi") && d.includes("jaipur")) || (o.includes("jaipur") && d.includes("delhi"))) {
    return 280;
  }
  if ((o.includes("delhi") && d.includes("manali")) || (o.includes("manali") && d.includes("delhi"))) {
    return 535;
  }
  if ((o.includes("bangalore") && d.includes("kerala")) || (o.includes("kerala") && d.includes("bangalore"))) {
    return 480;
  }
  if ((o.includes("delhi") && d.includes("mumbai")) || (o.includes("mumbai") && d.includes("delhi"))) {
    return 1400;
  }

  // Generic reasonable distance based on string seed
  const seed = (origin.length * 7 + destination.length * 11) % 600;
  return 450 + seed;
}

export function compareIntercityTransport(params: CompareParams): TransportComparisonResult {
  const origin = params.origin?.trim() || "Starting City";
  const destination = params.destination?.trim() || "Destination";
  const travelers = Math.max(1, params.travelers || 1);
  const distanceKm = getIntercityDistanceKm(origin, destination);
  const vehiclesNeeded = Math.ceil(travelers / 4);

  // 1. Train Calculations (AC 3-Tier / Express / Vande Bharat)
  const trainBaseFare = Math.round(550 + distanceKm * 1.6);
  const trainTotalTicket = trainBaseFare * travelers;
  const trainDurationHours = Math.round((distanceKm / 65 + 1.5) * 10) / 10;
  // Railway stations are central, so city transit to hotel is low (approx ₹180 per cab/auto)
  const trainHotelTransfer = 180 * vehiclesNeeded;
  const trainBaggageCost = 0; // Free generous baggage allowance
  const trainOverallCost = trainTotalTicket + trainHotelTransfer + trainBaggageCost;
  const trainCostPerPerson = Math.round(trainOverallCost / travelers);

  // 2. Bus Calculations (AC Sleeper / Volvo Multi-Axle)
  const busBaseFare = Math.round(450 + distanceKm * 1.5);
  const busTotalTicket = busBaseFare * travelers;
  const busDurationHours = Math.round((distanceKm / 50 + 2.0) * 10) / 10;
  // Bus stands are central in most tier-1/tier-2 cities
  const busHotelTransfer = 150 * vehiclesNeeded;
  const busBaggageCost = 0;
  const busOverallCost = busTotalTicket + busHotelTransfer + busBaggageCost;
  const busCostPerPerson = Math.round(busOverallCost / travelers);

  // 3. Flight Calculations (Economy with 15kg check-in)
  // Distance penalty + airport surcharges
  const flightBaseFare = Math.round(Math.max(2800, 1800 + distanceKm * 2.8));
  const flightTotalTicket = flightBaseFare * travelers;
  // Flight airtime (1-2h) + airport check-in (2h) + security/baggage claim (1h)
  const flightDurationHours = Math.round((1.2 + distanceKm / 750 + 2.2) * 10) / 10;
  // Airports are far outside city centers (e.g., BLR is 35km, DEL is 18km -> ₹850 cab per vehicle)
  const flightHotelTransfer = 850 * vehiclesNeeded;
  const flightBaggageCost = 0;
  const flightOverallCost = flightTotalTicket + flightHotelTransfer + flightBaggageCost;
  const flightCostPerPerson = Math.round(flightOverallCost / travelers);

  // Determine Best Value mode
  // Train is best value if distance <= 750km or cost savings is significant
  let bestValueMode: IntercityTransportMode = "Train";
  if (busOverallCost < trainOverallCost && busDurationHours <= 10) {
    bestValueMode = "Bus";
  } else if (distanceKm > 1000) {
    bestValueMode = "Train"; // high comfort/cost ratio
  } else {
    bestValueMode = "Train";
  }

  const options: TransportComparisonOption[] = [
    {
      mode: "Train",
      icon: "🚆",
      name: "AC Express / Vande Bharat",
      ticketPerPerson: trainBaseFare,
      totalTicket: trainTotalTicket,
      durationHours: trainDurationHours,
      baggageCost: trainBaggageCost,
      hotelTransferCost: trainHotelTransfer,
      overallCost: trainOverallCost,
      costPerPerson: trainCostPerPerson,
      isBestValue: bestValueMode === "Train",
      savingsComparedToFlight: Math.max(0, flightOverallCost - trainOverallCost),
      tradeoffSummary: `Saves ₹${(flightOverallCost - trainOverallCost).toLocaleString("en-IN")} vs flight. Central station drop-off eliminates highway toll cabs.`,
    },
    {
      mode: "Bus",
      icon: "🚌",
      name: "AC Volvo Multi-Axle Sleeper",
      ticketPerPerson: busBaseFare,
      totalTicket: busTotalTicket,
      durationHours: busDurationHours,
      baggageCost: busBaggageCost,
      hotelTransferCost: busHotelTransfer,
      overallCost: busOverallCost,
      costPerPerson: busCostPerPerson,
      isBestValue: bestValueMode === "Bus",
      savingsComparedToFlight: Math.max(0, flightOverallCost - busOverallCost),
      tradeoffSummary: `Most budget-friendly option. Overnight sleeper saves one night of hotel tariff.`,
    },
    {
      mode: "Flight",
      icon: "✈️",
      name: "Economy Class Non-Stop",
      ticketPerPerson: flightBaseFare,
      totalTicket: flightTotalTicket,
      durationHours: flightDurationHours,
      baggageCost: flightBaggageCost,
      hotelTransferCost: flightHotelTransfer,
      overallCost: flightOverallCost,
      costPerPerson: flightCostPerPerson,
      isBestValue: false,
      savingsComparedToFlight: 0,
      tradeoffSummary: `Fastest transit (${flightDurationHours}h total with security). Higher total expense includes ₹${flightHotelTransfer} airport cab surcharge.`,
    },
  ];

  const maxSavings = Math.max(
    ...options.map((o) => o.savingsComparedToFlight)
  );

  return {
    origin,
    destination,
    travelers,
    options,
    bestValueMode,
    maxSavings,
  };
}
