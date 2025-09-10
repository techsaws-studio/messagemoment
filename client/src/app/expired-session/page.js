import React, { Fragment } from "react";

import ExpiredSessionContent from "@/components/expired-session-content";
import SessionHeader from "@/components/session-header";

function ExpiredSession() {
  return (
    <Fragment>
      <SessionHeader />
      <ExpiredSessionContent />
    </Fragment>
  );
}

export default ExpiredSession;
