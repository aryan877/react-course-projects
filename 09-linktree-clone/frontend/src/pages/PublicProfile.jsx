import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`/api/users/${username}`);
      setProfile(response.data);
    } catch {
      setError("Profile not found");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLinkClick = async (linkId, url) => {
    try {
      await axios.post(`/api/links/${linkId}/click`);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error tracking click:", error);
      window.open(url, "_blank");
    }
  };

  const getThemeClasses = (theme) => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 text-white";
      case "colorful":
        return "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white";
      default:
        return "bg-gray-50 text-gray-900";
    }
  };

  const getLinkClasses = (theme) => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 hover:bg-gray-700 text-white border-gray-700";
      case "colorful":
        return "bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm";
      default:
        return "bg-white hover:bg-gray-50 text-gray-900 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClasses(profile.user.theme)}`}>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {profile.user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {profile.user.displayName}
          </h1>
          <p className="text-lg opacity-80">@{profile.user.username}</p>
          {profile.user.bio && (
            <p className="mt-4 opacity-90">{profile.user.bio}</p>
          )}
        </div>

        <div className="space-y-4">
          {profile.links.length === 0 ? (
            <p className="text-center opacity-70">No links available</p>
          ) : (
            profile.links.map((link) => (
              <button
                key={link._id}
                onClick={() => handleLinkClick(link._id, link.url)}
                className={`w-full p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${getLinkClasses(
                  profile.user.theme
                )}`}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{link.title}</h3>
                  {link.description && (
                    <p className="text-sm opacity-80 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="text-center mt-12 opacity-60">
          <p className="text-sm">
            Create your own link page with LinkTree Clone
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
