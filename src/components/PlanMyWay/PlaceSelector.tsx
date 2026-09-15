"use client";

import React, { useState } from "react";
import { getCityData } from "@/lib/city-data";
import { PlaceItem, FoodItem } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  MapPin,
  Utensils,
  Star,
  Plus,
  Check,
  Compass,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";

interface PlaceSelectorProps {
  destination: string;
  travelers: number;
  onUpdateBudget: (addedActivities: number, addedFood: number, selectedItems: string[]) => void;
  initiallySelected?: string[];
}

export default function PlaceSelector({
  destination,
  travelers,
  onUpdateBudget,
  initiallySelected = [],
}: PlaceSelectorProps) {
  const cityData = getCityData(destination);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>(initiallySelected);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "places" | "food">("all");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const t = Math.max(1, travelers);

  const togglePlace = (id: string) => {
    setSelectedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSavedSuccess(false);
  };

  const toggleFood = (id: string) => {
    setSelectedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSavedSuccess(false);
  };

  // Calculate costs
  const selectedPlaces = cityData.famousPlaces.filter((p) => selectedPlaceIds.includes(p.id));
  const selectedFoods = cityData.famousFoods.filter((f) => selectedFoodIds.includes(f.id));

  // Places cost is usually per-person entry ticket * travelers
  const totalPlacesCost = selectedPlaces.reduce((sum, p) => sum + p.estimatedCost * t, 0);
  // Food cost is per-person meal cost * travelers
  const totalFoodCost = selectedFoods.reduce((sum, f) => sum + f.estimatedCost * t, 0);
  const totalAddedCost = totalPlacesCost + totalFoodCost;

  const handleApplyToTrip = () => {
    const names = [
      ...selectedPlaces.map((p) => p.name),
      ...selectedFoods.map((f) => f.name),
    ];
    onUpdateBudget(totalPlacesCost, totalFoodCost, names);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              City Experience Engine
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {cityData.state}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-2 flex items-center gap-2">
            <span>What is {cityData.cityName} famous for?</span>
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">{cityData.tagline}</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({cityData.famousPlaces.length + cityData.famousFoods.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("places")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "places"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Famous Places ({cityData.famousPlaces.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("food")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "food"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Famous Food ({cityData.famousFoods.length})
          </button>
        </div>
      </div>

      {/* Grid of Places & Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Famous Places */}
        {(activeTab === "all" || activeTab === "places") &&
          cityData.famousPlaces.map((place) => {
            const isSelected = selectedPlaceIds.includes(place.id);
            return (
              <div
                key={place.id}
                onClick={() => togglePlace(place.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {place.category}
                      </span>
                      {place.area && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {place.area}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{place.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {place.description}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {place.rating}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {place.durationHours}h
                    </span>
                  </div>

                  <div className="font-bold text-slate-900">
                    {place.estimatedCost === 0 ? (
                      <span className="text-emerald-600">Free Entry</span>
                    ) : (
                      <span>{formatINR(place.estimatedCost)} / person</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Famous Foods */}
        {(activeTab === "all" || activeTab === "food") &&
          cityData.famousFoods.map((food) => {
            const isSelected = selectedFoodIds.includes(food.id);
            return (
              <div
                key={food.id}
                onClick={() => toggleFood(food.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-500"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {food.mealType}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Don't Miss
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{food.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {food.description}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? "bg-amber-600 border-amber-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" /> Authentic Local Taste
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatINR(food.estimatedCost)} / person
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Selected Items & Direct Budget Add Bar */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-500">
            Selected: <strong className="text-slate-800">{selectedPlaceIds.length}</strong> Places &{" "}
            <strong className="text-slate-800">{selectedFoodIds.length}</strong> Food Experiences ({travelers} Travelers)
          </div>
          <div className="text-sm text-slate-700 flex items-center gap-2">
            <span>Total Added Cost:</span>
            <span className="text-lg font-extrabold text-[#0F172A]">
              {formatINR(totalAddedCost)}
            </span>
            <span className="text-[11px] text-slate-400">
              (Activities: {formatINR(totalPlacesCost)} • Food: {formatINR(totalFoodCost)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Added to Trip Budget!
            </span>
          )}
          <button
            type="button"
            onClick={handleApplyToTrip}
            disabled={selectedPlaceIds.length === 0 && selectedFoodIds.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Selected to My Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
