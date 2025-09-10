import React, { Fragment } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import PrivacyBody from "@/components/privacy/body";

function Privacy() {
  return (
    <Fragment>
      <Header />
      <PrivacyBody />
      <Footer />
    </Fragment>
  );
}

export default Privacy;
