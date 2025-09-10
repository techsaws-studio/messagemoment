import React from "react";
import Image from "next/image";

import Button from "../button";

import messageSend from "@/assets/icons/messageSend.svg";

const ContactUsSuccessModal = ({ onPressOk }) => {
  return (
    <div className="contact-modal">
      <div className="blur-view2" />
      <div className="contact-modal-wrapper">
        <Image src={messageSend} className="msg-icon" />
        <h4>Message Sent</h4>
        <p className="small">
          We’ve received your message. A MessageMoment team member will be in
          contact with you soon. Thank you.
        </p>
        <Button
          text="Ok"
          width="236px"
          height="46px"
          className={`text-white btn-primary`}
          onClick={onPressOk}
        />
      </div>
    </div>
  );
};

export default ContactUsSuccessModal;
