import { TravelPackage, PackageComparison, TripType } from "@/types";

/**
 * Generates dynamic weekend packages tailored by destination and trip type
 */
export function getAvailablePackages(destination: string, travelers: number): TravelPackage[] {
  const t = Math.max(1, travelers);
  const city = destination || "Destination";

  const couplePackage: TravelPackage = {
    id: "pkg-couple-weekend",
    name: "❤️ Romantic Couple Weekend",
    tag: "Most Popular for 2",
    tripType: "Couple",
    duration: "2 Days / 1 Night",
    totalPrice: 5900,
    perPersonPrice: 2950,
    comfortRating: 9.2,
    highlights: [
      `1 Night at a boutique heritage hotel in ${city}`,
      "Candlelight rooftop dinner & craft cocktails",
      "Private AC cab for all intra-city sightseeing",
      "Skip-the-line couple entry to top 2 attractions",
      "Complimentary breakfast & artisan coffee tasting",
    ],
    breakdown: {
      stay: 2400,
      food: 1600,
      transport: 900,
      activities: 600,
      contingency: 400,
    },
  };

  const friendsPackageTotal = Math.round(3200 * t);
  const friendsPackage: TravelPackage = {
    id: "pkg-friends-adventure",
    name: "🧑🤝🧑 Friends Weekend Adventure",
    tag: "High Energy & Social",
    tripType: "Friends",
    duration: "2 Days / 1 Night",
    totalPrice: friendsPackageTotal,
    perPersonPrice: 3200,
    comfortRating: 8.7,
    highlights: [
      `Vibrant youth hostel / private group villa in ${city}`,
      "Shared SUV cab with group audio & road-trip playlist",
      "Adventure activity pass (trekking / watersports / gaming)",
      "Late-night food street tour & pub hopping",
      "Split-bill friendly itinerary with zero hidden surcharges",
    ],
    breakdown: {
      stay: Math.round(friendsPackageTotal * 0.32),
      food: Math.round(friendsPackageTotal * 0.3),
      transport: Math.round(friendsPackageTotal * 0.18),
      activities: Math.round(friendsPackageTotal * 0.14),
      contingency: Math.round(friendsPackageTotal * 0.06),
    },
  };

  const familyPackage: TravelPackage = {
    id: "pkg-family-getaway",
    name: "👨👩👧 Family Weekend Getaway",
    tag: "Kid-Safe & Relaxed",
    tripType: "Family",
    duration: "2 Days / 1 Night",
    totalPrice: 9800,
    perPersonPrice: Math.round(9800 / Math.max(3, t)),
    comfortRating: 9.4,
    highlights: [
      `Deluxe family suite with 24/7 room service in ${city}`,
      "Dedicated, vetted chauffeur-driven AC vehicle",
      "Child-friendly attractions, botanical parks & science museums",
      "Safe, hygienic multi-cuisine family dining",
      "Flexible relaxed schedule with minimal waiting times",
    ],
    breakdown: {
      stay: 4200,
      food: 2600,
      transport: 1600,
      activities: 900,
      contingency: 500,
    },
  };

  const soloPackage: TravelPackage = {
    id: "pkg-solo-explorer",
    name: "🎒 Solo Explorer Budget Trip",
    tag: "Best Value for 1",
    tripType: "Solo",
    duration: "2 Days / 1 Night",
    totalPrice: 2850,
    perPersonPrice: 2850,
    comfortRating: 8.2,
    highlights: [
      `Top-rated backpacker dorm pod in central ${city}`,
      "All-day unlimited metro & bus transit card",
      "Iconic breakfast darshini & street-food walk",
      "Free heritage walking tour & sunrise viewpoint",
      "Community hostel events to meet fellow travelers",
    ],
    breakdown: {
      stay: 850,
      food: 850,
      transport: 450,
      activities: 400,
      contingency: 300,
    },
  };

  return [couplePackage, friendsPackage, familyPackage, soloPackage];
}

/**
 * Compares user's custom plan against the closest recommended package
 */
export function compareCustomPlanWithPackage(
  customTotal: number,
  destination: string,
  tripType: TripType,
  travelers: number
): PackageComparison {
  const packages = getAvailablePackages(destination, travelers);

  // Match package according to trip type or group size
  let matched = packages.find((p) => p.tripType === tripType);
  if (!matched) {
    if (travelers === 1) matched = packages.find((p) => p.tripType === "Solo");
    else if (travelers === 2) matched = packages.find((p) => p.tripType === "Couple");
    else if (travelers >= 4) matched = packages.find((p) => p.tripType === "Friends");
    else matched = packages[0];
  }

  const pkg = matched!;
  const difference = customTotal - pkg.totalPrice;
  const isPackageCheaper = difference > 0;

  let savingsMessage: string;
  if (isPackageCheaper) {
    savingsMessage = `💡 We found a curated "${pkg.name}" for ₹${pkg.totalPrice.toLocaleString(
      "en-IN"
    )}. Adopting this package could save approximately ₹${difference.toLocaleString(
      "en-IN"
    )} through bundled group and stay rates!`;
  } else {
    savingsMessage = `✨ Your custom plan (₹${customTotal.toLocaleString(
      "en-IN"
    )}) is ₹${Math.abs(difference).toLocaleString(
      "en-IN"
    )} leaner than our bundled package! You have curated a remarkably lean itinerary.`;
  }

  return {
    customPlanCost: customTotal,
    recommendedPackage: pkg,
    difference: Math.abs(difference),
    isPackageCheaper,
    savingsMessage,
  };
}
