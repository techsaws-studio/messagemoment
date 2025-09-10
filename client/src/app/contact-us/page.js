import React, { Fragment } from "react";

import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Notification from "@/components/notification";

function ContactUs() {
  return (
    <Fragment>
      <Notification />
      <Header />
      <ContactHero />
      <ContactForm />
      <Footer />
    </Fragment>
  );
}

export default ContactUs;
