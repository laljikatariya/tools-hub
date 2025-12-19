// Admin authentication utilities
const ADMIN_SESSION_KEY = 'utilo_admin_session';

// Change this to your secure password
const ADMIN_PASSWORD = '67#_r&WyJ2dwI'; // CHANGE THIS IN PRODUCTION!

// Hash password for comparison (simple implementation)
function hashPassword(password: string): string {
  // In production, use a proper hashing algorithm
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Check if admin is authenticated
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    
    const { timestamp, hash } = JSON.parse(session);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Session expires after 1 hour
    if (now - timestamp > oneHour) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    
    return hash === hashPassword(ADMIN_PASSWORD);
  } catch {
    return false;
  }
}

// Authenticate admin with password
export function authenticateAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    const session = {
      timestamp: Date.now(),
      hash: hashPassword(ADMIN_PASSWORD)
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    // Also set cookie for server-side API auth
    document.cookie = `${ADMIN_SESSION_KEY}=${JSON.stringify(session)}; path=/; max-age=3600; samesite=strict`;
    return true;
  }
  return false;
}

// Logout admin
export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  // Also remove cookie
  document.cookie = `${ADMIN_SESSION_KEY}=; path=/; max-age=0`;
}
