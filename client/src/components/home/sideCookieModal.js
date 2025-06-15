'use client'
import React, { useEffect, useState } from "react";
import Button from "../button";
import Cookie from "../../assets/icons/cookie.svg";
import Cross from "../../assets/icons/cross.svg";
import Blur from "../../assets/icons/blur.svg";
import RightArrow from "../../assets/icons/rightArrow.svg";
import CrossDark from "../../assets/icons/cross_darkgray.svg";
import SwitchTickIcon from "../../assets/icons/tickIcon.svg";
import SwitchCrossIcon from "../../assets/icons/switchCross.svg";
import SwitchDisabled from "../../assets/icons/switchDisabled.svg";
import Image from "next/image";
import { Collapse } from "antd";
import Cookies from "js-cookie";

/**
 * A modal component that displays a list of cookie categories and allows the user to opt-in/opt-out of each category.
 * The component also displays a message explaining the use of cookies and provides a link to the privacy policy.
 * When the user presses the "Accept All" or "Reject All" buttons, the corresponding action is triggered and the component is closed.
 * When the user presses the "Save Settings" button, the current cookie settings are saved and the component is closed.
 * @param {boolean} isVisible Indicates whether the modal is visible or not.
 * @param {boolean} isClosing Indicates whether the modal is closing or not.
 * @param {function} onPress Function that is called when the user presses the "Accept All" or "Reject All" buttons.
 * @returns A JSX element that represents the modal component.
 */
const ScreenModalCookie = ({ isVisible, isClosing, onPress }) => {
  const [ischeck, setIshcek] = useState(false);
  const [isperfomancecheck, setperfomanceIshcek] = useState(false);
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
        className={`custom-switch ${ischeck ? "checked" : ""}`}
        onClick={(e) => {
          setIshcek(!ischeck);
          e.stopPropagation();
        }}
      >
        <div className="custom-switch-handle"></div>
        {ischeck ? (
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
        className={`custom-switch ${isperfomancecheck ? "checked" : ""}`}
        onClick={(e) => {
          setperfomanceIshcek(!isperfomancecheck);
          e.stopPropagation();
        }}
      >
        <div className="custom-switch-handle"></div>
        {isperfomancecheck ? (
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

  const setCookie = () => {
    // Cookies.set("cookiesAccepted", "true");
    // console.log("cookie click");
    Cookies.set("cookiesAccepted", true, {
      domain: "message-moment-app.vercel.app",
      secure: true,
      sameSite: "Lax",
      expires: 365, 
    });
  };
  return (
    <div className={`cookie-modal ${isVisible ? "open-fade" : ""}`}>
      <div className={`cookie-modal-wrapper ${isClosing ? "fade-out" : ""}`}>
        {/* header */}
        <div className="header">
          <Image src={Cookie} className="cooki-img" alt="Cookie"/>
          <h4>Cookie Preferences</h4>
          <Image src={CrossDark} onClick={onPress} className="dark-cross" alt="CrossDark" />
        </div>
        {/* body */}
        <div className="cookie-body">
          <p className="title">Cookie Usage</p>
          <p className="paragraph">
            We use cookies to ensure the basic functionalities of this website
            and to enhance your online experience. You can choose for each
            category to opt-in/out whenever you want. For more details relative
            to cookies and other sensitive data, please read the full{" "}
            <span className="underline-link" >
              <a href="/privacy" target="_blank">Privacy Policy</a>
            </span>
            .
          </p>
          {/* accordion */}
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
          {/* More infor */}
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
        <div className="footer">
          <div className="first-col">
            <Button
              text="Accept All"
              width="180px"
              height="46px"
              className="btn-primary text-white"
              marginLeft={-1}
              onClick={() => {
                setCookie();
                onPress();
              }}
            />

            <Button
              text="Reject All"
              width="180px"
              height="46px"
              className="reject-button btn-secondary mt-10"
              marginLeft={10}
              onClick={onPress}
            />
          </div>
          <br />
          <Button
            text="Save Settings"
            className="reject-button btn-secondary save-setting-btn responsive-button-sideCookie"
            marginLeft={3}
            onClick={() => {
              setCookie();
              onPress();
            }}
          />
        </div>
      </div>
    </div>
  );
};



/**
 * A side cookie modal that will appear if the user hasn't accepted the cookie usage yet.
 * The modal will appear on the right side of the screen and will have a blurred background.
 * The modal will have a "Accept All" button and a "Reject All" button.
 * The user can close the modal by clicking the "x" button on the top right of the modal.
 * The user can also close the modal by clicking outside the modal.
 * The modal will not appear if the user has already accepted the cookie usage.
 * @returns {React.ReactElement} The side cookie modal component.
 */

export default function SideCookieModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [cookieModal, setCookieModal] = useState(false);
  const [isClosing, setisClosing] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const cookiesAccepted = Cookies.get("cookiesAccepted");
  
  const closedModal = () => {
    setisClosing(true);
    setTimeout(() => {
      setCookieModal(false);
    }, 280);
  };

  useEffect(() => {
    if (cookiesAccepted) {
      setIsVisible(false);
      setHasShown(false);
    } else {
      setIsVisible(true);
      setHasShown(true);
    }
  }, [cookiesAccepted]);

  const setCookie = () => {
    // Cookies.set("cookiesAccepted", "true");
    // console.log("cookie click");

    Cookies.set("cookiesAccepted", true, {
      domain: "message-moment-app.vercel.app",
      secure: true,
      sameSite: "Lax",
      expires: 365, // Set the cookie to expire in 365 days
    });
  };

  useEffect(() => {
    if (cookieModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cookieModal]);
  
  return (
    <>
      <ScreenModalCookie
        isVisible={cookieModal}
        isClosing={isClosing}
        onPress={closedModal}
      />
      <div className={`${isVisible ? "bg-wrapper" : "bg-wrappper-hide"}`}>
        {isVisible && <Image src={Blur} className="cookie-blur" alt="Blur"/>}
      </div>
      <div
        className={`cookie-wrapper ${
          isVisible ? "show" : hasShown ? "hide" : ""
        } `}
      >
        <Image src={Cookie} className="cookie" alt="Cookie"/>
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
              setCookie();
              setIsVisible(false);
            }}
          />
          <Button
            text="Reject All"
            width="180px"
            height="45px"
            className="reject-button btn-secondary mt-28 "
            onClick={() => setIsVisible(false)}
          />
        </div>
      </div>
    </>
  );
}
