import React from "react";
import Image from "next/image";

import dropdownIcon from "../../src/assets/icons/dropdown.svg";
import globe from "../../src/assets/icons/globe.svg";

const DummySelect = () => {
  return (
    <div>
      <div className="dummy-select">
        <Image src={globe} alt="lock" />
        <p>Standard</p>
        <Image className="dummy-arrow" src={dropdownIcon} alt="lock" />
      </div>
    </div>
  );
};

export default DummySelect;
