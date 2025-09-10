import React, { useEffect, useState } from "react";
import Image from "next/image";

import { reason_options } from "@/dummy-data";

import { chatContext } from "@/contexts/chat-context";

import Button from "@/components/button";

import CrossDark from "@/assets/icons/cross_darkgray.svg";
import policeshield from "@/assets/icons/chat/police-shield.svg";
import circle from "@/assets/icons/chat/circle.svg";
import radioSelected from "@/assets/icons/chat/radio-selected.svg";
import tick from "@/assets/icons/chat/tick.svg";
import Dropdown from "@/assets/icons/dropdown.svg";
import dropDownIcon from "@/assets/icons/dropdown_Icon.svg";

const ReportFileModal = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [submitReport, setSubmitReport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setisClosing] = useState(false);

  const { setShowReportfileModal, showReportfileModal } = chatContext();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCloseReportModal = () => {
    setisClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setShowReportfileModal(false);
      setisClosing(false);
      setSelectedOption(undefined);
      setSubmitReport(false);
    }, 280);
  };

  const renderReportSubmittedView = () => {
    return (
      <div className="report-submit-cont">
        <Image src={tick} alt="tick" />
        <p className="heading">
          Your reports help us maintain the integrity of our community and
          ensure that everyone can enjoy a positive experience.
        </p>
        <p className="chat-text desc">
          Our team will review the reported file promptly and take appropriate
          actions if necessary.
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (showReportfileModal) {
      setIsVisible(true);
    }
  }, [showReportfileModal]);

  return (
    <div className={`report-file-modal ${isVisible && "open-fade "}`}>
      {/* report Container */}

      <div className={`reportfileContainer ${isClosing && "fade-out"}`}>
        <div className="header">
          <Image src={policeshield} className="cooki-img" alt="policeshield" />
          <h4>Report a FileMoment.com File</h4>
          <Image
            src={CrossDark}
            className="dark-cross"
            onClick={handleCloseReportModal}
            alt="CrossDark"
          />
        </div>
        {/* body */}
        {submitReport && renderReportSubmittedView()}
        {!submitReport && (
          <div className="body-reportfile">
            <p className="title">Welcome to our File Report Center</p>
            <p className="paragraph chat-text">
              MessageMoment was designed to provide a safe and secure
              environment for all our members. If you believe that a sent file
              violates our guidelines or Terms of Use, please use this reporting
              feature to bring it to our attention. This process is totally
              anonymous.
            </p>

            <p className="title sub-title">Welcome to our File Report Center</p>
            <div className="expand-area-wrapper">
              {!selectedOption ? (
                <>
                  <div className="expand-area" onClick={toggleExpand}>
                    <div className="flex-row">
                      <p className="title">Select a reason</p>
                      <Image
                        src={isExpanded ? dropDownIcon : Dropdown}
                        alt="dropDownIcon"
                      />
                    </div>

                    <p className="paragraph">
                      Help us maintain a safe and respectful community by
                      choosing a motive that best describes your concern about
                      the file.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="selected-option" onClick={toggleExpand}>
                    <div className="flex-row">
                      <Image src={radioSelected} alt="radioSelected" />
                      <p className="heading">{selectedOption?.title}</p>
                      <Image
                        src={isExpanded ? dropDownIcon : Dropdown}
                        alt="dropDownIcon"
                      />
                    </div>

                    <p
                      className="desc"
                      style={{
                        paddingLeft: "21px",
                        color: "#777777",
                      }}
                    >
                      {selectedOption?.desc}
                    </p>
                  </div>
                </>
              )}

              <div className={`reportfile-content ${isExpanded && "expanded"}`}>
                {reason_options.map((item, index) => (
                  <div
                    key={`body-${index}`}
                    className={`body-content ${
                      selectedOption?.title == item?.title && "active-body"
                    }`}
                    onClick={() => {
                      setSelectedOption(item);
                      toggleExpand();
                    }}
                  >
                    <div className="row-content">
                      <Image src={circle} alt="circle" />
                      <div>
                        <p
                          className={`heading ${
                            selectedOption?.title == item?.title &&
                            "active-title"
                          } `}
                        >
                          {item.title}
                        </p>
                        <p className="desc">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`footer-reportfile ${submitReport && "flex-center"} `}>
          {submitReport ? (
            <Button
              text="Continue"
              width="180px"
              height="46px"
              className="btn-primary text-white header-btn"
              onClick={handleCloseReportModal}
            />
          ) : (
            <>
              <Button
                text="Cancel"
                width="180px"
                height="46px"
                className="reject-button btn-secondary "
                onClick={handleCloseReportModal}
              />

              <Button
                disabled={!selectedOption}
                text="Report File"
                width="180px"
                height="46px"
                className={`reportfile-button btn-secondary ${
                  selectedOption && "active"
                }`}
                onClick={() => setSubmitReport(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFileModal;
