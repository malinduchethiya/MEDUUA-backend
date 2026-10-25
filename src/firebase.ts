import { initializeApp } from 'firebase/app';
import {
  browserPopupRedirectResolver,
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  inMemoryPersistence,
  signOut,
   type Auth,
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

function clearStaleFirebaseAuthStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('firebase:')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore storage errors
  }

  try {
    const sessionKeys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith('firebase:')) {
        sessionKeys.push(key);
      }
    }
    sessionKeys.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // ignore storage errors
  }

  try {
    if (window.indexedDB && typeof window.indexedDB.deleteDatabase === 'function') {
      window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    }
  } catch {
    // ignore indexedDB errors
  }
}

clearStaleFirebaseAuthStorage();

const app = initializeApp(firebaseConfig);

function createAppAuth(): Auth {
  try {
    return initializeAuth(app, {
      persistence: inMemoryPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAppAuth();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAPPED_ADMIN_EMAIL = 'merlinfiverr0@gmail.com';
export const WHATSAPP_NUMBER_DISPLAY = '+94 74 037 5253';
export const WHATSAPP_NUMBER_CLEAN = '94740375253';

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER_CLEAN}?text=${encodeURIComponent(message)}`;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isTokenServiceOrOfflineError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('token-service-api') ||
    msg.includes('Fetching auth token failed') ||
    msg.includes('securetoken.googleapis.com') ||
    msg.includes('the client is offline') ||
    msg.includes('unavailable')
  );
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes('token-service-api') ||
    message.includes('Fetching auth token failed') ||
    message.includes('securetoken.googleapis.com')
  ) {
    signOut(auth).catch(() => {});
    clearStaleFirebaseAuthStorage();
    return;
  }

  if (isTokenServiceOrOfflineError(error)) {
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore operation notice:', JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken();
      } catch {
        await signOut(auth).catch(() => {});
        clearStaleFirebaseAuthStorage();
      }
    }
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && isTokenServiceOrOfflineError(error)) {
      await signOut(auth).catch(() => {});
      clearStaleFirebaseAuthStorage();
    }
  }
}

testConnection();

