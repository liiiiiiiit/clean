import type { BookingStatus, ServiceType, StoredBooking } from '../types.ts';

const STORAGE_KEY = 'shine_cleaning_bookings_v1';

export const INITIAL_SEED_BOOKINGS: StoredBooking[] = [
  {
    id: 'seed-1',
    refNumber: 'SC-839201',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'new',
    fullName: 'Anahit Poghosyan',
    phoneNumber: '+374 98 234567',
    serviceType: 'home',
    areaSqM: 85,
    date: '2026-10-18',
    address: 'Yerevan, Arabkir, Komitas Ave 24, Apt 18',
    notes: 'Please bring eco detergents, we have a small cat in the apartment.',
    addOns: ['windows'],
    estimatedPriceAMD: 44250,
  },
  {
    id: 'seed-2',
    refNumber: 'SC-654128',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'confirmed',
    fullName: 'Levon Grigoryan (TechSpace LLC)',
    phoneNumber: '+374 77 912384',
    serviceType: 'office',
    areaSqM: 140,
    date: '2026-10-17',
    address: 'Yerevan, Kentron, Northern Ave 10, 4th floor',
    notes: 'Regular weekly corporate cleaning after 18:30.',
    addOns: ['appliances'],
    estimatedPriceAMD: 61200,
  },
  {
    id: 'seed-3',
    refNumber: 'SC-482019',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'completed',
    fullName: 'Mariam Danielyan',
    phoneNumber: '+374 93 118833',
    serviceType: 'deep_dryclean',
    areaSqM: 65,
    date: '2026-10-14',
    address: 'Yerevan, Davtashen 2nd block, bldg 14',
    notes: 'Deep carpet steam cleaning and 3-seat sofa extraction.',
    addOns: ['sofa_dryclean'],
    estimatedPriceAMD: 54250,
  },
];

let inMemoryBookings: StoredBooking[] = [...INITIAL_SEED_BOOKINGS];

export function getStoredBookings(): StoredBooking[] {
  if (typeof window === 'undefined') {
    return inMemoryBookings;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    return JSON.parse(raw) as StoredBooking[];
  } catch {
    return inMemoryBookings;
  }
}

export function saveNewBooking(
  bookingData: Omit<StoredBooking, 'id' | 'refNumber' | 'createdAt' | 'status'>
): StoredBooking {
  const current = getStoredBookings();
  const randomSix = Math.floor(100000 + Math.random() * 900000);
  const newBooking: StoredBooking = {
    ...bookingData,
    id: `book-${Date.now()}-${randomSix}`,
    refNumber: `SC-${randomSix}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  const updated = [newBooking, ...current];
  inMemoryBookings = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore quota errors
    }
  }

  return newBooking;
}

export function updateBookingStatus(
  id: string,
  newStatus: BookingStatus
): StoredBooking[] {
  const current = getStoredBookings();
  const updated = current.map((b) =>
    b.id === id ? { ...b, status: newStatus } : b
  );
  inMemoryBookings = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return updated;
}

export function updateBookingInternalNotes(
  id: string,
  internalNotes: string
): StoredBooking[] {
  const current = getStoredBookings();
  const updated = current.map((b) =>
    b.id === id ? { ...b, internalNotes } : b
  );
  inMemoryBookings = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return updated;
}

export function deleteStoredBooking(id: string): StoredBooking[] {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== id);
  inMemoryBookings = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return updated;
}

export function generateBookingsCSV(bookings: StoredBooking[]): string {
  const headers = [
    'Ref #',
    'Date Submitted',
    'Status',
    'Customer Name',
    'Phone',
    'Service',
    'Area (m2)',
    'Preferred Date',
    'Address',
    'Estimated AMD',
    'Notes',
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = bookings.map((b) => [
    escapeCSV(b.refNumber),
    escapeCSV(b.createdAt.slice(0, 10)),
    escapeCSV(b.status),
    escapeCSV(b.fullName),
    escapeCSV(b.phoneNumber),
    escapeCSV(b.serviceType),
    escapeCSV(b.areaSqM),
    escapeCSV(b.date),
    escapeCSV(b.address),
    escapeCSV(b.estimatedPriceAMD || 0),
    escapeCSV(b.notes),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
