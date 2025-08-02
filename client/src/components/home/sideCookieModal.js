"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Collapse } from "antd";
import Cookies from "js-cookie";

import Button from "../button";

import Cookie from "../../assets/icons/cookie.svg";
import Cross from "../../assets/icons/cross.svg";
import Blur from "../../assets/icons/blur.svg";
import RightArrow from "../../assets/icons/rightArrow.svg";
import CrossDark from "../../assets/icons/cross_darkgray.svg";
import SwitchTickIcon from "../../assets/icons/tickIcon.svg";
import SwitchCrossIcon from "../../assets/icons/switchCross.svg";
import SwitchDisabled from "../../assets/icons/switchDisabled.svg";

const ScreenModalCookie = ({
  isVisible,
  isClosing,
  onPress,
  initialPreferences,
  onPreferencesChange,
  setCookie,
}) => {
  const cookiePreferences = initialPreferences;

  const text = `
  These cookies are essential for the proper functioning of this website. Without these cookies, the website would not work properly.
`;

  const text2 = `
  These cookies collect information about how you use this website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.
`;

  const label2 = (
    <div className="panel-header">
      Performance and Analytics cookies
      <div
        className={`custom-switch ${
          cookiePreferences.analytics ? "checked" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          const newValue = !cookiePreferences.analytics;
          const newPreferences = { ...cookiePreferences, analytics: newValue };
          updatePreferences(newPreferences);
        }}
      >
        <div className="custom-switch-handle"></div>
        {cookiePreferences.analytics ? (
          <>
            <Image
              className="custom-switch-icon checked-icon"
              style={{
                width: "11px",
                height: "8px",
              }}
              src={SwitchTickIcon}
              alt="SwitchTickIcon"
            />
          </>
        ) : (
          <Image
            src={SwitchCrossIcon}
            style={{
              width: "10px",
              height: "10px",
            }}
            alt="SwitchCrossIcon"
            className="custom-switch-icon unchecked-icon"
          />
        )}
      </div>
    </div>
  );

  const label3 = (
    <div className="panel-header">
      Advertisement and Targeting cookies
      <div
        className={`custom-switch ${
          cookiePreferences.advertising ? "checked" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          const newValue = !cookiePreferences.advertising;
          const newPreferences = {
            ...cookiePreferences,
            advertising: newValue,
          };
          updatePreferences(newPreferences);
        }}
      >
        <div className="custom-switch-handle"></div>
        {cookiePreferences.advertising ? (
          <>
            <Image
              className="custom-switch-icon checked-icon"
              style={{
                width: "11px",
                height: "8px",
              }}
              src={SwitchTickIcon}
              alt="SwitchTickIcon"
            />
          </>
        ) : (
          <Image
            src={SwitchCrossIcon}
            style={{
              width: "10px",
              height: "10px",
            }}
            alt="SwitchCrossIcon"
            className="custom-switch-icon unchecked-icon"
          />
        )}
      </div>
    </div>
  );

  const tableContent = (
    <div>
      <p>
        These cookies allow this website to remember the choices you have made
        in the past.
      </p>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Domain</th>
            <th>Expiration</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>^_ga</td>
            <td>google.com</td>
            <td>2 years</td>
            <td>description ...</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>google.com</td>
            <td>1 day</td>
            <td>description ...</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const items = [
    {
      key: "1",
      label: (
        <div className="panel-header">
          Strictly necessary cookies
          <Image
            onClick={(e) => {
              e.stopPropagation();
            }}
            alt="SwitchDisabled"
            src={SwitchDisabled}
          />
        </div>
      ),
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: label2,
      children: tableContent,
    },
    {
      key: "3",
      label: label3,
      children: <p>{text2}</p>,
    },
  ];

  const updatePreferences = (newPreferences) => {
    onPreferencesChange(newPreferences);
  };

  return (
    <div className={`cookie-modal ${isVisible ? "open-fade" : ""}`}>
      <div className={`cookie-modal-wrapper ${isClosing ? "fade-out" : ""}`}>
        {/* HEADER */}
        <div className="header">
          <Image src={Cookie} className="cooki-img" alt="Cookie" />
          <h4>Cookie Preferences</h4>
          <Image
            src={CrossDark}
            onClick={onPress}
            className="dark-cross"
            alt="CrossDark"
          />
        </div>

        {/* BODY */}
        <div className="cookie-body">
          <p className="title">Cookie Usage</p>
          <p className="paragraph">
            We use cookies to ensure the basic functionalities of this website
            and to enhance your online experience. You can choose for each
            category to opt-in/out whenever you want. For more details relative
            to cookies and other sensitive data, please read the full{" "}
            <span className="underline-link">
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </span>
            .
          </p>

          {/* ACCORDIANS */}
          <Collapse
            items={items}
            // defaultActiveKey={["2"]}
            bordered
            expandIcon={({ isActive }) => (
              <Image
                src={RightArrow}
                className={`custom-collapse-icon ${isActive ? "active" : ""}`}
                alt="RightArrow"
              />
            )}
          />

          {/* MORE INFORMATION */}
          <div className="more-info">
            <p className="title">More Information</p>
            <p className="paragraph">
              For any queries in relation to our policy on cookies and your
              choices, please{" "}
              <span className="underline-link">
                <a href="/contact-us" target="_blank">
                  Contact Us
                </a>
              </span>
              .
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="first-col">
            <Button
              text="Accept All"
              width="180px"
              height="46px"
              className="btn-primary text-white"
              marginLeft={-1}
              onClick={() => {
                const allAccepted = {
                  essential: true,
                  analytics: true,
                  advertising: true,
                };
                setCookie(allAccepted);
                onPress();
              }}
            />

            <Button
              text="Reject All"
              width="180px"
              height="46px"
              className="reject-button btn-secondary mt-10"
              marginLeft={10}
              onClick={() => {
                const onlyEssential = {
                  essential: true,
                  analytics: false,
                  advertising: false,
                };
                setCookie(onlyEssential);
                onPress();
              }}
            />
          </div>
          <br />
          <Button
            text="Save Settings"
            className="reject-button btn-secondary save-setting-btn responsive-button-sideCookie"
            marginLeft={3}
            onClick={() => {
              setCookie(cookiePreferences);
              onPress();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function SideCookieModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [cookieModal, setCookieModal] = useState(false);
  const [isClosing, setisClosing] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    advertising: false,
  });

  const closedModal = () => {
    setisClosing(true);
    setTimeout(() => {
      setCookieModal(false);
    }, 280);
  };

  const setCookie = (preferences) => {
    const cookieOptions = {
      expires: 365,
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
      path: "/",
      ...(process.env.NODE_ENV === "production" && {
        domain: window.location.hostname,
      }),
    };

    Cookies.set(
      "cookiePreferences",
      JSON.stringify(preferences),
      cookieOptions
    );
    const hasAccepted =
      preferences.analytics === true || preferences.advertising === true;

    if (hasAccepted) {
      Cookies.set("cookiesAccepted", "true", cookieOptions);
    } else {
      Cookies.remove("cookiesAccepted");
    }

    if (typeof gtag !== "undefined") {
      gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
        ad_storage: preferences.advertising ? "granted" : "denied",
      });
    }
  };

  useEffect(() => {
    const savedPreferences = Cookies.get("cookiePreferences");

    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setCookiePreferences(preferences);

        setIsVisible(false);
        setHasShown(true);
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
        setIsVisible(true);
        setHasShown(false);
      }
    } else {
      setIsVisible(true);
      setHasShown(false);
    }
  }, []);

  useEffect(() => {
    if (cookieModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cookieModal]);

  return (
    <>
      <ScreenModalCookie
        isVisible={cookieModal}
        isClosing={isClosing}
        onPress={closedModal}
        initialPreferences={cookiePreferences}
        onPreferencesChange={setCookiePreferences}
        setCookie={setCookie}
      />

      <div className={`${isVisible ? "bg-wrapper" : "bg-wrappper-hide"}`}>
        {isVisible && <Image src={Blur} className="cookie-blur" alt="Blur" />}
      </div>

      <div
        className={`cookie-wrapper ${
          isVisible ? "show" : hasShown ? "hide" : ""
        } `}
      >
        <Image src={Cookie} className="cookie" alt="Cookie" />
        <Image
          src={Cross}
          onClick={() => setIsVisible(false)}
          className="cross"
          alt="Cross"
        />
        <h4>We use cookies!</h4>

        <p>
          Hi, this website uses essential cookies to ensure its proper operation
          and tracking cookies to understand how you interact with it. The
          latter will be set only after consent.{" "}
          <span className="underlink" onClick={() => {}}>
            <a
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCookieModal(true);
                }, 400);
              }}
            >
              Let me choose
            </a>
          </span>
          .
        </p>

        <div>
          <Button
            text="Accept All"
            width="180px"
            height="45px"
            className="btn-primary text-white mt-28"
            onClick={() => {
              const allAccepted = {
                essential: true,
                analytics: true,
                advertising: true,
              };
              setCookie(allAccepted);
              setIsVisible(false);
            }}
          />
          <Button
            text="Reject All"
            width="180px"
            height="45px"
            className="reject-button btn-secondary mt-28 "
            onClick={() => {
              const onlyEssential = {
                essential: true,
                analytics: false,
                advertising: false,
              };
              setCookie(onlyEssential);
              setIsVisible(false);
            }}
          />
        </div>
      </div>
    </>
  );
}
