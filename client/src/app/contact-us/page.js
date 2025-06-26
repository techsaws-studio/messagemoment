import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Notification from "@/components/notification";
import React from "react";

function ContactUs() {
  return (
    <>
      <Notification />
      <Header />
      <ContactHero />
      <ContactForm />
      <Footer />
    </>
  );
}

export default ContactUs;
