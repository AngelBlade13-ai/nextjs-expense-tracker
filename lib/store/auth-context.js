"use client";

import { createContext } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = createContext({
  user: null,
  loading: false,
  googleLoginHandler: async () => {},
  logout: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, loading] = useAuthState(auth);

  const values = {
    user,
    loading,
    googleLoginHandler,
    logout,
  };

  async function googleLoginHandler() {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    signOut(auth);
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
