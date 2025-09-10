import React, { forwardRef } from "react";
import Image from "next/image";

import QrCode from "../qrcode";

import X_white from "@/assets/icons/cross_white.svg";

const MobileQrScannerModal = forwardRef(
  ({ openQrMobileModal, setOpenQrMobileModal, url }, ref) => {
    return (
      <div
        ref={ref}
        className={`cloudflare-modal ${
          openQrMobileModal && "cloudflare-open-qr"
        }`}
      >
        <div className="head">
          <p>Scan QR Code</p>
          <Image src={X_white} onClick={() => setOpenQrMobileModal(false)} />
        </div>
        <div className="body-qrScan">
          <QrCode url={url} isMobileVersion />
        </div>
      </div>
    );
  }
);

export default MobileQrScannerModal;
