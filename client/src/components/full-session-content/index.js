'use client'
import React from "react";
import Button from "../button";

function FullSessionContent() {
  return (
    <div className="full-session-content">
      <h4>The chat session is full! There are currently 10/10 users joined</h4>
      <p className="small full-return-text">
        Unfortunately you are unable to enter the chat at this time.
      </p>
      <Button
        text="Return to Homepage"
        className="btn-primary text-white responsive-button"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
}

export default FullSessionContent;
