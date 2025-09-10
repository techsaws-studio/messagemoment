"use client";

import React, { Fragment, useRef } from "react";
import Image from "next/image";

import { SessionTypeEnum } from "@/enums/session-type-enum";

import { chatContext } from "@/contexts/chat-context";

import scroll_down from "../../../src/assets/icons/scroll_down.svg";
import banner from "../../../src/assets/images/converse.png";

const Converse = () => {
  const { dropdownSelected } = chatContext();
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    const elementPosition =
      sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const offset = 90;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      <section className="converse bg-layer">
        <div className="container">
          <div className="converse-content">
            <div className="left">
              <h2>Converse with ease and assurance</h2>
              <h6 className="small">
                It is said that words cannot be unspoken, but they can be
                unwritten with MessageMoment’s in-the-moment chat service that
                guarantees your conversation is history. Start chatting now and
                experience the privacy and security of MessageMoment.
              </h6>
            </div>
            <Image
              src={scroll_down}
              className={`down-arrow ${
                dropdownSelected == SessionTypeEnum.SECURE
                  ? "secure"
                  : ".non-secure"
              }`}
              onClick={scrollToSection}
            />
            <div
              ref={sectionRef}
              className={`right ${
                dropdownSelected == SessionTypeEnum.SECURE
                  ? "secure"
                  : "non-secure"
              }`}
            >
              <Image src={banner} alt="banner" />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Converse;
