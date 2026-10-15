import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimatedPrice, formatAMD, SERVICE_RATES } from './calculator.ts';

test('minimum price is applied when calculated area rate is below threshold', () => {
  const result = calculateEstimatedPrice({
    serviceType: 'home',
    areaSqM: 20, // 20 * 450 = 9000 AMD < 18,000 AMD min
    addOnIds: [],
    frequency: 'one_time',
  });

  assert.equal(result.basePriceAMD, 18000);
  assert.equal(result.minimumApplied, true);
  assert.equal(result.finalPriceAMD, 18000);
});

test('standard price calculation scales correctly with square meters', () => {
  const result = calculateEstimatedPrice({
    serviceType: 'home',
    areaSqM: 80, // 80 * 450 = 36000 AMD
    addOnIds: [],
    frequency: 'one_time',
  });

  assert.equal(result.basePriceAMD, 36000);
  assert.equal(result.minimumApplied, false);
  assert.equal(result.finalPriceAMD, 36000);
});

test('add-ons are correctly summed and frequency discount is applied', () => {
  const result = calculateEstimatedPrice({
    serviceType: 'office',
    areaSqM: 100, // 100 * 380 = 38,000 AMD
    addOnIds: ['windows', 'appliances'], // 6000 + 8000 = 14,000 AMD
    frequency: 'weekly', // 15% discount
  });

  // Base: 38,000
  // Add-ons: 14,000
  // Subtotal: 52,000
  // Discount (15%): 7,800
  // Final: 44,200
  assert.equal(result.basePriceAMD, 38000);
  assert.equal(result.addOnsTotalAMD, 14000);
  assert.equal(result.subtotalAMD, 52000);
  assert.equal(result.discountPercent, 15);
  assert.equal(result.discountAMD, 7800);
  assert.equal(result.finalPriceAMD, 44200);
});

test('formatAMD formats currency with Armenian dram symbol correctly', () => {
  const formatted = formatAMD(25000);
  assert.ok(formatted.includes('25') && formatted.includes('֏'));
});
