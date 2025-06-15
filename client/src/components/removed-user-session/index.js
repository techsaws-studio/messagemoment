"use client";
import React from "react";
import Button from "../button";

function RemovedUserSession() {
  return (
    <div className="removedUser-content">
      <h4>You have been removed from the chat session</h4>
      <p className="small locked-return-text">
        Please contact the host if you believe this was a mistake.
      </p>
      <Button
        text="Return to Homepage"
        className="btn-primary text-white responsive-button"
        onClick={() => (window.location.href = "/")}
      />
    </div>
    
  );
}

export default RemovedUserSession;
