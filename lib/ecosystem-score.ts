import { ZoneIndicators } from './types';

/**
 * Compute a weighted ecosystem stability score (0-100) from zone indicators.
 * Weights match IUCN-aligned ecological significance.
 */
export function computeEcosystemScore(indicators: ZoneIndicators): number {

  // Dissolved Oxygen score (0-20 pts): 0 mg/L = 0, 7+ mg/L = 20
  const doScore = Math.min(20, (indicators.dissolvedOxygen / 7) * 20);

  // MSA Index score (0-25 pts): direct percentage scaled
  const msaScore = (indicators.msaIndex / 100) * 25;

  // Fishing pressure score (0-20 pts): F vs MSY
  const fRatio = indicators.fishingMortality / indicators.msy;
  const fishingScore = Math.max(0, 20 - (fRatio - 1) * 20);

  // SST Anomaly score (0-20 pts): 0°C = 20pts, 2°C+ = 0pts
  const sstScore = Math.max(0, 20 - indicators.sstAnomaly * 10);

  // Pollution density score (0-15 pts): 0/10 = 15pts, 10/10 = 0pts
  const pollScore = Math.max(0, 15 - indicators.pollutionDensity * 1.5);

  return Math.round(doScore + msaScore + fishingScore + sstScore + pollScore);
}

/**
 * Returns the color hex for a given ecosystem score
 */
export function scoreToColor(score: number): string {
  if (score < 40) return '#ff2d55'; // red - critical
  if (score < 65) return '#ff6b35'; // orange - warning
  return '#39ff8f'; // green - stable
}

/**
 * Returns status label from score
 */
export function scoreToStatus(score: number): 'CRITICAL' | 'WARNING' | 'STABLE' {
  if (score < 40) return 'CRITICAL';
  if (score < 65) return 'WARNING';
  return 'STABLE';
}
