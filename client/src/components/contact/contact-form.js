"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Spin } from "antd";

import { options } from "@/dummy-data";

import Button from "../button";
import CustomTurnstile from "../custom-turnstile";
import ContactUsSuccessModal from "./contact-success-modal";

import { ApiRequest } from "@/utils/api-request";

import Dropdown from "@/assets/icons/dropdown.svg";
import dropDownIcon from "@/assets/icons/dropdown_Icon.svg";
import { LoadingOutlined } from "@ant-design/icons";

function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [IsCfVerified, setIsCfVerified] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    query: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 1500;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    switch (field) {
      case "firstName":
        setFirstName(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: value.trim() === "",
        }));
        break;
      case "lastName":
        setLastName(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: value.trim() === "",
        }));
        break;
      case "email":
        setEmail(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: value.trim() === "" || !isValidEmail(value),
        }));
        break;
      case "query":
        setText(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          query: value.trim() === "",
        }));
        break;
      default:
        break;
    }
  };

  const isValidEmail = (email) => {
    const emaRg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emaRg.test(email);
  };

  const isAlldone = () => {
    return (
      firstName != "" &&
      !errors.firstName &&
      lastName != "" &&
      !errors.lastName &&
      email != "" &&
      !errors.email &&
      text != "" &&
      !errors.query &&
      selectedOption != null &&
      IsCfVerified
    );
  };

  const onPressOk = () => {
    setFirstName("");
    setLastName("");
    setSelectedOption(null);
    setText("");
    setEmail("");
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!isAlldone()) return;

    setIsSubmitting(true);

    try {
      const ticketData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        topic: selectedOption,
        query: text.trim(),
      };

      const response = await ApiRequest("/submit-ticket", "POST", ticketData);

      if (response.success) {
        console.log("✅ Ticket submitted:", response.data.ticketId);
        setShowModal(true);
      }
    } catch (error) {
      console.error("❌ Ticket submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
      {showModal && <ContactUsSuccessModal onPressOk={onPressOk} />}

      <div className="contact-form">
        {/* FIRST NAME & LAST NAME FIELDS */}
        <div className="row">
          <div className="full-w">
            <p className="medium">First Name*</p>
            <input
              className={`${errors.firstName ? "error" : "full-w"}`}
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => handleInputChange(e, "firstName")}
            />
          </div>

          <div className="full-w">
            <p className="medium">Last Name*</p>
            <input
              className={`${errors.lastName ? "error" : "full-w"}`}
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => handleInputChange(e, "lastName")}
            />
          </div>
        </div>

        {/* EMAIL FIELDS */}
        <div className="input-cont">
          <p className="medium">Email Address*</p>
          <input
            className={`${errors.email ? "full-w error" : "full-w"}`}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleInputChange(e, "email")}
          />
        </div>

        {/* DROPDOWN FIELD */}
        <div className="animated-dropdown" ref={dropdownRef}>
          <p className="medium">Select a topic*</p>
          <div
            className={`animated-dropdown__select ${
              selectedOption && `selected`
            }`}
            onClick={toggleDropdown}
          >
            {selectedOption == null ? "Select" : selectedOption}
            <Image src={isOpen ? dropDownIcon : Dropdown} alt="drop-down" />
          </div>
          <div className={`animated-dropdown__options ${isOpen ? "open" : ""}`}>
            <div className="inside-dropdown_options">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="animated-dropdown__option"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUERY FIELD */}
        <div className="input-cont">
          <div className="row2">
            <p className="medium">Query*</p>
            <p
              className={`left-character ${
                text.length == maxLength && "error"
              }`}
            >
              {maxLength - text.length} characters left
            </p>
          </div>
          <textarea
            className={`text-area-full-w textarea-scroll ${
              errors?.query ? `error` : ""
            }`}
            placeholder="Enter your query here"
            maxLength={maxLength}
            value={text}
            onChange={(e) => handleInputChange(e, "query")}
          />
        </div>

        <div className="row">
          <CustomTurnstile
            setIsCfVerified={setIsCfVerified}
            key={"cloudflare-custom-turnstile-cotact-us"}
          />

          <Button
            text={
              isSubmitting ? (
                <Spin
                  indicator={<LoadingOutlined spin style={{ color: "#fff" }} />}
                  size="default"
                />
              ) : (
                "Send"
              )
            }
            className={`text-white responsive-button-contactus ${
              isAlldone() ? "btn-primary" : "send-button btn-secondary2"
            }`}
            onClick={handleSubmit}
            disabled={!isAlldone() || isSubmitting}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default ContactForm;
