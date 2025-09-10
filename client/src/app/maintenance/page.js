import React, { Fragment } from "react";

import MaintenanceContent from "@/components/maintenance-content";
import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";

import maintenanceImg from "@/assets/icons/maintenance.svg";

function Maintenance() {
  return (
    <Fragment>
      <SessionHeader />
      <Session imgName={maintenanceImg}>
        <MaintenanceContent />
      </Session>
    </Fragment>
  );
}

export default Maintenance;
