import Image from "next/image";
import React,{forwardRef} from "react";
import X_white from "@/assets/icons/cross_white.svg";
import globe from "@/assets/icons/globe.svg";
import lock from "@/assets/icons/secure.svg";
import wallet from "@/assets/icons/wallet.svg";

/**
 * MobileDropdownModal
 * 
 * component that renders a dropdown modal for mobile devices.
 * 
 * @component
 * @param {boolean} openMobileModal - Whether the modal is open or not.
 * @param {function} setOpenMobileModal - Function to toggle the modal open state.
 * @param {function} selectOption - Function to handle option selection.
 * @param {boolean} open - Whether the modal is open or not.
 * @param {function} setOpen - Function to toggle the modal open state.
 */
const MobileDropdownModal = forwardRef(({
  openMobileModal,
  setOpenMobileModal,
  selectOption,
  setOpen,
},ref) => {
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
        <div className="row" onClick={() => {
            selectOption("Standard")
        }}>
          <Image
            src={globe}
            className="globe-icon"
          />
          <p>Standard</p>
        </div>
        <div className="divider" />
        <div className="row" onClick={() => {
            selectOption("Secure")
        }}>
          <Image
            src={lock}
            className="lock-icon"
          />
          <p>Secure</p>
        </div>
        <div className="divider" />
        <div className="row" onClick={() => selectOption("Wallet")}>
          <Image
            src={wallet}
            className="globe-icon"
          />
          <p>Wallet</p>
        </div>
      </div>
    </div>
  );
});

export default MobileDropdownModal;
