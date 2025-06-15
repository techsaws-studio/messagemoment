import React from "react";
import FullSessionImg from "@/assets/icons/full-session.svg";
import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import FullSessionContent from "@/components/full-session-content";

function FullSession() {
  return (
    <>
      <SessionHeader />
      <Session key={`full-session`} imgName={FullSessionImg}>
        <FullSessionContent/>
      </Session>
    </>
  );
}

export default FullSession;
