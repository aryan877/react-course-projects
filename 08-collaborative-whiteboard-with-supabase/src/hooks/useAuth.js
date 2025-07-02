import { createProfile, getProfile, updateUserProfile } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { AVATAR_COLORS } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchAndSetProfile = async (user) => {
      try {
        const { data, error } = await getProfile(user.id);

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setProfile(data);
        } else {
          const randomColor =
            AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
          const displayName =
            user.email.split("@")[0] || `user-${user.id.slice(0, 6)}`;

          const { data: newProfile, error: insertError } = await createProfile({
            id: user.id,
            display_name: displayName,
            avatar_color: randomColor,
          });

          if (insertError) {
            throw insertError;
          }
          setProfile(newProfile);
        }
      } catch (error) {
        setError(error);
        setProfile(null);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        // Check if profile is already loaded for the current user
        setProfile((currentProfile) => {
          if (currentProfile && currentProfile.id === currentUser.id) {
            return currentProfile;
          }
          // Profile needs to be fetched
          fetchAndSetProfile(currentUser);
          return null; // or currentProfile, but null might be safer to indicate loading
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href,
        },
      });
      if (error) {
        throw error;
      }
      return { success: true, message: "Check your email for the login link!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Handle error silently or you could still throw it if needed
    }
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return { success: false, message: "User not authenticated" };
      try {
        const { data, error } = await updateUserProfile(user.id, updates);

        if (error) {
          throw error;
        }
        setProfile(data);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
    [user]
  );

  return {
    user,
    profile,
    loading,
    error,
    signInWithMagicLink,
    signOut,
    updateProfile,
  };
}
