import FaqContactUs from "@/components/faq/faq-contact-us";
import FaqHero from "@/components/faq/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

function Faqs() {
  return (
    <>
      <Header />
      <FaqHero />
      <FaqContactUs />
      <Footer />
    </>
  );
}

export default Faqs;
