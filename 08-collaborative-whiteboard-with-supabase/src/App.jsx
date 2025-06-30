import { AuthForm } from "./components/AuthForm";
import { FullScreenLoader } from "./components/common/FullScreenLoader";
import { WhiteboardApp } from "./components/WhiteboardApp";
import { useAuth } from "./hooks/useAuth";

/**
 * The root component of the application.
 * It manages the user authentication state and renders the appropriate UI:
 * - A loading screen while checking the session.
 * - An error screen if authentication fails.
 * - The authentication form if the user is not logged in.
 * - The main WhiteboardApp if the user is authenticated.
 */
function App() {
  const {
    user,
    profile,
    loading,
    error,
    signInWithMagicLink,
    signOut,
    updateProfile,
  } = useAuth();

  // Show a full-screen loader while the authentication status is being determined.
  if (loading) {
    return (
      <div>
        <FullScreenLoader
          title="Loading Session"
          message="Authenticating and loading your whiteboards..."
        />
      </div>
    );
  }

  // If an error occurs during authentication (e.g., network issue),
  // display an informative error screen with a retry option.
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the authentication service. Please check your
            internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Error Details
            </summary>
            <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {error.message || JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  // If there is no authenticated user or profile, render the authentication form.
  if (!user || !profile) {
    return (
      <div>
        <AuthForm onSignIn={signInWithMagicLink} />
      </div>
    );
  }

  // Once the user is authenticated and has a profile, render the main whiteboard application.
  return (
    <div>
      <WhiteboardApp
        user={user}
        profile={profile}
        onSignOut={signOut}
        onUpdateProfile={updateProfile}
      />
    </div>
  );
}

export default App;
