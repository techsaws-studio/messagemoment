import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Select, Tooltip } from "antd";
import { isFirefox } from "react-device-detect";

import { SessionTypeEnum } from "@/enums/session-type-enum";

import DummySelect from "@/components/select";
import QrCode from "../qrcode";

import globe from "@/assets/icons/globe.svg";
import lock from "@/assets/icons/secure.svg";
import wallet from "@/assets/icons/wallet.svg";
import dropdownIcon from "@/assets/icons/dropdown.svg";
import dropDownIcon from "@/assets/icons/dropdown_Icon.svg";
import qrcodeGray from "@/assets/icons/qrcode-grey.svg";
import qrcode from "@/assets/icons/qrcode.svg";
import CopyTooltip from "@/assets/images/copyTooltip.svg";
import scanQrTooltip from "@/assets/icons/scanQrTooltip.svg";
import copyGray from "@/assets/icons/copy-grey.svg";
import RegenerateTooltip from "@/assets/images/regTooltip.svg";
import copy from "@/assets/icons/copy.svg";
import reload from "@/assets/icons/reload.svg";

const CloudflareBody = ({
  selectOption,
  selectedOption,
  loading,
  urlType,
  handleSelectUrlTYpe,
  handleDropdownVisibleChange,
  onQrChange,
  secureCode,
  url,
  isCopyVisibleTooltip,
  isQrVisibleTooltip,
  handleHover,
  handleMouseLeave,
  handleCopy,
  isVisibleTooltip,
  IsCfVerified,
  handleRegenrateClick,
}) => {
  const [IsFireFoxBrowser, setIsFireFoxBrowser] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    setIsFireFoxBrowser(isFirefox);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="link-wrapper">
      <div className="left" style={{ borderBottomLeftRadius: open && "0px" }}>
        {IsFireFoxBrowser ? (
          <div
            className="dropdowncustom"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <Image
              style={{
                color: "black",
                marginLeft: selectedOption == SessionTypeEnum.SECURE && "2px",
              }}
              src={
                selectedOption == SessionTypeEnum.STANDARD
                  ? globe
                  : selectedOption == SessionTypeEnum.WALLET
                  ? wallet
                  : lock
              }
              alt="globe"
            />
            <p
              className={
                selectedOption == SessionTypeEnum.SECURE
                  ? "topsecureText2"
                  : "topsecureText"
              }
            >
              {selectedOption}
            </p>
            <Image
              src={open ? dropDownIcon : dropdownIcon}
              alt="dropdown icon"
            />
            <div className={`dropdownList ${open ? "open" : "closed"}`}>
              <div
                className="flexrow"
                onClick={() => selectOption(SessionTypeEnum.STANDARD)}
              >
                <Image style={{ color: "black" }} src={globe} alt="globe" />
                <p
                  className={`${
                    selectedOption == SessionTypeEnum.SECURE
                      ? "secureText2Secure"
                      : "secureText2"
                  }`}
                >
                  Standard
                </p>
              </div>
              <div
                className="flexrowSecure"
                onClick={() => selectOption(SessionTypeEnum.SECURE)}
              >
                <Image src={lock} alt="globe" />
                <p
                  className={`${
                    selectedOption == SessionTypeEnum.SECURE
                      ? "secureTextlast"
                      : "secureText"
                  } `}
                >
                  Secure
                </p>
              </div>
              <div
                className="flexrowSecure"
                onClick={() => selectOption(SessionTypeEnum.WALLET)}
              >
                <Image src={wallet} alt="globe" />
                <p
                  className={`${
                    selectedOption == SessionTypeEnum.SECURE
                      ? "secureTextlast"
                      : "secureText"
                  } `}
                >
                  Wallet
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <DummySelect />
            ) : (
              <>
                <Select
                  defaultValue={SessionTypeEnum.STANDARD}
                  dropdownAlign={{
                    overflow: "relative",
                  }}
                  style={{
                    width: 140,
                    color: "rgba(54, 60, 79, 1)",
                  }}
                  className={`custom-dropdown ${
                    open ? "ant-select-open" : "ant-select-closed"
                  } ${
                    urlType === SessionTypeEnum.SECURE ? "secure-selected" : ""
                  }
          }`}
                  onChange={handleSelectUrlTYpe}
                  suffixIcon={
                    <Image
                      src={open ? dropDownIcon : dropdownIcon}
                      alt="dropdown icon"
                    />
                  }
                  onDropdownVisibleChange={handleDropdownVisibleChange}
                  options={[
                    {
                      value: SessionTypeEnum.STANDARD,
                      label: (
                        <div className="drop-down">
                          <p>
                            <Image
                              style={{ color: "black" }}
                              src={globe}
                              alt="globe"
                            />
                            <span>Standard</span>
                          </p>
                        </div>
                      ),
                    },
                    {
                      value: SessionTypeEnum.SECURE,
                      label: (
                        <div className="drop-down drop-down2">
                          <p>
                            <Image src={lock} alt="globe" />
                            <span
                              style={{
                                paddingLeft: 1,
                              }}
                            >
                              Secure
                            </span>
                          </p>
                        </div>
                      ),
                    },
                    {
                      value: SessionTypeEnum.WALLET,
                      label: (
                        <div className="drop-down">
                          <p>
                            <Image
                              style={{ color: "black" }}
                              src={wallet}
                              alt="wallet"
                            />
                            <span>Wallet</span>
                          </p>
                        </div>
                      ),
                    },
                  ]}
                />
              </>
            )}
          </>
        )}
        <div
          className={`link-box ${
            urlType === SessionTypeEnum.SECURE ? "secure" : "nonSecure"
          }`}
        >
          <p className="url ">{url}</p>
          {urlType == SessionTypeEnum.SECURE && (
            <p className="code">
              <Image src={lock} alt="lock" />
              {url && secureCode}
            </p>
          )}
        </div>
      </div>
      <div className="right">
        <div className="btns-wrapper">
          {/* Regenerate Tooltip */}
          <Tooltip
            title={<Image src={RegenerateTooltip} alt="reload" />}
            overlayClassName="regen-tooltip"
            open={isVisibleTooltip}
          >
            <button
              onMouseEnter={() => handleHover("reg")}
              onMouseLeave={() => handleMouseLeave("reg")}
              disabled={url && IsCfVerified ? false : true}
              onClick={url && handleRegenrateClick}
              className={url ? "regen" : "regen-disable"}
            >
              <Image src={reload} alt="reload" />
            </button>
          </Tooltip>
          {/* Qr Tooltip */}
          <Tooltip
            overlayClassName={"copy-tooltip"}
            title={<Image src={scanQrTooltip} alt="reload" />}
            zIndex={88}
            onMouseEnter={() => handleHover("qr")}
            onMouseLeave={() => handleMouseLeave("qr")}
            open={isQrVisibleTooltip}
          >
            <Tooltip
              overlayClassName={"qrcode-tooltip"}
              title={<QrCode url={url} />}
              trigger={"click"}
              autoAdjustOverflow={false}
              placement="top"
              destroyTooltipOnHide
              fresh
              zIndex={89}
              onOpenChange={(val) => onQrChange(val)}
            >
              <button disabled={!url} className={!url && "disable-tooltip"}>
                <Image src={url ? qrcode : qrcodeGray} alt="qrcode" />
              </button>
            </Tooltip>
          </Tooltip>

          {/* Copy tooltip */}
          <Tooltip
            title={<Image src={CopyTooltip} alt="reload" />}
            overlayClassName="copy-tooltip"
            open={isCopyVisibleTooltip}
            onMouseEnter={() => handleHover("copy")}
            onMouseLeave={() => handleMouseLeave("copy")}
          >
            <button
              disabled={!url}
              onClick={handleCopy}
              className={!url && "my-anchor-element disable-tooltip"}
            >
              <Image src={url ? copy : copyGray} alt="copy" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
export default CloudflareBody;
