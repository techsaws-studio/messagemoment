"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useClientHydration } from "../../hooks/useClientHydration";

import Button from "../button";
import { Skeleton } from "../skeleton";

const SessionUrlDisplay = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <p
      className="small link"
      // style={{
      //   wordBreak: "break-all",
      //   overflowWrap: "break-word",
      //   whiteSpace: "normal",
      // }}
    >
      https://messagemoment.com/chat/{sessionId || "unknown"}
    </p>
  );
};

const SessionUrlSkeleton = () => (
  <div className="small link loading-container">
    <Skeleton
      width="280px"
      height="16px"
      className="skeleton-inline"
      variant="text"
    />
  </div>
);

function ExpiredSessionContent() {
  const isHydrated = useClientHydration();

  return (
    <div className="expired-content">
      <h4>
        The chat session you were invited to with this link is no longer
        available
      </h4>

      {isHydrated ? (
        <Suspense fallback={<SessionUrlSkeleton />}>
          <SessionUrlDisplay />
        </Suspense>
      ) : (
        <SessionUrlSkeleton />
      )}

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
