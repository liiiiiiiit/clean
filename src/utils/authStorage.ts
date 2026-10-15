const AUTH_STORAGE_KEY = 'shine_cleaning_admin_auth_v2';
const SESSION_STORAGE_KEY = 'shine_cleaning_admin_session_v2';

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Stored password
  displayName: string;
  updatedAt: string;
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'shine2026', // Default password
  displayName: 'Irina (Shine Cleaning)',
  updatedAt: new Date().toISOString(),
};

let inMemoryCredentials: AdminCredentials = { ...DEFAULT_CREDENTIALS };
let inMemorySessionActive = false;

export function getAdminCredentials(): AdminCredentials {
  if (typeof window === 'undefined') {
    return inMemoryCredentials;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    return JSON.parse(raw) as AdminCredentials;
  } catch {
    return inMemoryCredentials;
  }
}

export function verifyAdminLogin(password: string): boolean {
  const creds = getAdminCredentials();
  return password.trim() === creds.passwordHash;
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const creds = getAdminCredentials();

  if (currentPassword.trim() !== creds.passwordHash) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: 'New password must be at least 4 characters.' };
  }

  const updated: AdminCredentials = {
    ...creds,
    passwordHash: newPassword.trim(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryCredentials = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return { success: true };
}

export function resetToDefaultPassword(): AdminCredentials {
  inMemoryCredentials = { ...DEFAULT_CREDENTIALS };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    } catch {
      // ignore
    }
  }
  return DEFAULT_CREDENTIALS;
}

export function isAdminSessionActive(): boolean {
  if (typeof window === 'undefined') {
    return inMemorySessionActive;
  }
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return inMemorySessionActive;
  }
}

export function setAdminSession(active: boolean): void {
  inMemorySessionActive = active;
  if (typeof window !== 'undefined') {
    try {
      if (active) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }
}
