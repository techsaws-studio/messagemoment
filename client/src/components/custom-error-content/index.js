"use client";

import React from "react";

import Button from "../button";

function CustomErrorContent() {
  return (
    <div className="error-content">
      <h1>404</h1>
      <h4>The page you’re looking for doesn't exist</h4>
      <p className="small error-return-text">
        Don’t panic, just click the big button below and return home.
      </p>
      <Button
        text="Return to Homepage"
        className="btn-primary text-white responsive-button"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
}

export default CustomErrorContent;
