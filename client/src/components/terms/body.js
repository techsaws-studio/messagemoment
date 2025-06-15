import React from "react";

function TermsBody() {
  return (
    <div className="term-section-wrapper">
      <div className="term-section">
        <h3>Terms and Conditions of Use</h3>
        {/* date  */}
        <div className="terms-date">
          <p className="small date-text">February 1, 2025</p>
        </div>
        {/* terms & condition */}

        <div className="terms-conditions">
          {/* intro */}
          <h4>1. Introduction</h4>
          <p className=" small sub-text">
            Welcome to MessageMoment, a discreet chat service where
            correspondence between two or more parties occurs between known
            parties only. By using MessageMoment, you agree to be bound by these
            Terms and Conditions of Use (“T&Cs”). If you do not agree with these
            T&Cs, you should not use MessageMoment.
          </p>
          {/* condition */}
          <h4>2. Conditions of Use</h4>
          <p className=" small sub-text">
            By using MessageMoment, you agree to the following conditions of
            use:{" "}
          </p>
          <ul className="custom-list">
            <li>
              You will not use the platform for any illegal or unauthorized
              purpose.
            </li>
            <li>You will not violate any laws in your jurisdiction.</li>
            <li>
              You will not infringe upon the rights of others, including but not
              limited to, the right to privacy and intellectual property rights.
            </li>
            <li>
              You will not use the platform in any manner that could damage,
              disable, overburden, or impair the platform
            </li>
            <li>
              You will not abuse or harm others in any manner through the use of
              the platform.
            </li>
            <li>
              You represent and warrant that you are at least 16 years of age.
              If you are under 16 years of age, you may not use this platform
              without the express consent and supervision of a parent or legal
              guardian. By using this platform, you acknowledge and agree that
              you are solely responsible for complying with any and all laws and
              regulations applicable to you, including any age restrictions or
              other eligibility criteria.
            </li>
          </ul>

          {/* 3 3. Responsibility to Retain Information */}
          <div className="reponsibility-section">
            <h4>3. Responsibility to Retain Information</h4>
            <p className=" small sub-text">
              It is the responsibility of the user to capture or save any
              information they wish to retain as the platform is provided on an
              "as is" and "as available" basis.
            </p>
          </div>
          {/* 4 Disclaimer */}
          <h4>4. Disclaimer of Warranties</h4>
          <p className=" small sub-text">
            MessageMoment provides its platform on an “as is” and “as available”
            basis and makes no representations or warranties of any kind,
            express or implied, as to the operation of the platform or the
            information, content or materials included on the platform.
          </p>

          {/* 5. Indemnification */}
          <h4>5. Indemnification</h4>
          <p className=" small sub-text">
            You agree to indemnify, defend and hold harmless MessageMoment, its
            directors, officers, employees, agents, licensors, suppliers, and
            any third-party information providers to the service from and
            against all losses, expenses, damages, and costs, including
            reasonable attorneys’ fees, resulting from any violation of these
            T&Cs or any activity related to your use of the platform.
          </p>

          {/* 6. Termination of Use*/}
          <h4>6. Termination of Use</h4>
          <p className=" small sub-text">
            MessageMoment reserves the right to terminate or restrict your use
            of the platform at any time, with or without notice, for any or no
            reason, and without liability to you.
          </p>

          {/* 7. Amendments to these T&Cs*/}
          <h4>7. Amendments to these T&Cs</h4>
          <p className=" small sub-text">
            MessageMoment reserves the right to update these T&Cs at any time
            and will notify users of any changes through the platform.
          </p>

          {/* 8. Governing Law*/}
          <div className="gov-law-section">
            <h4>8. Governing Law</h4>
            <p className=" small sub-text">
              These Terms and Conditions of Use (“T&Cs”) shall be governed by
              and construed in accordance with the laws of the jurisdiction in
              which you reside. Any dispute arising out of or in connection with
              these T&Cs or the use of MessageMoment shall be resolved
              exclusively through the courts of the jurisdiction in which you
              reside.
            </p>
          </div>

          {/* 9. Entire Agreement*/}
          <h4>9. Entire Agreement</h4>
          <p className=" small sub-text">
            These T&Cs, together with the{" "}
            <span>
              <a href="/privacy">Privacy Policy</a>
            </span>
            , constitute the entire agreement between you and MessageMoment
            relating to the use of the platform. If any provision of these T&Cs
            is found to be invalid or unenforceable, the remaining provisions
            shall remain in full force and effect.
          </p>

          {/*10. Contact Us*/}
          <h4>10. Contact Us</h4>
          <p className=" small sub-text">
            If you have any questions regarding these Terms and Conditions of
            Use, please{" "}
            <span>
              <a href="/contact-us">Contact Us</a>
            </span>
            .
          </p>
          {/* Footer Part */}
          <hr className="divide" />
          <h4 className="footer-heading">Credits</h4>
          <p className="small url">
            https://www.flaticon.com/authors/basic-sheer/flat/8?author_id=1&type=standard
          </p>
          <p className="small url-head">Under Flaticon License</p>

          <p
            className="small url"
            style={{
              marginTop: 18,
            }}
          >
            https://www.freepik.com/free-vector/digital-device-mockup_4168605.htm#query=multi%20device%20mockup&position=23&from_view=search&track=ais"
          </p>
          <p className="small url-head2">Image by rawpixel.com on Freepik</p>
        </div>
      </div>
    </div>
  );
}

export default TermsBody;
