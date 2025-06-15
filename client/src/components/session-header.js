"use client";
import Image from "next/image";
import logo from "../assets/icons/logo.svg";

const SessionHeader = () => {
  const handleLogoClick = () => {
    window.location.href = window.location.href; 
    window.location.href = "/";
  };
  return (
    <>
      <header>
        <div className="bar"></div>
        <div className="header-container">
          <Image
            src={logo}
            alt="logo"
            priority
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>
    </>
  );
};

export default SessionHeader;
