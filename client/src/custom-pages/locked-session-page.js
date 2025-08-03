"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import LockedSessionContent from "@/components/locked-session-content";
import PageLoader from "@/components/page-loader";

import LockImg from "@/assets/icons/lock.svg";

function LockedSessionWrapper() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <Session imgName={LockImg}>
      <LockedSessionContent sessionId={sessionId} />
    </Session>
  );
}

export default function LockedSessionPage() {
  return (
    <>
      <SessionHeader />
      <Suspense fallback={<PageLoader />}>
        <LockedSessionWrapper />
      </Suspense>
    </>
  );
}
