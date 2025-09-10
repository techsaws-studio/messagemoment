import React, { Fragment } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

import qrCodeFrame from "@/assets/icons/qr_frame.svg";

const QrCode = ({ url, isMobileVersion }) => {
  return (
    <div className="qr-container">
      {isMobileVersion ? (
        <div className="qr-code-container">
          <QRCodeSVG value={url} className="qr-code" />
        </div>
      ) : (
        <Fragment>
          <Image draggable={false} src={qrCodeFrame} alt="qr code frame" />
          <QRCodeSVG value={url} className="qr-code" />
        </Fragment>
      )}
    </div>
  );
};

export default QrCode;
