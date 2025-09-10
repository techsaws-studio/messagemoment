"use client";

import React from "react";
import Image from "next/image";
import { getYear } from "date-fns";
import Link from "next/link";

import Button from "./button";

import facebook from "../assets/icons/Facebook.svg";
import Instagram from "../assets/icons/Instagram.svg";
import logo from "../assets/icons/logo.svg";
import upArrow from "../assets/icons/upArrow.svg";
import x from "../assets/icons/X.svg";
import youtube from "../assets/icons/Youtube.svg";
import des from "../assets/icons/desBy.svg";
import heartIcon from "../assets/icons/heart.svg";

const Footer = () => {
  const currentYear = getYear(new Date());

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogoClick = () => {
    window.location.href = window.location.href;
    window.location.href = "/";
  };

  const handleNavClick = (path) => {
    scrollToTop();
    window.open(path, "_blank");
  };

  return (
    <footer className="footer-bg-layer">
      <Image onClick={handleLogoClick} src={logo} alt="logo" className="logo" />
      <ul className="footer-links">
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/faqs">Help & Support </Link>
        </li>
        <li>
          <Link href="/terms">Terms of Use</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
        <div className="support-footer-btn">
          <Button
            icon={heartIcon}
            text="Support Us"
            className="support-btn support-us-blue-text primary-bg  responsive-button-footer"
            onClick={() => handleNavClick("https://ko-fi.com/messagemoment")}
          />
        </div>
      </ul>

      <div className="divider"></div>
      <div className="copy-right container">
        <div className="support-footer-btn-mobile">
          <Button
            icon={heartIcon}
            text="Support Us"
            maxWidth={"388px"}
            className="support-btn support-us-blue-text primary-bg  responsive-button-footer"
            onClick={() => handleNavClick("https://ko-fi.com/messagemoment")}
          />
        </div>
        <p className="note text-dark-gray">
          Copyright © {currentYear} MessageMoment. All rights reserved.
        </p>{" "}
        <div className="social-icons">
          {/* Add hyperlinks to social media profiles */}
          <a href="https://x.com/" target="_blank">
            <Image src={x} alt="X logo" priority />
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <Image src={Instagram} alt="Instagram logo" priority />
          </a>
          <a href="https://www.facebook.com/" target="_blank">
            <Image src={facebook} alt="Facebook logo" priority />
          </a>
          <a href="https://www.youtube.com/" target="_blank">
            <Image src={youtube} alt="YouTube logo" priority />
          </a>
        </div>
        <p className="note text-dark-gray">
          Designed By
          <Image src={des} alt="Designed by" style={{ cursor: "default" }} />
        </p>
      </div>
      <div onClick={scrollToTop} className="scrol-btn">
        <Image src={upArrow} alt="upArrow" />
      </div>
    </footer>
  );
};

export default Footer;
