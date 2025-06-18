"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import slider1 from "../../assets/icons/slider1.svg";
import slider2 from "../../assets/icons/slider2.svg";
import slider3 from "../../assets/icons/slider3.svg";
import slider4 from "../../assets/icons/slider4.svg";
import phone from "../../assets/icons/cellphone.svg";
import laptop from "../../assets/icons/laptop.svg";
import tablet from "../../assets/icons/tablet.svg";
import Tv from "../../assets/icons/television.svg";
import Consoles from "../../assets/icons/controller.svg";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";

const Sliders = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { isMediumScreen } = useCheckIsMobileView();
  const scrollContainerRef = useRef(null);
  const scrollBarRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && scrollBarRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        // Calculate the available width for the scroll thumb
        const customScrollTrackWidth = scrollBarRef.current.clientWidth;
        const customScrollThumbWidth = 40;
        const maxThumbMovement =
          customScrollTrackWidth - customScrollThumbWidth;
        // Calculate the scroll thumb position based on scrollLeft and maxThumbMovement
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
  const data = [slider1, slider2, slider3, slider4];
  // Function to handle scrolling to a specific card
  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <>
      <section className="slider">
        <div className="">
          <h2 className="text-center text-white header">
            Discover more from <br /> MessageMoment
          </h2>
          <div className="slider-content">
            <Swiper
              slidesPerView={isMediumScreen ? 3 : 4}
              autoplay
              spaceBetween={30}
              className="mySwiper"
            >
              <SwiperSlide>
                <Image src={slider1} alt="slider1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={slider2} alt="slider1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={slider3} alt="slider1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={slider4} alt="slider1" />
              </SwiperSlide>{" "}
            </Swiper>
          </div>
          <div className="slider-flex" ref={scrollContainerRef}>
            {data.map((item, index) => (
              <Image
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => scrollToCard(index)}
                key={`sliders-${index}`}
                src={item}
                alt={`slider-${index}`}
              />
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

          <p className=" head4 text-center text-white">
            Use MessageMoment on any device via Browser
            <sup>1</sup>
            {/* <span className="sup">1</span> */}
          </p>
          <div className="device-wrapper container">
            <div>
              <Image src={phone} alt="slider1" />
              <p className="small">Phone</p>
            </div>
            <div>
              <Image src={laptop} alt="slider1" />
              <p className="small">Desktop</p>
            </div>
            <div>
              <Image src={tablet} alt="slider1" />
              <p className="small">Tablet</p>
            </div>
            <div>
              <Image src={Tv} alt="slider1" />
              <p className="small">Smart Tv</p>
            </div>
            <div>
              <Image src={Consoles} alt="slider1" />
              <p className="small">Consoles</p>
            </div>
          </div>
          <div className="divider"></div>
          <p className="note text-center text-white">
            <sup>1</sup>
            Disclaimer: Compatibility may vary across different devices and
            operating systems.
          </p>
        </div>
      </section>
    </>
  );
};

export default Sliders;
