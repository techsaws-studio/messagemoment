import React from "react";
import grey_logo from "@/assets/icons/chat/grey_logo.png";
import heartIcon from "@/assets/icons/heart_white.svg";
import Image from "next/image";
import Link from "next/link";
import { getYear } from "date-fns";
import Button from "../button";
import { users } from "@/dummy-data";

const SideBar = () => {
  const currentYear = getYear(new Date());
  const activeUser = "Richard"; // Define active user dynamically
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="header">
            <h3>Chat Group</h3>
            <p className="chat-text">{users.length}/10</p>
          </div>
          {/* User list */}
          <ul>
            {users.map((user, i) => (
              <li
                key={`userlist-${i.toString()}`}
                className={`${user === activeUser ? "active" : ""} ${
                  users.length>= 10 && i === users.length - 1
                    ? "last-child"
                    : ""
                }`}
              >
                <p className="chat-text">[{user}]</p>
                {user === activeUser && <div>*</div>}
              </li>
            ))}
          </ul>
          {/* Advertisement section */}
          <div className="footer">
            <section className="ads">
              <p className="chat-text">Advertisement</p>
            </section>
            <div id="divider" />
            <section className="side-footer">
              <Image src={grey_logo} alt="Logo" />
              <div className="side-footer-links">
                <Link href="/about" target="_blank">
                  <p>About MessageMoment</p>
                </Link>
                <Link href="/faqs" target="_blank">
                  <p>FAQs</p>
                </Link>
                <Link href="/terms" target="_blank">
                  <p>Terms of Use</p>
                </Link>
                <Link href="/privacy" target="_blank">
                  <p>Privacy</p>
                </Link>
              </div>
              <div className="support-btn-chat">
                <Button
                  icon={heartIcon}
                  text="Support Us"
                  width={"190px"}
                  height={"36px"}
                  className="support-btn text-white secondary-bg"
                />
              </div>
              <h3 className="chat-text">
                Copyright © {currentYear} MessageMoment.
                <br /> All rights reserved.
              </h3>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
