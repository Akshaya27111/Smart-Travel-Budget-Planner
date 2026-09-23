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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
        {children}
      </body>
    </html>
  );
}
