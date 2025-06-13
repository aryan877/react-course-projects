import defaultAvatar from "../assets/default-avatar.svg";
import "./ProfileCard.css";

/**
 * ProfileCard component displays user profile information
 * @param {Object} props - Component props
 * @param {Object} props.profileData - Profile data object
 * @param {string} props.profileData.name - User's name
 * @param {string} props.profileData.title - User's job title
 * @param {string} props.profileData.bio - User's biography
 * @param {string} props.profileData.socialLink - User's social media link
 * @param {string} props.profileData.profileImage - User's profile image URL
 */
const ProfileCard = ({ profileData }) => {
  // Check if we have any content to display
  const hasContent = profileData.name && profileData.name !== "Your Name";

  // Extract domain name from social link for display
  const getSocialPlatform = (url) => {
    if (!url) return "Visit Profile";

    try {
      const domain = new URL(url).hostname.replace("www.", "");
      const platform = domain.split(".")[0];
      return platform.charAt(0).toUpperCase() + platform.slice(1);
    } catch {
      return "Visit Profile";
    }
  };

  // Handle image error by falling back to default avatar
  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <div className="profile-card-container">
      <div className={`profile-card ${hasContent ? "has-content" : "empty"}`}>
        {/* Card Header with Profile Image */}
        <div className="card-header">
          <div className="profile-image-container">
            <img
              src={profileData.profileImage || defaultAvatar}
              alt={profileData.name || "Profile"}
              className="profile-image"
              onError={handleImageError}
            />
            <div className="image-overlay"></div>
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          {/* Name Section */}
          <div className="name-section">
            <h3 className="profile-name">{profileData.name || "Your Name"}</h3>
            {profileData.title && (
              <p className="profile-title">{profileData.title}</p>
            )}
          </div>

          {/* Bio Section */}
          {profileData.bio && (
            <div className="bio-section">
              <p className="profile-bio">{profileData.bio}</p>
            </div>
          )}

          {/* Social Link Section */}
          {profileData.socialLink && (
            <div className="social-section">
              <a
                href={profileData.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">🔗</span>
                {getSocialPlatform(profileData.socialLink)}
              </a>
            </div>
          )}

          {/* Empty State */}
          {!hasContent && (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p className="empty-text">
                Start filling out the form and click save to see your profile
                card!
              </p>
            </div>
          )}
        </div>

        {/* Card Footer with Decorative Element */}
        <div className="card-footer">
          <div className="decorative-line"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
