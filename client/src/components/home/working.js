"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";

import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";

import msg from "../../assets/images/work.png";
import genLink from "../../assets/icons/genLink.svg";
import share from "../../assets/icons/share.svg";
import expiry from "../../assets/icons/timer.svg";
import session from "../../assets/icons/endSession.svg";

const Working = () => {
  const [hoveredCard, setHoveredCard] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const scrollContainerRef = useRef(null);
  const scrollBarRef = useRef(null);
  const cardRefs = useRef([]);
  const { isWorkingMobileView } = useCheckIsMobileView();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      if (scrollContainerRef.current && scrollBarRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        const customScrollTrackWidth = scrollBarRef.current.clientWidth;
        const customScrollThumbWidth = 40;
        const maxThumbMovement =
          customScrollTrackWidth - customScrollThumbWidth;
        const newPosition = (scrollLeft / maxScrollLeft) * maxThumbMovement;
        setScrollPosition(newPosition);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setHoveredCard(index);
    }
  };

  return (
    <Fragment>
      <section className="working">
        <div className={!isWorkingMobileView && "container"}>
          <h2 className="text-white text-center header">
            Express yourself freely, <br className="br-line" /> anytime, with
            those you know
          </h2>
          <Image src={msg} alt="banner" className="container work-banner" />
          <div ref={scrollContainerRef} className="flow-cards ">
            {isVisible &&
              cards.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`card ${hoveredCard === index ? "hovered" : ""}`}
                  onMouseEnter={() => {
                    if (!isWorkingMobileView) setHoveredCard(index);
                  }}
                  onMouseLeave={() => {
                    if (!isWorkingMobileView) setHoveredCard(null);
                  }}
                  onClick={() => scrollToCard(index)}
                >
                  <h2 className="step-no">{index + 1}</h2>
                  <div className="label-wrapper">
                    <Image id={`${index == 2}`} src={item?.img} />
                    <p className="note-jet">Step {index + 1}</p>
                    <h4>{item.label}</h4>
                  </div>
                </div>
              ))}
          </div>
          {/* Custom Scroll */}
          <div ref={scrollBarRef} className="custom-scroll">
            <div
              className="customScroll-bar"
              style={{
                transform: `translateX(${scrollPosition}px)`,
              }}
            ></div>
          </div>
          <div className="card-details">
            {(hoveredCard === null || hoveredCard === 0) && (
              <h6 className="text-white text-center">
                Start a chat session by clicking the "Open Chat" button on our
                site and receive a<br className="break-line" />
                link. Optionally, make the chat secure by generating a security
                code.
              </h6>
            )}

            {hoveredCard === 1 && (
              <h6 className="text-white text-center">
                Share the link with others by simply clicking the Copy URL
                button <br className="break-line" /> or scanning the QR code and
                sending via your favorite method.
              </h6>
            )}

            {hoveredCard === 2 && (
              <h6 className="text-white text-center">
                When the link is accessed, the chat facility will appear and
                users can enter their handle to start chatting.{" "}
                <br className="break-line" /> The chat messages will start to
                automatically disappear as specified by the expiry time limit.
              </h6>
            )}

            {hoveredCard === 3 && (
              <h6 className="text-white text-center">
                The chat session is permanently terminated when every user has
                left by <br className="break-line" /> clicking the Disconnect
                button or simply closing their browser.
              </h6>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const cards = [
  {
    img: genLink,
    label: "Generate Link",
  },
  {
    img: share,
    label: "Share It",
  },
  {
    img: expiry,
    label: "Set Expiry",
  },
  {
    img: session,
    label: "End Session",
  },
];

export default Working;
