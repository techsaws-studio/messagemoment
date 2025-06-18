import React from "react";

import ExpiredSessionContent from "@/components/expired-session-content";
import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";

import ExpiredsessionImg from "@/assets/icons/expired-session.svg";

function ExpiredSession() {
  return (
    <>
      <SessionHeader />
      <Session key={`expired-session`} imgName={ExpiredsessionImg}>
        <ExpiredSessionContent />
      </Session>
    </>
  );
}

export default ExpiredSession;
