import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "TripMate AI | Intelligent Travel Planner",
  description:
    "Plan personalized trips using a LangGraph multi-agent AI travel planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

