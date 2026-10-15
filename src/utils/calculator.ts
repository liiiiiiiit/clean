import type { CalculationInput, CalculationResult, ServiceType } from '../types.ts';

export interface ServiceRate {
  ratePerSqM: number;
  minPrice: number;
  recommendedStaff: (sqm: number) => number;
  estimatedHours: (sqm: number) => string;
}

export const SERVICE_RATES: Record<ServiceType, ServiceRate> = {
  home: {
    ratePerSqM: 450, // 450 AMD/m² for regular/deep home cleaning
    minPrice: 18000, // min 18,000 AMD
    recommendedStaff: (sqm) => (sqm > 120 ? 3 : sqm > 60 ? 2 : 1),
    estimatedHours: (sqm) => (sqm > 120 ? '4-6h' : sqm > 60 ? '3-4h' : '2-3h'),
  },
  office: {
    ratePerSqM: 380, // 380 AMD/m²
    minPrice: 20000, // min 20,000 AMD
    recommendedStaff: (sqm) => (sqm > 200 ? 4 : sqm > 100 ? 2 : 1),
    estimatedHours: (sqm) => (sqm > 200 ? '4-7h' : sqm > 100 ? '3-5h' : '2-3h'),
  },
  commercial: {
    ratePerSqM: 420, // 420 AMD/m²
    minPrice: 25000, // min 25,000 AMD
    recommendedStaff: (sqm) => (sqm > 250 ? 4 : sqm > 120 ? 3 : 2),
    estimatedHours: (sqm) => (sqm > 250 ? '5-8h' : '3-5h'),
  },
  deep_dryclean: {
    ratePerSqM: 650, // 650 AMD/m² for intensive deep scrub & sanitization
    minPrice: 25000, // min 25,000 AMD
    recommendedStaff: (sqm) => (sqm > 90 ? 3 : 2),
    estimatedHours: (sqm) => (sqm > 90 ? '5-7h' : '3-4h'),
  },
};

export interface AddOnDefinition {
  id: string;
  priceAMD: number;
}

export const ADD_ON_DEFINITIONS: AddOnDefinition[] = [
  { id: 'windows', priceAMD: 6000 },
  { id: 'appliances', priceAMD: 8000 },
  { id: 'balcony', priceAMD: 5000 },
  { id: 'sofa_dryclean', priceAMD: 12000 },
  { id: 'eco_disinfect', priceAMD: 7000 },
];

export const FREQUENCY_DISCOUNTS: Record<string, number> = {
  one_time: 0,
  weekly: 0.15, // 15% discount for weekly regular subscription
  biweekly: 0.10, // 10% discount
  monthly: 0.05, // 5% discount
};

export function calculateEstimatedPrice(input: CalculationInput): CalculationResult {
  const service = SERVICE_RATES[input.serviceType] || SERVICE_RATES.home;
  const rawBase = Math.round(Math.max(10, input.areaSqM) * service.ratePerSqM);
  const minimumApplied = rawBase < service.minPrice;
  const basePriceAMD = Math.max(rawBase, service.minPrice);

  let addOnsTotalAMD = 0;
  for (const addOnId of input.addOnIds) {
    const found = ADD_ON_DEFINITIONS.find((a) => a.id === addOnId);
    if (found) {
      addOnsTotalAMD += found.priceAMD;
    }
  }

  const subtotalAMD = basePriceAMD + addOnsTotalAMD;
  const discountRate = FREQUENCY_DISCOUNTS[input.frequency] || 0;
  const discountAMD = Math.round(subtotalAMD * discountRate);
  const finalPriceAMD = Math.max(service.minPrice, subtotalAMD - discountAMD);

  return {
    basePriceAMD,
    addOnsTotalAMD,
    subtotalAMD,
    discountPercent: Math.round(discountRate * 100),
    discountAMD,
    finalPriceAMD,
    minimumApplied,
  };
}

export function formatAMD(amount: number): string {
  return new Intl.NumberFormat('hy-AM').format(amount) + ' ֏';
}
