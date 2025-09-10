import React, { Fragment } from "react";

import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";
import RemovedUserSession from "@/components/removed-user-session";

import removedUser from "@/assets/icons/remove_user.svg";

const RemovedUser = () => {
  return (
    <Fragment>
      <SessionHeader />
      <Session imgName={removedUser}>
        <RemovedUserSession />
      </Session>
    </Fragment>
  );
};

export default RemovedUser;
