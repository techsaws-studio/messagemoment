"use client";

import React, { Fragment, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import SessionHeader from "@/components/session-header";
import LockedSessionContent from "@/components/locked-session-content";
import PageLoader from "@/components/page-loader";

function LockedSessionWrapper() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return <LockedSessionContent sessionId={sessionId} />;
}

export default function LockedSessionPage() {
  return (
    <Fragment>
      <SessionHeader />
      <Suspense fallback={<PageLoader />}>
        <LockedSessionWrapper />
      </Suspense>
    </Fragment>
  );
}
