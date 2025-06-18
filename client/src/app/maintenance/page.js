import React from "react";

import MaintenanceContent from "@/components/maintenance-content";
import SessionHeader from "@/components/session-header";
import Session from "@/components/session/session";

import maintenanceImg from "@/assets/icons/maintenance.svg"

function Maintenance() {
  return (
    <>
      <SessionHeader />
      <Session imgName={maintenanceImg}>
        <MaintenanceContent />
      </Session>
    </>
  );
}

export default Maintenance;
