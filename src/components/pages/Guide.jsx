import React from "react";
import "./styles/Guide.css";

const Guide = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Guide</h1>
      <div className="guide-content">
        <div className="guide-step">
          <h2>Step 1: Sign Up</h2>
          <p>Create an account to get started.</p>
        </div>
        <div className="guide-step">
          <h2>Step 2: Explore</h2>
          <p>Browse through the market and find what you need.</p>
        </div>
        <div className="guide-step">
          <h2>Step 3: Connect</h2>
          <p>Message sellers and make deals.</p>
        </div>
      </div>
    </div>
  );
};

export default Guide;