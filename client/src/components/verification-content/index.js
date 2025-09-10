"use client";

import React from "react";

import CustomTurnstile from "../custom-turnstile";

function VerificationContent() {
  return (
    <div className="verification-content">
      <h4>Checking if the site connection is secure</h4>
      <div className="turnsite">
        <CustomTurnstile key={"cloudflare-custom-turnstile"} />
      </div>
    </div>
  );
}

export default VerificationContent;
