import React from "react";

export const Skeleton = ({
  className = "",
  width = "100%",
  height = "1rem",
  variant = "text",
}) => {
  const baseClasses = "skeleton skeleton-pulse";
  const variantClasses = {
    text: "skeleton-rounded",
    rectangular: "skeleton-rounded-md",
    circular: "skeleton-rounded-full",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
};
