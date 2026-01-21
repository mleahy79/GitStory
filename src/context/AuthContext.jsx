import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, githubProvider } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      // Get the GitHub access token for API calls
      const credential = result._tokenResponse;
      if (credential?.oauthAccessToken) {
        setGithubToken(credential.oauthAccessToken);
        localStorage.setItem("githubToken", credential.oauthAccessToken);
      }
      return { success: true, user: result.user };
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setGithubToken(null);
      localStorage.removeItem("githubToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    githubToken,
    signInWithGitHub,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
