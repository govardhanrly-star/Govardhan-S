import { PayMatrixLevel } from './types';

// Standard 7th CPC Entry Pay for Levels 1 to 18
export const PAY_LEVELS: PayMatrixLevel[] = [
  { level: 1, gradePay: 1800, entryPay: 18000, maxStages: 40 },
  { level: 2, gradePay: 1900, entryPay: 19900, maxStages: 40 },
  { level: 3, gradePay: 2000, entryPay: 21700, maxStages: 40 },
  { level: 4, gradePay: 2400, entryPay: 25500, maxStages: 40 },
  { level: 5, gradePay: 2800, entryPay: 29200, maxStages: 40 },
  { level: 6, gradePay: 4200, entryPay: 35400, maxStages: 40 },
  { level: 7, gradePay: 4600, entryPay: 44900, maxStages: 40 },
  { level: 8, gradePay: 4800, entryPay: 47600, maxStages: 40 },
  { level: 9, gradePay: 5400, entryPay: 53100, maxStages: 40 },
  { level: 10, gradePay: 5400, entryPay: 56100, maxStages: 40 },
  { level: 11, gradePay: 6600, entryPay: 67700, maxStages: 39 },
  { level: 12, gradePay: 7600, entryPay: 78800, maxStages: 34 },
  { level: 13, gradePay: 8700, entryPay: 123100, maxStages: 28 }, 
  { level: 13.5, gradePay: 8900, entryPay: 131100, maxStages: 26 }, // Level 13A
  { level: 14, gradePay: 10000, entryPay: 144200, maxStages: 22 },
  { level: 15, gradePay: 0, entryPay: 182200, maxStages: 8 }, // HAG
  { level: 16, gradePay: 0, entryPay: 205400, maxStages: 4 }, // HAG+
  { level: 17, gradePay: 0, entryPay: 225000, maxStages: 1 }, // Apex (Fixed)
  { level: 18, gradePay: 0, entryPay: 250000, maxStages: 1 }, // Cabinet Sec (Fixed)
];

// Helper to generate stages (cells) for a level based on 3% increment rule
export const generatePayStages = (startPay: number, count: number = 40): number[] => {
  const stages = [startPay];
  
  if (count <= 1) return stages;

  let current = startPay;
  for (let i = 1; i < count; i++) {
    // 7th CPC Rounding Rule: Next cell = (Current * 1.03) rounded to nearest 100
    const next = Math.round((current * 1.03) / 100) * 100;
    stages.push(next);
    current = next;
  }
  return stages;
};

// Simplified TPTA City List (High Transport Allowance Cities)
// This is not exhaustive but covers major metros for the boolean toggle
export const HIGHER_TPTA_CITIES_DESC = "Includes: Hyderabad, Delhi, Bangalore, Mumbai, Chennai, Kolkata, Ahmedabad, Pune, etc.";

export const DEFAULT_DA_PERCENT = 50; // Current approx
