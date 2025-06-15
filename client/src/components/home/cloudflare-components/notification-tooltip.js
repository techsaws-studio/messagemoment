import React from "react";
const NotificationTooltip = ({ notificationtype, isVisible }) => {
  return (
    <>
      {
        isVisible && ( <div
          className={`notification-tooltip ${isVisible ? "fade-in" : "fade-out"}`}
        >
          <p className="medium">
            {notificationtype == "reg"
              ? "Regenerated"
              : "Link copied to clipboard"}
          </p>
        </div>)
      }
    </>
  );
};

export default NotificationTooltip;
