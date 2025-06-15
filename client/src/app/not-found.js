import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import React from "react";
import ExpiredsessionImg from "@/assets/icons/expired-session.svg";
import CustomErrorContent from "@/components/custom-error-content";

const NotFound = () => {
  return (
    <div className="error-404">
      <SessionHeader />
      <Session height={430} key={`eror-found`} imgName={ExpiredsessionImg}>
        <CustomErrorContent />
      </Session>
    </div>
  );
};

export default NotFound;
