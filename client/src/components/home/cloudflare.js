"use client";

import { createRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isFirefox } from "react-device-detect";

import { chatContext } from "@/contexts/chat-context";

import { handleCopyText } from "@/dummy-data";

import MobileQrScannerModal from "./cloudflare-components/Qr-scanner-mobile-modal";
import CloudflareBody from "./cloudflare-components/cloudflare-body";
import CloudflareFooter from "./cloudflare-components/cloudflare-footer";
import CloudflareHeader from "./cloudflare-components/cloudflare-header";
import MobileCloudFlare from "./cloudflare-components/mobile-cloudflare";
import MobileDropdownModal from "./cloudflare-components/mobile-dropdown-modal";
import NotificationTooltip from "./cloudflare-components/notification-tooltip";

import { ApiRequest } from "@/utils/api-request";
import { SessionTypeEnum } from "@/enums/session-type-enum";

export const cloudFlareRef = createRef(null);

const Cloudflare = () => {
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState("");
  const [secureCode, setSecureCode] = useState("");

  const [open, setOpen] = useState(false);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [openQrMobileModal, setOpenQrMobileModal] = useState(false);

  const [IsCfVerified, setIsCfVerified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);
  const [isCopyVisibleTooltip, setCopyIsVisibleTooltip] = useState(false);
  const [isQrVisibleTooltip, setQrIsVisibleTooltip] = useState(false);
  const [QrVisible, setQrVisisble] = useState(false);

  const [selectedOption, setSelectedOption] = useState(
    SessionTypeEnum.STANDARD
  );
  const [notificationtype, setNotificationType] = useState("reg");

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

  const handleRegenrateClick = async () => {
    try {
      setIsVisibleTooltip(false);
      setIsLoadingGenerateLink(true);

      const response = await ApiRequest("/generate-session-link", "POST", {
        sessionType: sessionData.type.toLowerCase(),
      });

      if (response?.data?.sessionId) {
        const generatedUrl = `https://messagemoment.com/chat/${response.data.sessionId}`;

        setSessionData((prev) => ({
          ...prev,
          code: response.data.sessionId,
          url: generatedUrl,
          secureCode: response.data.sessionSecurityCode || "",
        }));

        setUrl(generatedUrl);
        setSecureCode(response.data.sessionSecurityCode || "");
        setNotificationType("reg");
        toggleVisibility("reg");
      }
    } catch (error) {
      console.error("Error regenerating session link:", error);
    } finally {
      setIsLoadingGenerateLink(false);
    }
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
    setIsWalletConnected(false);
    setSessionData((prev) => ({
      ...prev,
      type: SessionTypeEnum.STANDARD,
    }));
  }, [isFirefox]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

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

      <section
        ref={cloudFlareRef}
        className={`cloud-flare ${
          selectedOption == SessionTypeEnum.SECURE ? "secure" : "default"
        }`}
      >
        <CloudflareHeader />

        {/* *** MOBILE CLOUDFLARE BODY *** */}
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

        {/* *** DESKTOP CLOUDFLARE BODY *** */}
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
