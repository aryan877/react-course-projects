import { useState } from "react";
import "./App.css";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";

/**
 * Main App component that manages profile state and provides server actions
 */
function App() {
  // State to manage profile data
  const [profileData, setProfileData] = useState({
    name: "Your Name",
    title: "Professional Title",
    bio: "Tell us about yourself...",
    socialLink: "",
    profileImage: "",
  });

  // Server Action to update profile data
  const updateProfile = async (prevState, formData) => {
    // This is a mock async function.
    // In a real app, you would make an API call here.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Extract data from FormData
    const name = formData.get("name");
    const title = formData.get("title");
    const bio = formData.get("bio");
    const socialLink = formData.get("socialLink");
    const profileImage = formData.get("profileImage");

    // Basic server-side validation
    if (!name || name.trim().length < 2) {
      return {
        success: false,
        message: "Name must be at least 2 characters long",
      };
    }

    if (socialLink && !isValidUrl(socialLink)) {
      return {
        success: false,
        message: "Please provide a valid URL for social link",
      };
    }

    if (profileImage && !isValidUrl(profileImage)) {
      return {
        success: false,
        message: "Please provide a valid URL for profile image",
      };
    }

    // Update the profile data
    const updatedProfile = {
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      socialLink: socialLink.trim(),
      profileImage: profileImage.trim(),
    };

    setProfileData(updatedProfile);

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  };

  // Server Action to clear profile data
  const clearProfile = async () => {
    // This is a mock async function.
    // In a real app, you would make an API call here.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Reset to default values
    const defaultProfile = {
      name: "Your Name",
      title: "Professional Title",
      bio: "Tell us about yourself...",
      socialLink: "",
      profileImage: "",
    };

    setProfileData(defaultProfile);

    return {
      success: true,
      message: "Profile cleared successfully!",
    };
  };

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="app">
      <title>Profile Card Generator - React 19</title>
      {/* Header Section */}
      <header className="app-header">
        <h1>Profile Card Generator</h1>
        <p>Create beautiful profile cards in real-time with React 19</p>
      </header>

      {/* Main Content Container */}
      <main className="app-main">
        <div className="container">
          {/* Form Section */}
          <div className="form-section">
            <ProfileForm
              profileData={profileData}
              updateProfileAction={updateProfile}
              clearProfileAction={clearProfile}
            />
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <h2 className="preview-title">Live Preview</h2>
            <ProfileCard profileData={profileData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
