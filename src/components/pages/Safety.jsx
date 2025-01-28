import React from "react";
import "./styles/Safety.css";

const Safety = () => {
  return (
    <div className="safety-container">
      <h1 className="safety-title">Safety Tips</h1>
      <div className="safety-tips">
        <div className="safety-tip">
          <h2>Tip 1: Verify Sellers</h2>
          <p>Always check the seller's reputation before making a purchase.</p>
        </div>
        <div className="safety-tip">
          <h2>Tip 2: Use Secure Payment</h2>
          <p>Only use secure payment methods to protect your money.</p>
        </div>
        <div className="safety-tip">
          <h2>Tip 3: Meet in Public</h2>
          <p>If meeting in person, choose a public location.</p>
        </div>
      </div>
    </div>
  );
};

export default Safety;