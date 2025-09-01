"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useClientHydration } from "../../hooks/useClientHydration";
import Button from "../button";
import { Skeleton } from "../skeleton";
import Blur from "@/assets/images/blur.png";
import { getYear } from "date-fns";
import ExpiredsessionImg from "@/assets/icons/expired-session.svg";
import Image from "next/image";

const SessionUrlDisplay = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <p className="small link link-expired">
      https://messagemoment.com/chat/{sessionId || "unknown"}
    </p>
  );
};

const SessionUrlSkeleton = () => (
  <div className="small link loading-container">
    <Skeleton
      width="100%"
      height="16px"
      className="skeleton-inline"
      variant="text"
    />
  </div>
);

function ExpiredSessionContent() {
  const isHydrated = useClientHydration();
  const currentYear = getYear(new Date());
  return (
    <>
      {/* new changes  */}
      <div className="expired-container">
        <Image src={Blur} className="blur-img" alt="Blur" />
        <div className="card-wrapper">
          <div className="card">
            <Image
              src={ExpiredsessionImg}
              alt="session-icon"
              className="session-icon"
            />
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
        </div>
        <p className="note text-dark-gray footer-txt">
          Copyright © {currentYear} MessageMoment. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default ExpiredSessionContent;
