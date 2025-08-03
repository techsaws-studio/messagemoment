import React from "react";

import Button from "../button";

function LockedSessionContent({ sessionId }) {
  return (
    <div className="locked-content">
      <h4>The chat session is locked</h4>
      <p className="small locked-return-text">
        Unfortunately you are unable to enter the chat at this time.
      </p>
      <Button
        text="Return to Homepage"
        className="btn-primary text-white responsive-button"
        onClick={() =>
          (window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/${sessionId}`)
        }
      />
    </div>
  );
}

export default LockedSessionContent;
