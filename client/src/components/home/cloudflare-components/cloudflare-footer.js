import React from "react";
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
  const {
    setSessionData,
    sessionData,
    setIsLoadingGenerateLink,
    isLoadingGenerateLink,
  } = chatContext();

  const handleOnGenerateLink = async () => {
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
      } finally {
        setIsLoadingGenerateLink(false);
      }
    } else {
      router.push(`/chat/${sessionData?.code}`);
    }
  };

  return (
    <>
      <div className="gen-btn">
        <CustomTurnstile
          setIsCfVerified={setIsCfVerified}
          key={"cloudflare-custom-turnstile"}
        />

        <button
          disabled={IsCfVerified ? false : true}
          onClick={handleOnGenerateLink}
          className={`text-blue ${!IsCfVerified && "inactive"}`}
        >
          {isLoadingGenerateLink ? (
            <Spin indicator={<LoadingOutlined spin />} size="default" />
          ) : url ? (
            "Open Chat"
          ) : (
            "Generate Link"
          )}
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
