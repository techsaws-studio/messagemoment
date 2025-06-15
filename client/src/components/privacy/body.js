import React from "react";

function PrivacyBody() {
  return (
    <div className="privacy-section-wrapper">
      <div className="term-section">
        <h3>Privacy Policy</h3>
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
            parties only. This Privacy Policy sets out the manner in which
            MessageMoment collects, stores, uses, and protects the information
            provided by its users.
          </p>
          {/* condition */}

          {/* 2. Information Collection and Use */}
          <h4>2. Information Collection and Use</h4>
          <p className=" small sub-text">
            MessageMoment collects certain meta data when you use our platform
            however, we do not collect any personally identifiable information.
          </p>
          {/* 3. Data Storage and Protection */}
          <h4>3. Data Storage and Protection</h4>
          <p className=" small sub-text">
            MessageMoment takes the security of user data very seriously and has
            implemented appropriate technical and organizational measures to
            protect user data against unauthorized access, alteration,
            disclosure, or destruction.
          </p>

          {/* 4. Disclosure of Information */}
          <h4>4. Disclosure of Information</h4>
          <p className=" small sub-text">
            MessageMoment will not sell, trade, or otherwise transfer your
            personal information to any third party except as required by law.
          </p>

          {/*5. Amendments to this Privacy Policy*/}
          <h4>5. Amendments to this Privacy Policy</h4>
          <p className=" small sub-text">
            MessageMoment reserves the right to update this Privacy Policy at
            any time and will notify users of any changes through the platform.
          </p>

          {/* 6. Contact Us*/}
          <h4>6. Contact Us</h4>
          <p className=" small sub-text">
            If you have any questions regarding this Privacy Policy, please{" "}
            <span>
              <a href="/contact-us">Contact Us</a>
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyBody;
