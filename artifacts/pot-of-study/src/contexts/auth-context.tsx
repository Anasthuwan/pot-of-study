import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginDemo: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Converts Firebase error codes into human-friendly, gentle messages
 * that match the warm Pot of Study tone.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = ((error as { code?: string })?.code || '').toLowerCase();
  const msg = ((error as Error)?.message || '').toLowerCase();
  const text = `${code} ${msg}`;

  if (
    text.includes('api-key-not-valid') ||
    text.includes('invalid-api-key') ||
    text.includes('project-not-found')
  ) {
    return 'Firebase API Key is missing or invalid. Please add your credentials from Firebase Console to the .env file, or use the Demo Account below to preview.';
  }
  if (text.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (text.includes('user-not-found')) {
    return 'No account was found with this email. Would you like to create one?';
  }
  if (text.includes('wrong-password')) {
    return 'Incorrect password. Please double check and try again.';
  }
  if (text.includes('invalid-credential')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (text.includes('email-already-in-use')) {
    return 'This email address is already registered. Please sign in instead.';
  }
  if (text.includes('weak-password')) {
    return 'Password is too short. Please choose a password with at least 6 characters.';
  }
  if (text.includes('missing-password')) {
    return 'Please enter your password.';
  }
  if (text.includes('missing-email')) {
    return 'Please enter your email address.';
  }
  if (text.includes('too-many-requests')) {
    return 'Access temporarily paused due to multiple unsuccessful attempts. Please wait a moment.';
  }
  if (text.includes('network-request-failed')) {
    return 'Unable to reach the authentication service. Please check your internet connection.';
  }
  if (text.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
  }
  return (error as Error)?.message || 'An error occurred during authentication. Please try again.';
}

/**
 * Derives a clean two-letter monogram from user's displayName or email.
 */
export function getUserInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'PS';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isFirebaseConfigured();

  const loginDemo = (name = 'Maya Chen', email = 'maya.chen@potofstudy.app') => {
    clearError();
    const demoUser = {
      uid: 'demo-student-maya',
      email,
      displayName: name,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'demo-token',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
    } as unknown as User;

    try {
      window.localStorage.setItem('pot-study-demo-user', JSON.stringify({ displayName: name, email }));
    } catch {}
    setUser(demoUser);
    setLoading(false);
  };

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('pot-study-demo-user');
      if (stored) {
        const parsed = JSON.parse(stored);
        loginDemo(parsed.displayName, parsed.email);
        return;
      }
    } catch {}

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          try {
            window.localStorage.removeItem('pot-study-demo-user');
          } catch {}
          setUser(currentUser);
        } else {
          try {
            const stored = window.localStorage.getItem('pot-study-demo-user');
            if (stored) {
              const parsed = JSON.parse(stored);
              loginDemo(parsed.displayName, parsed.email);
              return;
            }
          } catch {}
          setUser(null);
        }
        setLoading(false);
      },
      (authError) => {
        console.error('Firebase Auth state error:', authError);
        setError(formatAuthError(authError));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<void> => {
    clearError();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      const err = 'Please enter your email address.';
      setError(err);
      throw new Error(err);
    }
    if (!password) {
      const err = 'Please enter your password.';
      setError(err);
      throw new Error(err);
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err: unknown) {
      const message = formatAuthError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    clearError();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      const err = 'Please enter your name.';
      setError(err);
      throw new Error(err);
    }
    if (!cleanEmail) {
      const err = 'Please enter your email address.';
      setError(err);
      throw new Error(err);
    }
    if (!password) {
      const err = 'Please create a password.';
      setError(err);
      throw new Error(err);
    }
    if (password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      setError(err);
      throw new Error(err);
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: cleanName,
        });
        setUser({ ...credential.user, displayName: cleanName });
      }
    } catch (err: unknown) {
      const message = formatAuthError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    clearError();
    try {
      window.localStorage.removeItem('pot-study-demo-user');
    } catch {}
    try {
      await signOut(auth);
    } catch (err: unknown) {
      console.warn('SignOut notification:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isConfigured,
        login,
        register,
        loginDemo,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
