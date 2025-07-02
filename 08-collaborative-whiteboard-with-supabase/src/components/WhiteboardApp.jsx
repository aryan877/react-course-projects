import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { Toolbar } from "@/components/Toolbar";
import { UserPresence } from "@/components/UserPresence";
import { WhiteboardCanvas } from "@/components/WhiteboardCanvas";
import { useWhiteboardData } from "@/hooks/useWhiteboardData";
import { createWhiteboard, getWhiteboard } from "@/lib/db";
import {
  getPresenceChannel,
  removeChannel,
  subscribeToPresenceChannel,
  trackInPresenceChannel,
} from "@/lib/realtime";
import { Palette } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * The main component for the collaborative whiteboard experience.
 * This component acts as the central orchestrator, bringing together all the
 * different parts of the whiteboard application:
 * - State management for the current tool, color, and stroke width.
 * - Data fetching and real-time updates via the `useWhiteboardData` hook.
 * - Handling high-level actions like undo, redo, and clearing the canvas.
 * - Setting up and managing Supabase real-time channels (presence and elements).
 * - Rendering the main layout, including the Toolbar, UserPresence bar, and the WhiteboardCanvas.
 *
 * @param {object} props - The component's props.
 * @param {object} props.user - The authenticated user object from Supabase.
 * @param {object} props.profile - The user's profile data.
 * @param {function} props.onSignOut - Function to handle user sign-out.
 * @param {function} props.onUpdateProfile - Function to update the user's profile.
 * @returns {JSX.Element}
 */
