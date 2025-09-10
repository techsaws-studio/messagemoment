import React, { forwardRef } from "react";
import Image from "next/image";

import { SessionTypeEnum } from "@/enums/session-type-enum";

import X_white from "@/assets/icons/cross_white.svg";
import globe from "@/assets/icons/globe.svg";
import lock from "@/assets/icons/secure.svg";
import wallet from "@/assets/icons/wallet.svg";

const MobileDropdownModal = forwardRef(
  ({ openMobileModal, setOpenMobileModal, selectOption, setOpen }, ref) => {
    return (
      <div
        ref={ref}
        className={`cloudflare-modal ${openMobileModal && "cloudflare-open"}`}
      >
        {/* header */}
        <div className="head">
          <p>Select Chat Type</p>
          <Image
            src={X_white}
            onClick={() => {
              setOpenMobileModal(false);
              setOpen(false);
            }}
          />
        </div>
        {/* body */}
        <div className="body">
          <div
            className="row"
            onClick={() => {
              selectOption(SessionTypeEnum.STANDARD);
            }}
          >
            <Image src={globe} className="globe-icon" />
            <p>Standard</p>
          </div>
          <div className="divider" />
          <div
            className="row"
            onClick={() => {
              selectOption(SessionTypeEnum.SECURE);
            }}
          >
            <Image src={lock} className="lock-icon" />
            <p>Secure</p>
          </div>
          <div className="divider" />
          <div
            className="row"
            onClick={() => selectOption(SessionTypeEnum.WALLET)}
          >
            <Image src={wallet} className="globe-icon" />
            <p>Wallet</p>
          </div>
        </div>
      </div>
    );
  }
);

export default MobileDropdownModal;
