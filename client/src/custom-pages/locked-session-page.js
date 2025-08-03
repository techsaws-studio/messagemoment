"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import LockedSessionContent from "@/components/locked-session-content";

import LockImg from "@/assets/icons/lock.svg";

function LockedSessionPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <>
      <SessionHeader />
      <Session imgName={LockImg}>
        <LockedSessionContent sessionId={sessionId} />
      </Session>
    </>
  );
}

export default LockedSessionPage;
