import {
  Check,
  Crown,
  Edit3,
  LogOut,
  Settings,
  Share2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { updateWhiteboardTitle } from "../lib/db";

/**
 * A component that displays the top bar of the whiteboard UI.
 * It is responsible for:
 * - Displaying and allowing edits to the whiteboard title.
 * - Showing the list of currently active users via presence avatars.
 * - Providing a "Share" button to copy the whiteboard link.
 * - Housing the user menu with a "Sign Out" option.
 *
 * This component is separate from the canvas drawing logic and focuses purely
 * on metadata and user presence information.
 *
 * @param {object} props - The component's props.
 * @returns {JSX.Element}
 */
export function UserPresence({
  whiteboardId,
  currentUser,
  activeUsers, // from real-time presence channel in WhiteboardApp
  onSignOut, // auth flow back to WhiteboardApp
  whiteboardTitle, // from WhiteboardApp state
  onUpdateTitle, // callback to update WhiteboardApp state after DB save
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(whiteboardTitle);
  const [shareSuccess, setShareSuccess] = useState(false);

  /**
   * Handles the update of the whiteboard title.
   * It calls the database function and, on success, updates the parent state.
   */
  const handleUpdateTitle = async () => {
    if (!titleInput.trim()) return;

    try {
      const { error } = await updateWhiteboardTitle(
        whiteboardId,
        titleInput.trim()
      );

      if (error) throw error;

      onUpdateTitle(titleInput.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  /**
   * Handles sharing the whiteboard. It uses the Web Share API if available,
   * otherwise falls back to copying the URL to the clipboard.
   */
  const shareWhiteboard = async () => {
    const url = `${window.location.origin}/?whiteboard=${whiteboardId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: whiteboardTitle,
          text: "Check out this collaborative whiteboard!",
          url,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  /**
   * Helper function to copy text to the user's clipboard.
   * @param {string} text - The text to copy.
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const otherActiveUsers = activeUsers.filter(
    (user) => user.user_id !== currentUser?.id
  );

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        {/* Title Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 border border-white/30 px-4 py-2 max-w-md">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateTitle();
                  if (e.key === "Escape") {
                    setTitleInput(whiteboardTitle);
                    setIsEditingTitle(false);
                  }
                }}
                className="bg-transparent border-none outline-none text-lg font-bold text-gray-900 min-w-[200px] placeholder:text-gray-400"
                placeholder="Enter whiteboard title..."
                autoFocus
              />
              <button
                onClick={handleUpdateTitle}
                className="p-1 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setTitleInput(whiteboardTitle);
                  setIsEditingTitle(false);
                }}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className="truncate max-w-[300px]">{whiteboardTitle}</span>
              <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={shareWhiteboard}
            className={`group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 ${
              shareSuccess ? "from-green-500 to-emerald-600" : ""
            }`}
          >
            {shareSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span className="font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Share</span>
              </>
            )}
          </button>

          {/* Active Users Display */}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 border border-white/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {otherActiveUsers.length + 1}
                </span>
              </div>

              <div className="flex items-center -space-x-1.5">
                {/* Current User - Always First */}
                <div className="relative group">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold relative z-10"
                    style={{ backgroundColor: currentUser?.avatar_color }}
                    title={`${currentUser?.display_name} (You)`}
                  >
                    {currentUser?.display_name?.charAt(0).toUpperCase()}
                    <Crown className="absolute -top-0.5 -right-0.5 w-3 h-3 text-yellow-500 bg-white rounded-full p-0.5" />
                  </div>
                </div>

                {/* Other Active Users */}
                {otherActiveUsers.slice(0, 4).map((user, index) => (
                  <div key={user.user_id} className="relative group">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 hover:z-20 relative"
                      style={{
                        backgroundColor: user.profiles?.avatar_color,
                        zIndex: 10 - index,
                      }}
                      title={user.profiles?.display_name}
                    >
                      {user.profiles?.display_name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}

                {otherActiveUsers.length > 4 && (
                  <div className="w-8 h-8 rounded-lg border-2 border-white shadow-md bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold">
                    +{otherActiveUsers.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 border border-white/30 p-2 hover:bg-white transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl shadow-black/20 border border-white/30 py-1 z-50">
                <button
                  onClick={onSignOut}
                  className="w-full px-3 py-2 text-left hover:bg-red-50/80 flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
