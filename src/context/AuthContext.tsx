import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ data: any; error: any }>;
    resetPassword: (email: string) => Promise<{ error: any; data: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            console.log('Supabase client not initialized (missing keys?)');
            setLoading(false);
            return;
        }

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (!supabase) {
            alert("Supabase not configured!");
            return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) alert(error.message);
    };

    const signInWithEmail = async (email: string, password: string) => {
        if (!supabase) return { error: { message: "Supabase not configured" } };
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUpWithEmail = async (email: string, password: string) => {
        if (!supabase) return { data: null, error: { message: "Supabase not configured" } };
        return await supabase.auth.signUp({ email, password });
    };

    const resetPassword = async (email: string) => {
        if (!supabase) return { error: { message: "Supabase not configured" }, data: null };
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut }}>
            {loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider>
    );
};
