import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAdminCredentials,
  verifyAdminLogin,
  changeAdminPassword,
  resetToDefaultPassword,
} from './authStorage.ts';

test('default credentials verify successfully with shine2026', () => {
  resetToDefaultPassword();
  assert.equal(verifyAdminLogin('shine2026'), true);
  assert.equal(verifyAdminLogin('wrongpass'), false);
});

test('changeAdminPassword fails if current password is incorrect', () => {
  resetToDefaultPassword();
  const res = changeAdminPassword('badpass', 'newSecret123');
  assert.equal(res.success, false);
  assert.equal(res.error, 'Current password is incorrect.');
  assert.equal(verifyAdminLogin('newSecret123'), false);
});

test('changeAdminPassword succeeds and updates password', () => {
  resetToDefaultPassword();
  const res = changeAdminPassword('shine2026', 'irinaCleaning77');
  assert.equal(res.success, true);
  assert.equal(verifyAdminLogin('irinaCleaning77'), true);
  assert.equal(verifyAdminLogin('shine2026'), false);
});

test('resetToDefaultPassword restores default shine2026 password', () => {
  resetToDefaultPassword();
  assert.equal(verifyAdminLogin('shine2026'), true);
});
