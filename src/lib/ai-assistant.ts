import { AiRecommendation, Trip, BudgetBreakdown } from "@/types";
import { BudgetEstimationParams } from "./budget-engine";

export function generateSavingsRecommendations(
  params: Partial<BudgetEstimationParams> | Partial<Trip>,
  breakdown: BudgetBreakdown
): AiRecommendation[] {
  const recommendations: AiRecommendation[] = [];

  const p = params as Record<string, any>;
  const travelers = p.travelers || 1;
  const duration = p.durationDays || 3;
  const transport = p.transport_preference || p.transportPreference || "Flight";
  const accommodation = p.accommodation_preference || p.accommodationPreference || "Standard";
  const food = p.food_preference || p.foodPreference || "Standard";
  const activities = p.activity_preference || p.activityPreference || "Medium";

  // 1. Transportation recommendation
  if (transport === "Flight") {
    const flightSavings = Math.round(breakdown.transportation * 0.45);
    recommendations.push({
      id: "rec-transport-1",
      category: "Transportation",
      title: "Opt for High-Speed Train or Advance Booking",
      tip: "Consider taking a Premium/Vande Bharat or express AC train, or book flexible flights 3-4 weeks in advance.",
      whyItSaves: `Train fares between major hubs cost significantly less than last-minute flights, saving up to 45% of total transit costs for ${travelers} traveler(s).`,
      estimatedSavings: flightSavings,
      source: "Smart fallback recommendation",
    });
  } else if (transport === "Car" && travelers <= 2) {
    const carSavings = Math.round(breakdown.transportation * 0.35);
    recommendations.push({
      id: "rec-transport-2",
      category: "Transportation",
      title: "Shared Transit or Express Bus Option",
      tip: "For 1-2 travelers, interstate express buses or trains offer substantial fuel and toll savings.",
      whyItSaves: "Vehicle rental, fuel, and expressway tolls add up quickly for solo or couple travel compared to booked transit seats.",
      estimatedSavings: carSavings,
      source: "Smart fallback recommendation",
    });
  }

  // 2. Accommodation recommendation
  if (accommodation === "Premium") {
    const hotelSavings = Math.round(breakdown.accommodation * 0.4);
    recommendations.push({
      id: "rec-stay-1",
      category: "Accommodation",
      title: "Select Boutique Stays or 3-4 Star Homestays",
      tip: "Choose verified heritage homestays or top-rated 3-star boutique hotels located 10-15 mins from the central promenade.",
      whyItSaves: "Stays situated slightly outside city centers offer 40% lower tariffs while maintaining premium comfort, pool access, and authentic hospitality.",
      estimatedSavings: hotelSavings,
      source: "Smart fallback recommendation",
    });
  } else if (accommodation === "Standard") {
    const hotelSavings = Math.round(breakdown.accommodation * 0.22);
    recommendations.push({
      id: "rec-stay-2",
      category: "Accommodation",
      title: "Look for Weekly Rates or Hostels with Private Rooms",
      tip: "Look for guest houses offering complimentary breakfast and private ensuite rooms.",
      whyItSaves: "Included breakfasts save ₹300-₹500 per person each morning, and direct bookings avoid OTA platform markups.",
      estimatedSavings: hotelSavings,
      source: "Smart fallback recommendation",
    });
  }

  // 3. Food recommendation
  if (food === "Premium" || food === "Standard") {
    const foodSavings = Math.round(breakdown.food * 0.3);
    recommendations.push({
      id: "rec-food-1",
      category: "Food",
      title: "Mix Iconic Local Eateries with Dine-in Restaurants",
      tip: "Dine at authentic local culinary spots and street cafes for lunches, reserving fine dining for select dinners.",
      whyItSaves: "Local specialties cost roughly a third of hotel restaurant bills while offering a more authentic regional gastronomic experience.",
      estimatedSavings: foodSavings,
      source: "Smart fallback recommendation",
    });
  }

  // 4. Activities & Sightseeing
  if (activities === "High") {
    const activitySavings = Math.round(breakdown.activities * 0.35);
    recommendations.push({
      id: "rec-act-1",
      category: "Activities",
      title: "Utilize City Tourism Passes & Free Museum Days",
      tip: "Group attractions by walking districts and schedule self-guided heritage trails or free-entry days.",
      whyItSaves: "Bundled combo tickets reduce individual admission fees, and nature trails or historical quarters are often free of charge.",
      estimatedSavings: activitySavings,
      source: "Smart fallback recommendation",
    });
  } else {
    recommendations.push({
      id: "rec-act-2",
      category: "Activities",
      title: "Pre-book Experiences Online for Group Discounts",
      tip: "Check travel aggregator portals 48 hours prior for early-bird admission deals.",
      whyItSaves: "Online vouchers regularly offer 10-15% discounts over on-the-spot ticket counter pricing.",
      estimatedSavings: Math.max(Math.round(breakdown.activities * 0.2), 500),
      source: "Smart fallback recommendation",
    });
  }

  // 5. Local Transport tip
  if (breakdown.localTransport > 1500) {
    const localSavings = Math.round(breakdown.localTransport * 0.35);
    recommendations.push({
      id: "rec-local-1",
      category: "Transportation",
      title: "Rent a Scooter or Use Metro Smart Cards",
      tip: "Rent a two-wheeler or purchase daily transit cards instead of hiring multiple on-demand cabs.",
      whyItSaves: "Daily scooter rentals (~₹350-₹500/day) or metro passes bypass surge pricing and traffic meter spikes.",
      estimatedSavings: localSavings,
      source: "Smart fallback recommendation",
    });
  }

  return recommendations;
}
