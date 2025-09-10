"use client";

import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "../button";
import { cloudFlareRef } from "../home/cloudflare";

import team1 from "@/assets/images/teamMember1.svg";
import team2 from "@/assets/images/teamMember2.svg";
import team3 from "@/assets/images/teamMember3.svg";
import team4 from "@/assets/images/teamMember4.svg";
import teamFeatureImg from "@/assets/images/teamFeatureImg.svg";
import message from "@/assets/icons/message.svg";

function Team() {
  const teamsImg = [team1, team2, team3, team4];

  const router = useRouter();

  const handleTryMessageMoment = () => {
    router.push("/");
    setTimeout(() => {
      const yOffset = -86;
      const yPosition =
        cloudFlareRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }, 2000);
  };

  return (
    <Fragment>
      <div className="team container">
        <div className="team-imgs">
          {teamsImg.map((team, i) => (
            <Image src={team} alt={`team-member-${i}`} />
          ))}
        </div>
        <p className="team-desc small">
          It is said that words cannot be unspoken, but they can be unwritten
          with MessageMoment’s in-the-moment chat service that guarantees your
          conversation is history. Start chatting now and experience the privacy
          and security of MessageMoment.
        </p>
        {/* About team */}
        <div className="about-team">
          <Image src={message} className="message-icon" />
          <h3>
            We believe that words can be a powerful tool for connection and
            communication, but it's also true that words cannot be unspoken.
          </h3>
          <h6 className="small">
            That's why we created a live chat service that lets you unwrite
            those words, with a unique chat link and a secure, in-the-moment
            chat experience.
          </h6>
        </div>
      </div>
      <div className="team-platform">
        <Image
          src={teamFeatureImg}
          className="team-feature-img"
          alt="team-feature-img"
        />
        <div className="platform-footer">
          <p className="platformd-desc small">
            Our team has developed a platform that is not only simple and easy
            to use, but also guarantees your conversation will be history. With
            no account registration necessary and a mobile-responsive design,
            you can chat on the go, without leaving a trace. It never happened!
            Our unique security features include the option to "Make Secure," by
            sharing a token password, ensuring that only those you invite can
            enter the chat.
          </p>
          <div className="platform-btn">
            <Button
              text={"Try MessageMoment"}
              className="btn-primary text-white responsive-button-team"
              onClick={handleTryMessageMoment}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Team;
