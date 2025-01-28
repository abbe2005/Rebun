import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import supabase from "../../supabase";
import {
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUsername(user.displayName || "");
        setEmail(user.email || "");
        setPreviewImage(user.photoURL || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    if (!profilePicture) return;

    setIsLoading(true); // Start loading
    try {
      const { data, error } = await supabase.storage
        .from("item_images")
        .upload(`public/${user.uid}/${profilePicture.name}`, profilePicture);

      if (error) throw error;

      const publicUrl = supabase.storage
        .from("item_images")
        .getPublicUrl(data.path);

      await updateProfile(user, { photoURL: publicUrl.data.publicUrl });
      setPreviewImage(publicUrl.data.publicUrl);
      setMessage("Profile picture updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      await updateProfile(user, { displayName: username });
      setMessage("Username updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      await verifyBeforeUpdateEmail(user, email);
      setMessage("Verification email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password);
      setMessage("Password updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("Logged out successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1 className="profile-title">Profile Management</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}

        {/* Profile Picture Upload */}
        <form onSubmit={handleProfilePictureUpload}>
          <div className="profile-picture-preview">
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="profile-picture"
              />
            )}
          </div>
          <input type="file" onChange={handleFileChange} />
          <button
            type="submit"
            className="profile-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Uploading..." : "Upload Profile Picture"}
          </button>
        </form>

        {/* Username Update */}
        <form onSubmit={handleUsernameUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="profile-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Updating..." : "Update Username"}
          </button>
        </form>

        {/* Email Update */}
        <form onSubmit={handleEmailUpdate}>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="profile-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Updating..." : "Update Email"}
          </button>
        </form>

        {/* Password Update */}
        <form onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="profile-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;