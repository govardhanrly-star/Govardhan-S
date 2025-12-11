export enum CityType {
  X = 'X',
  Y = 'Y',
  Z = 'Z',
}

export interface SalaryState {
  level: number;
  basicPay: number;
  daPercent: number;
  hraPercent: number; // Derived or Manual
  cityType: CityType;
  isTptaCity: boolean;
  
  // Earnings
  customHra?: number; // Override
  otherAllowances: number;
  
  // Deductions
  nps: number;
  cgegis: number;
  incomeTax: number;
  professionalTax: number;
  otherDeductions: number;
}

export interface PayMatrixLevel {
  level: number;
  gradePay: number; // For reference (6th cpc)
  entryPay: number;
  maxStages?: number;
}
