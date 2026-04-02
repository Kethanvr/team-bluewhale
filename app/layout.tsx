import type { Metadata } from "next";
import { Syne, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BlueWhale — India's Marine Trophic Collapse Early Warning System",
  description:
    "BlueWhale monitors Karnataka's 320km coastline, computing real-time Ecosystem Stability Scores and trophic cascade predictions before irreversible regime shift occurs.",
  keywords: "marine ecology, coastal monitoring, Karnataka, trophic cascade, ocean AI, biodiversity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
