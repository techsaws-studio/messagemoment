import React, { Fragment } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import FaqHero from "@/components/faq/hero";
import FaqContactUs from "@/components/faq/faq-contact-us";

function Faqs() {
  return (
    <Fragment>
      <Header />
      <FaqHero />
      <FaqContactUs />
      <Footer />
    </Fragment>
  );
}

export default Faqs;
