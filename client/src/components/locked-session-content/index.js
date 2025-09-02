import React from "react";
import Image from "next/image";
import { getYear } from "date-fns";

import Button from "../button";

import LockImg from "@/assets/icons/lock.svg";
import Blur from "@/assets/images/blur.png";

function LockedSessionContent({ sessionId }) {
  const currentYear = getYear(new Date());

  return (
    <div className="expired-container">
      <Image src={Blur} className="blur-img" alt="Blur" />
      <div className="card-wrapper">
        <div className="card locked-card">
          <Image
            src={LockImg}
            alt="locked-session-icon"
            className="locked-sessionIcon"
          />
          <h4 className="locked-title">The chat session is locked</h4>
          <p className="small locked-return-text">
            Unfortunately you are unable to enter the chat at this time.
          </p>
          <div className="locked-btn-flex">
            <Button
              text="Try Again"
              className="btn-primary text-white responsive-button"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/${sessionId}`)
              }
            />
            <Button
              text="Return to Homepage"
              className="btn-primary-border text-white responsive-button"
              onClick={() => (window.location.href = "/")}
            />
          </div>
        </div>
      </div>
      <p className="note text-dark-gray footer-txt">
        Copyright © {currentYear} MessageMoment. All rights reserved.
      </p>
    </div>
  );
}

export default LockedSessionContent;
