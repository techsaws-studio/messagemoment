import React, { Fragment } from "react";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import FullSessionContent from "@/components/full-session-content";

import FullSessionImg from "@/assets/icons/full-session.svg";

function FullSession() {
  return (
    <Fragment>
      <SessionHeader />
      <Session key={`full-session`} imgName={FullSessionImg}>
        <FullSessionContent />
      </Session>
    </Fragment>
  );
}

export default FullSession;
