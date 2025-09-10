"use client";

import React from "react";
import Image from "next/image";

import Button from "../button";

import Contactus from "@/assets/icons/contactUs.svg";

function FaqContactUs() {
  return (
    <div className="faq-contactus">
      <div className="blur-view" />
      <div className="faq-cs-card">
        <Image src={Contactus} className="msg-icon" />
        <h4>Still need help about a topic not listed?</h4>
        <p className="small">
          A member of our team will respond to your enquiry.
        </p>
        <Button
          text="Contact Us"
          className="btn-primary text-white responsive-button-faq"
          onClick={() => (window.location.href = "/contact-us")}
        />
      </div>
    </div>
  );
}

export default FaqContactUs;
