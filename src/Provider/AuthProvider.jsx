import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import app from "../Firebase/Firebase.init";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object with role
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    console.log("Creating user:", email);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    console.log("Signing in user:", email);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData)
      .then(() => {
        const { displayName, email, photoURL, uid } = auth.currentUser;
        const updatedUser = { displayName, email, photoURL, uid };
        console.log("User profile updated:", updatedUser);
        setUser(updatedUser);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const logOut = async () => {
    setLoading(true);
    try {
      console.log("Logging out...");
      // Clear backend JWT cookie
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      // Sign out Firebase
      await signOut(auth);
      setUser(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        console.log("Firebase user detected:", currentUser.email);
        const { displayName, email, photoURL, uid } = currentUser;

        try {
          // Call backend login to get JWT cookie
          console.log("Logging in on backend:", email);
          await axios.post(
            "http://localhost:3000/login",
            { email },
            { withCredentials: true }
          );

          // Fetch user role from backend
          const roleRes = await axios.get(`http://localhost:3000/users/role/${email}`);
          const role = roleRes.data.role || "user";
          console.log("User role from backend:", role);

          const userDatas = { displayName, email, photoURL, uid, role };
          setUser(userDatas);
          console.log("User state updated:", userDatas);
        } catch (error) {
          console.error("Backend login or role fetch error:", error);
          // Fallback user without role if error occurs
          setUser({ displayName, email, photoURL, uid, role: "user" });
        }
      } else {
        console.log("No user logged in");
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  const authData = {
    user,
    loading,
    createUser,
    signIn,
    updateUser,
    logOut,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
