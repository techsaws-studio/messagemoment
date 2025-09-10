import React from "react";
import Image from "next/image";
import Link from "next/link";

import Contactus from "@/assets/icons/contactUs.svg";

function ContactHero() {
  return (
    <div className="contact-wrapper">
      <Image src={Contactus} />
      <h3>Contact Us</h3>
      <p>
        Need answers or help? We might have answered your question in our{" "}
        <span className="contact-fq">
          <Link href="/faqs">FAQs</Link>.
        </span>
      </p>
      <p className="text-2">
        Otherwise complete this form on the topic relevant to your query.
      </p>
    </div>
  );
}

export default ContactHero;
