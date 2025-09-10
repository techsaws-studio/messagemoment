import React, { Fragment } from "react";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import VerificationContent from "@/components/verification-content";

import KeyImg from "@/assets/icons/key.svg";

function Verification() {
  return (
    <Fragment>
      <SessionHeader />
      <Session imgName={KeyImg}>
        <VerificationContent />
      </Session>
    </Fragment>
  );
}

export default Verification;
