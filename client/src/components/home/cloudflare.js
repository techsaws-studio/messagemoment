"use client";

import { createRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isFirefox } from "react-device-detect";

import { chatContext } from "@/chat-context";

import { handleCopyText } from "@/dummy-data";

import MobileQrScannerModal from "./cloudflare-components/Qr-scanner-mobile-modal";
import CloudflareBody from "./cloudflare-components/cloudflare-body";
import CloudflareFooter from "./cloudflare-components/cloudflare-footer";
import CloudflareHeader from "./cloudflare-components/cloudflare-header";
import MobileCloudFlare from "./cloudflare-components/mobile-cloudflare";
import MobileDropdownModal from "./cloudflare-components/mobile-dropdown-modal";
import NotificationTooltip from "./cloudflare-components/notification-tooltip";

export const cloudFlareRef = createRef(null);

const Cloudflare = () => {
  const router = useRouter();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileModalRef = useRef(null);

  const {
    setSessionData,
    sessionData,
    setIsWalletConnected,
    setdropdownSelected,
    setIsLoadingGenerateLink,
  } = chatContext();

  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState("");
  const [secureCode, setSecureCode] = useState("");
  const [open, setOpen] = useState(false);
  const [IsCfVerified, setIsCfVerified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationtype, setNotificationType] = useState("reg");
  const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);
  const [isCopyVisibleTooltip, setCopyIsVisibleTooltip] = useState(false);
  const [isQrVisibleTooltip, setQrIsVisibleTooltip] = useState(false);
  const [QrVisible, setQrVisisble] = useState(false);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [openQrMobileModal, setOpenQrMobileModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Standard");

  useEffect(() => {
    setIsWalletConnected(false);
    setSessionData((prev) => ({
      ...prev,
      type: "Standard",
    }));
  }, [isFirefox]);

  const toggleVisibility = (type) => {
    if (!isVisible) {
      setNotificationType(type);
      setIsVisible(!isVisible);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  };

  const handleDropdownVisibleChange = (open) => {
    setOpen(open);
  };

  const handleSelectUrlTYpe = (value) => {
    setUrl("");
    setSecureCode("");
    setUrlType(value);
    setSessionData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleCopy = async () => {
    const isSuccess = await handleCopyText(url, secureCode, urlType);
    if (isSuccess) {
      setCopyIsVisibleTooltip(false);
      toggleVisibility("copy");
    }
  };

  const generateRandomString = (length) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    setSessionData((prev) => ({
      ...prev,
      code: result,
      url: `https://messagemoment.com/chat/${result}`,
    }));
    return result;
  };

  function generateRandomNumber() {
    const result = Math.floor(1000 + Math.random() * 9000);
    setSessionData((prev) => ({
      ...prev,
      secureCode: result,
    }));
    return result;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleRegenrateClick = () => {
    setIsLoadingGenerateLink(true);
    setTimeout(() => {
      setIsVisibleTooltip(false);
      setUrl(`https://messagemoment.com/chat/${generateRandomString(12)}`);
      setSecureCode(generateRandomNumber());
      setNotificationType("reg");
      toggleVisibility("reg");
      setIsLoadingGenerateLink(false);
    }, 1000);
  };

  const handleHover = (type = "reg") => {
    if (!QrVisible) {
      if (type == "reg") {
        setIsVisibleTooltip(true);
      } else if (type == "copy") {
        setCopyIsVisibleTooltip(true);
      } else {
        setQrIsVisibleTooltip(true);
      }
    }
  };

  const handleMouseLeave = (type = "reg") => {
    if (!QrVisible) {
      if (type == "reg") {
        setIsVisibleTooltip(false);
      } else if (type == "copy") {
        setCopyIsVisibleTooltip(false);
      } else {
        setQrIsVisibleTooltip(false);
      }
    }
  };

  const onQrChange = (val) => {
    if (val) {
      setQrIsVisibleTooltip(false);
      setQrVisisble(true);
    } else {
      setQrVisisble(false);
    }
  };

  const selectOption = (option) => {
    setUrl("");
    setSecureCode("");
    setUrlType(option);
    setSessionData((prev) => ({
      ...prev,
      type: option,
    }));
    setSelectedOption(option);
    setOpen(false);
    setdropdownSelected(option);
    // close mobile modal if its true
    if (openMobileModal) setOpenMobileModal((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
    if (
      mobileModalRef.current &&
      !mobileModalRef.current.contains(event.target)
    ) {
      setOpen(false);
      if (isFirefox) {
      } else {
        setOpenMobileModal(false);
      }
      setOpenQrMobileModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NotificationTooltip
        notificationtype={notificationtype}
        isVisible={isVisible}
      />

      <MobileDropdownModal
        ref={mobileModalRef}
        openMobileModal={openMobileModal}
        setOpenMobileModal={setOpenMobileModal}
        selectOption={selectOption}
        setOpen={setOpen}
      />

      <MobileQrScannerModal
        ref={mobileModalRef}
        openQrMobileModal={openQrMobileModal}
        setOpenQrMobileModal={setOpenQrMobileModal}
        url={url}
      />

      {/* CloudFlare Section start For Mobile & Desktop UI */}
      <section
        ref={cloudFlareRef}
        className={`cloud-flare ${
          selectedOption == "Secure" ? "secure" : "default"
        }`}
      >
        <CloudflareHeader />

        <MobileCloudFlare
          ref={buttonRef}
          openMobileModal={openMobileModal}
          setOpenMobileModal={setOpenMobileModal}
          selectOption={selectOption}
          open={open}
          setOpen={setOpen}
          selectedOption={selectedOption}
          setOpenQrMobileModal={setOpenQrMobileModal}
          {...{
            IsCfVerified,
            handleCopy,
            handleRegenrateClick,
            router,
            secureCode,
            sessionData,
            setSecureCode,
            setIsCfVerified,
            setSessionData,
            setUrl,
            url,
          }}
        />
        
        {/* *** Desktop cloudfalre body *** */}
        <div className="bottom">
          <CloudflareBody
            {...{
              IsCfVerified,
              handleCopy,
              handleDropdownVisibleChange,
              handleRegenrateClick,
              handleHover,
              handleMouseLeave,
              handleSelectUrlTYpe,
              isCopyVisibleTooltip,
              isQrVisibleTooltip,
              isVisibleTooltip,
              loading,
              onQrChange,
              secureCode,
              selectOption,
              selectedOption,
              url,
              urlType,
            }}
          />

          <CloudflareFooter
            {...{
              IsCfVerified,
              router,
              setIsCfVerified,
              setSecureCode,
              setUrl,
              url,
            }}
          />
        </div>
      </section>
    </>
  );
};

export default Cloudflare;
