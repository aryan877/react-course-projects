import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase credentials from environment variables.
// These are set in a .env file and loaded by Vite.
// See .env.example for required variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure that the environment variables are set.
// If not, throw an error to prevent the app from running without configuration.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * The Supabase client instance.
 * This singleton instance is used throughout the application to interact with Supabase services.
 *
 * Configuration details:
 * - `auth.autoRefreshToken`: Automatically refreshes the auth token.
 * - `auth.persistSession`: Persists the user's session in storage (e.g., localStorage).
 * - `auth.detectSessionInUrl`: Detects session information from the URL, used for magic link authentication.
 * - `realtime.params.eventsPerSecond`: Configures the rate of real-time events to allow for smooth cursor tracking.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
