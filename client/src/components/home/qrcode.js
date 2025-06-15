import React from "react";
import qrCodeFrame from "@/assets/icons/qr_frame.svg";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

/**
 * Generates a QR code with a frame for desktop or a simple QR code for mobile.
 * @param {string} url - the url to be encoded in the QR code
 * @param {boolean} isMobileVersion - whether to render the frame or not
 * @returns {React.ReactElement} the QR code component
 */
const QrCode = ({ url, isMobileVersion }) => {
  return (
    <div className="qr-container">
      {isMobileVersion ? (
        <div className="qr-code-container">
          <QRCodeSVG value={url} className="qr-code" />
        </div>
      ) : (
        <>
          <Image draggable={false} src={qrCodeFrame} alt="qr code frame" />
          <QRCodeSVG value={url} className="qr-code" />
        </>
      )}
    </div>
  );
};

export default QrCode;
