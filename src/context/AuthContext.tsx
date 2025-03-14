"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    setUser: (user: User | null) => void;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    setUser: () => {},
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setSession(session); // Add this line
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setSession(session); // Add this line
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, session, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
