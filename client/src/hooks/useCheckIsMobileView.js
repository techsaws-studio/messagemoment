import { useEffect, useState } from "react";

const useCheckIsMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSmallMobileView, setIsSmallMobileView] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isWorkingMobileView, setIsWorkingMobileView] = useState(false);
  const [isMessageMobileView, setIsMessageMobileView] = useState(false);

  useEffect(() => {
    const updateButtonSize = () => {
      if (window.innerWidth >= 1000 && window.innerWidth <= 1160) {
        setIsMediumScreen(true);
      } else if (window.innerWidth <= 1000) {
        setIsMobileView(true);
        setIsSmallMobileView(false);
        setIsMediumScreen(false);
      } else if (window.innerWidth <= 900) {
        setIsSmallMobileView(true);
        setIsMediumScreen(false);
      } else {
        setIsMobileView(false);
        setIsSmallMobileView(false);
        setIsMediumScreen(false);
      }

      if (window.innerWidth <= 840) {
        setIsWorkingMobileView(true);
      } else {
        setIsWorkingMobileView(false);
      }
      if (window.innerWidth <= 1000) {
        setIsMessageMobileView(true);
      } else {
        setIsMessageMobileView(false);
      }
    };
    updateButtonSize();
    window.addEventListener("resize", updateButtonSize);
    return () => window.removeEventListener("resize", updateButtonSize);
  }, []);

  return {
    isMobileView,
    isSmallMobileView,
    isMediumScreen,
    isWorkingMobileView,
    isMessageMobileView,
  };
};

export default useCheckIsMobileView;