export function WhiteboardApp({ user, profile, onSignOut, onUpdateProfile }) {
  // Whiteboard metadata state
  const [whiteboardId, setWhiteboardId] = useState(null);
  const [whiteboardTitle, setWhiteboardTitle] = useState("Untitled Whiteboard");

  // Real-time and presence state
  const [presenceChannel, setPresenceChannel] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState(new Map());

  // This custom hook now manages all data and state for the whiteboard.
  const {
    tool,
    color,
    strokeWidth,
    elements,
    canUndo,
    canRedo,
    setTool,
    setColor,
    setStrokeWidth,
    saveElement,
    deleteElements,
    updateCursorPosition,
    undo,
    redo,
    clearAllElements,
  } = useWhiteboardData({
    whiteboardId,
    presenceChannel,
    currentUser: profile,
  });

  /**
   * Initializes the whiteboard session.
   * It checks for a whiteboard ID in the URL. If found, it loads that whiteboard.
   * If not, it creates a new whiteboard, saves it to the database, and updates
   * the URL with the new ID without causing a page reload.
   */
  const initializeWhiteboard = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlWhiteboardId = urlParams.get("whiteboard");

      if (urlWhiteboardId) {
        const { data, error } = await getWhiteboard(urlWhiteboardId);

        if (data && !error) {
          setWhiteboardId(data.id);
          setWhiteboardTitle(data.title);
          return;
        }
        // If the ID is invalid, we'll proceed to create a new one.
      }

      // Create a new whiteboard if one isn't specified in the URL
      const newWhiteboardId = uuidv4();
      const { data, error } = await createWhiteboard({
        id: newWhiteboardId,
        title: "My Creative Canvas",
        created_by: user.id,
        is_public: true,
      });

      if (error) throw error;

      setWhiteboardId(data.id);
      setWhiteboardTitle(data.title);

      // Update the URL with the new whiteboard ID.
      const url = new URL(window.location);
      url.searchParams.set("whiteboard", data.id);
      window.history.replaceState({}, "", url);
    } catch (error) {
      console.error("Error initializing whiteboard:", error);
    }
  }, [user.id]);

  // Run the initialization logic once when the component mounts.
  useEffect(() => {
    initializeWhiteboard();
  }, [initializeWhiteboard]);

  // Effect to set up real-time presence tracking for users and cursors.
  useEffect(() => {
    if (!whiteboardId || !profile) return;

    const channel = getPresenceChannel(whiteboardId);
    setPresenceChannel(channel);

    // This handler is called whenever the presence state changes (users join/leave/update).
    const handlePresenceUpdate = () => {
      const state = channel.presenceState();
      const users = [];
      const newCursors = new Map();

      // Process the presence state to build lists of active users and their cursors.
      for (const id in state) {
        const presences = state[id];
        if (presences.length > 0) {
          const p = presences[0];
          if (p.user_id && p.profile) {
            const userPayload = {
              user_id: p.user_id,
              profiles: p.profile,
            };
            users.push(userPayload);
            // Don't show our own cursor, only others'.
            if (p.user_id !== profile.id) {
              newCursors.set(p.user_id, p);
            }
          }
        }
      }

      // Ensure the current user is always in the active user list.
      const userMap = new Map(users.map((u) => [u.user_id, u]));
      if (!userMap.has(profile.id)) {
        userMap.set(profile.id, {
          user_id: profile.id,
          profiles: {
            display_name: profile.display_name,
            avatar_color: profile.avatar_color,
          },
        });
      }

      setActiveUsers(Array.from(userMap.values()));
      setCursors(newCursors);
    };

    // This callback runs once the client has successfully subscribed to the channel.
    const onSubscribe = async (status) => {
      if (status === "SUBSCRIBED") {
        // Start tracking the user's cursor position.
        await trackInPresenceChannel(channel, {
          user_id: profile.id,
          x: -100, // Initial off-screen position
          y: -100,
          profile: {
            display_name: profile.display_name,
            avatar_color: profile.avatar_color,
          },
        });
      }
    };

    subscribeToPresenceChannel(channel, handlePresenceUpdate, onSubscribe);

    // Cleanup: remove the channel subscription when the component unmounts.
    return () => {
      removeChannel(channel);
    };
  }, [whiteboardId, profile]);

  /**
   * Callback function passed to UserPresence to update the title locally
   * after it has been successfully saved to the database.
   * @param {string} newTitle - The new whiteboard title.
   */
  const handleUpdateTitle = (newTitle) => {
    setWhiteboardTitle(newTitle);
  };

  // Show a loader until the whiteboard has been initialized.
  if (!whiteboardId) {
    return (
      <FullScreenLoader
        title="Setting up your canvas"
        message="Preparing your collaborative whiteboard..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Top bar for user presence, title, and actions */}
      <UserPresence
        whiteboardId={whiteboardId}
        presenceChannel={presenceChannel}
        currentUser={profile}
        activeUsers={activeUsers}
        onSignOut={onSignOut}
        onUpdateProfile={onUpdateProfile}
        whiteboardTitle={whiteboardTitle}
        onUpdateTitle={handleUpdateTitle}
      />

      {/* Floating toolbar for drawing tools and options */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={undo}
        onRedo={redo}
        onClear={clearAllElements}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Main canvas area */}
      <div className="absolute inset-0 pt-36 pb-20 px-6">
        <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 border border-white/30 overflow-hidden relative">
          {/* Decorative background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, #000 1px, transparent 0),
                radial-gradient(circle at 20px 20px, #000 1px, transparent 0)
              `,
              backgroundSize: "20px 20px, 40px 40px",
            }}
          />

          {/* The core drawing canvas component */}
          <WhiteboardCanvas
            whiteboardId={whiteboardId}
            currentUser={profile}
            tool={tool}
            color={color}
            strokeWidth={strokeWidth}
            cursors={cursors}
            elements={elements}
            saveElement={saveElement}
            deleteElements={deleteElements}
            updateCursorPosition={updateCursorPosition}
          />
        </div>
      </div>

      {/* Enhanced status bar at the bottom */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 border border-white/30 px-4 py-2">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">Live</span>
            </div>

            <div className="w-px h-3 bg-gray-300"></div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-600">Elements:</span>
              <span className="font-bold text-gray-900">{elements.length}</span>
            </div>

            <div className="w-px h-3 bg-gray-300"></div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-600">Tool:</span>
              <span className="font-bold text-gray-900 capitalize">{tool}</span>
            </div>

            <div className="w-px h-3 bg-gray-300"></div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-600">Size:</span>
              <span className="font-bold text-gray-900">{strokeWidth}px</span>
            </div>

            <div className="w-px h-3 bg-gray-300"></div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-600">Color:</span>
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating hint for new users on an empty canvas */}
      {elements.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/50 p-6 max-w-sm text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Start Creating!
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Choose a tool from the toolbar above and start drawing on the
              canvas. Your creations will be saved automatically and shared with
              others in real-time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
