import React from "react";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import LockedSessionContent from "@/components/locked-session-content";

import LockImg from "@/assets/icons/lock.svg"

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
