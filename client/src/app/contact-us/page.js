import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

function ContactUs() {
  return (
    <>
      <Header />
      <ContactHero/>
      <ContactForm/>
      <Footer/>
    </>
  );
}

export default ContactUs;
