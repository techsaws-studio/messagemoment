'use client';
import React from "react";
import Button from "../button";

function ExpiredSessionContent() {
  return (
    <div className="expired-content">
      <h4>
        The chat session you were invited to with this link is no longer
        available
      </h4>
      <p className="small link">https://messagemoment.com/5qjjc37f9sn</p>
      <p className="small return-text">
        Return to the homepage to generate a new chat session.
      </p>
      <Button
        text="Return to Homepage"
        className="btn-primary text-white responsive-button"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
}

export default ExpiredSessionContent;
