"use client";

import React, { useState } from "react";
import { Spin } from "antd";

import { chatContext } from "@/contexts/chat-context";

import CustomTurnstile from "@/components/custom-turnstile";

import { ApiRequest } from "@/utils/api-request";

import { LoadingOutlined } from "@ant-design/icons";

const CloudflareFooter = ({
  setIsCfVerified,
  url,
  setUrl,
  setSecureCode,
  IsCfVerified,
  router,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    setSessionData,
    sessionData,
    setIsLoadingGenerateLink,
    isLoadingGenerateLink,
    setShowLinkNotification,
  } = chatContext();

  const isButtonDisabled =
    !IsCfVerified || isLoadingGenerateLink || isRedirecting;

  const handleOnGenerateLink = async () => {
    if (isLoadingGenerateLink || isRedirecting) {
      return;
    }

    if (!url) {
      try {
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
        }
      } catch (error) {
        console.error("Error generating session link:", error);
        setShowLinkNotification({
          message: "Server currently unavailable. Please try again later!",
          visible: true,
        });
      } finally {
        setIsLoadingGenerateLink(false);
      }
    } else {
      try {
        setIsRedirecting(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        router.push(`/chat/${sessionData?.code}`);
      } catch (error) {
        console.error("Error during redirect:", error);
        setIsRedirecting(false);
        setShowLinkNotification({
          message: "Navigation error. Please try again.",
          visible: true,
        });
      }
    }
  };

  const getButtonContent = () => {
    if (isLoadingGenerateLink) {
      return <Spin indicator={<LoadingOutlined spin />} size="default" />;
    }

    if (isRedirecting) {
      return <Spin indicator={<LoadingOutlined spin />} size="default" />;
    }

    return url ? "Open Chat" : "Generate Link";
  };

  return (
    <>
      <div className="gen-btn">
        <CustomTurnstile
          setIsCfVerified={setIsCfVerified}
          key={"cloudflare-custom-turnstile"}
        />

        <button
          disabled={isButtonDisabled}
          onClick={handleOnGenerateLink}
          className={`text-blue ${isButtonDisabled && "inactive"}`}
        >
          {getButtonContent()}
        </button>
      </div>
      <p className="note text-white text-center">
        By starting this chat session, you agree to our{" "}
        <span className="underline-link">
          <a href="/terms" target="_blank">
            Terms of Use
          </a>
        </span>{" "}
        and{" "}
        <span className="underline-link">
          <a href="/privacy" target="_blank">
            Privacy Policy
          </a>
        </span>
        , and that you and everybody you share the chat link with is above 16
        years of age.
      </p>
    </>
  );
};

export default CloudflareFooter;
