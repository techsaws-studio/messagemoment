"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../assets/icons/logo.svg";
import logo_white from "../assets/icons/logo_white.svg";
import cross_white from "../assets/icons/cross_white.svg";
import x from "../assets/icons/X.svg";
import X_white from "../assets/icons/X_white.svg";
import Instagram from "../assets/icons/Instagram.svg";
import Instagram_white from "../assets/icons/Instagram_white.svg";
import facebook from "../assets/icons/Facebook.svg";
import Facebook_white from "../assets/icons/Facebook_white.svg";
import youtube from "../assets/icons/Youtube.svg";
import Youtube_white from "../assets/icons/Youtube_white.svg";
import MenuIcon from "../assets/icons/menu-icon.svg";
import Button from "./button";
import { cloudFlareRef } from "./home/cloudflare";
import Link from "next/link";
import { useRouter } from "next/navigation";
import arrow_white from "../assets/icons/arrow_white.svg";
import { getYear } from "date-fns";
import Notification from "./notification";

/**
 * The Header component renders the topmost part of the webpage, including the navigation bar
 * and the logo. It also contains a mobile menu which is toggled by the menu icon.
 *
 * @returns The Header component.
 */
const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = getYear(new Date());

  const handleMenuToggle = () => {
    setMenuOpen(true);
  };
  const scrollToTop = () => {
    const currentPath = window.location.pathname;
    if (menuOpen) setMenuOpen(false);
    if (currentPath !== "/") {
      router.push("/");
      setTimeout(() => {
        const yOffset = -86;
        const yPosition =
          cloudFlareRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }, 2000);
    } else {
      const yOffset = -86;
      const yPosition =
        cloudFlareRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };
  const handleLogoClick = () => {
    window.location.href = window.location.href;
    window.location.href = "/";
  };

  return (
    <>
      <Notification />
      <header>
        {!menuOpen && <div className="bar"></div>}
        {/* mobile header */}
        <div className={`mobile-menu ${menuOpen ? "header-open" : ""}`}>
          {/* top header*/}
          <div className="top-head">
            <Image
              src={logo_white}
              alt="logo"
              priority
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
            <Image
              src={cross_white}
              alt="cross_white"
              priority
              className="cancel"
              style={{ cursor: "pointer" }}
              onClick={() => setMenuOpen(false)}
            />
          </div>

          {/*mobile header  body */}

          <ul className="body-links">
            <li>
              <Link href={"/about"}>About</Link>
            </li>
            <li>
              <Link href={"/faqs"}>Help & Support</Link>
            </li>
            <li>
              <Link href={"/terms"}>Terms of Use</Link>
            </li>
            <li>
              <Link href={"/privacy"}>Privacy Policy</Link>
            </li>
          </ul>
          <div className="divider" />
          <div className="m-header-btn">
            <Button
              text="Start"
              width="90%"
              height="46px"
              className="btn-primary text-blue "
              onClick={scrollToTop}
            />
          </div>
          <div className="footer">
            <div className="divider" />
            <ul className="social-links">
              <li>
                <a href="https://x.com/" target="_blank">
                  <Image src={X_white} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank">
                  <Image src={Instagram_white} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank">
                  <Image src={Facebook_white} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/" target="_blank">
                  <Image src={Youtube_white} alt="logo" priority />
                </a>
              </li>
            </ul>
            <p className="note text-white">
              Copyright © {currentYear} MessageMoment. All rights reserved.
            </p>
            <p className="note text-white">
              Designed By
              <Image
                src={arrow_white}
                alt="Designed by"
                style={{ cursor: "default", marginLeft: "3px" }}
              />
            </p>
          </div>
        </div>
        {/* mobile header end */}

        <div className="headercontainer header-links">
          <ul className="left">
            <li>
              <Image
                src={logo}
                alt="logo"
                priority
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              <Link href={"/about"}>About</Link>
            </li>
            <li>
              <Link href={"/faqs"}>Help & Support</Link>
            </li>
          </ul>

          <ul className="right">
            <ul className="right-social-links">
              <li>
                <a href="https://x.com/" target="_blank">
                  <Image src={x} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank">
                  <Image src={Instagram} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank">
                  <Image src={facebook} alt="logo" priority />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/" target="_blank">
                  <Image src={youtube} alt="logo" priority />
                </a>
              </li>
            </ul>

            <Button
              text="Start"
              width="150px"
              height="46px"
              className="btn-primary text-white header-btn"
              onClick={scrollToTop}
            />
            <Image
              onClick={handleMenuToggle}
              src={MenuIcon}
              className="menuIcon"
            />
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
