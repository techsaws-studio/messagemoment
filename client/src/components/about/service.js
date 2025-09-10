"use client";

import React, { Fragment, useRef } from "react";
import Image from "next/image";

import Insight from "@/assets/icons/insight.svg";
import featureImg1 from "@/assets/images/featureImg1.svg";
import featureImg2 from "@/assets/images/featureImg2.svg";
import featureImg3 from "@/assets/images/featureImg3.svg";

function Service() {
  const data = [featureImg1, featureImg2, featureImg3];

  const imageRefs = useRef([]);

  return (
    <Fragment>
      <div className="about-service-wrapper container">
        <div className="about-service">
          <Image src={Insight} className="insight-img" />
          <h3>
            We are dedicated to delivering an unparalleled user experience and
            are always looking for ways to improve our services.
          </h3>
          <p className="note-jet about-qa">
            If you have any questions, concerns, feedback or would like to
            advertise with MessageMoment, please do not hesitate to{" "}
            <span className="underline-link">
              <a href="/contact-us">Contact Us</a>
            </span>
            .
          </p>
          <div className="feature-img">
            {data.map((val, index) => (
              <Image
                ref={(el) => (imageRefs.current[index] = el)}
                key={`feature-image-${index.toString()}`}
                className={`${
                  index == 1 ? `feature-img-middle` : "feature-other-img"
                }`}
                src={val}
              />
            ))}
          </div>
        </div>
        <p className="service-footer small">
          Enjoy secure, text-based command-driven chats with MessageMoment. Our
          platform also offers robust features for seamless project
          collaboration. Leverage our partnership with FileMoment, our sister
          platform specializing in secure file sharing, to easily exchange files
          and documents within your chat sessions. With simple commands and
          encrypted communication, your projects remain confidential and
          accessible only to authorized collaborators.
        </p>
      </div>
    </Fragment>
  );
}

export default Service;
