import React, { Fragment } from "react";
import Image from "next/image";

import Cloudflare from "./cloudflare";

import banner from "../../../src/assets/images/banner.jpeg";
import heroBanner from "../../../src/assets/images/hero-img.jpg";

const Hero = () => {
  return (
    <Fragment>
      <section className="hero bg-layer">
        <div className="hero-content container">
          <Image className="hero-banner-img" src={banner} alt="banner" />
          <Image
            className="hero-banner-img-mobile"
            src={heroBanner}
            alt="banner-mobile-view"
          />
          <h1 className="text-white ">The real meaning to personal</h1>
          <h5 className="text-white">
            A convenient and secure platform for discreet conversations between
            known parties
          </h5>
        </div>
        <Cloudflare />
      </section>
    </Fragment>
  );
};

export default Hero;
