import React from "react";
import ExpiredSessionContent from "@/components/expired-session-content";
import SessionHeader from "@/components/session-header";


function ExpiredSession() {
  return (
    <>
      <SessionHeader />
      <ExpiredSessionContent />
    </>
  );
}

export default ExpiredSession;
