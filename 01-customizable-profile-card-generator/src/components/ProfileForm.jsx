import { useActionState, useState } from "react";
import "./ProfileForm.css";

/**
 * ProfileForm component for editing user profile information
 * @param {Object} props - Component props
 * @param {Object} props.profileData - Current profile data
 * @param {Function} props.updateProfileAction - Server action to update profile
 * @param {Function} props.clearProfileAction - Server action to clear profile
 */
const ProfileForm = ({
  profileData,
  updateProfileAction,
  clearProfileAction,
}) => {
  const [result, submitAction, isPending] = useActionState(
    updateProfileAction,
    { message: null }
  );

  const [clearResult, clearSubmitAction, isClearPending] = useActionState(
    clearProfileAction,
    { message: null }
  );

  // Local state for form validation errors
  const [errors, setErrors] = useState({});

  // Character counts for textarea
  const [bioLength, setBioLength] = useState(profileData.bio?.length || 0);

  // Validate form fields
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "socialLink":
        if (value && !isValidUrl(value)) {
          error = "Please enter a valid URL";
        }
        break;
      default:
        break;
    }

    return error;
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

  // Handle field blur for real-time validation
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle field focus to clear errors
  const handleFieldFocus = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle bio change for character count
  const handleBioChange = (e) => {
    setBioLength(e.target.value.length);
  };

  return (
    <div className="profile-form">
      <h2 className="form-title">Edit Your Profile</h2>

      {/* Update Form */}
      <form action={submitAction} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? "error" : ""}`}
            defaultValue={profileData.name}
            placeholder="Your Name"
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            disabled={isPending}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Professional Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            defaultValue={profileData.title}
            placeholder="Professional Title"
            disabled={isPending}
          />
          <div className="form-hint">What do you do professionally?</div>
        </div>

        <div className="form-group">
          <label htmlFor="bio" className="form-label">
            Bio
            <span className="char-count">{bioLength}/500</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-textarea"
            defaultValue={profileData.bio}
            placeholder="Tell us about yourself..."
            maxLength="500"
            onChange={handleBioChange}
            disabled={isPending}
          />
          <div className="form-hint">
            Share a brief description about yourself
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="socialLink" className="form-label">
            Social Media Link
          </label>
          <input
            id="socialLink"
            name="socialLink"
            type="url"
            className={`form-input ${errors.socialLink ? "error" : ""}`}
            defaultValue={profileData.socialLink}
            placeholder="https://twitter.com/yourhandle"
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            disabled={isPending}
          />
          {errors.socialLink && (
            <div className="error-message">{errors.socialLink}</div>
          )}
          <div className="form-hint">Link to your social media profile</div>
        </div>

        <div className="form-group">
          <label htmlFor="profileImage" className="form-label">
            Profile Image URL
          </label>
          <input
            id="profileImage"
            name="profileImage"
            type="url"
            className="form-input"
            defaultValue={profileData.profileImage}
            placeholder="https://example.com/your-photo.jpg"
            disabled={isPending}
          />
          <div className="form-hint">Direct link to your profile image</div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* Show result messages */}
        {result?.message && (
          <div
            className={`${
              result.success ? "success-message" : "error-message"
            }`}
          >
            {result.message}
          </div>
        )}
      </form>

      {/* Clear Form */}
      <form action={clearSubmitAction} className="form">
        <div className="form-actions">
          <button
            type="submit"
            disabled={isClearPending}
            className="btn btn-secondary"
          >
            {isClearPending ? "Clearing..." : "Clear Profile"}
          </button>
        </div>

        {clearResult?.message && (
          <div
            className={`${
              clearResult.success ? "success-message" : "error-message"
            }`}
          >
            {clearResult.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
