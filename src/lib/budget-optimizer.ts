import { Trip, OptimizationLever, WhatIfPlan } from "@/types";

export function generateWhatIfPlan(trip: Trip): WhatIfPlan {
  const originalCost = Number(trip.estimated_total || 0);
  const maxBudget = Number(trip.max_budget || 0);
  const overBudgetAmount = Math.max(0, originalCost - maxBudget);

  const levers: OptimizationLever[] = [];

  // 1. Transportation Lever
  const transportCost = Number(trip.estimated_transport || 0);
  if (transportCost > 1500) {
    const transportSavings = Math.round(transportCost * 0.42);
    levers.push({
      id: "lever-transport",
      category: "Transportation",
      title: "Switch Transit: Express Train / AC Sleeper instead of Flight",
      changeFrom: `${trip.transport_preference || "Flight"} (~₹${transportCost.toLocaleString("en-IN")})`,
      changeTo: `AC Train / Volvo Sleeper (~₹${(transportCost - transportSavings).toLocaleString("en-IN")})`,
      savings: transportSavings,
      explanation:
        "High-speed trains like Vande Bharat or overnight Volvo buses drop you directly in the city center, eliminating ₹800+ airport cab fares while cutting transit ticket costs by ~42%.",
      impactLevel: "High",
    });
  }

  // 2. Accommodation Lever
  const stayCost = Number(trip.estimated_accommodation || 0);
  if (stayCost > 1800) {
    const staySavings = Math.round(stayCost * 0.35);
    levers.push({
      id: "lever-stay",
      category: "Accommodation",
      title: "Switch Stay: Verified Boutique Homestay instead of City Center Hotel",
      changeFrom: `${trip.accommodation_preference || "Standard"} Hotel (~₹${stayCost.toLocaleString("en-IN")})`,
      changeTo: `Heritage Homestay / Guesthouse (~₹${(stayCost - staySavings).toLocaleString("en-IN")})`,
      savings: staySavings,
      explanation:
        "Top-rated boutique homestays 10-15 minutes from central hubs offer authentic hospitality, ensuite bathrooms, and complimentary home-cooked breakfast, saving up to 35% on room tariffs.",
      impactLevel: "High",
    });
  }

  // 3. Activities Lever
  const activityCost = Number(trip.estimated_activities || 0);
  if (activityCost > 600) {
    const activitySavings = Math.round(activityCost * 0.45);
    levers.push({
      id: "lever-activities",
      category: "Activities",
      title: "Optimize Sightseeing: Free Public Parks, Nature Trails & Pass Combos",
      changeFrom: `Paid Ticketed Attractions (~₹${activityCost.toLocaleString("en-IN")})`,
      changeTo: `Curated Heritage Walks & Pass Combos (~₹${(activityCost - activitySavings).toLocaleString("en-IN")})`,
      savings: activitySavings,
      explanation:
        "Replacing private guided commercial attractions with iconic public landmarks (gardens, palaces grounds, lakes, and local street bazaars) preserves cultural richness at zero ticket cost.",
      impactLevel: "Medium",
    });
  }

  // 4. Food Lever
  const foodCost = Number(trip.estimated_food || 0);
  if (foodCost > 1200) {
    const foodSavings = Math.round(foodCost * 0.28);
    levers.push({
      id: "lever-food",
      category: "Food",
      title: "Smart Dining: Iconic Local Eateries for Lunches, Fine Dining for Dinner",
      changeFrom: `Full Hotel Dine-in (~₹${foodCost.toLocaleString("en-IN")})`,
      changeTo: `Legendary Regional Eateries + Select Dinner (~₹${(foodCost - foodSavings).toLocaleString("en-IN")})`,
      savings: foodSavings,
      explanation:
        "Eating breakfast and lunch at famous local culinary hotspots (e.g. legendary dosa joints, coastal shacks, or local thali halls) costs a fraction of hotel room service while tasting better.",
      impactLevel: "Medium",
    });
  }

  // Calculate sum of recommended savings
  const totalPotentialSavings = levers.reduce((sum, l) => sum + l.savings, 0);
  const combinedOptimizedTotal = Math.max(0, originalCost - totalPotentialSavings);
  const willBeWithinBudget = combinedOptimizedTotal <= maxBudget;

  return {
    originalCost,
    maxBudget,
    overBudgetAmount,
    levers,
    totalPotentialSavings,
    combinedOptimizedTotal,
    willBeWithinBudget,
  };
}
