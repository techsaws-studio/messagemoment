import { chatContext } from "@/contexts/chat-context";
import { SessionTypeEnum } from "@/enums/session-type-enum";
import { useEffect, useState } from "react";

const usePhantomWallet = () => {
  const [PhantomSessionApproved, setPhantomSession] = useState(false);
  const { setSessionData } = chatContext();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // Get the query parameters from the URL
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const phantomKey = queryParams.get("phantom_encryption_public_key");
      const phantomError = queryParams.get("errorCode");
      const nonce = queryParams.get("nonce");
      const data = queryParams.get("data");

      if (phantomKey && nonce && data) {
        setLoading(false)
        setSessionData((prev) => ({
          ...prev,
          type: SessionTypeEnum.WALLET,
        }));
        setPhantomSession(true);
      } else if (phantomError) {
        setSessionData((prev) => ({
          ...prev,
          type: SessionTypeEnum.WALLET,
        }));
        setPhantomSession(false);
      } else {
        setPhantomSession(false);
      }
      setLoading(false)
    } catch (error) {
      console.log("Error", error);
      setPhantomSession(false);
      setLoading(false)
    }
  }, []);

  return {
    PhantomSessionApproved,
    isLoading
  };
};

export default usePhantomWallet;
