export type Language = 'hy' | 'ru' | 'en';

export type ServiceType = 'home' | 'office' | 'commercial' | 'deep_dryclean';

export type FrequencyType = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

export type BookingStatus = 'new' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface StoredBooking {
  id: string;
  refNumber: string;
  createdAt: string;
  status: BookingStatus;
  fullName: string;
  phoneNumber: string;
  serviceType: ServiceType;
  areaSqM: number;
  date: string;
  timeSlot?: string;
  address: string;
  notes: string;
  addOns: string[];
  estimatedPriceAMD?: number;
  internalNotes?: string;
}

export interface AddOnOption {
  id: string;
  priceAMD: number;
}

export interface CalculationInput {
  serviceType: ServiceType;
  areaSqM: number;
  addOnIds: string[];
  frequency: FrequencyType;
}

export interface CalculationResult {
  basePriceAMD: number;
  addOnsTotalAMD: number;
  subtotalAMD: number;
  discountPercent: number;
  discountAMD: number;
  finalPriceAMD: number;
  minimumApplied: boolean;
}

export interface BookingFormData {
  fullName: string;
  phoneNumber: string;
  serviceType: ServiceType;
  areaSqM: number;
  date: string;
  timeSlot: string;
  address: string;
  notes: string;
  addOns: string[];
}
