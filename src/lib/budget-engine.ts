import {
  TravelStyle,
  TransportPreference,
  AccommodationPreference,
  FoodPreference,
  ActivityPreference,
  BudgetBreakdown,
} from "@/types";

export interface BudgetEstimationParams {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  travelStyle: TravelStyle;
  transportPreference: TransportPreference;
  accommodationPreference: AccommodationPreference;
  foodPreference: FoodPreference;
  activityPreference: ActivityPreference;
  maxBudget: number;
}

export interface BudgetCalculationResult {
  breakdown: BudgetBreakdown;
  totalEstimated: number;
  maxBudget: number;
  difference: number;
  isWithinBudget: boolean;
  utilizationPercentage: number;
  assumptions: string[];
}

export function estimateTripBudget(params: BudgetEstimationParams): BudgetCalculationResult {
  const {
    durationDays,
    travelers,
    travelStyle,
    transportPreference,
    accommodationPreference,
    foodPreference,
    activityPreference,
    maxBudget,
  } = params;

  const days = Math.max(durationDays, 1);
  const people = Math.max(travelers, 1);
  const nights = Math.max(days - 1, 1);
  const roomsNeeded = Math.ceil(people / 2);

  // Style multiplier
  const styleMultiplier = travelStyle === "Budget" ? 0.85 : travelStyle === "Premium" ? 1.5 : 1.0;

  // 1. Transportation cost calculation (round trip per person or vehicle)
  let baseTransportPerPerson = 2500;
  switch (transportPreference) {
    case "Flight":
      baseTransportPerPerson = 5000 * styleMultiplier;
      break;
    case "Train":
      baseTransportPerPerson = 1200 * styleMultiplier;
      break;
    case "Bus":
      baseTransportPerPerson = 800 * styleMultiplier;
      break;
    case "Car":
      // Fixed vehicle rental / fuel shared
      baseTransportPerPerson = Math.max((4000 * styleMultiplier) / people, 1000);
      break;
    case "Other":
      baseTransportPerPerson = 1500 * styleMultiplier;
      break;
  }
  const estimatedTransport = Math.round(baseTransportPerPerson * people);

  // 2. Accommodation cost calculation (per room per night)
  let baseRoomPerNight = 2500;
  switch (accommodationPreference) {
    case "Budget":
      baseRoomPerNight = 1200;
      break;
    case "Standard":
      baseRoomPerNight = 2800;
      break;
    case "Premium":
      baseRoomPerNight = 6500;
      break;
  }
  const estimatedAccommodation = Math.round(baseRoomPerNight * roomsNeeded * nights);

  // 3. Food cost calculation (per person per day)
  let baseFoodPerDay = 800;
  switch (foodPreference) {
    case "Budget":
      baseFoodPerDay = 500;
      break;
    case "Standard":
      baseFoodPerDay = 1000;
      break;
    case "Premium":
      baseFoodPerDay = 2200;
      break;
  }
  const estimatedFood = Math.round(baseFoodPerDay * people * days);

  // 4. Local Transport cost calculation (autos, cabs, rentals per day)
  let baseLocalTransportPerDay = 400;
  if (travelStyle === "Budget") baseLocalTransportPerDay = 250;
  if (travelStyle === "Premium") baseLocalTransportPerDay = 1000;
  const estimatedLocalTransport = Math.round(baseLocalTransportPerDay * days * Math.ceil(people / 3));

  // 5. Activities and Sightseeing
  let baseActivityPerDayPerPerson = 400;
  switch (activityPreference) {
    case "Low":
      baseActivityPerDayPerPerson = 200;
      break;
    case "Medium":
      baseActivityPerDayPerPerson = 500;
      break;
    case "High":
      baseActivityPerDayPerPerson = 1200;
      break;
  }
  const estimatedActivities = Math.round(baseActivityPerDayPerPerson * people * days);

  // 6. Miscellaneous & Contingency (approx 5-7% of subtotal)
  const subtotal =
    estimatedTransport +
    estimatedAccommodation +
    estimatedFood +
    estimatedLocalTransport +
    estimatedActivities;
  const estimatedMiscellaneous = Math.round(subtotal * 0.05);

  const totalEstimated = subtotal + estimatedMiscellaneous;
  const difference = Math.abs(maxBudget - totalEstimated);
  const isWithinBudget = totalEstimated <= maxBudget;
  const utilizationPercentage = Math.min(Math.round((totalEstimated / maxBudget) * 100), 999);

  const assumptions = [
    `Calculated for ${people} traveler(s) across ${days} day(s) (${nights} night(s)).`,
    `Transportation assumes round-trip ${transportPreference} travel.`,
    `Accommodation assumes ${roomsNeeded} ${accommodationPreference.toLowerCase()} room(s) at average regional rates.`,
    `Food estimates assume 3 meals/day matching ${foodPreference.toLowerCase()} dining preferences.`,
    `5% safety contingency included for unexpected local costs and tolls.`,
  ];

  return {
    breakdown: {
      transportation: estimatedTransport,
      accommodation: estimatedAccommodation,
      food: estimatedFood,
      localTransport: estimatedLocalTransport,
      activities: estimatedActivities,
      miscellaneous: estimatedMiscellaneous,
      total: totalEstimated,
    },
    totalEstimated,
    maxBudget,
    difference,
    isWithinBudget,
    utilizationPercentage,
    assumptions,
  };
}
