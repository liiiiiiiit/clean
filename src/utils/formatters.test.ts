import test from 'node:test';
import assert from 'node:assert/strict';
import { getInitials, getAvatarColor, getTimeAgo } from './formatters.ts';

test('getInitials extracts two letters correctly', () => {
  assert.equal(getInitials('Anahit Poghosyan'), 'AP');
  assert.equal(getInitials('Levon'), 'LE');
  assert.equal(getInitials('Mariam Danielyan (Resident)'), 'M(');
});

test('getAvatarColor returns deterministic color palette', () => {
  const color1 = getAvatarColor('Anahit');
  const color2 = getAvatarColor('Anahit');
  assert.equal(color1.bg, color2.bg);
  assert.equal(color1.text, color2.text);
  assert.ok(color1.bg.startsWith('bg-'));
});

test('getTimeAgo formats recent dates', () => {
  const recent = new Date(Date.now() - 1000 * 60 * 5).toISOString();
  assert.equal(getTimeAgo(recent), '5m ago');

  const older = new Date(Date.now() - 1000 * 3600 * 3).toISOString();
  assert.equal(getTimeAgo(older), '3h ago');
});
