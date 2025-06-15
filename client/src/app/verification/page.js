import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import React from "react";
import KeyImg from "@/assets/icons/key.svg";
import VerificationContent from "@/components/verification-content";
function Verification() {
  return (
    <>
      <SessionHeader />
      <Session imgName={KeyImg}>
        <VerificationContent />
      </Session>
    </>
  );
}

export default Verification;
