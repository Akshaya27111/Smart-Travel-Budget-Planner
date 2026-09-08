import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Travel Budget Planner | TravelBudget",
  description:
    "Plan trips, estimate costs, track expenses and travel smarter with AI-powered budget recommendations.",
  keywords: [
    "travel budget",
    "trip cost calculator",
    "expense tracker",
    "budget planner",
    "AI travel savings",
    "product analytics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
        {children}
      </body>
    </html>
  );
}
