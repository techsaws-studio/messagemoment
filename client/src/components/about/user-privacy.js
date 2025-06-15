import Image from "next/image";
import userSecurity from "@/assets/images/userPrivacy.svg";
import React from "react";

function UserPrivacy() {
  return (
    <div className="user-privacy container">
      <Image src={userSecurity} />
      <div className="column2">
        <h2>We take the privacy of our users seriously</h2>
        <p className="small">
          We have implemented the appropriate security measures to protect your
          data. We understand the importance of having a safe and secure space
          to communicate, and MessageMoment provides just that.
        </p>
      </div>
    </div>
  );
}

export default UserPrivacy;
