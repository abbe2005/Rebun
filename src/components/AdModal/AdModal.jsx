// src/components/AdModal.js
import React, { useState, useEffect } from "react";
import AdImage from "./Ad.png";
import "./AdModal.css"; // Add CSS for the modal

const AdModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the modal when the component mounts
  useEffect(() => {
    const hasSeenAd = localStorage.getItem("hasSeenAd");
    if (!hasSeenAd) {
      setIsVisible(true);
      localStorage.setItem("hasSeenAd", "true"); // Mark as seen
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <img src={AdImage} alt="Advertisement" className="ad-image" />
      </div>
    </div>
  );
};

export default AdModal;