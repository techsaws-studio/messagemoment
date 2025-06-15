import React from "react";
import Image from "next/image";
import banner from "../../assets/images/message.png";
const Message = () => {
  return (
    <>
      <section className="message  bg-layer">
        <div className="container">
          <div className="message-content">
            <div className="left">
              <Image src={banner} alt="banner" />
            </div>
            <div className="right">
              <h2>Your message only lasts a moment</h2>
              <h6 className="small">
                We believe that words can be a powerful tool for connection and
                communication, but it's also true <br className="br-line" /> that words cannot be
                unspoken. That's why we created a live chat service that lets
                you unwrite those words, with a unique chat link and a secure,
                in-the-moment chat experience.
              </h6>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Message;
