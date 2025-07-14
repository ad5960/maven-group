"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebaseConfig";

const ADMIN_EMAIL = "mavianchris@gmail.com";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setUser(currentUser);
        } else {
          console.warn("Unauthorized user detected.");
          await signOut(auth);
          setUser(null);
        }
      } else {
        console.log("No user logged in.");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {error ? <div className="text-red-500 text-center">{error}</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
