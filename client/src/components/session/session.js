import React from "react";
import Image from "next/image";
import { getYear } from "date-fns";

import Blur from "@/assets/images/blur.png";

function Session({ imgName, height = 400, children, showFooter = true }) {
  const currentYear = getYear(new Date());

  return (
    <div className="session-section">
      <Image src={Blur} className="blur-img" alt="Blur" />
      <div className="session-card" style={{ height }}>
        <Image src={imgName} className="session-icon" alt="session-icon" />
        {children}
      </div>
      {showFooter && (
        <p className="note text-dark-gray footer-txt">
          Copyright © {currentYear} MessageMoment. All rights reserved.
        </p>
      )}
    </div>
  );
}

export default Session;
