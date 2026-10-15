import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStoredBookings,
  saveNewBooking,
  updateBookingStatus,
  deleteStoredBooking,
  generateBookingsCSV,
} from './bookingStorage.ts';

test('initial seed bookings load properly', () => {
  const list = getStoredBookings();
  assert.ok(list.length >= 3);
  assert.equal(list[0].status, 'new');
});

test('saveNewBooking creates a booking with reference number and adds to beginning', () => {
  const created = saveNewBooking({
    fullName: 'David Hovhannisyan',
    phoneNumber: '+374 94 998877',
    serviceType: 'office',
    areaSqM: 100,
    date: '2026-10-20',
    address: 'Yerevan, Kentron',
    notes: 'Urgent weekend clean',
    addOns: ['windows'],
    estimatedPriceAMD: 44000,
  });

  assert.ok(created.id.startsWith('book-'));
  assert.ok(created.refNumber.startsWith('SC-'));
  assert.equal(created.status, 'new');
  assert.equal(created.fullName, 'David Hovhannisyan');

  const all = getStoredBookings();
  assert.equal(all[0].id, created.id);
});

test('updateBookingStatus updates status accurately', () => {
  const list = getStoredBookings();
  const targetId = list[0].id;
  const updated = updateBookingStatus(targetId, 'confirmed');
  const found = updated.find((b) => b.id === targetId);
  assert.equal(found?.status, 'confirmed');
});

test('generateBookingsCSV formats valid CSV string with headers', () => {
  const list = getStoredBookings();
  const csv = generateBookingsCSV(list);
  assert.ok(csv.includes('Ref #,Date Submitted,Status'));
  assert.ok(csv.includes('David Hovhannisyan'));
});
