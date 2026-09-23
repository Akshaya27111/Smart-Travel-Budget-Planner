import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-JN4QBGG2KS"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JN4QBGG2KS', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
        {children}
      </body>
    </html>
  );
}
