import { Client, Account, Databases, ID, Query } from 'appwrite';

// ── Appwrite Configuration ────────────────────────────────────────────────────
export const APPWRITE_CONFIG = {
  ENDPOINT:      import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  PROJECT_ID:    import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
  DATABASE_ID:   import.meta.env.VITE_APPWRITE_DATABASE_ID || 'focus_timer_db',
  COLLECTION_ID: import.meta.env.VITE_APPWRITE_COLLECTION_ID || 'user_stats',
};

export const client = new Client();
if (APPWRITE_CONFIG.PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

function ensureConfig() {
  if (!APPWRITE_CONFIG.PROJECT_ID || APPWRITE_CONFIG.PROJECT_ID === 'YOUR_PROJECT_ID' || APPWRITE_CONFIG.PROJECT_ID === '') {
    throw new Error('Appwrite Project ID is missing. Please add VITE_APPWRITE_PROJECT_ID to your .env file.');
  }
}

// ── Authentication API ───────────────────────────────────────────────────────

/**
 * Register a new user with Email, Password & Name.
 * Automatically initiates verification and logs out until verified.
 */
export async function registerUser(email, password, name) {
  ensureConfig();
  // 1. Create account
  const newUser = await account.create(ID.unique(), email, password, name);
  
  // 2. Create session to authorize verification email
  await account.createEmailPasswordSession(email, password);
  
  // 3. Send verification email pointing to /verify route
  const verifyUrl = `${window.location.origin}/verify`;
  await account.createVerification(verifyUrl);
  
  return newUser;
}

/**
 * Login user. Only allows access if user.emailVerification === true.
 * If not verified, deletes current session and throws an error.
 */
export async function loginUser(email, password) {
  ensureConfig();
  // 1. Delete any lingering session
  try { await account.deleteSession('current'); } catch {}
  
  // 2. Create session
  await account.createEmailPasswordSession(email, password);
  
  // 3. Fetch user profile
  const user = await account.get();
  
  // 4. STRICT VERIFICATION CHECK
  if (!user.emailVerification) {
    // Delete session immediately to block access
    await account.deleteSession('current');
    const err = new Error('EMAIL_NOT_VERIFIED');
    err.email = email;
    throw err;
  }
  
  return user;
}

/**
 * Verify email using userId and secret from the URL params.
 */
export async function verifyUserEmail(userId, secret) {
  return await account.updateVerification(userId, secret);
}

/**
 * Resend verification email for an unverified user.
 */
export async function resendVerificationEmail(email, password) {
  try { await account.deleteSession('current'); } catch {}
  await account.createEmailPasswordSession(email, password);
  const verifyUrl = `${window.location.origin}/verify`;
  await account.createVerification(verifyUrl);
}

/**
 * Log out current session.
 */
export async function logoutUser() {
  try {
    return await account.deleteSession('current');
  } catch (e) {
    console.warn('Logout warning:', e);
  }
}

/**
 * Get currently authenticated and verified user account (if any).
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    if (user && user.emailVerification) {
      return user;
    } else if (user && !user.emailVerification) {
      await account.deleteSession('current');
      return null;
    }
  } catch {
    return null;
  }
}

// ── Database Sync API ────────────────────────────────────────────────────────
export async function fetchUserStats(userId) {
  if (!APPWRITE_CONFIG.PROJECT_ID) return null;
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        docId: doc.$id,
        streak: doc.streak,
        bestStreak: doc.bestStreak,
        totalXP: doc.totalXP,
        lastActiveDate: doc.lastActiveDate,
        days: doc.daysData ? JSON.parse(doc.daysData) : {},
        shownMs: doc.shownMs ? JSON.parse(doc.shownMs) : [],
      };
    }
  } catch (e) {
    console.warn('fetchUserStats error:', e);
  }
  return null;
}

export async function saveUserStats(userId, statsData, docId = null) {
  if (!APPWRITE_CONFIG.PROJECT_ID) return null;
  const payload = {
    userId,
    streak: statsData.streak || 0,
    bestStreak: statsData.bestStreak || 0,
    totalXP: statsData.totalXP || 0,
    lastActiveDate: statsData.lastActiveDate || '',
    daysData: JSON.stringify(statsData.days || {}),
    shownMs: JSON.stringify(statsData.shownMs || []),
  };

  try {
    if (docId) {
      return await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID,
        docId,
        payload
      );
    } else {
      return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID,
        ID.unique(),
        payload
      );
    }
  } catch (e) {
    console.warn('saveUserStats error:', e);
    return null;
  }
}
