import { PollutionAnalysis } from './types';

const POLLUTION_ANALYSIS_PROMPT = `
You are BlueWhale's marine pollution analysis engine with expertise in coastal ecology and MARPOL regulations.

Analyze this image of a coastal/marine area and respond ONLY in valid JSON with this exact structure:

{
  "pollutionDetected": boolean,
  "pollutionType": {
    "primary": "one of: Marine Litter (MARPOL Annex V) | Oil Discharge (MARPOL Annex I) | Chemical Effluent | Harmful Algal Bloom (HAB) | Sewage (MARPOL Annex IV) | Plastic Debris | No Pollution Detected",
    "secondary": "string or null",
    "marpolCategory": "Annex I | Annex II | Annex IV | Annex V | N/A"
  },
  "severityScore": number between 1-10,
  "affectedAreaEstimate": "string e.g. ~340 sq meters",
  "dissolvedOxygenImpact": {
    "estimatedDODrop": "string e.g. -1.2 mg/L",
    "impactRadius": "string e.g. 800m",
    "hypoxiaRisk": "LOW | MEDIUM | HIGH | CRITICAL"
  },
  "trophicThreat": {
    "seagrassRisk": "LOW | MEDIUM | HIGH",
    "benthicHabitatImpact": "LOW | MEDIUM | HIGH",
    "algalBloomRisk": "LOW | MEDIUM | HIGH",
    "cascadeRisk": "string description of trophic cascade risk"
  },
  "speciesAtRisk": [
    {
      "species": "common name",
      "reason": "specific threat mechanism"
    }
  ],
  "recommendedActions": [
    "specific action 1",
    "specific action 2",
    "specific action 3"
  ],
  "alertEscalation": {
    "shouldAlert": boolean,
    "alertTarget": "Karnataka Coastal Zone Authority | Pollution Control Board | Wildlife Crime Control Bureau | Coast Guard | null",
    "urgency": "IMMEDIATE | 48H | 7 DAYS | MONITORING"
  },
  "confidence": number between 0-1,
  "analysisNotes": "brief technical note about what specifically was detected"
}

Be technically precise. Use real marine ecology terminology. If no pollution is visible, still analyze water/coastal health indicators visible in the image.
`;

export async function analyzePollution(
  imageBase64: string,
  mimeType: string
): Promise<PollutionAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
              { text: POLLUTION_ANALYSIS_PROMPT },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              pollutionDetected: { type: "BOOLEAN" },
              pollutionType: {
                type: "OBJECT",
                properties: {
                  primary: { type: "STRING" },
                  secondary: { type: "STRING" },
                  marpolCategory: { type: "STRING" }
                }
              },
              severityScore: { type: "NUMBER" },
              affectedAreaEstimate: { type: "STRING" },
              dissolvedOxygenImpact: {
                type: "OBJECT",
                properties: {
                  estimatedDODrop: { type: "STRING" },
                  impactRadius: { type: "STRING" },
                  hypoxiaRisk: { type: "STRING" }
                }
              },
              trophicThreat: {
                type: "OBJECT",
                properties: {
                  seagrassRisk: { type: "STRING" },
                  benthicHabitatImpact: { type: "STRING" },
                  algalBloomRisk: { type: "STRING" },
                  cascadeRisk: { type: "STRING" }
                }
              },
              speciesAtRisk: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    species: { type: "STRING" },
                    reason: { type: "STRING" }
                  }
                }
              },
              recommendedActions: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              alertEscalation: {
                type: "OBJECT",
                properties: {
                  shouldAlert: { type: "BOOLEAN" },
                  alertTarget: { type: "STRING" },
                  urgency: { type: "STRING" }
                }
              },
              confidence: { type: "NUMBER" },
              analysisNotes: { type: "STRING" }
            }
          }
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip markdown code fences if present
  const cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(cleaned) as PollutionAnalysis;
  } catch (err) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('Invalid JSON received from Gemini: ' + String(err));
  }
}
