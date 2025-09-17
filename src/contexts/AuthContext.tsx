import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'citizen' | 'admin') => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get current user profile
  const getCurrentUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  };

  // Helper function to create or update user profile
  const upsertUserProfile = async (profileData: {
    id: string;
    name: string;
    role?: 'citizen' | 'admin';
    department?: string | null;
    credits?: number;
    location_lat?: number | null;
    location_lng?: number | null;
    location_address?: string | null;
  }) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Initialize auth state
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await getCurrentUserProfile();
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: session.user.email!,
              role: profile.role,
              department: profile.department || undefined,
              credits: profile.credits,
              location: profile.location_lat && profile.location_lng ? {
                lat: profile.location_lat,
                lng: profile.location_lng,
                address: profile.location_address || undefined
              } : undefined
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role,
            department: profile.department || undefined,
            credits: profile.credits,
            location: profile.location_lat && profile.location_lng ? {
              lat: profile.location_lat,
              lng: profile.location_lng,
              address: profile.location_address || undefined
            } : undefined
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'citizen' | 'admin') => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      // Check if profile exists, if not create one
      let profile = await getCurrentUserProfile();
      if (!profile) {
        const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        profile = await upsertUserProfile({
          id: data.user.id,
          name: role === 'admin' ? 'Admin User' : userName,
          role,
          department: role === 'admin' ? 'Transportation' : undefined,
          credits: role === 'citizen' ? 100 : 0
        });
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      await upsertUserProfile({
        id: data.user.id,
        name,
        role: 'citizen',
        credits: 100
      });
    }
  };

  const logout = () => {
    supabase.auth.signOut();
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const profileUpdates = {
      id: user.id,
      name: updates.name || user.name,
      role: updates.role || user.role,
      department: updates.department,
      credits: updates.credits !== undefined ? updates.credits : user.credits,
      location_lat: updates.location?.lat,
      location_lng: updates.location?.lng,
      location_address: updates.location?.address
    };

    const updatedProfile = await upsertUserProfile(profileUpdates);
    
    setUser({
      ...user,
      ...updates,
      location: updates.location || user.location
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};