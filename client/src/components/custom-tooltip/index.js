import React from "react";

import "./custom-tooltip.scss";

const CustomTooltip = ({ children = "Live Typing Effect On/Off", visible }) => (
  <div className={`custom-tooltip${visible ? " visible" : ""}`}>
    {children}
    <span className="custom-tooltip-arrow" />
  </div>
);

export default CustomTooltip;
