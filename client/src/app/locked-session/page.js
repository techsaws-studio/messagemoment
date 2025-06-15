import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import React from "react";
import LockImg from "@/assets/icons/lock.svg"
import LockedSessionContent from "@/components/locked-session-content";

function LockedSession() {
  return (
    <>
    <SessionHeader />
    <Session imgName={LockImg} >
    <LockedSessionContent />
    </Session>
    </>
  )
}

export default LockedSession;
