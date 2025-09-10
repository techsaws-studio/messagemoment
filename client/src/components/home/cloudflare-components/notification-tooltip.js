import React, { Fragment } from "react";

const NotificationTooltip = ({ notificationtype, isVisible }) => {
  return (
    <Fragment>
      {isVisible && (
        <div
          className={`notification-tooltip ${
            isVisible ? "fade-in" : "fade-out"
          }`}
        >
          <p className="medium">
            {notificationtype == "reg"
              ? "Regenerated"
              : "Link copied to clipboard"}
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default NotificationTooltip;
