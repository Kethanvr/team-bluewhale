# BlueWhale: Marine Trophic Collapse Early Warning System

![BlueWhale Preview](public/Screenshot%20from%202026-04-02%2009-48-28.png)

**BlueWhale** is a full-stack Next.js application built for the **BGSCET 2025 Hackathon**. It monitors 5 IUCN-aligned ecosystem indicators across Karnataka's 320km coastline, computing real-time regime shift probability before an irreversible trophic collapse occurs.

## 🌊 Core Features

1. **Ecosystem Intelligence Map**: A live Leaflet-based map visualizing 6 coastal zones with regime shift probability, 5 ecosystem sub-indicators, and IUCN species risk.
2. **Gemini AI Pollution Scanner**: Upload coastal photos and leverage Gemini 2.5 Flash to automatically classify pollution by MARPOL category, estimate DO (Dissolved Oxygen) impact radius, and propose alert escalations.
3. **Species Trophic Monitor**: Track 5 IUCN-listed species with their Mean Species Abundance (MSA) index and an interactive food web that visualizes real-time cascade consequences of biodiversity loss.
4. **Fisherman Advisory System**: Live alerts that advise fishermen where not to fish to maintain Maximum Sustainable Yield (MSY), allowing critical fish stocks to recover dynamically.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, custom CSS Animations, CSS Variables
- **Mapping**: Leaflet + React-Leaflet
- **Data Vis**: Recharts (for Dashboard gauges)
- **AI Integration**: Google Gemini Vision API (`gemini-2.5-flash`)
- **Icons**: Lucide React / Emoji

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn/pnpm)

### Setup Instructions

1. **Clone and Install**
   ```bash
   # Navigate into the project folder
   cd team-bluewhale

   # Install dependencies
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Gemini API Key.
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > **Note:** If you don't have an API key, the Scan page offers a "Demo Mode" fallback that simulates a Gemini API response for presentation purposes.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🗺️ Project Structure

- `/app`: Next.js App Router (Pages, API routes, Layouts)
  - `/app/map`: Core Interactive Map page
  - `/app/scan`: AI Pollution Scanner page
  - `/app/species`: Species Trophic Monitor
  - `/app/api/scan`: Edge runtime route for Gemini API calls
- `/components`: Reusable UI components
  - `/components/map`: OceanMap, ZonePanel, etc.
  - `/components/dashboard`: Data visualizations (IndicatorBar, AlertChain)
  - `/components/ui`: Shared buttons, badges, background canvas
- `/lib`: Helper functions and type definitions
  - `ecosystem-score.ts`: Algorithm calculating regime shift probability
  - `gemini.ts`: Wrapper for the Gemini Vision API
- `/data`: Static payload definitions (`zones.json`, `species.json`)

## 🎨 Design System

BlueWhale utilizes a bespoke deep-sea aesthetic:
- **Colors**: Abyssal Dark (`#000a14`), Bio-Lum Green (`#39ff8f`), Pulse Cyan (`#0af0c0`), and Critical Red (`#ff2d55`).
- **Typography**: Syne (Headings), DM Mono (Metrics & Code), and Instrument Serif (Accents).

## 💡 The Problem We're Solving

Current marine conservation methods are **reactionary**. Dead zones and trophic cascades are only investigated *after* they happen. The Black Sea collapsed in 1989 because an invasive comb jelly destroyed the zooplankton layer, and the ecosystem never recovered due to internal feedback loops. BlueWhale acts as a smoke alarm, tracking early warning signals (like declining Dissolved Oxygen, warming SST, and shrinking MSA) to issue alerts *before* the critical threshold is crossed.

---
*Created for BGSCET Hackathon 2025. Save the Oceans.*
