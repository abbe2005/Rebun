import React from "react";
import "./styles/Guide.css";

const Guide = () => {
  return (
<div className="guide-container">
  <h1 className="guide-title">FAQ</h1>
  <div className="guide-content">
    <div className="guide-step">
      <h2>What is Rebun?</h2>
      <p>Rebun is your all-in-one marketplace for buying, renting, and selling.</p>
    </div>
    <div className="guide-step">
      <h2>When did it start?</h2>
      <p>We started developing this idea in December 2024 and continue to improve daily.</p>
    </div>
    <div className="guide-step">
      <h2>How can I create an account?</h2>
      <p>Click on the "Sign Up" button at the top of the page and follow the simple registration steps.</p>
    </div>
    <div className="guide-step">
      <h2>Is Rebun free to use?</h2>
      <p>Yes, creating an account and browsing the marketplace is completely free. Additional premium features may be available soon.</p>
    </div>
    <div className="guide-step">
      <h2>How do I contact a seller?</h2>
      <p>Use the built-in messaging feature to connect directly with sellers and negotiate deals.</p>
    </div>
    <div className="guide-step">
      <h2>Is my information secure?</h2>
      <p>We prioritize your privacy and security. All your data is encrypted and handled with care.</p>
    </div>
    <div className="guide-step">
      <h2>What types of items can I sell?</h2>
      <p>You can sell a wide range of items, from electronics and furniture to vehicles and rental properties.</p>
    </div>
    <div className="guide-step">
      <h2>How can I report a suspicious listing?</h2>
      <p>If you encounter a suspicious listing, click the "Report" button on the item page, and our team will investigate promptly.</p>
    </div>
    <div className="guide-step">
      <h2>How often is Rebun updated?</h2>
      <p>Our team works tirelessly to bring new features and improvements to the platform on a regular basis.</p>
    </div>
  </div>
</div>

  );
};

export default Guide;