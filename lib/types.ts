// TypeScript interfaces for BlueWhale

export type ZoneStatus = 'CRITICAL' | 'WARNING' | 'STABLE';
export type TrophicRisk = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DOStatus = 'DEAD ZONE' | 'HYPOXIC' | 'STRESSED' | 'HEALTHY';
export type FishingPressure = 'HIGH' | 'MEDIUM' | 'LOW';
export type PopulationTrend = 'DECLINING' | 'STABLE' | 'INCREASING' | 'LOCALLY EXTINCT';
export type IUCNStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export interface PollutionSource {
  name: string;
  distance: string;
  type: string;
}

export interface ZoneIndicators {
  dissolvedOxygen: number;
  doUnit: string;
  doStatus: DOStatus;
  msaIndex: number;
  msaStatus: string;
  fishingPressure: FishingPressure;
  fishingMortality: number;
  msy: number;
  sstAnomaly: number;
  sstUnit: string;
  pollutionDensity: number;
}

export interface Zone {
  id: string;
  name: string;
  district: string;
  coords: [number, number];
  status: ZoneStatus;
  ecosystemScore: number;
  indicators: ZoneIndicators;
  regimeShiftProbability: number;
  monthsToThreshold: number;
  trophicRisk: TrophicRisk;
  species: string[];
  pollutionSources: PollutionSource[];
  lastReported: string;
  reportCount: number;
  note?: string;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  iucnStatus: IUCNStatus;
  iucnStatusFull: string;
  karnatakaPopulation: string;
  msaIndex: number;
  msaThreshold: number;
  populationTrend: PopulationTrend;
  populationChange5yr: number;
  primaryThreat: string;
  secondaryThreats: string[];
  nestingSites?: string[];
  nestingSitesLostSince2010?: number;
  karnatakaAlerts?: string;
  indiaPopulation?: string;
  criticalHabitat?: string;
  yearsToEndangered?: number;
  yearsToThreshold?: number;
  protectedUnder: string;
  trophicLevel: number;
  ecologicalRole: string;
  cascadeEffect: string;
}

// Gemini scan result types
export interface PollutionAnalysis {
  pollutionDetected: boolean;
  pollutionType: {
    primary: string;
    secondary: string | null;
    marpolCategory: string;
  };
  severityScore: number;
  affectedAreaEstimate: string;
  dissolvedOxygenImpact: {
    estimatedDODrop: string;
    impactRadius: string;
    hypoxiaRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  trophicThreat: {
    seagrassRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    benthicHabitatImpact: 'LOW' | 'MEDIUM' | 'HIGH';
    algalBloomRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    cascadeRisk: string;
  };
  speciesAtRisk: Array<{ species: string; reason: string }>;
  recommendedActions: string[];
  alertEscalation: {
    shouldAlert: boolean;
    alertTarget: string | null;
    urgency: 'IMMEDIATE' | '48H' | '7 DAYS' | 'MONITORING';
  };
  confidence: number;
  analysisNotes: string;
}
